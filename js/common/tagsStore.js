'use strict';

var Reflux = require('reflux');
var Actions = require('common/actions');
var TagsActions = Actions.TagsActions;
var MyUtils = require('common/utils');

var count = 0,
    localTagsStorageKey = "big-brother.tags";

function getItemByKey(list, key){
    var item = undefined;
    list.forEach(function(itm){
        if(itm.key === key){
            item = itm;
        }
    });

    return item;
}

function reorderList(list){
    return list.map(function(item, index){
        item.key = index +  1;
        return item;
    });
}

module.exports =  Reflux.createStore({
    listenables: [TagsActions],

    onAddTag: function (newTag, feeling) {
        count++;
        this.updateList([
            {
                key: count,
                text: newTag,
                feeling: MyUtils.TagFeeling.UP
            }
        ].concat(this.list));

    },

    onDeleteTag: function (key) {
        var newList = this.list.filter(function (itm) {
            return itm.key !== key;
        });
        this.updateList(newList);
    },

    updateList: function (list) {
        var reorderedList = reorderList(list);

        localStorage.setItem(localTagsStorageKey, JSON.stringify(reorderedList));
        this.list = reorderedList;
        count = this.list.length;
        this.trigger(reorderedList);
    },

    getInitialState: function () {
        //get stuff from server
        var loadedList = localStorage.getItem(localTagsStorageKey);

        if (!loadedList) {
            loadedList = [{"key":1, "text":"Widen Enterprises", "feeling": MyUtils.TagFeeling.UP},
                          {"key":2, "text":"Digital Asset Management", "feeling": MyUtils.TagFeeling.UP},
                          {"key":3, "text":"Madison", "feeling": MyUtils.TagFeeling.DOWN}
            ];
        }else{
            loadedList = JSON.parse(loadedList);
        }

        this.updateList(loadedList);

        return this.list;
    }
});