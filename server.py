"""Server for pup journey app."""

from flask import Flask, render_template, json, jsonify, request, flash, session, redirect
import cloudinary.uploader
import os
from datetime import datetime
from calendar import month_abbr

from model import connect_to_db, db, ma, app, PetSchema, CheckInSchema
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


@app.route("/check-in", methods=["POST"])
def add_check_in():
    """Add check in for a hike."""

    logged_in_email = session.get("user_email")

    if logged_in_email is None:
        flash("You must log in to check in.")
    else:
        hike_id = request.form.get("hike_id")
        hike = crud_hikes.get_hike_by_id(hike_id)

        pet_ids = request.form.getlist("add-check-in-pet_id") # this should be a list

        # if pet_ids == []:
        #     flash(f"Please try again.")
        #     return redirect(request.referrer)

        pets = []

        for pet_id in pet_ids:
            pets.append(crud_pets.get_pet_by_id(pet_id))

        date_hiked = request.form.get("date_hiked")

        miles_completed = request.form.get("miles_completed")

        if miles_completed == "":
            miles_completed = None

        total_time = request.form.get("total_time")

        if total_time == "":
            total_time = None

        notes = request.form.get("notes")

        if notes == "":
            notes = None

        check_in = crud_check_ins.create_check_in(
            hike,
            pets,
            date_hiked,
            miles_completed,
            total_time,
            notes
        )

        db.session.add(check_in)
        db.session.commit()
        flash(f"Success! You've checked into {hike.hike_name}.")

    return redirect(request.referrer)


@app.route("/edit-check-in", methods=["POST"])
def edit_check_in():
    """Edit a check in"""

    # would be nice for this to be a react inline form editor

    logged_in_email = session.get("user_email")

    if logged_in_email is None:
        flash("You must log in to edit a check in.")
    else:
        add_pet_ids = request.form.getlist("add_pet_id")
        remove_pet_ids = request.form.getlist("remove_pet_id")
        check_in_id = request.form.get("check_in_id")
        
        # Add pets to check in
        for add_pet_id in add_pet_ids:
            pet_check_in = crud_pets_check_ins.create_pet_check_in(add_pet_id, check_in_id)
            db.session.add(pet_check_in)

        # Remove pets from check in
        for remove_pet_id in remove_pet_ids:
            pet_check_in = crud_pets_check_ins.get_pet_check_in_by_pet_id_check_in_id(remove_pet_id, check_in_id)
            db.session.delete(pet_check_in)
        
        check_in = crud_check_ins.get_check_ins_by_check_in_id(check_in_id)

        date_hiked = request.form.get("date_hiked")
        
        if date_hiked == "":
            date_hiked = check_in.date_hiked

        miles_completed = request.form.get("miles_completed")

        if miles_completed == "":
            miles_completed = check_in.miles_completed

        total_time = request.form.get("total_time")

        if total_time == "":
            total_time = check_in.total_time

        notes = request.form.get("notes")

        check_in.date_hiked = date_hiked
        check_in.miles_completed = miles_completed
        check_in.total_time = total_time
        check_in.notes = notes

        if check_in.pets == []:
            db.session.delete(check_in)

        flash(f"Success! Your check in has been updated.")

        db.session.commit()

    return redirect(request.referrer)


@app.route("/delete-check-in", methods=["POST"])
def delete_check_in():
    """Delete a check-in"""

    logged_in_email = session.get("user_email")

    if logged_in_email is None:
        flash("You must log in to delete a check in.")
    else:
        check_in_id = request.form.get("delete")
        check_in = crud_check_ins.get_check_ins_by_check_in_id(check_in_id)
        check_in.pets.clear()

        flash(
            f"Success! Check in at {check_in.hike.hike_name} has been deleted."
        )

        db.session.delete(check_in)
        db.session.commit()

    return redirect(request.referrer)


@app.route("/delete-pet-check-in", methods=["POST"])
def delete_pet_check_in():
    """Delete a check-in from a pet"""

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


@app.route("/edit-bookmarks-list", methods=["POST"])
def edit_bookmarks_list():
    """Edit a bookmark list"""

    logged_in_email = session.get("user_email")

    if logged_in_email is None:
        flash("You must log in to edit a bookmarks list.")
    else:
        bookmarks_list_id = request.form.get("edit")
        bookmarks_list = crud_bookmarks_lists.get_bookmarks_list_by_bookmarks_list_id(
            bookmarks_list_id
        )
        bookmarks_list.bookmarks_list_name = request.form.get("bookmarks_list_name")

        flash(f"Success! Your list has been renamed to {bookmarks_list.bookmarks_list_name}.")

        db.session.commit()

    return redirect(request.referrer)


@app.route("/delete-bookmarks-list", methods=["POST"])
def delete_bookmarks_list():
    """Delete a bookmarks list"""

    logged_in_email = session.get("user_email")

    if logged_in_email is None:
        flash("You must log in to delete a bookmarks list.")
    else:
        bookmarks_list_id = request.form.get("delete")
        bookmarks_list = crud_bookmarks_lists.get_bookmarks_list_by_bookmarks_list_id(
            bookmarks_list_id
        )
        bookmarks_list.hikes.clear()

        flash(f"Success! Your lisit named {bookmarks_list.bookmarks_list_name} has been deleted.")

        db.session.delete(bookmarks_list)
        db.session.commit()

    return redirect(request.referrer)


