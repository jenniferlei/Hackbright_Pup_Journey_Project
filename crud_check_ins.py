"""CRUD operations for CheckIn Model."""

from sqlalchemy import func
from model import db, User, Pet, Hike, Comment, CheckIn, PetCheckIn, BookmarksList, HikeBookmarksList, connect_to_db
import crud_pets
import crud_pets_check_ins


def create_check_in(hike, pets, date_hiked, miles_completed, total_time, notes):
    """Create and return a new hike completed by a pet."""

    check_in = CheckIn(hike=hike,
                        pets=pets,
                        date_hiked=date_hiked,
                        miles_completed=miles_completed,
                        total_time=total_time,
                        notes=notes)

    return check_in


def get_check_ins_by_user_id(user_id):
    """Return all check ins for a given user_id"""

    # Find all pets for a user
    # Find check ins for each pet and add to a list
    # Convert to a set to remove duplicate Check In objects

    user = (db.session.query(User).filter_by(user_id = user_id)
                                .options(db.joinedload('pets'))
                                .one())

    all_check_ins = []

    for pet in user.pets:
        check_ins = get_check_ins_by_pet_id(pet.pet_id)
        all_check_ins.extend(pet.check_ins)

    all_check_ins = set(all_check_ins)
    
    return list(all_check_ins)


def get_check_ins_by_hike_id(hike_id):
    """Return all check ins for a given hike id"""

    # get list of user's check in objects
    check_ins = db.session.query(CheckIn).filter_by(hike_id=hike_id).order_by(func.lower(CheckIn.date_hiked).desc()).all()

    return sorted_check_ins


def get_check_ins_by_user_id_hike_id(user_id, hike_id):
    """Return all unique check ins for a given user id and hike id"""

    # get list of user's check in objects
    check_ins = (db.session.query(CheckIn).filter_by(hike_id=hike_id)
                                          .options(db.joinedload('pets'))
                                          .all())

    check_in_data = []

    for check_in in check_ins:
        for pet in check_in.pets:
            if pet.user_id == user_id:
                check_in_data.append(check_in)
            
    check_in_data = list(set(check_in_data))
    sorted_check_ins = sorted(check_in_data, key=lambda x: x.date_hiked, reverse=True)
    
    return sorted_check_ins


def get_check_ins_by_pet_id_hike_id(pet_id, hike_id):
    """Return all check ins for a given pet id and hike id"""

    # get list of pet check in objects
    pet_check_ins = crud_pets_check_ins.get_pet_check_in_by_pet_id(pet_id)

    # loop through pet check in objects to get each check in object
    check_ins = []

    for pet_check_in in pet_check_ins:
        check_ins.append(db.session.query(CheckIn).get(pet_check_in.check_in_id))

    return check_ins


def get_check_ins_by_pet_id(pet_id):
    """Return all check ins for a given pet id"""

    pet = (db.session.query(Pet).options(db.joinedload('check_ins'))
                                .get(pet_id))

    check_ins = pet.check_ins

    return check_ins


def get_check_ins_by_check_in_id(check_in_id):
    """Return a check in for a given check in id"""

    check_in = db.session.query(CheckIn).filter_by(check_in_id=check_in_id).one()

    return check_in


if __name__ == '__main__':
    from server import app
    connect_to_db(app)