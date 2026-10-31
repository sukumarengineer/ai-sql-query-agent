import { useState } from 'react';
import { saveQuery } from '../lib/api';

export default function SaveQueryButton({ naturalLanguage, sqlQuery, onSaved }) {
    const [title, setTitle] = useState('');
    const [status, setStatus] = useState('idle'); // idle | saving | saved | error
    const [error, setError] = useState('');

    async function handleSave() {
        setStatus('saving');
        setError('');
        try {
            await saveQuery(naturalLanguage, sqlQuery, title || null);
            setStatus('saved');
            setTitle('');
            onSaved();
        } catch (err) {
            setError(err.message);
            setStatus('error');
        }
    }

    return (
        <div className="flex flex-wrap items-center gap-2">
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Optional title"
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm flex-1 min-w-[160px]"
            />
            <button
                onClick={handleSave}
                disabled={status === 'saving'}
                className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
            >
                {status === 'saving' ? 'Saving…' : 'Save Query'}
            </button>
            {status === 'saved' && <span className="text-sm text-green-600">Saved!</span>}
            {status === 'error' && <span className="text-sm text-red-600">{error}</span>}
        </div>
    );
}