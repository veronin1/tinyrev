import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title');
    const imdbID = searchParams.get('imdbID') || searchParams.get('i');
    const season = searchParams.get('season');
    const apiKey = process.env.OMDB_API_KEY;

    if (!apiKey) {
        return NextResponse.json({ error: 'OMDB API key not configured' }, { status: 500 });
    }

    try {
        let url;
        const params = new URLSearchParams({ apikey: apiKey });

        if (imdbID) {
            params.append('i', imdbID);
            if (season) params.append('Season', season);
            url = `https://www.omdbapi.com/?${params}`;
        } else if (title) {
            params.append('s', title);
            url = `https://www.omdbapi.com/?${params}`;
        } else {
            return NextResponse.json({ error: 'Missing title or imdbID param' }, { status: 400 });
        }

        const res = await fetch(url);
        const data = await res.json();

        if (data.Response === 'False') {
            return NextResponse.json({ error: data.Error }, { status: 404 });
        }

        if (data.Search) {
            return NextResponse.json({ movies: data.Search });
        } else {
            return NextResponse.json({
                movies: [
                    {
                        Title: data.Title,
                        Year: data.Year,
                        Genre: data.Genre,
                        Poster: data.Poster,
                        imdbRating: data.imdbRating,
                        imdbID: data.imdbID,
                    },
                ],
            });
        }
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
