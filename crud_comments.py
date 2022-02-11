"""CRUD operations for Comment model."""

from model import db, User, Pet, Hike, Comment, CheckIn, PetCheckIn, BookmarksList, HikeBookmarksList, connect_to_db


def create_comment(user, hike, body, date_created, edit, date_edited):
    """Create and return a new comment."""

    comment = Comment(user=user,
                    hike=hike,
                    body=body,
                    date_created=date_created,
                    edit=edit,
                    date_edited=date_edited)

    return comment


def edit_comment():
    """Edit a comment."""
    pass


def get_comment_by_hike_id(hike_id):
    """Return all comments by hike_id."""

    return db.session.query(Comment).filter_by(hike_id=hike_id)


def get_comment_by_comment_id(comment_id):
    """Return all comments by hike_id."""

    return db.session.query(Comment).filter_by(comment_id=comment_id).one()


if __name__ == '__main__':
    from server import app
    connect_to_db(app)