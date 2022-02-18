"""Server for pup journey app."""

from flask import Flask, render_template, json, jsonify, request, flash, session, redirect
import cloudinary.uploader
import os
from datetime import datetime
from calendar import month_abbr

from model import connect_to_db, db, ma, app, User, CheckIn, Pet, Hike, Comment, PetSchema, CheckInSchema, BookmarksListSchema, HikeBookmarksListSchema, HikeSchema, CommentSchema
import crud_bookmarks_lists
import crud_check_ins
import crud_comments
import crud_hikes_bookmarks_lists
import crud_hikes
import crud_pets_check_ins
import crud_pets
import crud_users

from jinja2 import StrictUndefined

app.secret_key = "dev"
app.jinja_env.undefined = StrictUndefined

CLOUDINARY_KEY = os.environ["CLOUDINARY_KEY"]
CLOUDINARY_SECRET = os.environ["CLOUDINARY_SECRET"]
CLOUD_NAME = "hbpupjourney"
GOOGLE_KEY = os.environ["GOOGLE_KEY"]


@app.route("/")
def homepage():
    """View homepage."""

    return render_template("homepage.html")


@app.route("/dashboard")
def dashboard():
    """View dashboard."""

    if "user_email" in session:
        user = crud_users.get_user_by_email(session["user_email"])
        pets = crud_pets.get_pets_by_user_id(user.user_id)
        hikes = crud_hikes.get_hikes()
        check_ins = crud_check_ins.get_check_ins_by_user_id(user.user_id)
        years = list(set(check_in.date_hiked.year
                            for check_in in check_ins))
        month_nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        current_date = datetime.now()
        current_month_index = current_date.month
        month_nums_sorted = month_nums[current_month_index-1:] + month_nums[0: current_month_index-1]
        months_abbr = month_abbr[current_month_index:] + month_abbr[1:current_month_index]
        months = zip(month_nums_sorted, months_abbr)

        # month = datetime.now().month
        
        bookmarks_lists = crud_bookmarks_lists.get_bookmarks_lists_by_user_id(
            user.user_id
        )

        return render_template("dashboard.html",
                                pets=pets,
                                hikes=hikes,
                                check_ins=check_ins,
                                months=months,
                                years=years,
                                bookmarks_lists=bookmarks_lists,
                                GOOGLE_KEY=GOOGLE_KEY)
    else:
        flash("You must log in to view your dashboard.")

        return redirect("/")


@app.route("/hikes")
def all_hikes():
    """View all hikes."""

    # Populate options for the search bar
    search_hikes = hikes = crud_hikes.get_hikes()
    states = crud_hikes.get_hike_states()
    cities = crud_hikes.get_hike_cities()
    areas = crud_hikes.get_hike_areas()
    parking = crud_hikes.get_hike_parking()

    logged_in_email = session.get("user_email")

    if logged_in_email != None:
        user = crud_users.get_user_by_email(session["user_email"])
        bookmarks_list_by_user = crud_bookmarks_lists.get_bookmarks_lists_by_user_id(user.user_id)
    else:
        bookmarks_list_by_user = None

    return render_template(
        "all_hikes.html",
        search_hikes=search_hikes,
        hikes=hikes,
        states=states,
        cities=cities,
        areas=areas,
        parking=parking,
        bookmarks_list_by_user=bookmarks_list_by_user)


@app.route("/hikes/search")
def find_hikes():
    """Search for hikes"""

    keyword = request.args.get("keyword", "")
    difficulties = request.args.getlist("difficulty")
    leash_rules = request.args.getlist("leash_rule")
    areas = request.args.getlist("area")
    cities = request.args.getlist("city")
    state = request.args.get("state", "")
    length_min = request.args.get("length_min", "")
    length_max = request.args.get("length_max", "")
    park = request.args.getlist("parking")

    # Populate the list of hikes
    search_hikes = crud_hikes.get_hikes_by_search(keyword, difficulties, leash_rules, areas, cities, state, length_min, length_max, park)
    # Populate options for the search bar
    hikes = crud_hikes.get_hikes()
    states = crud_hikes.get_hike_states()
    cities = crud_hikes.get_hike_cities()
    areas = crud_hikes.get_hike_areas()
    parking = crud_hikes.get_hike_parking()

    logged_in_email = session.get("user_email")

    if logged_in_email != None:
        user = crud_users.get_user_by_email(session["user_email"])
        bookmarks_list_by_user = crud_bookmarks_lists.get_bookmarks_lists_by_user_id(user.user_id)
    else:
        bookmarks_list_by_user = None

    return render_template(
        "all_hikes.html",
        search_hikes=search_hikes,
        hikes=hikes,
        states=states,
        cities=cities,
        areas=areas,
        parking=parking,
        bookmarks_list_by_user=bookmarks_list_by_user
    )


