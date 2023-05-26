import { columnStyle } from './style'

interface ClickableCellProps {
    onClick: () => void;
  }
  
const ClickableCell: React.FC<ClickableCellProps> = ({ onClick }) => {
    return (
        <td className="border px-1 py-2 cursor-pointer" style={columnStyle} onClick={onClick}>View</td>
    )
}
export default ClickableCell;