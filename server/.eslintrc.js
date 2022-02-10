module.exports = {
    "env": {
        "node": true,
        "browser": true,
        "commonjs": true,
        "es2021": true,
        "jest": true // jest is not defined 에러를 /* eslint-disable no-undef */ 대신하여 전역 설정함. 
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": "latest"
    },
    "rules": {
    }
}
