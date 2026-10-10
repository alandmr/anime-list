import AnimeList from "./js/AnimeList";

const animeContainer =
  document.querySelector("#anime-list");

const animeList =
  new AnimeList(animeContainer);

document
  .querySelector("#searchBtn")
  .addEventListener("click", () => {

    const search =
      document
        .querySelector("#searchInput")
        .value;

    animeList.init("naruto");
  });
