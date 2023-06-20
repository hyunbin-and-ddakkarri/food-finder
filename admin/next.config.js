const IS_DOCKER = process.env.IS_DOCKER === "true"

/** @type {import('next').NextConfig} */
const nextConfig = {
    // this is for the next export
    // added in next.js 13
    // this will export the app in the /out folder
    // output: "export",
    images: { unoptimized: true },
    basePath: IS_DOCKER ? "/admin" : "/",
}

module.exports = nextConfig
