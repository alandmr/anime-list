import loadHeaderFooter from "./utils.mjs";

document.addEventListener("DOMContentLoaded", async () => {

  await loadHeaderFooter();
  const menuBtn = document.querySelector("#menu-toggle");
  const navLinks = document.querySelector("#nav-links");

  menuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("show");
});
  
});


class TraceMoeData {
  constructor() {
    this.baseURL = import.meta.env.VITE_SERVER_URL_TRACE_MOE;
  }

  async searchByImage(imageUrl) {
    try {
      const response = await fetch(
        `${this.baseURL}/search?url=${encodeURIComponent(imageUrl)}`
      );

      if (!response.ok) {
        throw new Error("Error al consultar Trace.moe");
      }

      const data = await response.json();

      return data.result;
    } catch (error) {
      console.error(error);
      return [];
    }
  }


  async searchByFile(file) {
    try {
      const response = await fetch(
        `${this.baseURL}/search`,
        {
          method: "POST",
          body: file
        }
      );

      if (!response.ok) {
        throw new Error("Error uploading image");
      }

      const data = await response.json();

      return data.result;
    } catch (error) {
      console.error(error);
      return [];
    }
  }
}


const traceApi = new TraceMoeData();

const searchBtn = document.querySelector("#search-btn");
const imageInput = document.querySelector("#image-url");
const fileInput = document.querySelector("#image-file");

const matchesContainer =
  document.querySelector("#matches-container");

const animeDetails =
  document.querySelector("#anime-details");

const sceneVideo =
  document.querySelector("#scene-video");

searchBtn.addEventListener(
  "click",
  async () => {

    matchesContainer.innerHTML =
      "<p>Searching...</p>";

    animeDetails.innerHTML = "";

    sceneVideo.src = "";

    let results = [];

    const file =
      fileInput?.files[0];

    const imageUrl =
      imageInput?.value.trim();

    if (file) {

      results =
        await traceApi.searchByFile(file);

    }
    else if (imageUrl) {

      results =
        await traceApi.searchByImage(
          imageUrl
        );

    }
    else {

      alert(
        "Select an image or enter a URL."
      );

      return;

    }

    if (!results.length) {

      matchesContainer.innerHTML =
        "<p>No results found.</p>";

      return;

    }

    renderMatches(results);

    loadAnime(results[0]);

  }
);

async function loadAnime(traceResult) {
  const animeInfo =
    await getAnimeInfo(traceResult.anilist);

  if (!animeInfo) return;

  sceneVideo.src = traceResult.video;

  renderAnimeInfo(
    animeInfo,
    traceResult
  );
}

function renderMatches(results) {
  matchesContainer.innerHTML = "";

  results.forEach((anime, index) => {
    const card =
      document.createElement("div");

    card.classList.add("match-card");

    if (index === 0) {
      card.classList.add("active");
    }

    card.innerHTML = `
      <img
        src="${anime.image}"
        alt="preview"
      >

      <div class="match-info">

        <h4>
          Match #${index + 1}
        </h4>

        <p>
          Episode ${anime.episode ?? "?"}
        </p>

        <span>
          ${(anime.similarity * 100).toFixed(2)}%
        </span>

      </div>
    `;

    card.addEventListener("click", () => {

      document
        .querySelectorAll(".match-card")
        .forEach(card =>
          card.classList.remove("active")
        );

      card.classList.add("active");

      loadAnime(anime);

    });

    matchesContainer.appendChild(card);
  });
}

async function getAnimeInfo(anilistId) {

  const query = `
  query ($id: Int) {
    Media(id: $id, type: ANIME) {
      title {
        romaji
        english
      }

      coverImage {
        large
      }

      description

      averageScore

      genres
    }
  }`;

  try {

    const response = await fetch(
      "https://graphql.anilist.co",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json"
        },
        body: JSON.stringify({
          query,
          variables: {
            id: anilistId
          }
        })
      }
    );

    const data =
      await response.json();

    return data.data.Media;

  } catch (error) {

    console.error(error);

    return null;

  }
}

function renderAnimeInfo(
  animeInfo,
  traceResult
) {

  const title =
    animeInfo.title.english ||
    animeInfo.title.romaji;

  const time =
    `${Math.floor(traceResult.from / 60)}m ${Math.floor(traceResult.from % 60)}s`;

  animeDetails.innerHTML = `
  
    <img
      class="anime-cover"
      src="${animeInfo.coverImage.large}"
      alt="${title}"
    >

    <div class="anime-info">

      <h1>${title}</h1>

      <div class="info-badges">

        <span>
          ⭐ ${animeInfo.averageScore || "N/A"}
        </span>

        <span>
          🎬 Episode ${traceResult.episode || "?"}
        </span>

        <span>
          🎯 ${(traceResult.similarity * 100).toFixed(2)}%
        </span>

        <span>
          ⏱️ ${time}
        </span>

      </div>

      <div class="genres">

        ${animeInfo.genres
          .map(
            genre =>
              `<span class="genre-tag">${genre}</span>`
          )
          .join("")}

      </div>

      <h3>Description</h3>

      <p>
        ${
          animeInfo.description
            ? animeInfo.description.replace(
                /<[^>]*>/g,
                ""
              )
            : "No description available."
        }
      </p>

    </div>
  `;
}