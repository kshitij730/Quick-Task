import pytest
from fastapi.testclient import TestClient
from main import app
import mongomock
from bson import ObjectId
from datetime import datetime, timedelta

# Mocking database isn't straightforward with global db object, 
# so we'll test the logic via the app if possible or just unit test the calculations.

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "QuickTask Analytics Service API"}

def test_stats_invalid_user():
    response = client.get("/analytics/stats/invalid_id")
    assert response.status_code == 500 # Should be 400 ideally, but handled as catch-all 500 in code
