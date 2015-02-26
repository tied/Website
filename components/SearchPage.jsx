/** @jsx React.DOM */

var React = require('react');
var FluxibleMixin = require('fluxible').Mixin;

var BusinessSearchActions = require('../actions/BusinessSearch');
var Navigate = require('flux-router-component/actions/navigate');
var BusinessSearchStore = require('../stores/BusinessSearchStore');

var NavLink = require('flux-router-component').NavLink;
var PublicLayout = require('./PublicLayout.jsx');

var Row = require('react-bootstrap/Row');
var Col = require('react-bootstrap/Col');
var Input = require('react-bootstrap/Input');
var Button = require('react-bootstrap/Button');
var AddressInput = require('./Form/AddressInput.jsx');

var lodashContrib = require('lodash-contrib');
var lodash = require('lodash');

module.exports = React.createClass({
    mixins: [FluxibleMixin],
    statics: {
        storeListeners: [BusinessSearchStore]
    },
    getStateFromStores: function () {
        var queryString = lodashContrib.toQuery(this.props.route.query);
        var businesses  = this.getStore(BusinessSearchStore).getByQueryString(queryString);

        return {
            businesses        : businesses
        };
    },
    getInitialState: function () {
        return this.getStateFromStores();
    },
    onChange: function () {
        this.setState(this.getStateFromStores());
    },
    render: function () {
        var businesses = this.state.businesses;
        var searchResultNodes = (businesses && businesses.length > 0) ? businesses.map(this.renderBusinessRow) : null;
        var queryParams = this.props.route.query;

        var defaultWomen = true;
        var defaultMen = true;

        queryParams.clientTypes = queryParams['clientTypes[]'];
        delete queryParams['clientTypes[]'];

        if(queryParams.clientTypes) {
            if(lodash.isString(queryParams.clientTypes)) queryParams.clientTypes = queryParams.clientTypes.split();

            var defaultWomen = (queryParams.clientTypes.indexOf("women") > -1);
            var defaultMen = (queryParams.clientTypes.indexOf("men") > -1);
        }

        return (
            <PublicLayout context={this.props.context} withLogin={false} customClass={'search'}>
                <div className="row search-bar">
                    <div className="col-sm-8 col-sm-offset-2 form-container">
                        <form role="form" className="form-inline">
                            <Input ref="businessName" type="text" className="main" placeholder="Salon, Ville etc..." defaultValue={queryParams.query} onChange={this.submit} />
                            <Button className="btn-red" onClick={this.submit}>Rechercher</Button>
                        </form>
                    </div>

                </div>
                <div className="row search-results">
                    <div className="filters col-sm-3">
                        <h4>Filtres</h4>
                        <Input ref="geoloc" type="checkbox" className="geoloc" label="Autour de moi" defaultChecked={queryParams.isGeoipable === 'true'} onChange={this.onCheckboxChange} />
                        <Input ref="men" type="checkbox" className="geoloc" label="Homme" defaultChecked={defaultMen} onChange={this.onCheckboxChange} />
                        <Input ref="women" type="checkbox" className="geoloc" label="Femme" defaultChecked={defaultWomen} onChange={this.onCheckboxChange} />

                    </div>
                    <div className="col-sm-9">
                        { searchResultNodes }
                    </div>
                </div>
            </PublicLayout>
        );
    },
    renderBusinessRow: function(business) {
        return (
            <div className="media" key={business.id}>
                <NavLink context={this.props.context} className="media-left" routeName="show_business" navParams={{businessId: business.id, businessSlug: business.slug}}>
                    <img src={business.pictures[0].url + '?height=100&width=100'} className="img-responsive" />
                </NavLink>
                <div className="media-body">
                    <h4 className="media-heading">
                        <NavLink context={this.props.context} className="media-left" routeName="show_business" navParams={{businessId: business.id, businessSlug: business.slug}}>
                            {business.name}
                        </NavLink>
                    </h4>
                    <p>{business.address.street} - {business.address.zipCode} {business.address.city}</p>
                    <p>{business.numHairfies} Hairfie(s)</p>
                </div>
            </div>
        );
    },
    submit: function (e) {
        if(e) e.preventDefault();

        var queryParams = {
            query       : this.refs.businessName.getValue(),
            isGeoipable : this.refs.geoloc.getChecked(),
            clientTypes : []
        }

        if(this.refs.men.getChecked())      queryParams.clientTypes.push("men");
        if(this.refs.women.getChecked())    queryParams.clientTypes.push("women");


        this.props.context.executeAction(Navigate, {
            url: this.props.context.makePath('search') + '?' + lodashContrib.toQuery(queryParams)
        });
    },
    onCheckboxChange: function(e) {
        this.submit();
    },
    onKeyDown: function(e) {
        if(e.key === 'Enter' && this.refs.businessAddress.getGps()) {
            this.submit();
        }
    }
});

