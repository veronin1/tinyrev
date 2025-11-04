import Image from "next/image";
import Link from "next/link";

export default function ReviewTable({ reviews }) {
    if (!reviews?.length) {
        return (
            <div className="overflow-x-auto w-full max-w-5xl">
                <table className="w-full border border-neutral-300 text-sm">
                    <tbody>
                    <tr>
                        <td
                            colSpan={7}
                            className="text-center border border-neutral-300 px-6 py-10 text-neutral-500"
                        >
                            no reviews found
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto w-full max-w-5xl">
            <table className="w-full border-collapse border border-neutral-200 text-sm">
                <thead className="bg-neutral-100 text-neutral-600 text-xs tracking-wide">
                <tr>
                    {["title", "year", "genre", "imdb", "big", "tiny", "avg"].map((h) => (
                        <th
                            key={h}
                            className="border border-neutral-200 px-3 py-2 text-left font-medium"
                        >
                            {h}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody className="bg-white text-neutral-800">
                {reviews.map((r) => (
                    <tr
                        key={r.id}
                        className="hover:bg-neutral-50 transition-colors"
                    >
                        <td className="border border-neutral-200 px-3 py-2">
                            <div className="flex items-center gap-3">
                                {r.poster_url && (
                                    <div className="relative w-8 h-12 flex-shrink-0 overflow-hidden rounded-sm border border-neutral-200">
                                        <Link href={`/reviews/${r.id}`}>
                                            <Image
                                                src={r.poster_url}
                                                alt={`${r.title} poster`}
                                                fill
                                                className="object-cover"
                                                sizes="40px"
                                            />
                                        </Link>
                                    </div>
                                )}
                                <Link
                                    href={`/reviews/${r.id}`}
                                    className="font-normal hover:text-[var(--accent)] transition"
                                >
                                    {r.title}
                                </Link>
                            </div>
                        </td>
                        <td className="border border-neutral-200 px-3 py-2">{r.year}</td>
                        <td className="border border-neutral-200 px-3 py-2">{r.genre}</td>
                        <td className="border border-neutral-200 px-3 py-2">{r.imdb_rating}</td>
                        <td className="border border-neutral-200 px-3 py-2">{r.big_rating}</td>
                        <td className="border border-neutral-200 px-3 py-2">{r.tiny_rating}</td>
                        <td className="border border-neutral-200 px-3 py-2">
                            {r.avg_rating?.toFixed?.(1) || "-"}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
