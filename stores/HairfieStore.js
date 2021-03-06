'use strict';

var createStore = require('fluxible/addons/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');
var Actions = require('../constants/Actions');
var _ = require('lodash');
var HairfieActions = require('../actions/HairfieActions');

module.exports = createStore({
    storeName: 'HairfieStore',
    handlers: makeHandlers({
        onReceiveHairfie: Actions.RECEIVE_HAIRFIE,
        onReceiveTopHairfies: Actions.RECEIVE_TOP_HAIRFIES,
        onReceiveBusinessTopHairfies: Actions.RECEIVE_BUSINESS_TOP_HAIRFIES,
        onReceiveHairfieSearchResult: Actions.RECEIVE_HAIRFIE_SEARCH_RESULT,
        onReceiveHairfieSearchResultStart: Actions.RECEIVE_HAIRFIE_SEARCH_RESULT_START,
        onReceiveHairfieSearchResultFailed: Actions.RECEIVE_HAIRFIE_SEARCH_RESULT_FAILED,
        onReceiveBusinessHairfies: Actions.RECEIVE_BUSINESS_HAIRFIES,
        onReceiveUserHairfies: Actions.RECEIVE_USER_HAIRFIES,
        onReceiveUserLikes: Actions.RECEIVE_USER_LIKES,
        onReceiveHairdresserHairfies: Actions.RECEIVE_HAIRDRESSER_HAIRFIES,
        onReceiveSimilarHairfies: Actions.RECEIVE_SIMILAR_HAIRFIES
    }),
    initialize: function () {
        this.hairfies = {};
        this.userHairfies = {};
        this.userLikes = {};
        this.hairdresserHairfies = {};
        this.topIds = [];
        this.topIdsLoading = false;
        this.businessTopIds = {};
        this.searchResults = {};
        this.hairfieSearchResultIsLoading = false;
    },
    dehydrate: function () {
        return {
            hairfies: this.hairfies,
            userHairfies: this.userHairfies,
            userLikes: this.userLikes,
            hairdresserHairfies: this.hairdresserHairfies,
            topIds: this.topIds,
            searchResults: this.searchResults
        };
    },
    rehydrate: function (state) {
        this.hairfies = state.hairfies;
        this.userHairfies = state.userHairfies;
        this.userLikes = state.userLikes;
        this.hairdresserHairfies = state.hairdresserHairfies;
        this.topIds = state.topIds;
        this.searchResults = state.searchResults;
    },
    onReceiveHairfie: function (hairfie) {
        if (_.isUndefined(this.hairfies[hairfie.id])) {
            this.hairfies[hairfie.id] = hairfie;
        }
        else {
            this.hairfies[hairfie.id] = _.assign(this.hairfies[hairfie.id], {}, hairfie);
        }
        this.emitChange();
    },
    onReceiveTopHairfies: function (hairfies) {
        this.hairfies = _.assign({}, this.hairfies, _.indexBy(hairfies, 'id'));
        this.topIds = _.pluck(hairfies, 'id');
        this.topIdsLoading = false;
        this.emitChange();
    },
    onReceiveBusinessTopHairfies: function (payload) {
        this.hairfies = _.assign({}, this.hairfies, _.indexBy(payload.hairfies, 'id'));
        this.businessTopIds[payload.businessId] = _.pluck(payload.hairfies, 'id');
        if (_.isUndefined(this.businessTopIds[payload.businessId]) || _.isEmpty(this.businessTopIds[payload.businessId])) {
            this.businessTopIds[payload.businessId] = new Array();
        }
        this.emitChange();
    },
    onReceiveHairfieSearchResult: function (payload) {
        var search = payload.search;
        delete search.page;
        var result = payload.result;

        this.hairfies = _.assign({}, this.hairfies, _.indexBy(result.hits, 'id'));
        this.onReceiveHairfieSearchResultFailed();
        if (this.searchResults[searchKey(search)]) {
            var newHits = _.uniq(this.searchResults[searchKey(search)].hits.concat(_.pluck(result.hits, 'id')));
            this.searchResults[searchKey(search)] = _.assign({}, result, { hits: newHits, currentPage: Math.ceil(newHits.length / 14) });
        }
        else
            this.searchResults[searchKey(search)] = _.assign({}, result, { hits: _.pluck(result.hits, 'id'), currentPage: 1 });
        this.emitChange();
    },
    onReceiveHairfieSearchResultStart: function() {
        this.hairfieSearchResultIsLoading = true;
        this.emitChange();
    },
    onReceiveHairfieSearchResultFailed: function() {
        this.hairfieSearchResultIsLoading = false;
        this.emitChange();
    },
    onReceiveBusinessHairfies: function (payload) {
        this.hairfies = _.assign({}, this.hairfies, _.indexBy(payload.hairfies, 'id'));
        this.emitChange();
    },
    onReceiveHairdresserHairfies: function (payload) {
        if (_.isUndefined(this.hairdresserHairfies[payload.hairdresserId])) {
            this.hairdresserHairfies[payload.hairdresserId] = {
                hairfies: new Array(),
                page: null
            };
        }
        _.map(payload.hairfies, function (hairfie) {
            this.hairdresserHairfies[payload.hairdresserId].hairfies.push(hairfie.id);
            if (_.isUndefined(this.hairfies[hairfie.id])) {
                this.hairfies[hairfie.id] = hairfie;
            }
        }.bind(this));

        this.hairdresserHairfies[payload.hairdresserId].hairfies = _.uniq(this.hairdresserHairfies[payload.hairdresserId].hairfies);
        this.hairdresserHairfies[payload.hairdresserId].page = payload.page;
        this.emitChange();
    },
    onReceiveUserHairfies: function (payload) {
        if (_.isUndefined(this.userHairfies[payload.userId])) {
            this.userHairfies[payload.userId] = {
                hairfies: new Array(),
                page: null
            };
        }
        _.map(payload.hairfies, function (hairfie) {
            this.userHairfies[payload.userId].hairfies.push(hairfie.id);
            if (_.isUndefined(this.hairfies[hairfie.id])) {
                this.hairfies[hairfie.id] = hairfie;
            }
        }.bind(this));


        this.userHairfies[payload.userId].hairfies = _.uniq(this.userHairfies[payload.userId].hairfies);
        this.userHairfies[payload.userId].page = payload.page;

        this.emitChange();
    },
    onReceiveUserLikes: function (payload) {
        if (_.isUndefined(this.userLikes[payload.userId])) {
            this.userLikes[payload.userId] = {
                hairfies: new Array(),
                page: null
            };
        }
        _.map(payload.hairfies, function (obj) {
            if (!obj.hairfie) return;
            this.userLikes[payload.userId].hairfies.push(obj.hairfie.id);
            if (_.isUndefined(this.hairfies[obj.hairfie.id])) {
                this.hairfies[obj.hairfie.id] = obj.hairfie;
            }
        }.bind(this));
        this.userLikes[payload.userId].hairfies = _.uniq(this.userLikes[payload.userId].hairfies);
        this.userLikes[payload.userId].page = payload.page;
        this.emitChange();
    },
    onReceiveSimilarHairfies: function(payload) {
        var arr = _.map(payload.hairfies, function(hairfie) {
            if (payload.hairfieId != hairfie.id && _.isUndefined(this.hairfies[hairfie.id])) {
                this.hairfies[hairfie.id] = hairfie;
            }
            return hairfie.id;
        }.bind(this));
        if (this.hairfies[payload.hairfieId]) {
            if (_.isArray(this.hairfies[payload.hairfieId].similarHairfies)) {
                _.map(arr, function(val) {
                    this.hairfies[payload.hairfieId].similarHairfies.push(val);
                }.bind(this)); }
            else
                this.hairfies[payload.hairfieId].similarHairfies = arr;
            this.hairfies[payload.hairfieId].similarHairfies = _.uniq(this.hairfies[payload.hairfieId].similarHairfies);
            this.hairfies[payload.hairfieId].similarHairfiesPage = payload.hairfiePage;
        }
        this.emitChange();
    },
    getById: function (id) {
        return this.hairfies[id];
    },
    getHairfiesByHairdresser: function (hairdresserId) {
        return _.map(this.hairdresserHairfies[hairdresserId] && this.hairdresserHairfies[hairdresserId].hairfies, function(id) {
            return this.hairfies[id];
        }.bind(this));
    },
    getHairfiesByUser: function (userId) {
        return _.map(this.userHairfies[userId] && this.userHairfies[userId].hairfies, function(id) {
            return this.hairfies[id];
        }.bind(this));
    },
    getLikesByUser: function (userId) {
        return _.map(this.userLikes[userId] && this.userLikes[userId].hairfies, function(id) {
            return this.hairfies[id];
        }.bind(this));
    },
    getHairfiesByHairdresserPage: function (hairdresserId) {
        if (_.isUndefined(this.hairdresserHairfies[hairdresserId])) {
            this.getContext().executeAction(HairfieActions.loadHairdresserHairfies, {
                id: hairdresserId,
                page: 1,
                pageSize: 15
            });
            this.hairdresserHairfies[hairdresserId] = {hairfies: new Array(), page: null};
            this.emitChange();
            return -1;
        }
        else
            return this.hairdresserHairfies[hairdresserId].page;
    },
    getHairfiesByUserPage: function (userId) {
        if (_.isUndefined(this.userHairfies[userId])) {
            this.getContext().executeAction(HairfieActions.loadUserHairfies, {
                id: userId,
                page: 1,
                pageSize: 15
            });
            this.userHairfies[userId] = {hairfies: new Array(), page: null};
            this.emitChange();
            return -1;
        }
        else
            return this.userHairfies[userId].page;
    },
    getLikesByUserPage: function (userId) {
        if (_.isUndefined(this.userLikes[userId])) {
            this.getContext().executeAction(HairfieActions.loadUserLikes, {
                id: userId,
                page: 1,
                pageSize: 15
            });
            this.userLikes[userId] = {hairfies: new Array(), page: null};
            this.emitChange();
            return -1;
        }
        else
            return this.userLikes[userId].page;
    },
    getTop: function () {
        if (_.isEmpty(this.topIds) && !this.topIdsLoading) {
            this.getContext().executeAction(HairfieActions.loadTopHairfies, { limit: 4 });
            this.topIdsLoading = true;
            this.emitChange();
            return -1;
        }
        return _.map(this.topIds, this.getById, this);
    },
    getBusinessTop: function (businessId) {
        if (_.isUndefined(this.businessTopIds[businessId])) {
            this.getContext().executeAction(HairfieActions.loadBusinessTopHairfies, { limit: 4, businessId: businessId });
            this.businessTopIds[businessId] = new Array();
            this.emitChange();
            return -1;
        }
        return this.businessTopIds[businessId] && _.map(this.businessTopIds[businessId], this.getById, this);
    },
    getSearchResult: function (search) {
        delete search.page;
        var result = this.searchResults[searchKey(search)];
        if (result) {
            return _.assign({}, result, { hits: _.map(result.hits, this.getById, this) });
        }
    },
    getByBusiness: function (businessId) {
        var hairfies = _.filter(this.hairfies, function (h) { return h.business && h.business.id === businessId; });

        return _.sortByOrder(hairfies, ['createdAt'], [false]);
    },
    getSimilarHairfies: function (id) {
        return _.map(this.hairfies[id].similarHairfies, function (id) {
            return this.hairfies[id];
        }.bind(this));
    },
    getSimilarHairfiesPage: function (id) {
        if (_.isUndefined(this.hairfies[id].similarHairfiesPage)) {
            this.getContext().executeAction(HairfieActions.loadSimilarHairfies, {
                hairfie: this.hairfies[id],
                page: 1,
                pageSize: 12
            });
            return -1;
        }
        else
            return this.hairfies[id].similarHairfiesPage;
    },
    getLoadingStatusHairfieResult: function() {
        return this.hairfieSearchResultIsLoading;
    },
    _generateDescriptions: function(hairfie) {
        var descriptions, tags = '', oldDescription = '', businessName = '';
        if(hairfie.tags) {
            tags = _.map(hairfie.tags, function(tag) { return '#'+tag.name.replace(/ /g,''); }).join(" ");
        }
        if(hairfie.description) {
            oldDescription = ' ' + hairfie.description;
        }
        if(hairfie.business) {
            businessName = ' made at ' + hairfie.business.name;
        }
        descriptions = {
            twitter: encodeURIComponent(tags + oldDescription + businessName + ' #hairfie'),
            facebook: tags + oldDescription + businessName,
            display: tags + oldDescription
        };

        return descriptions;
    }
});

function searchKey(searchKey) { return JSON.stringify(searchKey); }
