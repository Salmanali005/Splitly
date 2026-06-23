from datetime import datetime
import secrets
from database import db


def create_trip(user_id: int, name: str, destination: str = None, 
                start_date: datetime = None, end_date: datetime = None,
                currency: str = "USD", notes: str = None) -> dict:
    # Insert trip
    result = db.execute(
        """INSERT INTO trips (name, destination, start_date, end_date, currency, notes, created_by, created_at)
           VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
           RETURNING id, name, destination, start_date, end_date, currency, notes, status, created_by, created_at""",
        (name, destination, start_date, end_date, currency, notes, user_id, datetime.utcnow())
    )
    
    trip = result[0] if result else None
    
    # Add creator as admin member
    if trip:
        db.execute(
            """INSERT INTO members (trip_id, user_id, role, joined_at)
               VALUES (%s, %s, 'admin', %s)""",
            (trip['id'], user_id, datetime.utcnow())
        )
    
    return trip

def get_trip_by_id(trip_id: int) -> dict:
    result = db.execute(
        """SELECT id, name, destination, start_date, end_date, currency, status, 
                  cover_image, notes, created_by, created_at, updated_at
           FROM trips WHERE id = %s""",
        (trip_id,)
    )
    return result[0] if result else None

def get_user_trips(user_id: int, status: str = None, limit: int = 50, offset: int = 0) -> list:
    result = db.execute(
        """SELECT t.*, 
                  (SELECT COUNT(*) FROM members WHERE trip_id = t.id AND is_active = true) as member_count,
                  (SELECT COUNT(*) FROM expenses WHERE trip_id = t.id) as expense_count,
                  (SELECT COALESCE(SUM(amount), 0) FROM expenses WHERE trip_id = t.id) as total_expenses
           FROM trips t
           JOIN members m ON t.id = m.trip_id
           WHERE m.user_id = %s
           AND (%s IS NULL OR t.status = %s)
           AND m.is_active = true
           ORDER BY t.created_at DESC
           LIMIT %s OFFSET %s""",
        (user_id, status, status, limit, offset)
    )
    return result

def get_trip_details(trip_id: int) -> dict:
    # Get trip info
    trip = get_trip_by_id(trip_id)
    if not trip:
        return None
    
    # Get members
    members = db.execute(
        """SELECT m.id as member_id, m.user_id, m.role, m.nickname, m.joined_at,
                  u.name, u.email, u.avatar_url
           FROM members m
           JOIN users u ON m.user_id = u.id
           WHERE m.trip_id = %s AND m.is_active = true""",
        (trip_id,)
    )
    
    # Get expenses
    expenses = db.execute(
        """SELECT e.*, u.name as payer_name
           FROM expenses e
           JOIN users u ON e.paid_by = u.id
           WHERE e.trip_id = %s
           ORDER BY e.date DESC""",
        (trip_id,)
    )
    
    # Get splits for each expense
    for expense in expenses:
        splits = db.execute(
            """SELECT es.*, u.name as member_name
               FROM expense_splits es
               JOIN members m ON es.member_id = m.id
               JOIN users u ON m.user_id = u.id
               WHERE es.expense_id = %s""",
            (expense['id'],)
        )
        expense['splits'] = splits
    
    trip['members'] = members
    trip['expenses'] = expenses
    
    return trip

def update_trip(trip_id: int, data: dict) -> dict:
    fields = []
    values = []
    
    if 'name' in data and data['name']:
        fields.append("name = %s")
        values.append(data['name'])
    
    if 'destination' in data:
        fields.append("destination = %s")
        values.append(data['destination'])
    
    if 'start_date' in data:
        fields.append("start_date = %s")
        values.append(data['start_date'])
    
    if 'end_date' in data:
        fields.append("end_date = %s")
        values.append(data['end_date'])
    
    if 'currency' in data and data['currency']:
        fields.append("currency = %s")
        values.append(data['currency'])
    
    if 'status' in data and data['status']:
        fields.append("status = %s")
        values.append(data['status'])
    
    if 'cover_image' in data:
        fields.append("cover_image = %s")
        values.append(data['cover_image'])
    
    if 'notes' in data:
        fields.append("notes = %s")
        values.append(data['notes'])
    
    if not fields:
        return get_trip_by_id(trip_id)
    
    fields.append("updated_at = %s")
    values.append(datetime.utcnow())
    values.append(trip_id)
    
    result = db.execute(
        f"UPDATE trips SET {', '.join(fields)} WHERE id = %s RETURNING *",
        tuple(values)
    )
    
    return result[0] if result else None

