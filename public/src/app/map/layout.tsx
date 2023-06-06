"use client";

import React from 'react';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Handle search functionality here
  };

  const handleFilter = (filter: string) => {
    // Handle filter functionality here
  };

  return (
    <html lang="en">
        <body>
            <div className="layout" style={{position: "relative"}}>
            <div className="search-bar" style={{display: "flex", margin: "15px 15px 5px 15px"}}>
                <input type="text" placeholder="Search" onChange={handleSearch} style={{width:"100%", height:"30px"}}/>
            </div>
            <div className="filter-buttons">
                <button onClick={() => handleFilter('filter1')}>Filter 1</button>
                <button onClick={() => handleFilter('filter2')}>Filter 2</button>
                <button onClick={() => handleFilter('filter3')}>Filter 3</button>
            </div>
            <div className="content" >{children}</div>
            </div>
        </body>
    </html>
  );
};

export default Layout;