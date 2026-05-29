export interface MovieFilters {
  lang?: 'pt-BR' | 'en';
  search?: string;
  generos?: number[];    // Array de IDs enviado como query param
  ano?: number;
  diretores?: number[];  // Array de IDs
  idioma?: string;       // Sigla do idioma (ex: 'en', 'es')
  destaque?: boolean;
  recentes?: boolean;
  bilheteria?: boolean;
  page?: number;         // Para o controle da paginação
}

export interface GeneroResponse {
  id: number;
  tmdb_is: number;
  nome_pt: string;
  nome_en: string;
}

export interface DiretorResponse {
  id: number;
  nome: string;
}

export interface Genero {
  id: number;
  nome: string;
}

export interface Diretor {
  id: number;
  nome: string;
}

export interface MovieIndexResponse {
  current_page: number;
  data: MovieIndex[];
  next_page_url: number;
  path: string;
  per_page: number;
  prev_page_url: number;
  to: number;
  total: number;
  last_page_url: string;
  from: number;
  last_page: number;
}

export interface MovieIndex {
  id?: number;
  tmdb_id?: number;
  imdb_id?: string;
  titulo_original?: string;
  titulo_br?: string;
  descricao_br?: string;
  tagline_br?: string;
  titulo_en?: string;
  descricao_en?: string;
  tagline_en?: string;
  rating?: number;
  duracao?: number;
  lingua_origem?: string;
  revenue?: number;
  popularity?: number;
  poster_thumb_br?: string;
  poster_thumb_us?: string;
  colecao_id?: number | null;
  slug_pt?: string;
  slug_en?: string;
  release_date?: string; // ISO Date String
  generos?: Genero[];
  diretores?: Diretor[];
}

