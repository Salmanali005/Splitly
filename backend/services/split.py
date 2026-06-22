from decimal import Decimal
from typing import List, Dict

def calculate_equal_split(amount: Decimal, member_ids: List[int]) -> List[Dict]:
    """Calculate equal split among members"""
    share = amount / len(member_ids)
    return [
        {
            'member_id': member_id,
            'share_amount': share,
            'split_type': 'equal',
            'split_value': None
        }
        for member_id in member_ids
    ]

def calculate_custom_split(amount: Decimal, splits: List[Dict]) -> List[Dict]:
    """
    Calculate custom split with exact amounts per member.
    
    splits: [{'member_id': 1, 'amount': 25.50}, {'member_id': 2, 'amount': 30.00}]
    """
    total = sum(s['amount'] for s in splits)
    if total != amount:
        raise Exception(f"Split total {total} does not match expense amount {amount}")
    
    return [
        {
            'member_id': s['member_id'],
            'share_amount': s['amount'],
            'split_type': 'custom',
            'split_value': None
        }
        for s in splits
    ]

def calculate_percentage_split(amount: Decimal, splits: List[Dict]) -> List[Dict]:
    """
    Calculate percentage split.
    
    splits: [{'member_id': 1, 'percentage': 50}, {'member_id': 2, 'percentage': 50}]
    """
    total_percentage = sum(s['percentage'] for s in splits)
    if total_percentage != 100:
        raise Exception(f"Total percentage {total_percentage} does not equal 100")
    
    return [
        {
            'member_id': s['member_id'],
            'share_amount': (amount * Decimal(str(s['percentage']))) / 100,
            'split_type': 'percentage',
            'split_value': s['percentage']
        }
        for s in splits
    ]

def calculate_shares_split(amount: Decimal, splits: List[Dict]) -> List[Dict]:
    """
    Calculate shares split (each person pays based on their share count).
    
    splits: [{'member_id': 1, 'shares': 2}, {'member_id': 2, 'shares': 3}]
    Total shares = 5, so member 1 pays 2/5 of amount, member 2 pays 3/5
    """
    total_shares = sum(s['shares'] for s in splits)
    if total_shares <= 0:
        raise Exception("Total shares must be greater than 0")
    
    return [
        {
            'member_id': s['member_id'],
            'share_amount': (amount * Decimal(str(s['shares']))) / Decimal(str(total_shares)),
            'split_type': 'shares',
            'split_value': s['shares']
        }
        for s in splits
    ]

def validate_splits(splits: List[Dict], amount: Decimal, split_type: str) -> bool:
    """Validate that splits are correct"""
    if not splits:
        return False
    
    total = sum(s['share_amount'] for s in splits)
    return total == amount