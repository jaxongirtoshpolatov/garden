// API url
const CATEGORIES_API = "./data/categories_card.json";
const SALE_API = "./data/sale_card.json";
// send request
const getCategoriesData = async (resource) => {
  loader("hide");
  const request = await fetch(resource);
  if (!request.ok) {
    throw new Error("Qandaydir xatolik yuz berdi!");
  }
  const data = await request.json();
  loader(undefined);
  return data;
};

getCategoriesData(CATEGORIES_API)
  .then((data) => {
    useData(data);
    return getCategoriesData(SALE_API);
  })
  .then((data) => {
    useSaleData(data);
  })
  .catch((err) => {
    console.log(err.message);
  });

// loader
function loader(hide) {
  const loader = document.querySelector(".categories__loader");
  if (hide) {
    loader.classList.remove("hide");
  } else {
    loader.classList.add("hide");
  }
}

//use data

function useData(data) {
  const parentEl = document.querySelector(".categories__cards");
  data.forEach((item) => {
    const createEL = document.createElement("div");
    createEL.className = "categories__card";

    createEL.innerHTML = `
        <div class="categories__card_photo">
            <img class="photo" src=${item.path} alt="card-photo">
        </div>
        <h1 class="categories__card_title">${item.title}</h1>
    `;

    parentEl.appendChild(createEL);
  });
}

// use sale data

function useSaleData(data) {
  const parentEl = document.querySelector(".sale__cards");
  data.forEach((item) => {
    const createEl = document.createElement("div");
    createEl.classList.add("sale__card");

    createEl.innerHTML = `
    <div class="sale__card_photo">
        <span class="value">-${item.sale}%</span>
            <img class="photo" src=${item.path} alt="sale photo">
        </div>
        <div class="sale__card_body">
            <h1 class="body__title">${item.title}</h1>
            <div class="body__sale_price">
                <strong class="last__price">$${item.last_price}</strong>
                <span class="first__price">$${item.first_price}</span>
            </div>
        </div>
    `;

    parentEl.appendChild(createEl);
  });
}

// time
const day = document.querySelector(".day"),
  hour = document.querySelector(".hour"),
  minute = document.querySelector(".minute"),
  second = document.querySelector(".time__second");

let dayValue = 2,
  hourValue = 2,
  minuteValue = 1,
  secondValue = 10;

// local stroge get time

let getTime = localStorage.getItem("preTime")
  ? JSON.parse(localStorage.getItem("preTime"))
  : [];
if (getTime.length > 0) {
  secondValue = +getTime[3];
  minuteValue = +getTime[2];
  hourValue = +getTime[1];
  dayValue = +getTime[0];
}

const reverseTime = setInterval(() => {
  +secondValue--;
  if (secondValue == 0) {
    minuteValue--;
    secondValue = 60;
  }

  if (minuteValue == 0) {
    hourValue--;
    minuteValue = 60;
  }

  if (hourValue == 0) {
    dayValue--;
    hourValue = 24;
  }
  second.textContent = +secondValue < 10 ? `0` + +secondValue : +secondValue;
  minute.textContent = minuteValue < 10 ? `0` + minuteValue : minuteValue;
  hour.textContent = hourValue < 10 ? `0` + hourValue : hourValue;
  day.textContent = dayValue < 10 ? `0` + dayValue : dayValue;

  // set local stroge

  let presentTime = [
    day.textContent,
    hour.textContent,
    minute.textContent,
    second.textContent,
  ];
  // local stroge set time
  localStorage.setItem("preTime", JSON.stringify(presentTime));
}, 1000);

if (dayValue == 0) {
  clearInterval(reverseTime);
}

// close and open bar menu

const barMenu = document.querySelector(".header__bars_icon"),
  nav = document.querySelector(".nav");

barMenu.addEventListener("click", () => {
  nav.classList.toggle("show-fl");
});

document.addEventListener("click", (e) => {
  if (
    e.target.className == "header__container" ||
    e.target.className == "intro__container"
  ) {
    nav.classList.add("hide");
  }
});
