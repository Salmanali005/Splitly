from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from decimal import Decimal

# ============ AUTH SCHEMAS ============
class UserCreate(BaseModel):
    email: EmailStr
    name: str = Field(..., min_length=2, max_length=255)
    password: str = Field(..., min_length=8)
    phone: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    avatar_url: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    email: str
    name: str
    avatar_url: Optional[str]
    phone: Optional[str]
    created_at: datetime
    is_active: bool

# ============ TRIP SCHEMAS ============
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
    status: Optional[str] = None
    cover_image: Optional[str] = None
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

# ============ EXPENSE SCHEMAS ============
class SplitCreate(BaseModel):
    member_id: int
    share_amount: Decimal
    split_value: Optional[Decimal] = None
    split_type: str = "equal"

class ExpenseCreate(BaseModel):
    description: str = Field(..., min_length=1, max_length=500)
    amount: Decimal = Field(..., gt=0)
    paid_by: int
    category: str = "other"
    date: Optional[datetime] = None
    notes: Optional[str] = None
    split_type: str = "equal"
    splits: List[SplitCreate]

# ADD THIS - MISSING!
class ExpenseUpdate(BaseModel):
    description: Optional[str] = Field(None, min_length=1, max_length=500)
    amount: Optional[Decimal] = Field(None, gt=0)
    category: Optional[str] = None
    date: Optional[datetime] = None
    notes: Optional[str] = None
    receipt_url: Optional[str] = None
    splits: Optional[List[SplitCreate]] = None

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

# ============ SETTLEMENT SCHEMAS ============
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

# ============ COMMENT SCHEMAS ============
class CommentCreate(BaseModel):
    text: str = Field(..., min_length=1)

class CommentResponse(BaseModel):
    id: int
    expense_id: int
    user_id: int
    member_id: int
    text: str
    created_at: datetime
    user_name: Optional[str] = None