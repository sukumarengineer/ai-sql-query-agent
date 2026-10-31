import { useEffect, useState } from 'react';
import { getHistory } from '../lib/api';
import HistoryItem from './HistoryItem';

export default function HistoryList() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let active = true;
        getHistory()
            .then((data) => { if (active) setHistory(data); })
            .catch((err) => { if (active) setError(err.message); })
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, []);

    if (loading) return <p className="text-sm text-gray-500">Loading history…</p>;
    if (error) return <p className="text-sm text-red-600">{error}</p>;
    if (history.length === 0) return <p className="text-sm text-gray-500 italic">No queries have been run yet.</p>;

    return (
        <div className="space-y-3">
            {history.map((entry) => (
                <HistoryItem key={entry.id} entry={entry} />
            ))}
        </div>
    );
}