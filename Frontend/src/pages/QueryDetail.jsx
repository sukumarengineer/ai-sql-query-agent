// Frontend/src/pages/QueryDetail.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SQLDisplay from '../components/SQLDisplay';
import QueryResults from '../components/QueryResults';
import ExecuteButton from '../components/ExecuteButton';
import DeleteConfirmDialog from '../components/DeleteConfirmDialog';
import { deleteSavedQuery, getSavedQuery, rerunSavedQuery } from '../lib/api';

export default function QueryDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [query, setQuery] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState('');
    const [result, setResult] = useState(null);
    const [executing, setExecuting] = useState(false);
    const [runError, setRunError] = useState('');
    const [confirming, setConfirming] = useState(false);

    useEffect(() => {
        let active = true;
        getSavedQuery(id)
            .then((data) => { if (active) setQuery(data); })
            .catch((err) => { if (active) setLoadError(err.message); })
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, [id]);

    async function handleExecute() {
        setExecuting(true);
        setRunError('');
        try {
            const executed = await rerunSavedQuery(id);
            setResult(executed);
        } catch (err) {
            setRunError(err.message);
        } finally {
            setExecuting(false);
        }
    }

    async function handleDelete() {
        await deleteSavedQuery(id);
        navigate('/');
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-10 space-y-6">
                {loading && <p className="text-sm text-gray-500">Loading query…</p>}
                {loadError && <p className="text-sm text-red-600">{loadError}</p>}

                {query && (
                    <>
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {query.title || 'Saved Query'}
                                </h1>
                                <p className="text-sm text-gray-600 mt-1">{query.natural_language}</p>
                            </div>
                            <button
                                onClick={() => setConfirming(true)}
                                className="text-sm text-red-500 hover:text-red-700 flex-none"
                            >
                                Delete
                            </button>
                        </div>

                        <SQLDisplay sqlQuery={query.sql_query} explanation={null} />
                        <ExecuteButton onClick={handleExecute} loading={executing} />

                        {runError && <p className="text-sm text-red-600">{runError}</p>}
                        {result && (
                            <QueryResults columns={result.columns} rows={result.rows} summary={result.summary} />
                        )}
                    </>
                )}
            </main>
            <Footer />

            {confirming && (
                <DeleteConfirmDialog
                    message="Delete this saved query? This can't be undone."
                    onConfirm={handleDelete}
                    onCancel={() => setConfirming(false)}
                />
            )}
        </div>
    );
}