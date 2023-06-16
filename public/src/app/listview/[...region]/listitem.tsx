interface CategoryCellProps {
  name: string;
  subCategories: string[];
  remove: (name: string) => void;
  onValueChange: (c: string, newValue: string[]) => void;
}

const ListItem: React.FC<CategoryCellProps> = ({ name, subCategories, remove, onValueChange }) => {
  
}
