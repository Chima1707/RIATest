module.exports = {
    app: 'src/',
    dist: 'dist/',
    test: 'test/',
    bower: 'src/bower_components/',
    tmp: 'tmp',
    revManifest: 'tmp/rev-manifest.json',
    port: 9000,
    liveReloadPort: 35729,
    uri: 'http://localhost:',
    constantTemplate:
        '(function () {\n' +
        '    \'use strict\';\n' +
        '/* eslint-disable */ \n'+ 
        '    // DO NOT EDIT THIS FILE, EDIT THE GULP TASK NGCONSTANT SETTINGS INSTEAD WHICH GENERATES THIS FILE\n' +
        '    angular\n' +
        '        .module(\'<%- moduleName %>\')\n' +
        '<% constants.forEach(function(constant) { %>        .constant(\'<%- constant.name %>\', <%= constant.value %>)\n<% }) %>;\n' +
        '})();\n',
    dataFileInfo: {
       START_INDEX: 1,
       FLIGHT_DATE_COL: 0,
       ORIGIN_COL: 1,
       DEST_COL: 2,
       DEP_TIME_COL: 3,
       ARR_TIME_COL: 4,
       ARR_DELAY_COL:5,
       ELAPSED_TIME_COL: 6,
       DISTANCE_COL: 7         
    }    
};
