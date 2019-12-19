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
 * Accordion Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
var sp_webpart_base_1 = require("@microsoft/sp-webpart-base");
var sp_core_library_1 = require("@microsoft/sp-core-library");
var sp_loader_1 = require("@microsoft/sp-loader");
var sp_core_library_2 = require("@microsoft/sp-core-library");
var strings = require("AccordionStrings");
var PropertyFieldCustomList_1 = require("sp-client-custom-fields/lib/PropertyFieldCustomList");
//Loads JQuery & JQuery UI
require('jquery');
require('jqueryui');
var $ = require("jquery");
/**
 * @class
 * Accordion Web part
 */
var AccordionWebPart = (function (_super) {
    __extends(AccordionWebPart, _super);
    /**
     * @function
     * Web part contructor.
     */
    function AccordionWebPart(context) {
        var _this = _super.call(this) || this;
        //Initialize unique GUID
        _this.guid = _this.getGuid();
        //Hack: to invoke correctly the onPropertyChange function outside this class
        //we need to bind this object on it first
        _this.onPropertyPaneFieldChanged = _this.onPropertyPaneFieldChanged.bind(_this);
        if (sp_core_library_2.Environment.type !== sp_core_library_2.EnvironmentType.ClassicSharePoint) {
            //Load the JQuery smoothness CSS file
            sp_loader_1.SPComponentLoader.loadCss('//code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css');
        }
        return _this;
    }
    Object.defineProperty(AccordionWebPart.prototype, "dataVersion", {
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
    AccordionWebPart.prototype.render = function () {
        var _this = this;
        if (sp_core_library_2.Environment.type === sp_core_library_2.EnvironmentType.ClassicSharePoint) {
            var errorHtml = '';
            errorHtml += '<div style="color: red;">';
            errorHtml += '<div style="display:inline-block; vertical-align: middle;"><i class="ms-Icon ms-Icon--Error" style="font-size: 20px"></i></div>';
            errorHtml += '<div style="display:inline-block; vertical-align: middle;margin-left:7px;"><span>';
            errorHtml += strings.ErrorClassicSharePoint;
            errorHtml += '</span></div>';
            errorHtml += '</div>';
            this.domElement.innerHTML = errorHtml;
            return;
        }
        var html = '';
        //Define the main div
        html += '<div class="accordion" id="' + this.guid + '">';
        //Iterates on tabs
        this.properties.tabs.map(function (tab, index) {
            if (_this.displayMode == sp_core_library_1.DisplayMode.Edit) {
                //If diplay Mode is edit, include the textarea to edit the tab's content
                html += '<h3>' + (tab.Title != null ? tab.Title : '') + '</h3>';
                html += '<div style="min-height: 400px"><textarea name="' + _this.guid + '-editor-' + index + '" id="' + _this.guid + '-editor-' + index + '">' + (tab.Content != null ? tab.Content : '') + '</textarea></div>';
            }
            else {
                //Display Mode only, so display the tab content
                html += '<h3>' + (tab.Title != null ? tab.Title : '') + '</h3>';
                html += '<div>' + (tab.Content != null ? tab.Content : '') + '</div>';
            }
        });
        html += '</div>';
        //Flush the output HTML code
        this.domElement.innerHTML = html;
        //Inits JQuery UI accordion options
        var accordionOptions = {
            animate: this.properties.animate != false ? this.properties.speed : false,
            collapsible: this.properties.collapsible,
            heightStyle: this.properties.heightStyle
        };
        //Call the JQuery UI accordion plugin on main div
        $('#' + this.guid).accordion(accordionOptions);
        if (this.displayMode == sp_core_library_1.DisplayMode.Edit) {
            //If the display mode is Edit, loads the CK Editor plugin
            var ckEditorCdn = '//cdn.ckeditor.com/4.6.2/full/ckeditor.js';
            //Loads the Javascript from the CKEditor CDN
            sp_loader_1.SPComponentLoader.loadScript(ckEditorCdn, { globalExportsName: 'CKEDITOR' }).then(function (CKEDITOR) {
                if (_this.properties.inline == null || _this.properties.inline === false) {
                    //If mode is not inline, loads the script with the replace method
                    for (var tab = 0; tab < _this.properties.tabs.length; tab++) {
                        CKEDITOR.replace(_this.guid + '-editor-' + tab, {
                            skin: 'moono-lisa,//cdn.ckeditor.com/4.6.2/full-all/skins/moono-lisa/'
                        });
                    }
                }
                else {
                    //Mode is inline, so loads the script with the inline method
                    for (var tab2 = 0; tab2 < _this.properties.tabs.length; tab2++) {
                        CKEDITOR.inline(_this.guid + '-editor-' + tab2, {
                            skin: 'moono-lisa,//cdn.ckeditor.com/4.6.2/full-all/skins/moono-lisa/'
                        });
                    }
                }
                //Catch the CKEditor instances change event to save the content
                for (var i in CKEDITOR.instances) {
                    CKEDITOR.instances[i].on('change', function (elm, val) {
                        //Updates the textarea
                        elm.sender.updateElement();
                        //Gets the value
                        var value = (document.getElementById(elm.sender.name)).value;
                        var id = elm.sender.name.split("-editor-")[1];
                        //Save the content in properties
                        _this.properties.tabs[id].Content = value;
                    });
                }
            });
        }
    };
    /**
     * @function
     * Generates a GUID
     */
    AccordionWebPart.prototype.getGuid = function () {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
            this.s4() + '-' + this.s4() + this.s4() + this.s4();
    };
    /**
     * @function
     * Generates a GUID part
     */
    AccordionWebPart.prototype.s4 = function () {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    };
    /**
     * @function
     * PropertyPanel settings definition
     */
    AccordionWebPart.prototype.getPropertyPaneConfiguration = function () {
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
                                PropertyFieldCustomList_1.PropertyFieldCustomList('tabs', {
                                    label: strings.Accordion,
                                    value: this.properties.tabs,
                                    headerText: strings.ManageAccordion,
                                    fields: [
                                        { id: 'Title', title: 'Title', required: true, type: PropertyFieldCustomList_1.CustomListFieldType.string }
                                    ],
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    context: this.context,
                                    key: "accordionCustomListField"
                                }),
                                sp_webpart_base_1.PropertyPaneToggle('collapsible', {
                                    label: strings.Collapsible,
                                }),
                                sp_webpart_base_1.PropertyPaneToggle('animate', {
                                    label: strings.Animate,
                                }),
                                sp_webpart_base_1.PropertyPaneSlider('speed', {
                                    label: strings.Speed,
                                    min: 0,
                                    max: 4000,
                                    step: 50
                                }),
                                sp_webpart_base_1.PropertyPaneDropdown('heightStyle', {
                                    label: strings.HeightStyle,
                                    options: [
                                        { key: 'auto', text: 'auto' },
                                        { key: 'fill', text: 'fill' },
                                        { key: 'content', text: 'content' }
                                    ]
                                })
                            ]
                        },
                        {
                            groupName: strings.TextEditorGroupName,
                            groupFields: [
                                sp_webpart_base_1.PropertyPaneToggle('inline', {
                                    label: strings.Inline,
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    };
    return AccordionWebPart;
}(sp_webpart_base_1.BaseClientSideWebPart));
exports.default = AccordionWebPart;

//# sourceMappingURL=AccordionWebPart.js.map
