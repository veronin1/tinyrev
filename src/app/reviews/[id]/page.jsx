import Link from "next/link";
import { fetchReviewById } from "../../../../utils/supabase/fetchReviewById";
import Footer from "../../../components/Footer";

export default async function ReviewPage({ params }) {
    const { id } = await params;
    const review = await fetchReviewById(id);

    if (!review) {
        return (
            <main className="flex flex-col items-center justify-center flex-1 px-6 py-12 bg-neutral-50 text-neutral-900">
                <Link
                    href="/"
                    className="absolute top-6 left-6 text-sm border border-neutral-300 rounded px-3 py-1.5 hover:bg-neutral-100 transition-colors"
                >
                    home
                </Link>
                <h1 className="text-3xl font-semibold mb-8 font-mono text-red-600 animate-pulse">
                    Review not found
                </h1>
            </main>
        );
    }

    return (
        <main className="flex flex-col items-center flex-1 px-6 py-12 bg-neutral-50 text-neutral-900">
            <Link
                href="/"
                className="absolute top-6 left-6 text-sm border border-neutral-300 rounded px-3 py-1.5 hover:bg-neutral-100 transition-colors"
            >
                home
            </Link>

            <div className="flex flex-col items-center bg-white shadow-lg rounded-xl p-6 max-w-md w-full border border-neutral-200 normal-case">
                <img
                    src={review.poster_url}
                    alt={review.title}
                    className="mb-6 rounded-lg shadow-md w-full object-cover"
                />

                <h1 className="text-3xl font-semibold mb-4 font-mono text-[var(--accent)] text-center">
                    {review.type === "series"
                        ? `${review.title} (Season ${review.season})`
                        : review.title}
                </h1>

                <div className="grid grid-cols-2 gap-4 w-full mb-4">
                    <p className="font-semibold">Year:</p>
                    <p className="text-right">{review.year}</p>

                    <p className="font-semibold">Genre:</p>
                    <p className="text-right">{review.genre}</p>

                    {review.type !== "series" && (
                        <>
                            <p className="font-semibold">IMDB Rating:</p>
                            <p className="text-right">{review.imdb_rating}</p>
                        </>
                    )}

                    <p className="font-semibold">Big Rating:</p>
                    <p className="text-right text-[var(--accent)] font-semibold">{review.big_rating}</p>

                    <p className="font-semibold">Tiny Rating:</p>
                    <p className="text-right text-pink-300 font-semibold">{review.tiny_rating}</p>

                    <p className="font-semibold">Average Rating:</p>
                    <p className="text-right font-bold bg-gradient-to-r from-[var(--accent)] via-[var(--accent)] to-pink-300 bg-clip-text text-transparent inline-block">
                        {review.avg_rating}
                    </p>


                </div>


                <Footer />
            </div>
        </main>
    );
}
