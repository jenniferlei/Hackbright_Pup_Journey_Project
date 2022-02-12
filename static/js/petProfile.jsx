"use strict";

// function CheckIns(props) {
//   const href = `/hikes/${props.hike_id}`;

//   return (
//     <li>
//       {props.pet_name} hiked <a href={href}>{props.hike_name}</a> on{" "}
//       {props.date_hiked}!
//       {props.date_started !== null && (
//         <div className="row">Date started: {props.date_started}</div>
//       )}
//       {props.date_completed !== null && (
//         <div className="row">Date completed: {props.date_completed}</div>
//       )}
//       {props.miles_completed !== null && (
//         <div className="row">Miles completed: {props.miles_completed}</div>
//       )}
//       {props.total_time !== null && (
//         <div className="row">Total time: {props.total_time} hours</div>
//       )}
//       <div className="row">
//         <form
//           action="/edit-check-in"
//           class="edit-form"
//           id="form-edit-check-in"
//           method="POST"
//         >
//           <button
//             class="btn btn-link btn-sm"
//             type="submit"
//             name="edit"
//             value={props.check_in_id}
//           >
//             Edit
//           </button>
//         </form>
//         <form
//           action="/delete-check-in"
//           class="delete-form"
//           id="form-delete-check-in"
//           method="POST"
//         >
//           <button
//             class="btn btn-link btn-sm"
//             type="submit"
//             name="delete"
//             value={props.check_in_id}
//           >
//             Delete
//           </button>
//         </form>
//       </div>
//     </li>
//   );

//   fetch("/pets.json")
//     .then((response) => response.text())
//     .then((data) => {
//       const checkIns = [];

//       for (const currentPet of data.pets) {
//         for (const checkIn of currentPet["check_ins"]) {
//           checkIns.push();
//         }
//       }
//     });
// }

function PetProfile(props) {
  const id_name = `pet-${props.pet_id}`;
  const modal_edit_target = `#modal-edit-${props.pet_id}`;
  const modal_edit_id = `modal-edit-${props.pet_id}`;
  const modal_edit_form_id = `modal-edit-form-${props.pet_id}`;

  return (
    <div className="pet-profile row card card-body mb-3" id={id_name}>
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

      <div className="input-group">
        <button
          className="btn btn-link btn-sm"
          data-bs-toggle="modal"
          data-bs-target={modal_edit_target}
        >
          <small>Edit</small>
        </button>

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
      <EditPetProfile
        pet_id={props.pet_id}
        pet_name={props.pet_name}
        gender={props.gender}
        birthday={props.birthday}
        breed={props.breed}
        modal_edit_id={modal_edit_id}
        modal_edit_form_id={modal_edit_form_id}
      />
    </div>
  );
}

