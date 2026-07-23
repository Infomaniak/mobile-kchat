// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

import type {NativeSyntheticEvent, ViewProps} from 'react-native';
import type {DirectEventHandler, Double, Int32} from 'react-native/Libraries/Types/CodegenTypes';

export type OnLinkPressedPayload = Readonly<{
  url: string;
}>;

export type OnLoadErrorPayload = Readonly<{
  message: string;
}>;

export type OnPasswordFailedPayload = Readonly<{
  remainingAttempts: Int32;
}>;

export type OnPasswordRequiredPayload = Readonly<{
  maxAttempts: Int32;
  remainingAttempts: Int32;
}>;

export type OnPasswordLimitReachedPayload = Readonly<{
  maxAttempts: Int32;
}>;

export type OnTapPayload = Readonly<{
  x: Double;
  y: Double;
}>;

export type OnLinkPressedEvent = NativeSyntheticEvent<OnLinkPressedPayload>;
export type OnLoadErrorEvent = NativeSyntheticEvent<OnLoadErrorPayload>;
export type OnPasswordFailedEvent = NativeSyntheticEvent<OnPasswordFailedPayload>;
export type OnPasswordLimitReachedEvent = NativeSyntheticEvent<OnPasswordLimitReachedPayload>;
export type OnPasswordRequiredEvent = NativeSyntheticEvent<OnPasswordRequiredPayload>;
export type OnTapEvent = NativeSyntheticEvent<OnTapPayload>;

export interface NativeProps extends ViewProps {
  source: string;
  password?: string;
  allowLinks?: boolean;
  onLinkPressed?: DirectEventHandler<OnLinkPressedPayload>;
  onLinkPressedDisabled?: DirectEventHandler<{}>;
  onLoad?: DirectEventHandler<{}>;
  onPasswordRequired?: DirectEventHandler<OnPasswordRequiredPayload>;
  onPasswordFailed?: DirectEventHandler<OnPasswordFailedPayload>;
  onPasswordFailureLimitReached?: DirectEventHandler<OnPasswordLimitReachedPayload>;
  onLoadError?: DirectEventHandler<OnLoadErrorPayload>;
  onTap?: DirectEventHandler<OnTapPayload>;
}

export default codegenNativeComponent<NativeProps>('SecurePdfViewer', {
    excludedPlatforms: [],
    paperComponentName: 'SecurePdfViewer',
});
