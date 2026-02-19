"use client";

import { addBookmark } from "@/app/actions";
import { useRef, useState } from "react";

export default function AddBookmarkForm() {
    const formRef = useRef<HTMLFormElement>(null);
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (formData: FormData) => {
        setIsPending(true);
        setError(null);
        const result = await addBookmark(formData);
        setIsPending(false);
        if (result?.error) {
            setError(result.error);
        } else {
            formRef.current?.reset();
        }
    };

    return (
        <form ref={formRef} action={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
                <input
                    type="text"
                    name="title"
                    placeholder="Bookmark title"
                    required
                    className="flex-1 px-4 py-3 rounded-xl bg-zinc-800/50 border border-zinc-700/50 
                     text-white placeholder-zinc-500 
                     focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 
                     transition-all duration-200"
                />
                <input
                    type="url"
                    name="url"
                    placeholder="https://example.com"
                    required
                    className="flex-[2] px-4 py-3 rounded-xl bg-zinc-800/50 border border-zinc-700/50 
                     text-white placeholder-zinc-500 
                     focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 
                     transition-all duration-200"
                />
                <button
                    type="submit"
                    disabled={isPending}
                    className="px-6 py-3 rounded-xl font-semibold text-white 
                     bg-gradient-to-r from-blue-600 to-violet-600 
                     hover:from-blue-500 hover:to-violet-500 
                     disabled:opacity-50 disabled:cursor-not-allowed 
                     transition-all duration-200 shadow-lg shadow-blue-500/20 
                     hover:shadow-blue-500/30 hover:scale-[1.02] cursor-pointer
                     whitespace-nowrap"
                >
                    {isPending ? (
                        <span className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Adding...
                        </span>
                    ) : (
                        "+ Add"
                    )}
                </button>
            </div>
            {error && (
                <p className="text-red-400 text-sm animate-pulse">{error}</p>
            )}
        </form>
    );
}
