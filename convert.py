#!/usr/bin/python3
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models.user import User
from datetime import datetime

import json

time = "%Y-%m-%dT%H:%M:%S.%f"

engine = create_engine("mysql+mysqldb://{}:{}@localhost/{}".format(
    "hbnb_dev", "hbnb_dev_pwd", "hbnb_dev_db"), pool_pre_ping=True)

Session = sessionmaker(bind=engine)
session = Session()
tables = session.query(User).all()

sub = {}


with open("abc.json", "r") as f:
    try:
        existing_data = json.load(f)
        print(type(existing_data))
    except json.JSONDecodeError:
        existing_data = {}

with open("abc.json", "w") as f:
    for table in tables:
        sub['id'] = table.id
        sub['created_at'] = table.created_at.strftime(time)
        sub['updated_at'] = table.updated_at.strftime(time)
        sub['email'] = table.email
        sub['password'] = table.password
        sub['first_name'] = table.first_name
        sub['last_name'] = table.last_name
        # sub['max_guest'] = table.max_guest
        # sub['user_id'] = table.user_id
        # sub['place_id'] = table.place_id
        # sub['price_by_night'] = table.price_by_night
        # sub['latitude'] = table.latitude
        # sub['longitude'] = table.longitude
        sub['__class__'] = "User"
        existing_data[f'User.{table.id}'] = sub
        sub = {}

    f.seek(0)
    json.dump(existing_data, f)
