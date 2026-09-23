import { AlertTriangle, RotateCw } from 'lucide-react';
import { toApiError } from '../../lib/http/api-error';

interface ErrorStateProps {
    title: string;
    error: unknown;
    onRetry: () => void;
    isRetrying?: boolean;
}

export function ErrorState({ title, error, onRetry, isRetrying }: ErrorStateProps) {
    return (
        <div role="alert" className="flex flex-col items-center justify-center gap-4 py-16 text-center">
            <AlertTriangle className="h-10 w-10 text-red-400" aria-hidden />
            <div>
                <h2 className="text-lg font-semibold text-white">{title}</h2>
                <p className="mt-1 text-sm text-gray-400">{toApiError(error).message}</p>
            </div>
            <button
                type="button"
                onClick={onRetry}
                disabled={isRetrying}
                className="inline-flex items-center gap-2 rounded border border-primary/40 bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary-bright transition-colors hover:bg-primary hover:text-white disabled:opacity-50"
            >
                <RotateCw className={isRetrying ? 'h-4 w-4 animate-spin' : 'h-4 w-4'} aria-hidden />
                {isRetrying ? 'Retrying…' : 'Try again'}
            </button>
        </div>
    );
}
