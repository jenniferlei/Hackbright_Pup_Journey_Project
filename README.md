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

![All Hikes](/static/img/readme/Pup_Journey_All_Hikes.png "All Hikes")

> **FILTER** ![Filter Hikes](/static/img/readme/Pup_Journey_Filter.png "Filter Hikes")

> **SORT** ![Sort Hikes](/static/img/readme/Pup_Journey_Sort.png "Sort Hikes")

### HIKE DETAILS

![Hike Details](/static/img/readme/Pup_Journey_Hike_Details.png "Hike Details")

### REGISTRATION & LOGIN

![Sign Up](/static/img/readme/Pup_Journey_Sign_Up.png "Sign Up")

![Log In](/static/img/readme/Pup_Journey_Log_In.png "Log In")

### DASHBOARD

> **MAP**
> ![Dashboard Map](/static/img/readme/Pup_Journey_Dashboard_Map.png "Dashboard Map")

> **GRAPH**
> ![Dashboard Graph](/static/img/readme/Pup_Journey_Dashboard_Graph.png "Dashboard Graph")

### PET PROFILES

> **CREATE A PROFILE**

> **EDIT A PROFILE**

> **DELETE A PROFILE**

### BOOKMARKS LISTS

> **CREATE A LIST**

> **ADD HIKES TO A LIST**

> **RENAME A LIST**

> **DELETE A LIST**

### CHECK INS

> **CREATE A CHECK IN**

> **EDIT A CHECK IN**

> **DELETE A CHECK IN**

### COMMENTS

> **CREATE A COMMENT**

> **EDIT A COMMENT**

> **DELETE A COMMENT**

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
