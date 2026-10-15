import AnimeData from "./AnimeData";

const baseURL = import.meta.env.VITE_SERVER_URL
let nextUrl = [];
let previousUrl = [];

export default class AnimeList {
  constructor(container) {
    this.container = container;
    this.dataSource = new AnimeData();
  }

  async init() {
    const loadMoreBtn = document.querySelector("#next");
    const previousBtn = document.querySelector("#previous"); 

    loadMoreBtn.style.display = "none";
    previousBtn.style.display = "none";

    const animes =
      await this.dataSource.initAnime();      
    this.renderList(animes,"2");
  }

  async searchAnime(searchType, searchValue) {
    const loadMoreBtn = document.querySelector("#next");
  
    
    const animes =
      await this.dataSource.searchAnime(
        searchType,
        searchValue        
      );
      nextUrl = animes.links?.next || null;


      if (nextUrl) {
        loadMoreBtn.style.display = "block";        
      }else{
        loadMoreBtn.style.display = "none";
      }


      console.log("Next URL 2 -->:", nextUrl);
      console.log("Previous URL 2 -->:", previousUrl);
      this.renderList(animes.data,"1");
  }

  async renderList(animes, searchType) {
    let animeList = [];
    
    if (searchType === "1") {
      animeList = animes;
    }else if (searchType === "2") {
      animeList = await Promise.all(
      animes.map(async (anime) => {
        const response = await fetch(
        `${baseURL}/anime/${anime.id}`
        );

        const animeData = await response.json();

        return animeData.data;
      })
      );
    }
    
    console.log("Lista de animes Render List-->:", animeList);

    this.container.innerHTML = animeList
      .filter(anime =>
        Number(anime.attributes.averageRating) >= 1)
      .map(anime => 
        `
        <article class="anime-card">
        <a href="./anime-details/index.html?id=${anime.id}">
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

  async loadAnime() {
     
    const loadMoreBtn = document.querySelector("#next");
    const previousBtn = document.querySelector("#previous"); 


    try {

      if (!nextUrl) {
        loadMoreBtn.style.display = "none";
        return;
      }

      const response = await fetch(nextUrl);
      const result = await response.json();

      

      this.renderList(result.data,"1");

      nextUrl = result.links?.next || null;
      previousUrl = result.links?.prev || null;


      if (!nextUrl) {
        loadMoreBtn.textContent = "No hay más resultados";
        loadMoreBtn.disabled = true;
      }

      if (!previousUrl) {
        previousBtn.style.display = "none";
      }

      if (previousUrl) {
        console.log("Entro Luego PRebios");
        previousBtn.style.display = "inline-block";
        previousBtn.textContent = "Previous";
        previousBtn.disabled = false
      }

    } catch (error) {
      console.error(error);
    }
  }

    async prevAnime() {
     
    const previousBtn = document.querySelector("#previous"); 
    const loadMoreBtn = document.querySelector("#next");

    try {

      if (!previousUrl) {
        previousBtn.style.display = "none";
        return;
      }

      const response = await fetch(previousUrl);
      const result = await response.json();

      this.renderList(result.data,"1");

      nextUrl = result.links?.next || null;
      previousUrl = result.links?.prev || null;

      if (!previousUrl) {
        previousBtn.style.display = "none";
        previousBtn.textContent = "No hay más resultados";
        previousBtn.disabled = true;
      }

      if (previousUrl) {
        previousBtn.style.display = "inline-block";
      }

      if (nextUrl) {
        console.log("Entro Luego PRebios");
        loadMoreBtn.style.display = "inline-block";
        loadMoreBtn.textContent = "next";
        loadMoreBtn.disabled = false
      }

    } catch (error) {
      console.error(error);
    }
  }

}


