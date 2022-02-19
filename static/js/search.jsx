"use strict";

function HikeList(props) {
  const [hikeList, setHikeList] = React.useState([]);

  function getAllHikes() {
    fetch(`/hikes/${hike_id}/bookmarks.json`)
      .then((response) => response.json())
      .then((data) => {
        setBookmarksLists(data.bookmarksLists);
      });
  }

  return (
    <React.Fragment>

    </React.Fragment>
  )
  
}

function SearchBox(props) {
  // Set
  const [searchTerm, setSearchTerm] = React.useState("");

  // Send data back with fetch then use the data go
  function searchHikes() {
    fetch("/hikes/search", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ searchTerm }),
    }).then((response) => {
      response.json().then((jsonResponse) => {
        props.searchResults();
        );
      });
    });
  }

  return (
    <React.Fragment>
      <li className="nav-item">
        <input
          className="form-control me-2 input-sm"
          type="search"
          placeholder="Search"
          aria-label="Search"

                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
        ></input>
      </li>
      <li>
        <a className="nav-link" role="button" type="submit">
          <small>
            <i
              data-bs-toggle="tooltip"
              data-bs-placement="right"
              title="search"
              className="bi bi-search"

                  onClick={searchHikes}
            ></i>
          </small>
        </a>
      </li>
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
