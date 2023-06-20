import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faSearch } from '@fortawesome/free-solid-svg-icons'
import { motion } from "framer-motion"
import { useState } from 'react'
import './globals.css'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import { filters, filterOptions } from './filters'

interface SearchBarProps {
    setText?: React.Dispatch<React.SetStateAction<string>>;
    link?: boolean;
    backButton?: boolean;
    text?: string;
    options: { [key: string]: Array<Number> };
    setOptions: React.Dispatch<React.SetStateAction<{ [key: string]: Array<Number> }>>;
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

    const [displayedFilter, setDisplayedFilter] = useState(-1);
    

    if (props.options != null) {
        props.setOptions(props.options)
    }

    const handleOption = (filter: string, optionIdx: Number) => {
        const currentOptions = { ...props.options };
        if (props.options[filter].includes(optionIdx)) {
          currentOptions[filter] = currentOptions[filter].filter(
            (f) => f !== optionIdx
          );
        } else {
          currentOptions[filter].push(optionIdx);
        }
        props.setOptions(currentOptions);
      };

    var [tagOpen, setTagOpen] = useState(false);
    
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
                    filters.map((filter, index) => { 
                        return (
                            <motion.button className="rounded-full bg-neutral px-3 py-1 appearance-none w-auto min-w-0 shrink-0" onClick={() => {
                                if (displayedFilter != index) {
                                    setTagOpen(true);
                                } else {
                                    setTagOpen(!tagOpen);
                                }
                                setDisplayedFilter(index);
                            }} animate={{backgroundColor: (tagOpen && displayedFilter == index) ? "var(--accent)": "var(--neutral)"}} key={index}>
                            {filters[index]}
                            </motion.button>
                        );
                    })
                }
            </div>
            {
                tagOpen && (
                    <div className="p-3 rounded-xl min-h-10 flex gap-4 bg-danger items-center flex-wrap justify-start space-between">
                        {
                            filterOptions[filters[displayedFilter]].map((option, index) => {
                                return (
                                    <div className="shrink-0 flex gap-2 items-center" key={index}>
                                        <input type="checkbox"  checked={props.options[filters[displayedFilter]].includes(index)} onChange={() => handleOption(filters[displayedFilter], index)}/>
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
    text: null
};