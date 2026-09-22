import { AnimatePresence, motion } from 'framer-motion';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../lib/realtime/useConnectionStatus';

/** App-wide notice while the browser is offline. */
export function OfflineBanner() {
    const online = useOnlineStatus();

    return (
        <AnimatePresence>
            {!online && (
                <motion.div
                    role="status"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden bg-red-950/90 text-red-100"
                >
                    <p className="flex items-center justify-center gap-2 px-4 py-2 text-sm">
                        <WifiOff className="h-4 w-4" aria-hidden />
                        You're offline. We'll reconnect and refresh your order as soon as you're back.
                    </p>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
