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

function NoComponentsWarning(props) {
  return (
    <React.Fragment>
      <div id={`no-component-warning-${props.component}`} style={{ display: "none" }}>
        You haven't {props.missingAction} yet!
        <br></br>
        {props.actionString}
      </div>
    </React.Fragment>
  );
}
