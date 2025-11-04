import Link from "next/link";

export default function Footer() {
    return (
        <footer className="mt-12 mb-6 text-neutral-500 text-xs uppercase tracking-wide">
            <ul className="flex gap-8 justify-center">
                {["all", "movies", "series", "games"].map((x) => (
                    <li key={x}>
                        <Link
                            href={`/reviews/${x}`}
                            className="hover:text-[var(--accent)] transition"
                        >
                            {x}
                        </Link>
                    </li>
                ))}
            </ul>
        </footer>
    );
}
