import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState, type ReactNode } from "react";
import { X } from "lucide-react";

export function ConfirmDialog({
  title,
  children,
  confirmLabel,
  busy = false,
  error,
  onConfirm,
  onCancel,
}: {
  title: string;
  children: ReactNode;
  confirmLabel: string;
  busy?: boolean;
  error?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Dialog.Root
      open
      onOpenChange={(open) => {
        if (!open && !busy) onCancel();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay admin-overlay" />
        <Dialog.Content
          className="admin-confirm"
          onEscapeKeyDown={(event) => {
            if (busy) event.preventDefault();
          }}
        >
          <Dialog.Title>{title}</Dialog.Title>
          <Dialog.Description asChild>
            <div className="admin-help">{children}</div>
          </Dialog.Description>
          {error && (
            <p className="admin-error" role="alert">
              {error}
            </p>
          )}
          <div className="admin-actions">
            <button
              className="admin-button"
              disabled={busy}
              onClick={onCancel}
              autoFocus
            >
              취소
            </button>
            <button
              className="admin-button danger"
              disabled={busy}
              onClick={onConfirm}
            >
              {busy ? "처리 중…" : confirmLabel}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function EditorDialog({
  title,
  description,
  dirty,
  busy,
  children,
  onClose,
  focusId,
}: {
  title: string;
  description: string;
  dirty: boolean;
  busy: boolean;
  children: ReactNode;
  onClose: () => void;
  focusId: string;
}) {
  const [discard, setDiscard] = useState(false);
  const requestClose = () => {
    if (!busy) {
      if (dirty) setDiscard(true);
      else onClose();
    }
  };
  useEffect(() => {
    const beforeUnload = (event: BeforeUnloadEvent) => {
      if (dirty || busy) event.preventDefault();
    };
    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, [dirty, busy]);
  return (
    <>
      <Dialog.Root
        open
        onOpenChange={(open) => {
          if (!open) requestClose();
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="dialog-overlay" />
          <Dialog.Content
            className="admin-editor"
            onEscapeKeyDown={(event) => {
              if (busy) event.preventDefault();
            }}
            onPointerDownOutside={(event) => event.preventDefault()}
            onCloseAutoFocus={(event) => {
              event.preventDefault();
              document.getElementById(focusId)?.focus();
            }}
          >
            <header className="admin-editor-header">
              <div>
                <Dialog.Title>{title}</Dialog.Title>
                <Dialog.Description>{description}</Dialog.Description>
              </div>
              <button
                className="icon-button"
                aria-label="편집 닫기"
                disabled={busy}
                onClick={requestClose}
              >
                <X size={20} />
              </button>
            </header>
            {children}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      {discard && (
        <ConfirmDialog
          title="수정 내용을 버릴까요?"
          confirmLabel="수정 내용 버리기"
          onConfirm={onClose}
          onCancel={() => setDiscard(false)}
        >
          저장하지 않은 변경 내용은 사라집니다.
        </ConfirmDialog>
      )}
    </>
  );
}
