"""Models for pup journey app."""

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from marshmallow import fields

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql:///pupjourney"
app.config["SQLALCHEMY_ECHO"] = True
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False


db = SQLAlchemy(app)
ma = Marshmallow(app)


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

    check_ins = db.relationship("CheckIn", backref="pet", cascade="all, delete-orphan")

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
    pet_id = db.Column(db.Integer, db.ForeignKey("pets.pet_id"), nullable=False)
    date_hiked = db.Column(db.Date, nullable=False)
    date_started = db.Column(db.Date, nullable=True)
    date_completed = db.Column(db.Date, nullable=True)
    miles_completed = db.Column(db.Float, nullable=True)
    total_time = db.Column(db.Float, nullable=True)

    hike = db.relationship("Hike", backref="check_ins")

    # pet = a Pet object
    # (db.relationship("CheckIn", backref="pet") on pet Model)

    def __repr__(self):
        return f"<Hike completed by pet check_in_id={self.check_in_id} hike_id={self.hike_id} pet_id={self.pet_id} date_hiked={self.date_hiked}>"


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

    def __repr__(self):
        return f"<Hike on Bookmarks List hike_bookmarks_list_id={self.hike_bookmarks_list_id} hike_id={self.hike_id} bookmarks_list_id={self.bookmarks_list_id}>"


class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        load_instance = True

    # Make sure to use the 'only' or 'exclude'
    # to avoid infinite recursion
    pets = fields.List(fields.Nested("PetSchema", exclude=("user",)))
    bookmarks_lists = fields.List(fields.Nested("BookmarksListSchema", exclude=("user",)))
    comments = fields.List(fields.Nested("CommentSchema", exclude=("user",)))

class PetSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Pet
        include_fk = True
        load_instance = True
    check_ins = fields.List(fields.Nested("CheckInSchema", exclude=("pet",)))

class HikeSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Hike
        load_instance = True

    comments = fields.List(fields.Nested("CommentSchema", exclude=("hike",)))
    check_ins = fields.List(fields.Nested("CheckInSchema", exclude=("hike",)))
    bookmarks_lists = fields.List(fields.Nested("BookmarksListSchema", exclude=("hike",)))


class CommentSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Comment
        include_fk = True
        load_instance = True

    hike = fields.Nested(HikeSchema)
    user = fields.Nested(UserSchema)

class CheckInSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = CheckIn
        include_fk = True
        load_instance = True

    hike = fields.Nested(HikeSchema(only=("hike_name",)))
    pet = fields.Nested(PetSchema(only=("pet_name",)))


class BookmarksListSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = BookmarksList
        include_fk = True
        load_instance = True

    hike = fields.Nested(HikeSchema(only=("hike_name", "hike_id")))


class HikeBookmarksListSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = HikeBookmarksList
        include_fk = True
        load_instance = True


def connect_to_db(flask_app):
    

    ma.app = flask_app
    db.app = flask_app
    db.init_app(flask_app)
    ma.init_app(flask_app)

    print("Connected to the db!")


if __name__ == "__main__":

    # Call connect_to_db(app, echo=False) if your program output gets
    # too annoying; this will tell SQLAlchemy not to print out every
    # query it executes.

    connect_to_db(app)
