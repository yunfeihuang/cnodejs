cordova.define("com.ircloud.ydh.hybrid.DevicePlugin", function(require, exports, module) {
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
               
/**
 * Provides access to notifications on the device.
 */
               module.exports = {
               /**
                * Causes the device to beep.
                * On Android, the default notification ringtone is played "count" times.
                *
                * @param {Integer} type       The Toast type.
                */
               
               showToast: function(successCallback,errorCallback,content) {
               exec(successCallback, errorCallback, "DevicePlugin", "showToast", [content]);
               },
               
               getUuid: function(successCallback,errorCallback) {
               exec(successCallback, errorCallback, "DevicePlugin", "getUuid",[]);
               },
               
               getNetworkType: function(successCallback,errorCallback) {
               exec(successCallback, errorCallback, "DevicePlugin", "getNetworkType",[]);
               },
               
               showConfirm: function(successCallback,errorCallback,content) {
               exec(successCallback, errorCallback, "DevicePlugin", "showConfirm",[content]);
               }
               ,
               openPage:function(successCallback,errorCallback,content){
               exec(successCallback, errorCallback, "DevicePlugin", "openPage",[content]);
               },
               pushEvent:function(successCallback,errorCallback,content){
               exec(successCallback,errorCallback,"DevicePlugin","pushEvent",[content]);
               },
               getAppVersion:function(successCallback,errorCallback){
               exec(successCallback,errorCallback,"DevicePlugin","getAppVersion",[]);
               },
               showPreloader:function(successCallback,errorCallback,content){
                     exec(successCallback,errorCallback,"DevicePlugin","showPreloader",[content]);
                 },
                 hidePreloader:function(successCallback,errorCallback){
                     exec(successCallback,errorCallback,"DevicePlugin","hidePreloader",[]);
                 }
               };
});