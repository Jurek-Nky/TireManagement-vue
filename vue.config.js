module.exports = {
    devServer:{
        proxy: 'http://limla.ml:8081'
    },

    pluginOptions: {
      vuetify: {
			// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
		}
    },

    transpileDependencies: true
}
module.exports = {
    pluginOptions: {
        vuetify: {}
    },

    transpileDependencies: true
}
