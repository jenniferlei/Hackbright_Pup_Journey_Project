"use strict";

// check if graph can be filtered by length of time (month/year)
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

      all_data.push({
        label: label,
        data: data,
        fill: false,
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
        title: { display: true, position: "top", text: "Pup Journey" },
        legend: { display: true, position: "bottom" },
        scales: {
          x: {
            type: "time",
            time: {
              tooltipFormat: "LLLL dd", // Luxon format string
              unit: "day",
            },
            display: true,
            scaleLabel: {
              display: true,
              labelString: "Date",
            },
          },
          y: {
            display: true,
            scaleLabel: {
              display: true,
              labelString: "Miles",
            },
          },
        },
      },
    });
  });
