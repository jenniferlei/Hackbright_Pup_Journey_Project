"""Server for pup journey app."""

from flask import Flask, render_template, json, jsonify, request, flash, session, redirect
from flask_sqlalchemy import SQLAlchemy
import cloudinary.uploader
import os
from datetime import datetime
from calendar import month_abbr

# from model import (connect_to_db, db, ma, User, CheckIn, Pet, Hike, Comment, PetSchema, CheckInSchema, BookmarksListSchema, HikeBookmarksListSchema, HikeSchema, CommentSchema)
from model import (connect_to_db, db, User, CheckIn, Pet, HikeBookmarksList, 
PetCheckIn, Hike, BookmarksList, Comment)

import crud_bookmarks_lists
import crud_check_ins
import crud_comments
import crud_hikes_bookmarks_lists
import crud_hikes
import crud_pets_check_ins
import crud_pets
import crud_users

from jinja2 import StrictUndefined

from flask_marshmallow import Marshmallow
from marshmallow import fields


app = Flask(__name__)

ma = Marshmallow(app)


app.secret_key = "dev"
app.jinja_env.undefined = StrictUndefined

CLOUDINARY_KEY = os.environ["CLOUDINARY_KEY"]
CLOUDINARY_SECRET = os.environ["CLOUDINARY_SECRET"]
CLOUD_NAME = "hbpupjourney"
GOOGLE_KEY = os.environ["GOOGLE_KEY"]


class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        load_instance = True

    # Make sure to use the 'only' or 'exclude'
    # to avoid infinite recursion
    pets = fields.List(fields.Nested("PetSchema", exclude=("user",)))
    bookmarks_lists = fields.List(fields.Nested("BookmarksListSchema", exclude=("user",)))
    comments = fields.List(fields.Nested("CommentSchema", exclude=("user",)))


class PetSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Pet
        include_fk = True
        load_instance = True
        
    check_ins = fields.Nested("PetCheckInSchema", many=True)


class HikeSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Hike
        load_instance = True

    comments = fields.List(fields.Nested("CommentSchema", exclude=("hike", "user")))
    check_ins = fields.List(fields.Nested("CheckInSchema", exclude=("hike", "pets")))
    bookmarks_lists = fields.List(fields.Nested("BookmarksListSchema", exclude=("hikes",)))


class CommentSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Comment
        include_fk = True
        load_instance = True

    hike = fields.Nested(HikeSchema(exclude=("check_ins", "comments", "bookmarks_lists",)))
    user = fields.Nested(UserSchema(exclude=("pets", "comments", "bookmarks_lists",)))


class CheckInSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = CheckIn
        include_fk = True
        load_instance = True

    hike = fields.Nested(HikeSchema(exclude=("check_ins", "comments", "bookmarks_lists")))
    pets = fields.Nested("PetCheckInSchema", many=True)


class PetCheckInSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = PetCheckIn
        include_fk = True
        load_instance = True

    check_in = fields.Nested(CheckInSchema)


class HikeBookmarksListSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = HikeBookmarksList
        include_fk = True
        load_instance = True

    hike = fields.Nested(HikeSchema(exclude=("check_ins", "comments", "bookmarks_lists",)))


class BookmarksListSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = BookmarksList
        include_fk = True
        load_instance = True

    hikes = fields.List(fields.Nested(HikeBookmarksListSchema))


@app.route("/")
def homepage():
    """View homepage."""

    return render_template("homepage.html")


@app.route("/dashboard")
def dashboard():
    """View dashboard."""

    if "user_email" in session:
        user = crud_users.get_user_by_email(session["user_email"])

        return render_template("dashboard.html",
                                user=user,
                                GOOGLE_KEY=GOOGLE_KEY)
    else:
        flash("You must log in to view your dashboard.")

        return redirect("/")


@app.route("/hikes")
def all_hikes():
    """View all hikes."""

    # Populate options for the search bar
    search_hikes = crud_hikes.get_hikes()

    logged_in_email = session.get("user_email")

    if logged_in_email is None:
        return render_template("all_hikes.html", search_hikes=search_hikes)
    
    user = crud_users.get_user_by_email(logged_in_email)
    return render_template("all_hikes.html", user=user, search_hikes=search_hikes)


@app.route("/hikes/search", methods=["GET"])
def search_box():
    """Search for hikes by search term"""

    search_term = request.args.get("search_term")

    # Populate the list of hikes
    search_hikes = crud_hikes.get_hike_by_keyword(search_term)

    logged_in_email = session.get("user_email")

    if logged_in_email is None:
        return render_template("all_hikes.html", search_hikes=search_hikes)
    
    user = crud_users.get_user_by_email(logged_in_email)
    return render_template("all_hikes.html", user=user, search_hikes=search_hikes)


