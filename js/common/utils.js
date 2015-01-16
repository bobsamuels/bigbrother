var request = require('browser-request');
var OAuth   = require('oauth-1.0a');

var MyUtils = function () {
    var utils = this;

    function param(object) {
        var encodedString = '';
        for (var prop in object) {
            if (object.hasOwnProperty(prop)) {
                if (encodedString.length > 0) {
                    encodedString += '&';
                }
                encodedString += encodeURI(prop + '=' + object[prop]);
            }
        }
        return encodedString;
    }

    function makeTweets(dataObj, tag){
        //get text, created_at user.screen_name, user.id, usr.location?, usr.name, user.profile_image_url, user.profile_background_image_url

        var results = [];
        var resObj = {"tag": tag, "type": "twitter", "nextUrl" : dataObj.search_metadata.next_results, "tweets":results};

        dataObj.statuses.forEach(function(status){
            var user = status.user;
            var userObj = {"id": user.id, "screen_name": user.screen_name, "location": user.location, "profile_image":user.profile_image_url, "background_image":user.profile_background_image_url};
            results.push({"text" : status.text, "created_at" : status.created_at, "user":userObj});
        });
        return resObj;
    }

    function makeInstagrams(dataObj, tag){
        //get caption, userName, userid, fullName, and mediaLink, link, images{thumbnail{height, width, url}}, created_time

        var results = [];
        var resObj = {"tag": tag, "type": "instagram", "nextUrl" : dataObj.pagination.next_url, "instagrams":results};

        dataObj.data.forEach(function(item){
            try {
                var user = item.user;
                var userObj = {
                    "id": user.id,
                    "username": user.username,
                    "profile_image": user.profile_picture,
                    "full_name": user.full_name
                };
                var caption = (item.caption) ? item.caption.text : "";
                results.push({
                    "caption": caption,
                    "link": item.link,
                    "photo": {
                        "url": item.images.thumbnail.url,
                        "height": item.images.thumbnail.height,
                        "width": item.images.thumbnail.width
                    },
                    "created_at": item.created_time,
                    "user": userObj
                });
            }
            catch(err){
                console.error(err);
            }
        });
        return resObj;
    }

    return{
            TagFeeling : {UP:":)", DOWN:":(", NONE:""},

            get: function (endpoint, params) {
                return new Promise(function(resolve, reject) {
                    // Do the usual XHR stuff
                    var req = new XMLHttpRequest();
                    req.open('GET', encodeURI(endpoint));

                    req.onload = function() {
                        // This is called even on 404 etc
                        // so check the status
                        if (req.status == 200) {
                            // Resolve the promise with the response text
                            resolve(req.response);
                        }
                        else {
                            // Otherwise reject with the status text
                            // which will hopefully be a meaningful error
                            reject(Error(req.statusText));
                        }
                    };

                    // Handle network errors
                    req.onerror = function() {
                        reject(Error("Network Error"));
                    };

                    // Make the request
                    req.send();
                });
            },
            twitterSearch: function(tag){
                //get text, created_at user.screen_name, user.id, usr.location?, usr.name, user.profile_image_url, user.profile_background_image_url
                var searchVal = "#" + tag.text;
                var search = "/api/twitterSearch/";
                search += encodeURIComponent(searchVal);

                //run search, translate results
                //until hasMore is false or looped 10 times, do this:
                // use search_metadata.next_results as the querystring for the next search.
                //if there is no next_results, search is done
                var getPromise = MyUtils.get(search);

                return new Promise(function(resolve, reject){
                    getPromise.then(function(resp){
                        var tweets = makeTweets(JSON.parse(resp), tag);
                        resolve(tweets);
                    }, function(err){
                        console.error(err);
                        reject(err);
                    });
                });



            },
            instagramSearch:function(tag){
                var searchVal = tag.text;
                var search = "/api/instagramSearch/";
                search += encodeURIComponent(searchVal);

                //run search, translate results
                //until hasMore is false or looped 10 times, do this:
                // use search_metadata.next_results as the querystring for the next search.
                //if there is no next_results, search is done
                var getPromise = MyUtils.get(search);

                return new Promise(function(resolve, reject){
                    getPromise.then(function(resp){
                        var instagrams = makeInstagrams(JSON.parse(resp), tag);
                        resolve(instagrams);

                    }, function(err){
                        console.error(err);
                        reject(err);
                    });
                });

            }
        };
    }();
module.exports = MyUtils;


