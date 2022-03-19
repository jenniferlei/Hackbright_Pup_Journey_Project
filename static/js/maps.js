"use strict";

// We use a function declaration for initMap because we actually *do* need
// to rely on value-hoisting in this circumstance.
function initMap() {
  // need to fetch latitude and longitude instead

  const latitude = Number(document.querySelector("#latitude").innerText);
  const longitude = Number(document.querySelector("#longitude").innerText);
  const hike_name = document.querySelector(".hike-name").innerText;

  const hikeCoords = {
    lat: latitude,
    lng: longitude,
  };

  const basicMap = new google.maps.Map(document.querySelector("#map"), {
    center: hikeCoords,
    zoom: 11,
  });

  const hikeMarker = new google.maps.Marker({
    position: hikeCoords,
    title: hike_name,
    map: basicMap,
  });

  hikeMarker.addListener("click", () => {
    alert("Hi!");
  });

  const hikeInfo = new google.maps.InfoWindow({
    content: `<h2>${hike_name}</h2>`,
  });

  hikeInfo.open(basicMap, hikeMarker);

  const locations = [
    {
      name: "Hackbright Academy",
      coords: {
        lat: 37.7887459,
        lng: -122.4115852,
      },
    },
    {
      name: "Powell Street Station",
      coords: {
        lat: 37.7844605,
        lng: -122.4079702,
      },
    },
    {
      name: "Montgomery Station",
      coords: {
        lat: 37.7894094,
        lng: -122.4013037,
      },
    },
  ];

  const markers = [];
  for (const location of locations) {
    markers.push(
      new google.maps.Marker({
        position: location.coords,
        title: location.name,
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
}
