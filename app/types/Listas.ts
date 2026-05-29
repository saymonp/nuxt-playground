export interface ListaFilters {
    search?: string
    tags?: string[]
    orderBy?: string
    user_only?: boolean;
    top_listas?: boolean;
    curadorias?: boolean;
    mais_ativas?: boolean;
    page?: number;
    idioma?: string; // 'en', 'es'
    filterValue?: number;
}

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
    slug: string;
    google_id: string | null;
    avatar: string | null;
    created_at: string;
    updated_at: string;
}

export interface Tag {
    id: number;
    nome: string;
    pivot: {
        list_id: number;
        tag_id: number;
    };
}

export interface Movie {
    id: number;
    tmdb_id: number;
    titulo_original: string;
    titulo_br: string;
    titulo_en: string;
    rating: number;
    poster_thumb_br: string;
    poster_thumb_us: string;
    slug_pt: string;
    slug_en: string;
    pivot: {
        list_id: number;
        movie_id: number;
        ordem: number;
    };
}

export interface ListaResponse {
    message: string;
    data: Lista;
}

export interface Lista {
    id: number;
    titulo: string;
    comentario: string;
    slug: string;
    user_id: number;
    likes_count: number;
    is_liked: boolean;
    publica: boolean;
    user: User;
    tags: Tag[];
    movies: Movie[];
}

export interface MovieListItem {
    id: number;
    poster_thumb_br: string;
    poster_thumb_us: string;
    pivot: {
        list_id: number;
        movie_id: number;
        ordem: number;
    };
}

export interface ListaSummary {
    id: number;
    titulo: string;
    comentario: string;
    user_id: number;
    likes_count: number;
    slug: string;
    is_default: boolean;
    tags: Tag[];
    movies: MovieListItem[];
}

export interface ListaPaginada {
    current_page: number;
    data: ListaSummary[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

export interface MovieCreateInput {
    id: number;
    tmdb_id?: number;
}

export interface CreateLista {
    titulo: string;
    comentario: string;
    tags: string[];
    idioma: 'pt' | 'en'; // Tipagem estrita para os idiomas suportados
    slug: string;
    publica: boolean;
    movies: MovieCreateLista[];
}
interface MovieCreateLista {
    id: number;
    poster_thumb_br: string;
}

export interface UpdateLista {
    titulo?: string;
    comentario?: string;
    tags?: string[];
    publica?: boolean;
    movies?: number[];
}

export interface ApiResponse<T = any> {
    message: string;
    data?: T;
}

export interface LikeResponse {
    message: string;
    is_liked: boolean;
    likes_count: number;
}

export interface MovieDirectorPivot {
    movie_id: number;
    diretor_id: number;
}

export interface MovieDirector {
    id: number;
    nome: string;
    pivot: MovieDirectorPivot;
}

export interface MovieWithDirectors {
    id: number;
    tmdb_id?: number;
    titulo_original: string;
    titulo_br?: string;
    titulo_en?: string;
    rating?: number;
    year?: string;
    slug_pt?: string;
    slug_en?: string;
    is_importing: boolean;
    release_date?: string;
    poster_thumb_br?: string;
    poster_thumb_us?: string;
    diretores?: MovieDirector[];
}

export interface ListasUser {
    id: number;
    titulo: string;
    slug: string;
    is_default: boolean;
    movie_exists: boolean;

}
export interface ToggleResponse {
    message: string;
    attached: boolean;

}

export interface ToggleData {
    lista_id: number;
    movie_id: number;
}