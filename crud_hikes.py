"""CRUD operations for Hike Model."""

from model import db, User, Pet, Hike, Comment, CheckIn, PetCheckIn, BookmarksList, HikeBookmarksList, connect_to_db


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

    return db.session.query(Hike).order_by(Hike.hike_name.asc()).all()


def get_hike_by_id(hike_id):
    """Return hike by id."""

    return db.session.query(Hike).get(hike_id)


def get_hikes_by_advanced_search(
    keyword, difficulties, leash_rules, areas, cities, state, length_min, length_max, parking
):

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
    if parking != []:
        queries.append(Hike.parking.in_(parking))

    return db.session.query(Hike).filter(*queries).order_by(Hike.hike_name.asc()).all()


# def get_hike_by_keyword(keyword):
#     """Return hikes by keyword."""

#     return db.session.query(Hike).filter(Hike.hike_name.ilike(f"%{keyword}%")).all()


# def get_hike_by_difficulty(difficulty):
#     """Return hikes by difficulty."""

#     return db.session.query(Hike).filter(Hike.difficulty == difficulty).all()


# def get_hike_by_leash_rule(leash_rule):
#     """Return hikes by leash_rule."""

#     return db.session.query(Hike).filter(Hike.leash_rule == leash_rule).all()


# def get_hike_by_city(city):
#     """Return hikes by city."""

#     return db.session.query(Hike).filter(Hike.city == city).all()


# def get_hike_by_state(state):
#     """Return hikes by state."""

#     return db.session.query(Hike).filter(Hike.state == state).all()


# def get_hike_by_length(length_min, length_max):
#     """Return hikes by length."""

#     return (
#         db.session.query(Hike)
#         .filter(Hike.miles >= length_min, Hike.miles <= length_max)
#         .all()
#     )


def get_hike_states():
    """Return a list of states."""

    return set(db.session.query(Hike.state).all())


def get_hike_cities(state):
    """Return a list of cities for a state."""

    return set(db.session.query(Hike.city).filter(Hike.state == state).all())


def get_hike_areas(state):
    """Return a list of areas for a state."""

    return set(db.session.query(Hike.area).filter(Hike.state == state).all())


def get_hike_parking():
    """Return a list of parking."""

    return set(db.session.query(Hike.parking).all())


if __name__ == "__main__":
    from server import app

    connect_to_db(app)
