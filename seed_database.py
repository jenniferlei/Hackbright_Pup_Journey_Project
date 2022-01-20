"""Script to seed database."""

import os
import json
from random import choice, randint
from datetime import datetime

import crud
import model
import server

# Run dropdb and createdb to re-create database
os.system('dropdb pupjourney')
os.system('createdb pupjourney')

# Connect to the database and call db.create_all
model.connect_to_db(server.app)
model.db.create_all()

# Load data from data/hikes.json and save it to a variable:
with open('data/hikes.json') as f:
    hike_data = json.loads(f.read())

# Now, hike_data will be a list of dictionaries that look like this:

# [{"name": "Cedar Grove and Vista View Point in Griffith Park", 
#   "difficulty": "TBD", 
#   "leash_rule": "Hikers, dogs", 
#   "description": "This hike on the southeast side of Griffith Park follows paved and unpaved trails to two park attractions, a quiet grove with a picnic area and a helipad with panoramic views", 
#   "features": "",
#   ...},
#   ...
#   ]


# Create hikes, store them in list so we can use them
hikes_in_db = []
for hike in hike_data:
    # unpack hike data
    name, difficulty, leash_rule, description, features, address, area, length, parking, resources, hike_imgURL = (
        hike["name"], 
        hike["difficulty"], 
        hike["leash_rule"], 
        hike["description"], 
        hike["features"], 
        hike["address"], 
        hike["area"], 
        hike["length"], 
        hike["parking"], 
        hike["resources"], 
        hike["hike_imgURL"])

    # create hike variable with create_hike function from crud.py
    db_hike = crud.create_hike(name, difficulty, leash_rule, description, features, address, area, length, parking, resources, hike_imgURL)

    # append db_movie to movies_ind_db list
    hikes_in_db.append(db_hike)

    
model.db.session.add_all(hikes_in_db)


# for n in range(175):
#     email = f'user{n}@test.com'  # Voila! A unique email!
#     password = 'test'

#     user = crud.create_user(email, password)
#     model.db.session.add(user)

#     for _ in range(10):
#         random_movie = choice(movies_in_db)
#         score = randint (1,5)

#         rating = crud.create_rating(user, random_movie, score)
#         model.db.session.add(rating)


model.db.session.commit()