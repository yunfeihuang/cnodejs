cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-whitelist/whitelist.js",
        "id": "cordova-plugin-whitelist.whitelist",
        "pluginId": "cordova-plugin-whitelist",
        "runs": true
    }
    ,
    {
        "file": "plugins/cordova-plugin-device/devicePlugin.js?t=8",
        "id": "com.ircloud.ydh.hybrid.DevicePlugin",
        "clobbers": [
            "ydh.device"
        ]
    }
    ,
    {
         "file": "plugins/cordova-plugin-biz/bizPlugin.js?t=8",
         "id": "com.ircloud.ydh.hybrid.BizPlugin",
         "clobbers": [
             "ydh.biz"
         ]
    }
    ,
    {
        "file": "plugins/cordova-plugin-biz-navigation/bizNavigation.js",
        "id": "com.ircloud.ydh.hybrid.BizNavigationPlugin",
        "clobbers": [
            "ydh.biz.navigation"
        ]
    }
    ,
    {
          "file": "plugins/cordova-plugin-biz-tab/bizTab.js",
          "id": "com.ircloud.ydh.hybrid.BizTabPlugin",
          "clobbers": [
             "ydh.biz.tab"
        ]
    }
    ,
    {
        "file": "plugins/cordova-plugin-biz-alipay/bizAlipay.js",
        "id": "com.ircloud.ydh.hybrid.BizAlipayPlugin",
        "clobbers": [
           "ydh.biz.alipay"
      ]
    }
    ,
    {
        "file": "plugins/cordova-plugin-biz-ui/bizUi.js?t=8",
        "id": "com.ircloud.ydh.hybrid.BizUiPlugin",
        "clobbers": [
           "ydh.biz.ui"
      ]
    },
    {
        "file": "plugins/cordova-plugin-biz-statusBar/bizStatusBar.js",
        "id": "com.ircloud.ydh.hybrid.BizStatusBarPlugin",
        "clobbers": [
           "ydh.biz.statusBar"
        ]
    }
    ,
    {
        "file": "plugins/cordova-plugin-biz-yiji/bizYiji.js?t=9",
        "id": "com.ircloud.ydh.hybrid.BizYijiPlugin",
        "clobbers": [
           "ydh.biz.yiji"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-whitelist": "1.2.1"
}
// BOTTOM OF METADATA
});