@app.route("/hikes/advanced_search", methods=["GET"])
def advanced_search():
    """Search for hikes"""

    keyword = request.args.get("keyword", "")
    difficulties = request.args.getlist("difficulty")
    leash_rules = request.args.getlist("leash_rule")
    areas = request.args.getlist("area")
    cities = request.args.getlist("city")
    state = request.args.get("state", "")
    length_min = request.args.get("length_min", "")
    length_max = request.args.get("length_max", "")
    parking = request.args.getlist("parking")
    print(leash_rules, "leash_rules 191")

    # Populate the list of hike objects that fulfill the search criteria
    search_hikes = crud_hikes.get_hikes_by_advanced_search(keyword, difficulties, leash_rules, areas, cities, state, length_min, length_max, parking)
 
    # logged_in_email = session.get("user_email")

    # if logged_in_email is None:
    #     return render_template("all_hikes.html", search_hikes=search_hikes)
    
    # user = crud_users.get_user_by_email(logged_in_email)
    # return render_template("all_hikes.html", user=user, search_hikes=search_hikes)

    hikes_schema = HikeSchema(many=True, exclude=["comments", "check_ins", "bookmarks_lists"])
    hikes_json = hikes_schema.dump(search_hikes)

    return jsonify({"hikes": hikes_json})


@app.route("/hikes/<hike_id>")
def show_hike(hike_id):
    """Show details on a particular hike."""

    hike = crud_hikes.get_hike_by_id(hike_id)

    logged_in_email = session.get("user_email")

    if logged_in_email is None:
        return render_template("hike_details.html", hike=hike, GOOGLE_KEY=GOOGLE_KEY)
    else:
        user = crud_users.get_user_by_email(logged_in_email)
        return render_template("hike_details.html", user=user, hike=hike, GOOGLE_KEY=GOOGLE_KEY)


@app.route("/add-pet", methods=["POST"])
def add_pet():
    """Create a pet profile"""

    logged_in_email = session.get("user_email")
    user = crud_users.get_user_by_email(logged_in_email)

    form_data = request.form.to_dict("formData")
    pet_name = form_data["petName"]
    gender = form_data["gender"]
    birthday = form_data["birthday"]
    breed = form_data["breed"]
    my_file = request.files.get("imageFile")

    if gender == "":
        gender = None
    if birthday == "":
        birthday = None
    if breed == "":
        breed = None
    if my_file is None:
        pet_img_url = None
        img_public_id = None
    else:
        # save the uploaded file to Cloudinary by making an API request
        result = cloudinary.uploader.upload(
            my_file,
            api_key=CLOUDINARY_KEY,
            api_secret=CLOUDINARY_SECRET,
            cloud_name=CLOUD_NAME,
        )
        pet_img_url = result["secure_url"]
        img_public_id = result["public_id"]

    check_ins = []

    pet = crud_pets.create_pet(
        user,
        pet_name,
        gender,
        birthday,
        breed,
        pet_img_url,
        img_public_id,
        check_ins,
    )
    db.session.add(pet)
    db.session.commit()
    

    pet_schema = PetSchema()
    pet_json = pet_schema.dump(pet)

    return jsonify({"success": True, "petAdded": pet_json})


@app.route("/edit-pet/<pet_id>", methods=["POST"])
def edit_pet(pet_id):
    """Edit a pet"""

    pet = crud_pets.get_pet_by_id(pet_id)

    form_data = request.form.to_dict("formData")

    pet.pet_name = form_data["petName"]

    gender = form_data["gender"]
    birthday = form_data["birthday"]
    breed = form_data["breed"]
    my_file = request.files.get("imageFile")

    print(my_file)

    if gender != "":
        pet.gender = gender
    if birthday != "":
        pet.birthday = birthday
    if breed != "":
        pet.breed = breed

    if my_file is not None: # if user uploads new image file, delete old image from cloudinary
    # then upload new image
        img_public_id = pet.img_public_id
        if img_public_id is not None:
            cloudinary.uploader.destroy(
                img_public_id,
                api_key=CLOUDINARY_KEY,
                api_secret=CLOUDINARY_SECRET,
                cloud_name=CLOUD_NAME,
        )
        # save the uploaded file to Cloudinary by making an API request
        result = cloudinary.uploader.upload(
            my_file,
            api_key=CLOUDINARY_KEY,
            api_secret=CLOUDINARY_SECRET,
            cloud_name=CLOUD_NAME,
        )

        pet.pet_imgURL = result["secure_url"]
        pet.img_public_id = result["public_id"]

    db.session.commit()

    return jsonify({"success": True})


