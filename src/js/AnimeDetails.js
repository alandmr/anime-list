import AnimeData
  from "./AnimeData.js";

export default class AnimeDetails {
  constructor(id) {
    this.id = id;
    this.dataSource = new AnimeData();
  }

  async init() {
    const anime =
      await this.dataSource.getAnimeById(
        this.id
      );

    this.render(anime);
  }

  render(anime) {
    document.querySelector("#details")
      .innerHTML = `
      <h1>${anime.title}</h1>

      ${anime.images.jpg.image_url}

      <p>${anime.synopsis}</p>

      <p>
        Score: ${anime.score}
      </p>

      <p>
        Episodes: ${anime.episodes}
      </p>
    `;
  }
}