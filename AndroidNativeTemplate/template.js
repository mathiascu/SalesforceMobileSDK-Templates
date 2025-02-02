/*
 * Copyright (c) 2016-present, salesforce.com, inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided
 * that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list of conditions and the
 * following disclaimer.
 *
 * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and
 * the following disclaimer in the documentation and/or other materials provided with the distribution.
 *
 * Neither the name of salesforce.com, inc. nor the names of its contributors may be used to endorse or
 * promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
 * PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 * TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
 * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

/**
 * Customize template (inject app name, package name, organization etc)
 *
 * @return result map with
 *   workspace
 *   bootconfigFile
 */
function prepare(config, replaceInFiles, moveFile, removeFile) {

    var path = require('path');

    // Values in template
    var templateAppName = 'AndroidNativeTemplate';
    var templatePackageName = 'com.salesforce.androidnativetemplate';

    // Key files
    var templatePackageJsonFile = 'package.json';
    var templateSettingsGradle = 'settings.gradle.kts';
    var templateBuildGradleFile = path.join('app', 'build.gradle.kts');
    var templateStringsXmlFile = path.join('app', 'res', 'values', 'strings.xml');
    var templateBootconfigFile = path.join('app', 'res', 'values', 'bootconfig.xml');
    var templateMainActivityFile = path.join('app', 'src', 'com', 'salesforce', 'androidnativetemplate', 'MainActivity.java');
    var templateMainApplicationFile = path.join('app', 'src', 'com', 'salesforce', 'androidnativetemplate', 'MainApplication.java');

    //
    // Replace in files
    //

    // app name
    replaceInFiles(templateAppName, config.appname, [templatePackageJsonFile, templateSettingsGradle, templateStringsXmlFile]);

    // package name
    replaceInFiles(templatePackageName, config.packagename, [templateBuildGradleFile, templateStringsXmlFile, templateMainActivityFile, templateMainApplicationFile]);
    
    //
    // Rename/move files
    //
    var tmpPathActivityFile = path.join('app', 'src', 'MainActivity.java');
    var tmpPathApplicationFile = path.join('app', 'src', 'MainApplication.java');
    moveFile(templateMainActivityFile, tmpPathActivityFile);
    moveFile(templateMainApplicationFile, tmpPathApplicationFile);
    removeFile(path.join('app', 'src', 'com'));
    moveFile(tmpPathActivityFile, path.join.apply(null, ['app', 'src'].concat(config.packagename.split('.')).concat(['MainActivity.java'])));
    moveFile(tmpPathApplicationFile, path.join.apply(null, ['app', 'src'].concat(config.packagename.split('.')).concat(['MainApplication.java'])));

    //
    // Run install.js
    //
    require('./install');


    // Return paths of workspace and file with oauth config
    return {
        workspacePath: '',
        bootconfigFile: path.join('app', 'res', 'values', 'bootconfig.xml')
    };
}

//
// Exports
//
module.exports = {
    appType: 'native',
    prepare: prepare
};

