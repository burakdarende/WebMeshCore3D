// ═══════════════════════════════════════════════════════════════════════════════
// MODAL SYSTEM - Universal Modal/Popup Manager
// ═══════════════════════════════════════════════════════════════════════════════
// Modern modal system with Radix UI, glass morphism, and smooth animations

import React, { useState, createContext, useContext } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

// Modal Styles
const modalStyles = {
  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 9998,
    background: "rgba(0, 0, 0, 0.3)",
    // Do not apply blur on the overlay - only the modal content should be blurred
    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
  },
  overlayGlass: {
    background: "rgba(0, 0, 0, 0.2)",
    // Do not apply blur on the glass overlay either
  },
  overlayOpen: {
    opacity: 1,
  },
  overlayClose: {
    opacity: 0,
  },
  content: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 9999,
    background: "rgba(0, 0, 0, 0.1)", // Translucent dark background
    backdropFilter: "blur(20px) saturate(120%)",
    borderRadius: "12px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
    maxHeight: "90vh",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
    WebkitBackdropFilter: "blur(20px) saturate(120%)", // Safari support
  },
  contentSizes: {
    small: { width: "90%", maxWidth: "400px" },
    medium: { width: "90%", maxWidth: "600px" },
    large: { width: "90%", maxWidth: "900px" },
    fullscreen: {
      width: "95vw",
      height: "95vh",
      maxWidth: "none",
      maxHeight: "none",
    },
  },
  contentOpen: {
    opacity: 1,
    transform: "translate(-50%, -50%) scale(1)",
  },
  contentClose: {
    opacity: 0,
    transform: "translate(-50%, -50%) scale(0.96)",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "20px 24px 0",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    marginBottom: "20px",
    paddingBottom: "16px",
  },
  title: {
    fontSize: "1.25rem",
    fontWeight: 600,
    margin: 0,
    color: "rgba(255, 255, 255, 0.95)",
    letterSpacing: "-0.025em",
  },
  closeButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "28px",
    height: "28px",
    borderRadius: "6px",
    border: "none",
    background: "rgba(255, 255, 255, 0.1)",
    color: "rgba(255, 255, 255, 0.8)",
    cursor: "pointer",
    transition: "all 0.15s ease",
  },
  closeButtonHover: {
    background: "rgba(255, 255, 255, 0.2)",
    color: "rgba(255, 255, 255, 1)",
    transform: "scale(1.05)",
  },
  body: {
    flex: 1,
    padding: "0 24px",
    overflowY: "auto",
    color: "rgba(255, 255, 255, 0.9)",
  },
  footer: {
    padding: "16px 24px 24px",
    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
    marginTop: "24px",
  },
  // Preset styles
  infoModal: {
    display: "flex",
    gap: "16px",
    alignItems: "flex-start",
  },
  infoIcon: {
    fontSize: "24px",
    flexShrink: 0,
  },
  infoContent: {
    flex: 1,
    lineHeight: 1.6,
  },
  confirmModal: {
    textAlign: "center",
  },
  confirmIcon: {
    fontSize: "48px",
    marginBottom: "16px",
  },
  confirmContent: {
    margin: "0 0 24px",
    fontSize: "1.1rem",
    lineHeight: 1.5,
  },
  confirmActions: {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
  },
  btnBase: {
    padding: "12px 24px",
    borderRadius: "8px",
    border: "none",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s ease",
    minWidth: "100px",
  },
  btnConfirm: {
    background: "#ef4444",
    color: "white",
  },
  btnCancel: {
    background: "rgba(0, 0, 0, 0.1)",
    color: "rgba(0, 0, 0, 0.8)",
  },
  imageModal: {
    textAlign: "center",
  },
  modalImage: {
    maxWidth: "100%",
    maxHeight: "70vh",
    objectFit: "contain",
    borderRadius: "8px",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
  },
  imageCaption: {
    margin: "16px 0 0",
    color: "rgba(0, 0, 0, 0.7)",
    fontStyle: "italic",
  },
};

// Modal Context for global state management
const ModalContext = createContext();

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within ModalProvider");
  }
  return context;
};

// Modal Provider Component
export function ModalProvider({ children }) {
  const [modals, setModals] = useState(new Map());

  const openModal = (modalId, content, options = {}) => {
    setModals(
      (prev) =>
        new Map(
          prev.set(modalId, {
            isOpen: true,
            content,
            options: {
              title: options.title || "Modal",
              size: options.size || "medium", // small, medium, large, fullscreen
              closeOnOutsideClick: options.closeOnOutsideClick !== false,
              showCloseButton: options.showCloseButton !== false,
              glassMorphism: options.glassMorphism !== false,
              animation: options.animation || "fade", // fade, slide, zoom
              ...options,
            },
          })
        )
    );
  };

  const closeModal = (modalId) => {
    setModals((prev) => {
      const newModals = new Map(prev);
      const modal = newModals.get(modalId);
      if (modal) {
        newModals.set(modalId, { ...modal, isOpen: false });
        // Remove modal after animation completes
        setTimeout(() => {
          newModals.delete(modalId);
          setModals(new Map(newModals));
        }, 300);
      }
      return new Map(newModals);
    });
  };

  const closeAllModals = () => {
    setModals((prev) => {
      const newModals = new Map();
      prev.forEach((modal, modalId) => {
        newModals.set(modalId, { ...modal, isOpen: false });
      });

      setTimeout(() => {
        setModals(new Map());
      }, 300);

      return newModals;
    });
  };

  const value = {
    modals,
    openModal,
    closeModal,
    closeAllModals,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
      <ModalRenderer />
    </ModalContext.Provider>
  );
}

