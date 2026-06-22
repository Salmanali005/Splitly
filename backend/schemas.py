from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, List
from datetime import datetime
from decimal import Decimal
from enum import Enum

# Enums


class TripStatus(str, Enum):
    PLANNING = "planning"
    ACTIVE = "active"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class MemberRole(str, Enum):
    ADMIN = "admin"
    EDITOR = "editor"
    VIEWER = "viewer"

class ExpenseCategory(str, Enum):
    FOOD = "food"
    TRANSPORT = "transport"
    ACCOMMODATION = "accommodation"
    ACTIVITIES = "activities"
    SHOPPING = "shopping"
    OTHER = "other"

class SplitType(str, Enum):
    EQUAL = "equal"
    CUSTOM = "custom"
    PERCENTAGE = "percentage"
    SHARES = "shares"

class SettlementStatus(str, Enum):
    PENDING = "pending"
    PAID = "paid"
    CANCELLED = "cancelled"

# User schemas
class UserCreate(BaseModel):
    email: EmailStr
    name: str = Field(..., min_length=2, max_length=255)
    password: str = Field(..., min_length=8)
    phone: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    name: str
    avatar_url: Optional[str]
    phone: Optional[str]
    created_at: datetime
    is_active: bool

class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    avatar_url: Optional[str] = None

# Trip schemas
class TripCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    destination: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    currency: str = "USD"
    notes: Optional[str] = None

class TripUpdate(BaseModel):
    name: Optional[str] = None
    destination: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    currency: Optional[str] = None
    status: Optional[TripStatus] = None
    notes: Optional[str] = None

class TripResponse(BaseModel):
    id: int
    name: str
    destination: Optional[str]
    start_date: Optional[datetime]
    end_date: Optional[datetime]
    currency: str
    status: str
    notes: Optional[str]
    created_by: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Member schemas
class MemberCreate(BaseModel):
    user_id: int
    role: str = "viewer"

class MemberResponse(BaseModel):
    id: int
    trip_id: int
    user_id: int
    role: str
    nickname: Optional[str]
    joined_at: datetime
    is_active: bool

# Expense schemas
class SplitCreate(BaseModel):
    member_id: int
    share_amount: Decimal
    split_type: str

class ExpenseCreate(BaseModel):
    description: str = Field(..., min_length=1)
    amount: Decimal = Field(..., gt=0)
    paid_by: int
    category: str = "other"
    date: Optional[datetime] = None
    notes: Optional[str] = None
    split_type: str = "equal"
    splits: List[SplitCreate]

class ExpenseResponse(BaseModel):
    id: int
    trip_id: int
    paid_by: int
    description: str
    amount: Decimal
    category: str
    date: datetime
    notes: Optional[str]
    receipt_url: Optional[str]
    split_type: str
    created_at: datetime

# Settlement schemas
class SettlementCreate(BaseModel):
    from_member_id: int
    to_member_id: int
    amount: Decimal = Field(..., gt=0)
    notes: Optional[str] = None

class SettlementResponse(BaseModel):
    id: int
    trip_id: int
    from_member_id: int
    to_member_id: int
    amount: Decimal
    status: str
    notes: Optional[str]
    settled_at: Optional[datetime]
    created_at: datetime

# Balance schemas
class BalanceResponse(BaseModel):
    member_id: int
    user_id: int
    name: str
    balance: Decimal  # positive means owed TO, negative means owes

class DebtResponse(BaseModel):
    from_member_id: int
    from_name: str
    to_member_id: int
    to_name: str
    amount: Decimal

# Auth schemas
class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"