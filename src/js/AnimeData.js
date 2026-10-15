
export default class AnimeData {
  constructor() {
    this.baseURL = import.meta.env.VITE_SERVER_URL;
  }

  async getAnimeById(id) {
    try {
      const response = await fetch(
        `${this.baseURL}/anime/${id}`
      );

      const data = await response.json();

      return data.data;
    } catch (error) {
      console.error("Error obteniendo anime:", error);
    }
  }

  async getAnimeGenres(id) {
    try {
      const response = await fetch(
        `${this.baseURL}/anime/${id}/categories`
      );

      const data = await response.json();

      return data.data;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

    async getAnimeCharacters(id) {
  try {
    const response = await fetch(
      `${this.baseURL}/anime/${id}/characters`
    );

    const data = await response.json();
    console.log("Characters data:", data.data);
    
    return data.data || [];
  } catch (error) {
    console.error("Error obteniendo personajes:", error);
    return [];
  }
}
  


  async initAnime() {
    try {

      console.log("Base URL:", this.baseURL);
      console.log(import.meta.env);
      const randomCategory = Math.floor(Math.random() * 93) + 1;
      const response = await fetch(
        `${this.baseURL}/categories/${randomCategory}`
      );

      if (!response.ok) {
        throw new Error(  
          `HTTP Error: ${response.status}`
        );
      }

      const result = await response.json();

      // Obtenemos la lista de todos los animes según la categoría y sus respectivos IDs
      const categoryResponse = await fetch(result.data.relationships.anime.links.self);
      console.log("Respuesta Category Response:",categoryResponse); 

      if (!categoryResponse.ok) {
        throw new Error(  
          `HTTP Error: ${categoryResponse.status}`
        );
      }

      const categoryResult = await categoryResponse.json();
      console.log("Respuesta Servidor:",categoryResult.data); 
      

      return categoryResult.data;
    } catch (error) {
      console.error("Error al obtener anime:", error);
    }
  }

    async searchAnime(type, query) {
    try {
      let response = null;
      let searchResult = null;   
     
      if (type === "genres") {
        response = await fetch(
          `${this.baseURL}/anime?filter[genres]=${query}&page[number]=1&page[size]=20`
        );
      }else if (type === "category") {
        response = await fetch(
          `${this.baseURL}/anime?filter[categories]=${query}&page[number]=1&page[size]=20`
        );
      }else if (type === "anime") {        
        response = await fetch(
          `${this.baseURL}/anime?filter[text]=${query}&page[number]=1&page[size]=20`
        );
      }else if (type === "type") {
        response = await fetch(
          `${this.baseURL}/anime?filter[subtype]=${query}&page[number]=1&page[size]=20`
        );
      }else if (type === "status") {
        response = await fetch(
          `${this.baseURL}/anime?filter[status]=${query}&page[number]=1&page[size]=20`
        );
      }
      
      if (!response.ok) {
        throw new Error(  
          `HTTP Error: ${response.status}`
        );
      }

      
      searchResult = await response.json();
      console.log("Respuesta Servidor, Search Anime:",searchResult);
      
      return searchResult;
    } catch (error) {
      console.error("Error al obtener anime:", error);
    }
  }

  
}