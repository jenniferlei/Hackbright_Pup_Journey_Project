"""CRUD operations for Hike Model."""

from sqlalchemy import func
from model import db, Hike, connect_to_db


def create_hike(
    hike_name,
    area,
    difficulty,
    leash_rule,
    description,
    address,
    latitude,
    longitude,
    city,
    state,
    miles,
    path,
    parking,
    resources,
    hike_imgURL,
):
    """Create and return a new hike."""

    hike = Hike(
        hike_name=hike_name,
        area=area,
        difficulty=difficulty,
        leash_rule=leash_rule,
        description=description,
        address=address,
        latitude=latitude,
        longitude=longitude,
        city=city,
        state=state,
        miles=miles,
        path=path,
        parking=parking,
        resources=resources,
        hike_imgURL=hike_imgURL,
    )

    return hike


def get_hikes():
    """Return all hikes."""

    return db.session.query(Hike).order_by(func.lower(Hike.hike_name).asc()).all()

def get_hike_by_id(hike_id):
    """Return hike by id."""

    return db.session.query(Hike).get(hike_id)


def get_hikes_by_advanced_search(
    keyword, difficulties, leash_rules, areas, cities, state, length_min, length_max, parking
):
    """Return hikes by query search"""

    queries = []

    if keyword != "":
        queries.append(Hike.hike_name.ilike(f"%{keyword}%"))
    if difficulties != []:
        queries.append(Hike.difficulty.in_(difficulties))
    if leash_rules != []:
        queries.append(Hike.leash_rule.in_(leash_rules))
    if areas != []:
        queries.append(Hike.area.in_(areas))
    if cities != []:
        queries.append(Hike.city.in_(cities))
    if state != "":
        queries.append(Hike.state == state)
    if length_min != "":
        queries.append(Hike.miles >= length_min)
    if length_max != "":
        queries.append(Hike.miles <= length_max)
    if len(parking) == 1:
        queries.append(Hike.parking.ilike(f"%{parking[0]}%"))
    elif len(parking) == 2:
        queries.append(Hike.parking.ilike(f"%{parking[0]}%") | Hike.parking.ilike(f"%{parking[1]}%"))

    return db.session.query(Hike).filter(*queries).order_by(Hike.hike_name.asc()).all()


def get_hike_by_keyword(keyword):
    """Return hikes by keyword."""

    return db.session.query(Hike).filter(Hike.hike_name.ilike(f"%{keyword}%")).all()


if __name__ == "__main__":
    from server import app

    connect_to_db(app)
