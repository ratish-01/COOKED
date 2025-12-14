const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');

console.log("CWD:", process.cwd());

const tailwindConfig = {
    content: [
        path.resolve(__dirname, "index.html"),
        path.resolve(__dirname, "src/**/*.jsx"),
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            colors: {
                spotify: '#1DB954',
                dark: '#121212',
                darker: '#080808',
                card: '#181818',
                neon: '#b026ff',
            }
        },
    },
    plugins: [],
};

const inputFile = path.resolve(__dirname, 'src/index.css');
const outputFile = path.resolve(__dirname, 'src/output.css');

console.log("Input:", inputFile);

try {
    const css = fs.readFileSync(inputFile, 'utf8');
    console.log("CSS Read. Length:", css.length);

    postcss([
        tailwindcss(tailwindConfig),
        autoprefixer
    ])
        .process(css, { from: inputFile, to: outputFile })
        .then(result => {
            fs.writeFileSync(outputFile, result.css);
            console.log("CSS Built Successfully to", outputFile);
        })
        .catch(error => {
            console.error("PostCSS Error:", error);
        });
} catch (e) {
    console.error("FS Error:", e);
}
