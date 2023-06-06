'use client'
import React from 'react';
import Link from "next/link"
import {
    Tab,
    initTE,
} from "tw-elements";

initTE({ Tab });

const Page = () => {
    return (
        <div>
            <Link href="/listview">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="h-8 w-8">
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M11.25 9l-3 3m0 0l3 3m-3-3h7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </Link>
            <p className="text-lg font-semibold text-gray-900 truncate dark:text-white">
                restaurant_name
            </p>
            <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                rating :
            </p>
            <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                open :
            </p>

            <div className="container mx-auto px-5 py-2 lg:px-32 lg:pt-24">
                <div className="-m-1 flex flex-wrap md:-m-2">
                    <div className="flex w-1/2 flex-wrap">
                        <div className="w-1/2 p-1 md:p-2">
                            <img
                                alt="gallery"
                                className="block h-full w-full rounded-lg object-cover object-center"
                                src="https://tecdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(70).webp" />
                        </div>
                        <div className="w-1/2 p-1 md:p-2">
                            <img
                                alt="gallery"
                                className="block h-full w-full rounded-lg object-cover object-center"
                                src="https://tecdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(72).webp" />
                        </div>
                        <div className="w-full p-1 md:p-2">
                            <img
                                alt="gallery"
                                className="block h-full w-full rounded-lg object-cover object-center"
                                src="https://tecdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(73).webp" />
                        </div>
                    </div>
                    <div className="flex w-1/2 flex-wrap">
                        <div className="w-full p-1 md:p-2">
                            <img
                                alt="gallery"
                                className="block h-full w-full rounded-lg object-cover object-center"
                                src="https://tecdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(74).webp" />
                        </div>
                        <div className="w-1/2 p-1 md:p-2">
                            <img
                                alt="gallery"
                                className="block h-full w-full rounded-lg object-cover object-center"
                                src="https://tecdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(75).webp" />
                        </div>
                        <div className="w-1/2 p-1 md:p-2">
                            <img
                                alt="gallery"
                                className="block h-full w-full rounded-lg object-cover object-center"
                                src="https://tecdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(77).webp" />
                        </div>
                    </div>
                </div>
            </div>

            <ul
                className="mb-5 flex list-none flex-row flex-wrap border-b-0 pl-0"
                role="tablist"
                data-te-nav-ref>
                <li role="presentation" className="flex-auto text-center">
                    <a
                        href="#tabs-home01"
                        className="my-2 block border-x-0 border-b-2 border-t-0 border-transparent px-7 pb-3.5 pt-4 text-xs font-medium uppercase leading-tight text-neutral-500 hover:isolate hover:border-transparent hover:bg-neutral-100 focus:isolate focus:border-transparent data-[te-nav-active]:border-primary data-[te-nav-active]:text-primary dark:text-neutral-400 dark:hover:bg-transparent dark:data-[te-nav-active]:border-primary-400 dark:data-[te-nav-active]:text-primary-400"
                        data-te-toggle="pill"
                        data-te-target="#tabs-home01"
                        data-te-nav-active
                        role="tab"
                        aria-controls="tabs-home01"
                        aria-selected="true"
                    >Menu</a
                    >
                </li>
                <li role="presentation" className="flex-auto text-center">
                    <a
                        href="#tabs-profile01"
                        className="focus:border-transparen my-2 block border-x-0 border-b-2 border-t-0 border-transparent px-7 pb-3.5 pt-4 text-xs font-medium uppercase leading-tight text-neutral-500 hover:isolate hover:border-transparent hover:bg-neutral-100 focus:isolate data-[te-nav-active]:border-primary data-[te-nav-active]:text-primary dark:text-neutral-400 dark:hover:bg-transparent dark:data-[te-nav-active]:border-primary-400 dark:data-[te-nav-active]:text-primary-400"
                        data-te-toggle="pill"
                        data-te-target="#tabs-profile01"
                        role="tab"
                        aria-controls="tabs-profile01"
                        aria-selected="false"
                    >info</a
                    >
                </li>
                <li role="presentation" className="flex-auto text-center">
                    <a
                        href="#tabs-messages01"
                        className="my-2 block border-x-0 border-b-2 border-t-0 border-transparent px-7 pb-3.5 pt-4 text-xs font-medium uppercase leading-tight text-neutral-500 hover:isolate hover:border-transparent hover:bg-neutral-100 focus:isolate focus:border-transparent data-[te-nav-active]:border-primary data-[te-nav-active]:text-primary dark:text-neutral-400 dark:hover:bg-transparent dark:data-[te-nav-active]:border-primary-400 dark:data-[te-nav-active]:text-primary-400"
                        data-te-toggle="pill"
                        data-te-target="#tabs-messages01"
                        role="tab"
                        aria-controls="tabs-messages01"
                        aria-selected="false"
                    >Reviews</a
                    >
                </li>

            </ul>

            <div className="mb-6">
                <div
                    className="hidden opacity-100 transition-opacity duration-150 ease-linear data-[te-tab-active]:block"
                    id="tabs-home01"
                    role="tabpanel"
                    aria-labelledby="tabs-home-tab01"
                    data-te-tab-active>
                    Tab 1 content
                </div>
                <div
                    className="hidden opacity-0 transition-opacity duration-150 ease-linear data-[te-tab-active]:block"
                    id="tabs-profile01"
                    role="tabpanel"
                    aria-labelledby="tabs-profile-tab01">
                    Tab 2 content
                </div>
                <div
                    className="hidden opacity-0 transition-opacity duration-150 ease-linear data-[te-tab-active]:block"
                    id="tabs-messages01"
                    role="tabpanel"
                    aria-labelledby="tabs-profile-tab01">
                    Tab 3 content
                </div>

            </div>


        </div>
    );
};

export default Page;
