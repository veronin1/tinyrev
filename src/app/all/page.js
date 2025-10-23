import { createClient } from "../../../utils/supabase/server";
const getAllReviews = async () => {
    const supabase = await createClient();
    const {data, error} = await supabase.from('reviews').select('*');
    if (error) {
        throw new Error(error.message);
    }
    return data;
};

const MovieList = async () => {
    const reviews = await getAllReviews();

    console.log(reviews);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">All Reviews</h1>
            <table className="min-w-full border border-gray-300 text-left">
                <thead className="bg-gray-100">
                <tr>
                    <th className="border px-4 py-2">Title</th>
                    <th className="border px-4 py-2">Year</th>
                    <th className="border px-4 py-2">Genre</th>
                    <th className="border px-4 py-2">IMDB</th>
                    <th className="border px-4 py-2">Big</th>
                    <th className="border px-4 py-2">Tiny</th>
                    <th className="border px-4 py-2">Avg</th>
                </tr>
                </thead>
                <tbody>
                {reviews.map((review) => (
                    <tr key={review.id} className="hover:bg-gray-50">
                        <td className="border px-4 py-2">{review.title}</td>
                        <td className="border px-4 py-2">{review.year}</td>
                        <td className="border px-4 py-2">{review.genre}</td>
                        <td className="border px-4 py-2">{review.imdb_rating}</td>
                        <td className="border px-4 py-2">{review.big_rating}</td>
                        <td className="border px-4 py-2">{review.tiny_rating}</td>
                        <td className="border px-4 py-2">{review.avg_rating}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default MovieList;