// Modal Renderer - Renders all active modals
function ModalRenderer() {
  const { modals, closeModal } = useModal();

  return (
    <>
      {Array.from(modals.entries()).map(([modalId, modal]) => (
        <ModalComponent
          key={modalId}
          modalId={modalId}
          modal={modal}
          onClose={() => closeModal(modalId)}
        />
      ))}
    </>
  );
}

// Individual Modal Component
function ModalComponent({ modalId, modal, onClose }) {
  const { content, options, isOpen } = modal;
  const [closeButtonHovered, setCloseButtonHovered] = useState(false);

  const getContentStyle = () => {
    const baseStyle = { ...modalStyles.content };
    const sizeStyle =
      modalStyles.contentSizes[options.size] || modalStyles.contentSizes.medium;
    const stateStyle = isOpen
      ? modalStyles.contentOpen
      : modalStyles.contentClose;

    return { ...baseStyle, ...sizeStyle, ...stateStyle };
  };

  const getOverlayStyle = () => {
    const baseStyle = { ...modalStyles.overlay };
    const glassStyle = options.glassMorphism ? modalStyles.overlayGlass : {};
    const stateStyle = isOpen
      ? modalStyles.overlayOpen
      : modalStyles.overlayClose;

    return { ...baseStyle, ...glassStyle, ...stateStyle };
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay style={getOverlayStyle()} />
        <Dialog.Content
          style={getContentStyle()}
          onInteractOutside={(e) => {
            if (!options.closeOnOutsideClick) {
              e.preventDefault();
            }
          }}
        >
          {/* Header */}
          <div style={modalStyles.header}>
            <Dialog.Title style={modalStyles.title}>
              {options.title}
            </Dialog.Title>
            {options.showCloseButton && (
              <Dialog.Close asChild>
                <button
                  style={{
                    ...modalStyles.closeButton,
                    ...(closeButtonHovered ? modalStyles.closeButtonHover : {}),
                  }}
                  onMouseEnter={() => setCloseButtonHovered(true)}
                  onMouseLeave={() => setCloseButtonHovered(false)}
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </Dialog.Close>
            )}
          </div>

          {/* Content */}
          <div style={modalStyles.body}>{content}</div>

          {/* Footer (if provided) */}
          {options.footer && (
            <div style={modalStyles.footer}>{options.footer}</div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// Preset Modal Components
export function InfoModal({ title, children, ...props }) {
  return (
    <div style={modalStyles.infoModal}>
      <div style={modalStyles.infoIcon}>ℹ️</div>
      <div style={modalStyles.infoContent}>{children}</div>
    </div>
  );
}

export function ConfirmModal({
  title,
  message,
  onConfirm,
  onCancel,
  ...props
}) {
  const [confirmHovered, setConfirmHovered] = useState(false);
  const [cancelHovered, setCancelHovered] = useState(false);

  return (
    <div style={modalStyles.confirmModal}>
      <div style={modalStyles.confirmIcon}>⚠️</div>
      <div>
        <p style={modalStyles.confirmContent}>{message}</p>
        <div style={modalStyles.confirmActions}>
          <button
            style={{
              ...modalStyles.btnBase,
              ...modalStyles.btnConfirm,
              ...(confirmHovered
                ? { background: "#dc2626", transform: "translateY(-1px)" }
                : {}),
            }}
            onMouseEnter={() => setConfirmHovered(true)}
            onMouseLeave={() => setConfirmHovered(false)}
            onClick={onConfirm}
          >
            Confirm
          </button>
          <button
            style={{
              ...modalStyles.btnBase,
              ...modalStyles.btnCancel,
              ...(cancelHovered
                ? {
                    background: "rgba(0, 0, 0, 0.15)",
                    transform: "translateY(-1px)",
                  }
                : {}),
            }}
            onMouseEnter={() => setCancelHovered(true)}
            onMouseLeave={() => setCancelHovered(false)}
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export function ImageModal({ src, alt, caption, ...props }) {
  return (
    <div style={modalStyles.imageModal}>
      <img src={src} alt={alt} style={modalStyles.modalImage} />
      {caption && <p style={modalStyles.imageCaption}>{caption}</p>}
    </div>
  );
}

// Hook for easy modal usage
export function useModalActions() {
  const { openModal, closeModal, closeAllModals } = useModal();

  const showInfo = (title, content, options = {}) => {
    const modalId = `info-${Date.now()}`;
    openModal(modalId, <InfoModal title={title}>{content}</InfoModal>, {
      title,
      size: "medium",
      ...options,
    });
    return modalId;
  };

  const showConfirm = (message, onConfirm, options = {}) => {
    return new Promise((resolve) => {
      const modalId = `confirm-${Date.now()}`;
      openModal(
        modalId,
        <ConfirmModal
          message={message}
          onConfirm={() => {
            closeModal(modalId);
            resolve(true);
            onConfirm && onConfirm();
          }}
          onCancel={() => {
            closeModal(modalId);
            resolve(false);
          }}
        />,
        {
          title: options.title || "Confirm",
          size: "small",
          closeOnOutsideClick: false,
          ...options,
        }
      );
    });
  };

  const showImage = (src, alt, caption, options = {}) => {
    const modalId = `image-${Date.now()}`;
    openModal(modalId, <ImageModal src={src} alt={alt} caption={caption} />, {
      title: alt || "Image",
      size: "large",
      ...options,
    });
    return modalId;
  };

  const showCustom = (content, options = {}) => {
    const modalId = `custom-${Date.now()}`;
    openModal(modalId, content, options);
    return modalId;
  };

  return {
    showInfo,
    showConfirm,
    showImage,
    showCustom,
    closeModal,
    closeAllModals,
  };
}

export default ModalProvider;
