# Pup Journey

Do you love going on hikes with your dogs? Pup Journey is a platform where any user can search, filter and sort dog-friendly hikes on the west coast. Users can view a hike’s details, including its map location and comments registered users have made. To access additional features, users can create an account and log in. Registered users can create, update and delete pet profiles, hike check ins, bookmarks lists and comments. On the dashboard, users can view a map of all the locations they have visited and a chart of how many miles they have walked and number of hikes they have completed.

![Homepage](/static/img/readme/Pup_Journey_Homepage.png "Homepage")

**CONTENTS**

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Future Features](#future-features)
- [Installation](#installation)
- [About the Developer](#about-the-developer)

## Tech Stack

**Backend:** Python3, Flask, Flask-Marshmallow, Jinja, SQLAlchemy\
**Frontend:** React, React Hooks, JavaScript, HTML5, CSS3, Bootstrap\
**Database:** PostgreSQL\
**API:** Google Maps JavaScript, Google Maps Embed API, Cloudinary API

## Features

### SEARCH HIKES

Users can search for hikes by keyword from the search bar, which filters all hikes in the database.
Alternatively, users can add multiple filters from the off canvas form. When the user clicks Submit, the input from the form is passed to the postgres database asynchronously and returns the results that meet the parameters requested.
Users can sort their results by column, ascending or descending
<img src="https://user-images.githubusercontent.com/43583599/159387972-7141c4aa-1bef-4867-b09c-b3d5c0c8e055.gif" width="75%" height="75%"/>

### HIKE DETAILS

Users can view a summary of the hike's details and its map location
<img src="/static/img/readme/Pup_Journey_Hike_Details.png" width="75%" height="75%"/>

### REGISTRATION, LOG IN, USER SETTINGS & LOG OUT

Users can register, log in, change their user settings, and log out
<img src="https://user-images.githubusercontent.com/43583599/159392083-f33b1c47-1e36-4d97-9fd9-b2b03d75cd4c.gif" width="75%" height="75%"/>

### DASHBOARD

Users must register and log in to view the dashboard

#### MAP

Registered users can view a map of locations they have visited and change views by month, year, or all time
<img src="https://user-images.githubusercontent.com/43583599/159396971-e517d4e8-9184-4b51-a0a5-f8fc84134915.gif" width="75%" height="75%"/>

#### GRAPH

Registered users can view a chart of how many miles they have walked and number of hikes they have completed and change views by month, year, or all time
<br/><img src="https://user-images.githubusercontent.com/43583599/159396955-e7dcf5ab-1b99-44fe-856c-9fb4768fc155.gif" width="75%" height="75%"/>

### PET PROFILES

#### CREATE, VIEW, UPDATE, DELETE A PET PROFILE

Registered users can create, view, update and delete pet profiles from the dashboard
<img src="https://user-images.githubusercontent.com/43583599/159401165-9b5fb75a-df84-4464-a9b0-df331671e9ea.gif" width="75%" height="75%"/>

Pet profile components are also accessible from the search hikes and hike details pages
<img src="https://user-images.githubusercontent.com/43583599/159401176-6e33f9b5-9907-4dd9-8b0c-b6ff8586cf69.gif" width="75%" height="75%"/>


### BOOKMARKS LISTS

Registered users can create, view, update and delete bookmarks lists from the dashboard

Bookmarks list components are also accessible from the search hikes and hike details pages

#### CREATE, VIEW, UPDATE, DELETE A BOOKMARKS LIST



### CHECK INS

#### CREATE, VIEW, UPDATE, DELETE A CHECK IN

Registered users can create, view, update and delete check ins from the dashboard

Check in components are also accessible from the search hikes and hike details pages


### COMMENTS

#### CREATE, VIEW, UPDATE, DELETE A COMMENT

Registered users can create, view, update and delete check ins from the dashboard

Comment components are also accessible from the search hikes and hike details pages. Non-registered users can view comments.

## Future Features

- Trip planning
- Different types of locations (campgrounds, restaurants, etc)
- UI/UX improvements

## Installation

#### Requirements:

- PostgreSQL
- Python 3.7.3

To have this app running on your local computer, please follow the below steps:

Clone repository:

```
$ git clone https://github.com/jenniferlei/Hackbright_Pup_Journey_Project.git
```

Create environmental variables to hold your API keys

```
$ export CLOUDINARY_KEY='{YOUR CLOUDINARY API KEY HERE}'
$ export CLOUDINARY_SECRET='{YOUR CLOUDINARY SECRET HERE}'
$ export GOOGLE_KEY='{YOUR MAPS JS API KEY HERE}'
```

Create and activate a virtual environment:

```
$ pip3 install virtualenv
$ virtualenv env
$ source env/bin/activate
```

Install dependencies:

```
(env) $ pip3 install -r requirements.txt
```

Create database tables and seed database:

```
(env) $ python3 seed_database.py
```

Start backend server:

```
(env) $ python3 server.py
```

Navigate to `localhost:5000/` to begin your dog-friendly hike search!

## About the Developer

Jennifer Lei is a software engineer in the Greater Los Angeles Area, and previously worked in multiple fields, such as B2B tech sales, finance and e-commerce. A combined love for dogs, hiking, and learning new things (React!) led to the creation of Pup Journey, her capstone project for Hackbright Academy.
