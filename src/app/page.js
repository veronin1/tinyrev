import Link from "next/link";

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen font-mono text-3xl">
            <Link
                href="/login"
                className="absolute top-4 left-4 text-base border border-gray-400 rounded px-4 py-2 hover:bg-gray-100 transition-colors"
            >
                login
            </Link>

            <div className="flex flex-col items-center justify-center min-h-screen font-mono text-3xl">
                <div>
                    <Link href="/">tinyrev</Link>
                </div>

                <div className="search mt-4">
                    <input
                        type="search"
                        placeholder="Search..."
                        className="border border-gray-400 rounded p-2 text-lg"
                    />
                </div>

                <div className="footer mt-8">
                    <ul className="flex gap-4">
                        <li>
                            <Link href="/all">all</Link>
                        </li>
                        <li>
                            <Link href="/movies">movies</Link>
                        </li>
                        <li>
                            <Link href="/television">television</Link>
                        </li>
                        <li>
                            <Link href="/games">games</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}