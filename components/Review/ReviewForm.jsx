'use strict';

var React = require('react');
var _ = require('lodash');
var Input = require('react-bootstrap').Input;
var Button = require('react-bootstrap').Button;
var Alert = require('react-bootstrap').Alert;
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;
var RatingInput = require('./RatingInput.jsx');
var ReviewRating = require('./ReviewRating.jsx');
var AverageRating = require('./AverageRating.jsx');
var UserInfos = require('./Userinfos.jsx');
var BusinessInfos = require('./BusinessInfos.jsx');
var classNames = require('classnames');

var RequiredAsterisk = React.createClass({
    render: function () {
        return <span className="required-asterisk">*</span>;
    }
});
var ReviewForm = React.createClass({
    getInitialState: function() {
        var brr = this.props.businessReviewRequest;
        var cu = this.props.currentUser;
        return {
            review  : {
                businessId  : this.props.business.id,
                requestId   : (brr && brr.id) || undefined,
                authorId    : cu ? cu.id : undefined,
                firstName   : (brr && brr.booking && brr.booking.firstName) || (cu && cu.firstName) || null,
                lastName    : (brr && brr.booking && brr.booking.lastName) || (cu && cu.lastName) || null,
                gender      : (brr && brr.booking && brr.booking.gender) || (cu && cu.gender) || null,
                email       : (brr && brr.email) || (cu && cu.email) || null,
                phoneNumber : (brr && brr.booking && brr.booking.phoneNumber) || (cu && cu.phoneNumber) || null,
                criteria    : null,
                comment     : null
            },
            page    : 1,
            error   : null
        };
    },
    componentWillReceiveProps: function(nextProps) {
        console.log('NEXTPROPS', nextProps);
        // debugger;
        if (!nextProps.currentUser) return;
        var review = this.state.review;
        this.setState({
            review: _.assign({}, this.state.review, {
                firstName   : _.isNull(review.firstName) ? nextProps.currentUser.firstName : review.firstName, 
                lastName    : _.isNull(review.lastName) ? nextProps.currentUser.lastName : review.lastName, 
                gender      : _.isNull(review.gender) ? nextProps.currentUser.gender : review.gender, 
                email       : _.isNull(review.firstName) ? nextProps.currentUser.email : review.email, 
                phoneNumber : _.isNull(review.firstName) ? nextProps.currentUser.phoneNumber : review.phoneNumber
            })
        });
    },
    render: function () {
        console.log('review', this.state.review);
        console.log('page', this.state.page);
        return (
            <div {...this.props}>
                {this.renderDesktop()}
                {this.renderMobile()}
            </div>
        );
    },
    renderDesktop: function () {
        var page1Class = classNames({'hidden': this.state.page != 1});
        var page2Class = classNames({'hidden': this.state.page != 2});
        return (
            <div className="hidden-xs">
                #JESUISBUREAU
                <BusinessInfos 
                    businessReviewRequest={this.props.businessReviewRequest} 
                    business={this.props.business}/>
                <ReviewRating
                    ref='reviewRating'
                    version='desktop'
                    handleCriteria={this.handleCriteria} 
                    review={this.state.review}
                    className={page1Class}/>
                <AverageRating
                    version='desktop'
                    review={this.state.review} 
                    handlePage={this.handlePage}
                    validateRating={this.validateRating()}
                    className={page1Class}/>
                <UserInfos 
                    review={this.state.review}
                    currentUser={this.props.currentUser}
                    handlePage={this.handlePage}
                    className={page2Class}
                    businessReviewRequest={this.props.businessReviewRequest}
                    handleUserInfos={this.handleUserInfos} />
            </div>
        );
    },
    renderMobile: function () {
        var page1Class = classNames({'hidden': this.state.page != 1});
        var page2Class = classNames({'hidden': this.state.page != 2});
        var page3Class = classNames({'hidden': this.state.page != 3});
        console.log('VALIDATRATING', this.validateRating());
        return (
            <div className="visible-xs">
                #JESUISMOBILE
                <BusinessInfos 
                    businessReviewRequest={this.props.businessReviewRequest} 
                    business={this.props.business}/>
                <ReviewRating 
                    version='mobile'
                    handleCriteria={this.handleCriteria} 
                    review={this.state.review}
                    handlePage={this.handlePage}
                    validateRating={this.validateRating()}
                    className={page1Class}/>
                <AverageRating 
                    version='mobile'
                    review={this.state.review} 
                    handlePage={this.handlePage}
                    validateRating={this.validateRating()}
                    className={page2Class}/>
                <UserInfos 
                    review={this.state.review}
                    currentUser={this.props.currentUser}
                    handlePage={this.handlePage}
                    className={page3Class} 
                    businessReviewRequest={this.props.businessReviewRequest}
                    onSubmit={this.handleUserInfos} />
            </div>
        );
    },
    handleUserInfos: function(user) {
        console.log('USER', user);
    },
    handleCriteria: function(ratingKind, ratingValue) {
        var criteria = 1;
        var rating = {};
        rating[ratingKind] = ratingValue;
        this.setState({review: _.assign({}, this.state.review, {criteria: _.assign({}, this.state.review.criteria, rating)})});
    },
    handlePage: function() {
        if (this.props.reviewKind == 'BOOKING' && this.state.page == 2){
            return this.props.onSubmit(this.state.review);
        }
        this.setState({page: (this.state.page + 1)});
    },
    isPostResa: function() {
        brr = this.props.businessReviewRequest;

    },
    validateRating: function() {
        var criteria = this.state.review.criteria;
        var result =  !(_.isNull(criteria) || _.isUndefined(criteria.business) 
                                           || _.isUndefined(criteria.businessMember) 
                                           || _.isUndefined(criteria.haircut));
        return result;
    }
    // getInitialState: function () {
    //     if (this.props.businessReviewRequest && this.props.businessReviewRequest.booking) {
    //         return {
    //             firstName: this.props.businessReviewRequest.booking.firstName || (this.props.currentUser && this.props.currentUser.firstName) || "",
    //             lastName: this.props.businessReviewRequest.booking.lastName || (this.props.currentUser && this.props.currentUser.lastName) || "",
    //             email: this.props.businessReviewRequest.booking.email || this.props.businessReviewRequest.email || (this.props.currentUser && this.props.currentUser.email) || "",
    //             phoneNumber: this.props.businessReviewRequest.booking.phoneNumber || (this.props.currentUser && this.props.currentUser.phoneNumber) || "",
    //             gender: this.props.businessReviewRequest.booking.gender || (this.props.currentUser && this.props.currentUser.gender) || "FEMALE",
    //             errors: []
    //         };
    //     }
    //     else if (this.props.currentUser) {
    //         return {
    //             firstName: this.props.currentUser.firstName || "",
    //             lastName: this.props.currentUser.lastName || "",
    //             gender: this.props.currentUser.gender || "FEMALE",
    //             email: this.props.businessReviewRequest ? this.props.businessReviewRequest.email : this.props.currentUser.email || "",
    //             phoneNumber: this.props.currentUser.phoneNumber || "",
    //             errors: []
    //         }
    //     }
    //     return {
    //         errors: [],
    //         gender: "FEMALE"
    //     };
    // },
    // componentWillReceiveProps: function(nextProps) {
    //     if (!nextProps.currentUser)
    //         return;
    //     this.setState({
    //         firstName: nextProps.currentUser.firstName || "",
    //         lastName: nextProps.currentUser.lastName || "",
    //         email: nextProps.currentUser.email || "",
    //         phoneNumber: nextProps.currentUser.phoneNumber  || "",
    //         gender: nextProps.currentUser.gender || "FEMALE"
    //     });
    // },
    // render: function () {
    //     var errorsNode;
    //     if (this.state.errors.length) {
    //         errorsNode = (
    //             <Alert bsStyle="danger">
    //                 <ul className="list-unstyled">
    //                     {this.state.errors.map(function (error) {
    //                         return <li key={error}>{error}</li>;
    //                     })}
    //                 </ul>
    //             </Alert>
    //         );
    //     }

    //     return (
    //         <div>
    //             {errorsNode}
    //             <Row>
    //                 <Col sm={3}>
    //                     <Input ref="firstName" type="text"
    //                         value={this.state.firstName}
    //                         onChange={this.handleFirstNameChanged}
    //                         label={<div>Votre prénom <RequiredAsterisk /></div>}
    //                     />
    //                 </Col>
    //                 <Col sm={5}>
    //                     <Input ref="lastName" type="text"
    //                         value={this.state.lastName}
    //                         onChange={this.handleLasttNameChanged}
    //                         label={<div>Votre nom <RequiredAsterisk /> <small>(cette information n'apparaitra pas)</small></div>}
    //                     />
    //                 </Col>
    //                 <Col sm={4}>
    //                     <div style={{fontWeight: 'bold'}}>Votre genre (Homme ou Femme) <RequiredAsterisk /></div>
    //                     <select ref="gender" value={this.state.gender} onChange={this.handleGender}>
    //                             <optgroup>
    //                                 <option value="MALE">Homme</option>
    //                                 <option value="FEMALE">Femme</option>
    //                             </optgroup>
    //                     </select>
    //                 </Col>
    //                 <Col sm={6}>
    //                     <Input ref="email" type="text"
    //                         value={this.state.email}
    //                         onChange={this.handleEmailChanged}
    //                         label={<div>Votre adresse email <RequiredAsterisk /> <small>(cette information n'apparaitra pas)</small></div>}
    //                     />
    //                 </Col>
    //                 <Col sm={6}>
    //                     <Input ref="phoneNumber" type="text"
    //                         value={this.state.phoneNumber}
    //                         onChange={this.handlePhoneNumberChanged}
    //                         label={<div>Votre numéro de téléphone <small>(cette information n'apparaitra pas)</small></div>}
    //                     />
    //                 </Col>
    //             </Row>
    //             <hr />
    //             <p>Veuillez attribuer une note à chacun des critères suivants :</p>
    //             <br />
    //             <Row>
    //                 <Col xs={6} md={4}>
    //                     <RatingInput ref="welcome" label="Accueil" className="interactive" />
    //                 </Col>
    //                 <Col xs={6} md={4}>
    //                     <RatingInput ref="discussion" label="Discussions" className="interactive" />
    //                 </Col>
    //                 <Col xs={6} md={4}>
    //                     <RatingInput ref="decoration" label="Décoration" className="interactive" />
    //                 </Col>
    //                 <Col xs={6} md={4}>
    //                     <RatingInput ref="hygiene" label="Hygiène" className="interactive" />
    //                 </Col>
    //                 <Col xs={6} md={4}>
    //                     <RatingInput ref="treatment" label="Soins" className="interactive" />
    //                 </Col>
    //                 <Col xs={6} md={4}>
    //                     <RatingInput ref="resultQuality" label="Qualité du résultat" className="interactive" />
    //                 </Col>
    //                 <Col xs={6} md={4}>
    //                     <RatingInput ref="availability" label="Disponibilité" className="interactive" />
    //                 </Col>
    //             </Row>
    //             <hr />
    //             <Input ref="comment" type="textarea" label="Un commentaire ?" />
    //             <Button onClick={this.submit} className="btn btn-book full">Je dépose mon avis</Button>
    //             <hr />
    //             <p><RequiredAsterisk /> Indique les champs requis.</p>
    //         </div>
    //     );
    // },
    // handleFirstNameChanged: function (e) {
    //     this.setState({
    //         firstName: e.currentTarget.value
    //     });
    // },
    // handleLastNameChanged: function (e) {
    //     this.setState({
    //         lastName: e.currentTarget.value
    //     });
    // },
    // handleEmailChanged: function (e) {
    //     this.setState({
    //         email: e.currentTarget.value
    //     });
    // },
    // handlePhoneNumberChanged: function (e) {
    //     this.setState({
    //         phoneNumber: e.currentTarget.value
    //     });
    // },
    // handleGender: function (e) {
    //     e.preventDefault();
    //     this.setState({gender: this.refs.gender.value});
    // },
    // getReview: function () {
    //     return {
    //         businessId  : this.props.business.id,
    //         authorId    : this.props.currentUser ? this.props.currentUser.id : undefined,
    //         firstName   : this.refs.firstName.getValue().trim(),
    //         lastName    : this.refs.lastName.getValue().trim(),
    //         gender      : this.refs.gender.value.trim(),
    //         email       : this.refs.email.getValue().trim(),
    //         phoneNumber : this.refs.phoneNumber.getValue().trim(),
    //         criteria    : {
    //             welcome             : this.refs.welcome.getValue(),
    //             discussion          : this.refs.discussion.getValue(),
    //             decoration          : this.refs.decoration.getValue(),
    //             hygiene             : this.refs.hygiene.getValue(),
    //             treatment           : this.refs.treatment.getValue(),
    //             resultQuality       : this.refs.resultQuality.getValue(),
    //             availability        : this.refs.availability.getValue()
    //         },
    //         comment     : this.refs.comment.getValue().trim(),
    //         requestId   : this.props.businessReviewRequest && this.props.businessReviewRequest.id || undefined
    //     }
    // },
    // submit: function () {
    //     var review = this.getReview(),
    //         errors = [];

    //     if ('' == review.firstName) errors.push('Veuillez saisir votre prénom.');
    //     if ('' == review.lastName) errors.push('Veuillez saisir votre nom.');
    //     if (_.some(_.values(review.criteria), function (v) { return !v })) errors.push('Veuillez attribuer une note à chacun des critères.');

    //     this.setState({errors: errors});

    //     if (!errors.length) this.props.onSubmit(review);
    // }
});

module.exports = ReviewForm;
