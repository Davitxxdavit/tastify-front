import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { clsx } from 'clsx';
import { formatTime } from '../../../lib/format';
import { ORDER_STATUS_META } from '../status';
import { buildTimeline } from '../timeline';
import type { Order } from '../types';

export function StatusTimeline({ order }: { order: Order }) {
    const steps = buildTimeline(order);

    return (
        <ol className="relative space-y-6" aria-label="Order progress">
            {steps.map((step, index) => {
                const meta = ORDER_STATUS_META[step.status];
                const isCancelled = step.status === 'CANCELLED';
                const isLast = index === steps.length - 1;
                return (
                    <motion.li
                        key={step.status}
                        layout
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.04 }}
                        className="relative flex gap-4"
                        aria-current={step.state === 'current' ? 'step' : undefined}
                    >
                        {!isLast && (
                            <span
                                aria-hidden
                                className={clsx(
                                    'absolute left-[15px] top-8 h-[calc(100%-8px)] w-0.5',
                                    step.state === 'done' ? 'bg-primary-bright/60' : 'bg-surface-border',
                                )}
                            />
                        )}
                        <span
                            aria-hidden
                            className={clsx(
                                'relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                                isCancelled && 'border-red-500 bg-red-500/20 text-red-400',
                                !isCancelled && step.state === 'done' && 'border-primary-bright bg-primary-bright/20 text-primary-bright',
                                !isCancelled && step.state === 'current' && 'border-primary-bright bg-black text-primary-bright',
                                step.state === 'upcoming' && 'border-surface-border bg-black text-text-muted',
                            )}
                        >
                            {isCancelled ? (
                                <X className="h-4 w-4" />
                            ) : step.state === 'done' ? (
                                <Check className="h-4 w-4" />
                            ) : step.state === 'current' ? (
                                <motion.span
                                    className="h-2.5 w-2.5 rounded-full bg-primary-bright"
                                    animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                                    transition={{ duration: 1.6, repeat: Infinity }}
                                />
                            ) : (
                                <span className="h-2 w-2 rounded-full bg-surface-border" />
                            )}
                        </span>
                        <div className="pb-1">
                            <p
                                className={clsx(
                                    'text-sm font-semibold',
                                    step.state === 'upcoming' ? 'text-text-muted' : 'text-white',
                                )}
                            >
                                {meta.label}
                                {step.at && (
                                    <span className="ml-2 text-xs font-normal text-text-muted tabular-nums">
                                        <time dateTime={step.at}>{formatTime(step.at)}</time>
                                    </span>
                                )}
                                <span className="sr-only">
                                    {step.state === 'done' ? ' (completed)' : step.state === 'current' ? ' (current step)' : ' (upcoming)'}
                                </span>
                            </p>
                            {step.state === 'current' && <p className="mt-0.5 text-xs text-gray-400">{meta.description}</p>}
                        </div>
                    </motion.li>
                );
            })}
        </ol>
    );
}
