// polyfill needs to be in separate entry file, otherwise babel screws up the line order and
// it is loaded too late, giving "regeneratorRuntime is not defined"
require("babel-polyfill")
require('./main')().then(() => process.exit())

