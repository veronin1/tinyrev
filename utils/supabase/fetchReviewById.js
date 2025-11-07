import {supabase} from "./client";

export const fetchReviewById = async (id) => {
    const {data, error} = await supabase
        .from('reviews')
        .select('id, title, genre, imdb_rating, big_rating, tiny_rating, avg_rating, poster_url, year, created_at, type, season')
        .eq('id', id)
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
};