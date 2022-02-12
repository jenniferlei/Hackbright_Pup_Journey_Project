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

    return db.session.query(Hike).all()


def get_hike_by_id(hike_id):
    """Return hike by id."""

    return db.session.query(Hike).get(hike_id)


def get_hikes_by_search(
    keyword, difficulty, leash_rule, area, city, state, length_min, length_max, parking
):

    queries = []

    if keyword != "":
        queries.append(Hike.hike_name.ilike(f"%{keyword}%"))
    if difficulty != "":
        queries.append(Hike.difficulty == difficulty)
    if leash_rule != "":
        queries.append(Hike.leash_rule == leash_rule)
    if area != "":
        queries.append(Hike.area == area)
    if city != "":
        queries.append(Hike.city == city)
    if state != "":
        queries.append(Hike.state == state)
    if length_min != "":
        queries.append(Hike.miles >= length_min)
    if length_max != "":
        queries.append(Hike.miles <= length_max)
    if parking != "":
        queries.append(Hike.parking == parking)

    return db.session.query(Hike).filter(*queries).all()


def get_hike_by_keyword(keyword):
    """Return hikes by keyword."""

    return db.session.query(Hike).filter(Hike.hike_name.ilike(f"%{keyword}%")).all()


def get_hike_by_difficulty(difficulty):
    """Return hikes by difficulty."""

    return db.session.query(Hike).filter(Hike.difficulty == difficulty).all()


def get_hike_by_leash_rule(leash_rule):
    """Return hikes by leash_rule."""

    return db.session.query(Hike).filter(Hike.leash_rule == leash_rule).all()


def get_hike_by_city(city):
    """Return hikes by city."""

    return db.session.query(Hike).filter(Hike.city == city).all()


def get_hike_by_state(state):
    """Return hikes by state."""

    return db.session.query(Hike).filter(Hike.state == state).all()


def get_hike_by_length(length_min, length_max):
    """Return hikes by length."""

    return (
        db.session.query(Hike)
        .filter(Hike.miles >= length_min, Hike.miles <= length_max)
        .all()
    )


def get_hike_states():
    """Return a list of states."""

    hikes = get_hikes()

    states = []

    for hike in hikes:
        if hike.state not in states:
            states.append(hike.state)

    return states


def get_hike_cities():
    """Return a list of cities."""

    hikes = get_hikes()

    cities = []

    for hike in hikes:
        if hike.city not in cities:
            cities.append(hike.city)

    return cities


def get_hike_areas():
    """Return a list of areas."""

    hikes = get_hikes()

    areas = []

    for hike in hikes:
        if hike.area not in areas:
            areas.append(hike.area)

    return areas


def get_hike_parking():
    """Return a list of parking."""

    hikes = get_hikes()

    parkings = []

    for hike in hikes:
        if hike.parking not in parkings:
            parkings.append(hike.parking)

    return parkings


if __name__ == "__main__":
    from server import app

    connect_to_db(app)