def delete_trip(trip_id: int) -> bool:
    result = db.execute(
        "DELETE FROM trips WHERE id = %s RETURNING id",
        (trip_id,)
    )
    return bool(result)

def change_trip_status(trip_id: int, status: str) -> dict:
    result = db.execute(
        """UPDATE trips 
           SET status = %s, updated_at = %s 
           WHERE id = %s 
           RETURNING id, name, status""",
        (status, datetime.utcnow(), trip_id)
    )
    return result[0] if result else None

# ============ TRIP STATISTICS ============

def get_trip_statistics(trip_id: int) -> dict:
    # Total spent
    total = db.execute_one(
        "SELECT COALESCE(SUM(amount), 0) as total FROM expenses WHERE trip_id = %s",
        (trip_id,)
    )
    
    # Expense count
    count = db.execute_one(
        "SELECT COUNT(*) as count FROM expenses WHERE trip_id = %s",
        (trip_id,)
    )
    
    # Member count
    members = db.execute_one(
        "SELECT COUNT(*) as count FROM members WHERE trip_id = %s AND is_active = true",
        (trip_id,)
    )
    
    # Category breakdown
    categories = db.execute(
        """SELECT category, COUNT(*) as count, COALESCE(SUM(amount), 0) as total
           FROM expenses 
           WHERE trip_id = %s 
           GROUP BY category
           ORDER BY total DESC""",
        (trip_id,)
    )
    
    # Top spenders
    spenders = db.execute(
        """SELECT u.id, u.name, COALESCE(SUM(e.amount), 0) as total_paid
           FROM expenses e
           JOIN users u ON e.paid_by = u.id
           WHERE e.trip_id = %s
           GROUP BY u.id, u.name
           ORDER BY total_paid DESC
           LIMIT 5""",
        (trip_id,)
    )
    
    return {
        'total_spent': total['total'] if total else 0,
        'expense_count': count['count'] if count else 0,
        'member_count': members['count'] if members else 0,
        'categories': categories,
        'top_spenders': spenders
    }

def get_trip_member_balances(trip_id: int) -> list:
    # Get all active members
    members = db.execute(
        """SELECT m.id as member_id, m.user_id, u.name, u.email
           FROM members m
           JOIN users u ON m.user_id = u.id
           WHERE m.trip_id = %s AND m.is_active = true""",
        (trip_id,)
    )
    
    balances = []
    
    for member in members:
        # Total paid by this member
        paid = db.execute_one(
            "SELECT COALESCE(SUM(amount), 0) as total FROM expenses WHERE trip_id = %s AND paid_by = %s",
            (trip_id, member['user_id'])
        )
        
        # Total owed (their share from splits)
        owes = db.execute_one(
            """SELECT COALESCE(SUM(es.share_amount), 0) as total
               FROM expense_splits es
               JOIN expenses e ON es.expense_id = e.id
               WHERE e.trip_id = %s AND es.member_id = %s""",
            (trip_id, member['member_id'])
        )
        
        paid_total = paid['total'] if paid else 0
        owes_total = owes['total'] if owes else 0
        
        balances.append({
            'member_id': member['member_id'],
            'user_id': member['user_id'],
            'name': member['name'],
            'email': member['email'],
            'paid': float(paid_total),
            'owes': float(owes_total),
            'balance': float(paid_total - owes_total)  # Positive = owed to, Negative = owes
        })
    
    return balances

def get_trip_settlements(trip_id: int) -> list:
    result = db.execute(
        """SELECT s.*, 
                  u1.name as from_name, u2.name as to_name
           FROM settlements s
           JOIN members m1 ON s.from_member_id = m1.id
           JOIN users u1 ON m1.user_id = u1.id
           JOIN members m2 ON s.to_member_id = m2.id
           JOIN users u2 ON m2.user_id = u2.id
           WHERE s.trip_id = %s
           ORDER BY s.created_at DESC""",
        (trip_id,)
    )
    return result

# ============ TRIP INVITATIONS ============

