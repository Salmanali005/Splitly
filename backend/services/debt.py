from decimal import Decimal
from typing import List, Dict, Tuple
from collections import defaultdict
from database import db

def calculate_balances(trip_id: int) -> Dict[int, Decimal]:
    """Calculate net balance for each member in a trip.
    
    Positive balance = member is owed money (should receive)
    Negative balance = member owes money (should pay)
    """
    # Get all members
    members = db.execute(
        "SELECT id, user_id FROM members WHERE trip_id = %s AND is_active = true",
        (trip_id,)
    )
    
    balances = defaultdict(Decimal)
    
    for member in members:
        member_id = member['id']
        user_id = member['user_id']
        
        # Total amount this member paid
        paid_result = db.execute_one(
            "SELECT COALESCE(SUM(amount), 0) as total FROM expenses WHERE trip_id = %s AND paid_by = %s",
            (trip_id, user_id)
        )
        paid = Decimal(str(paid_result['total'])) if paid_result else Decimal('0')
        
        # Total amount this member owes (their share from splits)
        owes_result = db.execute_one(
            """SELECT COALESCE(SUM(es.share_amount), 0) as total
               FROM expense_splits es
               JOIN expenses e ON es.expense_id = e.id
               WHERE e.trip_id = %s AND es.member_id = %s""",
            (trip_id, member_id)
        )
        owes = Decimal(str(owes_result['total'])) if owes_result else Decimal('0')
        
        # Net balance: positive = owed to, negative = owes
        balances[member_id] = paid - owes
    
    return dict(balances)

def get_member_details(trip_id: int) -> Dict[int, Dict]:
    """Get details for all members in a trip"""
    members = db.execute(
        """SELECT m.id as member_id, m.user_id, u.name, u.email
           FROM members m
           JOIN users u ON m.user_id = u.id
           WHERE m.trip_id = %s AND m.is_active = true""",
        (trip_id,)
    )
    
    return {
        member['member_id']: {
            'member_id': member['member_id'],
            'user_id': member['user_id'],
            'name': member['name'],
            'email': member['email']
        }
        for member in members
    }

def get_simplified_debts(trip_id: int) -> List[Dict]:
    """Get simplified debts (minimum transactions) using greedy algorithm"""
    
    # Get balances
    balances = calculate_balances(trip_id)
    
    # Get member details
    member_details = get_member_details(trip_id)
    
    # Separate creditors (positive balance) and debtors (negative balance)
    creditors = []  # [(member_id, amount)]
    debtors = []    # [(member_id, amount)]
    
    for member_id, balance in balances.items():
        if balance > 0:
            creditors.append((member_id, balance))
        elif balance < 0:
            debtors.append((member_id, abs(balance)))
    
    # If no debts, return empty list
    if not creditors or not debtors:
        return []
    
    # Greedy algorithm: match debtors to creditors
    transactions = []
    i, j = 0, 0
    
    while i < len(debtors) and j < len(creditors):
        debtor_id, debt_amount = debtors[i]
        creditor_id, credit_amount = creditors[j]
        
        # Calculate settlement amount
        settlement = min(debt_amount, credit_amount)
        
        # Create transaction
        transactions.append({
            'from_member_id': debtor_id,
            'from_name': member_details.get(debtor_id, {}).get('name', 'Unknown'),
            'to_member_id': creditor_id,
            'to_name': member_details.get(creditor_id, {}).get('name', 'Unknown'),
            'amount': settlement
        })
        
        # Update remaining amounts
        debtors[i] = (debtor_id, debt_amount - settlement)
        creditors[j] = (creditor_id, credit_amount - settlement)
        
        # Move to next if settled
        if debtors[i][1] == 0:
            i += 1
        if creditors[j][1] == 0:
            j += 1
    
    return transactions

def get_owes_summary(trip_id: int, member_id: int) -> Dict:
    """Get summary of what a member owes and is owed"""
    
    # Get all simplified debts
    debts = get_simplified_debts(trip_id)
    
    owes_to = []   # People this member owes money to
    owed_by = []   # People who owe money to this member
    
    for debt in debts:
        if debt['from_member_id'] == member_id:
            owes_to.append({
                'to_member_id': debt['to_member_id'],
                'to_name': debt['to_name'],
                'amount': debt['amount']
            })
        elif debt['to_member_id'] == member_id:
            owed_by.append({
                'from_member_id': debt['from_member_id'],
                'from_name': debt['from_name'],
                'amount': debt['amount']
            })
    
    # Calculate net balance for this member
    balance = calculate_balances(trip_id).get(member_id, Decimal('0'))
    
    return {
        'member_id': member_id,
        'net_balance': balance,  # Positive = owed to, Negative = owes
        'owes_to': owes_to,      # Who they need to pay
        'owed_by': owed_by       # Who needs to pay them
    }

def get_settlement_suggestion(trip_id: int, member_id: int) -> List[Dict]:
    """Get settlement suggestions for a specific member"""
    
    summary = get_owes_summary(trip_id, member_id)
    
    suggestions = []
    
    # If member is owed money, suggest who should pay them
    if summary['owed_by']:
        for owed in summary['owed_by']:
            suggestions.append({
                'action': 'receive',
                'from_member_id': owed['from_member_id'],
                'from_name': owed['from_name'],
                'amount': owed['amount'],
                'message': f"{owed['from_name']} owes you ${owed['amount']}"
            })
    
    # If member owes money, suggest who they should pay
    if summary['owes_to']:
        for owes in summary['owes_to']:
            suggestions.append({
                'action': 'pay',
                'to_member_id': owes['to_member_id'],
                'to_name': owes['to_name'],
                'amount': owes['amount'],
                'message': f"You owe {owes['to_name']} ${owes['amount']}"
            })
    
    return suggestions

