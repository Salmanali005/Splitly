import bcrypt
import jwt
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv
from database import db

load_dotenv()

SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key-here')
ALGORITHM = os.getenv('ALGORITHM', 'HS256')
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv('ACCESS_TOKEN_EXPIRE_MINUTES', 30))
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv('REFRESH_TOKEN_EXPIRE_DAYS', 7))

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_access_token(user_id: int, email: str) -> str:
    payload = {
        'sub': str(user_id),
        'email': email,
        'type': 'access',
        'exp': datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def create_refresh_token(user_id: int, email: str) -> str:
    payload = {
        'sub': str(user_id),
        'email': email,
        'type': 'refresh',
        'exp': datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(token: str) -> dict:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise Exception("Token expired")
    except jwt.InvalidTokenError:
        raise Exception("Invalid token")

def get_current_user_id(token: str) -> int:
    payload = verify_token(token)
    return int(payload['sub'])

def create_user(email: str, name: str, password: str, phone: str = None) -> dict:
    # Check if user exists
    existing = db.execute_one(
        "SELECT id FROM users WHERE email = %s",
        (email,)
    )
    if existing:
        raise Exception("User with this email already exists")
    
    # Hash password
    hashed_password = hash_password(password)
    
    # Insert user and get the result
    result = db.execute(
        """INSERT INTO users (email, name, password_hash, phone, created_at)
           VALUES (%s, %s, %s, %s, %s)
           RETURNING id, email, name, avatar_url, phone, created_at, is_active""",
        (email, name, hashed_password, phone, datetime.utcnow())
    )
    
    # result is a list, get the first item
    user = result[0] if result and len(result) > 0 else None
    
    return user

    
def authenticate_user(email: str, password: str) -> dict:
    user = db.execute_one(
        """SELECT id, email, name, password_hash, avatar_url, phone, is_active
           FROM users WHERE email = %s""",
        (email,)
    )
    
    if not user:
        raise Exception("Invalid email or password")
    
    if not user['is_active']:
        raise Exception("Account is deactivated")
    
    if not verify_password(password, user['password_hash']):
        raise Exception("Invalid email or password")
    
    db.execute(
        "UPDATE users SET last_login = %s WHERE id = %s",
        (datetime.utcnow(), user['id'])
    )
    
    access_token = create_access_token(user['id'], user['email'])
    refresh_token = create_refresh_token(user['id'], user['email'])
    
    return {
        'user': {
            'id': user['id'],
            'email': user['email'],
            'name': user['name'],
            'avatar_url': user['avatar_url'],
            'phone': user['phone']
        },
        'access_token': access_token,
        'refresh_token': refresh_token,
        'token_type': 'bearer'
    }

def get_user_by_id(user_id: int) -> dict:
    user = db.execute_one(
        """SELECT id, email, name, avatar_url, phone, created_at, last_login, is_active, email_verified
           FROM users WHERE id = %s""",
        (user_id,)
    )
    return user

def get_user_by_email(email: str) -> dict:
    user = db.execute_one(
        "SELECT id, email, name, avatar_url, phone FROM users WHERE email = %s",
        (email,)
    )
    return user

def update_user(user_id: int, data: dict) -> dict:
    fields = []
    values = []
    
    if 'name' in data and data['name']:
        fields.append("name = %s")
        values.append(data['name'])
    
    if 'phone' in data:
        fields.append("phone = %s")
        values.append(data['phone'])
    
    if 'avatar_url' in data:
        fields.append("avatar_url = %s")
        values.append(data['avatar_url'])
    
    if not fields:
        return get_user_by_id(user_id)
    
    fields.append("updated_at = %s")
    values.append(datetime.utcnow())
    values.append(user_id)
    
    db.execute(
        f"UPDATE users SET {', '.join(fields)} WHERE id = %s",
        tuple(values)
    )
    
    return get_user_by_id(user_id)

def change_password(user_id: int, current_password: str, new_password: str) -> bool:
    user = db.execute_one(
        "SELECT password_hash FROM users WHERE id = %s",
        (user_id,)
    )
    
    if not user:
        raise Exception("User not found")
    
    if not verify_password(current_password, user['password_hash']):
        raise Exception("Current password is incorrect")
    
    new_hash = hash_password(new_password)
    
    db.execute(
        "UPDATE users SET password_hash = %s, updated_at = %s WHERE id = %s",
        (new_hash, datetime.utcnow(), user_id)
    )
    
    return True

def deactivate_user(user_id: int) -> bool:
    db.execute(
        "UPDATE users SET is_active = false, updated_at = %s WHERE id = %s",
        (datetime.utcnow(), user_id)
    )
    return True

def activate_user(user_id: int) -> bool:
    db.execute(
        "UPDATE users SET is_active = true, updated_at = %s WHERE id = %s",
        (datetime.utcnow(), user_id)
    )
    return True

def delete_user(user_id: int) -> bool:
    db.execute("DELETE FROM users WHERE id = %s", (user_id,))
    return True

def refresh_access_token(refresh_token: str) -> str:
    payload = verify_token(refresh_token)
    
    if payload.get('type') != 'refresh':
        raise Exception("Invalid token type")
    
    user = db.execute_one(
        "SELECT id, email FROM users WHERE id = %s AND is_active = true",
        (int(payload['sub']),)
    )
    
    if not user:
        raise Exception("User not found")
    
    return create_access_token(user['id'], user['email'])

def get_user_by_token(token: str) -> dict:
    user_id = get_current_user_id(token)
    return get_user_by_id(user_id)