@app.route("/hikes/<hike_id>")
def show_hike(hike_id):
    """Show details on a particular hike."""

    hike = crud_hikes.get_hike_by_id(hike_id)
    hike_resources = hike.resources.split(",")
    comments = crud_comments.get_comment_by_hike_id(hike_id)
    states = crud_hikes.get_hike_states()
    cities = crud_hikes.get_hike_cities()
    areas = crud_hikes.get_hike_areas()
    parking = crud_hikes.get_hike_parking()

    logged_in_email = session.get("user_email")

    if logged_in_email is None:

        return render_template(
            "hike_details.html",
            hike=hike,
            hike_resources=hike_resources,
            comments=comments,
            states=states,
            cities=cities,
            areas=areas,
            parking=parking,
            GOOGLE_KEY=GOOGLE_KEY
        )
    else:
        user = crud_users.get_user_by_email(logged_in_email)

        pets = crud_pets.get_pets_by_user_id(user.user_id)

        # find all check ins for all user's pets for the hike
        check_ins = crud_check_ins.get_check_ins_by_user_id_hike_id(user.user_id, hike.hike_id)

        # find all bookmarks for the user for the hike
        bookmarks_list_by_user = crud_bookmarks_lists.get_bookmarks_lists_by_user_id(
            user.user_id
        )
        bookmarks_lists_by_user_hike = (
            crud_bookmarks_lists.get_bookmarks_lists_by_user_id_and_hike_id(
                user.user_id, hike.hike_id
            )
        )

        return render_template(
            "hike_details.html",
            hike=hike,
            hike_resources=hike_resources,
            user=user,
            comments=comments,
            pets=pets,
            check_ins=check_ins,
            bookmarks_list_by_user=bookmarks_list_by_user,
            bookmarks_lists_by_user_hike=bookmarks_lists_by_user_hike,
            states=states,
            cities=cities,
            areas=areas,
            parking=parking,
            GOOGLE_KEY=GOOGLE_KEY
        )


@app.route("/add-pet", methods=["POST"])
def add_pet():
    """Create a pet profile"""

    logged_in_email = session.get("user_email")

    if logged_in_email is None:
        flash("You must log in to add a pet profile.")
    else:
        user = crud_users.get_user_by_email(logged_in_email)

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

        if my_file.filename == "":
            pet_imgURL = None
            img_public_id = None
        else:
            # save the uploaded file to Cloudinary by making an API request
            result = cloudinary.uploader.upload(
                my_file,
                api_key=CLOUDINARY_KEY,
                api_secret=CLOUDINARY_SECRET,
                cloud_name=CLOUD_NAME,
            )

            pet_imgURL = result["secure_url"]
            img_public_id = result["public_id"]

        check_ins = []

        pet = crud_pets.create_pet(
            user,
            pet_name,
            gender,
            birthday,
            breed,
            pet_imgURL,
            img_public_id,
            check_ins,
        )
        db.session.add(pet)
        db.session.commit()
        flash(f"Success! {pet_name} profile has been added.")

        pet_schema = PetSchema()
        pet_json = pet_schema.dump(pet)

    # return jsonify({"success": True, "petAdded": pet_json})
    return redirect(request.referrer)


@app.route("/edit-pet", methods=["POST"])
def edit_pet():
    """Edit a pet"""

    # would be nice for this to be a react inline form editor

    logged_in_email = session.get("user_email")

    if logged_in_email is None:
        flash("You must log in to edit a pet profile.")
    else:
        # this would be better if user can edit one line at a time,
        # in case they want to keep some info and change/remove other info
        pet_id = request.form.get("edit")
        pet = crud_pets.get_pet_by_id(pet_id)

        pet.pet_name = request.form.get("pet_name")

        gender = request.form.get("gender")
        birthday = request.form.get("birthday")
        breed = request.form.get("breed")
        my_file = request.files["my_file"]

        if gender != "":
            pet.gender = gender
        if birthday != "":
            pet.birthday = birthday
        if breed != "":
            pet.breed = breed

        # if user uploads new image file, delete old image from cloudinary
        # then upload new image
        if my_file.filename != "":
            img_public_id = pet.img_public_id
            if img_public_id != None:
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

        flash(f"Success! Your {pet.pet_name}'s profile has been updated.")

        db.session.commit()

    return redirect(request.referrer)


