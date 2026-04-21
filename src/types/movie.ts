export interface Movie {
    id: string;
    title: string;
    description: string;
    duration: number | null;
    genre: string;
    poster: string;
    price: number;
    status: 'NOW_SHOWING' | 'COMING_SOON';
    releaseDate: string; // ISO string hoặc LocalDate
}

export interface MovieRequest {
    title: string;
    description: string;
    duration: number | null;
    genre: string;
    poster: string;
    price: number;
    status: 'NOW_SHOWING' | 'COMING_SOON';
    releaseDate: string;
}
