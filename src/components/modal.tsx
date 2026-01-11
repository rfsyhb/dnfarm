import { createPortal } from 'react-dom';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export function Modal({ open, onClose, children }: ModalProps) {
  if (!open) return null;

  const portal = document.getElementById('portal-modal');
  if (!portal) return null;

  return createPortal(
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* modal content */}
      <div className="relative z-10 bg-white p-4 rounded">{children}</div>
    </div>,
    portal
  );
}
