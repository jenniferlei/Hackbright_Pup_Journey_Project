"""Server for movie ratings app."""

from flask import (Flask, render_template, request, flash, session,
                   redirect)
import cloudinary.uploader
import os

from model import connect_to_db, db
import crud

from jinja2 import StrictUndefined

CLOUDINARY_KEY = os.environ["CLOUDINARY_KEY"]
CLOUDINARY_SECRET = os.environ["CLOUDINARY_SECRET"]
CLOUD_NAME = "hbpupjourney"

app = Flask(__name__)
app.secret_key = "dev"
app.jinja_env.undefined = StrictUndefined


@app.route("/")
def homepage():
    """View homepage."""

    logged_in_email = session.get("user_email")

    if logged_in_email is None:
        return render_template("homepage.html")
    else:
        user = crud.get_user_by_email(logged_in_email)
        pets = crud.get_pets_by_user_id(user.user_id)
        return render_template("homepage.html", pets=pets)


@app.route("/hikes")
def all_hikes():
    """View all hikes."""

    hikes = crud.get_hikes()

    return render_template("all_hikes.html", hikes=hikes)


@app.route("/hikes/<hike_id>")
def show_hike(hike_id):
    """Show details on a particular hike."""

    hike = crud.get_hike_by_id(hike_id)
    hike_resources = hike.resources.split(",")
    comments = crud.get_comment_by_hike_id(hike_id)

    logged_in_email = session.get("user_email")

    if logged_in_email is None:
        
        return (render_template("hike_details.html", hike=hike,
                                                    hike_resources=hike_resources,
                                                    comments=comments))
    else:
        user = crud.get_user_by_email(logged_in_email)
        pets = crud.get_pets_by_user_id(user.user_id)
        check_ins = crud.get_check_ins_by_user_id_and_hike_id(user.user_id, hike.hike_id)

        sorted_check_ins = sorted(check_ins, key=lambda x: x.date_hiked, reverse=True)

        bookmarks_list_by_user = crud.get_bookmarks_lists_by_user_id(user.user_id)
        bookmarks_lists_by_user_hike = crud.get_bookmarks_lists_by_user_id_and_hike_id(user.user_id, hike.hike_id)
        
        return (render_template("hike_details.html", hike=hike,
                                                    hike_resources=hike_resources,
                                                    comments=comments,
                                                    pets=pets,
                                                    check_ins=sorted_check_ins,
                                                    bookmarks_list_by_user=bookmarks_list_by_user,
                                                    bookmarks_lists_by_user_hike=bookmarks_lists_by_user_hike))


@app.route("/bookmarks")
def all_bookmarks():
    """View all bookmarks."""

    if "user_email" in session:
        user = crud.get_user_by_email(session["user_email"])
        bookmarks_lists = crud.get_bookmarks_lists_by_user_id(user.user_id)

        return render_template("all_bookmarks.html", bookmarks_lists=bookmarks_lists)
    else:
        flash("You must log in to view your bookmarks.")
        return redirect("/")


@app.route("/add-bookmarks-list", methods=["POST"])
def add_bookmarks_list():
    """Create a bookmark list"""

    if "user_email" in session:
        user = crud.get_user_by_email(session["user_email"])
        user_id = user.user_id
        bookmarks_list_name = request.form.get("bookmarks_list_name")
        hikes = []
        bookmarks_list = crud.create_bookmarks_list(bookmarks_list_name, user_id, hikes)
        db.session.add(bookmarks_list)
        db.session.commit()
        flash(f"Success! {bookmarks_list_name} has been added to your bookmarks.")
        return redirect("/bookmarks")
    else:
        flash("You must log in to add a bookmark list.")
        return redirect("/")


@app.route("/add-pet", methods=["POST"])
def add_pet():
    """Create a pet profile"""

    logged_in_email = session.get("user_email")

    if logged_in_email is None:
        flash("You must log in to add a pet profile.")
    else:
        user = crud.get_user_by_email(logged_in_email)

        pet_name = request.form.get("pet_name")
        gender = request.form.get("gender")

        if gender == "":
            gender = None

        birthday = request.form.get("birthday")

        if birthday == "":
            birthday = None

        breed = request.form.get("breed")

        if breed == "":
            breed = None

        my_file = request.files["my_file"]

        # save the uploaded file to Cloudinary by making an API request
        result = cloudinary.uploader.upload(my_file,
                                            api_key=CLOUDINARY_KEY,
                                            api_secret=CLOUDINARY_SECRET,
                                            cloud_name=CLOUD_NAME)

        pet_imgURL = result["secure_url"]
        
        check_ins = []

        pet = crud.create_pet(user, pet_name, gender, birthday, breed, pet_imgURL, check_ins)
        db.session.add(pet)
        db.session.commit()
        flash(f"Success! {pet_name} profile has been added.")

    return redirect("/")


# @app.route("/dedit-delete-pet", methods=["POST"])
# def edit_delete_pet():
#     """Edit or delete a pet profile"""

#     logged_in_email = session.get("user_email")

#     if logged_in_email is None:
#         flash("You must log in to edit/delete a pet profile.")
#     else:
#         user = crud.get_user_by_email(logged_in_email)

#         pet = request.form.get("pet")

