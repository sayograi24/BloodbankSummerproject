import bcrypt
from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client.blood_bank
admins_collection = db.admins

hashed_password = bcrypt.hashpw("adminpassword".encode("utf-8"), bcrypt.gensalt())

admin = {
    "email": "admin@bloodbank.com",
    "password": hashed_password.decode("utf-8")
}

admins_collection.insert_one(admin)
print("Admin added successfully!")
