# Pup Journey

Do you love going on hikes with your dogs? Pup Journey is a platform where users can search, bookmark and comment on dog-friendly hikes in the west coast. Users can create pet profiles and track their dog's hike activities

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
**API:** Google Maps JavaScript, Cloudinary API

## Features

### REGISTRATION & LOGIN

> <p align="justify"> Users either register as a patient or a provider, where anyone can register as a patient, but a provider is required to register with a National Provider ID (NPI). When the form receives an 'NPI' input by the user, that input is verified using an HTTPS fetch request to NPPES NPI Registry's API, which I've also implemented to auto-fill provider registration text fields based on the data returned. Lastly, providers are prompted to select for their activities by using the text-autocomplete lookup feature, or by scrolling through the database's activity list. </p>

### SEARCH HIKES

> <p align="justify"> Dog-friendly hikes are searchable by several parameters and can be sorted. </p>

### PET PROFILES

> **CREATE A PROFILE**

> **EDIT A PROFILE**

> **DELETE A PROFILE**

### DASHBOARD

> **MAP**

> **GRAPH**

### BOOKMARKS LISTS

> **CREATE A LIST**

> **RENAME A LIST**

> **DELETE A LIST**

### CHECK INS

> **CREATE A CHECK IN**

> **RENAME A CHECK IN**

> **DELETE A CHECK IN**

### COMMENTS

> **CREATE A COMMENT**

> **RENAME A COMMENT**

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

## About the Developer

Jennifer Lei is a software engineer in the Greater Los Angeles Area, and previously worked in multiple fields, such as B2B tech sales, finance and e-commerce. A combined love for dogs, hiking, and learning new things (React!) led to the creation of Pup Journey, her capstone project for Hackbright Academy.
