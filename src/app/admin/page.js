'use client'
import {supabase} from '../../../utils/supabase/client'
import {useState} from "react";
import Link from "next/link";

export const signOut = async () => {
    await supabase.auth.signOut();
}

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

const searchOMDB = async (query) => {
    const res = await fetch(`/api/omdb?title=${encodeURIComponent(query)}`);

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || res.statusText);
    }

    const data = await res.json();

    if (data.error === "Too many results.") {
        throw new Error("Too many results. Refine search.");
    }

    return data.movies;
};

const getMovieDetails = async (imdbID) => {
    const res = await fetch(`/api/omdb?imdbID=${encodeURIComponent(imdbID)}`);

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || res.statusText);
    }

    return await res.json();
};

const getMovieDetailsByTitleOrId = async (input, season = null) => {
    input = input.trim();

    let imdbID;
    const isImdbId = /^tt\d+$/i.test(input);

    if (isImdbId) {
        imdbID = input;
    } else {
        const movies = await searchOMDB(input);
        if (!movies || movies.length === 0) {
            throw new Error("Movie not found");
        }
        imdbID = movies[0].imdbID;
    }

    const params = new URLSearchParams({apikey: process.env.NEXT_PUBLIC_OMDB_API_KEY, i: imdbID});
    if (season) {
        params.append('Season', season);
    }

    const res = await fetch(`/api/omdb?${params.toString()}`);
    const data = await res.json();

    if (data.Response === "False") {
        throw new Error(data.Error);
    }

    return data;
}

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

    return (
        <div className="min-h-screen font-mono p-8 relative">
            <Link href="/"
                  className="absolute top-4 left-4 text-base border border-gray-400 rounded px-4 py-2 hover:bg-gray-100 transition-colors">
                home
            </Link>

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
                            onChange={getSelectedType}
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
                            onBlur={handleTitleBlur}
                        />
                        {fetchedTitle && (
                            <p className="text-sm text-gray-600 mt-1">Matched {selectedType}: {fetchedTitle}</p>
                        )}
                    </div>

                    {selectedType === 'series' && (
                        <div className="flex flex-col">
                            <label htmlFor="season" className="mb-2 font-semibold">season</label>
                            <input
                                type="number"
                                id="season"
                                name="season"
                                min="1"
                                max="100"
                                required
                                placeholder="1"
                                defaultValue="1"
                                className="border border-gray-300 rounded p-2"
                            />
                        </div>
                    )}

                    <div className="flex flex-col">
                        <label htmlFor="rating" className="mb-2 font-semibold">bigger rating</label>
                        <input
                            type="number"
                            id="big_rating"
                            name="big_rating"
                            min="0.1"
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
                            id="small_rating"
                            name="small_rating"
                            min="0.1"
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
        </div>
    );
}
