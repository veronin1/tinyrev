'use client'
import {supabase} from '../../../utils/supabase/client'
import {useState} from "react";
import Link from "next/link";

export async function addReview({type, title, biggerRating, smallerRating, season}) {
    const {data: {session}, error: sessionError} = await supabase.auth.getSession();

    if (sessionError || !session) {
        throw new Error("Session not found");
    }

    console.log('User ID:', session.user.id);
    console.log('Session:', session);

    let seasonNumber = null;
    if (type === 'series' && season) {
        if (!season) {
            throw new Error("Season is required for series");
        }
        seasonNumber = parseInt(season, 10);
        if (isNaN(seasonNumber) || seasonNumber < 1 || seasonNumber > 100) {
            throw new Error("Invalid season number");
        }
    }

    const movie = await getMovieDetailsByTitleOrId(title, seasonNumber);

    const yearValue = parseInt(movie.year?.slice(0, 4)) || null;

    const {data, error} = await supabase
        .from("reviews")
        .insert([{
            user_id: session.user.id,
            type,
            title: movie.title,
            year: yearValue,
            genre: movie.genre,
            poster_url: movie.poster,
            imdbid: movie.imdbID,
            imdb_rating: movie.imdbRating,
            big_rating: biggerRating,
            tiny_rating: smallerRating,
            season: seasonNumber,
        }]);

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

const getMovieDetailsByTitleOrId = async (input, season = null) => {
    input = input.trim();
    if (!input) throw new Error("Title or IMDB ID is required");

    let url;

    // check if input is an IMDB ID through regex
    if (/^tt\d+$/i.test(input)) {
        const params = new URLSearchParams({ i: input });
        if (season) params.append('season', season);
        url = `/api/omdb?${params.toString()}`;
    } else {
        // title search
        url = `/api/omdb?title=${encodeURIComponent(input)}`;
    }

    const res = await fetch(url);
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || res.statusText);
    }

    const data = await res.json();
    if (data.error) throw new Error(data.error);

    // normalise API response
    if (data.movies && data.movies.length > 0) {
        const first = data.movies[0];
        return {
            title: first.Title || first.title,
            year: first.Year || first.year,
            imdbID: first.imdbID,
            poster: first.Poster || first.poster,
            genre: first.Genre || first.genre || "",
            imdbRating: first.imdbRating || ""
        };
    }

    return {
        title: data.Title || data.title,
        year: data.Year || data.year,
        imdbID: data.imdbID,
        poster: data.Poster || data.poster,
        genre: data.Genre || data.genre || "",
        imdbRating: data.imdbRating || ""
    };
};



export default function Admin() {
    const [fetchedTitle, setFetchedTitle] = useState("");
    const [selectedType, setSelectedType] = useState("");

    const handleTitleBlur = async (e) => {
        const titleInput = e.target.value;
        if (!titleInput) {
            setFetchedTitle("");
            return;
        }

        try {
            const movie = await getMovieDetailsByTitleOrId(titleInput);
            setFetchedTitle(movie.title);
        } catch (error) {
            console.error(error);
            setFetchedTitle("");
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData(e.target);
            const type = formData.get('type');
            const title = formData.get('title');
            const biggerRating = formData.get('big_rating');
            const smallerRating = formData.get('small_rating');
            const season = formData.get('season');

            await addReview({type, title, biggerRating, smallerRating, season});
            alert('Review added successfully');
            e.target.reset();
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    const getSelectedType = (e) => {
        setSelectedType(e.target.value);
    };

    async function handleSignOut() {
        try {
            await supabase.auth.signOut();
            console.log('User signed out successfully');
        } catch (error) {
            console.error('Error signing out:', error);
        }

        window.location.href = '/';
    }

    return (
        <main className="flex flex-col items-center flex-1 px-6 py-12 bg-neutral-50 text-neutral-900 font-mono min-h-screen">
            <Link
                href="/"
                className="absolute top-6 left-6 text-sm border border-neutral-300 rounded px-3 py-1.5 hover:bg-neutral-100 transition-colors"
            >
                home
            </Link>

            <button
                onClick={handleSignOut}
                className="absolute top-6 right-6 text-sm border border-neutral-300 rounded px-3 py-1.5 hover:bg-neutral-100 transition-colors"
            >
                sign out
            </button>

            <h1 className="text-3xl font-semibold mb-8">tiny<span className="text-[var(--accent)]">rev</span> admin</h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
                <div className="flex flex-col">
                    <label htmlFor="type" className="mb-1 font-semibold">review type *</label>
                    <select
                        id="type"
                        name="type"
                        required
                        className="border border-neutral-300 rounded p-2 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                        onChange={getSelectedType}
                    >
                        <option value="">select type</option>
                        <option value="movie">movie</option>
                        <option value="series">series</option>
                        <option value="game">game</option>
                    </select>
                </div>

                <div className="flex flex-col">
                    <label htmlFor="title" className="mb-1 font-semibold">title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        required
                        placeholder="enter title"
                        className="border border-neutral-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                        onBlur={handleTitleBlur}
                    />
                    {fetchedTitle && (
                        <p className="text-sm text-neutral-600 mt-1 normal-case">Matched {selectedType}: {fetchedTitle}</p>
                    )}
                </div>

                {selectedType === 'series' && (
                    <div className="flex flex-col">
                        <label htmlFor="season" className="mb-1 font-semibold">season</label>
                        <input
                            type="number"
                            id="season"
                            name="season"
                            min="1"
                            max="100"
                            required
                            defaultValue="1"
                            className="border border-neutral-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                        />
                    </div>
                )}

                <div className="flex flex-col">
                    <label htmlFor="big_rating" className="mb-1 font-semibold">bigger rating</label>
                    <input
                        type="number"
                        id="big_rating"
                        name="big_rating"
                        min="0.1"
                        max="10"
                        step="0.1"
                        required
                        placeholder="0.0"
                        className="border border-neutral-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="small_rating" className="mb-1 font-semibold">tiny rating</label>
                    <input
                        type="number"
                        id="small_rating"
                        name="small_rating"
                        min="0.1"
                        max="10"
                        step="0.1"
                        required
                        placeholder="0.0"
                        className="border border-neutral-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    />
                </div>

                <button
                    type="submit"
                    className="bg-black text-white rounded p-3 mt-4 hover:bg-gray-800 transition-colors font-semibold"
                >
                    add review
                </button>
            </form>
        </main>
    );
}
