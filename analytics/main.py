import os
from datetime import datetime, timedelta
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="QuickTask Analytics Service")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
client = MongoClient(os.getenv("MONGO_URI"))
db = client.quicktask
tasks_collection = db.tasks

@app.get("/")
async def root():
    return {"message": "QuickTask Analytics Service API"}

@app.get("/analytics/stats/{user_id}")
async def get_user_stats(user_id: str):
    try:
        user_oid = ObjectId(user_id)
        
        # Total tasks
        total_tasks = tasks_collection.count_documents({"user": user_oid})
        if total_tasks == 0:
            return {
                "total_tasks": 0,
                "avg_completion_time_hrs": 0,
                "overdue_tasks": 0,
                "productivity_score": 0
            }

        # Completed tasks
        completed_tasks = list(tasks_collection.find({"user": user_oid, "status": "completed"}))
        completed_count = len(completed_tasks)

        # Average completion time
        total_completion_time_sec = 0
        for task in completed_tasks:
            # Re-calculating from timestamps
            created_at = task.get("createdAt")
            updated_at = task.get("updatedAt")
            if created_at and updated_at:
                diff = (updated_at - created_at).total_seconds()
                total_completion_time_sec += diff
        
        avg_completion_time = (total_completion_time_sec / completed_count / 3600) if completed_count > 0 else 0

        # Overdue tasks
        now = datetime.now()
        overdue_tasks = tasks_collection.count_documents({
            "user": user_oid,
            "status": {"$ne": "completed"},
            "dueDate": {"$lt": now}
        })

        # Productivity score
        productivity_score = (completed_count / total_tasks * 100)

        return {
            "total_tasks": total_tasks,
            "avg_completion_time_hrs": round(avg_completion_time, 2),
            "overdue_tasks": overdue_tasks,
            "productivity_score": round(productivity_score, 2)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/analytics/trends/{user_id}")
async def get_productivity_trends(user_id: str, days: int = Query(7, ge=1, le=30)):
    try:
        user_oid = ObjectId(user_id)
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days)

        # Aggregate tasks completed per day
        pipeline = [
            {
                "$match": {
                    "user": user_oid,
                    "status": "completed",
                    "updatedAt": {"$gte": start_date, "$lte": end_date}
                }
            },
            {
                "$group": {
                    "_id": {
                        "$dateToString": {"format": "%Y-%m-%d", "date": "$updatedAt"}
                    },
                    "count": {"$sum": 1}
                }
            },
            {"$sort": {"_id": 1}}
        ]

        results = list(tasks_collection.aggregate(pipeline))
        
        # Fill in missing dates
        trend_data = []
        current_date = start_date
        results_dict = {item["_id"]: item["count"] for item in results}

        while current_date <= end_date:
            date_str = current_date.strftime("%Y-%m-%d")
            trend_data.append({
                "date": date_str,
                "count": results_dict.get(date_str, 0)
            })
            current_date += timedelta(days=1)

        return trend_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
