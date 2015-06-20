'use strict';

var _ = require('lodash');
var yaml = require('js-yaml');
var fs = require('fs');

function _loadValues(o){
    if (o === null) {
        return o;
    }

    var oType = typeof(o);

    if (oType === 'undefined') {
        return o;
    } else if (oType === 'boolean' ||
        oType === 'number' ||
        oType === 'string') {
        return o;
    } else {
        Object.keys(o).forEach(function(key){
            var oVal = o[key];
            if (oVal) {
                var oValType = typeof(oVal);
                if (oValType !== 'undefined' &&
                    oValType !== 'boolean' &&
                    oValType !== 'number' &&
                    oValType !== 'string') {
                        o[key] = _loadValues(oVal);
                }
            }
        });
    }

    //console.info('o: ' + JSON.stringify(o));
    return o;
}

function loadYamlConfig(loadOptions)
{

    if (!loadOptions) {
        throw new Error('loadOptions required');
    } else if (!loadOptions.fileNames) {
        throw new Error('loadOptions.fileName is required');
    }

    loadOptions.environment = loadOptions.environment || 'dev';

    var yamlString = '';
    _.forEach(loadOptions.fileNames, function(file) {
        try {
            yamlString += fs.readFileSync(file);
        } catch(e) {
        }
    });

    var config = yaml.safeLoad(yamlString);
    var loadedValues = _loadValues(config[loadOptions.environment]);

    if (!loadedValues) {
        throw new Error('No values defined for environment: ' + loadOptions.environment);
    }

    return _loadValues(loadedValues);
}

module.exports = loadYamlConfig;

