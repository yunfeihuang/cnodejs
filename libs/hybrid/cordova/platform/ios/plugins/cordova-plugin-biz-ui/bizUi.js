cordova.define("com.ircloud.ydh.hybrid.BizUiPlugin", function(require, exports, module) {
/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   <a target=_blank href="http://www.apache.org/licenses/LICENSE-2.0">http://www.apache.org/licenses/LICENSE-2.0</a>
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
 */
            var exec = require('cordova/exec');
            module.exports = {
            openOrderList: function(successCallback,errorCallback) {
            exec(successCallback, errorCallback, "BizUiPlugin", "openOrderList", []);
            },
            openOrderDetail: function(successCallback,errorCallback,content) {
            exec(successCallback, errorCallback, "BizUiPlugin", "openOrderDetail", [content]);
            },
            openReturnOrderDetail: function(successCallback,errorCallback,content) {
            exec(successCallback, errorCallback, "BizUiPlugin", "openReturnOrderDetail", [content]);
            },
            openCustomerFeedbackList: function(successCallback,errorCallback) {
            exec(successCallback, errorCallback, "BizUiPlugin", "openCustomerFeedbackList", []);
            },
            openSystemFeedbackList: function(successCallback,errorCallback) {
            exec(successCallback, errorCallback, "BizUiPlugin", "openSystemFeedbackList", []);
            },
            openNoticeDetail: function(successCallback,errorCallback,content) {
            exec(successCallback, errorCallback, "BizUiPlugin", "openNoticeDetail", [content]);
            }
               };
});