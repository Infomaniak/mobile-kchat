import { Component } from 'react';
import { IStore } from '../../../../app/types';
import { DialogProps } from '../../constants';
/**
 * The type of the React {@code Component} props of {@link AbstractDialog}.
 */
export interface IProps extends DialogProps {
    /**
     * Used to show/hide the dialog on cancel.
     */
    dispatch: IStore['dispatch'];
}
/**
 * The type of the React {@code Component} state of {@link AbstractDialog}.
 */
export interface IState {
    submitting?: boolean;
}
/**
 * An abstract implementation of a dialog on Web/React and mobile/react-native.
 */
export default class AbstractDialog<P extends IProps, S extends IState = IState> extends Component<P, S> {
    _mounted: boolean;
    /**
     * Initializes a new {@code AbstractDialog} instance.
     *
     * @param {Object} props - The read-only React {@code Component} props with
     * which the new instance is to be initialized.
     */
    constructor(props: P);
    /**
     * Implements React's {@link Component#componentDidMount()}. Invoked
     * immediately before mounting occurs.
     *
     * @inheritdoc
     */
    componentDidMount(): void;
    /**
     * Implements React's {@link Component#componentWillUnmount()}. Invoked
     * immediately before this component is unmounted and destroyed.
     *
     * @inheritdoc
     */
    componentWillUnmount(): void;
    /**
     * Dispatches a redux action to hide this dialog.
     *
     * @returns {*} The return value of {@link hideDialog}.
     */
    _hide(): {
        type: string;
        component: import("react").ComponentType<any> | undefined;
    };
    /**
     * Dispatches a redux action to hide this dialog when it's canceled.
     *
     * @protected
     * @returns {void}
     */
    _onCancel(): void;
    /**
     * Submits this {@code Dialog}. If the React {@code Component} prop
     * {@code onSubmit} is defined, the function that is the value of the prop
     * is invoked. If the function returns a {@code thenable}, then the
     * resolution of the {@code thenable} is awaited. If the submission
     * completes successfully, a redux action will be dispatched to hide this
     * dialog.
     *
     * @protected
     * @param {string} [value] - The submitted value if any.
     * @returns {void}
     */
    _onSubmit(value?: string): void;
    /**
     * Notifies this {@code AbstractDialog} that it has been submitted
     * successfully. Dispatches a redux action to hide this dialog after it has
     * been submitted.
     *
     * @private
     * @returns {void}
     */
    _onSubmitFulfilled(): void;
    /**
     * Notifies this {@code AbstractDialog} that its submission has failed.
     *
     * @private
     * @returns {void}
     */
    _onSubmitRejected(): void;
}
