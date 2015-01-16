'use strict';

var Reflux = require('reflux');

module.exports = {
    TagsActions: Reflux.createActions([
        "addTag",
        "deleteTag"
    ]),
    DataActions: Reflux.createActions([
        "getData", "getDataForTagAndType"
    ])
};