def create_settlement(trip_id: int, from_member_id: int, to_member_id: int, 
                      amount: Decimal, notes: str = None) -> Dict:
    """Record a settlement between two members"""
    
    # Validate members exist in trip
    from_member = db.execute_one(
        "SELECT id FROM members WHERE id = %s AND trip_id = %s AND is_active = true",
        (from_member_id, trip_id)
    )
    to_member = db.execute_one(
        "SELECT id FROM members WHERE id = %s AND trip_id = %s AND is_active = true",
        (to_member_id, trip_id)
    )
    
    if not from_member or not to_member:
        raise Exception("One or both members not found in trip")
    
    if from_member_id == to_member_id:
        raise Exception("Cannot settle with yourself")
    
    if amount <= 0:
        raise Exception("Amount must be greater than 0")
    
    # Create settlement
    result = db.execute(
        """INSERT INTO settlements (trip_id, from_member_id, to_member_id, amount, notes, created_at)
           VALUES (%s, %s, %s, %s, %s, %s)
           RETURNING id, trip_id, from_member_id, to_member_id, amount, notes, status, created_at""",
        (trip_id, from_member_id, to_member_id, amount, notes, datetime.utcnow())
    )
    
    return result[0] if result else None

def mark_settlement_paid(settlement_id: int) -> Dict:
    """Mark a settlement as paid"""
    
    result = db.execute(
        """UPDATE settlements 
           SET status = 'paid', settled_at = %s 
           WHERE id = %s AND status = 'pending'
           RETURNING id, trip_id, from_member_id, to_member_id, amount, status, settled_at""",
        (datetime.utcnow(), settlement_id)
    )
    
    if not result:
        raise Exception("Settlement not found or already paid")
    
    return result[0]

def get_settlement_history(trip_id: int) -> List[Dict]:
    """Get all settlements for a trip with member names"""
    
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

def get_pending_settlements(trip_id: int) -> List[Dict]:
    """Get all pending settlements for a trip"""
    
    result = db.execute(
        """SELECT s.*, 
                  u1.name as from_name, u2.name as to_name
           FROM settlements s
           JOIN members m1 ON s.from_member_id = m1.id
           JOIN users u1 ON m1.user_id = u1.id
           JOIN members m2 ON s.to_member_id = m2.id
           JOIN users u2 ON m2.user_id = u2.id
           WHERE s.trip_id = %s AND s.status = 'pending'
           ORDER BY s.created_at DESC""",
        (trip_id,)
    )
    return result

def calculate_trip_balance_summary(trip_id: int) -> Dict:
    """Get complete balance summary for a trip"""
    
    balances = calculate_balances(trip_id)
    member_details = get_member_details(trip_id)
    simplified_debts = get_simplified_debts(trip_id)
    
    # Calculate totals
    total_paid = Decimal('0')
    total_owed = Decimal('0')
    
    for member_id, balance in balances.items():
        if balance > 0:
            total_owed += balance
        elif balance < 0:
            total_paid += abs(balance)
    
    # Build member balances list
    member_balances = []
    for member_id, balance in balances.items():
        details = member_details.get(member_id, {})
        member_balances.append({
            'member_id': member_id,
            'user_id': details.get('user_id'),
            'name': details.get('name', 'Unknown'),
            'email': details.get('email'),
            'balance': balance  # Positive = owed to, Negative = owes
        })
    
    return {
        'trip_id': trip_id,
        'total_expenses': total_paid,
        'total_settlements': total_owed,
        'member_balances': member_balances,
        'simplified_debts': simplified_debts,
        'settlement_count': len(simplified_debts)
    }

def settle_all_debts(trip_id: int) -> List[Dict]:
    """Automatically create settlements for all simplified debts"""
    
    debts = get_simplified_debts(trip_id)
    settlements = []
    
    for debt in debts:
        settlement = create_settlement(
            trip_id=trip_id,
            from_member_id=debt['from_member_id'],
            to_member_id=debt['to_member_id'],
            amount=debt['amount'],
            notes="Auto-settled from debt simplification"
        )
        if settlement:
            settlements.append(settlement)
    
    return settlements

def is_trip_settled(trip_id: int) -> bool:
    """Check if all debts in a trip are settled"""
    
    balances = calculate_balances(trip_id)
    
    # Check if any balance is non-zero (with tolerance)
    tolerance = Decimal('0.01')
    for balance in balances.values():
        if abs(balance) > tolerance:
            return False
    
    return True

def get_settlement_statistics(trip_id: int) -> Dict:
    """Get statistics about settlements in a trip"""
    
    # Total settlements
    total = db.execute_one(
        "SELECT COUNT(*) as count FROM settlements WHERE trip_id = %s",
        (trip_id,)
    )
    
    # Pending settlements
    pending = db.execute_one(
        "SELECT COUNT(*) as count FROM settlements WHERE trip_id = %s AND status = 'pending'",
        (trip_id,)
    )
    
    # Total amount settled
    settled_amount = db.execute_one(
        "SELECT COALESCE(SUM(amount), 0) as total FROM settlements WHERE trip_id = %s AND status = 'paid'",
        (trip_id,)
    )
    
    return {
        'total_settlements': total['count'] if total else 0,
        'pending_settlements': pending['count'] if pending else 0,
        'total_amount_settled': float(settled_amount['total']) if settled_amount else 0,
        'is_fully_settled': is_trip_settled(trip_id)
    }