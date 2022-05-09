"""Models for pup journey app."""

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func

import datetime


db = SQLAlchemy()


class User(db.Model):
    """A user."""

    __tablename__ = "users"

    user_id = db.Column(db.Integer, autoincrement=True, primary_key=True, nullable=False)
    full_name = db.Column(db.String, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)

    pets = db.relationship("Pet", backref="user")
    bookmarks_lists = db.relationship("BookmarksList", backref="user")

    # check_ins = A list of CheckIn objects
    # (db.relationship("User", backref="check_ins") on CheckIn model)

    # comments = a list of Comment objects
    # (db.relationship("User", backref="comments") on Comment model)

    def __repr__(self):
        return f"<User user_id={self.user_id} full_name={self.full_name} email={self.email}>"

    @classmethod
    def create_user(cls, full_name, email, password):
        """Create and return a new user."""

        user = cls(full_name=full_name,
                    email=email,
                    password=password)

        return user

    @classmethod
    def get_user_by_email(cls, email):
        """Return a user by email."""

        return db.session.query(cls).filter(cls.email == email).first()


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

    @classmethod
    def create_pet(cls, user, pet_name, gender, birthday, breed, pet_imgURL, img_public_id, check_ins):
        """Create and return a new pet."""

        pet = cls(user=user,
                pet_name=pet_name,
                gender=gender,
                birthday=birthday,
                breed=breed,
                pet_imgURL=pet_imgURL,
                img_public_id=img_public_id,
                check_ins=check_ins)

        return pet

    @classmethod
    def get_pets_by_user_id(cls, user_id):
        """Return all pets by user_id."""

        return (db.session.query(cls).filter_by(user_id=user_id).order_by(cls.pet_name.asc()).all())

    @classmethod
    def get_pet_by_id(cls, pet_id):
        """Return a pet by id"""

        return db.session.query(cls).get(pet_id)

    @classmethod
    def get_check_ins_by_pet_id(cls, pet_id):
        """Return all check ins for a given pet id"""

        pet = (db.session.query(cls)
                         .options(db.joinedload('check_ins'))
                         .get(pet_id))

        return pet.check_ins


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

    @classmethod
    def create_hike(cls, hike_name, area, difficulty,leash_rule, description, address, \
        latitude, longitude, city, state, miles, path, parking, resources, hike_imgURL):
        """Create and return a new hike."""

        hike = cls(
            hike_name=hike_name,
            area=area,
            difficulty=difficulty,
            leash_rule=leash_rule,
            description=description,
            address=address,
            latitude=latitude,
            longitude=longitude,
            city=city,
            state=state,
            miles=miles,
            path=path,
            parking=parking,
            resources=resources,
            hike_imgURL=hike_imgURL,
        )

        return hike

    @classmethod
    def get_hikes(cls):
        """Return all hikes."""

        return db.session.query(cls).order_by(func.lower(cls.hike_name).asc()).all()

    @classmethod
    def get_hike_by_id(cls, hike_id):
        """Return hike by id."""

        return db.session.query(cls).get(hike_id)

    @classmethod
    def get_hikes_by_advanced_search(cls, keyword, difficulties, leash_rules, areas, cities, state, length_min, length_max, parking
    ):
        """Return hikes by query search"""

        queries = []

        if keyword != "":
            queries.append(cls.hike_name.ilike(f"%{keyword}%"))
        if difficulties != []:
            queries.append(cls.difficulty.in_(difficulties))
        if leash_rules != []:
            queries.append(cls.leash_rule.in_(leash_rules))
        if areas != []:
            queries.append(cls.area.in_(areas))
        if cities != []:
            queries.append(cls.city.in_(cities))
        if state != "":
            queries.append(cls.state == state)
        if length_min != "":
            queries.append(cls.miles >= length_min)
        if length_max != "":
            queries.append(cls.miles <= length_max)
        if len(parking) == 1:
            queries.append(cls.parking.ilike(f"%{parking[0]}%"))
        elif len(parking) == 2:
            queries.append(cls.parking.ilike(f"%{parking[0]}%") | cls.parking.ilike(f"%{parking[1]}%"))

        return db.session.query(cls).filter(*queries).order_by(cls.hike_name.asc()).all()

    @classmethod
    def get_hike_by_keyword(cls, keyword):
        """Return hikes by keyword."""

        return db.session.query(cls).filter(cls.hike_name.ilike(f"%{keyword}%")).all()


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

    @classmethod
    def create_comment(cls, user, hike, body, date_created, edit, date_edited):
        """Create and return a new comment."""

        comment = cls(user=user,
                      hike=hike,
                      body=body,
                      date_created=date_created,
                      edit=edit,
                      date_edited=date_edited)

        return comment

    @classmethod
    def get_comment_by_user_id(cls, user_id):
        """Return all comments by user_id."""

        return (db.session.query(cls)
                          .filter_by(user_id=user_id)
                          .order_by(cls.date_created.desc())
                          .all())

    @classmethod
    def get_comment_by_hike_id(cls, hike_id):
        """Return all comments by hike_id."""

        return (db.session.query(cls)
                          .filter_by(hike_id=hike_id)
                          .order_by(cls.date_created.desc())
                          .all())

    @classmethod
    def get_comment_by_comment_id(cls, comment_id):
        """Return comment by comment_id."""

        return db.session.query(cls).filter_by(comment_id=comment_id).one()


