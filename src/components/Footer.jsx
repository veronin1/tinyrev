import Link from "next/link";

export default function Footer() {
    return (
        <footer className="footer mt-8">
            <ul className="flex gap-4 text-base">
                <li>
                    <Link href="/reviews/all" className="hover:underline">all</Link>
                </li>
                <li>
                    <Link href="/reviews/movies" className="hover:underline">movies</Link>
                </li>
                <li>
                    <Link href="/reviews/series" className="hover:underline">series</Link>
                </li>
                <li>
                    <Link href="/reviews/games" className="hover:underline">games</Link>
                </li>
            </ul>
        </footer>
    )
}