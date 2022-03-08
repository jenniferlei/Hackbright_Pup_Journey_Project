"use strict";

// // comment body component with if session condition for edit and delete component
// function CheckIn(props) {
//   // Check if user wants to delete or not
//   function deleteConfirm(event) {
//     const validate = confirm("Do you want to delete this check in?");
//     if (!validate) {
//       event.preventDefault();
//     } else {
//       deleteExistingCheckIn(props.check_in_id);
//     }
//   }

//   // Process deletion
//   function deleteExistingCheckIn(check_in_id) {
//     fetch(`/delete-check-in/${check_in_id}`, {
//       method: "DELETE",
//     }).then((response) => {
//       response.json().then((jsonResponse) => {
//         // console.log(jsonResponse);
//         props.getCheckIns();
//       });
//     });
//   }

//   return (
//     <React.Fragment>
//       <div className="card card-body ms-4 mb-1">
//         <div className="clearfix">
//           <div className="float-start">
//             <small>
//               {props.pets_on_hike.map((pet) => (
//                 <span
//                   key={`pet-id-${pet.pet_id}-check-in-id-${props.check_in_id}`}
//                 >
//                   <i className="bi bi-check"></i>&nbsp;
//                   {pet.pet_name}&nbsp;
//                 </span>
//               ))}
//             </small>
//           </div>

//           <div className="d-flex float-end">
//             <a
//               href=""
//               data-bs-toggle="modal"
//               data-bs-target={`#modal-edit-check-in-${props.check_in_id}`}
//               style={{ color: "rgb(44, 44, 44)" }}
//             >
//               <small>
//                 <i
//                   data-bs-toggle="tooltip"
//                   data-bs-placement="right"
//                   title="edit check in"
//                   className="bi bi-pencil"
//                 ></i>
//               </small>
//             </a>
//             &nbsp;&nbsp;&nbsp;
//             <button
//               className="btn btn-sm"
//               style={{ padding: 0 }}
//               type="submit"
//               onClick={deleteConfirm}
//             >
//               <small>
//                 <i
//                   data-bs-toggle="tooltip"
//                   data-bs-placement="right"
//                   title="delete check in"
//                   className="bi bi-x"
//                 ></i>
//               </small>
//             </button>
//           </div>
//         </div>
//         <div>
//           <small>
//             <a className="link-dark" href={`/hikes/${props.hike_id}`}>
//               {props.hike_name}
//             </a>
//             <br></br>
//             {`Hiked on ${props.date_hiked} | ${props.miles_completed} miles`}
//             {props.total_time !== null ? (
//               <React.Fragment>&nbsp;| {props.total_time} hours</React.Fragment>
//             ) : null}
//             <br></br>
//             {props.notes !== null && props.notes !== "" ? (
//               <React.Fragment>Notes: {props.notes}</React.Fragment>
//             ) : null}
//           </small>
//         </div>
//       </div>
//     </React.Fragment>
//   );
// }

// function EditCheckIn(props) {
//   // Process edit

//   const [addPet, setAddPet] = React.useState([]);
//   const [removePet, setRemovePet] = React.useState([]);
//   const [dateHiked, setDateHiked] = React.useState("");
//   const [milesCompleted, setMilesCompleted] = React.useState("");
//   const [totalTime, setTotalTime] = React.useState("");
//   const [notes, setNotes] = React.useState("");

//   // get the pets that are on the check in and not on the check in to set initial state of addPet and removePet
//   function setPetStates() {
//     fetch(`/check_in/${props.check_in_id}.json`).then((response) =>
//       response.json().then((jsonResponse) => {
//         const { checkIn } = jsonResponse;
//         const pets_on_hike = checkIn.pets;
//         const pets_not_on_hike = checkIn.pets_not_on_hike;

//         const addPet = [];
//         const removePet = [];

//         pets_on_hike.map((pet) => {
//           removePet.push({
//             select: false,
//             pet_name: pet.pet_name,
//             pet_id: pet.pet_id,
//           });
//         });

//         pets_not_on_hike.map((pet) => {
//           addPet.push({
//             select: false,
//             pet_name: pet.pet_name,
//             pet_id: pet.pet_id,
//           });
//         });

//         setAddPet(addPet);
//         setRemovePet(removePet);
//       })
//     );
//   }

//   React.useEffect(() => {
//     setPetStates();
//   }, []);

//   // console.log(addPet);
//   // console.log(removePet);

