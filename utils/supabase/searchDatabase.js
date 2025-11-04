import {supabase} from "./client";

export const searchDatabase = async (query) => {
    const {data, error} = await supabase
        .from('reviews')
        .select('id, title, genre, imdb_rating, big_rating, tiny_rating, avg_rating, poster_url, year, created_at, type')
        .ilike('title', `%${query}%`);

    if (error) {
        throw new Error(error.message);
    }

    return data;
}