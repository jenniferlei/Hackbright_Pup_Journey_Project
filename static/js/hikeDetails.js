"use strict";

//////////// MAKE SURE AT LEAST ONE CHECKBOX IS CHECKED WHEN ADDING A PET ////////////
function validateCheckIn() {
  const petCheckBoxes = document.querySelectorAll(
    "input[name=add-check-in-pet_id]"
  );
  const atLeastOneChecked = false;
  for (let i = 0; i < petCheckBoxes.length; i++) {
    if (petCheckBoxes[i].checked) {
      atLeastOneChecked = true;
      break;
    }
  }
  if (atLeastOneChecked === false) {
    alert("Please add a pet to the check in");
    return false;
  }

  return true;
}

//////////// KEEP LAST ACTIVE TAB ACTIVE ////////////
$(document).ready(function () {
  $('button[data-bs-toggle="tab"]').on("show.bs.tab", function (evt) {
    localStorage.setItem("activeTab", $(evt.target).attr("data-bs-target"));
  });
  const activeTab = localStorage.getItem("activeTab");
  if (activeTab) {
    $('#nav-tab button[data-bs-target="' + activeTab + '"]').tab("show");
  }
});
