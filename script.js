let allCasesData = 0;
let prevLocation = 0;
const searchInput = document.getElementById("search-textbox");
const table = document.getElementById("GlobalData");
const specificData = document.getElementById("table");
const previousBtn = document.querySelector(".previou-btn i");
const allDataPage = document.querySelector("main");
const tablePage = document.querySelector(".section-country-wise");
const nameOfCountey = document.querySelector(".code-title--sec--1");
tablePage.classList.toggle("section-country-wise--deactive");
allDataPage.classList.toggle("main-deactive");
const listItem = document.getElementsByClassName("country__item");

const getData = async () => {
  try {
    const result = await fetch(
      "https://pomber.github.io/covid19/timeseries.json"
    );
    const data = await result.json();

    allDataPage.classList.toggle("main-deactive");
    allCasesData = data;
    for (country in data) {
      const html = getUIString(country);
      table.insertAdjacentHTML("beforeend", html);
    }
  } catch (err) {
    document.body.innerHTML = `<div class="not-found">
                                <h1>Something went wrong try again later</h1>
                              </div>`;
  } finally {
    document.querySelector(".loader").remove();
  }
};

const getTotal = (data, cityName) => {
  const lastIndex = data[cityName].length - 1;
  return {
    confirmed: data[cityName][lastIndex].confirmed,
    deaths: data[cityName][lastIndex].deaths,
    recover: data[cityName][lastIndex].recovered,
  };
};

const getUIString = (country) => {
  const totalCases = getTotal(allCasesData, country);


  return ` <div class="country__item" data-country="${country}">
                                    <span class="code-title--sec--fullName" style="display:none">${country}</span>
                                    <h1 class="country__name">${getModifiedCountryName(
                                      country
                                    )}</h1>
                                    <div class="country__item__data">
                                        <div class="country__item__data__item">
                                            <h1 class="country__text-1">${
                                              totalCases.confirmed
                                            }</h1>
                                            <h1 class="country__text-1">Confirmed</h1>
                                        </div>
                                        <div class="country__item__data__item">
                                            <h1 class="country__text-1">${
                                              totalCases.deaths
                                            }</h1>
                                            <h1 class="country__text-1">Deaths</h1>
                                        </div>
                                        <div class="country__item__data__item">
                                            <h1 class="country__text-1">${
                                              totalCases.recover
                                            }</h1>
                                            <h1 class="country__text-1">Recovered</h1>
                                        </div>
                                        <span class="country__name--full">India</span>
                                    </div>
                </div>`;
};

searchInput.addEventListener("keyup", function (event) {
  event.preventDefault();
  search(searchInput.value);
});

function search(country) {
  let results = "";
  let regexp = new RegExp("^" + country.toLowerCase() + ".*$");
  for (x in allCasesData) {
    if (x.toLowerCase().match(regexp)) {
      results += getUIString(x);
    }
  }
  table.innerHTML = results;
}

const getDataSpecificData = (cityName) => {

  prevLocation = window.scrollY;

  window.scroll({
    top: 0,
    left: 0,
    behavior: "smooth",
  });

  allDataPage.classList.toggle("main-deactive");
  tablePage.classList.toggle("section-country-wise--deactive");
  nameOfCountey.innerHTML = cityName;
  const totalCases = getTotal(allCasesData, cityName);
  document.getElementById("innerPageToatalAlys--confirm").innerHTML =
    totalCases.confirmed;
  document.getElementById("innerPageToatalAlys--deaths").innerHTML =
    totalCases.deaths;
  document.getElementById("innerPageToatalAlys--recover").innerHTML =
    totalCases.recover;

  specificData.innerHTML = `
                                <div class="specfic-List__grid">
                                <div class="specfic-List__item">Date &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                                <div class="specfic-List__item">Confirmed</div>
                                <div class="specfic-List__item">Deaths</div>
                                <div class="specfic-List__item">Recovered</div>
                            </div>
                        `;

  for (x of allCasesData[cityName]) {
    specificData.innerHTML += `  <div class="specfic-List__grid">
                                        <div class="specfic-List__item">${getDate(
                                          x.date
                                        )}</div>
                                        <div class="specfic-List__item">${
                                          x.confirmed
                                        }</div>
                                        <div class="specfic-List__item">${
                                          x.deaths
                                        }</div>
                                        <div class="specfic-List__item">${
                                          x.recovered
                                        }</div>
                                        </div>
                                        `;
  }
};

const getModifiedCountryName = (str) => {
  let cityName = str;
  if (str.length > 12) cityName = str.slice(0, 12);
  return cityName + "..";
};

const getDate = (date) => {
  const d = new Date(date);
  const dtf = new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
  const [{ value: mo }, , { value: da }, , { value: ye }] = dtf.formatToParts(
    d
  );
  return "" + da + "-" + mo + "-" + ye;
};

previousBtn.addEventListener("click", () => {
  allDataPage.classList.toggle("main-deactive");
  tablePage.classList.toggle("section-country-wise--deactive");
  window.scroll({
    top: prevLocation,
    left: 0,
    behavior: "smooth",
  });
});


table.addEventListener('click',(event)=>{
  
  const target = event.target.closest('.country__item');
  if(target){
      getDataSpecificData(target.getAttribute('data-country'))
  }
})

getData();