@app.route("/delete-pet/<pet_id>", methods=["DELETE"])
def delete_pet(pet_id):
    """Delete a pet profile"""

    pet = crud_pets.get_pet_by_id(pet_id)
    img_public_id = pet.img_public_id
    if img_public_id is not None:
        cloudinary.uploader.destroy(
            img_public_id,
            api_key=CLOUDINARY_KEY,
            api_secret=CLOUDINARY_SECRET,
            cloud_name=CLOUD_NAME,
        )

    pet.check_ins.clear()

    db.session.delete(pet)
    db.session.commit()

    return jsonify({"success": True})


@app.route("/hikes/<hike_id>/add-check-in", methods=["POST"])
def add_hike_check_in(hike_id):
    """Add check in for a hike."""

    # logged_in_email = session.get("user_email")
    # user = crud_users.get_user_by_email(logged_in_email)
    hike = crud_hikes.get_hike_by_id(hike_id)
    pets_checked = request.get_json().get("allPetOptions") # list of objects (select, pet_name, pet_id)
    date_hiked = request.get_json().get("dateHiked")
    miles_completed = request.get_json().get("milesCompleted")
    total_time = request.get_json().get("totalTime")
    notes = request.get_json().get("notes")

    if total_time == "":
        total_time = None

    pets_to_check_in = []
    pets_not_checked_in = []

    for pet in pets_checked:
        select, _, pet_id = pet
        pet_obj = crud_pets.get_pet_by_id(pet[pet_id])
        if pet[select] is True:
            pets_to_check_in.append(pet_obj)
        else:
            pets_not_checked_in.append(pet_obj)

    check_in = crud_check_ins.create_check_in(
        hike,
        pets_to_check_in,
        date_hiked,
        miles_completed,
        total_time,
        notes
    )

    db.session.add(check_in)
    db.session.commit()

    check_in_schema = CheckInSchema()
    check_in_json = check_in_schema.dump(check_in)

    return jsonify({"checkInAdded": check_in_json})


@app.route("/add-check-in", methods=["POST"])
def add_check_in():
    """Add check in for a hike."""

    # logged_in_email = session.get("user_email")
    # user = crud_users.get_user_by_email(logged_in_email)
    hike_id = request.get_json().get("hikeId")
    pets_checked = request.get_json().get("allPetOptions") # list of objects (select, pet_name, pet_id)
    date_hiked = request.get_json().get("dateHiked")
    miles_completed = request.get_json().get("milesCompleted")
    total_time = request.get_json().get("totalTime")
    notes = request.get_json().get("notes")

    hike = crud_hikes.get_hike_by_id(hike_id)

    if total_time == "":
        total_time = None

    pets_to_check_in = []
    pets_not_checked_in = []

    for pet in pets_checked:
        select, _, pet_id = pet
        pet_obj = crud_pets.get_pet_by_id(pet[pet_id])
        if pet[select] is True:
            pets_to_check_in.append(pet_obj)
        else:
            pets_not_checked_in.append(pet_obj)

    check_in = crud_check_ins.create_check_in(
        hike,
        pets_to_check_in,
        date_hiked,
        miles_completed,
        total_time,
        notes
    )

    db.session.add(check_in)
    db.session.commit()

    check_in_schema = CheckInSchema(only=["check_in_id","date_hiked","hike_id","miles_completed","notes","pets","total_time","hike.hike_name","hike.latitude","hike.longitude"])
    check_in_json = check_in_schema.dump(check_in)

    return jsonify({"checkInAdded": check_in_json})


