/** @jsx React.DOM */

'use strict';

var React = require('react');
var FluxibleMixin = require('fluxible').Mixin;
var TopHairfiesStore = require('../../stores/TopHairfiesStore');
var lodash = require('lodash');
var NavLink = require('flux-router-component').NavLink;
var NavToLinkMixin = require('../mixins/NavToLink.jsx');

module.exports = React.createClass({
    mixins: [FluxibleMixin, NavToLinkMixin],
    statics: {
        storeListeners: [TopHairfiesStore]
    },
    getStateFromStores: function () {
        var hairfies = this.getStore(TopHairfiesStore).get(this.props.numTopHairfies);
        return {
            hairfies   : hairfies
        };
    },
    getInitialState: function () {
        return this.getStateFromStores();
    },
    onChange: function () {
        this.setState(this.getStateFromStores());
    },
    render: function () {
        return (
            <section className="home-section">
                <h2>Les Hairfies du moment</h2>
                <div className="row">
                    <div className="col-md-6 col-xs-12 small-hairfies">
                        <div className="row">
                            {lodash.map(this.state.hairfies.slice(1, 5), function(h){ return this.renderHairfie(h, "col-xs-6")}, this)}
                        </div>
                    </div>

                    {this.renderHairfie(this.state.hairfies[0], 'col-md-6 col-xs-12 big', 'col-xs-12')}
                </div>
                <a href="#" className="btn btn-red home-cta col-md-3 col-xs-10">Plus de Hairfies</a>
            </section>
        );
    },
    renderHairfie: function (hairfie, hairfieClass, figureClass) {
        var pictureUrl = lodash.last(hairfie.pictures).url;
        var priceNode;
        if(hairfie.price) priceNode = <div className="pricetag">{hairfie.price.amount}{hairfie.price.currency == "EUR" ? "€" : ""}</div>;

        var displayBusinessName = hairfie.business ? hairfie.business.name : null;
        var displayBusinessAddress = hairfie.business ? hairfie.business.address.street + ' ' + hairfie.business.address.city : null;

        return (
            <div className={hairfieClass} onClick={this.navToLink.bind(this, "show_hairfie", {hairfieId: hairfie.id})} key={hairfie.id}>
                <figure className={figureClass}>
                    <img src={pictureUrl} />
                    <figcaption>
                        <NavLink routeName="show_hairfie" navParams={{hairfieId: hairfie.id}} context={this.props.context}>
                            {displayBusinessName}
                        </NavLink>
                        <NavLink className="address" routeName="show_hairfie" navParams={{hairfieId: hairfie.id}} context={this.props.context}>
                            {displayBusinessAddress}
                        </NavLink>
                        {priceNode}
                    </figcaption>
                                    <div className="clearfix" />

                </figure>
            </div>
        );
    }
});