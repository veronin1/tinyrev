import Image from "next/image";

export default function ReviewTable({ reviews }) {
    if (!reviews?.length) {
        return (
            <table className="min-w-full border border-gray-400 text-left rounded">
                <tbody>
                <tr>
                    <td
                        colSpan={7}
                        className="text-center border border-gray-300 px-4 py-6 text-gray-500"
                    >
                        no reviews found
                    </td>
                </tr>
                </tbody>
            </table>
        );
    }

    return (
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
                {reviews.map((review) => (
                    <tr key={review.id} className="hover:bg-gray-50 transition-colors">
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
                ))}
                </tbody>
            </table>
        </div>
    );
}
