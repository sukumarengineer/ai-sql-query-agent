import { useEffect, useState } from 'react';
import { getSchema } from '../lib/api';

export default function SchemaViewer() {
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [openTables, setOpenTables] = useState(new Set());

    useEffect(() => {
        getSchema()
            .then((data) => setTables(data.tables))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    function toggleTable(name) {
        setOpenTables((prev) => {
            const next = new Set(prev);
            next.has(name) ? next.delete(name) : next.add(name);
            return next;
        });
    }

    if (loading) return <p className="text-sm text-gray-500">Loading schema…</p>;
    if (error) return <p className="text-sm text-red-600">{error}</p>;

    return (
        <div className="space-y-2">
            {tables.map((table) => {
                const open = openTables.has(table.name);
                return (
                    <div key={table.name} className="rounded-lg border border-gray-200 overflow-hidden">
                        <button
                            onClick={() => toggleTable(table.name)}
                            className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium text-gray-900 bg-gray-50 hover:bg-gray-100"
                        >
                            <span>{table.name}</span>
                            <span className="text-gray-400">{open ? '−' : '+'}</span>
                        </button>
                        {open && (
                            <ul className="px-4 py-3 text-sm text-gray-600 space-y-1">
                                {table.columns.map((col) => (
                                    <li key={col.name} className="flex justify-between">
                                        <span>{col.name}</span>
                                        <span className="text-gray-400">{col.type}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                );
            })}
        </div>
    );
}