
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './globals.css'
export default function SearchBar() {
    return (
        <>
        <div className="box">
            <i className="fa-regular fa-magnifying-glass"></i>
            <input type="text" placeholder="Search here" className="search" />

        </div>
        </>
    );
}