class CheckIn(db.Model):
    """Pet check in for a hike."""

    __tablename__ = "check_ins"

    check_in_id = db.Column(
        db.Integer, autoincrement=True, primary_key=True, nullable=False
    )
    hike_id = db.Column(db.Integer, db.ForeignKey("hikes.hike_id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.user_id"), nullable=False)
    date_hiked = db.Column(db.Date, nullable=False)
    miles_completed = db.Column(db.Float, nullable=False)
    total_time = db.Column(db.Float, nullable=True)
    notes = db.Column(db.Text, nullable=True)

    hike = db.relationship("Hike", backref="check_ins")
    user = db.relationship("User", backref="check_ins")

    pets = db.relationship(
        "Pet", secondary="pets_check_ins", backref="check_ins"
    )

    def __repr__(self):
        return (f"<Check In check_in_id={self.check_in_id} user_id={self.user_id} \
                hike_id={self.hike_id} date_hiked={self.date_hiked}>")

    @classmethod
    def create_check_in(cls, user, hike, pets, date_hiked, miles_completed, total_time, notes):
        """Create and return a new hike completed by a pet."""

        check_in = cls(user=user,
                       hike=hike,
                       pets=pets,
                       date_hiked=date_hiked,
                       miles_completed=miles_completed,
                       total_time=total_time,
                       notes=notes)

        return check_in

    @classmethod
    def get_check_in_by_check_in_id(cls, check_in_id):
        """Return all check ins for a given check in id"""

        return db.session.query(cls).get(check_in_id)

    @classmethod
    def get_check_ins_by_hike_id(cls, hike_id):
        """Return all check ins for a given hike id"""

        return (db.session.query(cls)
                          .filter_by(hike_id=hike_id)
                          .order_by(cls.date_hiked.desc())
                          .all())

    @classmethod
    def get_check_ins_by_user_id(cls, user_id):
        """Return all check ins for a given user_id"""
        
        return (db.session.query(cls)
                               .filter_by(user_id=user_id)
                               .order_by(cls.date_hiked.desc())
                               .all())

    @classmethod
    def get_check_ins_by_user_id_hike_id(cls, user_id, hike_id):
        """Return all unique check ins for a given user id and hike id"""

        return (db.session.query(cls)
                               .filter_by(hike_id=hike_id)
                               .filter_by(user_id=user_id)
                               .order_by(cls.date_hiked.desc())
                               .all())

    @classmethod
    def get_check_ins_by_check_in_id(cls, check_in_id):
        """Return a check in for a given check in id"""

        return db.session.query(cls).filter_by(check_in_id=check_in_id).one()


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

    @classmethod
    def create_bookmarks_list(cls, bookmarks_list_name, user_id, hikes):
        """Create and return a new bookmarks list."""

        return (cls(bookmarks_list_name=bookmarks_list_name,
                    user_id=user_id,
                    hikes=hikes))

    @classmethod
    def get_bookmarks_list_by_bookmarks_list_id(cls, bookmarks_list_id):
        """Get a bookmarks list by bookmarks_list_id."""

        return (db.session.query(cls)
                          .options(db.joinedload('hikes'))
                          .get(bookmarks_list_id))

    @classmethod
    def get_bookmarks_lists_by_user_id(cls, user_id):
        """Return all bookmarks lists by user_id."""

        return (db.session.query(cls)
                          .filter_by(user_id=user_id)
                          .order_by(func.lower(cls.bookmarks_list_name).asc())
                          .all())

    @classmethod
    def get_bookmarks_lists_by_user_id_and_hike_id(cls, user_id, hike_id):
        """Return all bookmarks lists objects for a given user_id and hike_id."""

        # List of Bookmarks List objects for a given user_id
        user_bookmarks_lists = (db.session.query(cls)
                                          .options(db.joinedload('hikes'))
                                          .filter_by(user_id=user_id)
                                          .order_by(func.lower(cls.bookmarks_list_name).asc())
                                          .all())
        
        hike = db.session.query(Hike).get(hike_id)

        hike_user_bookmarks_lists = []

        for bookmarks_list in user_bookmarks_lists:
            if hike in bookmarks_list.hikes:
                hike_user_bookmarks_lists.append(bookmarks_list)
            
        return hike_user_bookmarks_lists


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

    @classmethod
    def create_pet_check_in(cls, pet_id, check_in_id):
        """Create and return a new pet check in object."""

        pet_check_in = (cls(pet_id=pet_id,
                                check_in_id=check_in_id))

        return pet_check_in

    @classmethod
    def get_pet_check_in_by_pet_id_check_in_id(cls, pet_id, check_in_id):
        """Return a pet check in object given a pet_id and check_in_id"""

        return (db.session.query(cls)
                          .filter(cls.pet_id == pet_id, cls.check_in_id==check_in_id)
                          .one())


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
        return f"<Hike Bookmark hike_bookmarks_list_id={self.hike_bookmarks_list_id} hike_id={self.hike_id} bookmarks_list_id={self.bookmarks_list_id}>"

    @classmethod
    def create_hike_bookmarks_list(cls, hike_id, bookmarks_list_id):
        """Create and return a new hike bookmarks list object."""

        hike_bookmarks_list = (cls(hike_id=hike_id, bookmarks_list_id=bookmarks_list_id))

        return hike_bookmarks_list

    @classmethod
    def get_hike_bookmarks_list_by_hike_id_bookmarks_list_id(cls, hike_id, bookmarks_list_id):
        """Return a list of hike bookmarks objects given a hike_id and bookmarks_list_id"""

        return (db.session.query(cls).filter(cls.hike_id==hike_id,
                                             cls.bookmarks_list_id==bookmarks_list_id).all())

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
    test_check_in = CheckIn(user=test_user, hike=test_hike, pets=[test_pet], date_hiked=datetime.datetime(2022, 3, 12, 0, 0), miles_completed=2.3, total_time=1.5, notes="Fun hike with great views!")
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
