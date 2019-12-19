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
 * Syntax Highlighter Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
var sp_webpart_base_1 = require("@microsoft/sp-webpart-base");
var strings = require("SyntaxHighlighterStrings");
var sp_core_library_1 = require("@microsoft/sp-core-library");
//Loads external CSS
require('../../css/syntaxHighlighter/shCore.min.scss');
require('../../css/syntaxHighlighter/shThemeDefault.min.scss');
//Loads external JS files
var SyntaxHighlighter = require('syntaxHighlighter');
require('shBrushAS3');
require('shBrushBash');
require('shBrushColdFusion');
require('shBrushCpp');
require('shBrushCSharp');
require('shBrushCss');
require('shBrushDelphi');
require('shBrushDiff');
require('shBrushErlang');
require('shBrushGroovy');
require('shBrushJava');
require('shBrushJavaFX');
require('shBrushJScript');
require('shBrushPerl');
require('shBrushPhp');
require('shBrushPlain');
require('shBrushPowerShell');
require('shBrushPython');
require('shBrushRuby');
require('shBrushScala');
require('shBrushSql');
require('shBrushVb');
require('shBrushXml');
/**
 * @class
 * Syntax Highlighter Web Part.
 */
var SyntaxHighlighterWebPart = (function (_super) {
    __extends(SyntaxHighlighterWebPart, _super);
    /**
     * @function
     * Web part contructor.
     */
    function SyntaxHighlighterWebPart(context) {
        var _this = _super.call(this) || this;
        //Hack: to invoke correctly the onPropertyChange function outside this class
        //we need to bind this object on it first
        _this.onPropertyPaneFieldChanged = _this.onPropertyPaneFieldChanged.bind(_this);
        _this.onSyntaxHighlighterChanged = _this.onSyntaxHighlighterChanged.bind(_this);
        //Inits the unique ID
        _this.guid = _this.getGuid();
        return _this;
    }
    Object.defineProperty(SyntaxHighlighterWebPart.prototype, "dataVersion", {
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
    SyntaxHighlighterWebPart.prototype.render = function () {
        //Checks the Web Part display mode
        if (this.displayMode == sp_core_library_1.DisplayMode.Read) {
            //Read mode -> show the code with SyntaxHighlighter lib
            var toolbar = true;
            if (this.properties.toolbar != null)
                toolbar = this.properties.toolbar;
            var ruler = true;
            if (this.properties.gutter != null)
                ruler = this.properties.gutter;
            var autoLink = true;
            if (this.properties.autoLinks != null)
                autoLink = this.properties.autoLinks;
            var smartTabs = true;
            if (this.properties.smartTabs != null)
                smartTabs = this.properties.smartTabs;
            //Creates the <pre> HTML code
            var html = "<pre class='brush: " + ((this.properties.language != null) ? this.properties.language : 'js') + "; toolbar: " + toolbar + "; gutter: " + ruler + "; smart-tabs: " + smartTabs + "; auto-links: " + autoLink + "'>" + this.properties.code + "</pre>";
            this.domElement.innerHTML = html;
            SyntaxHighlighter.highlight();
        }
        else {
            //Edit mode -> we only need to generate a textarea and get the changed event
            var editHtml = '<textarea id="' + this.guid + '" class="ms-TextField-field" style="width:100%; min-height:600px" onkeyup="" onchange="">' + this.properties.code + '</textarea>';
            this.domElement.innerHTML = editHtml;
            document.getElementById(this.guid).onchange = this.onSyntaxHighlighterChanged;
            document.getElementById(this.guid).onkeyup = this.onSyntaxHighlighterChanged;
        }
    };
    /**
     * @function
     * Event occurs when the content of the textarea in edit mode is changing.
     */
    SyntaxHighlighterWebPart.prototype.onSyntaxHighlighterChanged = function (elm) {
        this.properties.code = elm.currentTarget.value;
    };
    /**
     * @function
     * Generates a GUID
     */
    SyntaxHighlighterWebPart.prototype.getGuid = function () {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
            this.s4() + '-' + this.s4() + this.s4() + this.s4();
    };
    /**
     * @function
     * Generates a GUID part
     */
    SyntaxHighlighterWebPart.prototype.s4 = function () {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    };
    /**
     * @function
     * PropertyPanel settings definition
     */
    SyntaxHighlighterWebPart.prototype.getPropertyPaneConfiguration = function () {
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
                                sp_webpart_base_1.PropertyPaneDropdown('language', {
                                    label: strings.Language,
                                    options: [
                                        { key: 'as3', text: 'ActionScript3' },
                                        { key: 'bash', text: 'Bash/shell' },
                                        { key: 'cf', text: 'ColdFusion' },
                                        { key: 'csharp', text: 'C#' },
                                        { key: 'cpp', text: 'C++' },
                                        { key: 'css', text: 'CSS' },
                                        { key: 'delphi', text: 'Delphi' },
                                        { key: 'diff', text: 'Diff' },
                                        { key: 'erl', text: 'Erlang' },
                                        { key: 'groovy', text: 'Groovy' },
                                        { key: 'js', text: 'JavaScript' },
                                        { key: 'java', text: 'Java' },
                                        { key: 'jfx', text: 'JavaFX' },
                                        { key: 'perl', text: 'Perl' },
                                        { key: 'php', text: 'PHP' },
                                        { key: 'plain', text: 'Plain Text' },
                                        { key: 'ps', text: 'PowerShell' },
                                        { key: 'py', text: 'Python' },
                                        { key: 'rails', text: 'Ruby' },
                                        { key: 'scala', text: 'Scala' },
                                        { key: 'sql', text: 'SQL' },
                                        { key: 'vb', text: 'Visual Basic' },
                                        { key: 'xml', text: 'XML' }
                                    ]
                                }),
                                sp_webpart_base_1.PropertyPaneToggle('toolbar', {
                                    label: strings.Toolbar
                                }),
                                sp_webpart_base_1.PropertyPaneToggle('gutter', {
                                    label: strings.Gutter
                                }),
                                sp_webpart_base_1.PropertyPaneToggle('autoLinks', {
                                    label: strings.AutoLinks
                                }),
                                sp_webpart_base_1.PropertyPaneToggle('smartTabs', {
                                    label: strings.SmartTabs
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    };
    return SyntaxHighlighterWebPart;
}(sp_webpart_base_1.BaseClientSideWebPart));
exports.default = SyntaxHighlighterWebPart;

//# sourceMappingURL=SyntaxHighlighterWebPart.js.map
