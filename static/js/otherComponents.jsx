"use strict";

function FooterNavItemOffCanvas(props) {
  return (
    <li className="nav-item">
      <a
        className="nav-link"
        data-bs-toggle="offcanvas"
        href={`#${props.href}`}
        role="button"
        aria-controls={props.href}
        onClick={props.getFunction}
      >
        <small>
          <i
            data-bs-toggle="tooltip"
            data-bs-placement="right"
            title={props.tooltip}
            className={props.icon}
          ></i>
          &nbsp;{props.name}
        </small>
      </a>
    </li>
  );
}

function FooterSearchBar(props) {
  const [keywordFilter, setKeywordFilter] = React.useState("");
  const [searchHikes, setSearchHikes] = React.useState([]);

  function getFilteredHikes() {
    let url =
      "http://api.example.com/results?q=" +
      encodeURI(this.state.term) +
      "&json=1";
    axios
      .get(url)
      .then((response) => {
        let data = {
          results: response.data,
        };
        this.setState(data);
      })
      .catch((error) => console.log(error));
  }

  function doNothing() {}
  return (
    <React.Fragment>
      <ul className="navbar-nav me-auto">
        <li className="nav-item d-flex">
          <div className="input-group">
            <input
              className="form-control input-sm"
              type="search"
              name="search_term"
              placeholder="Search by hike name"
              aria-label="Search"
              value={keywordFilter}
              onChange={(event) => setKeywordFilter(event.target.value)}
            ></input>
            <button
              className="btn btn-sm nav-link"
              role="button"
              style={{ border: "1px solid #ced4da" }}
              onClick={getFilteredHikes}
            >
              <small>
                <i
                  data-bs-toggle="tooltip"
                  data-bs-placement="right"
                  title="search"
                  className="bi bi-search"
                ></i>
              </small>
            </button>
          </div>
        </li>
        <FooterNavItemOffCanvas
          name="Filter"
          href="Search"
          tooltip="filter"
          icon="bi bi-sliders"
          getFunction={doNothing}
        />
      </ul>
    </React.Fragment>
  );
}

// const useInfiniteScroll = (callback) => {
//   const [isFetching, setIsFetching] = React.useState(false);

//   React.useEffect(() => {
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   React.useEffect(() => {
//     if (!isFetching) return;
//     callback(() => {
//       console.log("called back");
//     });
//   }, [isFetching]);

//   function handleScroll() {
//     if (
//       window.innerHeight + document.documentElement.scrollTop !==
//         document.documentElement.offsetHeight ||
//       isFetching
//     )
//       return;
//     setIsFetching(true);
//   }

//   return [isFetching, setIsFetching];
// };

// function NoComponentsWarning(props) {
//   return (
//     <React.Fragment>
//       <div id={`no-component-warning-${props.component}`} style={{ display: "none" }}>
//         You haven't {props.missingAction} yet!
//         <br></br>
//         {props.actionString}
//       </div>
//     </React.Fragment>
//   );
// }
