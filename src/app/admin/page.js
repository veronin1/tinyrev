'use client'
import { createClient} from "@supabase/supabase-js";


export async function addReview() {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    const { data: reviews, error } = await supabase.from();
}

const searchOMDB = async (query) => {
    const apiKey = process.env.OMDB_API_KEY;
    const params = {
        apikey: apiKey,
        s: query,
    };

    const res = await fetch(`https://www.omdbapi.com/?${new URLSearchParams(params)}`);

    if (!res.ok) {
        throw new Error(`${res.statusText}`);
    }

    return res.json();
}



export default function Admin() {
    const handleSubmit = async (e) => {
        e.preventDefault();
        await addReview();
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen font-mono p-8">
            <div className="text-3xl mb-8">
                <p>tinyrev admin</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-2xl text-lg">
                <div className="flex flex-col">
                    <label htmlFor="type" className="mb-2 font-semibold">review type *</label>
                    <select
                        id="type"
                        name="type"
                        required
                        className="border border-gray-300 rounded p-2 bg-white"
                    >
                        <option value="">select type</option>
                        <option value="movie">movie</option>
                        <option value="series">series</option>
                        <option value="game">game</option>
                    </select>
                </div>

                <div className="flex flex-col">
                    <label htmlFor="title" className="mb-2 font-semibold">title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        required
                        placeholder="enter title"
                        className="border border-gray-300 rounded p-2"
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="rating" className="mb-2 font-semibold">bigger rating</label>
                    <input
                        type="number"
                        id="rating"
                        name="rating"
                        min="1"
                        max="10"
                        step="0.1"
                        required
                        placeholder="0.0"
                        className="border border-gray-300 rounded p-2"
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="rating" className="mb-2 font-semibold">tiny rating</label>
                    <input
                        type="number"
                        id="rating"
                        name="rating"
                        min="1"
                        max="10"
                        step="0.1"
                        required
                        placeholder="0.0"
                        className="border border-gray-300 rounded p-2"
                    />
                </div>

                <button
                    type="submit"
                    className="bg-black text-white rounded p-3 mt-4 hover:bg-gray-800 transition-colors font-semibold"
                >
                    add review
                </button>
            </form>
        </div>
    );
}
