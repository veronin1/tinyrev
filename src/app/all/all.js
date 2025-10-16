const getMovie = async(query) => {
    const apiKey = process.env.OMDB_API_KEY;
    const params = {
        apikey: apiKey,
        s: query,
    };

    const res = await fetch(`https://www.omdbapi.com/?${new URLSearchParams(params)}`);

    if (!res.ok) {
        throw new Error(`${res.statusText}`);
    }

    res.json();
}

const Inception = await getMovie('Inception');

const MovieList = async () => {
    const movies = await getMovie();
    return (
        <ul>
            {Inception}
        </ul>
    )
}