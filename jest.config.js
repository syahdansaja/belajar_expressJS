export default {
    transform: {
        "^.+\\.js$": "babel-jest"
    },
    testEnvironment: "node",
    testMatch: [
        "**/tests/units/**/*.test.js",
        "**/tests/integrations/**/*.test.js"
    ],
    moduleNameMapper: {
        "^(\\.{1,2}/.*)\\.js$": "$1",
    },

}