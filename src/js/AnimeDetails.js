import AnimeData from "./AnimeData";

export default class AnimeDetails {
  constructor(id) {
    this.id = id;
    this.dataSource = new AnimeData();
  }



    async init() {
        const anime = await this.dataSource.getAnimeById(this.id);

        const genres = await this.dataSource.getAnimeGenres(this.id);

        const characters = await this.dataSource.getAnimeCharacters(this.id);
        
        this.renderAnime(anime, genres, characters);
    }

    

  async renderAnime(anime, genres, characters) {
    const template =
      document.querySelector("#anime-template");

    const clone =
      template.content.cloneNode(true);

    const charactersContainer =
  clone.querySelector(".characters-grid");

for (const character of characters.slice(0, 4)) {

  const relatedUrl =
    character.relationships?.character?.links?.related;

  if (!relatedUrl) {
    console.log("Personaje sin relación:", character);
    continue;
  }

  const characterData =
    await this.getCharacter(relatedUrl);

  const imageUrl =
    characterData?.attributes?.image?.original ||
    "https://placehold.co/100x100";

  const characterCard =
    document.createElement("div");

  characterCard.classList.add("character");

  characterCard.innerHTML = `
    <img
      src="${imageUrl}"
      alt="${characterData.attributes.name}"
    >
    <p>${characterData.attributes.name}</p>
  `;

  charactersContainer.appendChild(characterCard);
}

    // BANNER

    clone.querySelector(".banner-img").src =
      anime.attributes.coverImage?.large ||
      anime.attributes.posterImage.large;

    // POSTER

    clone.querySelector(".anime-poster").src =
      anime.attributes.posterImage.large;

    clone.querySelector(".anime-poster").alt =
      anime.attributes.canonicalTitle;

    // TITULO

    clone.querySelector(".anime-title").textContent =
      anime.attributes.canonicalTitle;

    // RATING

    clone.querySelector(".anime-rating").textContent =
      `${anime.attributes.averageRating || "N/A"}% Community Approval`;

    // DESCRIPCION

    clone.querySelector(".anime-description").textContent =
      anime.attributes.synopsis;

    // DETALLES

    clone.querySelector(".anime-type").textContent =
      anime.attributes.showType || "N/A";

    clone.querySelector(".anime-episodes").textContent =
      anime.attributes.episodeCount || "N/A";

    clone.querySelector(".anime-status").textContent =
      anime.attributes.status || "N/A";

    clone.querySelector(".anime-score").textContent =
      anime.attributes.averageRating || "N/A";

    clone.querySelector(".anime-date").textContent =
      anime.attributes.startDate || "N/A";

    // GENEROS

    const genresContainer =
      clone.querySelector(".anime-genres");

    genres.forEach((genre) => {

      const span =
        document.createElement("span");

      span.classList.add("genre-tag");

      span.textContent =
        genre.attributes.title;

      genresContainer.appendChild(span);
    });

    // ESTADISTICAS

    const stats =
      clone.querySelectorAll(".stat-card");

    if (stats[0]) {
      stats[0].innerHTML =
        `❤️ Popularity: #${anime.attributes.popularityRank || "N/A"}`;
    }

    if (stats[1]) {
      stats[1].innerHTML =
        `⭐ Rating: #${anime.attributes.ratingRank || "N/A"}`;
    }

    // FAVORITOS

    const favoriteBtn =
      clone.querySelector(".btn-library");

    favoriteBtn.addEventListener(
      "click",
      () => this.addToFavorites(anime)
    );

    document
      .querySelector("#anime-details-container")
      .appendChild(clone);
  }

  addToFavorites(anime) {

    const favorites =
      JSON.parse(
        localStorage.getItem("favorites")
      ) || [];

    const exists =
      favorites.find(
        item => item.id === anime.id
      );

    if (exists) {
      alert("Este anime ya existe en favoritos.");
      return;
    }

    favorites.push({
      id: anime.id,
      title: anime.attributes.canonicalTitle,
      poster:
        anime.attributes.posterImage.small,
    });

    localStorage.setItem(
      "favorites",
      JSON.stringify(favorites)
    );

    alert("Anime agregado a favoritos.");
  }

    async getCharacter(query) {
        try {
            const response = await fetch(`${query}`);
            const data = await response.json();

            return data.data || [];

        }catch (error) {
        console.error("Error obteniendo personajes:", error);
        return [];
        }

    }
}

const animeId =
  new URLSearchParams(window.location.search)
    .get("id");

if (animeId) {
  const details = new AnimeDetails(animeId);
  details.init();

}