@app.route("/add-hike", methods=["POST"])
def add_hike_to_bookmark():
    """Add hike to a bookmarks list"""
    logged_in_email = session.get("user_email")

    if logged_in_email is None:
        flash("You must log in to bookmark a hike.")
    else:
        user = crud_users.get_user_by_email(logged_in_email)

        bookmarks_list_name = request.form.get("bookmarks_list_name", "")
        bookmarks_list_id = request.form.get("bookmarks_list_id")
        hike_ids = request.form.getlist("hike_id")

        

        # if there is an existing bookmarks list, create a new association object between hike and bookmarks list
        if bookmarks_list_id != None and bookmarks_list_id != "":
            for hike_id in hike_ids:
                hike_bookmark = crud_hikes_bookmarks_lists.create_hike_bookmarks_list(hike_id, bookmarks_list_id)
                db.session.add(hike_bookmark)
        # otherwise, create a new bookmarks with hike as a list of hike objects
        else:
            hikes = []

            for hike_id in hike_ids:
                hikes.append(crud_hikes.get_hike_by_id(hike_id))
                
            hike_bookmark = crud_bookmarks_lists.create_bookmarks_list(
                bookmarks_list_name, user.user_id, hikes
            )
            db.session.add(hike_bookmark)

        db.session.commit()

        flash(
            f"Success!"
        )

    return redirect(request.referrer)


@app.route("/remove-hike", methods=["POST"])
def remove_hike():
    """Delete a hike from a bookmarks list"""

    logged_in_email = session.get("user_email")

    if logged_in_email is None:
        flash("You must log in to remove a hike from your bookmarks.")
    else:
        hike_id, bookmarks_list_id = request.form.get("delete").split(",")
        hike = crud_hikes.get_hike_by_id(hike_id)
        bookmarks_list = crud_bookmarks_lists.get_bookmarks_list_by_bookmarks_list_id(
            bookmarks_list_id
        )
        hikes_bookmarks_list = crud_hikes_bookmarks_lists.get_hike_bookmarks_list_by_hike_id_bookmarks_list_id(
            hike_id, bookmarks_list_id
        )

        flash(
            f"Success! {hike.hike_name} has been removed from {bookmarks_list.bookmarks_list_name}."
        )

        db.session.delete(hikes_bookmarks_list)
        db.session.commit()

    return redirect(request.referrer)


@app.route("/hikes/<hike_id>/comments", methods=["POST"])
def add_comment(hike_id):
    """Add a comment for a hike"""
    logged_in_email = session.get("user_email")

    if logged_in_email is None:
        flash("You must log in to add a comment.")
    else:
        user = crud_users.get_user_by_email(logged_in_email)
        hike = crud_hikes.get_hike_by_id(hike_id)
        body = request.form.get("body")
        date_created = datetime.now()
        edit = False
        date_edited = None

        comment = crud_comments.create_comment(
            user, hike, body, date_created, edit, date_edited
        )
        db.session.add(comment)
        db.session.commit()

    return redirect(request.referrer)


@app.route("/edit-comment", methods=["POST"])
def edit_comment():
    """Edit a comment"""

    logged_in_email = session.get("user_email")

    if logged_in_email is None:
        flash("You must log in to edit a bookmarks list.")
    else:
        comment_id = request.form.get("edit")
        comment = crud_comments.get_comment_by_comment_id(comment_id)
        comment.body = request.form.get("body")
        comment.edit = True
        comment.date_edited = datetime.now()

        flash(f"Success! Your comment has been updated.")

        db.session.commit()

    return redirect(request.referrer)


@app.route("/delete-comment", methods=["POST"])
def delete_comment():
    """Delete a comment"""

    logged_in_email = session.get("user_email")

    if logged_in_email is None:
        flash("You must log in to delete a comment.")
    else:
        comment_id = request.form.get("delete")
        comment = crud_comments.get_comment_by_comment_id(comment_id)

        flash(f"Success! Your comment has been deleted.")

        db.session.delete(comment)
        db.session.commit()

    return redirect(request.referrer)


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

        sorted_check_ins = sorted(pet.check_ins, key=lambda x: x.date_hiked, reverse=True)

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


@app.route("/user_bookmarks.json")
def get_user_bookmarks():
    """Return a JSON response with all bookmarks for a user."""

    logged_in_email = session.get("user_email")
    user = crud_users.get_user_by_email(logged_in_email)

    # Get list of bookmark objects for the user
    bookmarks_by_user = crud_bookmarks_lists.get_bookmarks_lists_by_user_id(user.user_id)

    # {"bookmark_list_id": "1",
    #  "bookmark_name": "...",
    #  "hikes": [{"hike_id": "1",
    #             "hike_name": "...",
    #             "area":
    #             "difficulty":
    #             "leash_rule":
    #             "latitude":
    #             "longitude":
    #             "city":
    #             "state":
    #             "miles"
    #             "parking"}
    #            , {"..."}, {"..."}]}

    bookmarks_schema = BookmarksListSchema(many=True)
    bookmarks_json = bookmarks_schema.dump(bookmarks_by_user)

    return jsonify({"bookmarks": bookmarks_by_user})


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
