import React, { useState } from "react";
import { columnStyle } from "./style";
import {
  faEdit,
  faCircleXmark,
  faCirclePlus,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
interface MenuCellProps {
  value: { [menu: string]: number };
  onValueChange: (value: { [menu: string]: number }) => void;
}

const MenuCell: React.FC<MenuCellProps> = ({ value, onValueChange }) => {
  const [editMenu, setEditMenu] = useState<string | null>(null);
  const [tempMenu, setTempMenu] = useState<{ key: string; value: string }>({
    key: "",
    value: "",
  });
  const [newMenu, setNewMenu] = useState<{ key: string; value: string }>({
    key: "",
    value: "",
  });

  const handleEdit = (menu: string) => {
    setEditMenu(menu);
    setTempMenu({ key: menu, value: value[menu].toString() });
  };

  const handleSave = (menu: string) => {
    const updatedValue = {...value};
    delete updatedValue[menu];
    const price = Number(tempMenu.value);
    updatedValue[tempMenu.key] = !isNaN(price) ? price : value[menu];
    onValueChange(updatedValue);
    setEditMenu(null);
  };

  const handleTempChange = (key: string, value: string) => {
    setTempMenu({ key, value });
  };

  const handleDelete = (menu: string) => {
    const { [menu]: _, ...rest } = value;
    onValueChange(rest);
  };

  const handleNewChange = (key: string, value: string) => {
    setNewMenu({ key, value });
  };

  const handleAdd = () => {
    onValueChange({ ...value, [newMenu.key]: Number(newMenu.value) });
    setNewMenu({ key: "", value: "" });
  };

  return (
    <td className="border px-1 py-2 cursor-pointer w-fit" style={columnStyle}>
      {Object.keys(value).map((menu) => (
        <div className="flex text-gray-800 py-1 px-3 m-1" key={menu}>
          {editMenu === menu ? (
            <input
              className="mr-2"
              value={tempMenu.key}
              size={10}
              onChange={(e) => handleTempChange(e.target.value, tempMenu.value)}
            />
          ) : (
            <input
              disabled
              value={menu}
              size={10}
              className="bg-transparent mr-2"
            />
          )}
          {editMenu === menu ? (
            <input
              value={tempMenu.value}
              size={6}
              onChange={(e) => handleTempChange(tempMenu.key, e.target.value)}  
            />
          ) : (
            <input
              disabled
              value={value[menu]}
              size={6}
              className="bg-transparent"
            />
          )}
          <button
            className="ml-2 w-fit"
            onClick={() =>
              editMenu === menu
                ? handleSave(menu)
                : handleEdit(menu)
            }
          >
            {editMenu === menu ? (
              <FontAwesomeIcon icon={faCheck} />
            ) : (
              <FontAwesomeIcon icon={faEdit} />
            )}
          </button>
          <button className="ml-2 w-fit" onClick={() => handleDelete(menu)}>
            <FontAwesomeIcon icon={faCircleXmark} />
          </button>
        </div>
      ))}
      <div className="flex text-gray-800 py-1 px-3 m-1">
        <input
          className="bg-transparent border-b-2 mr-2"
          size={10}
          value={newMenu.key}
          onChange={(e) => handleNewChange(e.target.value, newMenu.value)}
          placeholder="Menu"
        />
        <input
          className="bg-transparent border-b-2"
          size={6}
          value={newMenu.value}
          onChange={(e) => handleNewChange(newMenu.key, e.target.value)}
          placeholder="Value"
        />
        <button className="ml-2 w-fit" onClick={handleAdd}>
          <FontAwesomeIcon icon={faCirclePlus} />
        </button>
      </div>
    </td>
  );
};

export default MenuCell;
