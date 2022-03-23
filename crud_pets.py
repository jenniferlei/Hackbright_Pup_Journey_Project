"""CRUD operations for Pet model."""

from model import db, Pet, connect_to_db


def create_pet(user, pet_name, gender, birthday, breed, pet_imgURL, img_public_id, check_ins):
    """Create and return a new pet."""

    pet = Pet(user=user,
            pet_name=pet_name,
            gender=gender,
            birthday=birthday,
            breed=breed,
            pet_imgURL=pet_imgURL,
            img_public_id=img_public_id,
            check_ins=check_ins)

    return pet


def get_pets_by_user_id(user_id):
    """Return all pets by user_id."""

    return (db.session.query(Pet).filter_by(user_id=user_id).order_by(Pet.pet_name.asc()).all())


def get_pet_by_id(pet_id):
    """Return a pet by id"""

    return db.session.query(Pet).get(pet_id)


if __name__ == '__main__':
    from server import app
    connect_to_db(app)