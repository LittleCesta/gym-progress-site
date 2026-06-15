const path = require("path");

module.exports = {
  // 1. Onde o Webpack vai começar a ler o código do seu front-end
  entry: "./src/front/main.ts",

  // 2. Modo de desenvolvimento (deixa a compilação mais rápida)
  mode: "development",
  devtool: "source-map",

  // 3. Regras para ensinar o Webpack a ler arquivos TypeScript
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },

  // 4. Extensões que o Webpack deve reconhecer automaticamente
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },

  // 5. Onde o Webpack vai salvar o arquivo final compilado
  output: {
    filename: "bundle.js", // Nome do arquivo que seu HTML já consome
    path: path.resolve(__dirname, "public", "assets", "js"), // Pasta public/assets/js
  },
};
