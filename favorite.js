const BASE_URL = "https://user-list.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/v1/users/";
const ID_URL = "https://user-list.alphacamp.io/api/v1/users/";
const dataPanel = document.querySelector("#data-panel");
const users = JSON.parse(localStorage.getItem("favoriteUser")) || [];

function renderUserList(data) {
  let rawHTML = "";
  data.forEach((item) => {
    //name avatar
    rawHTML += `

    <div class="col-sm-2">
      <div class="card m-2 ">
        <img src="${item.avatar}" class="card-img-top"
          alt="user-image">
        <div class="card-body">
          <h5 class="card-title">${item.name}</h5>
        </div>
        <div class="card-footer">
          <button class="btn btn-primary btn-show-user" data-bs-toggle="modal"
            data-bs-target="#user-modal" data-id="${item.id}">Click!</button>
            <button class="btn btn-danger btn-delete-user" data-id="${item.id}">X</button>
        </div>
      </div>
    </div>
    `;

    dataPanel.innerHTML = rawHTML;
  });
}

// modal function

function showUserList(id) {
  const modalName = document.querySelector("#user-modal-name");
  const modalAge = document.querySelector("#user-modal-age");
  const modalBirthday = document.querySelector("#user-modal-birthday");
  const modalGender = document.querySelector("#user-modal-gender");
  const modalRegion = document.querySelector("#user-modal-region");
  const modalEmail = document.querySelector("#user-modal-email");

  axios.get(ID_URL + id).then((response) => {
    const data = response.data;

    modalName.innerText = "name:" + data.name;
    modalAge.innerText = "age:" + data.age;
    modalBirthday.innerText = "birthday:" + data.birthday;
    modalGender.innerText = "gender:" + data.gender;
    modalRegion.innerText = "region:" + data.region;
    modalEmail.innerText = "email:" + data.email;
  });
}

//delete function

function deleteToFavorite(id) {
  const startIndex = users.findIndex((user) => user.id === id)
  users.splice(startIndex, 1)
  localStorage.setItem("favoriteUser", JSON.stringify(users));
  renderUserList(users)
}

//監聽 modal & delete
dataPanel.addEventListener("click", function (event) {
  if (event.target.matches(".btn-show-user")) {
    showUserList(Number(event.target.dataset.id));
  } else if (event.target.matches(".btn-delete-user")) {
    deleteToFavorite(Number(event.target.dataset.id));
  }
});

renderUserList(users);