@app.route("/delete-pet", methods=["POST"])
def delete_pet():
    """Delete a pet profile"""

    logged_in_email = session.get("user_email")

    if logged_in_email is None:
        flash("You must log in to delete a pet profile.")
    else:
        pet_id = request.form.get("delete")
        pet = crud_pets.get_pet_by_id(pet_id)
        img_public_id = pet.img_public_id
        if img_public_id != None:
            cloudinary.uploader.destroy(
                img_public_id,
                api_key=CLOUDINARY_KEY,
                api_secret=CLOUDINARY_SECRET,
                cloud_name=CLOUD_NAME,
            )
        flash(f"Success! {pet.pet_name} profile has been deleted.")

        db.session.delete(pet)
        db.session.commit()

    return redirect(request.referrer)


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

    # pet_schema = PetSchema()

    # check_in_json["pets_not_on_hike"] = PetSchema(many=True).dump(pets_not_checked_in)
    # check_in_json["pets"] = PetSchema(many=True).dump(pets_to_check_in)

    # check_in_json = {"check_in_id": check_in.check_in_id,
    #                 "date_hiked": check_in.date_hiked,
    #                 "hike_id": check_in.hike_id,
    #                 "hike_name": check_in.hike.hike_name,
    #                 "miles_completed": check_in.miles_completed,
    #                 "notes": check_in.notes,
    #                 "pets": pets_to_check_in,
    #                 "pets_not_on_hike": pets_not_checked_in,
    #                 "total_time": check_in.total_time}

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


@app.route("/add-bookmarks-list", methods=["POST"])
def add_bookmarks_list():
    """Create a bookmark list"""

    if "user_email" in session:
        user = crud_users.get_user_by_email(session["user_email"])
        bookmarks_list_name = request.form.get("bookmarks_list_name")
        hikes = []

        bookmarks_list = crud_bookmarks_lists.create_bookmarks_list(
            bookmarks_list_name, user.user_id, hikes
        )

        db.session.add(bookmarks_list)
        db.session.commit()

        flash(f"Success! {bookmarks_list_name} has been added to your bookmarks.")

        return redirect(request.referrer)
    else:
        flash("You must log in to add a bookmark list.")

        return redirect("/")


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


@app.route("/hikes/<hike_id>/add-hike-to-existing-list", methods=["POST"])
def add_hike_to_existing_bookmarks_list(hike_id):
    """Add hike to an existing bookmarks list"""

    hike = crud_hikes.get_hike_by_id(hike_id)
    bookmarks_list_options = request.get_json().get("allBookmarksListOptions") # this will get a list of objects

    for bookmarks_list in bookmarks_list_options:
        select, _, bookmarks_list_id = bookmarks_list
        bookmarks_list_obj = crud_bookmarks_lists.get_bookmarks_list_by_bookmarks_list_id(bookmarks_list[bookmarks_list_id])
        bookmarks_list_hikes = bookmarks_list_obj.hikes
        if bookmarks_list[select] is True and hike not in bookmarks_list_hikes:
            # if selected, check if there's already a connection, else add connection
            hike_bookmark = crud_hikes_bookmarks_lists.create_hike_bookmarks_list(hike_id, bookmarks_list[bookmarks_list_id])
            db.session.add(hike_bookmark)
        elif bookmarks_list[select] is False and hike in bookmarks_list_hikes:
            # if unselected and there's a connection, delete connection
            hike_bookmark = crud_hikes_bookmarks_lists.get_hike_bookmarks_list_by_hike_id_bookmarks_list_id(hike_id, bookmarks_list[bookmarks_list_id])
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
    hikes_bookmarks_list = crud_hikes_bookmarks_lists.get_hike_bookmarks_list_by_hike_id_bookmarks_list_id(
        hike_id, bookmarks_list_id
    )

    db.session.delete(hikes_bookmarks_list)
    db.session.commit()

    return jsonify({"success": True})


