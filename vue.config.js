const {GenerateSW} = require("workbox-webpack-plugin");

module.exports = {
    outputDir: "www",
    css: {
        loaderOptions: {
            scss: {
                additionalData: `@import "~@/assets/scss/common.scss";`,
            },
        },
    },
    pwa: {
        name: "RSS App",
        manifestOptions: {
            "theme_color": "#f8f8f8",
            "background_color": "#f8f8f8",
            "display": "standalone",
            startUrl: "/stories/Latest",
            scope: "/",
            icons: [
                {
                    src: "/icon-308.png",
                    type: "image/png",
                    sizes: "308x308",
                },
            ],
        },
        iconPaths: null,
        workboxPluginMode: "GenerateSW",
    },
    chainWebpack: config => {
        config.plugin("workbox").use(new GenerateSW({
            cleanupOutdatedCaches: true,
            exclude: [/\.php$/],
            navigateFallback: "/index.html",
            navigateFallbackDenylist: [/auth\.php/],
            runtimeCaching: [
                {
                    method: "GET",
                    urlPattern: /api\.php/,
                    handler: "NetworkFirst",
                },
            ],
        }));

        config.module
            .rule("vue")
            .use("vue-svg-inline-loader")
            .loader("vue-svg-inline-loader");
    },
};

