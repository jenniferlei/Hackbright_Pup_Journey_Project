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
  function doNothing() {}
  return (
    <React.Fragment>
      <form method="GET" action="/hikes/search">
        <li className="nav-item d-flex">
          <input
            className="form-control me-2 input-sm"
            type="search"
            name="search_term"
            placeholder="Search hikes"
            aria-label="Search"
          ></input>
          <button className="btn btn-sm nav-link" role="button" type="submit">
            <small>
              <i
                data-bs-toggle="tooltip"
                data-bs-placement="right"
                title="search"
                className="bi bi-search"
              ></i>
            </small>
          </button>
        </li>
      </form>
      <FooterNavItemOffCanvas
        name="Advanced Search"
        href="Search"
        tooltip="advanced search"
        icon="bi bi-sliders"
        getFunction={doNothing}
      />
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
