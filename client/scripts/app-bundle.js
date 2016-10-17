define('config',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        server: {
            api: 'http://localhost:8080/api/'
        }
    };
});

define('environment',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        debug: true,
        testing: true
    };
});

define('main',["require", "exports", './environment'], function (require, exports, environment_1) {
    "use strict";
    Promise.config({
        warnings: {
            wForgottenReturn: false
        }
    });
    function configure(aurelia) {
        aurelia.use
            .standardConfiguration()
            .feature('common/resources');
        if (environment_1.default.debug) {
            aurelia.use.developmentLogging();
        }
        if (environment_1.default.testing) {
            aurelia.use.plugin('aurelia-testing');
        }
        aurelia.start().then(function () { return aurelia.setRoot('applications/axview/app'); });
    }
    exports.configure = configure;
});

define('applications/axview/app',["require", "exports"], function (require, exports) {
    "use strict";
    var App = (function () {
        function App() {
        }
        App.prototype.configureRouter = function (config, router) {
            config.title = 'Axone';
            config.map([
                { route: ['', 'home'], name: 'home', moduleId: './routes/home', nav: true, title: 'Home' },
                { route: ['cells'], name: 'cells', moduleId: './routes/cells', nav: true, title: 'Cells' },
                { route: ['about'], name: 'about', moduleId: './routes/about', nav: true, title: 'About' }
            ]);
            this.router = router;
        };
        return App;
    }());
    exports.App = App;
});

define('applications/contactlist/app',["require", "exports"], function (require, exports) {
    "use strict";
    var App = (function () {
        function App() {
        }
        App.prototype.configureRouter = function (config, router) {
            config.title = 'Contacts';
            config.map([
                { route: '', moduleId: './no-selection', title: 'Select' },
                { route: 'contacts/:id', moduleId: './contact-detail', name: 'contacts' }
            ]);
            this.router = router;
        };
        return App;
    }());
    exports.App = App;
});

define('applications/contactlist/web-api',["require", "exports"], function (require, exports) {
    "use strict";
    var latency = 200;
    var id = 0;
    function getId() {
        return ++id;
    }
    var contacts = [
        {
            id: getId(),
            firstName: 'John',
            lastName: 'Tolkien',
            email: 'tolkien@inklings.com',
            phoneNumber: '867-5309'
        },
        {
            id: getId(),
            firstName: 'Clive',
            lastName: 'Lewis',
            email: 'lewis@inklings.com',
            phoneNumber: '867-5309'
        },
        {
            id: getId(),
            firstName: 'Owen',
            lastName: 'Barfield',
            email: 'barfield@inklings.com',
            phoneNumber: '867-5309'
        },
        {
            id: getId(),
            firstName: 'Charles',
            lastName: 'Williams',
            email: 'williams@inklings.com',
            phoneNumber: '867-5309'
        },
        {
            id: getId(),
            firstName: 'Roger',
            lastName: 'Green',
            email: 'green@inklings.com',
            phoneNumber: '867-5309'
        }
    ];
    var WebAPI = (function () {
        function WebAPI() {
            this.isRequesting = false;
        }
        WebAPI.prototype.getContactList = function () {
            var _this = this;
            this.isRequesting = true;
            return new Promise(function (resolve) {
                setTimeout(function () {
                    var results = contacts.map(function (x) {
                        return {
                            id: x.id,
                            firstName: x.firstName,
                            lastName: x.lastName,
                            email: x.email
                        };
                    });
                    resolve(results);
                    _this.isRequesting = false;
                }, latency);
            });
        };
        WebAPI.prototype.getContactDetails = function (id) {
            var _this = this;
            this.isRequesting = true;
            return new Promise(function (resolve) {
                setTimeout(function () {
                    var found = contacts.filter(function (x) { return x.id == id; })[0];
                    resolve(JSON.parse(JSON.stringify(found)));
                    _this.isRequesting = false;
                }, latency);
            });
        };
        WebAPI.prototype.saveContact = function (contact) {
            var _this = this;
            this.isRequesting = true;
            return new Promise(function (resolve) {
                setTimeout(function () {
                    var instance = JSON.parse(JSON.stringify(contact));
                    var found = contacts.filter(function (x) { return x.id == contact.id; })[0];
                    if (found) {
                        var index = contacts.indexOf(found);
                        contacts[index] = instance;
                    }
                    else {
                        instance.id = getId();
                        contacts.push(instance);
                    }
                    _this.isRequesting = false;
                    resolve(instance);
                }, latency);
            });
        };
        return WebAPI;
    }());
    exports.WebAPI = WebAPI;
});

