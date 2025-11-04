import Link from "next/link";
import { fetchReviewById } from "../../../../utils/supabase/fetchReviewById";
import Footer from "../../../components/Footer";

export default async function ReviewPage({ params }) {
    const { id } = await params;
    const review = await fetchReviewById(id);

    if (!review) {
        return (
            <main className="flex flex-col items-center flex-1 px-6 py-12 bg-neutral-50 text-neutral-900">
                <Link
                    href="/"
                    className="absolute top-6 left-6 text-sm border border-neutral-300 rounded px-3 py-1.5 hover:bg-neutral-100 transition-colors"
                >
                    home
                </Link>
                <h1 className="text-3xl font-semibold mb-8 font-mono">Review not found</h1>
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

            <h1 className="text-3xl font-semibold mb-4 font-mono">{review.title}</h1>
            <p className="mb-2">Genre: {review.genre}</p>
            <p className="mb-2">IMDB Rating: {review.imdb_rating}</p>
            <p className="mb-4">Average Rating: {review.avg_rating}</p>
            <img src={review.poster_url} alt={review.title} className="mb-6 rounded-lg max-w-xs" />

            <Footer />
        </main>
    );
}
