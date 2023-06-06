import React, { useState } from 'react';
import { faCircleXmark, faCirclePlus } from'@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface CategoryCellProps {
  name: string;
  subCategories: string[];
  remove: (name: string) => void;
  onValueChange: (c: string, newValue: string[]) => void;
}

const CategoryCell: React.FC<CategoryCellProps> = ({ name, subCategories, remove, onValueChange }) => {
  const [newSub, setNewSub] = useState("");

  const handleDelete = (subToRemove: string) => {
    onValueChange(name, subCategories.filter(sub => sub !== subToRemove));
  };

  const handleAdd = () => {
    if (newSub.trim() !== "" && !subCategories.includes(newSub)) {
      onValueChange(name, [...subCategories, newSub]);
      setNewSub("");
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewSub(e.target.value);
  };

  return (
    <div className="w-1/2 pr-6 mb-6">
      <div className='shadow-md rounded-md bg-white p-6'>
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <div className="text-lg font-bold">{name}</div>
            <button className="px-4 py-2 secondaryButton rounded-md" onClick={() => remove(name)}>Remove</button>
          </div>
          <div className="flex flex-wrap justify-between border-t-2 border-gray-300 pt-4 mb-2 w-full">
            {subCategories.map(sub => (
              <div className='w-1/2 pr-2 mb-2' key={sub}>
                <div className='w-full flex text-gray-800 rounded-full py-1 px-3 border border-gray-400 rounded shadow justify-between'>
                  <div className='w-fit'>{sub}</div>
                  <button className='w-fit' onClick={() => handleDelete(sub)}><FontAwesomeIcon icon={faCircleXmark} className='secondaryIcon'/></button>
                </div>
              </div>
            ))}
          </div>
          <div className='flex text-gray-800 rounded-full py-1 px-3 border border-gray-400 rounded shadow'>
            <input className='border-b-2 mr-2 w-0 flex-grow' value={newSub} onChange={handleInputChange} />
            <button className='' onClick={handleAdd}><FontAwesomeIcon icon={faCirclePlus} className='primaryIcon' /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryCell;
