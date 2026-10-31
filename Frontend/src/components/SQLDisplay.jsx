export default function SQLDisplay({ sqlQuery, explanation }) {
    return (
        <div className="rounded-lg border border-gray-200 overflow-hidden">
            <pre className="p-4 bg-gray-900 text-gray-100 text-sm overflow-x-auto">
                <code>{sqlQuery}</code>
            </pre>
            {explanation && (
                <p className="p-4 text-sm text-gray-600 bg-gray-50">{explanation}</p>
            )}
        </div>
    );
}