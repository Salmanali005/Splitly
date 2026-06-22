from services import trip as trip_service

from services import expense as expense_service
from services import split as split_service

@app.get("/api/categories")
async def get_categories():
    return expense_service.get_expense_categories()

@app.post("/api/trips/{trip_id}/expenses")
async def create_expense_route(trip_id: int, expense_data: ExpenseCreate, 
                                current_user: dict = Depends(get_current_user)):
    # Check if user is in trip
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
async def get_trip_expenses_route(trip_id: int, category: str = None, 
                                   member_id: int = None,
                                   current_user: dict = Depends(get_current_user)):
    if not trip_service.is_user_in_trip(current_user['id'], trip_id):
        raise HTTPException(status_code=403, detail="You are not a member of this trip")
    
    return expense_service.get_trip_expenses(trip_id, category, member_id)

@app.get("/api/expenses/{expense_id}")
async def get_expense_route(expense_id: int, current_user: dict = Depends(get_current_user)):
    expense = expense_service.get_expense_by_id(expense_id)
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    
    # Check if user is in the trip
    if not trip_service.is_user_in_trip(current_user['id'], expense['trip_id']):
        raise HTTPException(status_code=403, detail="You are not a member of this trip")
    
    return expense

@app.put("/api/expenses/{expense_id}")
async def update_expense_route(expense_id: int, expense_data: ExpenseUpdate,
                               current_user: dict = Depends(get_current_user)):
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
async def delete_expense_route(expense_id: int, current_user: dict = Depends(get_current_user)):
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
async def add_comment_route(expense_id: int, text: str, 
                            current_user: dict = Depends(get_current_user)):
    expense = expense_service.get_expense_by_id(expense_id)
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    
    if not trip_service.is_user_in_trip(current_user['id'], expense['trip_id']):
        raise HTTPException(status_code=403, detail="You are not a member of this trip")
    
    # Get member_id for this user in this trip
    member = db.execute_one(
        "SELECT id FROM members WHERE trip_id = %s AND user_id = %s",
        (expense['trip_id'], current_user['id'])
    )
    
    if not member:
        raise HTTPException(status_code=403, detail="You are not a member of this trip")
    
    comment = expense_service.add_comment_to_expense(
        expense_id, current_user['id'], member['id'], text
    )
    return comment

@app.get("/api/expenses/{expense_id}/comments")
async def get_expense_comments_route(expense_id: int, current_user: dict = Depends(get_current_user)):
    expense = expense_service.get_expense_by_id(expense_id)
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    
    if not trip_service.is_user_in_trip(current_user['id'], expense['trip_id']):
        raise HTTPException(status_code=403, detail="You are not a member of this trip")
    
    return expense_service.get_expense_comments(expense_id)

@app.get("/api/trips/{trip_id}/expenses/summary/{member_id}")
async def get_member_expense_summary_route(trip_id: int, member_id: int,
                                           current_user: dict = Depends(get_current_user)):
    if not trip_service.is_user_in_trip(current_user['id'], trip_id):
        raise HTTPException(status_code=403, detail="You are not a member of this trip")
    
    return expense_service.get_member_expense_summary(trip_id, member_id)

@app.post("/api/trips")
async def create_trip_route(trip_data: TripCreate, current_user: dict = Depends(get_current_user)):
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
async def get_user_trips_route(current_user: dict = Depends(get_current_user)):
    return trip_service.get_user_trips(current_user['id'])

@app.get("/api/trips/{trip_id}")
async def get_trip_route(trip_id: int, current_user: dict = Depends(get_current_user)):
    if not trip_service.is_user_in_trip(current_user['id'], trip_id):
        raise HTTPException(status_code=403, detail="You are not a member of this trip")
    
    trip = trip_service.get_trip_by_id(trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    return trip

@app.put("/api/trips/{trip_id}")
async def update_trip_route(trip_id: int, trip_data: TripUpdate, current_user: dict = Depends(get_current_user)):
    if not trip_service.is_user_trip_admin(current_user['id'], trip_id):
        raise HTTPException(status_code=403, detail="Only admins can update trips")
    
    result = trip_service.update_trip(trip_id, trip_data.dict(exclude_unset=True))
    if not result:
        raise HTTPException(status_code=404, detail="Trip not found")
    return result

@app.delete("/api/trips/{trip_id}")
async def delete_trip_route(trip_id: int, current_user: dict = Depends(get_current_user)):
    if not trip_service.is_user_trip_admin(current_user['id'], trip_id):
        raise HTTPException(status_code=403, detail="Only admins can delete trips")
    
    deleted = trip_service.delete_trip(trip_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Trip not found")
    return {"message": "Trip deleted successfully"}

@app.get("/api/trips/{trip_id}/members")
async def get_trip_members_route(trip_id: int, current_user: dict = Depends(get_current_user)):
    if not trip_service.is_user_in_trip(current_user['id'], trip_id):
        raise HTTPException(status_code=403, detail="You are not a member of this trip")
    
    return trip_service.get_trip_members(trip_id)

@app.post("/api/trips/{trip_id}/invite")
async def invite_member_route(trip_id: int, email: str, current_user: dict = Depends(get_current_user)):
    if not trip_service.is_user_trip_admin(current_user['id'], trip_id):
        raise HTTPException(status_code=403, detail="Only admins can invite members")
    
    try:
        invitation = trip_service.create_invitation(trip_id, email, current_user['id'])
        return {"message": "Invitation sent", "invitation": invitation}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/invitations/{token}/accept")
async def accept_invitation_route(token: str, current_user: dict = Depends(get_current_user)):
    try:
        trip = trip_service.accept_invitation(token, current_user['id'])
        return {"message": "Invitation accepted", "trip": trip}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/trips/{trip_id}/statistics")
async def get_trip_stats_route(trip_id: int, current_user: dict = Depends(get_current_user)):
    if not trip_service.is_user_in_trip(current_user['id'], trip_id):
        raise HTTPException(status_code=403, detail="You are not a member of this trip")
    
    return trip_service.get_trip_statistics(trip_id)

@app.get("/api/trips/{trip_id}/balances")
async def get_trip_balances_route(trip_id: int, current_user: dict = Depends(get_current_user)):
    if not trip_service.is_user_in_trip(current_user['id'], trip_id):
        raise HTTPException(status_code=403, detail="You are not a member of this trip")
    
    return trip_service.get_trip_member_balances(trip_id)