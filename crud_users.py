"""CRUD operations for User model."""

from model import db, User, connect_to_db


def create_user(full_name, email, password):
    """Create and return a new user."""

    user = User(full_name=full_name,
                email=email,
                password=password)

    return user


def get_user_by_email(email):
    """Return a user by email."""

    return db.session.query(User).filter(User.email == email).first()


if __name__ == '__main__':
    from server import app
    connect_to_db(app)