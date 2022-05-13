"""Server for pup journey app."""

from flask import Flask, render_template, jsonify, request, flash, session, redirect
from flask_sqlalchemy import SQLAlchemy
import cloudinary.uploader
import os
from datetime import datetime

from model import (connect_to_db, db, User, CheckIn, Pet, HikeBookmarksList,
PetCheckIn, Hike, BookmarksList, Comment)

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
    """User Schema"""
    class Meta:
        model = User
        load_instance = True

    pets = fields.List(fields.Nested("PetSchema", exclude=("user",)))
    bookmarks_lists = fields.List(fields.Nested("BookmarksListSchema", exclude=("user",)))
    comments = fields.List(fields.Nested("CommentSchema", exclude=("user",)))
    check_ins = fields.List(fields.Nested("CheckInSchema", exclude=("user",)))


class PetSchema(ma.SQLAlchemyAutoSchema):
    """Pet Schema"""
    class Meta:
        model = Pet
        include_fk = True
        load_instance = True

    check_ins = fields.Nested("PetCheckInSchema", many=True)


class HikeSchema(ma.SQLAlchemyAutoSchema):
    """Hike Schema"""
    class Meta:
        model = Hike
        load_instance = True

    comments = fields.List(fields.Nested("CommentSchema", exclude=("hike", "user",)))
    check_ins = fields.List(fields.Nested("CheckInSchema", exclude=("hike", "pets",)))
    bookmarks_lists = fields.List(fields.Nested("BookmarksListSchema", exclude=("hikes",)))


class CommentSchema(ma.SQLAlchemyAutoSchema):
    """Comment Schema"""
    class Meta:
        model = Comment
        include_fk = True
        load_instance = True

    hike = fields.Nested(HikeSchema(exclude=("check_ins", "comments", "bookmarks_lists",)))
    user = fields.Nested(UserSchema(exclude=("pets", "check_ins", "comments", "bookmarks_lists",)))


class CheckInSchema(ma.SQLAlchemyAutoSchema):
    """Check In Schema"""
    class Meta:
        model = CheckIn
        include_fk = True
        load_instance = True

    hike = fields.Nested(HikeSchema(exclude=("check_ins", "comments", "bookmarks_lists")))
    user = fields.Nested(UserSchema(exclude=("pets", "check_ins", "comments", "bookmarks_lists",)))
    pets = fields.Nested("PetCheckInSchema", many=True)


class PetCheckInSchema(ma.SQLAlchemyAutoSchema):
    """Pet Check In Schema"""
    class Meta:
        model = PetCheckIn
        include_fk = True
        load_instance = True

    check_in = fields.Nested(CheckInSchema)


class HikeBookmarksListSchema(ma.SQLAlchemyAutoSchema):
    """Hike Bookmarks List Schema"""
    class Meta:
        model = HikeBookmarksList
        include_fk = True
        load_instance = True

    hike = fields.Nested(HikeSchema(exclude=("check_ins", "comments", "bookmarks_lists",)))


class BookmarksListSchema(ma.SQLAlchemyAutoSchema):
    """Bookmarks List Schema"""
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
        user = User.get_user_by_email(session["user_email"])

        return render_template("dashboard.html",
                                user=user,
                                GOOGLE_KEY=GOOGLE_KEY)

    flash("You must log in to view your dashboard.")

    return redirect("/")


@app.route("/hikes")
def all_hikes():
    """View all hikes."""

    search_hikes = Hike.get_hikes()
    user_id = session.get("user_id", None)

    return render_template("all_hikes.html", user_id=user_id, search_hikes=search_hikes)


@app.route("/hikes/search", methods=["GET"])
def search_box():
    """Search for hikes by search term"""

    search_term = request.args.get("search_term")
    search_hikes = Hike.get_hike_by_keyword(search_term)
    user_id = session.get("user_id", None)

    return render_template("all_hikes.html", user_id=user_id, search_hikes=search_hikes)


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

    # Populate the list of hike objects that fulfill the search criteria
    search_hikes = Hike.get_hikes_by_advanced_search(
        keyword, difficulties, leash_rules, areas,
        cities, state, length_min, length_max, parking)

    hikes_schema = HikeSchema(many=True, exclude=["comments", "check_ins", "bookmarks_lists"])
    hikes_json = hikes_schema.dump(search_hikes)

    return jsonify({"hikes": hikes_json})


