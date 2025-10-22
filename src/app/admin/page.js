'use client'
import { supabase } from '../../../utils/supabase/client'

export const signOut = async() => {
    await supabase.auth.signOut();
}

export async function addReview({ type, title, biggerRating, smallerRating }) {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
        throw new Error("Session not found");
    }

    console.log('User ID:', session.user.id);
    console.log('Session:', session);

    const movie = await getMovieDetailsByTitle(title);

    const { data, error } = await supabase
        .from("reviews")
        .insert({
            user_id: session.user.id,
            type: type,
            title: title,
            year: movie.year,
            genre: movie.genre,
            poster_url: movie.poster,
            imdbid: movie.imdbID,
            imdb_rating: movie.imdbRating,
            my_rating: biggerRating,
            wife_rating: smallerRating,
        })

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

const searchOMDB = async (query) => {
    const res = await fetch(`/api/omdb?title=${encodeURIComponent(query)}`);

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || res.statusText);
    }

    const data = await res.json();
    return data.movies;
};

const getMovieDetails = async (imdbID) => {
    const res = await fetch(`/api/omdb?imdbID=${encodeURIComponent(imdbID)}`);

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || res.statusText);
    }

    const data = await res.json();
    return data;
};

const getMovieDetailsByTitle = async (title) => {
    const movies = await searchOMDB(title);
    if (!movies || movies.length === 0) {
        throw new Error("Movie not found");
    }

    const movie = movies[0];
    return getMovieDetails(movie.imdbID);
}

export default function Admin() {
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData(e.target);
            const type = formData.get('type');
            const title = formData.get('title');
            const biggerRating = formData.get('bigger-rating');
            const smallerRating = formData.get('smaller-rating');

            await addReview({type, title, biggerRating, smallerRating});
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
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
                        id="bigger-rating"
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
                        id="smaller-rating"
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
