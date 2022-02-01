'use strict';

// Need to add server.py function to fetch json data of pet profiles
// then fetch the data and add each pet profile
// make sure to only call the relevant user_id


function PetProfile(props) {
  return (
    <div className="pet-profile" id="pet-{props.pet_id}">
      <h2>{props.pet_name}</h2>
      <br /><img src={props.pet_imgURL} alt="profile" className="pet-profile-img" />
      <br />Gender: {props.gender}
      <br />Birthday: {props.birthday}
      <br />Breed: {props.breed}
    </div>
  );
}

function AddPetProfile(props) {
  const [pet_name, setPetName] = React.useState('');
  const [gender, setGender] = React.useState('');
  const [birthday, setBirthday] = React.useState('');
  const [breed, setBreed] = React.useState('');
  function addNewProfile() {
    fetch('/add-pet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({pet_name, gender, birthday, breed}),
    }).then(response => {
      response.json().then(jsonResponse => {
        const {petAdded} = jsonResponse; // same as petAdded = jsonResponse.petAdded
        const {pet_id, user_id, pet_name, gender, birthday, breed, pet_imgURL, img_public_id} = petAdded;
        props.addProfile(pet_id, pet_name, gender, birthday, breed);
      });
    });
  }
  return (
    <React.Fragment>
      <h2>Add New Pet</h2>
      <label htmlFor="petNameInput">
        Name
        <input
          name="pet_name"
          value={pet_name}
          onChange={event => setPetName(event.target.value)}
          id="petNameInput"
          style={{marginLeft: '5px'}}
        />
      </label>
      <label htmlFor="genderInput" style={{marginLeft: '10px', marginRight: '5px'}}>
        Gender
        <input name="gender" value={gender} onChange={event => setGender(event.target.value)} id="genderInput" />
      </label>
      <label htmlFor="birthdayInput" style={{marginLeft: '10px', marginRight: '5px'}}>
        Birthday
        <input name="birthday" value={birthday} onChange={event => setBirthday(event.target.value)} id="birthdayInput" />
      </label>
      <label htmlFor="breedInput" style={{marginLeft: '10px', marginRight: '5px'}}>
        Breed
        <input name="breed" value={breed} onChange={event => setBreed(event.target.value)} id="breedInput" />
      </label>
      <label htmlFor="imgFileInput" style={{marginLeft: '10px', marginRight: '5px'}}>
        Breed
        <input type="file" name="breed" value={breed} onChange={event => setBreed(event.target.value)} id="breedInput" />
      </label>
      <button type="button" style={{marginLeft: '10px'}} onClick={addNewProfile}>
        Add
      </button>
    </React.Fragment>
  );
}

function PetProfileContainer() {
  const [pets, setPets] = React.useState([]);

  function addProfile(pet_id, pet_name, gender, birthday, breed) {
    const pet_imgURL = 'static/img/placeholder.png';
    const newPet = {pet_id, pet_name, gender, birthday, breed, pet_imgURL}; // equivalent to { cardId: cardId, skill: skill, name: name, imgUrl: imgUrl }
    const currentPets = [...pets]; // makes a copy of pets. similar to doing currentPets = pets[:] in Python
    // [...currentPets, newPet] is an array containing all elements in currentPets followed by newPet
    setPets([...currentPets, newPet]);
  }

  React.useEffect(() => {
    fetch('/pets.json')
      .then(response => response.json())
      .then(data => setPets(data.pets));
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
      <AddPetProfile addProfile={addProfile} />
      <h2>Pet Profiles</h2>
      <div className="grid">{petProfiles}</div>
    </React.Fragment>
  );
}

ReactDOM.render(<PetProfileContainer />, document.getElementById('pet-profile-container'));
