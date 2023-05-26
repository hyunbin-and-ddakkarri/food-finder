"use client";
import { useEffect, useState } from 'react';

interface EditableCellModalProps {
  isOpen: boolean;
  onClose: () => void;
  value: string;
  onValueChange: (value: string) => void;
}

const EditableCellModal: React.FC<EditableCellModalProps> = ({ isOpen, onClose, value, onValueChange }) => {
  const [editedValue, setEditedValue] = useState(value);

  useEffect(() => {
    setEditedValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedValue(e.target.value);
  };

  const handleSave = () => {
    onValueChange(editedValue);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  const modalStyle = {
    position: 'fixed' as 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 1000,
    background: '#fff',
    padding: '1em',
    width: '80%',
    maxWidth: '400px',
  };

  const overlayStyle = {
    position: 'fixed' as 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.5)',
    zIndex: 900,
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <textarea
          value={editedValue}
          onChange={handleChange}
          style={{ width: '100%', height: '200px', boxSizing: 'border-box' }}
        />
        <button onClick={handleSave}>Save</button>
      </div>
    </div>
  );
}

export default EditableCellModal;
