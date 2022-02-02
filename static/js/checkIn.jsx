"use strict";

// Need to add server.py function to fetch json data of pet profiles
// then fetch the data and add each pet profile
// make sure to only call the relevant user_id

function CheckIn(props) {
  return (
    <div className="pet-profile row card card-body" id="pet-{props.pet_id}">
      <h4>{props.pet_name}</h4>
      <div className="col">
        <div>
          <img
            src={props.pet_imgURL}
            alt="profile"
            className="pet-profile-img"
          />
        </div>
      </div>
      <div className="col">
        <div className="row">
          {props.gender !== null && `Gender: ${props.gender}`}
        </div>
        <div className="row">
          {props.birthday !== null && `Birthday: ${props.birthday}`}
        </div>
        <div className="row">
          {props.breed !== null && `Breed: ${props.breed}`}
        </div>
      </div>
    </div>
  );
}
