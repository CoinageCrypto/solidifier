# Solidifier

Takes solidity code and flattens it into a concatenated version ready for Etherscan's verification tool, all in your browser! No server needed, no Python, nothing, just a browser and your folder of `.sol` files!

## Cloning

This project uses git submodules instead of NPM for `solidity-parser-antlr` because the NPM module is an ES6 module, which Create React App's Webpack config doesn't actually support.

After cloning, go to the root directory of this project and run:

```
git submodule update --init --recursive
```

## Running

```
yarn start
```

## Building

```
yarn build
```
