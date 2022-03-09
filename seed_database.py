"""Script to seed database."""

import os
import json
from random import choice, randint
from datetime import datetime

import crud_bookmarks_lists
import crud_check_ins
import crud_comments
import crud_hikes_bookmarks_lists
import crud_hikes
import crud_pets
import crud_users
import model
import server

# Run dropdb and createdb to re-create database
os.system("dropdb pupjourney --if-exists")
os.system("createdb pupjourney")

# Connect to the database and call db.create_all
model.connect_to_db(server.app)
model.db.create_all()

# Load data from data/hikes.json and save it to a variable:
with open("data/hikes.json") as f:
    hike_data = json.loads(f.read())

# Now, hike_data will be a list of dictionaries that look like this:

# [{"name": "Cedar Grove and Vista View Point in Griffith Park",
#   "difficulty": "TBD",
#   "leash_rule": "Hikers, dogs",
#   "description": "This hike on the southeast side of Griffith Park follows paved and
#                   unpaved trails to two park attractions, a quiet grove with a picnic
#                   area and a helipad with panoramic views",
#   "features": "",
#   ...},
#   ...
#   ]


# Create hikes, store them in list so we can use them
hikes_in_db = []
for hike in hike_data:
    # unpack hike data
    (
        hike_name,
        area,
        difficulty,
        leash_rule,
        description,
        address,
        latitude,
        longitude,
        city,
        state,
        miles,
        path,
        parking,
        resources,
        hike_imgURL,
    ) = (
        hike["hike_name"],
        hike["area"],
        hike["difficulty"],
        hike["leash_rule"],
        hike["description"],
        hike["address"],
        hike["latitude"],
        hike["longitude"],
        hike["city"],
        hike["state"],
        hike["miles"],
        hike["path"],
        hike["parking"],
        hike["resources"],
        hike["hike_imgURL"],
    )

    # create hike variable with create_hike function from crud.py
    db_hike = crud_hikes.create_hike(
        hike_name,
        area,
        difficulty,
        leash_rule,
        description,
        address,
        latitude,
        longitude,
        city,
        state,
        float(miles),
        path,
        parking,
        resources,
        hike_imgURL,
    )

    # append db_movie to hikes_in_db list
    hikes_in_db.append(db_hike)

test_user = crud_users.create_user("Test User 1", "test@test", "test")
test_pet1 = crud_pets.create_pet(test_user, "Test Pet1", "female", None, "Shiba Inu", "https://res.cloudinary.com/hbpupjourney/image/upload/v1644612543/hvtridjccxxvvsiqgoi6.jpg", None, [])
test_pet2 = crud_pets.create_pet(test_user, "Test Pet2", "male", None, "German Shepherd Mix", "https://res.cloudinary.com/hbpupjourney/image/upload/v1644711360/l3jnf1aod2h2bglnzpyi.jpg", None, [])
test_bookmarks_list = crud_bookmarks_lists.create_bookmarks_list(
    "Test List", 1, []
)
test_user2 = crud_users.create_user("Test User 2", "tes2t@test2", "test2")

model.db.session.add_all(hikes_in_db)
model.db.session.add(test_user)
model.db.session.add(test_user2)
model.db.session.add(test_pet1)
model.db.session.add(test_pet2)
model.db.session.add(test_bookmarks_list)

model.db.session.commit()
