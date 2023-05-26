"use client";
import React, { useEffect, useState } from "react";
import EditableCellModal from "./popup";
import { columnStyle } from "./style";

interface EditableCellProps {
  value: string;
  onValueChange: (value: string) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  value,
  onValueChange,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState(value);

  useEffect(() => {
    setEditedValue(value);
  }, [value]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    onValueChange(editedValue);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedValue(e.target.value);
  };

  return isEditing ? (
    <td style={columnStyle}>
      <input
        value={editedValue}
        onChange={handleChange}
        onBlur={handleBlur}
        autoFocus
        style={{ width: "100%", boxSizing: "border-box" }}
      />
    </td>
  ) : (
    <td className="border px-1 py-2" style={columnStyle} onClick={handleEdit}>
      {value}
    </td>
  );
};

export default EditableCell;