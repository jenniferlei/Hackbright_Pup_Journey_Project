"""Models for pup journey app."""

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class User(db.Model):
    """A user."""

    __tablename__ = "users"

    user_id = db.Column(db.Integer,
                        autoincrement=True,
                        primary_key=True, 
                        nullable=False)
    full_name = db.Column(db.String, 
                        nullable=False)
    email = db.Column(db.String, 
                        unique=True, 
                        nullable=False)
    password = db.Column(db.String, 
                        nullable=False)

    pets = db.relationship("Pet", backref="user")
    bookmarks_lists = db.relationship("BookmarksList", backref="user")

    # comments = a list of Comment objects
        # (db.relationship("User", backref="comments") on Comment model)

    def __repr__(self):
        return f"<User user_id={self.user_id} full_name={self.full_name} email={self.email}>"

class Pet(db.Model):
    """A pet."""

    __tablename__ = "pets"

    pet_id = db.Column(db.Integer,
                        autoincrement=True,
                        primary_key=True, 
                        nullable=False)
    user_id = db.Column(db.Integer, 
                        db.ForeignKey("users.user_id"), 
                        nullable=False)
    pet_name = db.Column(db.String, 
                        nullable=False)
    gender = db.Column(db.Text, 
                        nullable=True)
    birthday = db.Column(db.DateTime, 
                        nullable=True)
    breed1 = db.Column(db.String, 
                        nullable=True)
    breed2 = db.Column(db.String, 
                        nullable=True)
    pet_imgURL = db.Column(db.String,
                        nullable=True)

    # user = User object
        # (db.relationship("Pets", backref="user") on User model)

    # hikes_pets = A list of HikePet objects
        # (db.relationship("Pet", backref="hikes_pets") on HikePet model)

    def __repr__(self):
        return f"<Pet pet_id={self.pet_id} pet_name={self.pet_name}>"


class Hike(db.Model):
    """A hike."""

    __tablename__ = "hikes"

    hike_id = db.Column(db.Integer,
                        autoincrement=True,
                        primary_key=True,
                        nullable=False)
    hike_name = db.Column(db.String,
                        nullable=False)
    difficulty = db.Column(db.String)
    leash_rule = db.Column(db.String)
    description = db.Column(db.Text)
    features = db.Column(db.String)
    address = db.Column(db.Text,
                        nullable=False)
    area = db.Column(db.String)
    length = db.Column(db.String)
    parking = db.Column(db.String)
    resources = db.Column(db.Text)
    hike_imgURL = db.Column(db.String)

    # comments = a list of Comment objects
        # (db.relationship("Hike", backref="comments") on Comment model)

    # hikes_pets = A list of HikePet objects
        # (db.relationship("Pet", backref="hikes_pets") on HikePet model)

    # bookmarks_lists = A list of BookmarksList objects
        # (db.relationship("Hike", secondary="hikes_bookmarks_lists", backref="bookmarks_lists") on BookmarksList model)

    def __repr__(self):
        return f'<Hike hike_id={self.hike_id} hike_name={self.hike_name}>'


class Comment(db.Model):
    """Middle table for a comment on a hike by a user."""

    __tablename__ = "comments"

    comment_id = db.Column(db.Integer,
                        autoincrement=True,
                        primary_key=True)
    hike_id = db.Column(db.Integer, 
                        db.ForeignKey("hikes.hike_id"), 
                        nullable=False)
    user_id = db.Column(db.Integer, 
                        db.ForeignKey("users.user_id"), 
                        nullable=False)
    body = db.Column(db.Text, 
                    nullable=False)

    hike = db.relationship("Hike", backref="comments")
    user = db.relationship("User", backref="comments")


    def __repr__(self):
        return f"<Comment comment_id={self.comment_id} body={self.body}>"


class HikePet(db.Model):
    """Middle table for a hike completed by a pet."""

    __tablename__ = "hikes_pets"

    hike_pet_id = db.Column(db.Integer,
                            autoincrement=True,
                            primary_key=True,
                            nullable=False)
    hike_id = db.Column(db.Integer, 
                        db.ForeignKey("hikes.hike_id"), 
                        nullable=False)
    pet_id = db.Column(db.Integer, 
                        db.ForeignKey("pets.pet_id"), 
                        nullable=False)
    date_hiked = db.Column(db.DateTime,
                            nullable=False)
    date_started = db.Column(db.DateTime,
                            nullable=True)
    date_completed = db.Column(db.DateTime,
                                nullable=True)
    miles_completed = db.Column(db.Float,
                                nullable=True)
    total_time = db.Column(db.Float,
                            nullable=True)

    hike = db.relationship("Hike", backref="hikes_pets")
    pet = db.relationship("Pet", backref="hikes_pets")

    def __repr__(self):
        return f"<Hike completed by pet hike_pet_id={self.hike_pet_id} hike_id={self.hike_id} pet_id={self.pet_id} date_hiked={self.date_hiked}>"


class BookmarksList(db.Model):
    """A bookmarks list with many hikes."""

    __tablename__ = "bookmarks_lists"

    bookmarks_list_id = db.Column(db.Integer,
                        autoincrement=True,
                        primary_key=True,
                        nullable=False)
    bookmarks_list_name = db.Column(db.String,
                        nullable=False)
    user_id = db.Column(db.Integer,
                        db.ForeignKey("users.user_id"),
                        nullable=False)

    hikes = db.relationship("Hike", secondary="hikes_bookmarks_lists", backref="bookmarks_lists")

    def __repr__(self):
        return f"<Bookmarks List bookmarks_list_id={self.bookmarks_list_id} bookmarks_list_name={self.bookmarks_list_name}>"


class HikeBookmarksList(db.Model):
    """Association table for a hike on a bookmarks list."""

    __tablename__ = "hikes_bookmarks_lists"

    hike_bookmarks_list_id = db.Column(db.Integer,
                            autoincrement=True,
                            primary_key=True,
                            nullable=False)
    hike_id = db.Column(db.Integer,
                    db.ForeignKey("hikes.hike_id"),
                    nullable=False)
    bookmarks_list_id = db.Column(db.Integer,
                    db.ForeignKey("bookmarks_lists.bookmarks_list_id"),
                    nullable=False)

    def __repr__(self):
        return f'<Hike on Bookmarks List hike_bookmarks_list_id={self.hike_bookmarks_list_id} hike_id={self.hike_id} bookmarks_list_id={self.bookmarks_list_id}>'


def connect_to_db(flask_app, db_uri="postgresql:///pupjourney", echo=True):
    flask_app.config["SQLALCHEMY_DATABASE_URI"] = db_uri
    flask_app.config["SQLALCHEMY_ECHO"] = echo
    flask_app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.app = flask_app
    db.init_app(flask_app)

    print("Connected to the db!")


if __name__ == "__main__":
    from server import app

    # Call connect_to_db(app, echo=False) if your program output gets
    # too annoying; this will tell SQLAlchemy not to print out every
    # query it executes.

    connect_to_db(app)
