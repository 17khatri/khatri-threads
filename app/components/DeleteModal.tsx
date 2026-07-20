import Button from "./button";
import { Modal } from "./modal";

interface Props {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
  name: string;
}

export function DeleteModal({
  open,
  loading,
  onClose,
  onConfirm,
  name,
}: Props) {
  return (
    <Modal open={open} title="Delete Item" onClose={onClose}>
      <div className="space-y-6">
        <p>
          Are you sure you want to delete <strong>{name}</strong>?
        </p>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button variant="danger" disabled={loading} onClick={onConfirm}>
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
