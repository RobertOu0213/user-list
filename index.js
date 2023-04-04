const BASE_URL = "https://user-list.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/v1/users/";
const ID_URL = "https://user-list.alphacamp.io/api/v1/users/";
const dataPanel = document.querySelector("#data-panel");
const users = [];
let filterUserList = []
const searchPanel = document.querySelector("#search-panel");
const searchInput = document.querySelector("#search-input");
const user_per_page = 20
const pagePanel = document.querySelector('#paginator')

//request API 傳遞Modal資料

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

// render userList
function renderUserList(data) {
  let rawHTML = "";
  data.forEach((item) => {
    //name avatar
    rawHTML += `

    <div class="col-sm-2">
      <div class="card m-2 card-page">
        <img src="${item.avatar}" class="card-img-top"
          alt="user-image">
        <div class="card-body">
          <h5 class="card-title">${item.name}</h5>
        </div>
        <div class="card-footer">
          <button class="btn btn-primary btn-show-user" data-bs-toggle="modal"
            data-bs-target="#user-modal" data-id="${item.id}">Click!</button>
            <button class="btn btn-danger btn-show-favorite" data-id="${item.id}">+</button>
        </div>
      </div>
    </div>
    `;

    dataPanel.innerHTML = rawHTML;
  });
}

//render paginator
function renderPaginator(amount) {
  const pages = Math.ceil(amount / 20)
  let rawHTML = ''
  for (let i = 1; i <= pages; i++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page=${i}>${i}</a></li>`
  }
  pagePanel.innerHTML = rawHTML

}

// add to favorite

function addToFavorite(id) {
  const favoriteData = JSON.parse(localStorage.getItem("favoriteUser")) || [];
  const user = users.find((user) => user.id === id);

  if (favoriteData.some((user) => user.id === id)) {
    return alert("Already added in favorite list");
  }

  favoriteData.push(user);
  localStorage.setItem("favoriteUser", JSON.stringify(favoriteData));
}

// pagination of data

function getPerPageData(page) {
  const data = filterUserList.length ? filterUserList : users;
  return data.slice((page - 1) * user_per_page, (user_per_page * page))

}


//modal 監聽器

dataPanel.addEventListener("click", function (event) {
  if (event.target.matches(".btn-show-user")) {
    showUserList(Number(event.target.dataset.id));
  } else if (event.target.matches(".btn-show-favorite")) {
    addToFavorite(Number(event.target.dataset.id));
    // console.log(event.target.dataset.id);
  }
});

//search 監聽器

searchPanel.addEventListener("submit", function OnSearchFormSubmitted(event) {
  event.preventDefault();
  const keyword = searchInput.value.trim().toLowerCase();

  filterUserList = users.filter((user) =>
    user.name.toLowerCase().includes(keyword)
  );
  if (filterUserList.length === 0) {
    alert("can't find  " + keyword);
  }

  // 空白搜尋時維持第一頁分頁
  renderUserList(getPerPageData(1));
  renderPaginator(filterUserList.length)
});

//paginator 監聽器

pagePanel.addEventListener('click', function (event) {
  if (event.target.tagName !== 'A') return

  renderUserList(getPerPageData(Number(event.target.dataset.page)))


})

axios
  .get(INDEX_URL)
  .then((response) => {
    console.log(response.data.results);
    users.push(...response.data.results);

    renderUserList(getPerPageData(1));
    renderPaginator(users.length)

  })
  .catch((err) => {
    console.log(err);
  });

