'use strict';

var React = require('react');
var _ = require('lodash');

var ParentLayout = require('../PublicLayout.jsx');
var Link = require('../Link.jsx');
var Carousel = require('../Partial/Carousel.jsx');
var ShortInfos = require('./ShortInfos.jsx');
var Sidebar = require('./Sidebar.jsx');
var connectToStores = require('fluxible-addons-react/connectToStores');
var Breadcrumb = require('./Breadcrumb.jsx');

var Layout = React.createClass({
    render: function () {
        if (!this.props.business) {
            return <ParentLayout />
        }

        var business = this.props.business;

        return (
            <ParentLayout>
                <Breadcrumb business={business} />
                <Carousel id="carousel-salon" backgroundStyle={true} gallery={true} pictures={business.pictures} />
                <div className="container salon" id="content">
                    <div className="main-content col-md-8 col-sm-12">
                        <ShortInfos business={business} />
                        <section id="salon-content" className="salon-content">
                            <div className="row">
                                <div role="tabpannel">
                                    <div className="row">
                                        <ul className="nav nav-tabs" role="tablist">
                                            <li className={'col-xs-4'+('infos' === this.props.tab ? ' active' : '')}>
                                                <Link route="business" params={{ businessId: business.id, businessSlug: business.slug }} preserveScrollPosition={true}>
                                                    <span className="icon-nav"></span>
                                                    Informations
                                                </Link>
                                            </li>
                                            <li className={'col-xs-4'+('reviews' === this.props.tab ? ' active' : '')}>
                                                <Link route="business_reviews" params={{ businessId: business.id, businessSlug: business.slug }} preserveScrollPosition={true}>
                                                    <span className="icon-nav"></span>
                                                    Avis
                                                </Link>
                                            </li>
                                            <li className={'col-xs-4'+('hairfies' === this.props.tab ? ' active' : '')}>
                                                <Link route="business_hairfies" params={{ businessId: business.id, businessSlug: business.slug }} preserveScrollPosition={true}>
                                                    <span className="icon-nav"></span>
                                                    Hairfies
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="tab-content">
                                        <div role="tabpannel" className="tab-pane active">
                                            {this.props.children}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                    <Sidebar
                        business={this.props.business}
                        similarBusinesses={this.props.similarBusinesses}
                        />
                </div>
                <script type="application/ld+json" dangerouslySetInnerHTML={{__html: this.getSchema()}} />
            </ParentLayout>
        );
    },
    getSchema: function() {
        var business = this.props.business;
        var metas = this.props.metas;
        var description = _.find(metas, {property: 'description'}) || _.find(metas, {name: 'description'}) || {};

        var markup = {
          "@context": "http://schema.org",
          "@type": "HairSalon",
          "name": business.name,
          "url": this.props.canonicalUrl,
          "description": description.content
        };

        if(business.numReviews > 0) {
            markup["aggregateRating"] ={
                "@type": "AggregateRating",
                "ratingValue": business.rating/100*5,
                "reviewCount": business.numReviews
            }
        }

        return JSON.stringify(markup);
    }
});

Layout = connectToStores(Layout, [
    'BusinessStore',
    'MetaStore'
], function (context, props) {
    return {
        similarBusinesses: props.business && props.business.crossSell && context.getStore('BusinessStore').getSimilar(props.business.id),
        metas: context.getStore('MetaStore').getMetas(),
        canonicalUrl: context.getStore('MetaStore').getCanonicalUrl()
    };
});

module.exports = Layout;
