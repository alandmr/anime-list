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

  renderList(animes) {
    this.container.innerHTML =
      animes
        .map(
          anime => `
            <article>
              <h1>${anime.attributes.canonicalTitle}</h1>
              <img
                src="${anime.attributes.coverImage.small}"
                alt="${Object.values(anime.attributes.titles)[0]}" 
              >
              
            </article>
          `
        )
        .join("");
  }
}