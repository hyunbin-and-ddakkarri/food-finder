import React, { useState } from 'react';
import { columnStyle } from './style'

interface TagCellProps {
  value: string[];
  onValueChange: (value: string[]) => void;
}

const TagCell: React.FC<TagCellProps> = ({ value, onValueChange }) => {
  const [newTag, setNewTag] = useState("");

  const handleDelete = (tagToRemove: string) => {
    onValueChange(value.filter(tag => tag !== tagToRemove));
  };

  const handleAdd = () => {
    if (newTag.trim() !== "" && !value.includes(newTag)) {
      onValueChange([...value, newTag]);
      setNewTag("");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTag(e.target.value);
  };

  return (
    <td style={columnStyle}>
      {value.map(tag => (
        <div key={tag}>
          {tag}
          <button onClick={() => handleDelete(tag)}>x</button>
        </div>
      ))}
      <input value={newTag} onChange={handleInputChange} />
      <button onClick={handleAdd}>+</button>
    </td>
  );
};

export default TagCell;