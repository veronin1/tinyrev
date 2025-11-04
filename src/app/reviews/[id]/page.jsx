import { fetchReviewById } from '../../../../utils/supabase/fetchReviewById';
import Link from 'next/link';

export default async function ReviewPage({ params }) {
    const review = await fetchReviewById(params.id);

    if (!review) return <p>Review not found</p>;

    return (
        <main>
            <Link href="/">home</Link>
            <h1>{review.title}</h1>
            <p>{review.genre}</p>
            <p>IMDB: {review.imdb_rating}</p>
            <p>Avg Rating: {review.avg_rating}</p>
        </main>
    );
}
