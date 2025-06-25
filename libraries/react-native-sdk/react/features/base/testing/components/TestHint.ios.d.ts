import React, { Component } from 'react';
import { TestHintProps } from './AbstractTestHint';
/**
 * This is the iOS version of the TestHint.
 *
 * Be sure to check the description in TestHint.android and AbstractTestHint
 * files to understand what a test hint is and why different iOS and Android
 * components are necessary.
 */
declare class TestHint extends Component<TestHintProps> {
    /**
     *  Renders the test hint on Android.
     *
     * @returns {ReactElement}
     */
    render(): JSX.Element | null;
}
declare const _default: import("react-redux").ConnectedComponent<typeof TestHint, import("react-redux").Omit<React.ClassAttributes<TestHint> & TestHintProps, "_testModeEnabled">>;
export default _default;
