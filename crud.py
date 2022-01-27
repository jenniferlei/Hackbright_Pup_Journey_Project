"""CRUD operations."""

from model import db, User, Pet, Hike, Comment, CheckIn, BookmarksList, HikeBookmarksList, connect_to_db


def create_user(full_name, email, password):
    """Create and return a new user."""

    user = User(full_name=full_name,
                email=email,
                password=password)

    return user


def create_pet(user, pet_name, gender, birthday, breed, pet_imgURL, check_ins):
    """Create and return a new pet."""

    pet = Pet(user=user,
            pet_name=pet_name,
            gender=gender,
            birthday=birthday,
            breed=breed,
            pet_imgURL=pet_imgURL,
            check_ins=check_ins)

    return pet


def delete_pet(pet):
    """Delete a pet."""
    
    pass


def edit_pet():
    """Edit a pet."""
    pass


def create_hike(hike_name, difficulty, leash_rule, description, features, address, area, length, parking, resources, hike_imgURL):
    """Create and return a new hike."""

    hike = Hike(hike_name=hike_name,
                difficulty=difficulty,
                leash_rule=leash_rule,
                description=description,
                features=features,
                address=address,
                area=area,
                length=length,
                parking=parking,
                resources=resources,
                hike_imgURL=hike_imgURL)

    return hike


def create_comment(user, hike, body):
    """Create and return a new comment."""

    comment = Comment(user=user, hike=hike, body=body)

    return comment


def delete_comment():
    """Delete a comment."""
    pass


def edit_comment():
    """Edit a comment."""
    pass


def get_comment_by_hike_id(hike_id):
    """Return all comments by hike_id."""

    return db.session.query(Comment).filter_by(hike_id=hike_id)


def create_check_in(hike, pet, date_hiked, date_started, date_completed, miles_completed, total_time):
    """Create and return a new hike completed by a pet."""

    check_in = CheckIn(hike=hike,
                        pet=pet,
                        date_hiked=date_hiked,
                        date_started=date_started,
                        date_completed=date_completed,
                        miles_completed=miles_completed,
                        total_time=total_time)

    return check_in


def edit_check_in():
    """Edit a check in."""
    pass


def create_bookmarks_list(bookmarks_list_name, user_id, hikes):
    """Create and return a new bookmarks list."""

    bookmarks_list = (BookmarksList(bookmarks_list_name=bookmarks_list_name,
                                    user_id=user_id,
                                    hikes=hikes))

    return bookmarks_list


def delete_bookmarks_list():
    """Delete a bookmarks list."""
    pass


def edit_bookmarks_list():
    """Edit a bookmarks list."""
    pass


def create_hike_bookmarks_list(hike_id, bookmarks_list_id):
    """Create and return a new hike bookmarks list object."""

    hike_bookmarks_list = (HikeBookmarksList(hike_id=hike_id,
                                            bookmarks_list_id=bookmarks_list_id))

    return hike_bookmarks_list


def delete_hike_bookmarks_list():
    """Delete a hike from a bookmarks list."""
    pass


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


def get_check_ins_by_user_id_and_hike_id(user_id, hike_id):
    """Return all check ins for a given hike_id and user_id"""

    # Find all check ins for a given hike_id
    hike_check_ins = (db.session.query(CheckIn)
                                .options(db.joinedload('pet'))
                                .filter_by(hike_id=hike_id)
                                .all())

    # For each check in, check each pet with user_id matching given user_id
    # If so, add the check to a new list of check ins
    hike_pet_check_ins = []

    for hike_check_in in hike_check_ins:
        if hike_check_in.pet.user_id == user_id:
            hike_pet_check_ins.append(hike_check_in)

    return hike_pet_check_ins


def get_check_ins_by_pet_id(pet_id):
    """Return all check ins for a give pet"""

    check_ins = db.session.query(CheckIn).filter_by(pet_id=pet_id).all()

    return check_ins


def get_hikes():
    """Return all hikes."""

    return db.session.query(Hike).all()


def get_hike_by_id(hike_id):
    """Return movie by id.""" 

    return db.session.query(Hike).get(hike_id)


def get_users():
    """Return all users."""

    return db.session.query(User).all()


def get_user_by_id(user_id):
    """Return user by id.""" 

    return db.session.query(User).get(user_id)


def get_user_by_email(email):
    """Return a user by email."""

    return db.session.query(User).filter(User.email == email).first()


def get_pets_by_user_id(user_id):
    """Return all pets by user_id."""

    return db.session.query(Pet).filter_by(user_id=user_id).all()


def get_pet_by_id(pet_id):
    """Return a pet by id"""

    return db.session.query(Pet).get(pet_id)


if __name__ == '__main__':
    from server import app
    connect_to_db(app)