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
 * Tabs Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
var sp_webpart_base_1 = require("@microsoft/sp-webpart-base");
var sp_core_library_1 = require("@microsoft/sp-core-library");
var sp_loader_1 = require("@microsoft/sp-loader");
var sp_core_library_2 = require("@microsoft/sp-core-library");
var strings = require("TabsStrings");
//Imports property pane custom fields
var PropertyFieldCustomList_1 = require("sp-client-custom-fields/lib/PropertyFieldCustomList");
var PropertyFieldColorPickerMini_1 = require("sp-client-custom-fields/lib/PropertyFieldColorPickerMini");
var $ = require("jquery");
var TabsWebPart = (function (_super) {
    __extends(TabsWebPart, _super);
    /**
     * @function
     * Web part contructor.
     */
    function TabsWebPart(context) {
        var _this = _super.call(this) || this;
        _this.guid = _this.getGuid();
        //Hack: to invoke correctly the onPropertyChange function outside this class
        //we need to bind this object on it first
        _this.onPropertyPaneFieldChanged = _this.onPropertyPaneFieldChanged.bind(_this);
        return _this;
    }
    Object.defineProperty(TabsWebPart.prototype, "dataVersion", {
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
    TabsWebPart.prototype.render = function () {
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
        html += "\n<style>\n/* --------------------------------\n\nMain components\n\n-------------------------------- */\n.cd-tabs {\n  position: relative;\n  width: 100%;\n  max-width: 960px;\n}\n.cd-tabs:after {\n  content: \"\";\n  display: table;\n  clear: both;\n}\n.cd-tabs::after {\n  /* subtle gradient layer on top right - to indicate it's possible to scroll */\n  position: absolute;\n  top: 0;\n  right: 0;\n  height: 60px;\n  width: 50px;\n  z-index: 1;\n  pointer-events: none;\n  background: -webkit-linear-gradient( right , " + this.properties.disableColor + ", rgba(248, 247, 238, 0));\n  background: linear-gradient(to left, " + this.properties.disableColor + ", rgba(248, 247, 238, 0));\n  visibility: visible;\n  opacity: 1;\n  -webkit-transition: opacity .3s 0s, visibility 0s 0s;\n  -moz-transition: opacity .3s 0s, visibility 0s 0s;\n  transition: opacity .3s 0s, visibility 0s 0s;\n}\n.no-cssgradients .cd-tabs::after {\n  display: none;\n}\n.cd-tabs.is-ended::after {\n  /* class added in jQuery - remove the gradient layer when it's no longer possible to scroll */\n  visibility: hidden;\n  opacity: 0;\n  -webkit-transition: opacity .3s 0s, visibility 0s .3s;\n  -moz-transition: opacity .3s 0s, visibility 0s .3s;\n  transition: opacity .3s 0s, visibility 0s .3s;\n}\n.cd-tabs nav {\n  overflow: auto;\n  -webkit-overflow-scrolling: touch;\n  background: " + this.properties.disableColor + ";\n  box-shadow: inset 0 -2px 3px rgba(203, 196, 130, 0.06);\n}\n@media only screen and (min-width: 768px) {\n  .cd-tabs::after {\n    display: none;\n  }\n  .cd-tabs nav {\n    position: absolute;\n    top: 0;\n    left: 0;\n    height: 100%;\n    box-shadow: inset -2px 0 3px rgba(203, 196, 130, 0.06);\n    z-index: 1;\n  }\n}\n@media only screen and (min-width: 960px) {\n  .cd-tabs nav {\n    position: relative;\n    float: none;\n    background: transparent;\n    box-shadow: none;\n  }\n}\n\n.cd-tabs-navigation {\n  width: 360px;\n  padding: 0px;\n  margin: 0px;\n}\n.cd-tabs-navigation:after {\n  content: \"\";\n  display: table;\n  clear: both;\n}\n.cd-tabs-navigation li {\n  float: left;\n  list-style-type: none;\n}\n.cd-tabs-navigation span {\n  position: relative;\n  display: block;\n  height: 60px;\n  width: 60px;\n  text-align: center;\n  font-size: 12px;\n  font-size: 0.75rem;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n  font-weight: 700;\n  color: #c3c2b9;\n  padding-top: 34px;\n  text-decoration: none;\n  cursor: pointer;\n}\n.no-touch .cd-tabs-navigation span:hover {\n  color: #29324e;\n  background-color: rgba(233, 230, 202, 0.3);\n}\n.cd-tabs-navigation span.selected {\n  background-color: #ffffff !important;\n  box-shadow: inset 0 2px 0 " + this.properties.selectedColor + ";\n  color: #29324e;\n  cursor: auto;\n}\n.cd-tabs-navigation span::before {\n  /* icons */\n  position: absolute;\n  top: 12px;\n  left: 50%;\n  margin-left: -10px;\n  display: inline-block;\n  height: 20px;\n  width: 20px;\n  /*background-image: url(\"../img/vicons.svg\");\n  background-repeat: no-repeat;*/\n}\n@media only screen and (min-width: 768px) {\n  .cd-tabs-navigation {\n    /* move the nav to the left on medium sized devices */\n    width: 80px;\n    float: left;\n  }\n  .cd-tabs-navigation span {\n    height: 80px;\n    width: 80px;\n    padding-top: 46px;\n  }\n  .cd-tabs-navigation span.selected {\n    box-shadow: inset 2px 0 0 " + this.properties.selectedColor + ";\n  }\n  .cd-tabs-navigation span::before {\n    top: 22px;\n  }\n}\n@media only screen and (min-width: 960px) {\n  .cd-tabs-navigation {\n    /* tabbed on top on big devices */\n    width: auto;\n    background-color: " + this.properties.disableColor + ";\n    box-shadow: inset 0 -2px 3px rgba(203, 196, 130, 0.06);\n  }\n  .cd-tabs-navigation span {\n    height: 60px;\n    line-height: 60px;\n    width: auto;\n    text-align: left;\n    font-size: 14px;\n    font-size: 0.875rem;\n    padding: 0 2.8em 0 4em;\n  }\n  .cd-tabs-navigation span.selected {\n    box-shadow: inset 0 2px 0 " + this.properties.selectedColor + ";\n  }\n  .cd-tabs-navigation span::before {\n    top: 50%;\n    margin-top: -10px;\n    margin-left: 0;\n    left: 38px;\n  }\n}\n\n.cd-tabs-content {\n  padding: 0px;\n}\n.cd-tabs-content li {\n  display: none;\n}\n.cd-tabs-content li.selected {\n  display: block;\n  -webkit-animation: cd-fade-in 0.5s;\n  -moz-animation: cd-fade-in 0.5s;\n  animation: cd-fade-in 0.5s;\n}\n@media only screen and (min-width: 768px) {\n  .cd-tabs-content {\n    min-height: 480px;\n  }\n  .cd-tabs-content li {\n      padding-left: 90px;\n  }\n}\n@media only screen and (min-width: 960px) {\n  .cd-tabs-content {\n    min-height: 0;\n  }\n  .cd-tabs-content li {\n    padding-left: 0px;\n  }\n  .cd-tabs-content li p {\n  }\n}\n\n@-webkit-keyframes cd-fade-in {\n  0% {\n    opacity: 0;\n  }\n  100% {\n    opacity: 1;\n  }\n}\n@-moz-keyframes cd-fade-in {\n  0% {\n    opacity: 0;\n  }\n  100% {\n    opacity: 1;\n  }\n}\n@keyframes cd-fade-in {\n  0% {\n    opacity: 0;\n  }\n  100% {\n    opacity: 1;\n  }\n}\n</style>\n    ";
        html += '<div class="cd-tabs"><nav><ul class="cd-tabs-navigation">';
        this.properties.tabs.map(function (tab, index) {
            html += '<li><span data-content="' + _this.guid + index + '" class="' + (index == 0 ? "selected" : '') + '">' + tab.Title + '</span></li>';
        });
        html += '</ul></nav><ul class="cd-tabs-content">';
        this.properties.tabs.map(function (tab, index) {
            if (_this.displayMode == sp_core_library_1.DisplayMode.Edit) {
                html += '<li data-content="' + _this.guid + index + '" class="' + (index == 0 ? "selected" : '') + '">';
                html += '<div><textarea name="' + _this.guid + '-editor-' + index + '" id="' + _this.guid + '-editor-' + index + '">' + (tab.Content != null ? tab.Content : '') + '</textarea></div>';
                html += '</li>';
            }
            else {
                html += '<li data-content="' + _this.guid + index + '" class="' + (index == 0 ? "selected" : '') + '"}>';
                html += tab.Content + '</li>';
            }
        });
        html += '</ul></div>';
        this.domElement.innerHTML = html;
        this.setClicked();
        if (this.displayMode == sp_core_library_1.DisplayMode.Edit) {
            var ckEditorCdn = '//cdn.ckeditor.com/4.6.2/full/ckeditor.js';
            sp_loader_1.SPComponentLoader.loadScript(ckEditorCdn, { globalExportsName: 'CKEDITOR' }).then(function (CKEDITOR) {
                if (_this.properties.inline == null || _this.properties.inline === false) {
                    for (var tab = 0; tab < _this.properties.tabs.length; tab++) {
                        CKEDITOR.replace(_this.guid + '-editor-' + tab, {
                            skin: 'moono-lisa,//cdn.ckeditor.com/4.6.2/full-all/skins/moono-lisa/'
                        });
                    }
                }
                else {
                    for (var tab2 = 0; tab2 < _this.properties.tabs.length; tab2++) {
                        CKEDITOR.inline(_this.guid + '-editor-' + tab2, {
                            skin: 'moono-lisa,//cdn.ckeditor.com/4.4.3/full-all/skins/moono-lisa/'
                        });
                    }
                }
                for (var i in CKEDITOR.instances) {
                    CKEDITOR.instances[i].on('change', function (elm, val) {
                        elm.sender.updateElement();
                        var value = (document.getElementById(elm.sender.name)).value;
                        var id = elm.sender.name.split("-editor-")[1];
                        _this.properties.tabs[id].Content = value;
                    });
                }
            });
        }
    };
    TabsWebPart.prototype.setClicked = function () {
        var tabs = $('.cd-tabs');
        tabs.each(function () {
            var tab = $(this), tabItems = tab.find('ul.cd-tabs-navigation'), tabContentWrapper = tab.children('ul.cd-tabs-content'), tabNavigation = tab.find('nav');
            tabItems.on('click', 'span', function (event) {
                event.preventDefault();
                var selectedItem = $(this);
                if (!selectedItem.hasClass('selected')) {
                    var selectedTab = selectedItem.data('content'), selectedContent = tabContentWrapper.find('li[data-content="' + selectedTab + '"]'), slectedContentHeight = selectedContent.innerHeight();
                    tabItems.find('span.selected').removeClass('selected');
                    selectedItem.addClass('selected');
                    selectedContent.addClass('selected').siblings('li').removeClass('selected');
                    //animate tabContentWrapper height when content changes
                    tabContentWrapper.animate({
                        'height': slectedContentHeight
                    }, 200);
                }
                return false;
            });
            //hide the .cd-tabs::after element when tabbed navigation has scrolled to the end (mobile version)
            checkScrolling(tabNavigation);
            tabNavigation.on('scroll', function () {
                checkScrolling($(this));
            });
        });
        $(window).on('resize', function () {
            tabs.each(function () {
                var tab = $(this);
                checkScrolling(tab.find('nav'));
                tab.find('.cd-tabs-content').css('height', 'auto');
            });
        });
        function checkScrolling(tabs2) {
            var totalTabWidth = parseInt(tabs2.children('.cd-tabs-navigation').width()), tabsViewport = parseInt(tabs2.width());
            if (tabs2.scrollLeft() >= totalTabWidth - tabsViewport) {
                tabs2.parent('.cd-tabs').addClass('is-ended');
            }
            else {
                tabs2.parent('.cd-tabs').removeClass('is-ended');
            }
        }
    };
    /**
     * @function
     * Generates a GUID
     */
    TabsWebPart.prototype.getGuid = function () {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
            this.s4() + '-' + this.s4() + this.s4() + this.s4();
    };
    /**
     * @function
     * Generates a GUID part
     */
    TabsWebPart.prototype.s4 = function () {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    };
    /**
     * @function
     * PropertyPanel settings definition
     */
    TabsWebPart.prototype.getPropertyPaneConfiguration = function () {
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
                                    label: strings.Tabs,
                                    value: this.properties.tabs,
                                    headerText: strings.ManageTabs,
                                    fields: [
                                        { id: 'Title', title: 'Title', required: true, type: PropertyFieldCustomList_1.CustomListFieldType.string }
                                    ],
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    context: this.context,
                                    properties: this.properties,
                                    key: 'tabsListField'
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
                        },
                        {
                            groupName: strings.LayoutGroupName,
                            groupFields: [
                                PropertyFieldColorPickerMini_1.PropertyFieldColorPickerMini('disableColor', {
                                    label: strings.DisableColor,
                                    initialColor: this.properties.disableColor,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: 'tabsDisableColorField'
                                }),
                                PropertyFieldColorPickerMini_1.PropertyFieldColorPickerMini('selectedColor', {
                                    label: strings.SelectedColor,
                                    initialColor: this.properties.selectedColor,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: 'tabsSelectedColorField'
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    };
    return TabsWebPart;
}(sp_webpart_base_1.BaseClientSideWebPart));
exports.default = TabsWebPart;

//# sourceMappingURL=TabsWebPart.js.map
