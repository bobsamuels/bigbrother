'use strict';

var Reflux = require('reflux');
var Actions = require('common/actions');
var MyUtils = require('common/utils');
var DataActions = Actions.DataActions;

var count = 0,
    localStorageKey = "big-brother.data";

function getItemByKey(list, key){
    var item = undefined;
    list.forEach(function(itm){
        if(itm.key === key){
            item = itm;
        }
    });

    return item;
}

function buildEmptyDataObj(){
    var d3Domain = {x:[0, 500], y:[0,500]};
    var data= {"d3Domain": d3Domain, "status":"Ready", "tweets":[], "instagrams":[]};
    return data;
}

module.exports =  Reflux.createStore({
    listenables: [DataActions],

    onGetDataForTagAndType: function(tag, type){
        var dataArray = [];
        if(type === 'twitter'){
            dataArray = this.data.tweets;
        }
        else{
            dataArray = this.data.instagrams;
        }


    },

    onGetData: function(tags){
        var theStore = this;
        var data = buildEmptyDataObj();
        //This whole thing has to be put in a promise
        // then update data at the end;

        var allPromises = []
        //each one will have to return a promise... once they're ALL done, update the data;
            tags.forEach(function (tag) {
               allPromises.push(MyUtils.instagramSearch(tag));
               allPromises.push(MyUtils.twitterSearch(tag));
            });


            Promise.all(allPromises).then(function(vals){
                //create ig data
                vals.forEach(function(val){
                    if(val.type === "instagram"){
                        data.instagrams.push({"tag": val.tag, "items": val, "size": val.instagrams.length});
                    }
                    else
                    {
                        data.tweets.push({"tag": val.tag, "items": val, "size": val.tweets.length});
                    }

                });
                theStore.updateData(data);
            }, function(err){
                    console.log(err);
                }
            );


    },
    updateData: function (data) {
        localStorage.setItem(localStorageKey, JSON.stringify(data));
        this.data = data;
        this.trigger(data);
    },

    getInitialState: function () {
        var loadedData = localStorage.getItem(localStorageKey);
        if(!loadedData){
            loadedData= buildEmptyDataObj();
            this.updateData(loadedData);
        }

        this.data = JSON.parse(loadedData);
        this.data.status = "Ready";

        return this.data;
    }
});