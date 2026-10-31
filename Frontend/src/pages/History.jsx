import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HistoryList from '../components/HistoryList';

export default function History() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-10">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Query History</h1>
                <HistoryList />
            </main>
            <Footer />
        </div>
    );
}