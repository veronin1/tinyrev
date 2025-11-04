'use client'

import {useState} from "react";
import Link from "next/link";
import {searchDatabase} from "../../utils/supabase/searchDatabase";

export default function Home() {
    const [query, setQuery] = useState("");

    async function handleSearch(e) {
        const q = e.target.value;
        setQuery(q);

        const searchResults = await searchDatabase(query);
    }

    return (
        <main className="flex flex-col items-center justify-center flex-1 px-6 py-20 text-center">
            <Link
                href="/login"
                className="absolute top-6 left-6 text-sm border border-neutral-300 rounded px-3 py-1.5 hover:bg-neutral-100 transition-colors"
            >
                login
            </Link>

            <h1 className="text-6xl font-semibold tracking-tight font-mono">
                tiny<span className="text-[var(--accent)]">rev</span>
            </h1>

            <input
                type="search"
                placeholder="search..."
                className="mt-8 border border-neutral-300 bg-white px-4 py-2 w-72 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
                id="search"
                value={query}
                onChange={handleSearch}
            />

            <ul className="flex gap-8 mt-10 text-sm uppercase text-neutral-600">
                {["all", "movies", "series", "games"].map((x) => (
                    <li key={x}>
                        <Link href={`/reviews/${x}`} className="hover:text-[var(--accent)]">
                            {x}
                        </Link>
                    </li>
                ))}
            </ul>
        </main>
    );
}
