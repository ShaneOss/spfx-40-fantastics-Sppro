/**
 * @file
 * Service to get list & list items from current SharePoint site
 *
 * Author: Olivier Carpentier
 */
import { ISPListItems } from './ISPList';
import { IWebPartContext } from '@microsoft/sp-webpart-base';
import { IVerticalTimelineWebPartProps } from './IVerticalTimelineWebPartProps';
/**
 * @interface
 * Service interface definition
 */
export interface ISPCalendarService {
    /**
     * @function
     * Gets the pictures from a SharePoint list
     */
    getItems(libId: string): Promise<ISPListItems>;
}
/**
 * @class
 * Service implementation to get list & list items from current SharePoint site
 */
export declare class SPCalendarService implements ISPCalendarService {
    private context;
    private props;
    /**
     * @function
     * Service constructor
     */
    constructor(_props: IVerticalTimelineWebPartProps, pageContext: IWebPartContext);
    /**
     * @function
     * Gets the pictures from a SharePoint list
     */
    getItems(queryUrl: string): Promise<ISPListItems>;
    /**
     * @function
     * Gets the pictures list from the mock. This function will return a
     * different list of pics for the lib 1 & 2, and an empty list for the third.
     */
    private getItemsFromMock(libId);
}
