
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import './globals.css'


interface SearchBarProps {
    setText?: React.Dispatch<React.SetStateAction<string>>;
    linked?: boolean;
    backButton?: boolean;
    text?: string;
}

export default function SearchBar(props: SearchBarProps) {

    var onChange = () => {
        if (props.setText == null) return;
        var inp = document.getElementById("inp") as HTMLInputElement | null;
        if (inp != null) {
            props.setText(inp.value);
        }
    };

    return (
        <>
        <div className="container m-2 p-2 shadow-md rounded-lg h-10 flex space-x-2 w-screen bg-white">
            <FontAwesomeIcon icon={faSearch} size='lg'/>
            {   props.text == null ? (
                    <input id="inp" type="text" placeholder="Search here" className="grow cleanInput" onChange={onChange}/>
            ) : (
                    <input id="inp" type="text" placeholder={props.text} className="grow cleanInput" value={props.text}/>
            )}
            

        </div>
        </>
    );
}

SearchBar.defaultProps = {
    setText: null,
    linked: false,
    backButton: false,
    text: null,
};