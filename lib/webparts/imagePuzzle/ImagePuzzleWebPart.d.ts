/**
 * @file
 * Image Puzzle Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
import { BaseClientSideWebPart, IPropertyPaneConfiguration, IWebPartContext } from '@microsoft/sp-webpart-base';
import { Version } from '@microsoft/sp-core-library';
import { IImagePuzzleWebPartProps } from './IImagePuzzleWebPartProps';
export default class ImagePuzzleWebPart extends BaseClientSideWebPart<IImagePuzzleWebPartProps> {
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
