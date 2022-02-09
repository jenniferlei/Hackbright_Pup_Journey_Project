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

// select the dropdown and add event listener

// Add random color for each pet

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
          title: { display: true, position: "top", text: "Pup Journey" },
          legend: { display: true, position: "bottom" },
        },

        scales: {
          x: {
            type: "time",
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
            suggestedMin: 0,
            display: true,
            title: {
              display: true,
              text: "Miles",
            },
          },
        },
      },
    });
  });
