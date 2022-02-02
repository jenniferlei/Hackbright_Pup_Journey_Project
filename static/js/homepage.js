"use strict";

const summaryChart = new Chart(document.querySelector("#summary-chart"), {
  type: "line",
  data: {
    labels: ["does", "this", "work"],
    datasets: [{ data: [2, 4, 8] }],
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

function showMap(evt) {
  evt.preventDefault();

  const graphMapCheckIns = document.querySelector("#graph-map-checkins");
  graphMapCheckIns.innerHTML = `<div>Map Goes Here</div>`;

  // fetch("/fortune")
  //   .then((response) => response.text())
  //   .then((fortune) => {
  //     document.querySelector("#fortune-text").innerHTML = fortune;
  //   });
}

function showCheckIns(evt) {
  evt.preventDefault();

  const graphMapCheckIns = document.querySelector("#graph-map-checkins");
  graphMapCheckIns.innerHTML = null;

  fetch("/pet-check-ins.json")
    .then((response) => response.json())
    .then((data) => {
      console.log(data.checkIns);

      const checkIns = [];

      for (const checkIn of data.checkIns) {
        const checkInHTML =
          `<div class="card card-body">
              <div>
              ${checkIn.pet_name} hiked <a href="/hikes/${checkIn.hike_id}">${checkIn.hike_name}</a> on ${checkIn.date_hiked}!` +
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
              <form action="/edit-check-in" class="edit-form" id="form-edit-check-in" method="POST">
                <button class="btn btn-link btn-sm" type="submit" name="edit" value="${checkIn.check_in_id}">Edit</button>
              </form>
              <form action="/delete-check-in" class="delete-form" id="form-delete-check-in" method="POST">
                <button class="btn btn-link btn-sm" type="submit" name="delete" value="${checkIn.check_in_id}">Delete</button>
              </form>
              </div>
            </div>`;
        graphMapCheckIns.insertAdjacentHTML("beforeend", checkInHTML);
      }
    });
}

document
  .querySelector("#get-graph-button")
  .addEventListener("click", showGraph);

document.querySelector("#get-map-button").addEventListener("click", showMap);

document
  .querySelector("#get-checkins-button")
  .addEventListener("click", showCheckIns);
