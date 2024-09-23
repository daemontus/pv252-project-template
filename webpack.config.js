const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  /* 
    We include the style sheets and the UIKit library into each entry point.
    Alternatively, these could be included in the corresponding "main" .ts/.js files.
   */
  entry: {
    site_a: {
      import: ["./src/entry_site_a.ts", "./src/css/entry_site_a.less", "uikit"],
    },
    site_b: {
      import: ["./src/entry_site_b.ts", "./src/css/entry_site_b.less", "uikit"],
    },
    main: {
      import: ["./src/entry_main.ts", "./src/css/entry_main.less", "uikit"],
    },
  },
  /*
    Output is stored in the `dist` folder and contains the "content hash"
    to ensure two different versions of the same file cannot be confused
    for each other.
   */
  output: {
    clean: true,
    filename: "[name].[hash].bundle.js",
    path: path.resolve(__dirname, "dist"),  // must be an absolute path
  },
  /* Dist is also where we want to start the development web server. */
  devServer: {
    static: "./dist",
  },
  module: {
    rules: [
      /* Use Babel to convert JavaScript/TypeScript files. */
      {
        test: /\.(js|ts|jsx|tsx)$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
        exclude: /node_modules/,
      },
      /* Use LESS, and then load the result with normal CSS loader. */
      {
        test: /\.less$/i,
        use: ["style-loader", "css-loader", "less-loader"],
      },
      /* 
        Load images: "importing" an image will copy it to the output
        and return the corresponding URL.
       */
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      /*
        Load HTML files: You can import HTML files, which will simply
        return the content as text.
       */
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
    ],
  },
  plugins: [
    // Generates the default index.html
    new HtmlWebpackPlugin({
      title: "PV252 Example project",
      // If we don't need (or want) to use all entry points,
      // we can use `chunks` to specify which entry point to use.
      chunks: ["main"],
      filename: "index.html",
      template: "./src/html/index.template.ejs",
    }),
    // Generate separate HTML files for the two sites.
    new HtmlWebpackPlugin({
      title: "Site A",      
      chunks: ["site_a"],
      filename: "site_a.html",
      template: "./src/html/site_a.template.ejs",
    }),
    new HtmlWebpackPlugin({
      title: "Site B",
      chunks: ["site_b"],
      filename: "site_b.html",
      template: "./src/html/site_b.template.ejs",
    }),
  ],
};
