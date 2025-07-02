from pymongo import MongoClient
from datetime import datetime

client = MongoClient("mongodb://localhost:27017/")
db = client.blood_bank
donors_collection = db.donors

#  Insert a single donor
donor = {
    "email": "testuser@example.com",
    "name": "Test User",
    "age": 29,
    "gender": "Male",
    "address": "Test City",
    "phone": "9876543210",
    "bloodGroup": "B+",
    "appointmentTime": "2025-04-15T10:00:00",
    "donation_date": datetime.utcnow()
}

result = donors_collection.insert_one(donor)
print("✅ Donor inserted with ID:", result.inserted_id)
