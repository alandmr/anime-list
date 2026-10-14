import AnimeData from "./AnimeData";

export default class AnimeList {
  constructor(container) {
    this.container = container;
    this.dataSource = new AnimeData();
  }

  async init(searchTerm) {
    const animes =
      await this.dataSource.searchAnime(searchTerm);

    this.renderList(animes);
  }

  async renderList(animes) {
    const animeList = await Promise.all(
      animes.map(async (anime) => {
        const response = await fetch(
        `https://kitsu.io/api/edge/anime/${anime.id}`
        );

        const animeData = await response.json();

        return animeData.data;
      })
    );

    console.log("Lista de animes:", animeList);

    // Para tipo de busqueda personalizada
    // https://kitsu.io/api/edge/anime?filter[genres]=action

    this.container.innerHTML = animeList
      .filter(anime =>
        Number(anime.attributes.averageRating) >= 70)
      .map(anime => `
        <article class="anime-card">
        <img
          src="${anime.attributes.posterImage?.small || anime.attributes.coverImage?.small || ''}"
          alt="${Object.values(anime.attributes.titles || {})[0] || 'Anime'}"
        >

        <div class="anime-info">
          <h2>${anime.attributes.canonicalTitle}</h2>

          <div class="anime-details">
            <p>⭐ ${anime.attributes.averageRating || 'N/A'}</p>
            <p>🔞 ${anime.attributes.ageRating || 'N/A'}</p>
            <p>🎬 ${anime.attributes.episodeCount || '?'}</p>
          </div>
        </div>
      </article>
      `)
      .join("");
      ``
  }

  
  // renderCategories(animes) {
  //   const categories = animes.attributes.anime.links.self;
  //   console.log("Categorías:", categories);
  // }

}


