const fs = require("fs");
const path = require("path");
const rollup = require('rollup').rollup;
const esbuild = require('rollup-plugin-esbuild').default;
const babel = require('@rollup/plugin-babel');
const resolve = require('@rollup/plugin-node-resolve').nodeResolve;
const uglify = require('uglify-js');

exports.buildJs = async (options) => {
  const minify = options.minify;
  const tokens = options.src.split("/");

  tokens.pop(); // basename

  // console.log(options);

  const id = tokens.pop();
  const src = options.src;
  const dist = "dist" + ("sw" === id ? "/sw" : ("script" === id ? "/script" : `/scripts/${id}`)) + (minify ? ".min" : "") + ".js";

  await (await rollup({
    input: options.src,
    plugins: [
      resolve(),
      esbuild({ minify: false }),
      babel.getBabelOutputPlugin({
        configFile: path.resolve(__dirname, '../.babelrc'),
        allowAllFormats: true,
      }),
      minify ? {
        name: 'minify',
        renderChunk(code) {
          const result = uglify.minify(code, {
            sourceMap: true,
            compress: {
              passes: 10,
            },
            output: {
              comments: /^!/,
            },
            toplevel: true,
            mangle: {
              reserved: "script" === id ? ["a",] : ["grecaptcha",],
              properties: {
                regex: /^_/,
              },
            },
          });

          if (result.error) {
            throw new Error(result.error);
          }

          return result;
        },
      } : false,
    ],
  })).write({
    ...{
      banner: `/*! lostpetjp | MIT | https://lostpet.jp/ */`,
      file: `${dist}`,
      //format: "cjs",
      //name: "test",
      // sourcemap: options.sourcemap,
    },
    //...(options.exports ? {
    //  exports: options.exports,
    //} : {})
  });

  // 環境変数の変換
  const convertPath = path.dirname(src) + "/.build/convert.json";

  if (fs.existsSync(convertPath)) {
    let fileText = fs.readFileSync(dist, "utf8");

    const buildJson = JSON.parse(fs.readFileSync(convertPath, "utf8"));

    for (let key in buildJson) {
      fileText = fileText.replace(new RegExp("\\$\\{\\{" + key + "\\}\\}", "g"), buildJson[key]);
    }

    fs.writeFileSync(dist, fileText);
  }

};