//   function editExistingCheckIn() {
//     fetch(`/edit-check-in/${props.check_in_id}`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Accept: "application/json",
//       },
//       body: JSON.stringify({
//         addPet, // this will return a list of dictionary objects
//         removePet, // this will return a list of dictionary objects
//         dateHiked,
//         milesCompleted,
//         totalTime,
//         notes,
//       }),
//     })
//       .then((response) => {
//         response.json();
//       })
//       .then((jsonResponse) => {
//         // console.log(jsonResponse);
//         props.getCheckIns();
//         setPetStates();
//       });
//   }
//   return (
//     <React.Fragment>
//       <div
//         className="modal fade"
//         id={`modal-edit-check-in-${props.check_in_id}`}
//         tabIndex="-1"
//         aria-labelledby={`modal-edit-check-in-${props.check_in_id}-label`}
//         aria-hidden="true"
//       >
//         <div className="modal-dialog">
//           <div className="modal-content">
//             <div className="modal-header">
//               <h5
//                 className="modal-title"
//                 id={`modal-edit-check-in-${props.check_in_id}-label`}
//               >
//                 Edit check in to this hike
//               </h5>
//               <button
//                 type="button"
//                 className="btn-close"
//                 data-bs-dismiss="modal"
//                 aria-label="Close"
//               ></button>
//             </div>
//             <div className="modal-body">
//               <div className="mb-3">
//                 <div className="row">
//                   <div className="col">
//                     <label htmlFor="petIdInput">Add a Pet</label>
//                     {addPet.map((pet) => (
//                       <div
//                         className="form-check"
//                         key={`add-${props.check_in_id}-${pet.pet_id}`}
//                       >
//                         <input
//                           className="form-check-input"
//                           type="checkbox"
//                           value={pet.pet_id}
//                           id={`add-to-check-in-${props.check_in_id}-${pet.pet_id}`}
//                           checked={pet.select}
//                           onChange={(event) => {
//                             let checked = event.target.checked;
//                             setAddPet(
//                               addPet.map((data) => {
//                                 if (pet.pet_id === data.pet_id) {
//                                   data.select = checked;
//                                 }
//                                 return data;
//                               })
//                             );
//                           }}
//                         />
//                         <label
//                           className="form-check-label"
//                           htmlFor={`add-to-check-in-${pet.pet_id}`}
//                         >
//                           {pet.pet_name}
//                         </label>
//                       </div>
//                     ))}
//                   </div>

//                   <div className="col">
//                     <label htmlFor="pet_id">Remove a Pet</label>
//                     {removePet.map((pet) => (
//                       <div
//                         className="form-check"
//                         key={`remove-${props.check_in_id}-${pet.pet_id}`}
//                       >
//                         <input
//                           className="form-check-input"
//                           type="checkbox"
//                           value={pet.pet_id}
//                           id={`remove-from-check-in-${pet.pet_id}`}
//                           checked={pet.select}
//                           onChange={(event) => {
//                             let checked = event.target.checked;
//                             setRemovePet(
//                               removePet.map((data) => {
//                                 if (pet.pet_id === data.pet_id) {
//                                   data.select = checked;
//                                 }
//                                 return data;
//                               })
//                             );
//                           }}
//                         />
//                         <label
//                           className="form-check-label"
//                           htmlFor={`remove-from-check-in-${pet.pet_id}`}
//                         >
//                           {pet.pet_name}
//                         </label>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               <div className="mb-3">
//                 <label htmlFor="dateHikedInput">Date Hiked</label>
//                 &nbsp;<small className="text-muted">*</small>
//                 <input
//                   type="date"
//                   value={dateHiked}
//                   onChange={(event) => setDateHiked(event.target.value)}
//                   className="form-control input-lg"
//                 />
//               </div>

//               <div className="mb-3">
//                 <label htmlFor="milesCompletedInput">Miles Completed</label>
//                 &nbsp;<small className="text-muted">*</small>
//                 <input
//                   type="number"
//                   step=".1"
//                   min="0"
//                   value={milesCompleted}
//                   onChange={(event) => setMilesCompleted(event.target.value)}
//                   className="form-control input-lg"
//                 />
//               </div>

//               <div className="mb-3">
//                 <label htmlFor="totalTimeInput">Total Time (Hours)</label>
//                 <input
//                   type="number"
//                   step=".1"
//                   min="0"
//                   value={totalTime}
//                   onChange={(event) => setTotalTime(event.target.value)}
//                   className="form-control input-lg"
//                 />
//               </div>

//               <div className="mb-3">
//                 <label htmlFor="notesInput">Notes</label>
//                 <input
//                   type="text"
//                   value={notes}
//                   onChange={(event) => setNotes(event.target.value)}
//                   className="form-control"
//                 />
//               </div>
//               <div className="modal-footer">
//                 <button
//                   className="btn btn-sm btn-outline-dark btn-block"
//                   type="submit"
//                   data-bs-dismiss="modal"
//                   onClick={editExistingCheckIn}
//                 >
//                   Submit
//                 </button>
//                 <button
//                   type="button"
//                   className="btn btn-sm btn-secondary btn-block"
//                   data-bs-dismiss="modal"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </React.Fragment>
//   );
// }
