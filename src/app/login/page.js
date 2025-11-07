'use client'
import { useState } from 'react'
import { supabase } from '../../../utils/supabase/client'
import {useRouter} from "next/navigation";

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const { data, error} = await supabase.auth.signInWithPassword({
                email,
                password
            })
            if (error) {
                throw error
            }
            router.push('/admin')
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex flex-col items-center justify-center min-h-screen px-6 py-12 bg-neutral-50 text-neutral-900 font-mono">
            <h1 className="text-3xl font-semibold mb-8">tiny<span className="text-[var(--accent)]">rev</span> login</h1>

            <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full max-w-md">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}

                <div className="flex flex-col">
                    <label htmlFor="email" className="mb-1 font-semibold">email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="bingles@bootdog.com"
                        className="border border-neutral-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                        disabled={loading}
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="password" className="mb-1 font-semibold">password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                        className="border border-neutral-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                        disabled={loading}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-black text-white rounded p-3 mt-4 hover:bg-gray-800 transition-colors font-semibold disabled:bg-gray-400"
                >
                    {loading ? 'logging in...' : 'login'}
                </button>
            </form>
        </main>
    );
}