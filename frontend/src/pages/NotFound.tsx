import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-primary">404</h1>
        <h2 className="text-xl md:text-2xl font-bold mt-4">Page Not Found</h2>
        <p className="text-muted mt-2 text-sm md:text-base">
          The page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="inline-block mt-6 px-6 py-2.5 bg-primary text-background font-semibold text-sm rounded-pill hover:bg-primary-hover transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;