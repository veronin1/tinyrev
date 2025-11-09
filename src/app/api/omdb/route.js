import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const imdbID = searchParams.get('i');
    const title = searchParams.get('t');
    const apiKey = process.env.OMDB_API_KEY;

    if (!apiKey) {
        return NextResponse.json({ error: 'OMDB API key not configured' }, { status: 500 });
    }

    if (!imdbID && !title) {
        return NextResponse.json({ error: 'Missing title or imdbID param' }, { status: 400 });
    }

    try {
        const params = new URLSearchParams({ apikey: apiKey });

        if (imdbID) params.append('i', imdbID);
        else params.append('t', title);

        const url = `https://www.omdbapi.com/?${params.toString()}`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.Response === 'False') {
            return NextResponse.json({ error: data.Error }, { status: 404 });
        }

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
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
