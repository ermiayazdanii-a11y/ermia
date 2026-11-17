import { RefObject, useEffect, useRef } from 'react';

interface LenisController {
  stop: () => void;
  start: () => void;
}

interface UseModalFocusTrapOptions {
  isOpen: boolean;
  dialogRef: RefObject<HTMLElement | null>;
  initialFocusRef?: RefObject<HTMLElement | null>;
  triggerRef?: RefObject<HTMLElement | null>;
  onClose: () => void;
  lenis?: LenisController;
}

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
].join(', ');

function getVisibleFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
  ).filter(
    (el) =>
      el.getClientRects().length > 0 &&
      window.getComputedStyle(el).visibility !== 'hidden'
  );
}

/**
 * Manages modal accessibility cleanly:
 * - Traps Tab and Shift+Tab within the active dialog container
 * - Redirects stray focus back into the dialog while open
 * - Isolates background #root via inert + aria-hidden when portaled
 * - Closes on Escape and restores focus to the original trigger on close
 * - Preserves Lenis scroll locking and cleanup without mid-open focus jumps
 */
export function useModalFocusTrap({
  isOpen,
  dialogRef,
  initialFocusRef,
  triggerRef,
  onClose,
  lenis,
}: UseModalFocusTrapOptions) {
  const onCloseRef = useRef(onClose);
  const lenisRef = useRef(lenis);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  onCloseRef.current = onClose;
  lenisRef.current = lenis;

  useEffect(() => {
    if (!isOpen) return;

    const triggerEl =
      triggerRef?.current ??
      (document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null);
    previouslyFocusedRef.current = triggerEl;

    const rootEl = document.getElementById('root') as
      | (HTMLElement & { inert: boolean })
      | null;
    const prevOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';
    lenisRef.current?.stop();

    if (rootEl && !dialogRef.current?.contains(rootEl) && !rootEl.contains(dialogRef.current)) {
      rootEl.setAttribute('aria-hidden', 'true');
      rootEl.inert = true;
    }

    const rafId = window.requestAnimationFrame(() => {
      const dialog = dialogRef.current;
      if (!dialog) return;
      if (initialFocusRef?.current && dialog.contains(initialFocusRef.current)) {
        initialFocusRef.current.focus();
        return;
      }
      const focusables = getVisibleFocusableElements(dialog);
      if (focusables.length > 0) {
        focusables[0].focus();
      } else {
        dialog.focus();
      }
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCloseRef.current();
        return;
      }

      if (e.key !== 'Tab') return;

      const dialog = dialogRef.current;
      if (!dialog) return;

      const focusables = getVisibleFocusableElements(dialog);
      if (focusables.length === 0) {
        e.preventDefault();
        dialog.focus();
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      if (!active || !dialog.contains(active)) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
        return;
      }

      if (e.shiftKey) {
        if (active === first || active === dialog) {
          e.preventDefault();
          last.focus();
        }
      } else if (active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    const handleFocusIn = (e: FocusEvent) => {
      const dialog = dialogRef.current;
      if (!dialog) return;
      if (e.target instanceof Node && dialog.contains(e.target)) return;
      const focusables = getVisibleFocusableElements(dialog);
      (focusables[0] ?? initialFocusRef?.current ?? dialog).focus();
    };

    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('focusin', handleFocusIn, true);

    return () => {
      window.cancelAnimationFrame(rafId);
      document.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('focusin', handleFocusIn, true);
      document.body.style.overflow = prevOverflow;
      lenisRef.current?.start();

      if (rootEl) {
        rootEl.removeAttribute('aria-hidden');
        rootEl.inert = false;
      }

      const targetToRestore = triggerRef?.current ?? previouslyFocusedRef.current;
      if (targetToRestore && targetToRestore.isConnected) {
        targetToRestore.focus();
      }
      previouslyFocusedRef.current = null;
    };
  }, [isOpen, dialogRef, initialFocusRef, triggerRef]);
}