@app.route("/hikes/<hike_id>")
def show_hike(hike_id):
    """Show details on a particular hike."""

    hike = Hike.get_hike_by_id(hike_id)
    user_id = session.get("user_id", None)

    return render_template("hike_details.html", user_id=user_id, hike=hike, GOOGLE_KEY=GOOGLE_KEY)


@app.route("/edit-user", methods=["POST"])
def edit_user():
    """Edit a user"""

    logged_in_email = session.get("user_email")
    user = User.get_user_by_email(logged_in_email)

    full_name = request.form.get("full_name")
    email = request.form.get("email")
    password = request.form.get("new-password")

    if full_name != "":
        user.full_name = full_name
        flash("Name updated ✓")

    if email != "":
        user_exists = User.get_user_by_email(email)
        if user_exists:
            flash(
                "There is already an account associated with that email."
            )
        else:
            user.email = email
            session["user_email"] = user.email
            flash("Email updated ✓")

    if password != "":
        user.password = password
        flash("Password updated ✓")

    db.session.commit()

    return redirect(request.referrer)


@app.route("/add-pet", methods=["POST"])
def add_pet():
    """Create a pet profile"""

    logged_in_email = session.get("user_email")
    user = User.get_user_by_email(logged_in_email)

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

    pet = Pet.create_pet(
        user,
        pet_name,
        gender,
        birthday,
        breed,
        pet_img_url,
        img_public_id,
        [],
    )
    db.session.add(pet)
    db.session.commit()

    pet_schema = PetSchema()
    pet_json = pet_schema.dump(pet)

    return jsonify({"success": True, "petAdded": pet_json})


@app.route("/edit-pet/<pet_id>", methods=["POST"])
def edit_pet(pet_id):
    """Edit a pet"""

    pet = Pet.get_pet_by_id(pet_id)
    form_data = request.form.to_dict("formData")
    pet.pet_name = form_data["petName"]
    gender = form_data["gender"]
    birthday = form_data["birthday"]
    breed = form_data["breed"]
    my_file = request.files.get("imageFile")

    if gender != "":
        pet.gender = gender
    if birthday != "":
        pet.birthday = birthday
    if breed != "":
        pet.breed = breed

    if my_file: # if user uploads new image file, delete old image from cloudinary
    # then upload new image
        img_public_id = pet.img_public_id
        if img_public_id:
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

        pet.pet_img_url = result["secure_url"]
        pet.img_public_id = result["public_id"]

    db.session.commit()

    return jsonify({"success": True})


