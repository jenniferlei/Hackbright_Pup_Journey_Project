const DashboardGraph = React.forwardRef((props, ref) => {
  const [myChart, setMyChart] = React.useState(null);

  React.useEffect(() => {
    initGraph();
  }, []);

  function initGraph() {
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

        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth();

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
          }
        );

        setMyChart(myLineChart);
      });
  }

  React.useImperativeHandle(ref, () => ({
    getGraphData() {
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
      } else {
        const year = document.querySelector(
          "select[name=graph-year-view-year]"
        ).value;
        myChart.options.scales.x.min = new Date(year, 0);
        myChart.options.scales.x.max = new Date(year, 11, 31);
        myChart.update();
      }
      props.updateGraphInfo();
    },
  }));
  return <canvas id="check-in-graph"></canvas>;
});

const DashboardGraphContainer = React.forwardRef((props, ref) => {
  const DashboardGraphRef = React.useRef();

  const [graphHeader, setGraphHeader] = React.useState("");
  const [graphCheckIns, setGraphCheckIns] = React.useState([]);
  const [graphCheckInsTotalMiles, setGraphCheckInsTotalMiles] =
    React.useState("");

  React.useEffect(() => {
    fetch(`/user_check_ins.json`)
      .then((response) => response.json())
      .then((data) => {
        const { checkIns } = data;

        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth();
        const monthName = date.toLocaleString("default", { month: "long" });
        const startDate = new Date(year, month, 1, 0, 0);
        const endDate = new Date(year, month + 1, 1, 0, 0) - 1;

        let initCheckIns = [];
        for (const checkIn of checkIns) {
          const dateHiked = new Date(checkIn["date_hiked"]);
          if (dateHiked > startDate && dateHiked < endDate) {
            initCheckIns.push(checkIn);
          }
        }

        let initMiles = 0;

        let totalMiles = initCheckIns.reduce(function (
          previousValue,
          currentValue
        ) {
          return previousValue + currentValue.miles_completed;
        },
        initMiles);
        setGraphHeader(`${monthName} ${year}`);
        setGraphCheckIns(initCheckIns);
        setGraphCheckInsTotalMiles(totalMiles);
      });
  }, []);

  function parentUpdateGraphView() {
    DashboardGraphRef.current.updateGraphView();
  }

  function updateGraphInfo() {
    fetch("/user_check_ins.json")
      .then((response) => response.json())
      .then((jsonResponse) => {
        const { checkIns } = jsonResponse;
        const view = document.querySelector("input[name=graph-view]:checked");
        if (view === null) {
          const date = new Date();
          const year = date.getFullYear();
          const month = date.getMonth();
          const monthName = date.toLocaleString("default", { month: "long" });
          const startDate = new Date(year, month, 1, 0, 0);
          const endDate = new Date(year, month + 1, 1, 0, 0) - 1;
          setGraphHeader(`${monthName} ${year}`);
          filterCheckInsByDate(checkIns, startDate, endDate);
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
  }

  const filterCheckInsByDate = (checkIns, startDate, endDate) => {
    let filteredCheckIns = [];
    for (const checkIn of checkIns) {
      const dateHiked = new Date(checkIn["date_hiked"]);
      if (dateHiked > startDate && dateHiked < endDate) {
        filteredCheckIns.push(checkIn);
      }
    }
    setGraphCheckIns(filteredCheckIns);
    let initMiles = 0;
    let totalMiles = filteredCheckIns.reduce(function (
      previousValue,
      currentValue
    ) {
      return previousValue + currentValue.miles_completed;
    },
    initMiles);
    setGraphCheckInsTotalMiles(totalMiles);
  };

  React.useImperativeHandle(ref, () => ({
    updateGraphData() {
      DashboardGraphRef.current.getGraphData();
      updateGraphInfo();
    },
  }));

  return (
    <div
      className="card"
      style={{
        border: "0",
        width: "100%",
        height: "calc(100vh - 174px)",
      }}
    >
      <div className="row g-0" style={{ height: "100%" }}>
        <div className="col-md-8" style={{ height: "100%" }}>
          <DashboardGraph
            ref={DashboardGraphRef}
            updateGraphInfo={updateGraphInfo}
          />
        </div>
        <div className="col-md-4">
          <div className="card-body">
            <ViewMonthYear
              category="graph"
              getFunction={parentUpdateGraphView}
              display="none"
            />
            <h5 className="mt-4 card-title">{graphHeader}</h5>
            <p className="card-text">
              You have checked in to {graphCheckIns.length} hikes
              <br></br>and walked {graphCheckInsTotalMiles} miles!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});