@app.route("/edit-check-in/<check_in_id>", methods=["POST"])
def edit_check_in(check_in_id):
    """Edit a check in"""

    pets_to_add = request.get_json().get("addPet")
    pets_to_remove = request.get_json().get("removePet")
    date_hiked = request.get_json().get("dateHiked")
    miles_completed = request.get_json().get("milesCompleted")
    total_time = request.get_json().get("totalTime")
    notes = request.get_json().get("notes")

    for pet in pets_to_add: # Add pets to check in
        select, _, pet_id = pet
        if pet[select] is True:
            pet_check_in = crud_pets_check_ins.create_pet_check_in(pet[pet_id], check_in_id)
            db.session.add(pet_check_in)

    for pet in pets_to_remove: # Remove pets from check in
        select, _, pet_id = pet
        if pet[select] is True:
            pet_check_in = crud_pets_check_ins.get_pet_check_in_by_pet_id_check_in_id(pet[pet_id], check_in_id)
            db.session.delete(pet_check_in)

    check_in = crud_check_ins.get_check_ins_by_check_in_id(check_in_id)

    if date_hiked == "": # if date_hiked is left blank, use previous date_hiked
        date_hiked = check_in.date_hiked

    if miles_completed == "": # if miles_completed is left blank, use previous miles_completed
        miles_completed = check_in.miles_completed

    if total_time == "": # if total_time is left blank, use previous total_time
        total_time = check_in.total_time

    check_in.date_hiked = date_hiked
    check_in.miles_completed = miles_completed
    check_in.total_time = total_time
    check_in.notes = notes

    if check_in.pets == []: # if there are no pets after pets have been updated, delete check in
        db.session.delete(check_in)

    db.session.commit()

    return jsonify({"success": True})


@app.route("/delete-check-in/<check_in_id>", methods=["DELETE"])
def delete_check_in(check_in_id):
    """Delete a check-in"""

    logged_in_email = session.get("user_email")

    check_in = crud_check_ins.get_check_ins_by_check_in_id(check_in_id)
    check_in.pets.clear()

    db.session.delete(check_in)
    db.session.commit()

    return jsonify({"success": True})


@app.route("/delete-pet-check-in", methods=["POST"])
def delete_pet_check_in():
    """Remove a check-in from a pet"""

    logged_in_email = session.get("user_email")

    if logged_in_email is None:
        flash("You must log in to delete a check in.")
    else:
        pet_id, check_in_id = request.form.get("delete").split(",")
        pet_check_in = crud_pets_check_ins.get_pet_check_in_by_pet_id_check_in_id(pet_id, check_in_id)
        check_in = crud_check_ins.get_check_ins_by_check_in_id(check_in_id)
        pet = crud_pets.get_pet_by_id(pet_id)

        flash(
            f"Success! Check in at {check_in.hike.hike_name} by {pet.pet_name} has been deleted."
        )

        db.session.delete(pet_check_in)
        db.session.commit()

    return redirect(request.referrer)


@app.route("/create-bookmarks-list", methods=["POST"])
def create_bookmarks_list():
    """Create a bookmark list"""

    user = crud_users.get_user_by_email(session["user_email"])
    bookmarks_list_name = request.get_json().get("bookmarksListName")
    hikes = []

    bookmarks_list = crud_bookmarks_lists.create_bookmarks_list(
        bookmarks_list_name, user.user_id, hikes
    )

    db.session.add(bookmarks_list)
    db.session.commit()

    return jsonify({"success": True})


@app.route("/edit-bookmarks-list/<bookmarks_list_id>", methods=["POST"])
def edit_bookmarks_list(bookmarks_list_id):
    """Edit a bookmark list"""

    bookmarks_list = crud_bookmarks_lists.get_bookmarks_list_by_bookmarks_list_id(
        bookmarks_list_id
    )
    bookmarks_list.bookmarks_list_name = request.get_json().get("bookmarksListName")

    db.session.commit()

    return jsonify({"success": True})


@app.route("/delete-bookmarks-list/<bookmarks_list_id>", methods=["DELETE"])
def delete_bookmarks_list(bookmarks_list_id):
    """Delete a bookmarks list"""

    bookmarks_list = crud_bookmarks_lists.get_bookmarks_list_by_bookmarks_list_id(
        bookmarks_list_id
    )
    bookmarks_list.hikes.clear()

    db.session.delete(bookmarks_list)
    db.session.commit()

    return jsonify({"success": True})


