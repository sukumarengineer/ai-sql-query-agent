import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <Link to="/" className="text-xl font-bold text-gray-900">
                🗄️ SQL Query Agent
            </Link>
            <nav className="flex items-center gap-4 text-sm">
                <Link to="/history" className="text-gray-600 hover:text-gray-900">History</Link>
            </nav>
        </header>
    );
}