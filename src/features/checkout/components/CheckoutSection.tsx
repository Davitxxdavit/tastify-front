import type { ReactNode } from 'react';

interface CheckoutSectionProps {
    id: string;
    icon: string;
    title: string;
    children: ReactNode;
}

export function CheckoutSection({ id, icon, title, children }: CheckoutSectionProps) {
    return (
        <section aria-labelledby={id}>
            <div className="flex items-center gap-3 mb-8 border-b border-surface-border pb-4">
                <span className="material-symbols-outlined text-text-muted" aria-hidden>
                    {icon}
                </span>
                <h2 className="text-lg font-medium text-white uppercase tracking-wide" id={id}>
                    {title}
                </h2>
            </div>
            {children}
        </section>
    );
}
