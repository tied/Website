var React = require('react');
var _ = require('lodash');
var SearchUtils = require('../../lib/search-utils');
var NavLink = require('flux-router-component').NavLink;

module.exports = React.createClass({
    render: function () {
        var crumbs = [];
        var business = this.props.business;
        var place  = business.address.city + ', France';

        crumbs = [
            {
                last: false,
                label: 'Accueil',
                routeName: 'home',
                navParams: {}
            },
            {
                last: false,
                label: 'Coiffeurs ' + business.address.city,
                routeName: 'business_search_results',
                navParams: {
                    address: SearchUtils.addressToUrlParameter(place)
                }
            },
            {
                last: false,
                label: business.name,
                routeName: 'show_business',
                navParams: {
                    businessId: business.id,
                    businessSlug: business.slug
                }
            },
            {
                last: true,
                label: 'Réservation',
                routeName: 'book_business',
                navParams: {
                    businessId: business.id,
                    businessSlug: business.slug
                }
            }
        ];

        return (
            <div className="col-xs-12">
                <ol className="breadcrumb">
                    {_.map(crumbs, function (crumb) {
                        if (crumb.last) {
                            return (
                                <li className="active">
                                    {crumb.label}
                                </li>
                            );
                        } else {
                            return (
                                <li>
                                    <NavLink context={this.props.context} routeName={crumb.routeName} navParams={crumb.navParams}>
                                        {crumb.label}
                                    </NavLink>
                                </li>
                            );
                        }
                    }, this)}
                </ol>
            </div>
        );
    }
});