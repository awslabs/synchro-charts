// We need to use the UMD version of the d3-color package, but we also
// need to bump to a version where the ESM version has been made the default
// due to a vulnerability (see https://github.com/d3/d3-color/issues/97).
// Yarn v1 does not understand the package.json "exports" property, so we
// must write the UMD export path into the "main" property.
const d3ColorPackageJsonPath = '/node_modules/d3-color/package.json';
// eslint-disable-next-line import/no-dynamic-require
const d3ColorPackageJson = require(process.cwd() + d3ColorPackageJsonPath);
d3ColorPackageJson.main = d3ColorPackageJson.exports.umd;
require('fs').writeFileSync(process.cwd() + d3ColorPackageJsonPath, JSON.stringify(d3ColorPackageJson, null, 2));
