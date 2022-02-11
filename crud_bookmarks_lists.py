"""CRUD operations for BookmarksList Model."""

from model import db, User, Pet, Hike, Comment, CheckIn, PetCheckIn, BookmarksList, HikeBookmarksList, connect_to_db


def create_bookmarks_list(bookmarks_list_name, user_id, hikes):
    """Create and return a new bookmarks list."""

    bookmarks_list = (BookmarksList(bookmarks_list_name=bookmarks_list_name,
                                    user_id=user_id,
                                    hikes=hikes))

    return bookmarks_list


def get_bookmarks_list_by_bookmarks_list_id(bookmarks_list_id):
    """Get a bookmarks list by bookmarks_list_id."""
    
    return db.session.query(BookmarksList).filter_by(bookmarks_list_id=bookmarks_list_id).one()


def get_bookmarks_lists_by_user_id(user_id):
    """Return all bookmarks lists by user_id."""

    return db.session.query(BookmarksList).filter_by(user_id=user_id).all()


def get_names_of_bookmarks_lists_by_user_id(user_id):
    """Return list of all names of bookmarks lists by user_id."""

    bookmarks_lists_names = []

    bookmarks_lists_by_user = get_bookmarks_lists_by_user_id(user_id)

    for bookmarks_lists in bookmarks_lists_by_user:
        bookmarks_lists_names.append(bookmarks_lists.bookmarks_list_name)

    return bookmarks_lists_names
    

def get_bookmarks_list_by_user_id_and_bookmarks_list_name(user_id, bookmarks_list_name):
    """Return bookmarks list by bookmarks_list_name."""

    bookmarks_lists_by_user = (db.session.query(BookmarksList)
                                        .filter(BookmarksList.user_id==user_id,
                                                BookmarksList.bookmarks_list_name==bookmarks_list_name)
                                        .one())

    return bookmarks_lists_by_user


def get_bookmarks_lists_by_user_id_and_hike_id(user_id, hike_id):
    """Return all bookmarks lists objects for a given user_id and hike_id."""

    # Find all bookmarks lists for a given user_id
    user_bookmarks_lists = (db.session.query(BookmarksList)
                                .options(db.joinedload('hikes'))
                                .filter_by(user_id=user_id)
                                .all())


    # For each list, check if there is a hike that matches the given hike_id
    # If so, add the bookmark list to a new list of bookmark lists and return this list

    hike_user_bookmarks_lists = []

    for bookmarks_list in user_bookmarks_lists:
        for hike in bookmarks_list.hikes:
            if hike.hike_id == hike_id:
                hike_user_bookmarks_lists.append(bookmarks_list)
        
    return hike_user_bookmarks_lists


if __name__ == '__main__':
    from server import app
    connect_to_db(app)