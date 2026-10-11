// const baseURL = import.meta.env.VITE_SERVER_URL
// console.log(import.meta.env);

export default class AnimeData {
  constructor() {
    this.baseURL = import.meta.env.VITE_SERVER_URL;
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