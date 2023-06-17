
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import './globals.css'


interface SearchBarProps {
    setText?: React.Dispatch<React.SetStateAction<string>>;
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
        <div className="w-screen max-w-lg m-2 flex flex-col gap-2">
            <div className="p-3 shadow-md rounded-lg h-10 flex space-x-2 w-full bg-white items-center">
                <FontAwesomeIcon icon={faSearch} />
                {   props.text == null ? (
                        <input id="inp" type="text" placeholder="Search here" className="grow cleanInput" onChange={onChange}/>
                ) : (
                        <input id="inp" type="text" placeholder={props.text} className="grow cleanInput" value={props.text} readOnly/>
                )}
                

            </div>
            <div className="flex text-base gap-2">
                <div className="rounded-full bg-danger px-3 py-1">
                    Price
                </div>
                <div className="rounded-full bg-danger px-3 py-1">
                    Price
                </div>
                <div className="rounded-full bg-danger px-3 py-1">
                    Price
                </div>
                <div className="rounded-full bg-danger px-3 py-1">
                    Price
                </div>
            </div>
        </div>
        </>
    );
}

SearchBar.defaultProps = {
    setText: null,
    backButton: false,
    text: null,
};