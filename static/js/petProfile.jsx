"use strict";

function CheckIns(props) {
  const href = `/hikes/${props.hike_id}`;

  return (
    <li>
      {props.pet_name} hiked <a href={href}>{props.hike_name}</a> on{" "}
      {props.date_hiked}!
      {props.date_started !== null && (
        <div className="row">Date started: {props.date_started}</div>
      )}
      {props.date_completed !== null && (
        <div className="row">Date completed: {props.date_completed}</div>
      )}
      {props.miles_completed !== null && (
        <div className="row">Miles completed: {props.miles_completed}</div>
      )}
      {props.total_time !== null && (
        <div className="row">Total time: {props.total_time} hours</div>
      )}
      <div className="row">
        <form
          action="/edit-check-in"
          class="edit-form"
          id="form-edit-check-in"
          method="POST"
        >
          <button
            class="btn btn-link btn-sm"
            type="submit"
            name="edit"
            value={props.check_in_id}
          >
            Edit
          </button>
        </form>
        <form
          action="/delete-check-in"
          class="delete-form"
          id="form-delete-check-in"
          method="POST"
        >
          <button
            class="btn btn-link btn-sm"
            type="submit"
            name="delete"
            value={props.check_in_id}
          >
            Delete
          </button>
        </form>
      </div>
    </li>
  );

  fetch("/pets.json")
    .then((response) => response.text())
    .then((data) => {
      const checkIns = [];

      for (const currentPet of data.pets) {
        for (const checkIn of currentPet["check_ins"]) {
          checkIns.push();
        }
      }
    });
}

function PetProfile(props) {
  const id_name = `pet-${props.pet_id}`;
  const collapse_href = `#collapse-view-check-ins-${props.pet_id}`;
  const collapse_id = `collapse-view-check-ins-${props.pet_id}`;

  return (
    <div
      className="pet-profile row card card-body mb-3"
      key={id_name}
      id={id_name}
    >
      <h4>{props.pet_name}</h4>

      {props.pet_imgURL !== null && (
        <div>
          <img
            src={props.pet_imgURL}
            alt="profile"
            className="pet-profile-img"
          />
        </div>
      )}

      {props.gender !== null && (
        <div className="row">Gender: {props.gender}</div>
      )}

      {props.birthday !== null && (
        <div className="row">Birthday: {props.birthday}</div>
      )}

      {props.breed !== null && <div className="row">Breed: {props.breed}</div>}

      <div className="row">
        <div className="col">
          <form
            action="/edit-pet"
            className="edit-form"
            id="form-edit-pet"
            method="POST"
          >
            <button
              className="btn btn-link btn-sm"
              type="submit"
              name="edit"
              value={props.pet_id}
            >
              <small>Edit</small>
            </button>
          </form>
        </div>
        <div className="col">
          <form
            action="/delete-pet"
            className="delete-form"
            id="form-delete-pet"
            method="POST"
          >
            <button
              className="btn btn-link btn-sm"
              type="submit"
              name="delete"
              value={props.pet_id}
            >
              <small>Delete</small>
            </button>
          </form>
        </div>
      </div>
      <div className="collapse card card-body" id={collapse_id}>
        stuff
      </div>
    </div>
  );
}

// function AddPetProfile(props) {
//   const [pet_name, setPetName] = React.useState('');
//   const [gender, setGender] = React.useState('');
//   const [birthday, setBirthday] = React.useState('');
//   const [breed, setBreed] = React.useState('');
//
//   function addNewProfile() {
//     fetch('/add-pet', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({pet_name, gender, birthday, breed}),
//     }).then(response => {
//       response.json().then(jsonResponse => {
//         const {petAdded} = jsonResponse; // same as petAdded = jsonResponse.petAdded
//         const {pet_id, user_id, pet_name, gender, birthday, breed, pet_imgURL, img_public_id} = petAdded;
//         props.addProfile(pet_id, pet_name, gender, birthday, breed);
//       });
//     });
//   }
//
//   return (
//     <React.Fragment>
//       <h2>Add New Pet</h2>
//       <label htmlFor="petNameInput">
//         Name
//         <input
//           name="pet_name"
//           value={pet_name}
//           onChange={event => setPetName(event.target.value)}
//           id="petNameInput"
//           style={{marginLeft: '5px'}}
//         />
//       </label>
//       <label htmlFor="genderInput" style={{marginLeft: '10px', marginRight: '5px'}}>
//         Gender
//         <input name="gender" value={gender} onChange={event => setGender(event.target.value)} id="genderInput" />
//       </label>
//       <label htmlFor="birthdayInput" style={{marginLeft: '10px', marginRight: '5px'}}>
//         Birthday
//         <input name="birthday" value={birthday} onChange={event => setBirthday(event.target.value)} id="birthdayInput" />
//       </label>
//       <label htmlFor="breedInput" style={{marginLeft: '10px', marginRight: '5px'}}>
//         Breed
//         <input name="breed" value={breed} onChange={event => setBreed(event.target.value)} id="breedInput" />
//       </label>
//       <label htmlFor="imgFileInput" style={{marginLeft: '10px', marginRight: '5px'}}>
//         Breed
//         <input type="file" name="breed" value={breed} onChange={event => setBreed(event.target.value)} id="breedInput" />
//       </label>
//       <button type="button" style={{marginLeft: '10px'}} onClick={addNewProfile}>
//         Add
//       </button>
//     </React.Fragment>
//   );
// }

function PetProfileContainer() {
  const [pets, setPets] = React.useState([]);

  function addProfile(pet_id, pet_name, gender, birthday, breed) {
    const pet_imgURL = "static/img/placeholder.png";
    const newPet = { pet_id, pet_name, gender, birthday, breed, pet_imgURL }; // equivalent to { cardId: cardId, skill: skill, name: name, imgUrl: imgUrl }
    const currentPets = [...pets]; // makes a copy of pets. similar to doing currentPets = pets[:] in Python
    // [...currentPets, newPet] is an array containing all elements in currentPets followed by newPet
    setPets([...currentPets, newPet]);
  }

  React.useEffect(() => {
    fetch("/pets.json")
      .then((response) => response.json())
      .then((data) => setPets(data.pets));
  }, []);

  const petProfiles = [];

  for (const currentPet of pets) {
    petProfiles.push(
      <PetProfile
        pet_id={currentPet.pet_id}
        pet_name={currentPet.pet_name}
        gender={currentPet.gender}
        birthday={currentPet.birthday}
        breed={currentPet.breed}
        pet_imgURL={currentPet.pet_imgURL}
      />
    );
  }

  return (
    <React.Fragment>
      {/* <AddPetProfile addProfile={addProfile} /> */}
      {/* <h2>Pet Profiles</h2> */}
      <div className="grid">{petProfiles}</div>
    </React.Fragment>
  );
}

ReactDOM.render(
  <PetProfileContainer />,
  document.getElementById("pet-profile-container")
);
