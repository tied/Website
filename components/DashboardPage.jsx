/** @jsx React.DOM */

var React = require('react');
var FluxibleMixin = require('fluxible').Mixin;

var ProLayout = require('./ProLayout.jsx');
var NavLink = require('flux-router-component').NavLink;
var AuthStore = require('../stores/AuthStore');
var UserManagedBusinessStore = require('../stores/UserManagedBusinessStore');
var lodash = require('lodash');
var Picture = require('./Partial/Picture.jsx');


module.exports = React.createClass({
    mixins: [FluxibleMixin],
    statics: {
        storeListeners: [AuthStore, UserManagedBusinessStore]
    },
    getStateFromStores: function () {
        var user = this.getStore(AuthStore).getUser();

        return {
            user                : user,
            managedBusinesses   : user && this.getStore(UserManagedBusinessStore).getManagedBusinessesByUser(user)
        }
    },
    getInitialState: function () {
        return this.getStateFromStores();
    },
    onChange: function () {
        this.setState(this.getStateFromStores());
    },
    render: function () {
        var loading    = !this.state.managedBusinesses,
            businesses = this.state.managedBusinesses || [];

        // TODO: move this redirect logic into the route opening action
        if (!loading && businesses.length == 0) {
            // no business yet, redirect to claim page
            this.props.context.redirect(this.props.context.makePath('pro_business_new'));
        } else if (!loading && businesses.length == 1) {
            // redirect to the only business's dashboard
            this.props.context.redirect(this.props.context.makePath('pro_business', {
                businessId: businesses[0].id
            }));
        }

        //var businessNodes = lodash.map(businesses, this.renderBusiness);
        //console.log("businessNodes", businessNodes);
        return (
            <ProLayout context={this.props.context} withoutSideBar={true} loading={loading}>
                <h3>Mes salons</h3>
                {lodash.map(businesses, this.renderBusiness)}
            </ProLayout>
        );
    },
    renderBusiness: function(business) {
        return (
            <div className="col-sm-6 col-md-4 business-item" key={business.id}>
                <div className="thumbnail">
                    <Picture picture={business.pictures[0]} resolution={{width: 640, height: 640}} placeholder="/images/placeholder-640.png" />
                    <div className="caption">
                    <h3>{business.name}</h3>
                    <p>{business.numHairfies} Hairfies | {business.numReview ? business.numReview : 0} reviews </p>
                    <NavLink context={this.props.context} routeName="pro_business" navParams={{businessId: business.id}}>
                        <button className="btn btn-primary" role="button">Gérer ce salon</button>
                    </NavLink>
                    </div>
                    <a href={business.landingPageUrl} className="btn btn-primary" role="button" target="_blank">Se rendre sur la page publique</a>
                </div>
            </div>
        );
    }
});
