from datetime import datetime
from decimal import Decimal
from database import db
from services import split as split_service

def create_expense(trip_id: int, paid_by: int, description: str, 
                   amount: Decimal, category: str, split_type: str,
                   splits: list, date: datetime = None, notes: str = None) -> dict:
    
    # Validate splits total equals amount - with tolerance for floating point
    # Replace strict equality check with tolerance
    split_total = sum(s['share_amount'] for s in splits)
    if abs(float(split_total) - float(amount)) > 0.02:
        raise Exception(f"Split total {split_total} does not equal expense amount {amount}")
    # Insert expense
    if not date:
        date = datetime.utcnow()
    
    result = db.execute(
        """INSERT INTO expenses (trip_id, paid_by, description, amount, category, 
                                date, notes, split_type, created_at)
           VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
           RETURNING id""",
        (trip_id, paid_by, description, amount, category, date, notes, split_type, datetime.utcnow())
    )
    
    expense_id = result[0]['id'] if result else None
    
    if not expense_id:
        raise Exception("Failed to create expense")
    
    # Insert splits
    for split in splits:
        db.execute(
            """INSERT INTO expense_splits (expense_id, member_id, share_amount, split_type, split_value)
               VALUES (%s, %s, %s, %s, %s)""",
            (expense_id, split['member_id'], split['share_amount'], 
             split.get('split_type', split_type), split.get('split_value', None))
        )
    
    # Get the complete expense
    return get_expense_by_id(expense_id)

def get_expense_by_id(expense_id: int) -> dict:
    """Get expense with splits"""
    expense = db.execute_one(
        """SELECT e.*, u.name as payer_name
           FROM expenses e
           JOIN users u ON e.paid_by = u.id
           WHERE e.id = %s""",
        (expense_id,)
    )
    
    if not expense:
        return None
    
    # Get splits
    splits = db.execute(
        """SELECT es.*, m.user_id, u.name as member_name
           FROM expense_splits es
           JOIN members m ON es.member_id = m.id
           JOIN users u ON m.user_id = u.id
           WHERE es.expense_id = %s""",
        (expense_id,)
    )
    
    expense['splits'] = splits
    return expense

def get_trip_expenses(trip_id: int, category: str = None, 
                      member_id: int = None, limit: int = 100, offset: int = 0) -> list:
    """Get all expenses for a trip with filters"""
    
    query = """SELECT e.*, u.name as payer_name
               FROM expenses e
               JOIN users u ON e.paid_by = u.id
               WHERE e.trip_id = %s"""
    params = [trip_id]
    
    if category:
        query += " AND e.category = %s"
        params.append(category)
    
    if member_id:
        query += """ AND e.id IN (
            SELECT expense_id FROM expense_splits WHERE member_id = %s
        )"""
        params.append(member_id)
    
    query += " ORDER BY e.date DESC LIMIT %s OFFSET %s"
    params.extend([limit, offset])
    
    result = db.execute(query, tuple(params))
    
    # Get splits for each expense
    for expense in result:
        splits = db.execute(
            """SELECT es.*, m.user_id, u.name as member_name
               FROM expense_splits es
               JOIN members m ON es.member_id = m.id
               JOIN users u ON m.user_id = u.id
               WHERE es.expense_id = %s""",
            (expense['id'],)
        )
        expense['splits'] = splits
    
    return result

