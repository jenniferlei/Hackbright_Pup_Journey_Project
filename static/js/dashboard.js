"use strict";

// TOOLTIP //
var tooltipTriggerList = [].slice.call(
  document.querySelectorAll('[data-bs-toggle="tooltip"]')
);
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl);
});

//////////// MAKE SURE AT LEAST ONE CHECKBOX IS CHECKED WHEN ADDING A PET ////////////
function validateCheckIn() {
  const petCheckBoxes = document.querySelectorAll(
    "input[name=add-check-in-pet_id]"
  );
  const atLeastOneChecked = false;
  for (let i = 0; i < petCheckBoxes.length; i++) {
    if (petCheckBoxes[i].checked) {
      atLeastOneChecked = true;
      break;
    }
  }
  if (atLeastOneChecked === false) {
    alert("Please add a pet to the check in");
    return false;
  }

  return true;
}

//////////// SHOW DIFF FORM FOR CHART BASED ON SELECTION ////////////
$("div.chart-form").hide();

$(document).ready(function () {
  $('input[name="chart-view"]').click(function () {
    var formvalue = $(this).val();
    $("div.chart-form").hide();
    $("#show-" + formvalue).show();
  });
});

//////////// KEEP LAST ACTIVE TAB ACTIVE ////////////
// In jQuery, if you want an event to work on your page, you should call it inside the $(document).ready() function.
// Everything inside it will load as soon as the DOM is loaded and before the page contents are loaded.
// A $ with a selector specifies that it is a jQuery selector. It is given a shorter identifier as $ just to reduce the time for writing larger syntax.
$(document).ready(function () {
  $('a[data-bs-toggle="tab"]').on("show.bs.tab", function (evt) {
    localStorage.setItem("activeTab", $(evt.target).attr("href"));
  });
  const activeTab = localStorage.getItem("activeTab");
  if (activeTab) {
    $('#v-pills-tab a[href="' + activeTab + '"]').tab("show");
  }
});

//////////// MAP ////////////
// We use a function declaration for initMap because we actually *do* need
// to rely on value-hoisting in this circumstance.
function initMap() {
  // need to fetch latitude and longitude instead
  fetch("/dashboard_map_coordinates.json")
    .then((response) => response.json())
    .then((jsonResponse) => {
      const basicMap = new google.maps.Map(
        document.querySelector("#dashboard-map"),
        {
          center: {
            lat: 34.0201598,
            lng: -118.6926047,
          },
          zoom: 8,
        }
      );

      const { checkInCoordinates } = jsonResponse;
      const markers = [];

      for (const checkInCoordinate of checkInCoordinates) {
        const { hike_name, latitude, longitude } = checkInCoordinate;
        markers.push(
          new google.maps.Marker({
            position: {
              lat: Number(latitude),
              lng: Number(longitude),
            },
            title: hike_name,
            map: basicMap,
            icon: {
              // custom icon
              url: "/static/img/marker.svg",
              scaledSize: {
                width: 30,
                height: 30,
              },
            },
          })
        );
      }

      for (const marker of markers) {
        const markerInfo = `
          <h1>${marker.title}</h1>
          <p>
            Located at: <code>${marker.position.lat()}</code>,
            <code>${marker.position.lng()}</code>
          </p>
        `;

        const infoWindow = new google.maps.InfoWindow({
          content: markerInfo,
          maxWidth: 200,
        });

        marker.addListener("click", () => {
          infoWindow.open(basicMap, marker);
        });
      }
    });
}

//////////// CHART ////////////
// modify chart min and max when dropdown is changed

// Toggle between year and month -> year > dropdown of year there is data for, month > dropdown of month and dropdown of year there is data for
// Default current month/year
// select the dropdown and add event listener, onChange

// fetch data and filter based on dropdown selection
// set min and max x axis based on selection

fetch("/check-ins-by-pets.json")
  .then((response) => response.json())
  .then((responseJson) => {
    const { petCheckIns } = responseJson;

    const all_data = [];

    // map is like a for loop. Applies a function to every item in the iterable
    // array.map(function)
    // function (dailyTotal) {
    //   return {x: dailyTotal.date, y: dailyTotal.melons_sold}
    // }
    for (const petCheckIn of petCheckIns) {
      const label = petCheckIn.pet_name;
      const data = petCheckIn.data.map((checkIn) => ({
        x: checkIn.date_hiked,
        y: checkIn.miles_completed,
      }));

      const lineColor = randomColor();

      all_data.push({
        label: label,
        data: data,
        fill: false,
        lineTension: 0.4,
        radius: 6,
        borderColor: lineColor,
        backgroundColor: lineColor,
      });
    }

    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();

    const myLineChart = new Chart(document.querySelector("#check-in-graph"), {
      type: "line",
      data: {
        datasets: all_data,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true, position: "bottom" },
        },

        scales: {
          x: {
            type: "time",
            min: new Date(year, month, 1, 0, 0),
            max: new Date(year, month + 1, 1, 0, 0) - 1,
            time: {
              tooltipFormat: "LLLL dd", // Luxon format string
              unit: "day",
            },
            display: true,
            title: {
              display: true,
              text: "Date",
            },
          },

          y: {
            min: 0,
            suggestedMax: 20,
            display: true,
            ticks: {
              stepSize: 1,
            },
            title: {
              display: true,
              text: "Miles",
            },
          },
        },
      },
    });

    function UpdateChartView(evt) {
      evt.preventDefault();

      const view = document.querySelector(
        "input[name=chart-view]:checked"
      ).value;

      if (view === "month-view") {
        const month =
          document.querySelector("select[name=month-view-month]").value - 1;
        const year = document.querySelector(
          "select[name=month-view-year]"
        ).value;
        myLineChart.options.scales.x.min = new Date(year, month, 1, 0, 0);
        myLineChart.options.scales.x.max =
          new Date(year, month + 1, 1, 0, 0) - 1;
        myLineChart.update();
      } else {
        const year = document.querySelector(
          "select[name=year-view-year]"
        ).value;
        myLineChart.options.scales.x.min = new Date(year, 0);
        myLineChart.options.scales.x.max = new Date(year, 11, 31);
        myLineChart.update();
      }
    }

    const viewUpdateButtons = document.querySelectorAll(".chart-view-submit");

    for (const viewUpdateButton of viewUpdateButtons) {
      viewUpdateButton.addEventListener("click", UpdateChartView);
    }
  });