export interface MoviePaginationResponse {
  current_page: number;
  data: MovieIndex[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface UpdateMovieRequest {
  tmdb_id: number;
  imdb_id?: string | null;
  titulo_original: string;
  titulo_br?: string | null;
  titulo_en?: string | null;
  descricao_br?: string | null;
  descricao_en: string;
  tagline_br?: string | null;
  tagline_en?: string | null;
  slug_pt?: string | null;
  slug_en: string;
  rating: number;
  duracao: number;
  lingua_origem: string; // ex: 'en', 'pt-BR'
  release_date: string | Date;
  homepage?: string | null;
  poster_path_br?: string | null;
  poster_thumb_br?: string | null;
  backdrop_path?: string | null;
  poster_path_us?: string | null;
  poster_thumb_us?: string | null;

  // Arrays (Geralmente enviados como IDs no Laravel)
  generos: string[];
  diretores?: number[];
  estudios?: number[];
  paises?: number[];

  revenue?: number | null;
  popularity?: number | null;

  // Objeto aninhado para Coleção
  colecao?: {
    nome: string;
    tmdb_id: number;
  } | null;
}

export interface Pivot {
  movie_id: number;
  genero_id?: number;
  diretor_id?: number;
  estudio_id?: number;
  pais_id?: number;
}

export interface Genero {
  id: number;
  tmdb_id: number;
  nome_pt: string;
  nome_en: string;
  pivot: Pivot;
}

export interface Diretor {
  id: number;
  nome: string;
  pivot: Pivot;
}

export interface Estudio {
  id: number;
  nome: string;
  pivot: Pivot;
}

export interface Pais {
  id: number;
  nome: string;
  pivot: Pivot;
}

export interface Colecao {
  id: number;
  tmdb_id: number;
  nome: string;
  poster_path: string;
  poster_thumb: string;
  backdrop_path: string;
}
export interface Movie {
  id: number;
  tmdb_id: number;
  imdb_id: string;
  titulo_original: string;
  titulo_br: string;
  descricao_br: string;
  tagline_br: string;
  titulo_en: string;
  descricao_en: string;
  tagline_en: string;
  rating: number;
  duracao: number;
  lingua_origem: string;
  revenue: number;
  popularity: number;
  poster_path_br: string;
  poster_thumb_br: string;
  backdrop_path: string;
  poster_path_us: string;
  poster_thumb_us: string;
  homepage: string;
  created_at: string;
  colecao_id: number | null;
  slug_pt: string;
  slug_en: string;
  release_date: string;
  status: string;
  // Relacionamentos
  generos: Genero[];
  diretores: Diretor[];
  estudios: Estudio[];
  paises: Pais[];
  colecao: Colecao | null;
}
export interface MovieDetail {
  movie: Movie
  collection: MovieCollection[] | undefined;
}

export interface MovieCollection {
  id: number;
  titulo_br: string;
  titulo_en: string;
  poster_thumb_br: string;
  rating: number;
  tmdb_id: number;
  slug_pt: string;
  slug_en: string;
}

export interface MovieUpdateRequest {
  tmdb_id: number;
  imdb_id?: string | null;
  titulo_original: string;
  titulo_br?: string | null;
  titulo_en?: string | null;
  descricao_br?: string | null;
  descricao_en: string;
  tagline_br?: string | null;
  tagline_en?: string | null;
  slug_pt?: string | null;
  slug_en: string;
  rating: number;
  duracao: number;
  lingua_origem: string; // ex: 'en', 'pt-BR'
  release_date: string | Date;
  homepage?: string | null;
  poster_path_br?: string | null;
  poster_thumb_br?: string | null;
  backdrop_path?: string | null;
  poster_path_us?: string | null;
  poster_thumb_us?: string | null;

  // Arrays (Geralmente enviados como IDs no Laravel)
  generos: number[];
  diretores?: number[];
  estudios?: number[];
  paises?: number[];

  revenue?: number | null;
  popularity?: number | null;

  // Objeto Coleção
  colecao?: {
    nome: string;
    tmdb_id: number;
    poster_path?: string,
    poster_thumb?: string,
    backdrop_path?: string,
  } | null;
}

export interface ApiResponse<T = any> {
  message: string;
  data?: T;
}


export interface DinamicMovieInsertionResponse {
  id: number;
  tmdb_id: number;
  message: string;
  temp_result: TempMovieResult;
  status: "importing" | string;
  poster_thumb_br: string;
  poster_thumb_us: string;
}

export interface TempMovieResult {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  title: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  softcore: boolean;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface FullMovieDetailsResponse {
  movie: {
    id: number;
    tmdb_id: number;
    imdb_id: string | null;

    titulo_original: string;
    titulo_br: string | null;
    titulo_en: string | null;

    descricao_br: string | null;
    descricao_en: string;

    tagline_br: string | null;
    tagline_en: string | null;

    rating: number;
    duracao: number;

    lingua_origem: string;

    revenue: number | null;
    popularity: number | null;

    poster_path_br: string | null;
    poster_thumb_br: string | null;

    backdrop_path: string | null;

    poster_path_us: string | null;
    poster_thumb_us: string | null;

    homepage: string | null;

    created_at: string;

    colecao_id: number | null;

    slug_pt: string | null;
    slug_en: string;

    release_date: string;

    status: 'processando' | 'processado';

    generos: {
      id: number;
      tmdb_id: number;

      nome_pt: string;
      nome_en: string;

      pivot: {
        movie_id: number;
        genero_id: number;
      };
    }[];

    diretores: {
      id: number;
      nome: string;

      pivot: {
        movie_id: number;
        diretor_id: number;
      };
    }[];

    estudios: {
      id: number;
      nome: string;

      pivot: {
        movie_id: number;
        estudio_id: number;
      };
    }[];

    paises: {
      id: number;
      nome: string;

      pivot: {
        movie_id: number;
        pais_id: number;
      };
    }[];

    colecao: {
      id?: number;

      nome?: string;

      poster_path?: string | null;
      poster_thumb?: string | null;
      backdrop_path?: string | null;
    } | null;
  };

  collection: {
    id?: number;

    nome?: string;

    poster_path?: string | null;
    poster_thumb?: string | null;
    backdrop_path?: string | null;
  }[];

  related: {
    id: number;

    titulo_br: string | null;
    titulo_original: string;

    poster_thumb_br: string | null;

    rating: number;

    slug_pt: string | null;
    slug_en: string;
  }[];

  lists: {
    id: number;

    titulo: string;
    comentario: string;

    user_id: number;

    slug: string;

    idioma: string;

    publica: boolean;

    movies: {
      id: number;

      poster_thumb_br: string | null;

      pivot: {
        list_id: number;
        movie_id: number;
        ordem: number;
      };
    }[];
  }[];

  reviews: {
    id: number;

    titulo: string;
    comentario: string;

    rating: number;

    user_id: number;
    movie_id: number;

    likes_count: number;
    is_liked: boolean;

    user: {
      id: number;
      name: string;
      avatar: string | null;
    };

    tags: {
      id: number;

      nome: string;

      tag: {
        review_id: number;
        tag_id: number;
      };
    }[];
  }[];
}





export interface MovieFullDetailsResponse {
  movie: MovieDetails;
  collection?: CollectionMovie[];
  related: RelatedMovie[];
  lists: MovieList[];
  reviews: Review[];
}

export interface MovieDetails {
  id: number;
  tmdb_id: number;
  imdb_id: string | null;

  titulo_original: string;
  titulo_br: string | null;
  titulo_en: string | null;

  descricao_br: string | null;
  descricao_en: string;

  tagline_br: string | null;
  tagline_en: string | null;

  rating: number;
  duracao: number;

  lingua_origem: string;

  revenue: number | null;
  popularity: number | null;

  poster_path_br: string | null;
  poster_thumb_br: string | null;

  backdrop_path: string | null;

  poster_path_us: string | null;
  poster_thumb_us: string | null;

  homepage: string | null;

  created_at: string;

  colecao_id: number | null;

  slug_pt: string | null;
  slug_en: string;

  release_date: string;

  status: 'processando' | 'processado';

  generos: Genero[];
  diretores: Diretor[];
  estudios: Estudio[];
  paises: Pais[];

  colecao: CollectionMovie | null;
}


export interface CollectionMovie {
  id?: number;
  titulo_br?: string;
  titulo_en?: string;
  titulo_original?: string;
  poster_thumb_br?: string | null;
  poster_thumb_us?: string | null;
  rating: number;
  slug_pt: number;
  slug_en: number;
}

export interface RelatedMovie {
  id: number;

  titulo_br: string | null;
  titulo_original: string;

  poster_thumb_br: string | null;

  rating: number;

  slug_pt: string | null;
  slug_en: string;
}

export interface MovieList {
  id: number;

  titulo: string;
  comentario: string;

  user_id: number;

  slug: string;

  idioma: string;

  publica: boolean;

  movies: MovieListItem[];
}

export interface MovieListItem {
  id: number;

  poster_thumb_br: string | null;

  pivot: {
    list_id: number;
    movie_id: number;
    ordem: number;
  };
}

export interface Review {
  id: number;

  titulo: string;
  comentario: string;

  rating: number;

  user_id: number;
  movie_id: number;

  likes_count: number;
  is_liked: boolean;

  user: ReviewUser;

  tags: ReviewTag[];
}

export interface ReviewUser {
  id: number;

  name: string;

  avatar: string | null;
}

export interface ReviewTag {
  id: number;

  nome: string;

  tag: {
    review_id: number;
    tag_id: number;
  };
}