@app.route("/hikes/<hike_id>/add-comment", methods=["POST"])
def add_comment(hike_id):
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


@app.route("/edit-comment/<comment_id>", methods=["POST"])
def edit_comment(comment_id):
    """Edit a comment"""

    comment = crud_comments.get_comment_by_comment_id(comment_id)
    comment.body = request.get_json().get("comment_body")
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
    password = request.form.get("password")

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
    password = request.form.get("password")

    user = crud_users.get_user_by_email(email)
    if not user or user.password != password:
        flash("The email or password is incorrect.")
    else:
        # Log in user by storing the user's email in session
        session["user_email"] = user.email
        session["login"] = True
        flash(f"Welcome back, {user.full_name}!")

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
def get_comments_json(hike_id):
    """Return a JSON response for a hike's comments."""
    
    comments = crud_comments.get_comment_by_hike_id(hike_id)

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
def get_user_hike_check_ins_json(hike_id):
    """Return a JSON response for a hike's check ins."""
    logged_in_email = session.get("user_email")
    user = (db.session.query(User).filter(User.email == logged_in_email)
                                 .options(db.joinedload('pets'))
                                 .first())

    # sorted list of check in objects
    check_ins = crud_check_ins.get_check_ins_by_user_id_hike_id(user.user_id, hike_id)

    all_check_ins = []
    
    for check_in in check_ins:
        pets_not_checked_in = []
        pets_checked_in = []
        for pet in sorted(user.pets, key=lambda x: x.pet_name):
            if pet not in check_in.pets:
                pets_not_checked_in.append({"pet_id": pet.pet_id, "pet_name": pet.pet_name})
            else:
                pets_checked_in.append({"pet_id": pet.pet_id, "pet_name": pet.pet_name})
        all_check_ins.append(
            {"check_in_id": check_in.check_in_id,
            "date_hiked": check_in.date_hiked,
            "hike_id": check_in.hike_id,
            "hike_name": check_in.hike.hike_name,
            "miles_completed": check_in.miles_completed,
            "notes": check_in.notes,
            "pets": pets_checked_in,
            "pets_not_on_hike": pets_not_checked_in,
            "total_time": check_in.total_time})

    return jsonify({"checkIns": all_check_ins})


@app.route("/hikes/<hike_id>/check_ins.json")
def get_hike_check_ins_json(hike_id):
    """Return a JSON response for a hike's check ins."""
    check_ins = crud_check_ins.get_check_ins_by_hike_id(hike_id)

    check_ins_schema = CheckInSchema(many=True)
    check_ins_json = check_ins_schema.dump(check_ins)

    return jsonify({"checkIns": check_ins_json})


@app.route("/pets.json")
def get_pets_json():
    """Return a JSON response with all pets given user."""

    logged_in_email = session.get("user_email")

    user = crud_users.get_user_by_email(logged_in_email)
    pets = crud_pets.get_pets_by_user_id(user.user_id)

    pets_schema = PetSchema(many=True)
    pets_json = pets_schema.dump(pets)

    return jsonify({"pets": pets_json})


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


@app.route("/dashboard_map_coordinates.json")
def get_user_check_in_coordinates():
    """Return a JSON response with all coordinates for a user."""

    logged_in_email = session.get("user_email")
    user = crud_users.get_user_by_email(logged_in_email)

    # Get list of unique check in objects for the user
    check_ins_by_user = crud_check_ins.get_check_ins_by_user_id(user.user_id)

    # For each check in
    # Get unique hikes
    # For each hike
    # Create a new object with hike_name, latitude, and longitude

    hikes = set()

    for check_in in check_ins_by_user:
        hikes.add(check_in.hike)
    
    user_hike_data = []

    for hike in hikes:
        hike_data = {"hike_name": hike.hike_name, "latitude": hike.latitude, "longitude": hike.longitude}
 
        user_hike_data.append(hike_data)

    return jsonify({"checkInCoordinates": user_hike_data})


