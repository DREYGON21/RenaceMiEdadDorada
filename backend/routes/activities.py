from fastapi import APIRouter, HTTPException, Depends, status
from typing import List
from ..models.activity import Activity, ActivityCreate, ActivityUpdate
from motor.motor_asyncio import AsyncIOMotorDatabase
from ..database import get_database
import logging
from datetime import datetime

router = APIRouter(prefix="/activities", tags=["activities"])
logger = logging.getLogger(__name__)

@router.get("/", response_model=dict)
async def get_all_activities(db: AsyncIOMotorDatabase = Depends(get_database)):
    """Get all active activities ordered by week"""
    try:
        cursor = db.activities.find(
            {"is_active": True},
            sort=[("week", 1)]
        )
        activities = await cursor.to_list(length=100)
        
        # Convert ObjectId to string
        for activity in activities:
            activity["_id"] = str(activity["_id"])
            
        logger.info(f"Retrieved {len(activities)} activities")
        return {
            "success": True,
            "data": activities
        }
    except Exception as e:
        logger.error(f"Error fetching activities: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error retrieving activities"
        )

@router.post("/", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_activity(
    activity_data: ActivityCreate,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Create a new activity"""
    try:
        # Check if week already exists
        existing = await db.activities.find_one({"week": activity_data.week, "is_active": True})
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Activity for week {activity_data.week} already exists"
            )
        
        # Create new activity
        activity_dict = activity_data.model_dump()
        activity_dict["created_at"] = datetime.utcnow()
        activity_dict["updated_at"] = datetime.utcnow()
        
        result = await db.activities.insert_one(activity_dict)
        
        # Retrieve the created activity
        created_activity = await db.activities.find_one({"_id": result.inserted_id})
        created_activity["_id"] = str(created_activity["_id"])
        
        logger.info(f"Created activity for week {activity_data.week}")
        return {
            "success": True,
            "message": "Activity created successfully",
            "data": created_activity
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating activity: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error creating activity"
        )

@router.put("/{activity_id}", response_model=dict)
async def update_activity(
    activity_id: str,
    activity_data: ActivityUpdate,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Update an existing activity"""
    try:
        from bson import ObjectId
        
        # Check if activity exists
        existing = await db.activities.find_one({"_id": ObjectId(activity_id)})
        if not existing:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Activity not found"
            )
        
        # Prepare update data
        update_data = {k: v for k, v in activity_data.model_dump(exclude_unset=True).items()}
        
        if update_data:
            update_data["updated_at"] = datetime.utcnow()
            
            await db.activities.update_one(
                {"_id": ObjectId(activity_id)},
                {"$set": update_data}
            )
        
        # Return updated activity
        updated_activity = await db.activities.find_one({"_id": ObjectId(activity_id)})
        updated_activity["_id"] = str(updated_activity["_id"])
        
        logger.info(f"Updated activity {activity_id}")
        return {
            "success": True,
            "message": "Activity updated successfully",
            "data": updated_activity
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating activity: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error updating activity"
        )

@router.delete("/{activity_id}", response_model=dict)
async def delete_activity(
    activity_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Soft delete an activity (set is_active to False)"""
    try:
        from bson import ObjectId
        
        result = await db.activities.update_one(
            {"_id": ObjectId(activity_id)},
            {"$set": {"is_active": False, "updated_at": datetime.utcnow()}}
        )
        
        if result.matched_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Activity not found"
            )
        
        logger.info(f"Deleted activity {activity_id}")
        return {
            "success": True,
            "message": "Activity deleted successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting activity: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error deleting activity"
        )