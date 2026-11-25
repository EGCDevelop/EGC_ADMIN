import { useEffect, useRef } from "react";
import styles from './styles/custom-modal.module.css';

export interface CustomModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    size?: "small" | "medium" | "large";
    closeOnOverlayClick?: boolean;
    showCloseButton?: boolean;
}

export const CustomModal: React.FC<CustomModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    footer,
    size = "medium",
    closeOnOverlayClick = true,
    showCloseButton = true,
}) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const previousActiveElement = useRef<HTMLElement | null>(null);

    // Manejo de tecla Escape, Bloqueo de Scroll y Focus Trap
    useEffect(() => {
        if (!isOpen) return;

        // Guardar el elemento previamente enfocado para restaurarlo al cerrar
        previousActiveElement.current = document.activeElement as HTMLElement;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
                return;
            }

            // Focus Trap basico para navegacion con Tab
            if (event.key === "Tab" && modalRef.current) {
                const focusableElements =
                    modalRef.current.querySelectorAll<HTMLElement>(
                        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
                    );
                if (focusableElements.length === 0) return;

                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (event.shiftKey && document.activeElement === firstElement) {
                    event.preventDefault();
                    lastElement.focus();
                } else if (!event.shiftKey && document.activeElement === lastElement) {
                    event.preventDefault();
                    firstElement.focus();
                }
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "hidden"; // Bloquear scroll del fondo

        // Enfocar el modal o su primer elemento interactivo
        setTimeout(() => {
            if (modalRef.current) {
                modalRef.current.focus();
            }
        }, 50);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";

            // Restaurar foco al cerrar
            if (previousActiveElement.current) {
                previousActiveElement.current.focus();
            }
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (closeOnOverlayClick && e.target === e.currentTarget) {
            onClose();
        }
    };

    const titleId = title ? "custom-modal-title" : undefined;

    return (
        <div
            className={styles.overlay}
            onClick={handleOverlayClick}
            role="presentation"
        >
            <div
                ref={modalRef}
                className={`${styles.modal} ${styles[size]}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                tabIndex={-1}
            >
                <header className={styles.header}>
                    {title && (
                        <h2 id={titleId} className={styles.title}>
                            {title}
                        </h2>
                    )}
                    {showCloseButton && (
                        <button
                            type="button"
                            className={styles.closeButton}
                            onClick={onClose}
                            aria-label="Cerrar modal"
                        >
                            <svg
                                aria-hidden="true"
                                viewBox="0 0 24 24"
                                className={styles.closeIcon}
                            >
                                <path
                                    fill="currentColor"
                                    d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                                />
                            </svg>
                        </button>
                    )}
                </header>

                <div className={styles.body}>{children}</div>

                {footer && <footer className={styles.footer}>{footer}</footer>}
            </div>
        </div>
    );
};

export default CustomModal;