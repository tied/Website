'use strict';

var React = require('react');
var _ = require('lodash');
var PriceFilter = require('./PriceFilter.jsx');
var RadiusFilter = require('./RadiusFilter.jsx');
var GeoInput = require('../Form/PlaceAutocompleteInput.jsx');
var connectToStores = require('fluxible-addons-react/connectToStores');
var PlaceActions = require('../../actions/PlaceActions');
var DateTimeConstants = require('../../constants/DateTimeConstants');
var AutosuggestInput = require('./AutosuggestInput.jsx');

var Filters = React.createClass({
    contextTypes: {
        executeAction: React.PropTypes.func.isRequired
    },
    getInitialState: function () {
        var states = {
            price: true,
            openDays: true,
            categories: true,
            selections: true
        };
        _.map(this.props.tagCategories, function(cat, i){
            if (i < 2)
                states[cat.id]=true;
            else
                states[cat.id]=false;
        });

        return {
            location: this.props.place && this.props.place.name,
            isGeoActivated: false,
            q: this.props.search.q,
            expandedFilters: states
        };
    },
    componentWillReceiveProps: function(newProps) {
        if (newProps.currentPosition && this.state.isGeoActivated) {
            this.refs.address.refs.geoSuggest.update(newProps.currentPosition);
            this.setState({
                location: newProps.currentPosition,
                isGeoActivated: false
            }, function() {
                 this.props.onChange({
                    address: newProps.currentPosition
                });
            });
        }
        else if (newProps.place && newProps.place.name && newProps.place.name != 'France') {
            this.setState({
                location: newProps.place.name
            });
            this.refs.address.refs.geoSuggest.update(newProps.place.name);

        }
        if(!_.isUndefined(newProps.search.q) || !_.isUndefined(this.state.q) ) {
            this.setState({q: newProps.search.q});
        }
    },
    render: function () {
        return (
            <div className="sidebar">
                <section>
                    <form>
                    {this.renderSelections()}
                    {this.renderAddress()}
                    {this.renderDiscount()}
                    {this.renderTagsTypeahead()}
                    {this.renderCategories()}
                    {this.renderTags()}
                    {this.renderOpenDays()}
                    {this.renderPrice()}
                    {this.renderQ()}
                    </form>
                </section>
            </div>
        );
    },
    renderSelections: function () {
        if(_.isEmpty(this.props.selections)) return null;
        return (
            <div className={this.state.expandedFilters.selections ? '' : 'closed'}>
                <h2 onClick={this.toggleExpandedFilters.bind(this, 'selections')}>
                    Nos sélections de coiffeurs
                    <span className="chevron">›</span>
                </h2>
                <hr className='underliner'/>
                <div className='tag-list selections'>
                    {_.map(_.sortByOrder(this.props.selections, 'position'), function (selection) {
                        var active   = this.props.search && (this.props.search.selections || []).indexOf(selection.slug) > -1;
                        var onChange = active ? this.removeSelection.bind(this, selection.slug) : this.addSelection.bind(this, selection.slug);

                        return (
                            <label key={selection.label} className="checkbox-inline">
                                <input type="checkbox" align="baseline" 
                                    onChange={onChange} 
                                    checked={active} />
                                <span />
                                {selection.label + ' à Paris'}
                            </label>
                        );
                    }, this)}
                </div>
            </div>
        );
    },
    renderTagsTypeahead: function() {
        if (this.props.tab != 'hairfie') return;
        return (
            <div>
                <h2>Recherche de tags</h2>
                <AutosuggestInput 
                    addTag={this.addTag}
                    tags={this.props.tags} />
            </div>
        );
    },
    renderRadius: function () {
        if (!this.props.search.address || this.props.tab == "hairfie") return null;
        return <RadiusFilter min={500} max={10000} defaultValue={this.props.search.radius} onChange={this.handleRadiusChange} />;
    },
    renderPrice: function () {
        return <PriceFilter
            onChange={this.handlePriceChange} 
            expandedFilters={this.state.expandedFilters}
            priceLevel={this.props.search.priceLevel}
            categoryCount={this.countCategories(this.props.search.priceLevel)}
            toggleExpandedFilters={this.toggleExpandedFilters.bind(this, 'price')}/>;
    },
    renderQ: function () {
        if (!this.props.withQ) return;
        
        return (
            <div className="business-name">
                <h2 style={{borderBottom: 0}}>Nom du coiffeur</h2>
                <hr className='underliner q'/>
                <div className="input-group">
                    <input className="form-control" ref="query" type="text" value={this.state.q}
                        onChange={this.handleQueryChange}
                        placeholder='Nom du salon'
                        onKeyPress={this.handleKey} />
                    <div className="input-group-addon"><a role="button" onClick={this.handleChange}></a></div>
                </div>
            </div>
        );
    },
    handleQueryChange: function(e) {
        this.setState({q: e.target.value});
    },
    renderAddress: function() {
        if (!this.props.withQ) return;
        var aroundText = <span className='around-text'>Autour de moi</span>;
        if (this.state.isGeoActivated) {
            aroundText = (
                <div className="spinner">
                    <div className="bounce1"></div>
                    <div className="bounce2"></div>
                    <div className="bounce3"></div>
                </div>
            );
        }
        return (
            <div>
                <h2 style={{borderBottom: 0}}>Localisation</h2>
                <hr className='underliner location'/>
                <div className="input-group">
                    <GeoInput ref="address" type="text"
                        onKeyPress={this.handleKey}
                        onSuggestChange={this.handleChange}
                        />
                    <div className="input-group-addon" onClick={this.handleChange}><a role="button"></a></div>
                </div>
                <a className="btn btn-around" role="button" onClick={this.getMyPosition} title="Me localiser">{aroundText}</a>
            </div>
        );
    },
    renderCategories: function () {
        if (!this.props.categories) return;

        var categories = this.props.categories || [];
        if (categories.length == 0) return;
        return (
            <div className={this.state.expandedFilters.categories ? '' : 'closed'}>
                <h2 onClick={this.toggleExpandedFilters.bind(this, 'categories')}>
                    Spécialités {this.countCategories(this.props.search.categories)}
                    <span className="chevron">›</span>
                </h2>
                <hr className='underliner'/>
                <div className="tag-list">
                    {_.map(categories, function (category, i) {
                        var active   = this.props.search && (this.props.search.categories || []).indexOf(category.slug) > -1;
                        var onChange = active ? this.removeCategory.bind(this, category.slug) : this.addCategory.bind(this, category.slug);

                        return (
                            <label key={category.label} className="checkbox-inline">
                                <input type="checkbox" align="baseline" onChange={onChange} checked={active} />
                                <span />
                                {category.label}
                            </label>
                        );
                    }, this)}
                </div>
            </div>
        );
    },
    renderDiscount: function () {
        if (!this.props.withQ) return;

        var withDiscount = (this.props.search && this.props.search.withDiscount) || false;
        var onChange = withDiscount ? this.removeWithDiscount : this.addWithDiscount;

        return (
            <div>
                <hr className='underliner discount'/>
                <div className="tag-list discount">
                    <label className="checkbox-inline">
                        <input type="checkbox" align="baseline" onChange={onChange} checked={withDiscount} />
                        <span />
                        Avec une promotion
                    </label>
                </div>
            </div>
        );
    },
    renderTags: function () {
        var tags = this.props.tags || [];
        if (!this.props.tags || tags.length == 0) return;
        
        return (
            <div>
                {_.map(this.props.tagCategories, function (category) {
                    var title = <h2 onClick={this.toggleExpandedFilters.bind(this, category.id)}>{category.name}{this.countTagsByCategory(category)}<span className="chevron">›</span></h2>;

                    var tagsInCategory = _.map(tags, function(tag) {
                        if (tag.category.id != category.id) return;
                        var active   = this.props.search && (this.props.search.tags || []).indexOf(tag.name) > -1;
                        var onChange = active ? this.removeTag.bind(this, tag.name) : this.addTag.bind(this, tag.name);
                        return (
                                <label key={tag.name} className="checkbox-inline">
                                    <input type="checkbox" align="baseline" onChange={onChange} checked={active} />
                                    <span />
                                    {tag.name}
                                </label>
                        );
                    }, this);
                    tagsInCategory = _.compact(tagsInCategory);
                    if (_.isEmpty(tagsInCategory)) return;

                    return (
                        <div key={category.name} className={this.state.expandedFilters[category.id] ? '' : 'closed'}>
                            {title}
                            <div className='tag-list'>
                                {tagsInCategory}
                            </div>
                        </div>);
                }, this)}
            </div>
        );
    },
    renderOpenDays: function () {
        if (this.props.tab != "business") return null;

        var displayDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

        return (
            <div className={this.state.expandedFilters.openDays ? '' : 'closed'}>
                <h2 onClick={this.toggleExpandedFilters.bind(this, 'openDays')}>
                    Ouvert le {this.countCategories(this.props.search.days)}
                    <span className="chevron">›</span>
                </h2>
                <hr className='underliner'/>
                <div className="tag-list">
                    {_.map(DateTimeConstants.weekDaysNumber, function(day) {
                        if (_.isEmpty(_.intersection([day], displayDays))) return null;
                        var active   = this.props.search && (this.props.search.days || []).indexOf(day) > -1;
                        var onChange = active ? this.removeDay.bind(this, day) : this.addDay.bind(this, day);
                        return (
                            <label key={DateTimeConstants.weekDayLabelFR(day)} className="checkbox-inline">
                                <input type="checkbox" align="baseline" onChange={onChange} checked={active} />
                                <span />
                                {DateTimeConstants.weekDayLabelFR(day)}
                            </label>
                            );
                        }, this)
                    }
                </div>
            </div>
        );
    },
    toggleExpandedFilters: function(type) {
        var newState = this.state.expandedFilters;
        newState[type] = !this.state.expandedFilters[type];
        this.setState(newState);
    },
    countTagsByCategory: function(category) {
        var categoryTags= _.map(_.groupBy(this.props.tags, 'category.id')[category.id], function (filter) {
            return filter.name
        });

        var matchingTags = _.filter(this.props.search.tags, function(tag) {
            return _.include(categoryTags, tag)
        });
        var tagClass = matchingTags.length >0 ? 'tag-count' : null;
        return matchingTags.length > 0 ? <span className={tagClass}>{matchingTags.length}</span> : null;
    },
    countCategories: function (arrayToCount) {
        var tagClass = arrayToCount && arrayToCount.length > 0 ? 'tag-count' : null;
        if (typeof arrayToCount === 'undefined' || arrayToCount.length == 0) return;
        else return <span className={tagClass}>{arrayToCount.length}</span>;
    },
    handleLocationChange: function(e) {
        this.setState({
            location: e
        }, this.handleChange());
    },
    goToLocation: function(newLocationString) {
        this.props.onChange({address: newLocationString})
    },
    getMyPosition: function (e) {
        this.setState({
            isGeoActivated: true
        });
        this.context.executeAction(PlaceActions.getPlaceByGeolocation);
    },
    addCategory: function (category) {
        this.props.onChange({categories: _.union(this.props.search.categories || [], [category])});
    },
    removeCategory: function (category) {
        this.props.onChange({categories: _.without(this.props.search.categories, category)});
    },
    addTag: function (tag) {
        this.props.onChange({tags: _.union(this.props.search.tags || [], [tag])});
    },
    removeTag: function (tag) {
        this.props.onChange({tags: _.without(this.props.search.tags, tag)});
    },
    addDay: function (day) {
        this.props.onChange({days: _.union(this.props.search.days || [], [day])});
    },
    removeDay: function (day) {
        this.props.onChange({days: _.without(this.props.search.days, day)});
    },
    addSelection: function (selection) {
        this.refs.address.refs.geoSuggest.update('Paris, France');
        this.props.onChange({address: 'Paris, France', selections: _.union(this.props.search.selections || [], [selection])});
    },
    removeSelection: function (selection) {
        this.props.onChange({selections: _.without(this.props.search.selections, selection)});
    },
    addWithDiscount: function () {
        this.props.onChange({withDiscount: true});
    },
    removeWithDiscount: function () {
        this.props.onChange({withDiscount: false});
    },
    handleChange: function () {
        this.props.onChange({
            q: this.state.q,
            address: this.refs.address.getFormattedAddress()
        });
    },
    handleKey: function (e) {
        if(event.keyCode == 13){
            e.preventDefault();
            this.props.onChange({
                q: this.refs.query.value,
                address: this.refs.address.getFormattedAddress()
            });
         }
    },
    handleRadiusChange: function (nextRadius) {
        this.props.onChange({radius: nextRadius});
    },
    handlePriceChange: function (nextPriceArr) {
        this.props.onChange({priceLevel: nextPriceArr});
    }
});

Filters = connectToStores(Filters, [
    'PlaceStore'
], function (context, props) {
    return _.assign({}, {
        currentPosition: context.getStore('PlaceStore').getCurrentPosition()
    }, props);
});

module.exports = Filters;
