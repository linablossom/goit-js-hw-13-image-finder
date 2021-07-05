import { getImages } from "./apiService";
import photoTpl from "../tpl/photo";
import debounce from "lodash.debounce";
import { error, defaultModules } from "@pnotify/core";
import "@pnotify/core/dist/BrightTheme.css";
import * as PNotifyDesktop from "@pnotify/desktop";
import { START_PAGE } from "./config";
defaultModules.set(PNotifyDesktop, {});

const formEl = document.querySelector("#search-form");
const inputEl = formEl.querySelector("input");
const galleryEl = document.querySelector(".gallery");
const loadBtnEl = document.querySelector("#load-btn");
const INPUT_DELAY = 2000;
const onInputChange = debounce(loadImages, INPUT_DELAY);
let currentPage = START_PAGE;
let maxPage = null;

formEl.addEventListener("submit", onSubmit);
inputEl.addEventListener("input", onInputChange);
loadBtnEl.addEventListener("click", loadMore);

async function loadImages() {
  try {
    clearGallery();
    const keyword = inputEl.value.trim().replace(" ", "+");
    if (!keyword) return;
    const { total, totalHits, hits } = await getImages(keyword);
    currentPage = START_PAGE;
    maxPage = Math.min(total, totalHits) / PER_PAGE;
    renderPhotos(hits);
    toggleLoadMore();
  } catch (error) {
    clearGallery();
  }
}

function onSubmit(e) {
  e.preventDefault();
  loadImages();
}

function renderPhotos(photos) {
  const html = photos.map(photoTpl).join("");
  galleryEl.innerHTML += html;
}

function clearGallery() {
  galleryEl.innerHTML = "";
  currentPage = START_PAGE;
  maxPage = null;
}

async function loadMore() {}

function toggleLoadMore() {
  // loadBtnEl.classList.("hidden");
}

// const countryEl = document.querySelector("#country");

// const renderResults = (countries) => {
//   if (countries.length > 10) {
//     error({
//       text: "Too many matches found. Please, enter a more specific query!",
//       delay: 3000,
//     });
//     countryEl.innerHTML = "";
//   } else if (countries.length > 1) {
//     countryEl.innerHTML = countriesListTpl(countries);
//   } else if (countries.length === 1) {
//     countryEl.innerHTML = countriesTpl(countries[0]);
//   } else {
//     countryEl.innerHTML = "";
//   }
// };

// const loadCountries = (str) => {
//   if (str === "") {
//     countryEl.innerHTML = "";
//     return;
//   }
//   fetchCountries(str)
//     .then(renderResults)
//     .catch(() => {
//       error({
//         text: "Cannot load countries!",
//         delay: 3000,
//       });
//       countryEl.innerHTML = "";
//     });
// };

// const onInputChange = debounce((e) => {
//   localStorage.setItem("country", e.target.value);
//   loadCountries(e.target.value);
// }, 500);

// const initSearch = () => {
//   const searchedStr = localStorage.getItem("country");
//   if (!searchedStr) return;
//   loadCountries(searchedStr);
//   inputEl.value = searchedStr;
// };

// initSearch();

// inputEl.addEventListener("input", onInputChange);
