"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @file
 * Tweets Feed Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
var sp_webpart_base_1 = require("@microsoft/sp-webpart-base");
var sp_core_library_1 = require("@microsoft/sp-core-library");
var strings = require("TweetsFeedStrings");
//Imports property pane custom fields
var PropertyFieldColorPickerMini_1 = require("sp-client-custom-fields/lib/PropertyFieldColorPickerMini");
var twttr = require('twitter');
var TweetsFeedWebPart = (function (_super) {
    __extends(TweetsFeedWebPart, _super);
    /**
     * @function
     * Web part contructor.
     */
    function TweetsFeedWebPart(context) {
        var _this = _super.call(this) || this;
        //Hack: to invoke correctly the onPropertyChange function outside this class
        //we need to bind this object on it first
        _this.onPropertyPaneFieldChanged = _this.onPropertyPaneFieldChanged.bind(_this);
        return _this;
    }
    Object.defineProperty(TweetsFeedWebPart.prototype, "dataVersion", {
        /**
         * @function
         * Gets WP data version
         */
        get: function () {
            return sp_core_library_1.Version.parse('1.0');
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @function
     * Renders HTML code
     */
    TweetsFeedWebPart.prototype.render = function () {
        if (this.properties.account == null || this.properties.account == '') {
            var error = "\n        <div class=\"ms-MessageBar\">\n          <div class=\"ms-MessageBar-content\">\n            <div class=\"ms-MessageBar-icon\">\n              <i class=\"ms-Icon ms-Icon--Info\"></i>\n            </div>\n            <div class=\"ms-MessageBar-text\">\n              " + strings.ErrorSelectAccount + "\n            </div>\n          </div>\n        </div>\n      ";
            this.domElement.innerHTML = error;
            return;
        }
        var dataChrome = '';
        if (this.properties.footer === false)
            dataChrome += "nofooter ";
        if (this.properties.header === false)
            dataChrome += "noheader ";
        if (this.properties.borders === false)
            dataChrome += "noborders ";
        if (this.properties.scrollbars === false)
            dataChrome += "noscrollbar ";
        if (this.properties.transparent === true)
            dataChrome += "transparent ";
        var limit = '';
        if (this.properties.autoLimit === false)
            limit = 'data-tweet-limit="' + this.properties.limit + '"';
        var html = '<a class="twitter-timeline" data-link-color="' + this.properties.linkColor + '" data-border-color="' + this.properties.borderColor + '" height="' + this.properties.height + '" width="' + this.properties.width + '" ' + limit + ' data-chrome="' + dataChrome + '" href="https://twitter.com/' + this.properties.account + '">Tweets by ' + this.properties.account + '</a>';
        this.domElement.innerHTML = html;
        twttr.widgets.load();
    };
    /**
     * @function
     * PropertyPanel settings definition
     */
    TweetsFeedWebPart.prototype.getPropertyPaneConfiguration = function () {
        return {
            pages: [
                {
                    header: {
                        description: strings.PropertyPaneDescription
                    },
                    displayGroupsAsAccordion: true,
                    groups: [
                        {
                            groupName: strings.BasicGroupName,
                            groupFields: [
                                sp_webpart_base_1.PropertyPaneTextField('account', {
                                    label: strings.Account
                                }),
                                sp_webpart_base_1.PropertyPaneToggle('autoLimit', {
                                    label: strings.AutoLimit
                                }),
                                sp_webpart_base_1.PropertyPaneSlider('limit', {
                                    label: strings.Limit,
                                    min: 1,
                                    max: 1000,
                                    step: 1
                                }),
                                sp_webpart_base_1.PropertyPaneToggle('header', {
                                    label: strings.Header
                                }),
                                sp_webpart_base_1.PropertyPaneToggle('footer', {
                                    label: strings.Footer
                                }),
                                sp_webpart_base_1.PropertyPaneToggle('borders', {
                                    label: strings.Borders
                                }),
                                sp_webpart_base_1.PropertyPaneToggle('scrollbars', {
                                    label: strings.Scrollbars
                                })
                            ]
                        },
                        {
                            groupName: strings.LayoutGroupName,
                            groupFields: [
                                sp_webpart_base_1.PropertyPaneTextField('width', {
                                    label: strings.Width
                                }),
                                sp_webpart_base_1.PropertyPaneTextField('height', {
                                    label: strings.Height
                                }),
                                sp_webpart_base_1.PropertyPaneToggle('transparent', {
                                    label: strings.Transparent
                                }),
                                PropertyFieldColorPickerMini_1.PropertyFieldColorPickerMini('linkColor', {
                                    label: strings.LinkColor,
                                    initialColor: this.properties.linkColor,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: 'tweetsFeedLinkColorField'
                                }),
                                PropertyFieldColorPickerMini_1.PropertyFieldColorPickerMini('borderColor', {
                                    label: strings.BorderColor,
                                    initialColor: this.properties.borderColor,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: 'tweetsFeedBorderColorField'
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    };
    return TweetsFeedWebPart;
}(sp_webpart_base_1.BaseClientSideWebPart));
exports.default = TweetsFeedWebPart;

//# sourceMappingURL=TweetsFeedWebPart.js.map
