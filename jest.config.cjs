const { JSDOM } = require('jsdom');

const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
global.document = jsdom.window.document;
global.window = jsdom.window;
global.navigator = {
  userAgent: 'node.js',
};

module.exports = {
  // Other Jest configuration options...
  
  // Specify the Babel transformer for JSX files
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  testEnvironment: 'jsdom', // Use JSDOM environment
  // Include this line
  testEnvironmentOptions: {
    verbose: true,
  },
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
};

//expect(true).toBe(true);
//npx jest --verbose
