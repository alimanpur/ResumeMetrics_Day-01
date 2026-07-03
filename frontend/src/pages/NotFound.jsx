import { Link } from 'react-router'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="max-w-md text-center">
        <div className="mb-6 font-serif text-8xl italic text-ink/10">404</div>
        <h2 className="font-serif text-3xl italic">Page not found</h2>
        <p className="mt-4 text-sm text-ink/60">
          The page you're looking for doesn't exist, has been moved, or you don't have access.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-ink px-5 py-2.5 text-sm font-medium text-paper hover:bg-ink/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}