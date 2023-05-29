import { columnStyle } from './style'

interface ClickableCellProps {
    onClick: () => void;
    value: string
  }
  
const ClickableCell: React.FC<ClickableCellProps> = ({ onClick, value }) => {
    return (
        <td className="border px-1 py-2 cursor-pointer" style={columnStyle} onClick={onClick}>{value}</td>
    )
}
export default ClickableCell;