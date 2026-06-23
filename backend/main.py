from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List
from datetime import datetime
from decimal import Decimal
import os
from dotenv import load_dotenv

load_dotenv()

# ============================================
# CREATE APP
# ============================================
app = FastAPI(
    title="Hisaab API",
    description="Trip expense splitting app",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================
# IMPORTS
# ============================================
from database import db
from schemas import *
from services import user as user_service
from services import trip as trip_service
from services import expense as expense_service
from services import debt as debt_service

# ============================================
# ROOT ENDPOINTS
# ============================================
@app.get("/")
async def root():
    return {"message": "Hisaab API is running"}

@app.get("/health")
async def health_check():
    try:
        db.execute("SELECT 1")
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "database": str(e)}

# ============================================
# DEPENDENCY: Get Current User
# ============================================
def get_current_user(authorization: str = Header(None)) -> dict:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid token")
    
    token = authorization.split(" ")[1]
    
    try:
        user_id = user_service.get_current_user_id(token)
        user = user_service.get_user_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

# ============================================
# AUTH ROUTES
# ============================================
@app.post("/api/auth/register")
async def register(user_data: UserCreate):
    try:
        user = user_service.create_user(
            email=user_data.email,
            name=user_data.name,
            password=user_data.password,
            phone=user_data.phone
        )
        return {"message": "User created successfully", "user": user}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/auth/login")
