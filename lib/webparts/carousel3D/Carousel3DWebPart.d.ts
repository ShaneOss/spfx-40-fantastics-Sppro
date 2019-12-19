/**
 * @file
 * 3D Carousel Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
import { BaseClientSideWebPart, IPropertyPaneConfiguration, IWebPartContext } from '@microsoft/sp-webpart-base';
import { Version } from '@microsoft/sp-core-library';
import { ICarousel3DWebPartProps } from './ICarousel3DWebPartProps';
export default class Carousel3DWebPart extends BaseClientSideWebPart<ICarousel3DWebPartProps> {
    private guid;
    /**
     * @function
     * Web part contructor.
     */
    constructor(context?: IWebPartContext);
    /**
     * @function
     * Gets WP data version
     */
    protected readonly dataVersion: Version;
    /**
     * @function
     * Renders HTML code
     */
    render(): void;
    /**
     * @function
     * Renders JavaScript JQuery plugin
     */
    private renderContents();
    /**
     * @function
     * Occurs when the carousel jquery plugin is loaded. So, change the visiblity
     */
    private onLoaded();
    /**
     * @function
     * Occurs when the carousel is rendered. So, display the item
     */
    private rendered(carousel);
    /**
     * @function
     * Generates a GUID
     */
    private getGuid();
    /**
     * @function
     * Generates a GUID part
     */
    private s4();
    /**
     * @function
     * PropertyPanel settings definition
     */
    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration;
}