define('applications/contactlist/messages',["require", "exports"], function (require, exports) {
    "use strict";
    var ContactUpdated = (function () {
        function ContactUpdated(contact) {
            this.contact = contact;
        }
        return ContactUpdated;
    }());
    exports.ContactUpdated = ContactUpdated;
    var ContactViewed = (function () {
        function ContactViewed(contact) {
            this.contact = contact;
        }
        return ContactViewed;
    }());
    exports.ContactViewed = ContactViewed;
});

define('applications/contactlist/utility',["require", "exports"], function (require, exports) {
    "use strict";
    function areEqual(obj1, obj2) {
        return Object.keys(obj1).every(function (key) { return obj2.hasOwnProperty(key) && (obj1[key] === obj2[key]); });
    }
    exports.areEqual = areEqual;
    ;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('applications/contactlist/contact-detail',["require", "exports", 'aurelia-framework', 'aurelia-event-aggregator', './web-api', './messages', './utility'], function (require, exports, aurelia_framework_1, aurelia_event_aggregator_1, web_api_1, messages_1, utility_1) {
    "use strict";
    var ContactDetail = (function () {
        function ContactDetail(api, ea) {
            this.api = api;
            this.ea = ea;
        }
        ContactDetail.prototype.activate = function (params, routeConfig) {
            var _this = this;
            this.routeConfig = routeConfig;
            return this.api.getContactDetails(params.id).then(function (contact) {
                _this.contact = contact;
                _this.routeConfig.navModel.setTitle(_this.contact.firstName);
                _this.originalContact = JSON.parse(JSON.stringify(_this.contact));
                _this.ea.publish(new messages_1.ContactViewed(_this.contact));
            });
        };
        Object.defineProperty(ContactDetail.prototype, "canSave", {
            get: function () {
                return this.contact.firstName && this.contact.lastName && !this.api.isRequesting;
            },
            enumerable: true,
            configurable: true
        });
        ContactDetail.prototype.save = function () {
            var _this = this;
            this.api.saveContact(this.contact).then(function (contact) {
                _this.contact = contact;
                _this.routeConfig.navModel.setTitle(_this.contact.firstName);
                _this.originalContact = JSON.parse(JSON.stringify(_this.contact));
                _this.ea.publish(new messages_1.ContactUpdated(_this.contact));
            });
        };
        ContactDetail.prototype.canDeactivate = function () {
            if (!utility_1.areEqual(this.originalContact, this.contact)) {
                var result = confirm('You have unsaved changes. Are you sure you wish to leave?');
                if (!result) {
                    this.ea.publish(new messages_1.ContactViewed(this.contact));
                }
                return result;
            }
            return true;
        };
        ContactDetail = __decorate([
            aurelia_framework_1.inject(web_api_1.WebAPI, aurelia_event_aggregator_1.EventAggregator), 
            __metadata('design:paramtypes', [web_api_1.WebAPI, aurelia_event_aggregator_1.EventAggregator])
        ], ContactDetail);
        return ContactDetail;
    }());
    exports.ContactDetail = ContactDetail;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('applications/contactlist/contact-list',["require", "exports", 'aurelia-event-aggregator', './web-api', './messages', 'aurelia-framework'], function (require, exports, aurelia_event_aggregator_1, web_api_1, messages_1, aurelia_framework_1) {
    "use strict";
    var ContactList = (function () {
        function ContactList(api, ea) {
            var _this = this;
            this.api = api;
            this.selectedId = 0;
            ea.subscribe(messages_1.ContactViewed, function (msg) { return _this.select(msg.contact); });
            ea.subscribe(messages_1.ContactUpdated, function (msg) {
                var id = msg.contact.id;
                var found = _this.contacts.find(function (x) { return x.id == id; });
                Object.assign(found, msg.contact);
            });
        }
        ContactList.prototype.created = function () {
            var _this = this;
            this.api.getContactList().then(function (contacts) { return _this.contacts = contacts; });
        };
        ContactList.prototype.select = function (contact) {
            this.selectedId = contact.id;
            return true;
        };
        ContactList = __decorate([
            aurelia_framework_1.inject(web_api_1.WebAPI, aurelia_event_aggregator_1.EventAggregator), 
            __metadata('design:paramtypes', [web_api_1.WebAPI, aurelia_event_aggregator_1.EventAggregator])
        ], ContactList);
        return ContactList;
    }());
    exports.ContactList = ContactList;
});

define('applications/contactlist/environment',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        debug: true,
        testing: true
    };
});

define('applications/contactlist/no-selection',["require", "exports"], function (require, exports) {
    "use strict";
    var NoSelection = (function () {
        function NoSelection() {
            this.message = "Please Select a Contact.";
        }
        return NoSelection;
    }());
    exports.NoSelection = NoSelection;
});

define('applications/twitter/app',["require", "exports"], function (require, exports) {
    "use strict";
    var AVATAR = 'https://s3.amazonaws.com/uifaces/faces/twitter/sachagreif/128.jpg';
    var NAME = 'John Citizen';
    var HANDLE = '@johncitizen';
    var App = (function () {
        function App() {
            this.composedTweet = null;
            this.tweets = [];
            this.tweets = [
                {
                    avatar: 'https://pbs.twimg.com/profile_images/615392662233808896/EtxjSSKk_bigger.jpg',
                    name: 'TechCrunch',
                    handle: '@TechCrunch',
                    text: 'Naval Ravikant on China money into Silicon Valley: This trickle could become a tsunami'
                },
                {
                    avatar: 'https://pbs.twimg.com/profile_images/1332650890/strayfromthepath_flagtee_artworkslide_bigger.jpg',
                    name: 'Stray From The Path',
                    handle: '@strayfromdapath',
                    text: 'This week has been such shit. The only thing that\'s made me happy is the impending STYG/Expire/KL tour and Shinsuke Nakamura entrance at NXT'
                },
                {
                    avatar: 'https://pbs.twimg.com/profile_images/668902554957316096/IpjBGyjC_bigger.jpg',
                    name: 'Chris Sacca',
                    handle: '@sacca',
                    text: 'I want a sports channel that is only highlights. 100% plays of the day/week/month. No shows. No narrative. Who\'s with me?'
                }
            ];
        }
        App.prototype.createTweet = function () {
            this.tweets.unshift({
                avatar: AVATAR,
                name: NAME,
                handle: HANDLE,
                text: this.composedTweet
            });
            this.composedTweet = null;
        };
        App.prototype.handleKeyPress = function (evt) {
            if (evt.keyCode === 13 && this.composedTweet) {
                this.createTweet();
                evt.preventDefault();
            }
            else {
                return true;
            }
        };
        return App;
    }());
    exports.App = App;
});

define('common/resources/index',["require", "exports"], function (require, exports) {
    "use strict";
    function configure(config) {
        config.globalResources(['./elements/nav-bar']);
    }
    exports.configure = configure;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('common/services/ax-api-client',["require", "exports", 'aurelia-fetch-client', './../../config'], function (require, exports, aurelia_fetch_client_1, config_1) {
    "use strict";
    var default_1 = (function (_super) {
        __extends(default_1, _super);
        function default_1() {
            _super.call(this);
            this.configure(function (config) {
                config
                    .withBaseUrl(config_1.default.server.api)
                    .withDefaults({
                    credentials: 'same-origin',
                    headers: {
                        'Accept': 'application/json',
                        'X-Requested-With': 'Fetch'
                    }
                })
                    .withInterceptor({
                    request: function (request) {
                        console.log("Requesting " + request.method + " " + request.url);
                        return request;
                    },
                    response: function (response) {
                        console.log("Received " + response.status + " " + response.url);
                        return response;
                    }
                });
            });
        }
        return default_1;
    }(aurelia_fetch_client_1.HttpClient));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    ;
});

define('applications/axview/resources/index',["require", "exports"], function (require, exports) {
    "use strict";
    function configure(config) {
    }
    exports.configure = configure;
});

define('applications/axview/routes/about',["require", "exports"], function (require, exports) {
    "use strict";
    var default_1 = (function () {
        function default_1() {
            this.title = 'Axone';
            this.info = 'Thirst for knowledge, a tool to handle collecting information, gathering data and acquiring knowledge';
        }
        return default_1;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('applications/axview/routes/cells',["require", "exports", 'aurelia-framework', '../../../common/services/ax-api-client'], function (require, exports, aurelia_framework_1, ax_api_client_1) {
    "use strict";
    var default_1 = (function () {
        function default_1(http) {
            this.http = http;
            this.isLoading = true;
            this.cells = [];
        }
        default_1.prototype.activate = function (params, routeConfig) {
            var _this = this;
            this.isLoading = true;
            this.http.fetch('')
                .then(function (response) { return response.json(); }).then(function (cells) {
                _this.cells = cells;
                _this.isLoading = false;
            })
                .catch(function (err) {
                console.log(err);
                _this.isLoading = false;
            });
        };
        default_1 = __decorate([
            aurelia_framework_1.inject(ax_api_client_1.default), 
            __metadata('design:paramtypes', [ax_api_client_1.default])
        ], default_1);
        return default_1;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

define('applications/axview/routes/home',["require", "exports"], function (require, exports) {
    "use strict";
    var default_1 = (function () {
        function default_1() {
            this.title = 'Welcome !!!!';
        }
        return default_1;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

define('applications/twitter/resources/index',["require", "exports"], function (require, exports) {
    "use strict";
    function configure(config) {
    }
    exports.configure = configure;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('common/resources/elements/nav-bar',["require", "exports", 'aurelia-framework'], function (require, exports, aurelia_framework_1) {
    "use strict";
    var NavBar = (function () {
        function NavBar() {
        }
        __decorate([
            aurelia_framework_1.bindable, 
            __metadata('design:type', Object)
        ], NavBar.prototype, "router", void 0);
        return NavBar;
    }());
    exports.NavBar = NavBar;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('applications/axview/resources/elements/cells-view',["require", "exports", 'aurelia-framework'], function (require, exports, aurelia_framework_1) {
    "use strict";
    var CellsView = (function () {
        function CellsView() {
        }
        __decorate([
            aurelia_framework_1.bindable, 
            __metadata('design:type', Object)
        ], CellsView.prototype, "cells", void 0);
        return CellsView;
    }());
    exports.CellsView = CellsView;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('applications/twitter/resources/elements/tweet',["require", "exports", 'aurelia-framework'], function (require, exports, aurelia_framework_1) {
    "use strict";
    var Tweet = (function () {
        function Tweet() {
        }
        __decorate([
            aurelia_framework_1.bindable, 
            __metadata('design:type', Object)
        ], Tweet.prototype, "tweet", void 0);
        return Tweet;
    }());
    exports.Tweet = Tweet;
});

define('text!applications/axview/app.html', ['module'], function(module) { module.exports = "<template>\n\t<link href=\"//maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css\" rel=\"stylesheet\">\n\t<require from=\"./assets/styles/styles.css\"></require>\n\t<require from=\"bootstrap/css/bootstrap.css\"></require>\n\t<nav-bar router.bind=\"router\"></nav-bar>\n\t<div class=\"page-host\">\n\t\t<router-view></router-view>\n\t</div>\n</template>"; });
define('text!applications/contactlist/app.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"bootstrap/css/bootstrap.css\"></require>\n  <require from=\"./assets/styles/styles.css\"></require>\n  <require from=\"./contact-list\"></require>\n  <require from=\"./no-selection\"></require>\n\n  <nav class=\"navbar navbar-default navbar-fixed-top\" role=\"navigation\">\n    <div class=\"navbar-header\">\n      <a class=\"navbar-brand\" href=\"#\">\n        <i class=\"fa fa-user\"></i>\n        <span>Contacts</span>\n      </a>\n    </div>\n  </nav>\n\n  <div class=\"container\">\n    <div class=\"row\">\n      <contact-list class=\"col-md-4\"></contact-list>\n      <router-view class=\"col-md-8\"></router-view>\n    </div>\n  </div>\n</template>"; });
define('text!applications/axview/assets/styles/styles.css', ['module'], function(module) { module.exports = "body,\nmargin 0,\n.container,\nmargin-top 50px,\n.navbar-right,\nmargin-right 0 !important,\n.splash {\n  text-align: center;\n  margin: 10% 0 0 0;\n  box-sizing: border-box;\n}\n.splash .message {\n  font-size: 72px;\n  line-height: 72px;\n  text-shadow: rgba(0,0,0,0.5) 0 0 15px;\n  text-transform: uppercase;\n  font-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n}\n.splash .fa-spinner {\n  text-align: center;\n  display: inline-block;\n  font-size: 72px;\n  margin-top: 50px;\n}\n.page-host {\n  position: absolute;\n  left: 0;\n  right: 0;\n  top: 50px;\n  bottom: 0;\n  overflow-x: hidden;\n  overflow-y: auto;\n}\n@media print {\n  .page-host {\n    position: absolute;\n    left: 10px;\n    right: 0;\n    top: 50px;\n    bottom: 0;\n    overflow-y: inherit;\n    overflow-x: inherit;\n  }\n}\nsection {\n  margin: 20px 20px;\n}\n.navbar-nav li.loader {\n  margin: 12px 24px 0 6px;\n}\n.pictureDetail {\n  max-width: 425px;\n}\n/* animate page transitions */\nsection.au-enter-active {\n  -webkit-animation: fadeInRight 1s;\n  animation: fadeInRight 1s;\n}\ndiv.au-stagger {\n  -webkit-animation-delay: 50ms;\n  animation-delay: 50ms;\n}\n.card-container.au-enter {\n  opacity: 0 !important;\n}\n.card-container.au-enter-active {\n  -webkit-animation: fadeIn 2s;\n  animation: fadeIn 2s;\n}\n.card {\n  overflow: hidden;\n  position: relative;\n  border: 1px solid #ccc;\n  border-radius: 8px;\n  text-align: center;\n  padding: 0;\n  background-color: #337ab7;\n  color: #88acd9;\n  margin-bottom: 32px;\n  box-shadow: 0 0 5px rgba(0,0,0,0.5);\n}\n.card .content {\n  margin-top: 10px;\n}\n.card .content .name {\n  color: #fff;\n  text-shadow: 0 0 6px rgba(0,0,0,0.5);\n  font-size: 18px;\n}\n.card .header-bg {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 70px;\n  border-bottom: 1px #fff solid;\n  border-radius: 6px 6px 0 0;\n}\n.card .avatar {\n  position: relative;\n  margin-top: 15px;\n  z-index: 100;\n}\n.card .avatar img {\n  width: 100px;\n  height: 100px;\n  -webkit-border-radius: 50%;\n  -moz-border-radius: 50%;\n  border-radius: 50%;\n  border: 2px #fff solid;\n}\n/* animation definitions */\n@-webkit-keyframes fadeInRight {\n  0% {\n    opacity: 0;\n    -webkit-transform: translate3d(100%, 0, 0);\n    transform: translate3d(100%, 0, 0);\n  }\n  100% {\n    opacity: 1;\n    -webkit-transform: none;\n    transform: none;\n  }\n}\n@-webkit-keyframes fadeIn {\n  0% {\n    opacity: 0;\n  }\n  100% {\n    opacity: 1;\n  }\n}\n@-moz-keyframes fadeInRight {\n  0% {\n    opacity: 0;\n    -webkit-transform: translate3d(100%, 0, 0);\n    -ms-transform: translate3d(100%, 0, 0);\n    transform: translate3d(100%, 0, 0);\n  }\n  100% {\n    opacity: 1;\n    -webkit-transform: none;\n    -ms-transform: none;\n    transform: none;\n  }\n}\n@-webkit-keyframes fadeInRight {\n  0% {\n    opacity: 0;\n    -webkit-transform: translate3d(100%, 0, 0);\n    -ms-transform: translate3d(100%, 0, 0);\n    transform: translate3d(100%, 0, 0);\n  }\n  100% {\n    opacity: 1;\n    -webkit-transform: none;\n    -ms-transform: none;\n    transform: none;\n  }\n}\n@-o-keyframes fadeInRight {\n  0% {\n    opacity: 0;\n    -webkit-transform: translate3d(100%, 0, 0);\n    -ms-transform: translate3d(100%, 0, 0);\n    transform: translate3d(100%, 0, 0);\n  }\n  100% {\n    opacity: 1;\n    -webkit-transform: none;\n    -ms-transform: none;\n    transform: none;\n  }\n}\n@keyframes fadeInRight {\n  0% {\n    opacity: 0;\n    -webkit-transform: translate3d(100%, 0, 0);\n    -ms-transform: translate3d(100%, 0, 0);\n    transform: translate3d(100%, 0, 0);\n  }\n  100% {\n    opacity: 1;\n    -webkit-transform: none;\n    -ms-transform: none;\n    transform: none;\n  }\n}\n@-moz-keyframes fadeIn {\n  0% {\n    opacity: 0;\n  }\n  100% {\n    opacity: 1;\n  }\n}\n@-webkit-keyframes fadeIn {\n  0% {\n    opacity: 0;\n  }\n  100% {\n    opacity: 1;\n  }\n}\n@-o-keyframes fadeIn {\n  0% {\n    opacity: 0;\n  }\n  100% {\n    opacity: 1;\n  }\n}\n@keyframes fadeIn {\n  0% {\n    opacity: 0;\n  }\n  100% {\n    opacity: 1;\n  }\n}\n"; });
define('text!applications/contactlist/contact-detail.html', ['module'], function(module) { module.exports = "<template>\r\n  <div class=\"panel panel-primary\">\r\n    <div class=\"panel-heading\">\r\n      <h3 class=\"panel-title\">Profile</h3>\r\n    </div>\r\n    <div class=\"panel-body\">\r\n      <form role=\"form\" class=\"form-horizontal\">\r\n        <div class=\"form-group\">\r\n          <label class=\"col-sm-2 control-label\">First Name</label>\r\n          <div class=\"col-sm-10\">\r\n            <input type=\"text\" placeholder=\"first name\" class=\"form-control\" value.bind=\"contact.firstName\">\r\n          </div>\r\n        </div>\r\n\r\n        <div class=\"form-group\">\r\n          <label class=\"col-sm-2 control-label\">Last Name</label>\r\n          <div class=\"col-sm-10\">\r\n            <input type=\"text\" placeholder=\"last name\" class=\"form-control\" value.bind=\"contact.lastName\">\r\n          </div>\r\n        </div>\r\n\r\n        <div class=\"form-group\">\r\n          <label class=\"col-sm-2 control-label\">Email</label>\r\n          <div class=\"col-sm-10\">\r\n            <input type=\"text\" placeholder=\"email\" class=\"form-control\" value.bind=\"contact.email\">\r\n          </div>\r\n        </div>\r\n\r\n        <div class=\"form-group\">\r\n          <label class=\"col-sm-2 control-label\">Phone Number</label>\r\n          <div class=\"col-sm-10\">\r\n            <input type=\"text\" placeholder=\"phone number\" class=\"form-control\" value.bind=\"contact.phoneNumber\">\r\n          </div>\r\n        </div>\r\n      </form>\r\n    </div>\r\n  </div>\r\n\r\n  <div class=\"button-bar\">\r\n    <button class=\"btn btn-success\" click.delegate=\"save()\" disabled.bind=\"!canSave\">Save</button>\r\n  </div>\r\n</template>"; });
define('text!applications/contactlist/assets/styles/styles.css', ['module'], function(module) { module.exports = "body {\n  padding-top: 70px;\n}\nsection {\n  margin: 0 20px;\n}\na:focus {\n  outline: none;\n}\nnavbar-nav li.loader {\n  margin: 12px 24px 0 6px;\n}\n.no-selection {\n  margin: 20px;\n}\n.contact-list {\n  overflow-y: auto;\n  border: 1px solid #ddd;\n  padding: 10px;\n}\n.panel {\n  margin: 20px;\n}\n.button-bar {\n  right: 0;\n  left: 0;\n  bottom: 0;\n  border-top: 1px solid #ddd;\n  background: #fff;\n}\n.button-bar > button {\n  float: right;\n  margin: 20px;\n}\nli.list-group-item {\n  list-style: none;\n}\nli.list-group-item > a {\n  text-decoration: none;\n}\nli.list-group-item.active > a {\n  color: #fff;\n}\n"; });
define('text!applications/contactlist/contact-list.html', ['module'], function(module) { module.exports = "<template>\r\n  <div class=\"contact-list\">\r\n    <ul class=\"list-group\">\r\n      <li repeat.for=\"contact of contacts\" class=\"list-group-item ${contact.id === $parent.selectedId ? 'active' : ''}\">\r\n        <a route-href=\"route: contacts; params.bind: {id:contact.id}\" click.delegate=\"$parent.select(contact)\">\r\n          <h4 class=\"list-group-item-heading\">${contact.firstName} ${contact.lastName}</h4>\r\n          <p class=\"list-group-item-text\">${contact.email}</p>\r\n        </a>\r\n      </li>\r\n    </ul>\r\n  </div>\r\n</template>"; });
define('text!applications/twitter/assets/styles/styles.css', ['module'], function(module) { module.exports = "* {\n  box-sizing: border-box;\n  position: relative;\n}\nbody {\n  background-color: #f5f8fa;\n  font-family: Arial, Helvetica, sans-serif;\n  margin: 0;\n  padding: 0;\n}\nimg {\n  height: auto;\n  max-width: 100%;\n}\ntextarea {\n  border: none;\n  display: inline-block;\n  height: 70px;\n  padding: 12px;\n  resize: none;\n  width: 340px;\n}\nbutton {\n  background: #ddd;\n  border: none;\n  color: #000;\n  cursor: pointer;\n  display: inline-block;\n  height: 70px;\n  margin-left: 8px;\n  vertical-align: top;\n  width: 120px;\n}\nbutton:disabled {\n  cursor: not-allowed;\n  opacity: 0.5;\n}\n.compose-container {\n  margin-bottom: 20px;\n}\n.container {\n  margin: 0 auto;\n  max-width: 620px;\n  width: 100%;\n}\ntweet-feed {\n  background: #fff;\n  border: 1px solid #e1e8ed;\n  display: block;\n}\ntweet {\n  border-bottom: 1px solid #e1e8ed;\n  display: flex;\n  flex-direction: row;\n  padding: 20px 10px;\n}\ntweet:last-child {\n  border-bottom: none;\n}\n.tweet-avatar {\n  flex-basis: 48px;\n  height: 48px;\n  margin-right: 10px;\n}\n.tweet-avatar img {\n  border-radius: 5px;\n  display: block;\n}\n.tweet-body {\n  flex: 1;\n}\n.tweet-meta {\n  color: #ddd;\n  margin-bottom: 5px;\n}\n.tweet-meta strong {\n  color: #111;\n}\n.tweet-text {\n  font-size: 14px;\n  line-height: 18px;\n}\n"; });
define('text!applications/contactlist/no-selection.html', ['module'], function(module) { module.exports = "<template>\r\n  <div class=\"no-selection text-center\">\r\n    <h2>${message}</h2>\r\n  </div>\r\n</template>"; });
define('text!applications/twitter/app.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./assets/styles/styles.css\"></require>\n  <require from=\"./resources/elements/tweet\"></require>\n  <h1>Tweeter</h1>\n  <div class=\"container\">\n    <div class=\"compose-container\">\n      <textarea placeholder=\"Say something\" value.bind=\"composedTweet\" keypress.delegate=\"handleKeyPress($event)\"></textarea>\n      <button type=\"button\" disabled.bind=\"!composedTweet\" click.delegate=\"createTweet()\">Say it!</button>\n    </div>\n    <tweet-feed>\n      <tweet repeat.for=\"tweet of tweets\" tweet.bind=\"tweet\"></tweet>\n    </tweet-feed>\n  </div>\n</template>"; });
define('text!applications/axview/routes/about.html', ['module'], function(module) { module.exports = "<template>\r\n\t<section class=\"au-animate\">\r\n\t\t<div class=\"well\">\r\n\t\t\t<h2>${title}</h2>\r\n\t\t\t<h4>${info}</h4>\r\n\t\t</div>\r\n\t</section>\r\n</template>"; });
define('text!applications/axview/routes/cells.html', ['module'], function(module) { module.exports = "<template>\r\n\t<require from=\"../resources/elements/cells-view\"></require>\r\n\t<section class=\"au-animate\">\r\n\t\t<div class=\"well\">\r\n\t\t\t<button show.bind=\"isLoading\" class=\"btn btn-default btn-lg\">\r\n\t\t\t\t<i class=\"fa fa-circle-o-notch fa-spin\"></i> Loading\r\n\t\t\t</button>\r\n\t\t\t<cells-view class=\"col-md-4\" cells.bind=\"cells\"></cells-view>\r\n\t\t</div>\r\n\t</section>\r\n</template>"; });
define('text!applications/axview/routes/home.html', ['module'], function(module) { module.exports = "<template>\r\n\t<section class=\"au-animate\">\r\n\t\t<div class=\"well\">\r\n\t\t\t<h2>${title}</h2>\r\n\t\t\t<h4>${info}</h4>\r\n\t\t</div>\r\n\r\n\t</section>\r\n</template>"; });
define('text!common/resources/elements/nav-bar.html', ['module'], function(module) { module.exports = "<template>\n\t<nav class=\"navbar navbar-default navbar-fixed-top\" role=\"navigation\">\n\t\t<div class=\"navbar-header\">\n\t\t\t<button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\"#bs-example-navbar-collapse-1\">\n\t\t\t\t<span class=\"sr-only\">Toggle Navigation</span>\n\t\t\t\t<span class=\"icon-bar\"></span>\n\t\t\t\t<span class=\"icon-bar\"></span>\n\t\t\t\t<span class=\"icon-bar\"></span>\n\t\t\t</button>\n\t\t\t<a class=\"navbar-brand\" href=\"#\">\n\t\t\t\t<i class=\"fa fa-home\"></i>\n\t\t\t\t<span>${router.title}</span>\n\t\t\t</a>\n\t\t</div>\n\n\t\t<div class=\"collapse navbar-collapse\" id=\"bs-example-navbar-collapse-1\">\n\t\t\t<ul class=\"nav navbar-nav\">\n\t\t\t\t<li repeat.for=\"row of router.navigation\" class=\"${row.isActive ? 'active' : ''}\">\n\t\t\t\t\t<a data-toggle=\"collapse\" data-target=\"#bs-example-navbar-collapse-1.in\" href.bind=\"row.href\">${row.title}</a>\n\t\t\t\t</li>\n\t\t\t</ul>\n\t\t\t<ul class=\"nav navbar-nav navbar-right\">\n\t\t\t\t<li class=\"loader\" if.bind=\"router.isNavigating\">\n\t\t\t\t\t<i class=\"fa fa-spinner fa-spin fa-2x\"></i>\n\t\t\t\t</li>\n\t\t\t</ul>\n\t\t</div>\n\t</nav>\n</template>"; });
define('text!applications/axview/resources/elements/cells-view.html', ['module'], function(module) { module.exports = "<template>\r\n\t<ul>\r\n\t\t<li repeat.for=\"cell of cells\">${cell.name}</li>\r\n\t</ul>\r\n</template>"; });
define('text!applications/twitter/resources/elements/tweet.html', ['module'], function(module) { module.exports = "<template>\n\t<div class=\"tweet-avatar\"><img src.bind=\"tweet.avatar\"></div>\n\t<div class=\"tweet-body\">\n\t\t<div class=\"tweet-meta\">\n\t\t\t<strong>${tweet.name}</strong> \n\t\t\t<span>${tweet.handle}</span>\n\t\t</div>\n\t\t<div class=\"tweet-content\">${tweet.text}</div>\n\t</div>\n</template>"; });
//# sourceMappingURL=app-bundle.js.map