async def login(login_data: UserLogin):
    try:
        result = user_service.authenticate_user(
            email=login_data.email,
            password=login_data.password
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

@app.post("/api/auth/refresh")
async def refresh(refresh_token: str):
    try:
        new_token = user_service.refresh_access_token(refresh_token)
        return {"access_token": new_token, "token_type": "bearer"}
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

@app.get("/api/auth/me")
async def get_current_user_route(current_user: dict = Depends(get_current_user)):
    return current_user

@app.put("/api/auth/me")
async def update_profile(user_data: UserUpdate, current_user: dict = Depends(get_current_user)):
    try:
        user = user_service.update_user(current_user['id'], user_data.dict(exclude_unset=True))
        return user
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/auth/change-password")
async def change_password(current_password: str, new_password: str, current_user: dict = Depends(get_current_user)):
    try:
        user_service.change_password(current_user['id'], current_password, new_password)
        return {"message": "Password changed successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# ============================================
# TRIP ROUTES
# ============================================
@app.post("/api/trips")
async def create_trip(trip_data: TripCreate, current_user: dict = Depends(get_current_user)):
    try:
        result = trip_service.create_trip(
            user_id=current_user['id'],
            name=trip_data.name,
            destination=trip_data.destination,
            start_date=trip_data.start_date,
            end_date=trip_data.end_date,
            currency=trip_data.currency,
            notes=trip_data.notes
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/trips")
async def get_user_trips(current_user: dict = Depends(get_current_user)):
    return trip_service.get_user_trips(current_user['id'])

@app.get("/api/trips/{trip_id}")
async def get_trip(trip_id: int, current_user: dict = Depends(get_current_user)):
    if not trip_service.is_user_in_trip(current_user['id'], trip_id):
        raise HTTPException(status_code=403, detail="You are not a member of this trip")
    
    trip = trip_service.get_trip_by_id(trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    return trip

@app.put("/api/trips/{trip_id}")
async def update_trip(trip_id: int, trip_data: TripUpdate, current_user: dict = Depends(get_current_user)):
    if not trip_service.is_user_trip_admin(current_user['id'], trip_id):
        raise HTTPException(status_code=403, detail="Only admins can update trips")
    
    result = trip_service.update_trip(trip_id, trip_data.dict(exclude_unset=True))
    if not result:
        raise HTTPException(status_code=404, detail="Trip not found")
    return result

@app.delete("/api/trips/{trip_id}")
async def delete_trip(trip_id: int, current_user: dict = Depends(get_current_user)):
    if not trip_service.is_user_trip_admin(current_user['id'], trip_id):
        raise HTTPException(status_code=403, detail="Only admins can delete trips")
    
    deleted = trip_service.delete_trip(trip_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Trip not found")
    return {"message": "Trip deleted successfully"}

@app.get("/api/trips/{trip_id}/members")
async def get_trip_members(trip_id: int, current_user: dict = Depends(get_current_user)):
    if not trip_service.is_user_in_trip(current_user['id'], trip_id):
        raise HTTPException(status_code=403, detail="You are not a member of this trip")
    
    return trip_service.get_trip_members(trip_id)

@app.post("/api/trips/{trip_id}/invite")
async def invite_member(trip_id: int, email: str, current_user: dict = Depends(get_current_user)):
    if not trip_service.is_user_trip_admin(current_user['id'], trip_id):
        raise HTTPException(status_code=403, detail="Only admins can invite members")
    
    try:
        invitation = trip_service.create_invitation(trip_id, email, current_user['id'])
        return {"message": "Invitation sent", "invitation": invitation}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/invitations/{token}/accept")
async def accept_invitation(token: str, current_user: dict = Depends(get_current_user)):
    try:
        trip = trip_service.accept_invitation(token, current_user['id'])
        return {"message": "Invitation accepted", "trip": trip}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/trips/{trip_id}/statistics")
async def get_trip_statistics(trip_id: int, current_user: dict = Depends(get_current_user)):
    if not trip_service.is_user_in_trip(current_user['id'], trip_id):
        raise HTTPException(status_code=403, detail="You are not a member of this trip")
    
    return trip_service.get_trip_statistics(trip_id)

# ============================================
# EXPENSE ROUTES
# ============================================
@app.get("/api/categories")
async def get_categories():
    return expense_service.get_expense_categories()

@app.post("/api/trips/{trip_id}/expenses")
async def create_expense(trip_id: int, expense_data: ExpenseCreate, current_user: dict = Depends(get_current_user)):
    if not trip_service.is_user_in_trip(current_user['id'], trip_id):
        raise HTTPException(status_code=403, detail="You are not a member of this trip")
    
    try:
        result = expense_service.create_expense(
            trip_id=trip_id,
            paid_by=expense_data.paid_by,
            description=expense_data.description,
            amount=expense_data.amount,
            category=expense_data.category,
            split_type=expense_data.split_type,
            splits=[s.dict() for s in expense_data.splits],
            date=expense_data.date,
            notes=expense_data.notes
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/trips/{trip_id}/expenses")
async def get_trip_expenses(trip_id: int, category: Optional[str] = None, member_id: Optional[int] = None, current_user: dict = Depends(get_current_user)):
    if not trip_service.is_user_in_trip(current_user['id'], trip_id):
        raise HTTPException(status_code=403, detail="You are not a member of this trip")
    
    return expense_service.get_trip_expenses(trip_id, category, member_id)

@app.get("/api/expenses/{expense_id}")
async def get_expense(expense_id: int, current_user: dict = Depends(get_current_user)):
    expense = expense_service.get_expense_by_id(expense_id)
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    
    if not trip_service.is_user_in_trip(current_user['id'], expense['trip_id']):
        raise HTTPException(status_code=403, detail="You are not a member of this trip")
    
    return expense

@app.put("/api/expenses/{expense_id}")
async def update_expense(expense_id: int, expense_data: ExpenseUpdate, current_user: dict = Depends(get_current_user)):
    expense = expense_service.get_expense_by_id(expense_id)
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    
    if not trip_service.is_user_in_trip(current_user['id'], expense['trip_id']):
        raise HTTPException(status_code=403, detail="You are not a member of this trip")
    
    try:
        result = expense_service.update_expense(expense_id, expense_data.dict(exclude_unset=True))
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/api/expenses/{expense_id}")
async def delete_expense(expense_id: int, current_user: dict = Depends(get_current_user)):
    expense = expense_service.get_expense_by_id(expense_id)
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    
    if not trip_service.is_user_in_trip(current_user['id'], expense['trip_id']):
        raise HTTPException(status_code=403, detail="You are not a member of this trip")
    
    deleted = expense_service.delete_expense(expense_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Expense not found")
    return {"message": "Expense deleted successfully"}

@app.post("/api/expenses/{expense_id}/comments")
async def add_comment(expense_id: int, text: str, current_user: dict = Depends(get_current_user)):
    expense = expense_service.get_expense_by_id(expense_id)
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    
    if not trip_service.is_user_in_trip(current_user['id'], expense['trip_id']):
        raise HTTPException(status_code=403, detail="You are not a member of this trip")
    
    member = db.execute_one(
        "SELECT id FROM members WHERE trip_id = %s AND user_id = %s",
        (expense['trip_id'], current_user['id'])
    )
    
    if not member:
        raise HTTPException(status_code=403, detail="You are not a member of this trip")
    
    comment = expense_service.add_comment_to_expense(expense_id, current_user['id'], member['id'], text)
    return comment

@app.get("/api/expenses/{expense_id}/comments")
async def get_expense_comments(expense_id: int, current_user: dict = Depends(get_current_user)):
    expense = expense_service.get_expense_by_id(expense_id)
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    
    if not trip_service.is_user_in_trip(current_user['id'], expense['trip_id']):
        raise HTTPException(status_code=403, detail="You are not a member of this trip")
    
    return expense_service.get_expense_comments(expense_id)

@app.get("/api/trips/{trip_id}/expenses/summary/{member_id}")
async def get_member_expense_summary(trip_id: int, member_id: int, current_user: dict = Depends(get_current_user)):
    if not trip_service.is_user_in_trip(current_user['id'], trip_id):
        raise HTTPException(status_code=403, detail="You are not a member of this trip")
    
    return expense_service.get_member_expense_summary(trip_id, member_id)

# ============================================
# BALANCE & SETTLEMENT ROUTES
# ============================================
@app.get("/api/trips/{trip_id}/balances")
async def get_trip_balances(trip_id: int, current_user: dict = Depends(get_current_user)):
    if not trip_service.is_user_in_trip(current_user['id'], trip_id):
        raise HTTPException(status_code=403, detail="You are not a member of this trip")
    
    return debt_service.calculate_trip_balance_summary(trip_id)

@app.get("/api/trips/{trip_id}/debts/simplified")
async def get_simplified_debts(trip_id: int, current_user: dict = Depends(get_current_user)):
    if not trip_service.is_user_in_trip(current_user['id'], trip_id):
        raise HTTPException(status_code=403, detail="You are not a member of this trip")
    
    return debt_service.get_simplified_debts(trip_id)

@app.get("/api/trips/{trip_id}/debts/my")
async def get_my_debts(trip_id: int, current_user: dict = Depends(get_current_user)):
    if not trip_service.is_user_in_trip(current_user['id'], trip_id):
        raise HTTPException(status_code=403, detail="You are not a member of this trip")
    
    member = db.execute_one(
        "SELECT id FROM members WHERE trip_id = %s AND user_id = %s",
        (trip_id, current_user['id'])
    )
    
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    
    return debt_service.get_owes_summary(trip_id, member['id'])

@app.post("/api/trips/{trip_id}/settlements")
async def create_settlement(trip_id: int, settlement_data: dict, current_user: dict = Depends(get_current_user)):
    if not trip_service.is_user_trip_admin(current_user['id'], trip_id):
        raise HTTPException(status_code=403, detail="Only admins can create settlements")
    
    try:
        result = debt_service.create_settlement(
            trip_id=trip_id,
            from_member_id=settlement_data['from_member_id'],
            to_member_id=settlement_data['to_member_id'],
            amount=Decimal(str(settlement_data['amount'])),
            notes=settlement_data.get('notes')
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.put("/api/settlements/{settlement_id}/paid")
async def mark_settlement_paid(settlement_id: int, current_user: dict = Depends(get_current_user)):
    try:
        result = debt_service.mark_settlement_paid(settlement_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/trips/{trip_id}/settlements")
async def get_trip_settlements(trip_id: int, current_user: dict = Depends(get_current_user)):
    if not trip_service.is_user_in_trip(current_user['id'], trip_id):
        raise HTTPException(status_code=403, detail="You are not a member of this trip")
    
    return debt_service.get_settlement_history(trip_id)

@app.post("/api/trips/{trip_id}/settlements/auto")
async def auto_settle_debts(trip_id: int, current_user: dict = Depends(get_current_user)):
    if not trip_service.is_user_trip_admin(current_user['id'], trip_id):
        raise HTTPException(status_code=403, detail="Only admins can settle debts")
    
    settlements = debt_service.settle_all_debts(trip_id)
    return {
        "message": f"Created {len(settlements)} settlements",
        "settlements": settlements
    }

@app.get("/api/trips/{trip_id}/settlements/statistics")
async def get_settlement_statistics(trip_id: int, current_user: dict = Depends(get_current_user)):
    if not trip_service.is_user_in_trip(current_user['id'], trip_id):
        raise HTTPException(status_code=403, detail="You are not a member of this trip")
    
    return debt_service.get_settlement_statistics(trip_id)

# ============================================
# RUN SERVER
# ============================================
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)