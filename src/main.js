import AnimeList from "./js/AnimeList";

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
