/**
 * @file
 * Image Color Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
import { BaseClientSideWebPart, IPropertyPaneConfiguration, IWebPartContext } from '@microsoft/sp-webpart-base';
import { Version } from '@microsoft/sp-core-library';
import { IImageColorWebPartProps } from './IImageColorWebPartProps';
export default class ImageColorWebPart extends BaseClientSideWebPart<IImageColorWebPartProps> {
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
     * PropertyPanel settings definition
     */
    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration;
}
