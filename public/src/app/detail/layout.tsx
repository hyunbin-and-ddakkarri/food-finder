'use client'
import React from "react";

const Layout = ( { children } : {
  children: React.ReactNode
} ) => (
  <div>
    <h1></h1>
    {children}
    <h1></h1>
  </div>

);

export default Layout;
