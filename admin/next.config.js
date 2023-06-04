/** @type {import('next').NextConfig} */
const nextConfig = {
    // this is for the next export
    // added in next.js 13
    // this will export the app in the /out folder
    output: "export",
    images: { unoptimized: true } 
}

module.exports = nextConfig
