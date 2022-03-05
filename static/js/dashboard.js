"use strict";

//////////// SHOW DIFF FORM FOR CHART BASED ON SELECTION ////////////
// document.querySelector("div.chart-form").hide();

// document.querySelector(document).ready(function () {
//   document.querySelector('input[name="chart-view"]').click(function () {
//     var formvalue = $(this).val();
//     document.querySelector("div.chart-form").hide();
//     document.querySelector("#show-" + formvalue).show();
//   });
// });

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
          // center: {
          //   lat: 34.0201598,
          //   lng: -118.6926047,
          // },
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

      const bounds = new google.maps.LatLngBounds();

      for (const marker of markers) {
        bounds.extend(marker.position);
        const markerInfo = `
          <h6>${marker.title}</h6>
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

      basicMap.fitBounds(bounds);
      basicMap.setZoom(11);
    });
}

//////////// CHART ////////////
// modify chart min and max when dropdown is changed

// Toggle between year and month -> year > dropdown of year there is data for, month > dropdown of month and dropdown of year there is data for
// Default current month/year
// select the dropdown and add event listener, onChange

// fetch data and filter based on dropdown selection
// set min and max x axis based on selection
function getDashboardGraph() {
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

        if (view === "chart-month-view") {
          const month =
            document.querySelector("select[name=chart-month-view-month]")
              .value - 1;
          const year = document.querySelector(
            "select[name=chart-month-view-year]"
          ).value;
          myLineChart.options.scales.x.min = new Date(year, month, 1, 0, 0);
          myLineChart.options.scales.x.max =
            new Date(year, month + 1, 1, 0, 0) - 1;
          myLineChart.update();
        } else {
          const year = document.querySelector(
            "select[name=chart-year-view-year]"
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
}
