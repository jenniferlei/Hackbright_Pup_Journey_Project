"""CRUD operations."""

from model import db, User, Pet, Hike, Comment, BookmarksList,  connect_to_db


def create_user(full_name, email, password):
    """Create and return a new user."""

    user = User(full_name=full_name, email=email, password=password)

    return user


def create_pet(pet_name, gender, birthday, breed1, breed2, pet_imgURL):
    """Create and return a new pet."""

    pet = Pet(pet_name=pet_name, 
                gender=gender, 
                birthday=birthday, 
                breed1=breed1, 
                breed2=breed2, 
                pet_imgURL=pet_imgURL)

    return pet


def create_hike(name, difficulty, leash_rule, description, features, address, area, length, parking, resources, hike_imgURL):
    """Create and return a new hike."""

    hike = Hike(name=name, 
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


def create_hike_pet(hike, pet, date_hiked, date_started, date_completed, miles_completed, total_time):
    """Create and return a new hike completed by a pet."""

    hike_pet = HikePet(hike=hike, 
                        pet=pet, 
                        date_hiked=date_hiked, 
                        date_started=date_started, 
                        date_completed=date_completed, 
                        miles_completed=miles_completed, 
                        total_time=total_time)

    return hike_pet


# def create_bookmarks_list(user, hike, body):
#     """Create and return a new comment."""

#     comment = Comment(user=user, hike=hike, body=body)

#     return comment


def get_hikes():
    """Return all hikes."""

    return Hike.query.all()


def get_hike_by_id(hike_id):
    """Return movie by id.""" 

    return Hike.query.get(hike_id)


def get_users():
    """Return all users."""

    return User.query.all()


def get_user_by_id(user_id):
    """Return user by id.""" 

    return User.query.get(user_id)


def get_user_by_email(email):
    """Return a user by email."""

    return User.query.filter(User.email == email).first()


if __name__ == '__main__':
    from server import app
    connect_to_db(app)