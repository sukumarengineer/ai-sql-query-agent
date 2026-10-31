import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import QueryInput from '../components/QueryInput';
import SQLDisplay from '../components/SQLDisplay';
import QueryResults from '../components/QueryResults';
import SaveQueryButton from '../components/SaveQueryButton';
import SavedQueriesList from '../components/SavedQueriesList';
import { executeQuery } from '../lib/api';
import SchemaViewer from '../components/SchemaViewer';


export default function Dashboard() {
    const [generated, setGenerated] = useState(null); // { sql_query, explanation, question }
    const [result, setResult] = useState(null); // { columns, rows, row_count, summary }
    const [executing, setExecuting] = useState(false);
    const [error, setError] = useState('');
    const [refreshKey, setRefreshKey] = useState(0);

    async function handleGenerated(generatedResult, question) {
        setGenerated({ ...generatedResult, question });
        setResult(null);
        setError('');
        setExecuting(true);
        try {
            const executed = await executeQuery(generatedResult.sql_query, question);
            setResult(executed);
        } catch (err) {
            setError(err.message);
        } finally {
            setExecuting(false);
        }
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-10 space-y-6">
                <h1 className="text-2xl font-bold text-gray-900">Ask your database a question</h1>
                <QueryInput onGenerated={handleGenerated} />

                {generated && (
                    <SQLDisplay sqlQuery={generated.sql_query} explanation={generated.explanation} />
                )}

                {executing && <p className="text-sm text-gray-500">Running query…</p>}
                {error && <p className="text-sm text-red-600">{error}</p>}

                {result && (
                    <>
                        <QueryResults columns={result.columns} rows={result.rows} summary={result.summary} />
                        <SaveQueryButton
                            naturalLanguage={generated.question}
                            sqlQuery={generated.sql_query}
                            onSaved={() => setRefreshKey((k) => k + 1)}
                        />
                    </>
                )}

                <section className="pt-6 border-t border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Saved Queries</h2>
                    <SavedQueriesList refreshKey={refreshKey} />
                </section>
                <section className="pt-6 border-t border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Database Schema</h2>
                    <SchemaViewer />
                </section>
            </main>
            <Footer />
        </div>
    );
}