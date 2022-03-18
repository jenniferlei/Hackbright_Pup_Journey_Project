"""Models for pup journey app."""

from flask import Flask
from flask_sqlalchemy import SQLAlchemy

import datetime


db = SQLAlchemy()


class User(db.Model):
    """A user."""

    __tablename__ = "users"

    user_id = db.Column(
        db.Integer, autoincrement=True, primary_key=True, nullable=False
    )
    full_name = db.Column(db.String, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)

    pets = db.relationship("Pet", backref="user")
    bookmarks_lists = db.relationship("BookmarksList", backref="user")

    # comments = a list of Comment objects
    # (db.relationship("User", backref="comments") on Comment model)

    def __repr__(self):
        return f"<User user_id={self.user_id} full_name={self.full_name} email={self.email}>"


class Pet(db.Model):
    """A pet."""

    __tablename__ = "pets"

    pet_id = db.Column(db.Integer, autoincrement=True, primary_key=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.user_id"), nullable=False)
    pet_name = db.Column(db.Text, nullable=False)
    gender = db.Column(db.String, nullable=True)
    birthday = db.Column(db.Date, nullable=True)
    breed = db.Column(db.String, nullable=True)
    pet_imgURL = db.Column(db.String, nullable=True)
    img_public_id = db.Column(db.String, nullable=True)

    # user = User object
    # (db.relationship("Pets", backref="user") on User model)

    # check_ins = list of CheckIn objects
    # (db.relationship("Pet", secondary="pets_check_ins", backref="check_ins") on CheckIn model)

    def __repr__(self):
        return f"<Pet pet_id={self.pet_id} pet_name={self.pet_name}>"


class Hike(db.Model):
    """A hike."""

    __tablename__ = "hikes"

    hike_id = db.Column(
        db.Integer, autoincrement=True, primary_key=True, nullable=False
    )
    hike_name = db.Column(db.String, nullable=False)
    area = db.Column(db.String)
    difficulty = db.Column(db.String)
    leash_rule = db.Column(db.String)
    description = db.Column(db.Text)
    latitude = db.Column(db.String)
    longitude = db.Column(db.String)
    address = db.Column(db.Text, nullable=False)
    city = db.Column(db.String)
    state = db.Column(db.String)
    miles = db.Column(db.Float)
    path = db.Column(db.String)
    parking = db.Column(db.String)
    resources = db.Column(db.Text)
    hike_imgURL = db.Column(db.String)

    # comments = a list of Comment objects
    # (db.relationship("Hike", backref="comments") on Comment model)

    # check_ins = A list of CheckIn objects
    # (db.relationship("Pet", backref="check_ins") on CheckIn model)

    # bookmarks_lists = A list of BookmarksList objects
    # (db.relationship("Hike", secondary="hikes_bookmarks_lists", backref="bookmarks_lists") on BookmarksList model)

    def __repr__(self):
        return f"<Hike hike_id={self.hike_id} hike_name={self.hike_name}>"


class Comment(db.Model):
    """User comment on a hike."""

    __tablename__ = "comments"

    comment_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    hike_id = db.Column(db.Integer, db.ForeignKey("hikes.hike_id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.user_id"), nullable=False)
    body = db.Column(db.Text, nullable=False)
    date_created = db.Column(db.DateTime, nullable=False)
    edit = db.Column(db.Boolean, default=False, nullable=False)
    date_edited = db.Column(db.DateTime, default=None, nullable=True)

    hike = db.relationship("Hike", backref="comments")
    user = db.relationship("User", backref="comments")

    def __repr__(self):
        return f"<Comment comment_id={self.comment_id} body={self.body}>"


class CheckIn(db.Model):
    """Pet check in for a hike."""

    __tablename__ = "check_ins"

    check_in_id = db.Column(
        db.Integer, autoincrement=True, primary_key=True, nullable=False
    )
    hike_id = db.Column(db.Integer, db.ForeignKey("hikes.hike_id"), nullable=False)
    date_hiked = db.Column(db.Date, nullable=False)
    miles_completed = db.Column(db.Float, nullable=False)
    total_time = db.Column(db.Float, nullable=True)
    notes = db.Column(db.Text, nullable=True)

    hike = db.relationship("Hike", backref="check_ins")

    pets = db.relationship(
        "Pet", secondary="pets_check_ins", backref="check_ins"
    )

    def __repr__(self):
        return f"<Check In check_in_id={self.check_in_id} hike_id={self.hike_id} date_hiked={self.date_hiked}>"


class BookmarksList(db.Model):
    """A bookmarks list with many hikes."""

    __tablename__ = "bookmarks_lists"

    bookmarks_list_id = db.Column(
        db.Integer, autoincrement=True, primary_key=True, nullable=False
    )
    bookmarks_list_name = db.Column(db.String, unique=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.user_id"), nullable=False)

    hikes = db.relationship(
        "Hike", secondary="hikes_bookmarks_lists", backref="bookmarks_lists"
    )

    def __repr__(self):
        return f"<Bookmarks List bookmarks_list_id={self.bookmarks_list_id} bookmarks_list_name={self.bookmarks_list_name}>"


class PetCheckIn(db.Model):
    """Association table for a pet on a check in."""

    __tablename__ = "pets_check_ins"

    pet_check_in_id = db.Column(
        db.Integer, autoincrement=True, primary_key=True, nullable=False
    )
    pet_id = db.Column(db.Integer, db.ForeignKey("pets.pet_id"), nullable=False)
    check_in_id = db.Column(
        db.Integer, db.ForeignKey("check_ins.check_in_id"), nullable=False
    )

    def __repr__(self):
        return f"<Pet on Check In pet_check_in_id={self.pet_check_in_id} pet_id={self.pet_id} check_in_id={self.check_in_id}>"


class HikeBookmarksList(db.Model):
    """Association table for a hike on a bookmarks list."""

    __tablename__ = "hikes_bookmarks_lists"

    hike_bookmarks_list_id = db.Column(
        db.Integer, autoincrement=True, primary_key=True, nullable=False
    )
    hike_id = db.Column(db.Integer, db.ForeignKey("hikes.hike_id"), nullable=False)
    bookmarks_list_id = db.Column(
        db.Integer, db.ForeignKey("bookmarks_lists.bookmarks_list_id"), nullable=False
    )

    # hike
    # bookmarks_list

    def __repr__(self):
        return f"<Hike on Bookmarks List hike_bookmarks_list_id={self.hike_bookmarks_list_id} hike_id={self.hike_id} bookmarks_list_id={self.bookmarks_list_id}>"


def connect_to_db(flask_app, db_uri="postgresql:///pupjourney", echo=True):
    flask_app.config["SQLALCHEMY_DATABASE_URI"] = db_uri
    flask_app.config["SQLALCHEMY_ECHO"] = echo
    flask_app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    
    db.app = flask_app
    db.init_app(flask_app)

    print("Connected to the db!")


def example_data():
    """Create example data for the test database."""
    
    test_hike = Hike(
        hike_name="Cedar Grove and Vista View Point in Griffith Park",
        area="Los Angeles Area - Griffith Park",
        difficulty="easy",
        leash_rule="On leash",
        description="This hike on the southeast side of Griffith Park follows paved and unpaved trails to two park attractions, a quiet grove with a picnic area and a helipad with panoramic views",
        address="2650 N Commonwealth Avenue, Los Angeles, CA 90027",
        latitude="34.11865",
        longitude="-118.28615",
        city="Los Angeles",
        state="California",
        miles=2.3,
        path="loop",
        parking="Free",
        resources="https://www.hikespeak.com/trails/cedar-grove-vista-view-point-griffith-park/",
        hike_imgURL="",
    )
    test_user = User(full_name="Test User 1", email="test@test", password="test")
    test_pet = Pet(user=test_user, pet_name="Test Pet 1", gender="female", birthday=datetime.datetime(2014, 11, 10, 0, 0), breed="Shiba Inu", pet_imgURL="https://res.cloudinary.com/hbpupjourney/image/upload/v1644612543/hvtridjccxxvvsiqgoi6.jpg", img_public_id=None, check_ins=[])
    test_check_in = CheckIn(hike=test_hike, pets=[test_pet], date_hiked=datetime.datetime(2022, 3, 12, 0, 0), miles_completed=2.3, total_time=1.5, notes="Fun hike with great views!")
    test_comment = Comment(user=test_user, hike=test_hike, body="Great hike! Would recommend", date_created=datetime.datetime.now(), edit=False, date_edited=None)
    test_bookmarks_list = BookmarksList(bookmarks_list_name="Test List", user_id=1, hikes=[test_hike])
    
    db.session.add_all([test_hike, test_user, test_pet, test_comment, test_bookmarks_list])
    db.session.commit()


if __name__ == "__main__":

    from server import app

    # Call connect_to_db(app, echo=False) if your program output gets
    # too annoying; this will tell SQLAlchemy not to print out every
    # query it executes.

    connect_to_db(app)
