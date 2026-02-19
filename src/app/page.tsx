import { createClient } from "@/lib/supabase/server";
import AuthButton from "@/components/auth-button";
import AddBookmarkForm from "@/components/add-bookmark-form";
import BookmarkList from "@/components/bookmark-list";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-dvh flex flex-col">
      {/* Header */}
      <header className="border-b border-zinc-800/50 backdrop-blur-xl bg-zinc-950/50 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                />
              </svg>
            </div>
            <h1 className="text-lg font-semibold text-white tracking-tight">
              Bookmarks
            </h1>
          </div>
          <AuthButton user={user ? { email: user.email } : null} />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {user ? (
          <LoggedInView userId={user.id} />
        ) : (
          <HeroSection />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/50 py-6">
        <p className="text-center text-xs text-zinc-600">
          Built with Next.js, Supabase & Tailwind CSS
        </p>
      </footer>
    </div>
  );
}

async function LoggedInView({ userId }: { userId: string }) {
  const supabase = await createClient();
  const { data: bookmarks } = await supabase
    .from("bookmarks")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Add Bookmark Section */}
      <section>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-sm shadow-2xl shadow-black/20">
          <h2 className="text-sm font-medium text-zinc-400 mb-4 uppercase tracking-wider">
            Add a bookmark
          </h2>
          <AddBookmarkForm />
        </div>
      </section>

      {/* Bookmark List */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">
            Your bookmarks
          </h2>
          <span className="text-xs text-zinc-600 bg-zinc-800/50 px-2.5 py-1 rounded-full">
            {bookmarks?.length ?? 0} saved
          </span>
        </div>
        <BookmarkList initialBookmarks={bookmarks ?? []} userId={userId} />
      </section>
    </div>
  );
}

function HeroSection() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70dvh] px-4 text-center">
      {/* Glow effect */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-2xl shadow-blue-500/30 mb-2">
          <svg
            className="w-10 h-10 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
            />
          </svg>
        </div>

        <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
          Your bookmarks,{" "}
          <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
            everywhere
          </span>
        </h2>

        <p className="text-lg text-zinc-400 max-w-md mx-auto leading-relaxed">
          Save links, access them from any device, and watch them sync in
          real-time across all your tabs.
        </p>

        <div className="pt-2">
          <AuthButton user={null} />
        </div>

        <div className="flex items-center justify-center gap-6 pt-4 text-sm text-zinc-600">
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Real-time sync
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Private & secure
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Google sign-in
          </span>
        </div>
      </div>
    </div>
  );
}
