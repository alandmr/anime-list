// const baseURL = import.meta.env.VITE_SERVER_URL
// console.log(import.meta.env);

export default class AnimeData {
  constructor() {
    this.baseURL = import.meta.env.VITE_SERVER_URL;
  }

  async searchAnime(query) {
    try {
      // const response = await fetch(
      //   `${this.baseURL}/anime?filter[text]=${query}}`
      // );
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
}