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

#  Database Connection
client = MongoClient("mongodb://localhost:27017/")
db = client.blood_bank
users_collection = db.users
admins_collection = db.admins
donors_collection = db.donors
testimonials_collection = db.testimonials

#  Middleware for Token Authentication (User/Admin)
def token_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        token = request.headers.get("Authorization")
        if not token or "Bearer " not in token:
            return jsonify({"error": "Token is missing"}), 403

        try:
            token = token.split("Bearer ")[1]
            data = jwt.decode(token, app.config["SECRET_KEY"], algorithms=["HS256"])
            request.user_email = data["email"]
            request.user_role = data.get("role", "user")  # Default role is 'user'
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired"}), 403
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 403

        return f(*args, **kwargs)
    
    return wrapper

#  User Signup
@app.route("/signup", methods=["POST"])
def signup():
    data = request.json
    if not all(field in data and data[field] for field in ["name", "email", "password"]):
        return jsonify({"error": "Missing required fields"}), 400

    if users_collection.find_one({"email": data["email"]}):
        return jsonify({"error": "User already exists"}), 400

    hashed_password = bcrypt.hashpw(data["password"].encode("utf-8"), bcrypt.gensalt())
    user = {"name": data["name"], "email": data["email"], "password": hashed_password.decode("utf-8")}
    users_collection.insert_one(user)

    return jsonify({"message": "User registered successfully"}), 201

#  User Signin
@app.route("/signin", methods=["POST"])
def signin():
    data = request.json
    user = users_collection.find_one({"email": data["email"]})

    if not user or not bcrypt.checkpw(data["password"].encode("utf-8"), user["password"].encode("utf-8")):
        return jsonify({"error": "Invalid credentials"}), 401

    token = jwt.encode(
        {"email": user["email"], "role": "user", "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7)},
        app.config["SECRET_KEY"],
        algorithm="HS256"
    )

    return jsonify({"token": token, "user": {"name": user["name"], "email": user["email"]}})

#  Admin Signin (Fixed)
@app.route("/admin/signin", methods=["POST"])
def admin_signin():
    data = request.json
    admin = admins_collection.find_one({"email": data["email"]})

    if not admin or not bcrypt.checkpw(data["password"].encode("utf-8"), admin["password"].encode("utf-8")):
        return jsonify({"error": "Invalid admin credentials"}), 401

    # Generate Admin Token
    token = jwt.encode(
        {"email": admin["email"], "role": "admin", "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7)},
        app.config["SECRET_KEY"],
        algorithm="HS256"
    )

    return jsonify({"token": token, "admin": {"email": admin["email"]}})

#  Admin Controls: Add Donor
@app.route("/admin/donors/add", methods=["POST"])
@token_required
def add_donor():
    if request.user_role != "admin":
        return jsonify({"error": "Unauthorized"}), 403

    data = request.json
    required_fields = ["name", "email", "phone", "gender", "bloodGroup", "address"]
    
    if not all(field in data and data[field] for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    # Check if donor already exists
    if donors_collection.find_one({"email": data["email"]}):
        return jsonify({"error": "Donor already exists"}), 400

    # Insert donor into database
    donors_collection.insert_one({
        "name": data["name"],
        "email": data["email"],
        "phone": data["phone"],
        "gender": data["gender"],
        "bloodGroup": data["bloodGroup"],
        "address": data["address"],
        "added_at": datetime.datetime.utcnow()
    })

    return jsonify({"message": "Donor added successfully"}), 201


#  Blood Donation (Protected)
@app.route("/donate", methods=["POST"])
@token_required
def donate_blood():
    data = request.json
    if not all(field in data and data[field] for field in ["name", "address", "phone", "bloodGroup", "appointmentTime", "age", "gender"]):
        return jsonify({"error": "Missing required fields"}), 400

    donation_entry = {
        "email": request.user_email, 
        "name": data["name"],
        "age": data["age"],
        "gender": data["gender"],
        "address": data["address"],
        "phone": data["phone"],
        "bloodGroup": data["bloodGroup"],
        "appointmentTime": data["appointmentTime"],
        "donation_date": datetime.datetime.utcnow(),
    }

    donors_collection.insert_one(donation_entry)
    return jsonify({"message": "Donation recorded successfully"}), 200

#  Fetch Recent Donors
@app.route("/donors", methods=["GET"])
def get_all_donors():
    donors = list(donors_collection.find({}, {"_id": 0}))
    return jsonify({"donors": donors[::-1]}), 200  # Show newest first

#  Fetch Testimonials
@app.route("/testimonials", methods=["GET"])
def get_testimonials():
    testimonials = list(testimonials_collection.find({}, {"_id": 0}))
    return jsonify({"testimonials": testimonials}), 200

#  Admin Controls: Fetch All Users (Admin Only)
@app.route("/admin/users", methods=["GET"])
@token_required
def get_users():
    if request.user_role != "admin":
        return jsonify({"error": "Unauthorized"}), 403

    users = list(users_collection.find({}, {"_id": 0, "password": 0}))  # Hide passwords
    return jsonify({"users": users}), 200


@app.route("/admin/donors/edit/<email>", methods=["PUT"])
@token_required
def update_donor(email):
    if request.user_role != "admin":
        return jsonify({"error": "Unauthorized"}), 403

    data = request.json
    update_fields = {k: v for k, v in data.items() if v}  # Ignore empty fields

    if not update_fields:
        return jsonify({"error": "No data to update"}), 400

    result = donors_collection.update_one({"email": email}, {"$set": update_fields})

    if result.matched_count == 0:
        return jsonify({"error": "Donor not found"}), 404

    return jsonify({"message": "Donor updated successfully"}), 200

@app.route("/admin/users/edit/<email>", methods=["PUT"])
@token_required
def update_user(email):
    if request.user_role != "admin":
        return jsonify({"error": "Unauthorized"}), 403

    data = request.json
    update_fields = {k: v for k, v in data.items() if v}  # Ignore empty fields

    if not update_fields:
        return jsonify({"error": "No data to update"}), 400

    result = users_collection.update_one({"email": email}, {"$set": update_fields})

    if result.matched_count == 0:
        return jsonify({"error": "User not found"}), 404

    return jsonify({"message": "User updated successfully"}), 200


#  Admin Controls: Delete User (Admin Only)
@app.route("/admin/users/delete/<email>", methods=["DELETE"])
@token_required
def delete_user(email):
    if request.user_role != "admin":
        return jsonify({"error": "Unauthorized"}), 403

    users_collection.delete_one({"email": email})
    return jsonify({"message": "User deleted successfully"}), 200

#  Admin Controls: Delete Testimonial
@app.route("/admin/testimonials/delete/<string:name>", methods=["DELETE"])
@token_required
def delete_testimonial(name):
    if request.user_role != "admin":
        return jsonify({"error": "Unauthorized"}), 403

    testimonials_collection.delete_one({"name": name})
    return jsonify({"message": "Testimonial deleted successfully"}), 200

#  Admin Controls: Delete Donor
@app.route("/admin/donors/delete/<email>", methods=["DELETE"])
@token_required
def delete_donor(email):
    if request.user_role != "admin":
        return jsonify({"error": "Unauthorized"}), 403

    donors_collection.delete_one({"email": email})
    return jsonify({"message": "Donor deleted successfully"}), 200

if __name__ == "__main__":
    app.run(debug=True)
