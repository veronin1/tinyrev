import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen font-mono text-3xl">
      <div>tinyrev</div>

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
  );
}
