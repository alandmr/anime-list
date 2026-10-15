import AnimeList from "./AnimeList";
console.log("1-->",import.meta.env);
console.log("2-->",import.meta.env.VITE_SERVER_URL);

console.log("3-->",import.meta.env);
console.log("4-->",import.meta.env.VITE_TEST);

const animeContainer =
  document.querySelector("#anime-list");

const animeList =
  new AnimeList(animeContainer);
  animeList.init();

const menuBtn = document.querySelector("#menu-toggle");
const navLinks = document.querySelector("#nav-links");

menuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("show");
});

const searchToggle = document.getElementById("searchToggle");
const dropdown = document.getElementById("searchDropdown");


searchToggle.addEventListener("click", (e) => {
  e.stopPropagation();
  dropdown.classList.toggle("hidden");
});

dropdown.addEventListener("click", (e) => {
  e.stopPropagation();
});

document.addEventListener("click", () => {
  dropdown.classList.add("hidden");
});


const searchBtn = document.getElementById("searchBtn");

searchBtn.addEventListener("click", () => {  
  const searchValue =
    document.getElementById("searchInput").value;

  const searchType =
    document.querySelector(
      'input[name="searchType"]:checked'
    ).value;

  console.log(searchType);
  console.log(searchValue);

  animeList.searchAnime(searchType, searchValue);

});

const loadMoreBtn = document.querySelector("#next");
loadMoreBtn.addEventListener("click", animeList.loadAnime.bind(animeList));

const previousBtn = document.querySelector("#previous");
previousBtn.addEventListener("click", animeList.prevAnime.bind(animeList));

