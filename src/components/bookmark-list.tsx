"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { deleteBookmark } from "@/app/actions";
interface Bookmark {
    id: string;
    title: string;
    url: string;
    user_id: string;
    created_at: string;
}

interface BookmarkListProps {
    initialBookmarks: Bookmark[];
    userId: string;
}

export default function BookmarkList({
    initialBookmarks,
    userId,
}: BookmarkListProps) {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    useEffect(() => {
        console.log("initialBookmarks", initialBookmarks);
    }, [])
    useEffect(() => {
        const supabase = createClient();
        const channel = supabase
            .channel("bookmarks-realtime")
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "bookmarks",
                },
                (payload) => {
                    console.log("INSERT", payload);
                    const inserted = payload.new as Bookmark;
                    if (inserted.user_id !== userId) return;
                    setBookmarks((prev) => [inserted, ...prev]);
                }
            )
            .on(
                "postgres_changes",
                {
                    event: "DELETE",
                    schema: "public",
                    table: "bookmarks",
                },
                (payload) => {
                    console.log("DELETE", payload);
                    const deleted = payload.old as Bookmark;
                    setBookmarks((prev) =>
                        prev.filter((b) => b.id !== deleted.id)
                    );
                }
            )
            .subscribe((status, err) => {
                console.log("Realtime subscription status:", status, err ?? "");
            });
        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId]);
    const handleDelete = async (id: string) => {
        setDeletingId(id);
        await deleteBookmark(id);
        // Realtime subscription will also remove it, but let's optimistically update
        setBookmarks((prev) => prev.filter((b) => b.id !== id));
        setDeletingId(null);
    };

    if (bookmarks.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-zinc-800/50 mb-4">
                    <svg
                        className="w-8 h-8 text-zinc-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                        />
                    </svg>
                </div>
                <p className="text-zinc-400 text-lg">No bookmarks yet</p>
                <p className="text-zinc-600 text-sm mt-1">
                    Add your first bookmark above to get started
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {bookmarks.map((bookmark) => (
                <div
                    key={bookmark.id}
                    className="group flex items-center justify-between gap-4 p-4 rounded-xl 
                     bg-zinc-800/30 border border-zinc-800 
                     hover:bg-zinc-800/60 hover:border-zinc-700 
                     transition-all duration-200"
                >
                    <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-white truncate">
                            {bookmark.title}
                        </h3>
                        <a
                            href={bookmark.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-400 hover:text-blue-300 truncate block 
                         transition-colors duration-150"
                        >
                            {bookmark.url}
                        </a>
                    </div>
                    <div className="flex items-center gap-3">
                        <time className="text-xs text-zinc-600 hidden sm:block whitespace-nowrap">
                            {new Date(bookmark.created_at).toLocaleDateString("en-US")}
                        </time>
                        <button
                            onClick={() => handleDelete(bookmark.id)}
                            disabled={deletingId === bookmark.id}
                            className="p-2 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-400/10 opacity-0 group-hover:opacity-100 transition-all duration-200 disabled:opacity-50 cursor-pointer"
                            title="Delete bookmark"
                        >
                            {deletingId === bookmark.id ? (
                                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        fill="none"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

