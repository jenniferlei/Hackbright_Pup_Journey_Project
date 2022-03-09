const DashboardMap = React.forwardRef((props, ref) => {
  const [allCheckIns, setAllCheckIns] = React.useState([]);
  const [myMap, setMyMap] = React.useState(null);
  const [mapHikes, setMapHikes] = React.useState([]);
  const [mapMarkers, setMapMarkers] = React.useState([]);
  const [mapBounds, setMapBounds] = React.useState([]);

  React.useEffect(() => {
    initMap();
  }, []);

  function initMap() {
    fetch("/user_check_ins.json")
      .then((response) => response.json())
      .then((jsonResponse) => {
        const basicMap = new google.maps.Map(
          document.querySelector("#dashboard-map"),
          {
            zoom: 4,
          }
        );

        const { checkIns } = jsonResponse;
        setAllCheckIns(checkIns);

        const markers = [];
        const uniqueHikes = [];

        for (const currentCheckIn of checkIns) {
          const { hike_name, latitude, longitude } = currentCheckIn.hike;
          const hikeId = currentCheckIn.hike_id;
          if (!uniqueHikes.includes(hikeId)) {
            uniqueHikes.push(hikeId);
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
        basicMap.setZoom(5);

        setMapHikes(uniqueHikes);
        setMapMarkers(markers);
        setMapBounds(bounds);
        setMyMap(basicMap);
      });
  }

  function createMarkers(checkIns) {
    const markers = [];
    const uniqueHikes = [];

    for (const currentCheckIn of checkIns) {
      const { hike_name, latitude, longitude } = currentCheckIn.hike;
      const hikeId = currentCheckIn.hike_id;
      if (!uniqueHikes.includes(hikeId)) {
        uniqueHikes.push(hikeId);
        markers.push(
          new google.maps.Marker({
            position: {
              lat: Number(latitude),
              lng: Number(longitude),
            },
            title: hike_name,
            map: myMap,
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
        infoWindow.open(myMap, marker);
      });
    }

    myMap.fitBounds(bounds);
    myMap.setZoom(5);

    setMapHikes(uniqueHikes);
    setMapMarkers(markers);
    setMapBounds(bounds);
  }

  function filterCheckInsByDate(checkIns, startDate, endDate) {
    let filteredCheckIns = [];

    for (const checkIn of checkIns) {
      const dateHiked = new Date(checkIn["date_hiked"]);
      if (dateHiked > startDate && dateHiked < endDate) {
        filteredCheckIns.push(checkIn);
      }
    }
    return filteredCheckIns;
  }

  function createMarkers(checkIns) {
    const markers = [];
    const uniqueHikes = [];

    for (const currentCheckIn of checkIns) {
      const { hike_name, latitude, longitude } = currentCheckIn.hike;
      const hikeId = currentCheckIn.hike_id;
      if (!uniqueHikes.includes(hikeId)) {
        uniqueHikes.push(hikeId);
        markers.push(
          new google.maps.Marker({
            position: {
              lat: Number(latitude),
              lng: Number(longitude),
            },
            title: hike_name,
            map: myMap,
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
    }

    myMap.setZoom(5);

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
        infoWindow.open(myMap, marker);
      });
    }

    myMap.fitBounds(bounds);
    myMap.setZoom(5);

    setMapHikes(uniqueHikes);
    setMapMarkers(markers);
    setMapBounds(bounds);
  }

  React.useImperativeHandle(ref, () => ({
    updateMapData() {
      for (const marker of mapMarkers) {
        // infoWindow.close(myMap, marker);
        marker.setMap(null);
      }
      mapMarkers.length = 0;
      fetch("/user_check_ins.json")
        .then((response) => response.json())
        .then((jsonResponse) => {
          const { checkIns } = jsonResponse;
          setAllCheckIns(checkIns);
          const view = document.querySelector("input[name=map-view]:checked");
          if (view === null || view.value === "map-all-view") {
            createMarkers(checkIns);
          } else if (view.value === "map-month-view") {
            const date = new Date(
              document.querySelector("select[name=map-month-view-year]").value,
              document.querySelector("select[name=map-month-view-month]")
                .value - 1,
              1,
              0,
              0
            );
            const month = date.getMonth();
            const year = date.getFullYear();
            const startDate = new Date(year, month, 1, 0, 0);
            const endDate = new Date(new Date(year, month + 1, 1, 0, 0) - 1);
            const filteredCheckIns = filterCheckInsByDate(
              checkIns,
              startDate,
              endDate
            );
            createMarkers(filteredCheckIns);
          } else if (view.value === "map-year-view") {
            const year = document.querySelector(
              "select[name=map-year-view-year]"
            ).value;
            const startDate = new Date(year, 0);
            const endDate = new Date(year, 11, 31);
            const filteredCheckIns = filterCheckInsByDate(
              checkIns,
              startDate,
              endDate
            );
            createMarkers(filteredCheckIns);
          }
        });

      myMap.setZoom(5);
    },
  }));

  return (
    <React.Fragment>
      <div id="dashboard-map" style={{ height: "100%" }}></div>
    </React.Fragment>
  );
});

const DashboardMapContainer = React.forwardRef((props, ref) => {
  const DashboardMapRef = React.useRef();

  const [checkIns, setCheckIns] = React.useState([]);
  const [mapHeader, setMapHeader] = React.useState("Hikes Visited - All Time");
  const [mapCheckIns, setMapCheckIns] = React.useState([]);

  React.useEffect(() => {
    fetch(`/user_check_ins.json`)
      .then((response) => response.json())
      .then((data) => {
        const { checkIns } = data;
        setCheckIns(checkIns);
        countHikeOccurrences(checkIns);
      });
  }, []);

  function updateMapInfo() {
    fetch("/user_check_ins.json")
      .then((response) => response.json())
      .then((jsonResponse) => {
        const { checkIns } = jsonResponse;
        setCheckIns(checkIns);
        const view = document.querySelector("input[name=map-view]:checked");
        if (view === null || view.value === "map-all-view") {
          setMapHeader("Hikes Visited - All Time");
          countHikeOccurrences(checkIns);
        } else if (view.value === "map-month-view") {
          const date = new Date(
            document.querySelector("select[name=map-month-view-year]").value,
            document.querySelector("select[name=map-month-view-month]").value -
              1,
            1,
            0,
            0
          );
          const monthName = date.toLocaleString("default", { month: "long" });
          const month = date.getMonth();
          const year = date.getFullYear();
          const startDate = new Date(year, month, 1, 0, 0);
          const endDate = new Date(new Date(year, month + 1, 1, 0, 0) - 1);
          setMapHeader(`Hikes Visited - ${monthName} ${year}`);
          filterCheckInsByDate(checkIns, startDate, endDate);
        } else if (view.value === "map-year-view") {
          const year = document.querySelector(
            "select[name=map-year-view-year]"
          ).value;
          const startDate = new Date(year, 0);
          const endDate = new Date(year, 11, 31);
          setMapHeader(`Hikes Visited - ${year}`);
          filterCheckInsByDate(checkIns, startDate, endDate);
        }
      });
  }

  const filterCheckInsByDate = (checkIns, startDate, endDate) => {
    let filteredCheckIns = [];
    for (const checkIn of checkIns) {
      const dateHiked = new Date(checkIn["date_hiked"]);
      if (dateHiked > startDate && dateHiked < endDate) {
        filteredCheckIns.push(checkIn);
      }
    }
    countHikeOccurrences(filteredCheckIns);
  };

  const countHikeOccurrences = (checkIns) => {
    let checkInsHikeCounts = [];

    for (const currentCheckIn of checkIns) {
      if (
        checkInsHikeCounts.some((hikeCount) => {
          return hikeCount["hike_id"] == currentCheckIn["hike_id"];
        })
      ) {
        // If yes! then increase the occurrence by 1
        checkInsHikeCounts.forEach((hikeCount) => {
          if (hikeCount["hike_id"] === currentCheckIn["hike_id"]) {
            hikeCount["occurrence"]++;
          }
        });
      } else {
        // If not! Then create a new object initialize
        // it with the present iteration key's value and
        // set the occurrence to 1
        let newHikeCountObj = {};
        newHikeCountObj["hike_id"] = currentCheckIn["hike_id"];
        newHikeCountObj["occurrence"] = 1;
        newHikeCountObj["hike_name"] = currentCheckIn["hike"]["hike_name"];
        checkInsHikeCounts.push(newHikeCountObj);
      }
    }
    checkInsHikeCounts.sort((a, b) => {
      let fa = a.hike_name.toLowerCase(),
        fb = b.hike_name.toLowerCase();

      if (fa < fb) {
        return -1;
      }
      if (fa > fb) {
        return 1;
      }
      return 0;
    });

    setMapCheckIns(checkInsHikeCounts);
  };

  function getMapData() {
    DashboardMapRef.current.updateMapData();
    updateMapInfo();
  }

  React.useImperativeHandle(ref, () => ({
    getMapData() {
      DashboardMapRef.current.updateMapData();
      updateMapInfo();
    },
  }));

  return (
    <div
      className="card"
      style={{
        border: "0",
        width: "100%",
        height: "calc(100vh - 190px)",
      }}
    >
      <div className="row g-0" style={{ height: "100%" }}>
        <div className="col-md-6">
          <DashboardMap ref={DashboardMapRef} />
        </div>
        <div className="col-md-6" style={{ height: "100%", overflowY: "auto" }}>
          <div className="card-body">
            {checkIns.length > 0 ? (
              <React.Fragment>
                <ViewMonthYear
                  category="map"
                  getFunction={getMapData}
                  display="block"
                />
                <h5 className="mt-4 card-title">{mapHeader}</h5>
                <p className="card-text">
                  {mapCheckIns.map((hikeCount) => (
                    <React.Fragment>
                      <br></br>
                      Hiked{" "}
                      <a
                        className="link-dark"
                        href={`/hikes/${hikeCount.hike_id}`}
                      >
                        {hikeCount.hike_name}
                      </a>{" "}
                      {hikeCount.occurrence}{" "}
                      {hikeCount.occurrence > 1 ? "times" : "time"}
                    </React.Fragment>
                  ))}
                </p>
              </React.Fragment>
            ) : (
              <React.Fragment>
                You haven't checked into any hikes yet!
                <br></br>Please add a check in to view your stats.
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
