"""CRUD operations for HikeBookmarksList Model."""

from model import db, User, Pet, Hike, Comment, CheckIn, PetCheckIn, BookmarksList, HikeBookmarksList, connect_to_db


def create_hike_bookmarks_list(hike_id, bookmarks_list_id):
    """Create and return a new hike bookmarks list object."""

    hike_bookmarks_list = (HikeBookmarksList(hike_id=hike_id,
                                            bookmarks_list_id=bookmarks_list_id))

    return hike_bookmarks_list


def get_hike_bookmarks_list_by_hike_id_bookmarks_list_id(hike_id, bookmarks_list_id):
    """Return a hike bookmarks list object given a hike_id and bookmarks_list_id"""

    return (db.session.query(HikeBookmarksList).filter(HikeBookmarksList.hike_id==hike_id,
                                                        HikeBookmarksList.bookmarks_list_id==bookmarks_list_id).all())


if __name__ == '__main__':
    from server import app
    connect_to_db(app)