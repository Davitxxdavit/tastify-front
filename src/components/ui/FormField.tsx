import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

export interface FieldControlProps {
    id: string;
    'aria-invalid': boolean;
    'aria-describedby': string | undefined;
}

interface FormFieldProps {
    id: string;
    label: string;
    error?: string;
    hint?: string;
    className?: string;
    labelClassName?: string;
    children: (control: FieldControlProps) => ReactNode;
}

/** Label + control + hint/error, wired together for screen readers. */
export function FormField({ id, label, error, hint, className, labelClassName, children }: FormFieldProps) {
    const hintId = hint ? `${id}-hint` : undefined;
    const errorId = error ? `${id}-error` : undefined;
    const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

    return (
        <div className={cn('space-y-2', className)}>
            <label htmlFor={id} className={cn('block text-sm font-medium leading-none', labelClassName)}>
                {label}
            </label>
            {children({ id, 'aria-invalid': !!error, 'aria-describedby': describedBy })}
            {hint && !error && (
                <p id={hintId} className="text-xs text-text-muted">
                    {hint}
                </p>
            )}
            {error && (
                <p id={errorId} role="alert" className="text-xs font-medium text-red-400">
                    {error}
                </p>
            )}
        </div>
    );
}
