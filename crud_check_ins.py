"""CRUD operations for CheckIn Model."""

from model import db, User, Pet, Hike, Comment, CheckIn, BookmarksList, HikeBookmarksList, connect_to_db
import crud_pets


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


def get_check_ins_by_user_id(user_id):
    """Return all check ins for a given user_id"""

    # Find all pets for a user and return all check ins for each pet
    pets = crud_pets.get_pets_by_user_id(user_id)

    all_check_ins = []

    for pet in pets:
        all_check_ins.extend(db.session.query(CheckIn).filter_by(pet=pet).all())
    
    return all_check_ins


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
    """Return all check ins for a given pet id"""

    check_ins = db.session.query(CheckIn).filter_by(pet_id=pet_id).all()

    return check_ins


def get_check_ins_by_check_in_id(check_in_id):
    """Return a check in for a given check in id"""

    check_in = db.session.query(CheckIn).filter_by(check_in_id=check_in_id).one()

    return check_in


if __name__ == '__main__':
    from server import app
    connect_to_db(app)