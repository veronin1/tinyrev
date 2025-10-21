'use client'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import {useRouter} from "next/navigation";

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )

    const handleLogin = async (e) => {
        e.preventDefault()

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
        <div className="flex flex-col items-center justify-center min-h-screen font-mono p-8">
            <div className="text-3xl mb-8">
                <p>tinyrev login</p>
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full max-w-md">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}

                <div className="flex flex-col">
                    <label htmlFor="email" className="mb-2 font-semibold">email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="bingles@bootdog.com"
                        className="border border-gray-300 rounded p-2"
                        disabled={loading}
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="password" className="mb-2 font-semibold">password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                        className="border border-gray-300 rounded p-2"
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
        </div>
    );
}