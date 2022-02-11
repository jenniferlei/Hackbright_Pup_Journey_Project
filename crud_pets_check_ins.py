"""CRUD operations for PetCheckIn Model."""

from model import db, User, Pet, Hike, Comment, CheckIn, PetCheckIn, BookmarksList, HikeBookmarksList, connect_to_db


def create_pet_check_in(pet_id, check_in_id):
    """Create and return a new pet check in object."""

    pet_check_in = (PetCheckIn(pet_id=pet_id,
                               check_in_id=check_in_id))

    return pet_check_in


def get_pet_check_in_by_pet_id(pet_id):
    """Return a pet check in object given a pet_id"""

    return (db.session.query(PetCheckIn).filter_by(pet_id = pet_id).all())


def get_pet_check_in_by_pet_id_check_in_id(pet_id, check_in_id):
    """Return a pet check in object given a pet_id and check_in_id"""

    return (db.session.query(PetCheckIn).filter(PetCheckIn.pet_id == pet_id,
                                                PetCheckIn.check_in_id==check_in_id).one())


if __name__ == '__main__':
    from server import app
    connect_to_db(app)