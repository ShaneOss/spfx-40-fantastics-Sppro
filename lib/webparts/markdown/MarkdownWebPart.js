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
 * Markdown Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
var sp_webpart_base_1 = require("@microsoft/sp-webpart-base");
var sp_core_library_1 = require("@microsoft/sp-core-library");
var strings = require("MarkdownStrings");
//Loads external CSS
require('../../css/simplemde/simplemde.min.scss');
//Loads exrnal JS Libs
var SimpleMDE = require('simplemde');
var showdown = require('showdown');
/**
 * @class
 * Markdown Web Part.
 */
var MarkdownWebPart = (function (_super) {
    __extends(MarkdownWebPart, _super);
    /**
     * @function
     * Web part contructor.
     */
    function MarkdownWebPart(context) {
        var _this = _super.call(this) || this;
        _this.guid = _this.getGuid();
        return _this;
    }
    Object.defineProperty(MarkdownWebPart.prototype, "dataVersion", {
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
    MarkdownWebPart.prototype.render = function () {
        if (this.displayMode == sp_core_library_1.DisplayMode.Edit) {
            //Edit mode: build a rich text area specialized in MD edition
            //Creates a textarea container
            var html = '';
            html += "<textarea id='" + this.guid + "-editor'>" + this.properties.text + "</textarea>";
            this.domElement.innerHTML = html;
            var simplemde;
            if (this.properties.toolbar === false) {
                if (this.properties.status === false) {
                    //Creates editor without status bar & toolbar
                    simplemde = new SimpleMDE({
                        element: document.getElementById(this.guid + "-editor"),
                        toolbar: this.properties.toolbar,
                        toolbarTips: this.properties.toolbarTips,
                        status: this.properties.status,
                        spellChecker: this.properties.spellChecker
                    });
                }
                else {
                    //Creates editor with status bar & without toolbar
                    simplemde = new SimpleMDE({
                        element: document.getElementById(this.guid + "-editor"),
                        toolbar: this.properties.toolbar,
                        toolbarTips: this.properties.toolbarTips,
                        spellChecker: this.properties.spellChecker
                    });
                }
            }
            else {
                if (this.properties.status === false) {
                    //Creates editor without status bar & with toolbar
                    simplemde = new SimpleMDE({
                        element: document.getElementById(this.guid + "-editor"),
                        toolbarTips: this.properties.toolbarTips,
                        status: this.properties.status,
                        spellChecker: this.properties.spellChecker
                    });
                }
                else {
                    simplemde = new SimpleMDE({
                        //Creates editor with status bar & with toolbar
                        element: document.getElementById(this.guid + "-editor"),
                        toolbarTips: this.properties.toolbarTips,
                        spellChecker: this.properties.spellChecker
                    });
                }
            }
            simplemde.codemirror.on("change", function () {
                //Function executed when the text change in rich editor
                this.properties.text = simplemde.value();
            }.bind(this));
        }
        else {
            //Read Mode
            //Inits the converter
            var converter = new showdown.Converter();
            converter.setOption('tables', true);
            converter.setOption('tasklists', true);
            converter.setOption('smoothLivePreview', true);
            converter.setOption('encodeEmails', true);
            //Converts MD to HTML
            this.domElement.innerHTML = converter.makeHtml(this.properties.text);
        }
    };
    /**
     * @function
     * Generates a GUID
     */
    MarkdownWebPart.prototype.getGuid = function () {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
            this.s4() + '-' + this.s4() + this.s4() + this.s4();
    };
    /**
     * @function
     * Generates a GUID part
     */
    MarkdownWebPart.prototype.s4 = function () {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    };
    /**
     * @function
     * PropertyPanel settings definition
     */
    MarkdownWebPart.prototype.getPropertyPaneConfiguration = function () {
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
                                sp_webpart_base_1.PropertyPaneToggle('toolbar', {
                                    label: strings.Toolbar,
                                }),
                                sp_webpart_base_1.PropertyPaneToggle('toolbarTips', {
                                    label: strings.ToolbarTips,
                                }),
                                sp_webpart_base_1.PropertyPaneToggle('status', {
                                    label: strings.Status,
                                }),
                                sp_webpart_base_1.PropertyPaneToggle('spellChecker', {
                                    label: strings.SpellChecker,
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    };
    return MarkdownWebPart;
}(sp_webpart_base_1.BaseClientSideWebPart));
exports.default = MarkdownWebPart;

//# sourceMappingURL=MarkdownWebPart.js.map
