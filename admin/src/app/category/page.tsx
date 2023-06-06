"use client";
import { faPlusCircle, faMinus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react';
import CategoryCell from './catcell';

export default function CategoryPage() {
  const [categories, setCategories] = useState<{[key: string]:Array<string>}>({
    "Korean": ["Bibimbap", "Grill", "Toekbokki", "Chicken"],
    "Western": ["Pizza", "French", "Italian", "Steak"],
    "Japanese": ["Sushi", "Katsu", "Bowl"]
  });

  const removeCategory = (c: string) => {
    const currentCats = {...categories}
    delete currentCats[c]
    setCategories(currentCats)
  }

  const handleCellValueChange = (
    c: string,
    newValue: string[]
  ) => {
    const updatedCats = {...categories};
    updatedCats[c] = newValue;
    setCategories(updatedCats);
  };

  

  return (
    <div className="block w-full h-full overflow-y-scroll justify-center items-center p-8 text-black">
      <div className="flex w-full justify-between items-center mb-8">
        <div className="text-2xl font-bold">Category management</div>
        <div className="ml-auto">
          Add new
          <FontAwesomeIcon icon={faPlusCircle} size='xl' className='primaryIcon ml-2'/>
        </div>
      </div>
      <div className='flex flex-wrap justify-between'>
      {
        Object.keys(categories).map((category, idx) => {
          return (
            <CategoryCell 
              key={idx}
              name={category}
              subCategories={categories[category]}
              remove={removeCategory}
              onValueChange={handleCellValueChange}
            />
          )
        })
      }
    </div>
    </div>
  );
}
