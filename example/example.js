var mwcCore = require('mwc_kernel');
//setting up the config
var MWC = new mwcCore(require('./config.json')[(process.env.NODE_ENV) ? (process.env.NODE_ENV) : 'development']);

MWC.usePlugin(require('mwc_plugin_hogan_express'));
MWC.usePlugin(require('./../index.js'));

MWC.listen();