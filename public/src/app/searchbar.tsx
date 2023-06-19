import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faSearch } from '@fortawesome/free-solid-svg-icons'
import { motion } from "framer-motion"
import { useState } from 'react'
import './globals.css'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'


export interface Filter {
    filterName: string;
    options: {[key: string]: boolean};
}


interface SearchBarProps {
    setText?: React.Dispatch<React.SetStateAction<string>>;
    link?: boolean;
    backButton?: boolean;
    text?: string;
    filters?: Array<Filter>;
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

    const [filters, setFilters] = useState([
        {filterName: 'Price', options: {'$': false, '$$': false, '$$$': false, '$$$$': false, '$$$$$': false},} as Filter, 
        {filterName: 'Mood', options: {'Casual': false, 'Formal': false, 'Romantic': false, 'Family': false, 'Business': false},} as Filter,
        {filterName: 'Rating', options: {'1': false, '2': false, '3': false, '4': false, '5': false},} as Filter,
        {filterName: 'Business Hours', options: {'open now': false}} as Filter,
    ] as Array<Filter>);

    var [tagOpen, setTagOpen] = useState(false);
    var [currentFilter, setCurrentFilter] = useState(0);
    

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
            <div className="flex text-base gap-2 flex-initial overflow-x-scroll noScrollBar">
                {
                    filters != null && (
                        filters.map((filter, index) => { 
                            return (
                                <motion.button className="rounded-full bg-neutral px-3 py-1 appearance-none w-auto min-w-0 shrink-0" onClick={() => {
                                    if (currentFilter != index) {
                                        setTagOpen(true);
                                    } else {
                                        setTagOpen(!tagOpen);
                                    }
                                    setCurrentFilter(index);
                                }} animate={{backgroundColor: (tagOpen && currentFilter == index) ? "var(--accent)": "var(--neutral)"}} key={index}>
                                {filter.filterName}
                                </motion.button>
                            );
                        }
                    ))
                }
            </div>
            {
                tagOpen && (
                    <div className="p-3 rounded-xl min-h-10 flex gap-4 bg-danger items-center flex-wrap justify-start space-between">
                        {
                            Object.keys(filters[currentFilter].options).map((option, index) => {
                                return (
                                    <div className="shrink-0 flex gap-2 items-center" key={index}>
                                        <input type="checkbox"  checked={filters[currentFilter].options[option]}/>
                                        <label className='text-base text-secondary font-medium'>{option}</label>
                                    </div>
                                )
                            })
                        }
                    </div>
                )
            }
        </div>
        </>
    );
}

SearchBar.defaultProps = {
    setText: null,
    link: false,
    backButton: false,
    text: null,
    filters: null,
};