export default function ExecuteButton({ onClick, loading }) {
    return (
        <button
            onClick={onClick}
            disabled={loading}
            className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
        >
            {loading ? 'Running…' : 'Execute'}
        </button>
    );
}