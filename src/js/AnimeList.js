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
              <img
                src="${anime.images.jpg.image_url}"
                alt="${anime.title }" 
              </p>
            </article>
          `
        )
        .join("");
  }
}