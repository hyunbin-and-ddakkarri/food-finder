
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faSearch } from '@fortawesome/free-solid-svg-icons'
import { motion } from "framer-motion"
import { useState } from 'react'
import './globals.css'
import Link from 'next/link'
import { useRouter } from 'next/navigation'


interface SearchBarProps {
    setText?: React.Dispatch<React.SetStateAction<string>>;
    link?: boolean;
    backButton?: boolean;
    text?: string;
}

export default function SearchBar(props: SearchBarProps) {

    const router = useRouter();

    var onChange = () => {
        if (props.setText == null) return;
        var inp = document.getElementById("inp") as HTMLInputElement | null;
        if (inp != null) {
            props.setText(inp.value);
        }
    };

    var [isOpen, setOpen] = useState(false);
    

    return (
        <>
        <div className="sticky top-4 full-container max-w-3xl m-2 flex flex-col gap-2">
            <div className="flex gap-2">
                {
                    props.backButton && (
                      <div className="flex rounded-full bg-white w-10 h-10 shadow-md" onClick={() => {router.back()}}>
                        <FontAwesomeIcon icon={faArrowLeft} style={{margin: "auto",}}/>
                      </div>
                    )
                }


                {
                    props.link ? (
                    <Link href='/' className="cursor-text grow">
                        <div className="p-3 shadow-md rounded-lg h-10 flex space-x-2 w-full bg-white items-center">
                            <FontAwesomeIcon icon={faSearch} />
                            {   props.text == null ? (
                                    <input id="inp" type="text" placeholder="Search here" className="grow cleanInput" onChange={onChange} autoFocus/>
                            ) : (
                                    <input id="inp" type="text" placeholder={props.text} className="grow cleanInput cursor-text" value={props.text} readOnly/>
                            )}
                            

                        </div>
                    </Link>
                    ): (
                    <div className="p-3 shadow-md rounded-lg h-10 flex space-x-2 w-full bg-white items-center grow">
                        <FontAwesomeIcon icon={faSearch} />
                        {   props.text == null ? (
                                <input id="inp" type="text" placeholder="Search here" className="grow cleanInput" onChange={onChange} autoFocus/>
                        ) : (
                                <input id="inp" type="text" placeholder={props.text} className="grow cleanInput cursor-text" value={props.text} readOnly/>
                        )}
                    </div>
                    )
                }
            </div>
            
                <div className="flex text-base gap-2">
                    <motion.div layout className="rounded-full bg-danger px-3 py-1" onClick={() => {setOpen(!isOpen)}}>
                        Price
                    </motion.div>
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
    link: false,
    backButton: false,
    text: null,
};