def update_expense(expense_id: int, data: dict) -> dict:
    """Update an expense and its splits"""
    
    fields = []
    values = []
    
    if 'description' in data and data['description']:
        fields.append("description = %s")
        values.append(data['description'])
    
    if 'amount' in data and data['amount']:
        fields.append("amount = %s")
        values.append(data['amount'])
    
    if 'category' in data and data['category']:
        fields.append("category = %s")
        values.append(data['category'])
    
    if 'date' in data and data['date']:
        fields.append("date = %s")
        values.append(data['date'])
    
    if 'notes' in data:
        fields.append("notes = %s")
        values.append(data['notes'])
    
    if 'receipt_url' in data:
        fields.append("receipt_url = %s")
        values.append(data['receipt_url'])
    
    if not fields:
        return get_expense_by_id(expense_id)
    
    fields.append("updated_at = %s")
    values.append(datetime.utcnow())
    values.append(expense_id)
    
    db.execute(
        f"UPDATE expenses SET {', '.join(fields)} WHERE id = %s",
        tuple(values)
    )
    
    # Update splits if provided
    if 'splits' in data and data['splits']:
        # Delete old splits
        db.execute(
            "DELETE FROM expense_splits WHERE expense_id = %s",
            (expense_id,)
        )
        
        # Insert new splits
        for split in data['splits']:
            db.execute(
                """INSERT INTO expense_splits (expense_id, member_id, share_amount, split_type, split_value)
                   VALUES (%s, %s, %s, %s, %s)""",
                (expense_id, split['member_id'], split['share_amount'],
                 split.get('split_type', 'equal'), split.get('split_value', None))
            )
    
    return get_expense_by_id(expense_id)

def delete_expense(expense_id: int) -> bool:
    """Delete an expense (splits cascade delete)"""
    result = db.execute(
        "DELETE FROM expenses WHERE id = %s RETURNING id",
        (expense_id,)
    )
    return bool(result)

def get_expense_categories() -> list:
    """Get all expense categories"""
    return [
        {'id': 'food', 'name': 'Food & Dining', 'icon': '🍽️'},
        {'id': 'transport', 'name': 'Transportation', 'icon': '🚗'},
        {'id': 'accommodation', 'name': 'Accommodation', 'icon': '🏨'},
        {'id': 'activities', 'name': 'Activities', 'icon': '🎯'},
        {'id': 'shopping', 'name': 'Shopping', 'icon': '🛍️'},
        {'id': 'other', 'name': 'Other', 'icon': '📌'}
    ]

def get_member_expense_summary(trip_id: int, member_id: int) -> dict:
    """Get expense summary for a specific member"""
    
    # Total paid
    paid = db.execute_one(
        "SELECT COALESCE(SUM(amount), 0) as total FROM expenses WHERE trip_id = %s AND paid_by = %s",
        (trip_id, member_id)
    )
    
    # Total owed from splits
    owes = db.execute_one(
        """SELECT COALESCE(SUM(es.share_amount), 0) as total
           FROM expense_splits es
           JOIN expenses e ON es.expense_id = e.id
           WHERE e.trip_id = %s AND es.member_id = %s""",
        (trip_id, member_id)
    )
    
    # Expense count
    count = db.execute_one(
        "SELECT COUNT(*) as count FROM expenses WHERE trip_id = %s AND paid_by = %s",
        (trip_id, member_id)
    )
    
    return {
        'total_paid': float(paid['total']) if paid else 0,
        'total_owes': float(owes['total']) if owes else 0,
        'balance': float(paid['total'] - owes['total']) if paid and owes else 0,
        'expense_count': count['count'] if count else 0
    }

def add_comment_to_expense(expense_id: int, user_id: int, member_id: int, text: str) -> dict:
    """Add a comment to an expense"""
    result = db.execute(
        """INSERT INTO comments (expense_id, user_id, member_id, text, created_at)
           VALUES (%s, %s, %s, %s, %s)
           RETURNING id, expense_id, user_id, member_id, text, created_at""",
        (expense_id, user_id, member_id, text, datetime.utcnow())
    )
    return result[0] if result else None

def get_expense_comments(expense_id: int) -> list:
    """Get all comments for an expense"""
    result = db.execute(
        """SELECT c.*, u.name as user_name, u.avatar_url
           FROM comments c
           JOIN users u ON c.user_id = u.id
           WHERE c.expense_id = %s
           ORDER BY c.created_at DESC""",
        (expense_id,)
    )
    return result