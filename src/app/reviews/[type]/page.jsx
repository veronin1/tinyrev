import Link from "next/link";
import { fetchReviews } from "../../../../utils/supabase/fetchReviews";
import ReviewTable from "../../../components/ReviewTable";
import Footer from "../../../components/Footer";

export default async function Reviews({ params }) {
    const { type } = params;
    const dbType =
        type === "movies" ? "movie" :
            type === "series" ? "series" : null;
    const reviews = await fetchReviews(dbType);

    return (
        <main className="flex flex-col items-center flex-1 px-6 py-12 bg-neutral-50 text-neutral-900">
            <Link
                href="/"
                className="self-start mb-6 text-sm border border-neutral-300 px-3 py-1 rounded-md hover:bg-neutral-100 transition"
            >
                home
            </Link>

            <h1 className="text-3xl font-semibold mb-8 font-mono">
                {type === "all" ? "all reviews" : `${type} reviews`}
            </h1>

            <ReviewTable reviews={reviews} />
            <Footer />
        </main>
    );
}
