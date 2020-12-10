import('bootstrap-styl');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const STYL_REGEX = /\.styl$/;
const STYL_MODULE_REGEX = /\.module\.styl$/;

const overrideWebpackConfig = ({
                                          webpackConfig,
                                          context: { env }
                                      }) => {
    // const mode = env === "development" ? "dev" : "prod";
    const isDev = env === "development";
    const isProd = !isDev;
    const useStyleLoader = isDev;
    const shouldUseSourceMap = isProd && process.env.GENERATE_SOURCEMAP !== "false";

    const getStyleLoader = () => {
        return useStyleLoader ? require.resolve("style-loader") : require("mini-css-extract-plugin").loader;
        //     : {
        //         loader: require("mini-css-extract-plugin").loader,
        //         options: shouldUseRelativeAssetPaths ? { publicPath: "../../" } : {}
        //     },
    }

    const getCSSModuleLocalIdent = require("react-dev-utils/getCSSModuleLocalIdent");
    // // Need these for production mode, which are copied from react-scripts
    // const publicPath = require("react-scripts/config/paths").servedPath;
    // const shouldUseRelativeAssetPaths = publicPath === "./";
    // const shouldUseSourceMap =
    //     mode === "prod" && process.env.GENERATE_SOURCEMAP !== "false";
    //
    const getStylusLoader = (cssOptions) => [
        getStyleLoader(),
        {
            loader: require.resolve("css-loader"),
            options: {
                ...cssOptions,
                modules: true,
                importLoaders: 1
            }
        },
        {
            loader: require.resolve("postcss-loader"),
            options: {
                ident: "postcss",
                plugins: () => [
                    require("postcss-flexbugs-fixes"),
                    require("postcss-preset-env")({
                        autoprefixer: {
                            flexbox: "no-2009"
                        },
                        stage: 3
                    })
                ],
                sourceMap: shouldUseSourceMap
            }
        },
        {
            loader: require.resolve("stylus-loader"),
            options: {
                stylusOptions: {
                    use: [
                        "nib",
                        "bootstrap-styl"
                    ],
                    source: shouldUseSourceMap,
                }
            }
        }
    ];

    const loaders = webpackConfig.module?.rules.find(rule =>
        Array.isArray(rule.oneOf)
    )?.oneOf;

    if (!loaders) {
        return webpackConfig;
    }

    // Insert stylus-loader as the penultimate item of loaders (before file-loader)
    loaders.splice(
        loaders.length - 1,
        0,
        // {
        //     test: /\.styl$/,
        //     exclude: [
        //         path.resolve(__dirname, 'src/styles')
        //     ],
        //     use: [
        //         getStyleLoader(),
        //         {
        //             loader: 'css-loader',
        //             options: {
        //                 modules: true,
        //                 // getLocalIdent: getCSSModuleLocalIdent,
        //                 // camelCase: true,
        //                 importLoaders: 1
        //             }
        //         },
        //         {
        //             loader: require.resolve("stylus-loader"),
        //             options: {
        //                 stylusOptions: {
        //                     use: [
        //                         "nib",
        //                     ],
        //                     source: shouldUseSourceMap,
        //                     import: ['~nib/lib/nib/index.styl'],
        //                 }
        //             }
        //         }
        //     ],
        // },
        {
            test: STYL_REGEX,
            exclude: STYL_MODULE_REGEX,
            use: getStylusLoader({
                importLoaders: 2
            }),
            sideEffects: isProd
        },
        {
            test: STYL_MODULE_REGEX,
            use: getStylusLoader({
                importLoaders: 2,
                modules: {
                    getLocalIdent: getCSSModuleLocalIdent
                }
            })
        }
        // {
        //     test: /\.css$/,
        //     use: [
        //         'style-loader',
        //         'css-loader'
        //     ]
        // },
    );

    return webpackConfig;
};

module.exports = {
    plugins: [
        {
            plugin: {overrideWebpackConfig: overrideWebpackConfig},
        }
    ]
};
