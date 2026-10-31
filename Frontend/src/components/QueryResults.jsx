export default function QueryResults({ columns, rows, summary }) {
    if (rows.length === 0) {
        return <p className="text-sm text-gray-500 italic">This query returned no rows.</p>;
    }

    return (
        <div>
            {summary && <p className="text-sm text-gray-700 mb-3">{summary}</p>}
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            {columns.map((col) => (
                                <th key={col} className="text-left px-4 py-2 font-semibold text-gray-700 whitespace-nowrap">
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, i) => (
                            <tr key={i} className="border-t border-gray-100">
                                {columns.map((col) => (
                                    <td key={col} className="px-4 py-2 whitespace-nowrap">{String(row[col])}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}