import React, { useState } from 'react';
import { columnStyle } from './style'
import { faCircleXmark, faCirclePlus } from'@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
    <td className="border px-1 py-2 cursor-pointer w-fit" style={columnStyle}>
      {value.map(tag => (
        <div className='flex justify-between bg-white hover:bg-gray-100 text-gray-800 rounded-full py-1 px-3 m-1 border border-gray-400 rounded shadow' key={tag}>
          <div className='mr-2'>{tag}</div>
          <button className='' onClick={() => handleDelete(tag)}><FontAwesomeIcon icon={faCircleXmark} /></button>
        </div>
      ))}
      <div className='flex bg-white hover:bg-gray-100 text-gray-800 rounded-full py-1 px-3 m-1 border border-gray-400 rounded shadow'>
        <input className='border-b-2 mr-2 w-0 flex-grow' value={newTag} onChange={handleInputChange} />
        <button className='' onClick={handleAdd}><FontAwesomeIcon icon={faCirclePlus} /></button>
      </div>
    </td>
  );
};

export default TagCell;