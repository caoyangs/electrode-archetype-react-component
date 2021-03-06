"use strict";

const Path = require("path");
const glob = require("glob");

const archDevRequire = require("electrode-archetype-react-component-dev/require");
const mergeWebpackConfig = archDevRequire("webpack-partial").default;
const atImport = archDevRequire("postcss-import");
const cssnext = archDevRequire("postcss-cssnext");
const styleLoader = archDevRequire.resolve("style-loader");
const cssLoader = archDevRequire.resolve("css-loader");
const postcssLoader = archDevRequire.resolve("postcss-loader");

/**
 * [cssModuleSupport By default, this archetype assumes you are using CSS-Modules + CSS-Next]
 *
 * Stylus is also supported for which the following cases can occur.
 *
 * case 1: *only* demo.css exists => CSS-Modules + CSS-Next
 * case 2: *only* demo.styl exists => stylus
 * case 3: *both* demo.css & demo.styl exists => CSS-Modules + CSS-Next takes priority
 *          with a warning message
 * case 4: *none* demo.css & demo.styl exists => CSS-Modules + CSS-Next takes priority
 */

const cssNextExists = (glob.sync(Path.join(process.cwd() + "/demo/*.css")).length > 0);
const stylusExists = (glob.sync(Path.join(process.cwd() + "/demo/*.styl")).length > 0);

// By default, this archetype assumes you are using CSS-Modules + CSS-Next
let cssModuleSupport = "?modules!" + postcssLoader;

if (stylusExists && !cssNextExists) {
  cssModuleSupport = "";
} else if (stylusExists && cssNextExists) {
  /* eslint-disable no-console */
  console.log(`**** you have demo.css & demo.styl please delete *.styl
    and upgrade to using *.css for CSS-Modules + CSS-Next support ****`);
  /* eslint-enable no-console */
}

module.exports = () => (config) => mergeWebpackConfig(config, {
  module: {
    loaders: [{
      name: "css",
      test: /\.css$/,
      /* eslint-disable prefer-template */
      loader: styleLoader + "!" + cssLoader + cssModuleSupport
      /* eslint-enable prefer-template */
    }]
  },
  postcss: function () {
    return cssModuleSupport ? [atImport, cssnext] : [];
  }
});
