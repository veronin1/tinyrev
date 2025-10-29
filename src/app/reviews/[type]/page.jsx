import Link from "next/link";
import { fetchReviews } from "../../../utils/supabase/fetchReviews";
import ReviewList from "../../../components/ReviewTable";
import Footer from "../../../components/Footer";

export default async function Reviews({ params }) {
    const { type } = params;

    const dbType =
        type === 'movies' ? 'movie' :
        type === 'series' ? 'series' :
        null;

    const reviews = await fetchReviews(dbType);

    return (
        <div className="min-h-screen font-mono p-8 relative">
            <Link
                href="/"
                className="absolute top-4 left-4 text-base border border-gray-400 rounded px-4 py-2 hover:bg-gray-100 transition-colors"
            >
                home
            </Link>

            <div className = "flex flex-col items-center justify-center min-h-screen text-lg w-full">
                <div className="text-3xl mb-8 font-semibold">
                    <p>{type} reviews</p>
                </div>
            </div>

            <ReviewList reviews={reviews} />

            <Footer />
        </div>
    )
}