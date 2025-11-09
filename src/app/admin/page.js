'use client'
import {supabase} from '../../../utils/supabase/client'
import {useState} from "react";
import Link from "next/link";

export async function addReview({type, title, biggerRating, smallerRating, season}) {
    const {data: {session}, error: sessionError} = await supabase.auth.getSession();

    if (sessionError || !session) {
        throw new Error("Session not found");
    }

    console.log('Starting addReview with:', { type, title, biggerRating, smallerRating, season });

    let reviewData;

    if (type === 'movie' || type === 'series') {
        let seasonNumber = (type === 'series') ? Number(season) || 1 : null;

        console.log('Fetching movie details for:', title);
        const movie = await getMovieDetailsByTitleOrId(title, seasonNumber);
        console.log('Movie data fetched:', movie);

        reviewData = {
            user_id: session.user.id,
            type,
            title: movie.title,
            year: parseInt(movie.year?.slice(0, 4)) || null,
            genre: movie.genre,
            poster_url: movie.poster,
            imdbid: movie.imdbID,
            imdb_rating: parseFloat(movie.imdbRating) || null,
            big_rating: biggerRating,
            tiny_rating: smallerRating,
            season: seasonNumber,
        };
    } else if (type === 'game') {
        reviewData = {
            user_id: session.user.id,
            type,
            title: title,
            year: null,
            genre: null,
            poster_url: null,
            imdbid: null,
            imdb_rating: null,
            big_rating: biggerRating,
            tiny_rating: smallerRating,
            season: null,
        };
    } else {
        throw new Error("Invalid review type specified");
    }

    console.log('Inserting data:', reviewData);

    const { data, error } = await supabase
        .from("reviews")
        .insert([reviewData])
        .select();

    if (error) {
        console.error('Supabase insert error:', error);
        throw new Error(error.message);
    }

    console.log('Insert successful:', data);
    return data;
}

const getMovieDetailsByTitleOrId = async (input) => {
    input = input.trim();
    if (!input) throw new Error("Title or IMDB ID is required");

    try {
        const params = new URLSearchParams();

        if (/^tt\d+$/i.test(input)) {
            params.append('i', input);
        } else {
            params.append('t', input);
        }

        const url = `/api/omdb?${params.toString()}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`API error: ${res.status}`);

        const data = await res.json();
        if (data.error) throw new Error(data.error);
        if (!data.movies || !data.movies[0]) throw new Error("No movie found with that title or ID");

        const movie = data.movies[0];
        return {
            title: movie.Title || movie.title,
            year: movie.Year || movie.year,
            imdbID: movie.imdbID,
            poster: movie.Poster || movie.poster,
            genre: movie.Genre || movie.genre || "",
            imdbRating: movie.imdbRating || ""
        };
    } catch (error) {
        console.error('Error fetching movie details:', error);
        throw new Error(`Failed to fetch movie details: ${error.message}`);
    }
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

        if (selectedType === 'movie' || selectedType === 'series') {
            try {
                const movie = await getMovieDetailsByTitleOrId(titleInput, null);
                setFetchedTitle(movie.title);
            } catch (error) {
                console.error("Blur fetch error:", error.message);
                setFetchedTitle("Not found - check title");
            }
        } else {
            setFetchedTitle("");
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData(e.target);
            const type = formData.get('type');
            const title = formData.get('title');

            // Convert string to float, fallback to null
            const biggerRating = parseFloat(formData.get('big_rating')) || null;
            const smallerRating = parseFloat(formData.get('small_rating')) || null;

            let seasonNumber = null;
            if (type === 'series') {
                const seasonInput = formData.get('season');
                seasonNumber = parseInt(seasonInput, 10) || 1; // default 1
                if (seasonNumber < 1 || seasonNumber > 100) {
                    alert("Invalid season number");
                    return;
                }
            }

            await addReview({
                type,
                title,
                biggerRating,
                smallerRating,
                season: seasonNumber
            });

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
