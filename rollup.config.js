import babel from "rollup-plugin-babel";
import { uglify } from "rollup-plugin-uglify";

const plugins = [
    babel({
        exclude: "node_modules/**",
        presets: [
            ["@babel/env", { modules: false }]
        ]
    }),
    uglify()
];

export default [{
    input: "./index.js",
    output: {
        name: "MiniLazyload",
        file: "dist/minilazyload.min.js",
        format: "iife",
    },
    plugins,
}, {
    input: "./usenativelazyload.js",
    output: {
        name: "useNativeLazyload",
        file: "dist/usenativelazyload.min.js",
        format: "iife",
    },
    plugins,
}];