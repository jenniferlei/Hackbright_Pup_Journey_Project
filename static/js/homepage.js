"use strict";

const summaryChart = new Chart(document.querySelector("#summary-chart"), {
  type: "line",
  data: {
    labels: ["January", "February", "March"],
    datasets: [
      {
        label: "Kilo",
        data: [10, 36, 27],
      },
      {
        label: "Pico",
        data: [5, 11, 7],
      },
    ],
  },
});

function showGraph(evt) {
  evt.preventDefault();

  const graphMapCheckIns = document.querySelector("#graph-map-checkins");
  graphMapCheckIns.innerHTML = `<canvas id="summary-chart"></canvas>`;

  const summaryChart = new Chart(document.querySelector("#summary-chart"), {
    type: "line",
    data: {
      labels: ["does", "this", "work"],
      datasets: [{ data: [2, 4, 8] }],
    },
  });
}

function showCheckIns(evt) {
  evt.preventDefault();

  const graphMapCheckIns = document.querySelector("#nav-checkins");
  graphMapCheckIns.innerHTML = null;

  fetch("/check-ins-by-user.json")
    .then((response) => response.json())
    .then((data) => {
      console.log(data.checkIns);

      const checkIns = [];

      for (const checkIn of data.checkIns) {
        const checkInHTML =
          `<div class="card card-body">
              <div>
                  ${checkIn.pet.pet_name} hiked <a href="/hikes/${checkIn.hike_id}">${checkIn.hike.hike_name}</a> on ${checkIn.date_hiked}!` +
          ((checkIn.date_started !== null &&
            `<div class="row">Date started: ${checkIn.date_started}</div>`) ||
            "") +
          ((checkIn.date_completed !== null &&
            `<div class="row">Date completed: ${checkIn.date_completed}</div>`) ||
            "") +
          ((checkIn.miles_completed !== null &&
            `<div class="row">Miles completed: ${checkIn.miles_completed}</div>`) ||
            "") +
          ((checkIn.total_time !== null &&
            `<div class="row">Total time: ${checkIn.total_time} hours</div>`) ||
            "") +
          `<br>
                <div class="input-group">
                  <a class="btn btn-link btn-sm" href="" data-bs-toggle="modal" data-bs-target="#modal-edit-check-in-${checkIn.check_in_id}"><small>Edit</small></a>
                  
                  <form action="/delete-check-in" class="delete-form" id="form-delete-check-in" method="POST">
                    <button class="btn btn-link btn-sm" type="submit" name="delete" value="${checkIn.check_in_id}">Delete</button>
                  </form>
                </div>

                <div class="modal fade" id="modal-edit-check-in-${checkIn.check_in_id}" tabindex="-1" aria-labelledby="modal-edit-check-in-${checkIn.check_in_id}-label" aria-hidden="true">
                  <div class="modal-dialog">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title" id="modal-edit-check-in-${checkIn.check_in_id}-label">Edit ${checkIn.pet.pet_name}'s check in to this hike</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div class="modal-body">

                        <form
                          action="/edit-check-in"
                          method="POST"
                        >
                          
                          <div class="mb-3">
                            <label for="date_hiked" class="sr-only">Date Hiked</label>
                            <input
                              type="date"
                              name="date_hiked"
                              value="${checkIn.date_hiked}"
                              class="form-control input-lg"
                            />
                          </div>

                          <div class="mb-3">
                            <label for="date_started" class="sr-only">Date Started</label>
                            <input
                              type="date"
                              name="date_started"
                              value="${checkIn.date_started}"
                              class="form-control input-lg"
                            />
                          </div>

                          <div class="mb-3">
                            <label for="date_completed" class="sr-only">Date Completed</label>
                            <input
                              type="date"
                              name="date_completed"
                              value="${checkIn.date_completed}"
                              class="form-control input-lg"
                            />
                          </div>

                          <div class="mb-3">
                            <label for="miles_completed" class="sr-only"
                              >Miles Completed</label
                            >
                            <input
                              type="number"
                              step=".1"
                              min="0"
                              name="miles_completed"
                              value="${checkIn.miles_completed}"
                              class="form-control input-lg"
                            />
                          </div>

                          <div class="mb-3">
                            <label for="total_time" class="sr-only">Total Time (Hours)</label>
                            <input
                              type="number"
                              step=".1"
                              min="0"
                              name="total_time"
                              value="${checkIn.total_time}"
                              class="form-control input-lg"
                            />
                          </div>
                        <div class="modal-footer">
                          <button class="btn btn-sm btn-primary btn-block" type="submit" name="check_in_id" value="${checkIn.check_in_id}">Submit</button>
                          <button type="button" class="btn btn-sm btn-secondary btn-block" data-bs-dismiss="modal">Close</button>
                        </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>


              </div>
            </div>`;
        graphMapCheckIns.insertAdjacentHTML("beforeend", checkInHTML);
      }
    });
}

document
  .querySelector("#nav-checkins-tab")
  .addEventListener("click", showCheckIns);

// function showMap(evt) {
//   evt.preventDefault();

//   const graphMapCheckIns = document.querySelector("#graph-map-checkins");
//   graphMapCheckIns.innerHTML = `<div>Map Goes Here</div>`;

//   // fetch("/fortune")
//   //   .then((response) => response.text())
//   //   .then((fortune) => {
//   //     document.querySelector("#fortune-text").innerHTML = fortune;
//   //   });
// }

// function showCheckIns(evt) {
//   evt.preventDefault();

//   const graphMapCheckIns = document.querySelector("#graph-map-checkins");
//   graphMapCheckIns.innerHTML = null;

//   fetch("/pet-check-ins.json")
//     .then((response) => response.json())
//     .then((data) => {
//       console.log(data.checkIns);

//       const checkIns = [];

//       for (const checkIn of data.checkIns) {
//         const checkInHTML =
//           `<div class="card card-body">
//               <div>
//               ${checkIn.pet_name} hiked <a href="/hikes/${checkIn.hike_id}">${checkIn.hike_name}</a> on ${checkIn.date_hiked}!` +
//           ((checkIn.date_started !== null &&
//             `<div class="row">Date started: ${checkIn.date_started}</div>`) ||
//             "") +
//           ((checkIn.date_completed !== null &&
//             `<div class="row">Date completed: ${checkIn.date_completed}</div>`) ||
//             "") +
//           ((checkIn.miles_completed !== null &&
//             `<div class="row">Miles completed: ${checkIn.miles_completed}</div>`) ||
//             "") +
//           ((checkIn.total_time !== null &&
//             `<div class="row">Total time: ${checkIn.total_time} hours</div>`) ||
//             "") +
//           `<br>
//               <form action="/edit-check-in" class="edit-form" id="form-edit-check-in" method="POST">
//                 <button class="btn btn-link btn-sm" type="submit" name="edit" value="${checkIn.check_in_id}">Edit</button>
//               </form>
//               <form action="/delete-check-in" class="delete-form" id="form-delete-check-in" method="POST">
//                 <button class="btn btn-link btn-sm" type="submit" name="delete" value="${checkIn.check_in_id}">Delete</button>
//               </form>
//               </div>
//             </div>`;
//         graphMapCheckIns.insertAdjacentHTML("beforeend", checkInHTML);
//       }
//     });
// }

document
  .querySelector("#get-graph-button")
  .addEventListener("click", showGraph);

document.querySelector("#get-map-button").addEventListener("click", showMap);

// document
//   .querySelector("#get-checkins-button")
//   .addEventListener("click", showCheckIns);
