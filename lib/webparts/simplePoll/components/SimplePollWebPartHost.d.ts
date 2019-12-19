/**
 * @file
 * Simple Poll Web Part React JSX component.
 *
 * Contains JSX code to render the web part with HTML templates.
 *
 * Author: Olivier Carpentier
 */
import * as React from 'react';
import { ISimplePollWebPartProps } from '../ISimplePollWebPartProps';
import { IWebPartContext } from '@microsoft/sp-webpart-base';
/**
 * @interface
 * Defines Simple Poll web part state.
 */
export interface ISimplePollState {
    loaded: boolean;
    alreadyVote?: boolean;
    existingAnswer?: string;
    question?: string;
    questionInternalName?: string;
    choices?: string[];
    viewResults?: boolean;
    resultsLoaded?: boolean;
    popupOpened?: boolean;
    popupErrorOpened?: boolean;
    selectedValue?: string;
    results?: number[];
}
/**
 * @class
 * Defines Simple Poll web part class.
 */
export default class SimplePollWebPartHost extends React.Component<ISimplePollWebPartProps, ISimplePollState> {
    private myPageContext;
    private guid;
    /**
     * @function
     * Simple Poll web part contructor.
     */
    constructor(props: ISimplePollWebPartProps, context: IWebPartContext);
    /**
     * @function
     * JSX Element render method
     */
    render(): JSX.Element;
    private getGuid();
    private s4();
    private onVoteChanged(elm?);
    private vote(elm?);
    private closeError();
    private closeVote();
    private viewResultsBack(elm?);
    private viewResults(elm?);
    private getColors(choices);
    private getRandomInitialsColor(index);
    private loadChart();
    private loadQuestions(props);
    /**
     * @function
     * Function called when the component did mount
     */
    componentDidMount(): void;
    /**
     * @function
     * Function called when the web part properties has changed
     */
    componentWillReceiveProps(nextProps: ISimplePollWebPartProps): void;
    /**
     * @function
     * Function called when the component has been rendered (ie HTML code is ready)
     */
    componentDidUpdate(prevProps: ISimplePollWebPartProps, prevState: ISimplePollState): void;
}
