"use strict";

// drop down
// input text
// buttons
// submit
// forms

// generic modal selector button
// generic modal content, always include x button
// includes
// form container
// generic input text
// generic submit button
// generic close button

// modal containers

// modal container for create account
// modal container for login
// modal container for add pet
// modal container for

const FormInput = (props) => {
  return (
    <React.Fragment>
      <div class="mb-3">
        <label for={props.keyword} class="sr-only">
          {props.label}
        </label>
        <input
          type={props.inputType}
          name={props.keyword}
          class="form-control input-lg"
          placeholder={props.placeholder}
          required={props.required}
        />
      </div>
    </React.Fragment>
  );
};

{
  /* <div class="mb-3">
                  <label for="full_name" class="sr-only">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    class="form-control input-lg"
                    placeholder="Full Name"
                    required
                  />
                </div>

                <div class="mb-3">
                  <label for="email" class="sr-only">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    class="form-control input-lg"
                    placeholder="Email Address"
                    required
                  />
                </div>

                <div class="mb-3">
                  <label for="password" class="sr-only">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    class="form-control input-lg"
                    placeholder="Password"
                    required
                  />
                </div> */
}

const ModalFormContainer = (props) => {};

const ModalContainer = (props) => {
  return (
    <React.Fragment>
      <a
        className={props.className}
        href="#"
        data-bs-toggle="modal"
        data-bs-target={props.idTarget}
      >
        {props.modalName}
      </a>

      <div
        class="modal fade"
        id={props.idName}
        tabindex="-1"
        aria-labelledby={props.labelName}
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id={props.labelName}>
                {props.modalName}
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <form action={props.action} method={props.method}>
                {/* ModalFormContainer goes here */}

                <div class="modal-footer">
                  <button
                    class="btn btn-sm btn-primary btn-block"
                    type="submit"
                  >
                    {props.actionButton}
                  </button>

                  <button
                    type="button"
                    class="btn btn-sm btn-secondary btn-block"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
