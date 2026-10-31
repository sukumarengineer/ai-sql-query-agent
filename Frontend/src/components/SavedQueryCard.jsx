// Frontend/src/components/SavedQueryCard.jsx
import { Link } from 'react-router-dom';

export default function SavedQueryCard({ query }) {
    return (
        <Link
            to={`/queries/${query.id}`}
            className="block p-4 rounded-lg border border-gray-200 hover:border-gray-300"
        >
            <p className="text-sm font-medium text-gray-900">
                {query.title || query.natural_language}
            </p>
            {query.title && (
                <p className="text-sm text-gray-500 mt-0.5">{query.natural_language}</p>
            )}
            <p className="text-xs text-gray-400 mt-2">
                {new Date(query.created_at).toLocaleString()}
            </p>
        </Link>
    );
}