"use strict";

function SearchSideBar(props) {
  // Set
  const [pet_name, setPetName] = React.useState("");
  const [gender, setGender] = React.useState("");
  const [birthday, setBirthday] = React.useState("");
  const [breed, setBreed] = React.useState("");
  const [my_file, setMyFile] = React.useState("");

  // Send data back with fetch then use the data go
  function createNewSearch() {
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
        props.addSearchResults(
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

function SearchResultsContainer() {
  const [pets, setPets] = React.useState([]);

  function addSearchResults(
    pet_id,
    pet_name,
    gender,
    birthday,
    breed,
    pet_imgURL
  ) {
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
