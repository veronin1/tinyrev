import {createClient} from "./server";

export const fetchReviews = async (type = null) => {
    const supabase = await createClient();

    let query = supabase
        .from('reviews')
        .select('id, title, genre, imdb_rating, big_rating, tiny_rating, avg_rating, poster_url, year, created_at, type')
        .order('created_at', {ascending: false});

    if (type) query = query.eq('type', type);

    const {data, error} = await query;

    if (error) {
        throw new Error(error.message);
    }

    return data;
};