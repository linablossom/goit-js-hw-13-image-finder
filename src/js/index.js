import { getImages } from "./apiService";
import photoTpl from "../tpl/photo";
import debounce from "lodash.debounce";
import { error, defaultModules } from "@pnotify/core";
import "@pnotify/core/dist/BrightTheme.css";
import * as PNotifyDesktop from "@pnotify/desktop";
import { START_PAGE, PER_PAGE } from "./config";
defaultModules.set(PNotifyDesktop, {});

const formEl = document.querySelector("#search-form");
const inputEl = formEl.querySelector("input");
const galleryEl = document.querySelector(".gallery");
const loadBtnEl = document.querySelector("#load-btn");
const INPUT_DELAY = 2000;
let currentPage = START_PAGE;
let maxPage = null;

formEl.addEventListener("submit", onSubmit);
loadBtnEl.addEventListener("click", loadMore);

function onSearch() {
  clearGallery();
  currentPage = START_PAGE;
  loadImages();
}

async function loadImages() {
  try {
    const keyword = inputEl.value.trim().replace(" ", "+");
    if (!keyword) return;
    const { total, totalHits, hits } = await getImages(keyword, currentPage);
    maxPage = Math.ceil(Math.min(total, totalHits) / PER_PAGE);
    renderPhotos(hits);
    toggleLoadMore();
  } catch (error) {
    console.log(error);
    clearGallery();
  }
}

function onSubmit(e) {
  e.preventDefault();
  onSearch();
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

async function loadMore() {
  currentPage += 1;
  await loadImages();
  galleryEl.lastElementChild.scrollIntoView({
    behavior: "smooth",
    block: "end",
  });
}

function toggleLoadMore() {
  if (maxPage === null || maxPage >= currentPage) {
    loadBtnEl.classList.remove("hidden");
  } else {
    loadBtnEl.classList.add("hidden");
  }
}
