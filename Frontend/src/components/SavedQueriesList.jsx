// Frontend/src/components/SavedQueriesList.jsx
import { useEffect, useState } from 'react';
import { deleteSavedQuery, listSavedQueries } from '../lib/api';
import SavedQueryCard from './SavedQueryCard';

export default function SavedQueriesList({ refreshKey }) {
    const [queries, setQueries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;
        setLoading(true);
        listSavedQueries()
            .then((data) => { if (active) setQueries(data); })
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, [refreshKey]);

    async function handleDelete(id) {
        await deleteSavedQuery(id);
        setQueries((prev) => prev.filter((q) => q.id !== id));
    }

    if (loading) return <p className="text-sm text-gray-500">Loading saved queries…</p>;
    if (queries.length === 0) return <p className="text-sm text-gray-500 italic">No saved queries yet.</p>;

    return (
        <div className="space-y-3">
            {queries.map((query) => (
                <SavedQueryCard key={query.id} query={query} onDelete={handleDelete} />
            ))}
        </div>
    );
}