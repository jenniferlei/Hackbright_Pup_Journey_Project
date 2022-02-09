"use strict";

//////////// KEEP LAST ACTIVE TAB ACTIVE ////////////
// In jQuery, if you want an event to work on your page, you should call it inside the $(document).ready() function.
// Everything inside it will load as soon as the DOM is loaded and before the page contents are loaded.
// A $ with a selector specifies that it is a jQuery selector. It is given a shorter identifier as $ just to reduce the time for writing larger syntax.
$(document).ready(function () {
  $('a[data-bs-toggle="tab"]').on("show.bs.tab", function (evt) {
    localStorage.setItem("activeTab", $(evt.target).attr("href"));
  });
  var activeTab = localStorage.getItem("activeTab");
  if (activeTab) {
    $('#v-pills-tab a[href="' + activeTab + '"]').tab("show");
  }
});

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

    console.log(all_data);

    // map is like a for loop. Applies a function to every item in the iterable
    // array.map(function)
    // function (dailyTotal) {
    //   return {x: dailyTotal.date, y: dailyTotal.melons_sold}
    // }

    new Chart(document.querySelector("#check-in-graph"), {
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
            min: new Date(2022, 1, 1, 0, 0),
            max: new Date(2022, 1, 28, 0, 0),
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
            suggestedMax: 30,
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
  });
