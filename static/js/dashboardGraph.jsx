const DashboardGraph = React.forwardRef((props, ref) => {
  const colors = [
    "rgb(218, 203, 192)",
    "rgb(239, 200, 167)",
    "rgb(239, 200, 167)",
    "rgb(231, 154, 90)",
    "rgb(233, 101, 60)",
    "rgb(104, 117, 138)",
    "rgb(79, 109, 158)",
    "rgb(49, 74, 114)",
    "rgb(151, 166, 190)",
  ];
  const [myChart, setMyChart] = React.useState(null);
  const [yearRange, setYearRange] = React.useState([2021, 2022]);

  React.useEffect(() => {
    initGraph();
  }, []);

  const initGraph = () => {
    fetch("/check-ins-by-pets.json")
      .then((response) => response.json())
      .then((responseJson) => {
        const { petCheckIns } = responseJson;

        const all_data = [];

        // let years = [];
        // const currentDate = new Date();
        // const currentYear = currentDate.getFullYear();

        for (const petCheckIn of petCheckIns) {
          const dateHiked = new Date(petCheckIn.date_hiked);
          // const year = dateHiked.getFullYear();
          // if (!years.includes(year)) {
          //   years.push(year);
          // }

          // const orderedYears = years.sort((a, b) => {
          //   return a - b;
          // });
          // setYearRange([orderedYears[0], currentYear]);

          const label = petCheckIn.pet_name;
          const data = petCheckIn.data.map((checkIn) => ({
            x: checkIn.date_hiked,
            y: checkIn.miles_completed,
          }));

          const lineColor = colors[Math.floor(Math.random() * colors.length)];

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

        const myLineChart = new Chart(
          document.querySelector("#check-in-graph"),
          {
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
                  min: new Date(yearRange[0], 0),
                  max: new Date(yearRange[1], 11, 31),
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
          }
        );

        setMyChart(myLineChart);
      });
  };

  React.useImperativeHandle(ref, () => ({
    getGraphData() {
      fetch("/check-ins-by-pets.json")
        .then((response) => response.json())
        .then((responseJson) => {
          const { petCheckIns } = responseJson;

          const all_data = [];
          // let years = [];
          // const currentDate = new Date();
          // const currentYear = currentDate.getFullYear();

          for (const petCheckIn of petCheckIns) {
            // set year range for viewing graph by all time
            const dateHiked = new Date(petCheckIn.date_hiked);
            // const year = dateHiked.getFullYear();
            // if (!years.includes(year)) {
            //   years.push(year);
            // }

            // const orderedYears = years.sort((a, b) => {
            //   return a - b;
            // });
            // setYearRange([orderedYears[0], currentYear]);

            const label = petCheckIn.pet_name;
            const data = petCheckIn.data.map((checkIn) => ({
              x: checkIn.date_hiked,
              y: checkIn.miles_completed,
            }));

            const lineColor = colors[Math.floor(Math.random() * colors.length)];

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

          myChart.data.datasets = all_data;
          myChart.update();
        });
    },
    updateGraphView() {
      const view = document.querySelector(
        "input[name=graph-view]:checked"
      ).value;

      if (view === "graph-month-view") {
        const month =
          document.querySelector("select[name=graph-month-view-month]").value -
          1;
        const year = document.querySelector(
          "select[name=graph-month-view-year]"
        ).value;
        myChart.options.scales.x.min = new Date(year, month, 1, 0, 0);
        myChart.options.scales.x.max = new Date(year, month + 1, 1, 0, 0) - 1;
        myChart.update();
      } else if (view === "graph-year-view") {
        const year = document.querySelector(
          "select[name=graph-year-view-year]"
        ).value;
        myChart.options.scales.x.min = new Date(year, 0);
        myChart.options.scales.x.max = new Date(year, 11, 31);
        myChart.update();
      } else if (view === "graph-all-view") {
        myChart.options.scales.x.min = new Date(yearRange[0], 0);
        myChart.options.scales.x.max = new Date(yearRange[1], 11, 31);
        myChart.update();
      }

      props.updateGraphInfo();
    },
  }));
  return <canvas id="check-in-graph"></canvas>;
});

const DashboardGraphContainer = React.forwardRef((props, ref) => {
  const DashboardGraphRef = React.useRef();

  const [allCheckIns, setAllCheckIns] = React.useState([]);
  const [graphHeader, setGraphHeader] = React.useState("");
  const [graphCheckIns, setGraphCheckIns] = React.useState([]);
  const [graphCheckInsTotalMiles, setGraphCheckInsTotalMiles] =
    React.useState("");

  const [error, setError] = React.useState(null);
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    getAllTimeGraphInfo();
  }, []);

  const getAllTimeGraphInfo = () => {
    fetch("/user_check_ins.json")
      .then((response) => response.json())
      .then(
        (data) => {
          const { checkIns } = data;
          setAllCheckIns(checkIns);

          let initMiles = 0;

          let totalMiles = checkIns.reduce(function (
            previousValue,
            currentValue
          ) {
            return previousValue + currentValue.miles_completed;
          },
          initMiles);

          setGraphHeader("All Time");
          setGraphCheckIns(checkIns);
          setGraphCheckInsTotalMiles(totalMiles);
          setIsLoaded(true);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  };

  const parentUpdateGraphView = () => {
    DashboardGraphRef.current.updateGraphView();
  };

  const updateGraphInfo = () => {
    fetch("/user_check_ins.json")
      .then((response) => response.json())
      .then((jsonResponse) => {
        const { checkIns } = jsonResponse;

        setAllCheckIns(checkIns);
        const view = document.querySelector("input[name=graph-view]:checked");
        if (view === null || view.value === "graph-all-view") {
          getAllTimeGraphInfo();
        } else if (view.value === "graph-month-view") {
          const date = new Date(
            document.querySelector("select[name=graph-month-view-year]").value,
            document.querySelector("select[name=graph-month-view-month]")
              .value - 1,
            1,
            0,
            0
          );
          const monthName = date.toLocaleString("default", { month: "long" });
          const month = date.getMonth();
          const year = date.getFullYear();
          const startDate = new Date(year, month, 1, 0, 0);
          const endDate = new Date(new Date(year, month + 1, 1, 0, 0) - 1);
          setGraphHeader(`${monthName} ${year}`);
          filterCheckInsByDate(checkIns, startDate, endDate);
        } else if (view.value === "graph-year-view") {
          const year = document.querySelector(
            "select[name=graph-year-view-year]"
          ).value;
          const startDate = new Date(year, 0);
          const endDate = new Date(year, 11, 31);
          setGraphHeader(`${year}`);
          filterCheckInsByDate(checkIns, startDate, endDate);
        }
      });
  };

  const filterCheckInsByDate = (checkIns, startDate, endDate) => {
    // let filteredCheckIns = checkIns.filter((checkIn) => {
    //   Date(checkIn["date_hiked"]) > startDate &&
    //     Date(checkIn["date_hiked"]) < endDate;
    // });
    let filteredCheckIns = [];
    for (const checkIn of checkIns) {
      const dateHiked = new Date(checkIn["date_hiked"]);
      if (dateHiked > startDate && dateHiked < endDate) {
        filteredCheckIns.push(checkIn);
      }
    }
    setGraphCheckIns(filteredCheckIns);
    let initMiles = 0;
    let totalMiles = filteredCheckIns.reduce((previousValue, currentValue) => {
      return previousValue + currentValue.miles_completed;
    }, initMiles);
    setGraphCheckInsTotalMiles(totalMiles);
  };

  React.useImperativeHandle(ref, () => ({
    updateGraphData() {
      DashboardGraphRef.current.getGraphData();
      updateGraphInfo();
    },
  }));

  return (
    <div className="card dashboard-card">
      <div className="row g-0" style={{ height: "100%" }}>
        <div
          className="col-md-8"
          style={{
            border: "1px solid rgba(0, 0, 0, 0.125)",
            borderRadius: "10px",
            padding: "5px",
          }}
        >
          <DashboardGraph
            ref={DashboardGraphRef}
            updateGraphInfo={updateGraphInfo}
          />
        </div>
        <div className="col-md-4">
          <div className="card-body">
            {error ? (
              <i>{error.messsage}</i>
            ) : !isLoaded ? (
              <div class="loading-container">
                <div class="loading"></div>
                <div id="loading-text">loading</div>
              </div>
            ) : allCheckIns.length > 0 ? (
              <React.Fragment>
                <ViewMonthYear
                  category="graph"
                  getFunction={parentUpdateGraphView}
                />
                <h5 className="mt-4 card-title">
                  Distance Hiked - {graphHeader}
                </h5>
                <div className="card-text fw-300">
                  Altogether, your pets have checked in to{" "}
                  {graphCheckIns.length} hikes
                  <br></br>and walked {graphCheckInsTotalMiles} miles!
                </div>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <div className="fw-300">
                  You haven't checked into any hikes yet!
                  <br></br>Please add a check in to view your stats.
                </div>
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
