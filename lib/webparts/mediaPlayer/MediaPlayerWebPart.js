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
 * Media Player Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
var sp_webpart_base_1 = require("@microsoft/sp-webpart-base");
var sp_core_library_1 = require("@microsoft/sp-core-library");
var strings = require("MediaPlayerStrings");
//Imports property pane custom fields
var PropertyFieldCustomList_1 = require("sp-client-custom-fields/lib/PropertyFieldCustomList");
//Loads external CSS
require('../../css/mediaPlayer/plyr.scss');
var plyr = require('plyr');
var MediaPlayerWebPart = (function (_super) {
    __extends(MediaPlayerWebPart, _super);
    /**
     * @function
     * Web part contructor.
     */
    function MediaPlayerWebPart(context) {
        var _this = _super.call(this) || this;
        _this.guid = _this.getGuid();
        //Hack: to invoke correctly the onPropertyChange function outside this class
        //we need to bind this object on it first
        _this.onPropertyPaneFieldChanged = _this.onPropertyPaneFieldChanged.bind(_this);
        return _this;
    }
    Object.defineProperty(MediaPlayerWebPart.prototype, "dataVersion", {
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
    MediaPlayerWebPart.prototype.render = function () {
        var html = '';
        if (this.properties.player == 'youtube') {
            html += '<div data-type="youtube" data-video-id="' + this.properties.youtubeVideoId + '"></div>';
        }
        else if (this.properties.player == 'vimeo') {
            html += '<div data-type="vimeo" data-video-id="' + this.properties.vimeoVideoId + '"></div>';
        }
        else if (this.properties.player == 'audio') {
            html += "\n        <audio controls>\n          <source src=\"" + this.properties.audio + "\" type=\"audio/mp3\">\n        </audio>\n      ";
        }
        else if (this.properties.player == 'video') {
            var captions = '';
            for (var i = 0; i < this.properties.html5captions.length; i++) {
                var caption = this.properties.html5captions[i];
                captions += '<track kind="captions" label="' + caption['Title'] + '" src="' + caption['Url'] + '" srclang="' + caption['SrcLen'] + '">';
            }
            html += "\n        <video poster=\"" + this.properties.html5cover + "\" controls>\n          <source src=\"" + this.properties.html5video + "\" type=\"video/mp4\">\n          " + captions + "\n        </video>\n      ";
        }
        this.domElement.innerHTML = html;
        plyr.setup();
    };
    /**
     * @function
     * Generates a GUID
     */
    MediaPlayerWebPart.prototype.getGuid = function () {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
            this.s4() + '-' + this.s4() + this.s4() + this.s4();
    };
    /**
     * @function
     * Generates a GUID part
     */
    MediaPlayerWebPart.prototype.s4 = function () {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    };
    /**
     * @function
     * PropertyPanel settings definition
     */
    MediaPlayerWebPart.prototype.getPropertyPaneConfiguration = function () {
        return {
            pages: [
                {
                    header: {
                        description: strings.PropertyPaneDescription
                    },
                    displayGroupsAsAccordion: false,
                    groups: [
                        {
                            groupName: strings.BasicGroupName,
                            groupFields: [
                                sp_webpart_base_1.PropertyPaneDropdown('player', {
                                    label: strings.player,
                                    options: [
                                        { key: 'youtube', text: 'Youtube' },
                                        { key: 'vimeo', text: 'Vimeo' },
                                        { key: 'video', text: 'HTML5 Video' },
                                        { key: 'audio', text: 'HTML5 Audio' },
                                    ]
                                }),
                                sp_webpart_base_1.PropertyPaneTextField('youtubeVideoId', {
                                    label: strings.youtubeVideoId
                                }),
                                sp_webpart_base_1.PropertyPaneTextField('vimeoVideoId', {
                                    label: strings.vimeoVideoId
                                }),
                                sp_webpart_base_1.PropertyPaneTextField('audio', {
                                    label: strings.audio
                                }),
                                sp_webpart_base_1.PropertyPaneTextField('html5video', {
                                    label: strings.html5video
                                }),
                                sp_webpart_base_1.PropertyPaneTextField('html5cover', {
                                    label: strings.html5cover
                                }),
                                PropertyFieldCustomList_1.PropertyFieldCustomList('html5captions', {
                                    label: strings.html5captions,
                                    value: this.properties.html5captions,
                                    headerText: strings.html5captions,
                                    fields: [
                                        { id: 'Title', title: 'Title', required: true, type: PropertyFieldCustomList_1.CustomListFieldType.string },
                                        { id: 'SrcLen', title: 'SrcLen', required: false, hidden: false, type: PropertyFieldCustomList_1.CustomListFieldType.string },
                                        { id: 'Url', title: 'Url', required: true, hidden: false, type: PropertyFieldCustomList_1.CustomListFieldType.string }
                                    ],
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    context: this.context,
                                    properties: this.properties,
                                    key: 'mediaPlayerListField'
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    };
    return MediaPlayerWebPart;
}(sp_webpart_base_1.BaseClientSideWebPart));
exports.default = MediaPlayerWebPart;

//# sourceMappingURL=MediaPlayerWebPart.js.map
