'use strict';

var createStore = require('fluxible/addons/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');
var Actions = require('../constants/Actions');
var _ = require('lodash');

module.exports = createStore({
    storeName: 'BusinessStore',
    handlers: makeHandlers({
        onReceiveBusiness: Actions.RECEIVE_BUSINESS,
        onReceiveSimilarBusinesses: Actions.RECEIVE_SIMILAR_BUSINESSES
    }),
    initialize: function () {
        this.businesses = {};
        this.similarIds = {};
    },
    dehydrate: function () {
        return {
            businesses: this.businesses,
            similarIds: this.similarIds
        };
    },
    rehydrate: function (state) {
        this.businesses = state.businesses;
        this.similarIds = state.similarIds;
    },
    onReceiveBusiness: function (business) {
        this.businesses[business.id] = business;
        this.emitChange();
    },
    onReceiveSimilarBusinesses: function (payload) {
        this.similarIds[payload.businessId] = _.pluck(payload.businesses, 'id');
        this.businesses = _.merge({}, this.businesses, _.indexBy(payload.businesses, 'id'));
        this.emitChange();
    },
    // TODO: move discount code into a discount store
    getDiscountForBusiness: function(businessId) {
        var business = this.getById(businessId);
        if (!business) return;

        var max =  _.chain(business.timetable)
            .map(function(day) {return _.max(_.compact(_.pluck(day, 'discount'))) })
            .max()
            .value();
        var discountsAvailable = _.chain(business.timetable)
            .reduce(function(result, timetable, day) {
                var values = _.compact(_.pluck(timetable, 'discount'));
                if(values.length > 0) {
                    _.each(values, function(value) {
                        if(result[value]) {
                            result[value].push(day);
                        } else {
                            result[value] = [day];
                        }
                    })
                }
                return result;
            }, {})
            .value();
        var discountObj = {
            max: _.isFinite(max) ? max : null,
            discountsAvailable: discountsAvailable
        };
        return discountObj;
    },
    getById: function (businessId) {
        return this.businesses[businessId];
    },
    getSimilar: function (businessId, limit) {
        return _.map(this.similarIds[businessId], this.getById, this);
    }
});
