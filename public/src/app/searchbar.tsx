
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import './globals.css'
export default function SearchBar() {
    return (
        <>
        <div className="container m-2 p-2 shadow-md rounded-lg h-10 flex space-x-2 w-screen">
            <FontAwesomeIcon icon={faSearch} size='lg'/>
            <input type="text" placeholder="Search here" className="grow cleanInput" />

        </div>
        </>
    );
}