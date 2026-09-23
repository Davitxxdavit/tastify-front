import { useEffect, useId, useLayoutEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Headphones, RotateCw, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '../../auth/useAuth';
import { useChatOrder } from '../useChatOrder';
import { useOrderChat } from '../useOrderChat';
import { MAX_MESSAGE_LENGTH } from '../types';
import { LiveIndicator } from '../../../components/LiveIndicator';
import { Skeleton } from '../../../components/ui/Skeleton';
import { formatTime } from '../../../lib/format';

export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [draft, setDraft] = useState('');
    const { user, isAuthenticated } = useAuth();
    const { orderId, isLoading: orderLoading } = useChatOrder();
    const { history, pending, unread, send, retry, discard } = useOrderChat(orderId, isOpen);

    const launcherRef = useRef<HTMLButtonElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const logRef = useRef<HTMLDivElement>(null);
    const stickToBottom = useRef(true);
    const titleId = useId();
    const inputId = useId();

    const close = () => {
        setIsOpen(false);
        launcherRef.current?.focus();
    };

    // Move focus into the chat when it opens
    useEffect(() => {
        if (isOpen) inputRef.current?.focus();
    }, [isOpen, orderId]);

    const messages = history.data ?? [];
    const messageCount = messages.length + pending.length;

    // Keep the newest message in view unless the user scrolled up to read older ones
    useLayoutEffect(() => {
        const log = logRef.current;
        if (log && stickToBottom.current) log.scrollTop = log.scrollHeight;
    }, [messageCount, isOpen]);

    const onScroll = () => {
        const log = logRef.current;
        if (log) stickToBottom.current = log.scrollHeight - log.scrollTop - log.clientHeight < 48;
    };

    const handleSubmit = (event?: FormEvent) => {
        event?.preventDefault();
        if (!draft.trim()) return;
        stickToBottom.current = true;
        send(draft);
        setDraft('');
    };

    const onInputKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        // Enter sends, Shift+Enter adds a line break
        if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
            event.preventDefault();
            handleSubmit();
        }
    };

    const canChat = isAuthenticated && !!orderId;

    return (
        <>
            {/* Chat Bubble Button */}
            <motion.button
                ref={launcherRef}
                type="button"
                onClick={() => (isOpen ? close() : setIsOpen(true))}
                aria-expanded={isOpen}
                aria-controls={isOpen ? titleId : undefined}
                aria-label={isOpen ? 'Close chat' : unread > 0 ? `Open chat, ${unread} unread message${unread === 1 ? '' : 's'}` : 'Open chat'}
                className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-2xl shadow-orange-500/40 flex items-center justify-center hover:shadow-orange-500/50 transition-shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                            <X className="h-6 w-6" aria-hidden />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="chat"
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }}
                            className="relative"
                        >
                            <MessageCircle className="h-6 w-6" aria-hidden />
                        </motion.div>
                    )}
                </AnimatePresence>
                <AnimatePresence>
                    {unread > 0 && !isOpen && (
                        <motion.span
                            key="badge"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            aria-hidden
                            className="absolute -top-1 -right-1 flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-background-dark bg-red-500 px-1 text-xs font-bold tabular-nums"
                        >
                            {unread > 9 ? '9+' : unread}
                        </motion.span>
                    )}
                </AnimatePresence>
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        role="dialog"
                        aria-labelledby={titleId}
                        onKeyDown={(e) => {
                            if (e.key === 'Escape') {
                                e.stopPropagation();
                                close();
                            }
                        }}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[360px] h-[min(500px,calc(100vh-8rem))] bg-[#0a0a0a] text-white rounded-2xl shadow-2xl border border-[#1a1a1a] flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-primary p-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center" aria-hidden>
                                <Headphones className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h2 id={titleId} className="font-semibold truncate">
                                    {orderId ? `Order #${orderId.slice(0, 8)}` : 'Chat with the restaurant'}
                                </h2>
                                {canChat ? (
                                    <div className="mt-1 [&>span]:border-white/20 [&>span]:bg-white/10 [&>span]:py-0.5">
                                        <LiveIndicator namespace="/chat" />
                                    </div>
                                ) : (
                                    <p className="text-xs opacity-80">We reply about your orders here</p>
                                )}
                            </div>
                            <button type="button" onClick={close} aria-label="Close chat" className="p-1 hover:bg-white/10 rounded-full transition-colors">
                                <X className="h-5 w-5" aria-hidden />
                            </button>
                        </div>

                        {/* Messages */}
                        <div
                            ref={logRef}
                            onScroll={onScroll}
                            role="log"
                            aria-live="polite"
                            aria-label="Messages"
                            tabIndex={0}
                            className="flex-1 overflow-y-auto p-4 space-y-3 focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary-bright"
                        >
                            {!isAuthenticated ? (
                                <EmptyNotice>
                                    <Link to="/login" onClick={() => setIsOpen(false)} className="text-primary-bright underline">
                                        Sign in
                                    </Link>{' '}
                                    to chat with the restaurant about your order.
                                </EmptyNotice>
                            ) : orderLoading ? (
                                <Skeleton className="h-16 w-full" />
                            ) : !orderId ? (
                                <EmptyNotice>
                                    Chat opens once you have an active order.{' '}
                                    <Link to="/menu" onClick={() => setIsOpen(false)} className="text-primary-bright underline">
                                        Browse the menu
                                    </Link>
                                </EmptyNotice>
                            ) : history.isPending ? (
                                <div className="space-y-3" aria-label="Loading messages">
                                    <Skeleton className="h-10 w-2/3" />
                                    <Skeleton className="ml-auto h-10 w-1/2" />
                                </div>
                            ) : history.isError ? (
                                <EmptyNotice>
                                    Couldn't load messages.{' '}
                                    <button type="button" onClick={() => history.refetch()} className="text-primary-bright underline">
                                        Try again
                                    </button>
                                </EmptyNotice>
                            ) : (
                                <>
                                    {messageCount === 0 && (
                                        <EmptyNotice>Questions about this order? Send us a message and the kitchen will reply here.</EmptyNotice>
                                    )}
                                    {messages.map((message) => {
                                        const mine = message.userId === user?.id;
                                        return (
                                            <Bubble
                                                key={message.id}
                                                mine={mine}
                                                author={mine ? 'You' : message.staff?.name ?? 'Restaurant'}
                                                text={message.message}
                                                time={message.sentAt}
                                            />
                                        );
                                    })}
                                    {pending.map((message) => (
                                        <Bubble key={message.tempId} mine author="You" text={message.message} time={message.sentAt} status={message.status}>
                                            {message.status === 'failed' && (
                                                <div className="mt-1 flex items-center justify-end gap-3 text-[11px] text-red-300">
                                                    <span className="flex items-center gap-1">
                                                        <AlertCircle className="h-3 w-3" aria-hidden />
                                                        {message.error ?? 'Not sent'}
                                                    </span>
                                                    <button type="button" onClick={() => retry(message.tempId)} className="flex items-center gap-1 underline hover:text-white">
                                                        <RotateCw className="h-3 w-3" aria-hidden />
                                                        Retry
                                                    </button>
                                                    <button type="button" onClick={() => discard(message.tempId)} className="underline hover:text-white">
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </Bubble>
                                    ))}
                                </>
                            )}
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSubmit} className="p-3 border-t border-[#1a1a1a]">
                            <div className="flex items-end gap-2">
                                <label htmlFor={inputId} className="sr-only">
                                    Message
                                </label>
                                <textarea
                                    ref={inputRef}
                                    id={inputId}
                                    rows={1}
                                    value={draft}
                                    onChange={(e) => setDraft(e.target.value)}
                                    onKeyDown={onInputKeyDown}
                                    maxLength={MAX_MESSAGE_LENGTH}
                                    disabled={!canChat}
                                    placeholder={canChat ? 'Type a message…' : 'Chat is available for active orders'}
                                    className="flex-1 max-h-28 min-h-10 resize-none rounded-2xl border border-[#1a1a1a] bg-black px-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                                />
                                <button
                                    type="submit"
                                    aria-label="Send message"
                                    disabled={!canChat || !draft.trim()}
                                    className="h-10 w-10 shrink-0 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-hover transition-colors disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-bright"
                                >
                                    <Send className="h-4 w-4" aria-hidden />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

function EmptyNotice({ children }: { children: React.ReactNode }) {
    return <p className="py-8 text-center text-sm leading-relaxed text-gray-400">{children}</p>;
}

interface BubbleProps {
    mine: boolean;
    author: string;
    text: string;
    time: string;
    status?: 'sending' | 'failed';
    children?: React.ReactNode;
}

function Bubble({ mine, author, text, time, status, children }: BubbleProps) {
    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={clsx('flex flex-col', mine ? 'items-end' : 'items-start')}>
            <div
                className={clsx(
                    'max-w-[85%] rounded-2xl px-4 py-2.5',
                    mine ? 'bg-primary text-white rounded-br-md' : 'bg-[#141414] border border-[#1a1a1a] rounded-bl-md',
                    status === 'sending' && 'opacity-70',
                    status === 'failed' && 'border border-red-500/60',
                )}
            >
                {mine ? (
                    <p className="sr-only">{author}:</p>
                ) : (
                    <p className="mb-0.5 text-[11px] font-semibold text-amber-300">{author}</p>
                )}
                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{text}</p>
                <p className={clsx('text-[10px] mt-1', mine ? 'text-white/60 text-right' : 'text-gray-500')}>
                    {status === 'sending' ? 'Sending…' : <time dateTime={time}>{formatTime(time)}</time>}
                </p>
            </div>
            {children}
        </motion.div>
    );
}
