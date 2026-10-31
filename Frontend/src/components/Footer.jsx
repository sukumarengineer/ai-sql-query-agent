export default function Footer() {
    return (
        <footer className="px-6 py-8 text-center text-sm text-gray-500 border-t border-gray-200">
            © {new Date().getFullYear()} SQL Query Agent. Built as a learning project.
        </footer>
    );
}