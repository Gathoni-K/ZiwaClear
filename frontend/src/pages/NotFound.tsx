import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold">404 — Page Not Found</h1>
      <p className="text-muted mt-2">
        The page you're looking for doesn't exist.
      </p>
      <Link to="/" className="text-primary underline mt-4 inline-block">
        Back to Dashboard
      </Link>
    </div>
  );
}

export default NotFound;