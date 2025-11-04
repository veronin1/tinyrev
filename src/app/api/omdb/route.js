import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title');
    const imdbID = searchParams.get('imdbID');

    const apiKey = process.env.OMDB_API_KEY;

    if (!apiKey) {
        return NextResponse.json({ error: 'OMDB API key not configured' }, { status: 500 });
    }

    try {
        if (imdbID) {
            const season = searchParams.get('season');
            const params = new URLSearchParams({
                apikey: apiKey,
                i: imdbID,
                ...(season ? { Season: season } : {})
            });

            const res = await fetch(`https://www.omdbapi.com/?${params}`);
            const data = await res.json();

            if (data.Response === "False") {
                return NextResponse.json({ error: data.Error }, { status: 404 });
            }

            return NextResponse.json({
                title: data.Title,
                year: data.Year,
                genre: data.Genre,
                poster: data.Poster,
                imdbRating: data.imdbRating,
                imdbID: data.imdbID,
                season: season ? parseInt(season, 10) : null,
            });
        } else if (title) {
            const params = new URLSearchParams({
                apikey: apiKey,
                s: title,
            });

            const res = await fetch(`https://www.omdbapi.com/?${params}`);
            const data = await res.json();

            if (data.Response === "False") {
                return NextResponse.json({ error: data.Error }, { status: 404 });
            }

            return NextResponse.json({ movies: data.Search });
        } else {
            return NextResponse.json({ error: 'Missing title/imdbID param' }, { status: 400 });
        }
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}