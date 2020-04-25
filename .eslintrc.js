module.exports = {
  extends: [
    './node_modules/@0devs/package/config/eslint-ts.js',
  ],
  "rules": {
    "no-param-reassign": "off",
    "import/extensions": "off"
  },
  "settings": {
    "import/resolver": {
      "node": {
        "extensions": [".js", ".ts"]
      }
    }
  }
};
