import {supabase} from "./client";

export const searchDatabase = async (query) => {
    const {data, error} = await supabase.from('reviews').select('*').ilike('title', `%${query}%`);

    if (error) {
        throw new Error(error.message);
    }

    return data;
}