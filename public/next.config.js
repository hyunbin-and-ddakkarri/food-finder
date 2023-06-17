/** @type {import('next').NextConfig} */
const nextConfig = {
    // this is for the next export
    // added in next.js 13
    // this will export the app in the /out folder
    output: "export",
}

const withPlugins = require("next-compose-plugins");
const withPWA = require("next-pwa");

module.exports = withPlugins(
    [
        [
            withPWA,
            {
                pwa: {
                    dest: "public",
                    // disable: process.env.NODE_ENV === "development",
                },
            },
        ],
    ],
    nextConfig
);