@app.route("/<bookmarks_list_id>/add-hikes", methods=["POST"])
def add_hikes_to_existing_bookmarks_list(bookmarks_list_id):
    """Add hikes to an existing bookmarks list"""

    # hike = crud_hikes.get_hike_by_id(hike_id)
    hikes = request.get_json().get("allHikesOptions") # this will get a list of objects
    print(hikes)
    bookmarks_list = crud_bookmarks_lists.get_bookmarks_list_by_bookmarks_list_id(bookmarks_list_id)
    bookmarks_list_hikes = bookmarks_list.hikes
    print(bookmarks_list)
    print(bookmarks_list_hikes)

    for hike in hikes:
        hike_obj = crud_hikes.get_hike_by_id(hike["hike_id"])
        if hike["select"] is True and hike_obj not in bookmarks_list_hikes:
            # if selected and already a connection, create connection
            hike_bookmark = crud_hikes_bookmarks_lists.create_hike_bookmarks_list(hike["hike_id"], bookmarks_list_id)
            db.session.add(hike_bookmark)
        elif hike["select"] is False and hike_obj in bookmarks_list_hikes:
            # if unselected and there's a connection, delete connection
            hike_bookmarks = crud_hikes_bookmarks_lists.get_hike_bookmarks_list_by_hike_id_bookmarks_list_id(hike["hike_id"], bookmarks_list_id)
            for hike_bookmark in hike_bookmarks:
                db.session.delete(hike_bookmark)

    db.session.commit()

    return jsonify({"success": True})


@app.route("/hikes/<hike_id>/add-hike-to-existing-list", methods=["POST"])
def add_hike_to_existing_bookmarks_list(hike_id):
    """Add hike to an existing bookmarks list"""

    hike = crud_hikes.get_hike_by_id(hike_id)
    bookmarks_list_options = request.get_json().get("allBookmarksListOptions") # this will get a list of objects

    for bookmarks_list in bookmarks_list_options:
        bookmarks_list_obj = crud_bookmarks_lists.get_bookmarks_list_by_bookmarks_list_id(bookmarks_list["bookmarks_list_id"])
        bookmarks_list_hikes = bookmarks_list_obj.hikes
        if bookmarks_list["select"] is True and hike not in bookmarks_list_hikes:
            # if selected, check if there's already a connection, else add connection
            hike_bookmark = crud_hikes_bookmarks_lists.create_hike_bookmarks_list(hike_id, bookmarks_list["bookmarks_list_id"])
            db.session.add(hike_bookmark)
        elif bookmarks_list["select"] is False and hike in bookmarks_list_hikes:
            # if unselected and there's a connection, delete connection
            hike_bookmarks = crud_hikes_bookmarks_lists.get_hike_bookmarks_list_by_hike_id_bookmarks_list_id(hike_id, bookmarks_list["bookmarks_list_id"])
            for hike_bookmark in hike_bookmarks:
                db.session.delete(hike_bookmark)

    db.session.commit()

    return jsonify({"success": True})


@app.route("/hikes/<hike_id>/add-hike-to-new-list", methods=["POST"])
def add_hike_to_new_bookmarks_list(hike_id):
    """Add hike to a new bookmarks list"""

    logged_in_email = session.get("user_email")
    user = crud_users.get_user_by_email(logged_in_email)

    bookmarks_list_name = request.get_json().get("bookmarksListName")
    hikes = [crud_hikes.get_hike_by_id(hike_id)]
    hike_bookmark = crud_bookmarks_lists.create_bookmarks_list(
        bookmarks_list_name, user.user_id, hikes
    )

    db.session.add(hike_bookmark)
    db.session.commit()

    return jsonify({"success": True})


@app.route("/<bookmarks_list_id>/<hike_id>/remove-hike", methods=["DELETE"])
def remove_hike(bookmarks_list_id, hike_id):
    """Delete a hike from a bookmarks list"""

    hike = crud_hikes.get_hike_by_id(hike_id)
    bookmarks_list = crud_bookmarks_lists.get_bookmarks_list_by_bookmarks_list_id(
        bookmarks_list_id
    )
    hikes_bookmarks_lists = crud_hikes_bookmarks_lists.get_hike_bookmarks_list_by_hike_id_bookmarks_list_id(
        hike_id, bookmarks_list_id
    )

    for hikes_bookmarks_list in hikes_bookmarks_lists:
        db.session.delete(hikes_bookmarks_list)
    db.session.commit()

    return jsonify({"success": True})


@app.route("/hikes/<hike_id>/add-comment", methods=["POST"])
def add_hike_comment(hike_id):
    """Add a comment for a hike"""
    logged_in_email = session.get("user_email")

    user = crud_users.get_user_by_email(logged_in_email)
    hike = crud_hikes.get_hike_by_id(hike_id)
    comment_body = request.get_json().get("comment_body")

    comment = crud_comments.create_comment(
        user, hike, comment_body, date_created=datetime.now(), edit=False, date_edited=None
    )
    db.session.add(comment)
    db.session.commit()

    comment_schema = CommentSchema()
    comment_json = comment_schema.dump(comment)

    return jsonify({"commentAdded": comment_json, "login": True})


