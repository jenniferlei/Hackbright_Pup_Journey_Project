"""CRUD operations for Hike Model."""

from model import db, User, Pet, Hike, Comment, CheckIn, BookmarksList, HikeBookmarksList, connect_to_db


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


def get_hikes():
    """Return all hikes."""

    return db.session.query(Hike).all()


def get_hike_by_id(hike_id):
    """Return movie by id.""" 

    return db.session.query(Hike).get(hike_id)


if __name__ == '__main__':
    from server import app
    connect_to_db(app)