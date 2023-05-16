/** @format */

// DOM click event
let insertForm = document.getElementById("form1");
let updateForm = document.getElementById("form2");
let deleteForm = document.getElementById("form3");
console.log(insertForm);
console.log(updateForm);
console.log(deleteForm);
insertForm.style.display = "block";
updateForm.style.display = "none";
deleteForm.style.display = "none";

insertForm.style.backgroundColor = "green";
updateForm.style.backgroundColor = "gold";

deleteForm.style.backgroundColor = "red";

// form change
select.addEventListener("change", function (e) {
  e.preventDefault();
  if (e.currentTarget.value === "Insert") {
    insertForm.style.display = "block";
    updateForm.style.display = "none";
    deleteForm.style.display = "none";
  }
  if (e.currentTarget.value === "Update") {
    insertForm.style.display = "none";
    updateForm.style.display = "block";
    deleteForm.style.display = "none";
  }
  if (e.currentTarget.value === "Delete") {
    insertForm.style.display = "none";
    updateForm.style.display = "none";
    deleteForm.style.display = "block";
  }
});

// server information
function formSubmit(e) {
  e.preventDefault();
  return fetch("http://localhost:7070/update", {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      id: document.querySelector("#myForm input[name=id]").value,
      updatedName: document.querySelector("#myForm input[name=newUserName]")
        .value,
      updatedPass: document.querySelector("#myForm input[name=newPassword]")
        .value,
    }),
  });
  // .then((Response) => Response.clone().json())
  // .then((data) => console.log(data));
}
document.getElementById("myForm").addEventListener("submit", formSubmit);

// =====================================================

function removeUser(e) {
  e.preventDefault();
  return fetch("http://localhost:8080/remove-user", {
    method: "DELETE",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      id: document.querySelector("#delete-user input[name=id]").value,
    }),
  })
    // .then((Response) => Response.clone().json())
    // .then((data) => console.log(data));
}
document.getElementById("delete-user").addEventListener("submit", removeUser);