function EditPetProfile(props) {
  const [pet_name, setPetName] = React.useState(props.pet_name);
  const [gender, setGender] = React.useState(props.gender);
  const [birthday, setBirthday] = React.useState(props.birthday);
  const [breed, setBreed] = React.useState(props.breed);
  const [my_file, setMyFile] = React.useState("");

  function EditExistingProfile() {
    fetch("/edit-pet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pet_id,
        pet_name,
        gender,
        birthday,
        breed,
        pet_imgURL,
      }),
    }).then((response) => {
      response.json().then((jsonResponse) => {
        const { petUpdated } = jsonResponse; // same as petUpdated = jsonResponse.petUpdated
        const {
          pet_id: pet_id,
          pet_name: pet_name,
          gender: gender,
          birthday: birthday,
          breed: breed,
          pet_imgURL: pet_imgURL,
        } = petUpdated;
        props.editProfile(
          pet_id,
          pet_name,
          gender,
          birthday,
          breed,
          pet_imgURL
        );
      });
    });
  }

  return (
    <React.Fragment>
      <div
        className="modal fade"
        id={props.modal_edit_id}
        tabindex="-1"
        aria-labelledby="modal-edit-pet-label"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="modal-edit-pet-label">
                Edit Pet Info
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form
                action="/edit-pet"
                id={props.modal_edit_form_id}
                method="POST"
                enctype="multipart/form-data"
              >
                <div className="mb-3">
                  <label htmlFor="pet_name" className="sr-only">
                    Name
                  </label>
                  <input
                    type="text"
                    name="pet_name"
                    value={pet_name}
                    onChange={(event) => setPetName(event.target.value)}
                    className="form-control input-lg"
                    placeholder="Name"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label for="gender" className="sr-only">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={gender}
                    onChange={(event) => setGender(event.target.value)}
                    className="form-control input-lg"
                  >
                    <option value=""></option>
                    <option value="female">female</option>
                    <option value="male">male</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="birthday" className="sr-only">
                    Birthday
                  </label>
                  <input
                    type="date"
                    name="birthday"
                    value={birthday}
                    onChange={(event) => setBirthday(event.target.value)}
                    className="form-control input-lg"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="breed" className="sr-only">
                    Breed
                  </label>
                  <input
                    type="text"
                    name="breed"
                    value={breed}
                    onChange={(event) => setBreed(event.target.value)}
                    className="form-control input-lg"
                    placeholder="Breed"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="my_file" className="sr-only">
                    Image
                  </label>
                  <input
                    type="file"
                    name="my_file"
                    className="form-control input-lg"
                    value={my_file}
                    onChange={(event) => setMyFile(event.target.value)}
                    accept="image/png, image/jpeg"
                  />
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-sm btn-primary btn-block mt-4"
                    type="submit"
                    name="edit"
                    value={props.pet_id}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-secondary btn-block mt-4"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

function AddPetProfile(props) {
  const [pet_name, setPetName] = React.useState("");
  const [gender, setGender] = React.useState("");
  const [birthday, setBirthday] = React.useState("");
  const [breed, setBreed] = React.useState("");
  const [my_file, setMyFile] = React.useState("");

  // Need to figure out why this part is not working.
  // Possibly due to my file upload???
  function addNewProfile() {
    fetch("/add-pet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pet_name, gender, birthday, breed, my_file }),
    }).then((response) => {
      response.json().then((jsonResponse) => {
        const { petAdded } = jsonResponse; // same as petAdded = jsonResponse.petAdded
        const { pet_id, pet_name, gender, birthday, breed, pet_imgURL } =
          petAdded;
        props.addProfile(pet_id, pet_name, gender, birthday, breed, pet_imgURL);
      });
    });
  }

  return (
    <React.Fragment>
      <div
        className="modal fade"
        id="modal-add-pet"
        tabindex="-1"
        aria-labelledby="modal-add-pet-label"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="modal-add-pet-label">
                Add Pet Info
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form
                action="/add-pet"
                method="POST"
                enctype="multipart/form-data"
                // onSubmit={addNewProfile}
              >
                <div className="mb-3">
                  <label htmlFor="pet_name" className="sr-only">
                    Name
                  </label>
                  <input
                    type="text"
                    name="pet_name"
                    value={pet_name}
                    onChange={(event) => setPetName(event.target.value)}
                    className="form-control input-lg"
                    placeholder="Name"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label for="gender" className="sr-only">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={gender}
                    onChange={(event) => setGender(event.target.value)}
                    className="form-control input-lg"
                  >
                    <option value=""></option>
                    <option value="female">female</option>
                    <option value="male">male</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="birthday" className="sr-only">
                    Birthday
                  </label>
                  <input
                    type="date"
                    name="birthday"
                    value={birthday}
                    onChange={(event) => setBirthday(event.target.value)}
                    className="form-control input-lg"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="breed" className="sr-only">
                    Breed
                  </label>
                  <input
                    type="text"
                    name="breed"
                    value={breed}
                    onChange={(event) => setBreed(event.target.value)}
                    className="form-control input-lg"
                    placeholder="Breed"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="my_file" className="sr-only">
                    Image
                  </label>
                  <input
                    type="file"
                    name="my_file"
                    className="form-control input-lg"
                    value={my_file}
                    onChange={(event) => setMyFile(event.target.file)}
                    accept="image/png, image/jpeg"
                  />
                </div>
                <div className="modal-footer">
                  <button
                    type="submit"
                    className="btn btn-sm btn-primary btn-block mt-4"
                    data-bs-dismiss="modal"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-secondary btn-block mt-4"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

function PetProfileContainer() {
  const [pets, setPets] = React.useState([]);

  function addProfile(pet_id, pet_name, gender, birthday, breed, pet_imgURL) {
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
        key={currentPet.pet_id}
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
      <div className="row">
        <div className="col">
          <h2>Pets</h2>
        </div>

        <div className="col">
          <button
            type="button"
            className="btn btn-link btn-sm"
            data-bs-toggle="modal"
            data-bs-target="#modal-add-pet"
          >
            <small>+ Pet</small>
          </button>
        </div>
      </div>
      <AddPetProfile addProfile={addProfile} />
      <div className="grid">{petProfiles}</div>
    </React.Fragment>
  );
}

ReactDOM.render(
  <PetProfileContainer />,
  document.getElementById("pet-profile-container")
);
