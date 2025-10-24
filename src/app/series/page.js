import {createClient} from "../../../utils/supabase/server";
import Link from "next/link";
import Image from "next/image";

const getSeriesReviews = async () => {
    const supabase = await createClient();
    const {data, error} = await supabase.from('reviews').select('*').order("created_at", {ascending: false}).eq('type', 'series');
    if (error) {
        throw new Error(error.message);
    }
    return data;
};

const SeriesReviewList = async () => {
    const reviews = await getSeriesReviews();

    console.log(reviews);

    return (
        <div className="min-h-screen font-mono p-8 relative">
            <Link
                href="/public"
                className="absolute top-4 left-4 text-base border border-gray-400 rounded px-4 py-2 hover:bg-gray-100 transition-colors"
            >
                home
            </Link>

            <div className="flex flex-col items-center justify-center min-h-screen text-lg w-full">
                <div className="text-3xl mb-8 font-semibold">
                    <p>series reviews</p>
                </div>

                <div className="overflow-x-auto w-full max-w-5xl">
                    <table className="min-w-full border border-gray-400 text-left rounded">
                        <thead className="bg-gray-100">
                        <tr>
                            <th className="border border-gray-300 px-4 py-2">Title</th>
                            <th className="border border-gray-300 px-4 py-2">Year</th>
                            <th className="border border-gray-300 px-4 py-2">Genre</th>
                            <th className="border border-gray-300 px-4 py-2">IMDB</th>
                            <th className="border border-gray-300 px-4 py-2">Big</th>
                            <th className="border border-gray-300 px-4 py-2">Tiny</th>
                            <th className="border border-gray-300 px-4 py-2">Average</th>
                        </tr>
                        </thead>
                        <tbody>
                        {reviews.length > 0 ? (
                            reviews.map((review) => (
                                <tr
                                    key={review.id}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    <td className="border border-gray-300 px-4 py-2 flex items-center gap-3">
                                        {review.poster_url && (
                                            <div className="relative w-10 h-14 flex-shrink-0">
                                                <Image
                                                    src={review.poster_url}
                                                    alt={`${review.title} poster`}
                                                    fill
                                                    className="object-cover rounded shadow-sm"
                                                    sizes="40px"
                                                />
                                            </div>
                                        )}
                                        <span className="font-medium">{review.title}</span>
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {review.year}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {review.genre}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {review.imdb_rating}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {review.big_rating}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {review.tiny_rating}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {review.avg_rating?.toFixed?.(1) || "-"}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="text-center border border-gray-300 px-4 py-6 text-gray-500"
                                >
                                    no reviews found
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                <div className="footer mt-8">
                    <ul className="flex gap-4 text-base">
                        <li>
                            <Link href="/all" className="hover:underline">all</Link>
                        </li>
                        <li>
                            <Link href="/movies" className="hover:underline">movies</Link>
                        </li>
                        <li>
                            <Link href="/series" className="hover:underline">series</Link>
                        </li>
                        <li>
                            <Link href="/games" className="hover:underline">games</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default SeriesReviewList;