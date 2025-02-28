from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import bcrypt
import jwt
import datetime
from functools import wraps

app = Flask(__name__)
CORS(app)
app.config["SECRET_KEY"] = "your_secret_key"

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client.blood_bank
users_collection = db.users
donors_collection = db.donors

# ------------------ SIGNUP ------------------
@app.route("/signup", methods=["POST"])
def signup():
    data = request.json
    required_fields = ["name", "email", "password"]

    if not all(field in data and data[field] for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    if users_collection.find_one({"email": data["email"]}):
        return jsonify({"error": "User already exists"}), 400

    hashed_password = bcrypt.hashpw(data["password"].encode("utf-8"), bcrypt.gensalt())

    user = {
        "name": data["name"],
        "email": data["email"],
        "password": hashed_password.decode("utf-8")
    }

    users_collection.insert_one(user)
    return jsonify({"message": "User registered successfully"}), 201

# ------------------ SIGNIN ------------------
@app.route("/signin", methods=["POST"])
def signin():
    data = request.json
    user = users_collection.find_one({"email": data["email"]})

    if not user or not bcrypt.checkpw(data["password"].encode("utf-8"), user["password"].encode("utf-8")):
        return jsonify({"error": "Invalid credentials"}), 401

    token = jwt.encode(
        {"email": user["email"], "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)},
        app.config["SECRET_KEY"],
        algorithm="HS256"
    )

    return jsonify({"token": token, "user": {"name": user["name"], "email": user["email"]}})

# ------------------ TOKEN AUTHENTICATION ------------------
def token_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        token = request.headers.get("Authorization")

        if not token:
            return jsonify({"error": "Token is missing"}), 403

        if "Bearer " in token:
            token = token.split("Bearer ")[1]

        try:
            data = jwt.decode(token, app.config["SECRET_KEY"], algorithms=["HS256"])
            request.user_email = data["email"]
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired"}), 403
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 403

        return f(*args, **kwargs)
    
    return wrapper

# ------------------ DONATE BLOOD ------------------
@app.route("/donate", methods=["POST"])
@token_required
def donate_blood():
    data = request.json
    required_fields = ["name", "address", "phone", "bloodGroup", "appointmentTime"]

    if not all(field in data and data[field] for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    donation_entry = {
        "email": request.user_email,  # Extract email from token
        "name": data["name"],
        "address": data["address"],
        "phone": data["phone"],
        "bloodGroup": data["bloodGroup"],
        "appointmentTime": data["appointmentTime"],
        "donation_date": datetime.datetime.utcnow(),
    }

    # Insert the donation record
    donors_collection.insert_one(donation_entry)

    return jsonify({"message": "Donation recorded successfully"}), 200

# ------------------ GET ALL DONORS ------------------
@app.route("/donors", methods=["GET"])
@token_required
def get_all_donors():
    donors = list(donors_collection.find({}, {"_id": 0}))  # Exclude MongoDB _id field

    if not donors:
        return jsonify({"error": "No donors found"}), 404

    return jsonify({"donors": donors}), 200


# ------------------ VIEW DONATION HISTORY ------------------
@app.route("/donation-history", methods=["GET"])
@token_required
def get_donation_history():
    donations = list(donors_collection.find({"email": request.user_email}, {"_id": 0}))

    if not donations:
        return jsonify({"error": "No donation records found"}), 404

    return jsonify({"donation_history": donations}), 200

if __name__ == "__main__":
    app.run(debug=False)
