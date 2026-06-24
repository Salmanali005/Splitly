from database import db
from datetime import datetime

def get_user_invitations(user_id: int) -> list:
    """Get all pending invitations for a user"""
    result = db.execute(
        """SELECT i.*, 
                  t.name as trip_name, 
                  t.destination,
                  u.name as inviter_name
           FROM invitations i
           JOIN trips t ON i.trip_id = t.id
           JOIN users u ON i.inviter_id = u.id
           WHERE i.email = (SELECT email FROM users WHERE id = %s)
           AND i.status = 'pending'
           AND i.expires_at > %s
           ORDER BY i.created_at DESC""",
        (user_id, datetime.utcnow())
    )
    return result

def accept_invitation(token: str, user_id: int) -> dict:
    """Accept an invitation and join the trip"""
    # Get user email
    user = db.execute_one(
        "SELECT email FROM users WHERE id = %s",
        (user_id,)
    )
    if not user:
        raise Exception("User not found")
    
    # Get invitation
    invitation = db.execute_one(
        "SELECT * FROM invitations WHERE token = %s AND status = 'pending'",
        (token,)
    )
    
    if not invitation:
        raise Exception("Invalid invitation")
    
    if invitation['email'] != user['email']:
        raise Exception("This invitation is for a different email")
    
    if invitation['expires_at'] < datetime.utcnow():
        raise Exception("Invitation expired")
    
    # Check if already a member
    existing = db.execute_one(
        "SELECT id FROM members WHERE trip_id = %s AND user_id = %s",
        (invitation['trip_id'], user_id)
    )
    
    if existing:
        raise Exception("You are already a member of this trip")
    
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

def decline_invitation(token: str) -> bool:
    """Decline an invitation"""
    result = db.execute(
        "UPDATE invitations SET status = 'cancelled' WHERE token = %s AND status = 'pending' RETURNING id",
        (token,)
    )
    return bool(result)

    