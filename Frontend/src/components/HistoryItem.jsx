export default function HistoryItem({ entry }) {
    return (
        <div className="p-4 rounded-lg border border-gray-200">
            <p className="text-sm font-medium text-gray-900">
                {entry.natural_language || entry.sql_query}
            </p>
            {entry.natural_language && (
                <pre className="mt-1 text-xs text-gray-500 overflow-x-auto">{entry.sql_query}</pre>
            )}
            <p className="text-xs text-gray-400 mt-2">
                {new Date(entry.executed_at).toLocaleString()} · {entry.result_count} row(s)
            </p>
        </div>
    );
}