@app.route("/add-comment", methods=["POST"])
def add_comment():
    """Add a comment for a hike"""
    logged_in_email = session.get("user_email")

    user = crud_users.get_user_by_email(logged_in_email)
    hike_id = request.get_json().get("hikeId")
    hike = crud_hikes.get_hike_by_id(hike_id)
    comment_body = request.get_json().get("commentBody")

    comment = crud_comments.create_comment(
        user, hike, comment_body, date_created=datetime.now(), edit=False, date_edited=None
    )
    db.session.add(comment)
    db.session.commit()

    comment_schema = CommentSchema()
    comment_json = comment_schema.dump(comment)

    return jsonify({"commentAdded": comment_json, "login": True})


@app.route("/edit-comment/<comment_id>", methods=["POST"])
def edit_comment(comment_id):
    """Edit a comment"""

    comment = crud_comments.get_comment_by_comment_id(comment_id)
    comment.body = request.get_json().get("commentBody")
    comment.edit = True
    comment.date_edited = datetime.now()

    db.session.commit()

    return jsonify({"success": True})


@app.route("/delete-comment/<comment_id>", methods=["DELETE"])
def delete_comment(comment_id):
    """Delete a comment"""

    comment = crud_comments.get_comment_by_comment_id(comment_id)

    db.session.delete(comment)
    db.session.commit()

    return jsonify({"success": True})


@app.route("/users", methods=["POST"])
def register_user():
    """Create a new user."""
    full_name = request.form.get("full_name")
    email = request.form.get("email")
    password = request.form.get("new-password")

    user = crud_users.get_user_by_email(email)
    if user:
        flash(
            "There is already an account associated with that email. Please try again."
        )
    else:
        user = crud_users.create_user(full_name, email, password)
        db.session.add(user)
        db.session.commit()
        flash("Success! Account created. Please log in.")

    return redirect("/")


@app.route("/login", methods=["POST"])
def process_login():
    """Process user login"""
    email = request.form.get("email")
    password = request.form.get("current-password")

    user = crud_users.get_user_by_email(email)
    if not user or user.password != password:
        flash("The email or password is incorrect.")
    else:
        # Log in user by storing the user's email in session
        session["user_email"] = user.email
        session["login"] = True
        flash(f"Welcome back, {user.full_name}!")

    print(request.referrer, "LINE 768")

    return redirect(request.referrer)


@app.route("/logout")
def process_logout():
    """Log user out of site.

    Delete the login session
    """

    del session["login"]
    del session["user_email"]
    flash("Successfully logged out!")
    return redirect("/")


@app.route("/login_session.json")
def login_session_json():
    """Return a JSON response for a login."""

    logged_in_email = session.get("user_email")

    if logged_in_email is None:
        login = "False"
        user_id = "None"
    else:
        user = crud_users.get_user_by_email(logged_in_email)
        login = "True"
        user_id = user.user_id

    return jsonify({"login": login, "user_id": user_id})


@app.route("/hikes/<hike_id>/comments.json")
def get_hike_comments_json(hike_id):
    """Return a JSON response for a hike's comments."""
    
    comments = crud_comments.get_comment_by_hike_id(hike_id)

    sorted_comments = sorted(comments, key=lambda x: x.date_created, reverse=True)

    comments_schema = CommentSchema(many=True)
    comments_json = comments_schema.dump(sorted_comments)

    return jsonify({"comments": comments_json})


@app.route("/user_comments.json")
def get_user_comments_json():
    """Return a JSON response for all user's comments."""
    
    logged_in_email = session.get("user_email")
    user = crud_users.get_user_by_email(logged_in_email)
    comments = crud_comments.get_comment_by_user_id(user.user_id)

    sorted_comments = sorted(comments, key=lambda x: x.date_created, reverse=True)

    comments_schema = CommentSchema(many=True)
    comments_json = comments_schema.dump(sorted_comments)

    return jsonify({"comments": comments_json})


@app.route("/check_in/<check_in_id>.json")
def get_check_in_json(check_in_id):
    """Return a JSON response for a check in."""
    
    logged_in_email = session.get("user_email")
    user = (db.session.query(User).filter(User.email == logged_in_email)
                                 .options(db.joinedload('pets'))
                                 .first())
    check_in = (db.session.query(CheckIn).filter_by(check_in_id=check_in_id)
                                        .options(db.joinedload('pets'))
                                        .one())

    # check_in.pets = sorted(check_in.pets, key=lambda x: x.pet_name)

    check_in_schema = CheckInSchema()
    check_in_json = check_in_schema.dump(check_in)
    pet_schema = PetSchema()

    check_in_json["pets_not_on_hike"] = []
    check_in_json["pets"] = []

    for pet in user.pets:
        pet_json = pet_schema.dump(pet)
        if pet not in check_in.pets:
            check_in_json["pets_not_on_hike"].append(pet_json)
        else:
            check_in_json["pets"].append(pet_json)


    return jsonify({"checkIn": check_in_json})


