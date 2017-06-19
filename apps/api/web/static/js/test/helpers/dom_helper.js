/* eslint-disable */
var jsdom = require('jsdom')
var _ = require('lodash')
// setup the simplest document possible
var doc = jsdom.jsdom('<!doctype html><html><body><div id="root" /></body></html>')

// get the window object out of the document
var win = doc.defaultView

global.navigator = {
  userAgent: 'node.js'
}

// set globals for mocha that make access to document and window feel
// natural in the test environment
global.document = doc
global.window = win

export const localStorage = {
  getItem: _.noop,
  setItem: _.noop,
  removeItem: _.noop
}

global.localStorage = localStorage

export default (window) => {
  for (let key in window) {
    if (!window.hasOwnProperty(key)) continue
    if (key in global) continue

    global[key] = window[key]
  }
}