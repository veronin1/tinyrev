import {createClient} from "./server";

export const searchDatabase = async (query) => {
    const supabase = await createClient();

    const {data, error} = await supabase.from('reviews').select('*').ilike('title', `%${query}%`);

    if (error) {
        throw new Error(error.message);
    }

    return data;
}