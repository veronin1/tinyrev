import { createClient} from "@supabase/supabase-js";

export async function addReview() {
    const supabase = await createClient();
    const { data: reviews, error } = await supabase.from();
}

export default function Admin() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen font-mono p-8">
            <div className="text-3xl mb-8">
                <p>tinyrev admin</p>
            </div>

            <form className="flex flex-col gap-4 w-full max-w-2xl text-lg">
                <div className="flex flex-col">
                    <label htmlFor="type" className="mb-2 font-semibold">Review Type *</label>
                    <select 
                        id="type" 
                        name="type" 
                        required
                        className="border border-gray-300 rounded p-2 bg-white"
                    >
                        <option value="">Select type</option>
                        <option value="movie">Movie</option>
                        <option value="series">Series</option>
                        <option value="game">Game</option>
                    </select>
                </div>

                <div className="flex flex-col">
                    <label htmlFor="title" className="mb-2 font-semibold">Title *</label>
                    <input 
                        type="text" 
                        id="title" 
                        name="title" 
                        required
                        placeholder="Enter title"
                        className="border border-gray-300 rounded p-2"
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="rating" className="mb-2 font-semibold">Rating (1-10) *</label>
                    <input 
                        type="number" 
                        id="rating" 
                        name="rating" 
                        min="1" 
                        max="10" 
                        step="0.1"
                        required
                        placeholder="7.5"
                        className="border border-gray-300 rounded p-2"
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="review" className="mb-2 font-semibold">Review *</label>
                    <textarea 
                        id="review" 
                        name="review" 
                        rows="6"
                        required
                        placeholder="Write your review here..."
                        className="border border-gray-300 rounded p-2"
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="year" className="mb-2 font-semibold">Release Year</label>
                    <input 
                        type="number" 
                        id="year" 
                        name="year" 
                        min="1900" 
                        max="2099"
                        placeholder="2024"
                        className="border border-gray-300 rounded p-2"
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="genre" className="mb-2 font-semibold">Genre</label>
                    <input 
                        type="text" 
                        id="genre" 
                        name="genre"
                        placeholder="Action, Drama, etc."
                        className="border border-gray-300 rounded p-2"
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="image_url" className="mb-2 font-semibold">Image URL</label>
                    <input 
                        type="url" 
                        id="image_url" 
                        name="image_url"
                        placeholder="https://example.com/image.jpg"
                        className="border border-gray-300 rounded p-2"
                    />
                </div>

                <button 
                    type="submit"
                    className="bg-black text-white rounded p-3 mt-4 hover:bg-gray-800 transition-colors font-semibold"
                >
                    Add Review
                </button>
            </form>
        </div>
    );
}