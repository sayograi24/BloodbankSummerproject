from pymongo import MongoClient
import datetime

client = MongoClient("mongodb://localhost:27017/")
db = client.blood_bank
testimonials_collection = db.testimonials

#  Testimonials from the HTML File
testimonials_data = [
    {
        "name": "Kyoto",
        "message": "Donating blood was a wonderful experience. Knowing that I helped save lives is incredibly rewarding.",
        "date": datetime.datetime.utcnow()
    },
    {
        "name": "Apollo",
        "message": "Receiving a blood donation during my surgery was life-saving. I am forever grateful to the donors.",
        "date": datetime.datetime.utcnow()
    },
    {
        "name": "Shinigami",
        "message": "Don't smoke, Donate Blood.",
        "date": datetime.datetime.utcnow()
    },
    {
        "name": "Manoj Pandey",
        "message": "Blood donate garna chai free ma hunxa, blood lina jada mahango hunxa",
        "date": datetime.datetime.utcnow()
    },
    {
        "name": "Tikendra Rai",
        "message": "Donating blood makes your body light, feels healthy.",
        "date": datetime.datetime.utcnow()
    },
    {
        "name": "Akriti Rai",
        "message": "Donate a drop of blood and save the life of the needed people.",
        "date": datetime.datetime.utcnow()
    }
]

#  Insert into MongoDB
testimonials_collection.insert_many(testimonials_data)
print("Testimonials added successfully!")