@app.route("/hikes/<hike_id>/user_check_ins.json")
def get_hike_check_ins_json(hike_id):
    """Return a JSON response for a hike's check ins."""
    logged_in_email = session.get("user_email")
    user = crud_users.get_user_by_email(logged_in_email)

    check_ins = crud_check_ins.get_check_ins_by_user_id_hike_id(user.user_id, hike_id)

    check_ins_schema = CheckInSchema(many=True)
    check_ins_json = check_ins_schema.dump(check_ins)

    pets_schema = PetSchema(many=True, exclude=["check_ins"])
    
    for idx, check_in in enumerate(check_ins):
        pets_json = pets_schema.dump(sorted(check_in.pets, key=lambda x: x.pet_name.lower()))
        check_ins_json[idx]["pets"] = pets_json

    return jsonify({"checkIns": check_ins_json})


@app.route("/user_check_ins.json")
def get_user_check_ins_json():
    """Return a JSON response for a user's check ins."""
    logged_in_email = session.get("user_email")

    user = crud_users.get_user_by_email(logged_in_email)
    check_ins = crud_check_ins.get_check_ins_by_user_id(user.user_id)
    sorted_check_ins = sorted(check_ins, key=lambda x: x.date_hiked, reverse=True)

    check_ins_schema = CheckInSchema(many=True, only=["check_in_id","date_hiked","hike_id","miles_completed","notes","pets","total_time","hike.hike_name","hike.latitude","hike.longitude"])
    check_ins_json = check_ins_schema.dump(sorted_check_ins)
    pets_schema = PetSchema(many=True, exclude=["check_ins"])

    for idx, check_in in enumerate(sorted_check_ins):
        pets_json = pets_schema.dump(sorted(check_in.pets, key=lambda x: x.pet_name.lower()))
        check_ins_json[idx]["pets"] = pets_json

    return jsonify({"checkIns": check_ins_json})


@app.route("/pets.json")
def get_pets_json():
    """Return a JSON response with all pets given user."""

    logged_in_email = session.get("user_email")

    user = crud_users.get_user_by_email(logged_in_email)
    pets = crud_pets.get_pets_by_user_id(user.user_id)

    pets_schema = PetSchema(many=True)
    pets_json = pets_schema.dump(pets)

    check_ins_schema = CheckInSchema(many=True, only=["miles_completed"])

    for idx, pet in enumerate(pets):
        check_ins_json = check_ins_schema.dump(pet.check_ins)
        pets_json[idx]["check_ins"] = check_ins_json

    return jsonify({"petProfiles": pets_json})


@app.route("/check-ins-by-pets.json")
def get_check_ins_by_pets_json():
    """Return a JSON response with all check ins for each pet."""

    logged_in_email = session.get("user_email")
    user = crud_users.get_user_by_email(logged_in_email)

    # Get list of pet objects for the user
    pets = crud_pets.get_pets_by_user_id(user.user_id)
    
    # For each pet:
    # Create a new object with pet_id, pet_name, and data
    # Sort the pet's check ins and append to data
    # Append pet's data to check in data

    check_in_data = []

    for pet in pets:
        pet_data = {"pet_id": pet.pet_id, "pet_name": pet.pet_name, "data": []}

        check_ins = crud_check_ins.get_check_ins_by_pet_id(pet.pet_id)

        sorted_check_ins = sorted(check_ins, key=lambda x: x.date_hiked, reverse=True)

        for check_in in sorted_check_ins:
            pet_data["data"].append({"date_hiked": check_in.date_hiked.isoformat(), "miles_completed": check_in.miles_completed})
        
        check_in_data.append(pet_data)

    return jsonify({"petCheckIns": check_in_data})




