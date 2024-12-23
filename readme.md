# E-Commerce ExpressJS
## Prerequisite
- NodeJS v22 or latest
- npm / nodejs package manager
- Git

## How to setup
```aiignore
#Clone Repository
git clone https://github.com/syahdansaja/belajar_expressJS.git

# copy .env.examples file
cp .env.examples

#make avatars directory
mkdir ./storage/avatars

# install dependencies
npm install
```

### than cofigure .env file with your account and app key

## how to generate app key
- open your terminal
- write this command
```
# Enter into NodeJS REPL
node

#after you success to enter into NodeJS REPL , than write this code
const crypto =  require("crypto");
console.log(crypto.randomBytes(32).toString("hex")); // 32 is length of key code
```