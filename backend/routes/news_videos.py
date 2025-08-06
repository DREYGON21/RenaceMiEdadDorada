from fastapi import APIRouter, HTTPException, Depends, status
from typing import List
from ..models.news_video import NewsVideo, NewsVideoCreate, NewsVideoUpdate
from motor.motor_asyncio import AsyncIOMotorDatabase
from ..database import get_database
import logging
from datetime import datetime

router = APIRouter(prefix="/news-videos", tags=["news-videos"])
logger = logging.getLogger(__name__)

@router.get("/", response_model=dict)
async def get_all_news_videos(db: AsyncIOMotorDatabase = Depends(get_database)):
    """Get all active news videos ordered by creation date (newest first)"""
    try:
        cursor = db.news_videos.find(
            {"is_active": True},
            sort=[("created_at", -1)]
        )
        videos = await cursor.to_list(length=50)
        
        # Convert ObjectId to string
        for video in videos:
            video["_id"] = str(video["_id"])
            
        logger.info(f"Retrieved {len(videos)} news videos")
        return {
            "success": True,
            "data": videos
        }
    except Exception as e:
        logger.error(f"Error fetching news videos: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error retrieving news videos"
        )

@router.post("/", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_news_video(
    video_data: NewsVideoCreate,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Create a new news video"""
    try:
        # Create new video
        video_dict = video_data.model_dump()
        video_dict["created_at"] = datetime.utcnow()
        video_dict["updated_at"] = datetime.utcnow()
        
        result = await db.news_videos.insert_one(video_dict)
        
        # Retrieve the created video
        created_video = await db.news_videos.find_one({"_id": result.inserted_id})
        created_video["_id"] = str(created_video["_id"])
        
        logger.info(f"Created news video: {video_data.title}")
        return {
            "success": True,
            "message": "News video created successfully",
            "data": created_video
        }
        
    except Exception as e:
        logger.error(f"Error creating news video: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error creating news video"
        )

@router.put("/{video_id}", response_model=dict)
async def update_news_video(
    video_id: str,
    video_data: NewsVideoUpdate,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Update an existing news video"""
    try:
        from bson import ObjectId
        
        # Check if video exists
        existing = await db.news_videos.find_one({"_id": ObjectId(video_id)})
        if not existing:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="News video not found"
            )
        
        # Prepare update data
        update_data = {k: v for k, v in video_data.model_dump(exclude_unset=True).items()}
        
        if update_data:
            update_data["updated_at"] = datetime.utcnow()
            
            await db.news_videos.update_one(
                {"_id": ObjectId(video_id)},
                {"$set": update_data}
            )
        
        # Return updated video
        updated_video = await db.news_videos.find_one({"_id": ObjectId(video_id)})
        updated_video["_id"] = str(updated_video["_id"])
        
        logger.info(f"Updated news video {video_id}")
        return {
            "success": True,
            "message": "News video updated successfully",
            "data": updated_video
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating news video: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error updating news video"
        )

@router.delete("/{video_id}", response_model=dict)
async def delete_news_video(
    video_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Soft delete a news video (set is_active to False)"""
    try:
        from bson import ObjectId
        
        result = await db.news_videos.update_one(
            {"_id": ObjectId(video_id)},
            {"$set": {"is_active": False, "updated_at": datetime.utcnow()}}
        )
        
        if result.matched_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="News video not found"
            )
        
        logger.info(f"Deleted news video {video_id}")
        return {
            "success": True,
            "message": "News video deleted successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting news video: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error deleting news video"
        )