#         db.session.execute(pet.delete())
#         db.session.commit()
#         flash(f"Success! {pet_name} profile has been deleted.")

#     return redirect("/")


@app.route("/hikes/<hike_id>/check-in", methods=["POST"])
def add_check_in(hike_id):
    """Add check in for a hike."""

    logged_in_email = session.get("user_email")

    if logged_in_email is None:
        flash("You must log in to check in.")
    else:
        user = crud.get_user_by_email(logged_in_email)
        hike = crud.get_hike_by_id(hike_id)
        pet_id = request.form.get("pet_id")
        pet = crud.get_pet_by_id(pet_id)
        date_hiked = request.form.get("date_hiked")
        date_started = request.form.get("date_started")

        if date_started == "":
            date_started = None

        date_completed = request.form.get("date_completed")

        if date_completed == "":
            date_completed = None

        miles_completed = request.form.get("miles_completed")

        if miles_completed == "":
            miles_completed = None

        total_time = request.form.get("total_time")

        if total_time == "":
            total_time = None

        check_in = crud.create_check_in(hike, pet, date_hiked, date_started, date_completed, miles_completed, total_time)
        db.session.add(check_in)
        db.session.commit()
        flash(f"Success! {pet.pet_name} has been checked into {hike.hike_name}.")

    return redirect(f"/hikes/{hike_id}") 


@app.route("/hikes/<hike_id>/bookmark", methods=["POST"])
def add_hike_to_bookmark(hike_id):
    """Add hike to a bookmarks list"""
    logged_in_email = session.get("user_email")

    if logged_in_email is None:
        flash("You must log in to bookmark a hike.")
    else:
        user = crud.get_user_by_email(logged_in_email)
        hike = crud.get_hike_by_id(hike_id)
        bookmarks_list_name = request.form.get("bookmarks_list_name")

        # check list of all of user's bookmarks lists
        # if bookmarks list object exists, add hike to bookmarks list
        # if not, create bookmarks list then add hike
        bookmarks_lists_names_by_user = crud.get_names_of_bookmarks_lists_by_user_id(user.user_id)

        if bookmarks_list_name in bookmarks_lists_names_by_user:
            existing_bookmarks_list_id = crud.get_bookmarks_list_by_user_id_and_bookmarks_list_name(user.user_id, bookmarks_list_name).bookmarks_list_id
            hike_bookmark = crud.create_hike_bookmarks_list(hike_id, existing_bookmarks_list_id)
        else:
            hikes = [hike]
            hike_bookmark = crud.create_bookmarks_list(bookmarks_list_name, user.user_id, hikes)
        
        db.session.add(hike_bookmark)
        db.session.commit()

        flash(f"A bookmark to {hike.hike_name} has been added to your {bookmarks_list_name} bookmark list.")

    return redirect(f"/hikes/{hike_id}")



@app.route("/hikes/<hike_id>/comments", methods=["POST"])
def add_comment(hike_id):
    """Add a comment for a hike"""
    logged_in_email = session.get("user_email")

    if logged_in_email is None:
        flash("You must log in to add a comment.")
    else:
        user = crud.get_user_by_email(logged_in_email)
        hike = crud.get_hike_by_id(hike_id)
        body = request.form.get("body")

        comment = crud.create_comment(user, hike, body)
        db.session.add(comment)
        db.session.commit()

        flash("Your comment has been added.")

    return redirect(f"/hikes/{hike_id}")


# @app.route('/pets.json')
# def pets():
#     """Return a list of pet-info dictionary for all pets."""

#     pets = crud.get_pets()
#     pets_json = []

#     for pet in pets:
#         pets_json.append({"user_id": pet.user_id, "pet_name": pet.pet_name, "gender": pet.gender, "birthday": pet.birthday, "breed": pet.breed, "pet_imgURL": pet.pet_imgURL})

#     return jsonify(pets_json)


@app.route("/users", methods=["POST"])
def register_user():
    """Create a new user."""
    full_name = request.form.get("full_name")
    email = request.form.get("email")
    password = request.form.get("password")

    user = crud.get_user_by_email(email)
    if user:
        flash("There is already an account associated with that email. Please try again.")
    else:
        user = crud.create_user(full_name, email, password)
        db.session.add(user)
        db.session.commit()
        flash("Success! Account created. Please log in.")

    return redirect("/")


@app.route("/login", methods=["POST"])
def process_login():
    """Process user login"""
    email = request.form.get("email")
    password = request.form.get("password")

    user = crud.get_user_by_email(email)
    if not user or user.password != password:
        flash("The email or password is incorrect.")
        return redirect("/")
    else:
        # Log in user by storing the user's email in session
        session["user_email"] = user.email
        session["login"] = True
        flash(f"Welcome back, {user.full_name}!")
        return redirect("/")


@app.route("/login", methods=["GET"])
def show_login():
    """Show login form."""

    return render_template("login.html")


@app.route("/logout")
def process_logout():
    """Log user out of site.

    Delete the login session
    """

    del session["login"]
    del session["user_email"]
    flash("Successfully logged out!")
    return redirect("/")


if __name__ == "__main__":
    # DebugToolbarExtension(app)
    connect_to_db(app)
    app.run(host="0.0.0.0", debug=True)
