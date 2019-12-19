/**
 * @file
 * Service to get list & list items from current SharePoint site
 *
 * Author: Olivier Carpentier
 */
import { ISPListItems } from './ISPList';
import { IWebPartContext } from '@microsoft/sp-webpart-base';
import { ISimplePollWebPartProps } from './ISimplePollWebPartProps';
/**
 * @interface
 * Service interface definition
 */
export interface ISPSurveyService {
    /**
     * @function
     * Gets the question from a SharePoint list
     */
    getQuestions(libId: string): Promise<ISPListItems>;
    getResults(surveyListId: string, question: string, choices: string[]): Promise<number[]>;
    postVote(surveyListId: string, question: string, choice: string): Promise<boolean>;
}
/**
 * @class
 * Service implementation to get list & list items from current SharePoint site
 */
export declare class SPSurveyService implements ISPSurveyService {
    private context;
    private props;
    /**
     * @function
     * Service constructor
     */
    constructor(_props: ISimplePollWebPartProps, pageContext: IWebPartContext);
    getResults(surveyListId: string, question: string, choices: string[]): Promise<number[]>;
    postVote(surveyListId: string, question: string, choice: string): Promise<boolean>;
    private getListName(listId);
    private getItemTypeForListName(name);
    getVoteForUser(surveyListId: string, question: string, userEmail: string): Promise<ISPListItems>;
    /**
     * @function
     * Gets the survey questions from a SharePoint list
     */
    getQuestions(surveyListId: string): Promise<ISPListItems>;
    /**
     * @function
     * Gets the pictures list from the mock. This function will return a
     * different list of pics for the lib 1 & 2, and an empty list for the third.
     */
    private getItemsFromMock(libId);
}