@app.route("/<bookmarks_list_id>/hikes.json")
def get_bookmarks_hikes_json(bookmarks_list_id):
    """Return a JSON response for a bookmarks list's hikes."""

    # get one bookmarks object with list of hikes
    # convert to JSON
    hikes_by_bookmark = crud_bookmarks_lists.get_bookmarks_list_by_bookmarks_list_id(bookmarks_list_id)
    bookmark_schema = BookmarksListSchema()
    bookmark_json = bookmark_schema.dump(hikes_by_bookmark)

    hikes_schema = HikeSchema(many=True, exclude=["comments", "check_ins", "bookmarks_lists"])
    hikes_json = hikes_schema.dump(sorted(hikes_by_bookmark.hikes, key=lambda x: x.hike_name))

    bookmark_json["hikes"] = hikes_json

    return jsonify({"bookmarksLists": bookmark_json})


@app.route("/hikes/<hike_id>/bookmarks.json")
def get_hike_bookmarks_json(hike_id):
    """Return a JSON response for a hike's bookmarks."""
    user = crud_users.get_user_by_email(session["user_email"])

    bookmarks_by_hike = crud_bookmarks_lists.get_bookmarks_lists_by_user_id_and_hike_id(user.user_id, hike_id)

    bookmarks_schema = BookmarksListSchema(many=True)
    bookmarks_json = bookmarks_schema.dump(bookmarks_by_hike)

    hikes_schema = HikeSchema(many=True, exclude=["comments", "check_ins", "bookmarks_lists"])

    for idx, bookmark in enumerate(bookmarks_by_hike):
        hikes_json = hikes_schema.dump(sorted(bookmark.hikes, key=lambda x: x.hike_name))
        bookmarks_json[idx]["hikes"] = hikes_json

    return jsonify({"bookmarksLists": bookmarks_json})


@app.route("/user_bookmarks_lists.json")
def get_user_bookmarks_lists():
    """Return a JSON response with all bookmarks lists for a user."""

    logged_in_email = session.get("user_email")
    user = crud_users.get_user_by_email(logged_in_email)

    # Get list of bookmark objects for the user
    bookmarks_by_user = crud_bookmarks_lists.get_bookmarks_lists_by_user_id(user.user_id)

    bookmarks_schema = BookmarksListSchema(many=True)
    bookmarks_json = bookmarks_schema.dump(bookmarks_by_user)

    hikes_schema = HikeSchema(many=True, exclude=["comments", "check_ins", "bookmarks_lists"])
    

    for idx, bookmark in enumerate(bookmarks_by_user):
        hikes_sorted_by_name = sorted(bookmark.hikes, key=lambda x: x.hike_name)
        hikes_sorted_by_difficulty = sorted(hikes_sorted_by_name, key=lambda x: x.difficulty)
        hikes_json = hikes_schema.dump(hikes_sorted_by_difficulty)
        bookmarks_json[idx]["hikes"] = hikes_json

    return jsonify({"bookmarksLists": bookmarks_json})



@app.route("/hikes/<hike_id>.json")
def get_hike(hike_id):
    """Return a JSON response for a hike"""

    # Populate the list of hike objects that fulfill the search criteria
    hike = crud_hikes.get_hike_by_id(hike_id)
 
    hike_schema = HikeSchema(exclude=["comments", "check_ins", "bookmarks_lists"])
    hike_json = hike_schema.dump(hike)

    return jsonify({"hike": hike_json})


@app.route("/all_hikes.json")
def get_all_hikes():
    """Return a JSON response for all hikes"""

    # Populate the list of hike objects that fulfill the search criteria
    hikes = crud_hikes.get_hikes()
 
    hikes_schema = HikeSchema(many=True, exclude=["comments", "check_ins", "bookmarks_lists"])
    hikes_json = hikes_schema.dump(hikes)

    return jsonify({"hikes": hikes_json})


@app.route("/map/<latitude>/<longitude>")
def hike_google_maps_result(latitude, longitude):
    """Return API"""
    url = f"https://www.google.com/maps/embed/v1/directions?key={GOOGLE_KEY}&origin=Current+Location&destination={latitude},{longitude}&center={latitude},{longitude}&avoid=tolls&zoom=11"

    pass

@app.route("/<state>/city_area.json")
def get_city_area(state):
    """Return cities and areas for a state"""
    hikes_by_state = (db.session.query(Hike)
                        .filter_by(state=state)
                        .all())

    areas = set()
    cities = set()

    for hike in hikes_by_state:
        areas.add(hike.area)
        cities.add(hike.city)

    areas = sorted(list(areas))
    cities = sorted(list(cities))

    return jsonify({"areas": areas, "cities": cities})


if __name__ == "__main__":
    # DebugToolbarExtension(app)
    connect_to_db(app)
    app.run(host="0.0.0.0", debug=True)
