import type { 
  MovieFilters, 
  MovieIndexResponse, 
  MovieDetail, 
  MovieFullDetailsResponse, 
  ApiResponse, 
  GeneroResponse, 
  DiretorResponse, 
  UpdateMovieRequest
} from '@/types/Movies';

export const useMovieStore = defineStore('movies', () => {
  // Chamado apenas UMA vez para a store inteira.
  const { $api } = useNuxtApp()

  // --- ACTIONS ---

  async function listMovies(search?: MovieFilters): Promise<MovieIndexResponse> {
    return await $api<MovieIndexResponse>("/movies", {
      query: search,
    })
  }

  async function detailMovie(movieIdSlug: string): Promise<MovieDetail> {
    return await $api<MovieDetail>(`/movies/${movieIdSlug}`)
  }

  async function fullDetailMovie(movieIdSlug: string): Promise<MovieFullDetailsResponse> {
    return await $api<MovieFullDetailsResponse>(`/movies/${movieIdSlug}/full-details`)
  }

  async function importSingleMovie(tmdbId: number): Promise<ApiResponse<{ tmdb_id: string }>> {
    return await $api<ApiResponse<{ tmdb_id: string }>>(`/admin/movies/single/${tmdbId}`, { 
      method: 'POST' 
    })
  }

  async function importBatchMovies(limit: number): Promise<ApiResponse> {
    return await $api<ApiResponse>(`/admin/movies/batch/${limit}`, { 
      method: 'POST' 
    })
  }

  async function updateManualMovie(movieData: UpdateMovieRequest): Promise<MovieDetail> {
    return await $api<MovieDetail>("/admin/movies/update", {
      method: 'POST',
      body: movieData
    })
  }

  async function deleteMovie(id: number): Promise<ApiResponse> {
    return await $api<ApiResponse>(`/admin/movies/delete/${id}`, { 
      method: 'DELETE' 
    })
  }

  async function listGenres(): Promise<GeneroResponse[]> {
    return await $api<GeneroResponse[]>("/movies/generos")
  }

  async function listDirectors(): Promise<DiretorResponse[]> {
    return await $api<DiretorResponse[]>("/movies/diretores")
  }

  async function listIdioms(): Promise<string[]> {
    return await $api<string[]>("/movies/idiomas")
  }

  // No padrão Setup, precisa RETORNAR as funções
  return {
    listMovies,
    detailMovie,
    fullDetailMovie,
    importSingleMovie,
    importBatchMovies,
    updateManualMovie,
    deleteMovie,
    listGenres,
    listDirectors,
    listIdioms
  }
})