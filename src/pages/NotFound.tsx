import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center text-white">
            <p className="text-sm font-bold uppercase tracking-widest text-primary-bright">404</p>
            <h1 className="mt-2 font-serif text-4xl font-bold">Page not found</h1>
            <p className="mt-3 text-gray-400">This page isn't on the menu.</p>
            <Link to="/menu" className="mt-8 rounded-lg bg-primary px-6 py-3 font-bold text-white hover:bg-primary-hover">
                Browse the menu
            </Link>
        </div>
    );
}
