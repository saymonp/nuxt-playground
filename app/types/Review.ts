import type { Movie } from "./Movies";

export interface ReviewFilters {
    movie_id?: number;
    search?: string;
    rating?: number;
}

export interface ReviewPaginada {
    current_page: number;
    data: ReviewSummary[];
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

export interface ReviewSummary {
    id: number;
    titulo: string; // Título da Review
    comentario: string;
    rating: number;
    user_id: number;
    movie_id: number;
    likes_count: number;
    is_liked: boolean;
    tags: Tag[];
    user: { id: number, name: string, avatar: string };
    movie: {
        id: number;
        poster_thumb_br: string;
        poster_thumb_us: string;
        titulo_original: string;
        titulo_br: string;
        titulo_en: string;
    }
}

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
    slug: string;
    google_id: number;
    avatar: string;
    created_at: string;
    updated_at: string;
}

export interface Tag {
    id: number,
    nome: string,
    tag: {
        review_id: number,
        tag_id: number;
    }
}

export interface Review {
    id: number,
    titulo: string;
    comentario: string;
    rating: number;
    user_id: number;
    movie_id: number;
    likes_count: number;
    is_liked: boolean;
    user:{ id: number, name: string, avatar: string };
    tags: Tag[];
    movie: {
        id: number;
        poster_thumb_br: string;
        poster_thumb_us: string;
        titulo_original: string;
        titulo_br: string;
        titulo_en: string;
    }
}

export interface CreateReview {
    titulo: string;
    comentario: string;
    rating: number;
    tags: string[];
}

export interface UpdateReview {
    titulo?: string;
    comentario?: string;
    rating?: number;
    tags?: string[];
}

export interface LikeResponse {
    message: string;
    is_liked: boolean;
    likes_count: number;
}

export interface ApiResponse<T = any> {
    message: string;
    data?: T;
    status?: number;
}