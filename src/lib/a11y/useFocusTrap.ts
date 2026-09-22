import { useEffect, useRef, type RefObject } from 'react';

const FOCUSABLE = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
].join(',');

interface FocusTrapOptions {
    /** Called on Escape. */
    onEscape?: () => void;
    /** Element to focus on open; defaults to the first focusable element. */
    initialFocusRef?: RefObject<HTMLElement | null>;
}

/**
 * While `active`, keeps Tab/Shift+Tab inside `containerRef`, closes on Escape,
 * and gives focus back to whatever was focused before when it deactivates.
 */
export function useFocusTrap(
    containerRef: RefObject<HTMLElement | null>,
    active: boolean,
    { onEscape, initialFocusRef }: FocusTrapOptions = {},
) {
    const onEscapeRef = useRef(onEscape);
    useEffect(() => {
        onEscapeRef.current = onEscape;
    });

    useEffect(() => {
        if (!active) return;
        const container = containerRef.current;
        if (!container) return;

        const previouslyFocused = document.activeElement as HTMLElement | null;
        const focusables = () =>
            Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
                (el) => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true',
            );

        const initial = initialFocusRef?.current ?? focusables()[0] ?? container;
        initial.focus({ preventScroll: true });

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && onEscapeRef.current) {
                event.stopPropagation();
                onEscapeRef.current();
                return;
            }
            if (event.key !== 'Tab') return;

            const elements = focusables();
            if (elements.length === 0) {
                event.preventDefault();
                return;
            }
            const first = elements[0];
            const last = elements[elements.length - 1];
            const current = document.activeElement;

            if (event.shiftKey && (current === first || !container.contains(current))) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && (current === last || !container.contains(current))) {
                event.preventDefault();
                first.focus();
            }
        };

        container.addEventListener('keydown', onKeyDown);
        return () => {
            container.removeEventListener('keydown', onKeyDown);
            if (previouslyFocused && document.contains(previouslyFocused)) {
                previouslyFocused.focus({ preventScroll: true });
            }
        };
    }, [active, containerRef, initialFocusRef]);
}
