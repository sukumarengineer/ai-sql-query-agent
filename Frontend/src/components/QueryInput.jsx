import { useState } from 'react';
import { generateQuery } from '../lib/api';

export default function QueryInput({ onGenerated }) {
    const [question, setQuestion] = useState('');
    const [status, setStatus] = useState('idle'); // idle | loading | error
    const [error, setError] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        if (!question.trim()) {
            setError('Type a question before submitting.');
            return;
        }

        setStatus('loading');
        setError('');
        try {
            const result = await generateQuery(question);
            onGenerated(result, question);
            setQuestion('');
            setStatus('idle');
        } catch (err) {
            setError(err.message);
            setStatus('error');
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask a question, e.g. Which employees earn more than 80000?"
                rows={3}
                className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
                type="submit"
                disabled={status === 'loading'}
                className="self-start px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
            >
                {status === 'loading' ? 'Generating…' : 'Generate SQL'}
            </button>
        </form>
    );
}