@app.route("/delete-pet/<pet_id>", methods=["DELETE"])
def delete_pet(pet_id):
    """Delete a pet profile"""

    pet = Pet.get_pet_by_id(pet_id)
    img_public_id = pet.img_public_id
    if img_public_id:
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

    logged_in_email = session.get("user_email")
    user = User.get_user_by_email(logged_in_email)
    hike = Hike.get_hike_by_id(hike_id)
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
        pet_obj = Pet.get_pet_by_id(pet[pet_id])
        if pet[select] is True:
            pets_to_check_in.append(pet_obj)
        else:
            pets_not_checked_in.append(pet_obj)

    check_in = CheckIn.create_check_in(
        user,
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

    logged_in_email = session.get("user_email")
    user = User.get_user_by_email(logged_in_email)
    hike_id = request.get_json().get("hikeId")
    # pets_checked = list of objects [(select, pet_name, pet_id), ...]
    pets_checked = request.get_json().get("allPetOptions")
    date_hiked = request.get_json().get("dateHiked")
    miles_completed = request.get_json().get("milesCompleted")
    total_time = request.get_json().get("totalTime")
    notes = request.get_json().get("notes")

    hike = Hike.get_hike_by_id(hike_id)

    if total_time == "":
        total_time = None

    pets_to_check_in = []
    pets_not_checked_in = []

    for pet in pets_checked:
        select, _, pet_id = pet
        pet_obj = Pet.get_pet_by_id(pet[pet_id])
        if pet[select]:
            pets_to_check_in.append(pet_obj)
        else:
            pets_not_checked_in.append(pet_obj)

    check_in = CheckIn.create_check_in(
        user,
        hike,
        pets_to_check_in,
        date_hiked,
        miles_completed,
        total_time,
        notes
    )

    db.session.add(check_in)
    db.session.commit()

    check_in_schema = CheckInSchema(only=["check_in_id",
                                          "date_hiked",
                                          "hike_id",
                                          "miles_completed",
                                          "notes",
                                          "pets",
                                          "total_time",
                                          "hike.hike_name",
                                          "hike.latitude",
                                          "hike.longitude"])
    check_in_json = check_in_schema.dump(check_in)

    return jsonify({"checkInAdded": check_in_json})


@app.route("/edit-check-in/<check_in_id>", methods=["POST"])
def edit_check_in(check_in_id):
    """Edit a check in"""

    check_in = CheckIn.get_check_in_by_id(check_in_id)

    pets_hike_status = request.get_json().get("petHikeStatus") # [{select: t/f, pet_name: <>, pet_id: <>}]
    date_hiked = request.get_json().get("dateHiked")
    miles_completed = request.get_json().get("milesCompleted")
    total_time = request.get_json().get("totalTime")
    notes = request.get_json().get("notes")

    pet_on_hike = False

    for pet_status in pets_hike_status:
        select, _, _ = pet_status
        if pet_status[select]:
            pet_on_hike = True
            break
    
    if not pet_on_hike:
        db.session.delete(check_in)
    else:
        for pet_status in pets_hike_status: # Add pets to check in
            select, _, pet_id = pet_status
            if pet_status[select] and pet_status[pet_id] not in [pet.pet_id for pet in check_in.pets]:
                pet_check_in = PetCheckIn.create_pet_check_in(pet_status[pet_id], check_in_id)
                db.session.add(pet_check_in)
            elif not pet_status[select] and pet_status[pet_id] in [pet.pet_id for pet in check_in.pets]:
                pet_check_in = PetCheckIn.get_pet_check_in_by_id_check_in_id(pet_status[pet_id], check_in_id)
                db.session.delete(pet_check_in)

        if date_hiked == "": # if date_hiked is left blank, use previous date_hiked
            date_hiked = check_in.date_hiked

        if miles_completed == "": # if miles_completed is left blank, use previous miles_completed
            miles_completed = check_in.miles_completed

        check_in.date_hiked = date_hiked
        check_in.miles_completed = miles_completed
        check_in.total_time = total_time
        check_in.notes = notes

    db.session.commit()

    return jsonify({"success": True})


@app.route("/delete-check-in/<check_in_id>", methods=["DELETE"])
def delete_check_in(check_in_id):
    """Delete a check-in"""

    check_in = CheckIn.get_check_in_by_id(check_in_id)
    check_in.pets.clear()

    db.session.delete(check_in)
    db.session.commit()

    return jsonify({"success": True})


@app.route("/create-bookmarks-list", methods=["POST"])
def create_bookmarks_list():
    """Create a bookmark list"""

    user_id = session.get("user_id")
    bookmarks_list_name = request.get_json().get("bookmarksListName")
    hikes = []

    bookmarks_list = BookmarksList.create_bookmarks_list(
        bookmarks_list_name, user_id, hikes
    )

    db.session.add(bookmarks_list)
    db.session.commit()

    return jsonify({"success": True})


@app.route("/edit-bookmarks-list/<bookmarks_list_id>", methods=["POST"])
def edit_bookmarks_list(bookmarks_list_id):
    """Edit a bookmark list"""

    bookmarks_list = BookmarksList.get_bookmarks_list_by_id(
        bookmarks_list_id
    )
    bookmarks_list.bookmarks_list_name = request.get_json().get("bookmarksListName")

    db.session.commit()

    return jsonify({"success": True})


@app.route("/delete-bookmarks-list/<bookmarks_list_id>", methods=["DELETE"])
def delete_bookmarks_list(bookmarks_list_id):
    """Delete a bookmarks list"""

    bookmarks_list = BookmarksList.get_bookmarks_list_by_id(
        bookmarks_list_id
    )
    bookmarks_list.hikes.clear()

    db.session.delete(bookmarks_list)
    db.session.commit()

    return jsonify({"success": True})


@app.route("/<bookmarks_list_id>/add-hikes", methods=["POST"])
def add_hikes_to_existing_bookmarks_list(bookmarks_list_id):
    """Add hikes to an existing bookmarks list"""

    hikes = request.get_json().get("allHikesOptions") # list of Hike objects
    bookmarks_list = BookmarksList.get_bookmarks_list_by_id(bookmarks_list_id)
    bookmarks_list_hikes = bookmarks_list.hikes

    for hike in hikes:
        hike_obj = Hike.get_hike_by_id(hike["hike_id"])
        if hike["select"] and hike_obj not in bookmarks_list_hikes:
            # if selected and no relationship, create relationship
            hike_bookmark = HikeBookmarksList.create_hike_bookmarks_list(hike["hike_id"], bookmarks_list_id)
            db.session.add(hike_bookmark)
        elif not hike["select"] and hike_obj in bookmarks_list_hikes:
            # if unselected and there's a relationship, delete relationship
            hike_bookmarks = HikeBookmarksList.get_hike_bookmarks_list_by_hike_id_bookmarks_list_id(hike["hike_id"], bookmarks_list_id)
            for hike_bookmark in hike_bookmarks:
                db.session.delete(hike_bookmark)

    db.session.commit()

    return jsonify({"success": True})


@app.route("/hikes/<hike_id>/add-hike-to-existing-list", methods=["POST"])
def add_hike_to_existing_bookmarks_list(hike_id):
    """Add hike to an existing bookmarks list"""

    hike = Hike.get_hike_by_id(hike_id)
    bookmarks_list_options = request.get_json().get("allBookmarksListOptions") # list of Bookmarks List objects

    for bookmarks_list in bookmarks_list_options:
        bookmarks_list_obj = BookmarksList.get_bookmarks_list_by_id(bookmarks_list["bookmarks_list_id"])
        bookmarks_list_hikes = bookmarks_list_obj.hikes
        if bookmarks_list["select"] and hike not in bookmarks_list_hikes:
            # if selected, check if there's already a relationship, else add relationship
            hike_bookmark = HikeBookmarksList.create_hike_bookmarks_list(hike_id, bookmarks_list["bookmarks_list_id"])
            db.session.add(hike_bookmark)
        elif not bookmarks_list["select"] and hike in bookmarks_list_hikes:
            # if unselected and there's a relationship, delete relationship
            hike_bookmarks = HikeBookmarksList.get_hike_bookmarks_list_by_hike_id_bookmarks_list_id(hike_id, bookmarks_list["bookmarks_list_id"])
            for hike_bookmark in hike_bookmarks:
                db.session.delete(hike_bookmark)

    db.session.commit()

    return jsonify({"success": True})


@app.route("/hikes/<hike_id>/add-hike-to-new-list", methods=["POST"])
def add_hike_to_new_bookmarks_list(hike_id):
    """Add hike to a new bookmarks list"""

    user_id = session.get("user_id")

    bookmarks_list_name = request.get_json().get("bookmarksListName")
    hikes = [Hike.get_hike_by_id(hike_id)]
    hike_bookmark = BookmarksList.create_bookmarks_list(
        bookmarks_list_name, user_id, hikes)

    db.session.add(hike_bookmark)
    db.session.commit()

    return jsonify({"success": True})


@app.route("/<bookmarks_list_id>/<hike_id>/remove-hike", methods=["DELETE"])
def remove_hike(bookmarks_list_id, hike_id):
    """Delete a hike from a bookmarks list"""

    hikes_bookmarks_lists = HikeBookmarksList.get_hike_bookmarks_list_by_hike_id_bookmarks_list_id(
        hike_id, bookmarks_list_id
    )

    for hikes_bookmarks_list in hikes_bookmarks_lists:
        db.session.delete(hikes_bookmarks_list)
    db.session.commit()

    return jsonify({"success": True})


@app.route("/add-comment", methods=["POST"])
def add_comment():
    """Add a comment for a hike"""

    logged_in_email = session.get("user_email")
    user = User.get_user_by_email(logged_in_email)
    hike_id = request.get_json().get("hikeId")
    hike = Hike.get_hike_by_id(hike_id)
    comment_body = request.get_json().get("commentBody")

    comment = Comment.create_comment(
        user, hike, comment_body, date_created=datetime.now(), edit=False, date_edited=None)
    db.session.add(comment)
    db.session.commit()

    comment_schema = CommentSchema()
    comment_json = comment_schema.dump(comment)

    return jsonify({"commentAdded": comment_json, "login": True})


@app.route("/edit-comment/<comment_id>", methods=["POST"])
def edit_comment(comment_id):
    """Edit a comment"""

    comment = Comment.get_comment_by_comment_id(comment_id)
    comment.body = request.get_json().get("commentBody")
    comment.edit = True
    comment.date_edited = datetime.now()

    db.session.commit()

    return jsonify({"success": True})


@app.route("/delete-comment/<comment_id>", methods=["DELETE"])
def delete_comment(comment_id):
    """Delete a comment"""

    comment = Comment.get_comment_by_comment_id(comment_id)

    db.session.delete(comment)
    db.session.commit()

    return jsonify({"success": True})


@app.route("/users", methods=["POST"])
def register_user():
    """Create a new user."""
    full_name = request.form.get("full_name")
    email = request.form.get("email")
    password = request.form.get("new-password")

    user = User.get_user_by_email(email)
    if user:
        flash(
            "There is already an account associated with that email. Please try again."
        )
    else:
        user = User.create_user(full_name, email, password)
        db.session.add(user)
        db.session.commit()
        flash("Success! Account created. Please log in.")

    return redirect(request.referrer)


@app.route("/login", methods=["POST"])
def process_login():
    """Process user login"""
    email = request.form.get("email")
    password = request.form.get("current-password")

    user = User.get_user_by_email(email)
    if not user or user.password != password:
        flash("The email or password is incorrect.")
    else:
        # Log in user by storing the user's email in session
        session["user_email"] = user.email
        session["user_id"] = user.user_id
        session["login"] = True
        flash(f"Welcome back, {user.full_name}!")

    return redirect(request.referrer)


@app.route("/logout")
def process_logout():
    """Log user out of site.

    Delete the login session
    """

    session.clear()

    flash("Successfully logged out!")
    return redirect(request.referrer)


@app.route("/hikes/<hike_id>/comments.json")
def get_hike_comments_json(hike_id):
    """Return a JSON response for a hike's comments."""

    comments = Comment.get_comment_by_hike_id(hike_id)

    comments_schema = CommentSchema(many=True)
    comments_json = comments_schema.dump(comments)

    return jsonify({"comments": comments_json})


@app.route("/user_comments.json")
def get_user_comments_json():
    """Return a JSON response for all user's comments."""

    user_id = session.get("user_id")
    comments = Comment.get_comment_by_user_id(user_id)

    comments_schema = CommentSchema(many=True)
    comments_json = comments_schema.dump(comments)

    return jsonify({"comments": comments_json})


@app.route("/check_in/<check_in_id>.json")
def get_check_in_json(check_in_id):
    """Return a JSON response for a check in."""

    user_id = session.get("user_id")
    check_in = CheckIn.get_check_in_by_id(check_in_id)
    pets = Pet.get_pets_by_user_id(user_id)

    check_in_schema = CheckInSchema()
    pet_schema = PetSchema(only=["pet_id","pet_name"])

    check_in_json = check_in_schema.dump(check_in)
    check_in_json["pets_not_on_hike"] = []
    check_in_json["pets"] = []

    for pet in pets:
        pet_json = pet_schema.dump(pet)
        if pet not in check_in.pets:
            check_in_json["pets_not_on_hike"].append(pet_json)
        else:
            check_in_json["pets"].append(pet_json)

    return jsonify({"checkIn": check_in_json})


@app.route("/hikes/<hike_id>/user_check_ins.json")
def get_hike_check_ins_json(hike_id):
    """Return a JSON response for a hike's check ins."""
    user_id = session.get("user_id")

    check_ins = CheckIn.get_check_ins_by_param(("user_id", user_id), ("hike_id", hike_id))

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
    user_id = session.get("user_id")
    check_ins = CheckIn.get_check_ins_by_param(("user_id", user_id))

    check_ins_schema = CheckInSchema(many=True, only=["check_in_id","date_hiked",\
        "hike_id","miles_completed","notes","pets","total_time","hike.hike_name",\
        "hike.latitude","hike.longitude"])
    check_ins_json = check_ins_schema.dump(check_ins)
    pets_schema = PetSchema(many=True, exclude=["check_ins"])

    for idx, check_in in enumerate(check_ins):
        pets_json = pets_schema.dump(sorted(check_in.pets, key=lambda x: x.pet_name.lower()))
        check_ins_json[idx]["pets"] = pets_json

    return jsonify({"checkIns": check_ins_json})


@app.route("/pets.json")
def get_pets_json():
    """Return a JSON response with all pets given user."""

    user_id = session.get("user_id")
    pets = Pet.get_pets_by_user_id(user_id)

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

    # Formatted for graph component data:
        # {"pet_id": <pet_id>,
        #  "pet_name": <pet_name>,
        #  "data": [
        #       {"date_hiked": <date_hiked>, "miles_completed": <miles_completed>},
        #       ...
        #   ]}

    pet_schema = PetSchema(only=["pet_id", "pet_name"])
    check_ins_schema = CheckInSchema(many=True, only=["date_hiked", "miles_completed"])

    user_id = session.get("user_id")
    pets = Pet.get_pets_by_user_id(user_id)

    check_in_data = []

    for pet in pets:
        pet_json = pet_schema.dump(pet)
        check_ins = Pet.get_check_ins_by_pet_id(pet.pet_id)
        pet_json["data"] = check_ins_schema.dump(check_ins)
        check_in_data.append(pet_json)

    return jsonify({"petCheckIns": check_in_data})


@app.route("/<bookmarks_list_id>/hikes.json")
def get_bookmarks_hikes_json(bookmarks_list_id):
    """Return a JSON response for a bookmarks list's hikes."""

    hikes_by_bookmark = BookmarksList.get_bookmarks_list_by_id(bookmarks_list_id)
    bookmark_schema = BookmarksListSchema()
    bookmark_json = bookmark_schema.dump(hikes_by_bookmark)

    hikes_schema = HikeSchema(many=True, exclude=["comments", "check_ins", "bookmarks_lists"])
    hikes_json = hikes_schema.dump(sorted(hikes_by_bookmark.hikes, key=lambda x: x.hike_name))

    bookmark_json["hikes"] = hikes_json

    return jsonify({"bookmarksLists": bookmark_json})


@app.route("/hikes/<hike_id>/bookmarks.json")
def get_hike_bookmarks_json(hike_id):
    """Return a JSON response for a hike's bookmarks."""

    user_id = session.get("user_id")

    bookmarks_by_hike = BookmarksList.get_bookmarks_lists_by_user_id_and_hike_id(user_id, hike_id)

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

    user_id = session.get("user_id")
    bookmarks_by_user = BookmarksList.get_bookmarks_lists_by_user_id(user_id)

    bookmarks_schema = BookmarksListSchema(many=True)
    bookmarks_json = bookmarks_schema.dump(bookmarks_by_user)

    hikes_schema = HikeSchema(many=True, exclude=["comments", "check_ins", "bookmarks_lists"])

    for idx, bookmark in enumerate(bookmarks_by_user):
        sorted_hikes = sorted(bookmark.hikes, key=lambda x: (x.hike_name, x.difficulty))
        hikes_json = hikes_schema.dump(sorted_hikes)
        bookmarks_json[idx]["hikes"] = hikes_json

    return jsonify({"bookmarksLists": bookmarks_json})


@app.route("/hikes/<hike_id>.json")
def get_hike(hike_id):
    """Return a JSON response for a hike"""

    # Populate the list of hike objects that fulfill the search criteria
    hike = Hike.get_hike_by_id(hike_id)

    hike_schema = HikeSchema(exclude=["comments", "check_ins", "bookmarks_lists"])
    hike_json = hike_schema.dump(hike)

    return jsonify({"hike": hike_json})


@app.route("/all_hikes.json")
def get_all_hikes():
    """Return a JSON response for all hikes"""

    hikes = Hike.get_hikes()

    hikes_schema = HikeSchema(many=True, exclude=["comments", "check_ins", "bookmarks_lists"])
    hikes_json = hikes_schema.dump(hikes)

    return jsonify({"hikes": hikes_json})


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
