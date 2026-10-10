export default class AnimeData {
  constructor() {
    this.baseURL = "https://kitsu.io/api/edge";
  }

  async searchAnime(query) {
    try {
      const response = await fetch(
        `${this.baseURL}/anime?filter[text]=naruto}`
      );

      if (!response.ok) {
        throw new Error(  
          `HTTP Error: ${response.status}`
        );
      }

      const result = await response.json();
      console.log("Respuesta Servidor:",result.data)

      return result.data;
    } catch (error) {
      console.error("Error al obtener anime:", error);
    }
  }
}