@app.route("/<bookmarks_list_id>/hikes.json")
def get_bookmarks_hikes_json(bookmarks_list_id):
    """Return a JSON response for a bookmarks list's hikes."""

    # get one bookmarks object with list of hikes
    # convert to JSON
    hikes_by_bookmark = crud_bookmarks_lists.get_bookmarks_list_by_bookmarks_list_id(bookmarks_list_id)
    bookmark_schema = BookmarksListSchema()
    bookmark_json = bookmark_schema.dump(hikes_by_bookmark)

    # sort hikes in alphabetical order
    # convert to JSON
    # add to bookmark object
    sorted_hikes_by_bookmark = sorted(hikes_by_bookmark.hikes, key=lambda x: x.hike_name)
    hikes_schema = HikeSchema(many=True, only=["area", "city", "state", "difficulty", "hike_id", "hike_name", "leash_rule", "miles", "parking"])
    hikes_json = hikes_schema.dump(sorted_hikes_by_bookmark)

    bookmark_json["hikes"] = hikes_json

    return jsonify({"bookmarksLists": bookmark_json})


@app.route("/hikes/<hike_id>/bookmarks.json")
def get_hike_bookmarks_json(hike_id):
    """Return a JSON response for a hike's bookmarks."""
    
    logged_in_email = session.get("user_email")
    user = crud_users.get_user_by_email(logged_in_email)

    bookmarks_by_hike = crud_bookmarks_lists.get_bookmarks_lists_by_user_id_and_hike_id(user.user_id, hike_id)

    sorted_bookmarks_by_hike = sorted(bookmarks_by_hike, key=lambda x: x.bookmarks_list_name)

    bookmarks_schema = BookmarksListSchema(many=True)
    bookmarks_json = bookmarks_schema.dump(sorted_bookmarks_by_hike)


    # for each hike on the bookmarks list, serialize the o

    hikes_schema = HikeSchema(many=True, only=["area", "city", "state", "difficulty", "hike_id", "hike_name", "leash_rule", "miles", "parking"])

    for bookmark_json in bookmarks_json:
        for bookmarks_list in sorted_bookmarks_by_hike:
            hikes_json = hikes_schema.dump(sorted(bookmarks_list.hikes, key=lambda x: x.hike_name))
            bookmark_json["hikes"] = hikes_json

    return jsonify({"bookmarksLists": bookmarks_json})


@app.route("/user_bookmarks_lists.json")
def get_user_bookmarks_lists():
    """Return a JSON response with all bookmarks lists for a user."""

    logged_in_email = session.get("user_email")
    user = crud_users.get_user_by_email(logged_in_email)

    # Get list of bookmark objects for the user
    bookmarks_by_user = crud_bookmarks_lists.get_bookmarks_lists_by_user_id(user.user_id)
    sorted_bookmarks_by_user = sorted(bookmarks_by_user, key=lambda x: x.bookmarks_list_name)

    bookmarks_schema = BookmarksListSchema(many=True)
    bookmarks_json = bookmarks_schema.dump(bookmarks_by_user)

    hikes_schema = HikeSchema(many=True, only=["area", "city", "state", "difficulty", "hike_id", "hike_name", "leash_rule", "miles", "parking"])

    # for bookmark in bookmarks_json:
    #     for bookmarks_list in sorted_bookmarks_by_user:
    #         hikes_json = hikes_schema.dump(sorted(bookmarks_list.hikes, key=lambda x: x.hike_name))
    #         bookmark_json["hikes"] = hikes_json

    return jsonify({"bookmarksLists": bookmarks_json})


@app.route("/search_results.json")
def search_results():
    """Search for hikes"""

    keyword = request.args.get("keyword", "")
    difficulties = request.args.getlist("difficulty")
    leash_rules = request.args.getlist("leash_rule")
    areas = request.args.getlist("area")
    cities = request.args.getlist("city")
    state = request.args.get("state", "")
    length_min = request.args.get("length_min", "")
    length_max = request.args.get("length_max", "")
    park = request.args.getlist("parking")

    # Populate the list of hike objects that fulfill the search criteria
    search_hikes = crud_hikes.get_hikes_by_search(keyword, difficulties, leash_rules, areas, cities, state, length_min, length_max, park)
 
    hikes_schema = HikeSchema(many=True)
    hikes_json = hikes_schema.dump(hikes)

    return jsonify({"hikes": hikes_json})


if __name__ == "__main__":
    # DebugToolbarExtension(app)
    connect_to_db(app)
    app.run(host="0.0.0.0", debug=True)