def create_invitation(trip_id: int, email: str, inviter_id: int, expires_in_hours: int = 48) -> dict:
    # Check if already invited
    existing = db.execute_one(
        "SELECT id FROM invitations WHERE trip_id = %s AND email = %s AND status = 'pending'",
        (trip_id, email)
    )
    
    if existing:
        raise Exception("User already invited to this trip")
    
    # Generate unique token
    token = secrets.token_urlsafe(32)
    expires_at = datetime.utcnow()
    from datetime import timedelta
    expires_at = expires_at + timedelta(hours=expires_in_hours)
    
    result = db.execute(
        """INSERT INTO invitations (trip_id, email, inviter_id, token, expires_at, created_at)
           VALUES (%s, %s, %s, %s, %s, %s)
           RETURNING id, trip_id, email, token, expires_at, status""",
        (trip_id, email, inviter_id, token, expires_at, datetime.utcnow())
    )
    
    return result[0] if result else None

def accept_invitation(token: str, user_id: int) -> dict:
    # Get invitation
    invitation = db.execute_one(
        "SELECT trip_id, email, expires_at, status FROM invitations WHERE token = %s",
        (token,)
    )
    
    if not invitation:
        raise Exception("Invalid invitation token")
    
    if invitation['expires_at'] < datetime.utcnow():
        raise Exception("Invitation expired")
    
    if invitation['status'] != 'pending':
        raise Exception("Invitation already used")
    
    # Check if user is already a member
    existing = db.execute_one(
        "SELECT id FROM members WHERE trip_id = %s AND user_id = %s",
        (invitation['trip_id'], user_id)
    )
    
    if existing:
        raise Exception("User is already a member of this trip")
    
    # Add user as member
    db.execute(
        """INSERT INTO members (trip_id, user_id, role, joined_at)
           VALUES (%s, %s, 'viewer', %s)""",
        (invitation['trip_id'], user_id, datetime.utcnow())
    )
    
    # Update invitation
    db.execute(
        "UPDATE invitations SET status = 'accepted' WHERE token = %s",
        (token,)
    )
    
    # Get trip info
    trip = db.execute_one(
        "SELECT id, name, destination FROM trips WHERE id = %s",
        (invitation['trip_id'],)
    )
    
    return trip

def get_trip_invitations(trip_id: int) -> list:
    result = db.execute(
        """SELECT i.*, u.name as inviter_name
           FROM invitations i
           JOIN users u ON i.inviter_id = u.id
           WHERE i.trip_id = %s
           ORDER BY i.created_at DESC""",
        (trip_id,)
    )
    return result

def cancel_invitation(invitation_id: int) -> bool:
    result = db.execute(
        "UPDATE invitations SET status = 'cancelled' WHERE id = %s AND status = 'pending' RETURNING id",
        (invitation_id,)
    )
    return bool(result)

# ============ TRIP VISIBILITY ============

def is_user_in_trip(user_id: int, trip_id: int) -> bool:
    result = db.execute_one(
        "SELECT id FROM members WHERE trip_id = %s AND user_id = %s AND is_active = true",
        (trip_id, user_id)
    )
    return bool(result)

def is_user_trip_admin(user_id: int, trip_id: int) -> bool:
    result = db.execute_one(
        "SELECT id FROM members WHERE trip_id = %s AND user_id = %s AND role = 'admin' AND is_active = true",
        (trip_id, user_id)
    )
    return bool(result)

def get_trip_members(trip_id: int) -> list:
    result = db.execute(
        """SELECT m.*, u.name, u.email, u.avatar_url
           FROM members m
           JOIN users u ON m.user_id = u.id
           WHERE m.trip_id = %s AND m.is_active = true""",
        (trip_id,)
    )
    return result

def remove_member_from_trip(trip_id: int, member_id: int) -> bool:
    # Check if user is admin of trip (can't remove yourself if you're the only admin)
    member = db.execute_one(
        "SELECT user_id, role FROM members WHERE id = %s AND trip_id = %s",
        (member_id, trip_id)
    )
    
    if not member:
        return False
    
    # If admin, check if they're the last admin
    if member['role'] == 'admin':
        admins = db.execute_one(
            "SELECT COUNT(*) as count FROM members WHERE trip_id = %s AND role = 'admin' AND is_active = true",
            (trip_id,)
        )
        if admins and admins['count'] <= 1:
            raise Exception("Cannot remove the last admin. Transfer admin role first.")
    
    result = db.execute(
        "UPDATE members SET is_active = false WHERE id = %s AND trip_id = %s RETURNING id",
        (member_id, trip_id)
    )
    return bool(result)

def update_member_role(trip_id: int, member_id: int, role: str) -> dict:
    result = db.execute(
        "UPDATE members SET role = %s WHERE id = %s AND trip_id = %s RETURNING *",
        (role, member_id, trip_id)
    )
    return result[0] if result else None