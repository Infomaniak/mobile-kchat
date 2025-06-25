import { DebouncedFunc } from 'lodash';
import { Component } from 'react';
import { WithTranslation } from 'react-i18next';
import { IReduxState } from '../../../app/types';
export type LiveStreaming = {
    dataPrivacyLink: string;
    enabled: boolean;
    helpLink: string;
    termsLink: string;
    validatorRegExpString: string;
};
export type LiveStreamingProps = {
    dataPrivacyURL?: string;
    enabled: boolean;
    helpURL?: string;
    streamLinkRegexp: RegExp;
    termsURL?: string;
};
/**
 * The props of the component.
 */
export interface IProps extends WithTranslation {
    /**
     * The live streaming dialog properties.
     */
    _liveStreaming: LiveStreamingProps;
    /**
     * Callback invoked when the entered stream key has changed.
     */
    onChange: Function;
    /**
     * The stream key value to display as having been entered so far.
     */
    value: string;
}
/**
 * The state of the component.
 */
export interface IState {
    /**
     * Whether or not to show the warnings that the passed in value seems like
     * an improperly formatted stream key.
     */
    showValidationError: boolean;
}
/**
 * An abstract React Component for entering a key for starting a YouTube live
 * stream.
 *
 * @augments Component
 */
export default class AbstractStreamKeyForm<P extends IProps> extends Component<P, IState> {
    _debouncedUpdateValidationErrorVisibility: DebouncedFunc<() => void>;
    /**
     * Constructor for the component.
     *
     * @inheritdoc
     */
    constructor(props: P);
    /**
     * Implements React Component's componentDidUpdate.
     *
     * @inheritdoc
     */
    componentDidUpdate(prevProps: P): void;
    /**
     * Implements React Component's componentWillUnmount.
     *
     * @inheritdoc
     */
    componentWillUnmount(): void;
    /**
     * Callback invoked when the value of the input field has updated through
     * user input. This forwards the value (string only, even if it was a dom
     * event) to the onChange prop provided to the component.
     *
     * @param {Object | string} change - DOM Event for value change or the
     * changed text.
     * @private
     * @returns {void}
     */
    _onInputChange(change: any): void;
    /**
     * Checks if the stream key value seems like a valid stream key and sets the
     * state for showing or hiding the notification about the stream key seeming
     * invalid.
     *
     * @private
     * @returns {boolean}
     */
    _updateValidationErrorVisibility(): void;
    /**
     * Checks if a passed in stream key appears to be in a valid format.
     *
     * @param {string} streamKey - The stream key to check for valid formatting.
     * @returns {void}
     * @returns {boolean}
     */
    _validateStreamKey(streamKey?: string): boolean;
}
/**
 * Maps part of the Redux state to the component's props.
 *
 * @param {Object} state - The Redux state.
 * @returns {{
 *     _liveStreaming: LiveStreamingProps
 * }}
 */
export declare function _mapStateToProps(state: IReduxState): {
    _liveStreaming: {
        enabled: boolean;
        helpURL: string | undefined;
        termsURL: string | undefined; /**
         * The live streaming dialog properties.
         */
        dataPrivacyURL: string | undefined;
        streamLinkRegexp: RegExp;
    };
};
