/**
 * A reusable modal component that displays content when triggered.
 */

type ModalProps = {
  id: string; // Unique identifier for the modal.
  children: React.ReactNode; // Content to be displayed inside the modal.
  className?: string; // Optional classNames to be applied to the modal.
  closeOnOutsideClick?: boolean; // Option to close the modal on outside click.
};

const Modal: React.FC<ModalProps> = ({ id, children, className, closeOnOutsideClick = true }) => {
  return (
    <div role="dialog">
      {/* Checkbox for toggling the modal. */}
      <input type="checkbox" id={`modal-${id}`} className="modal-toggle" />
      <div className={`modal ${className || ""}`}>
        <div className="modal-box">
          {/* Close button for the modal. */}
          <label htmlFor={`modal-${id}`} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </label>
          {/* Modal content. */}
          {children}
        </div>
        {/* Transparent backdrop for closing on outside click */}
        {closeOnOutsideClick && <label htmlFor={`modal-${id}`} className="modal-backdrop" />}
      </div>
    </div>
  );
};

export default Modal;
