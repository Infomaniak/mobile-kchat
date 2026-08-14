// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {useNavigation} from 'expo-router';
import React, {useCallback, useEffect, useReducer, useRef, useState} from 'react';
import {useIntl} from 'react-intl';
import {Keyboard} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {SafeAreaView} from 'react-native-safe-area-context';

import {submitInteractiveDialog} from '@actions/remote/integrations';
import ErrorText from '@components/error_text';
import NavigationButton from '@components/navigation_button';
import {useServerUrl} from '@context/server';
import {useTheme} from '@context/theme';
import useAndroidHardwareBackHandler from '@hooks/android_back_handler';
import {dismissModal} from '@screens/navigation';
import {checkDialogElementForError, checkIfErrorsMatchElements} from '@utils/integrations';
import {changeOpacity, makeStyleSheetFromTheme} from '@utils/theme';
import {secureGetFromRecord} from '@utils/types';

import DialogElement from './dialog_element';
import DialogIntroductionText from './dialog_introduction_text';

import type {AvailableScreens} from '@typings/screens/navigation';

const getStyleFromTheme = makeStyleSheetFromTheme((theme) => {
    return {
        container: {
            backgroundColor: changeOpacity(theme.centerChannelColor, 0.03),
            flex: 1,
        },
        errorContainer: {
            marginTop: 15,
            marginLeft: 15,
            fontSize: 14,
            fontWeight: 'bold',
        },
        scrollView: {
            marginBottom: 20,
            marginTop: 10,
        },
    };
});

type Props = {
    config: InteractiveDialogConfig;
    componentId: AvailableScreens;
}

const close = () => {
    Keyboard.dismiss();
    dismissModal();
};

type Errors = {[name: string]: string}
const emptyErrorsState: Errors = {};

type Values = {[name: string]: string|number|boolean}
type ValuesAction = {name: string; value: string|number|boolean}
function valuesReducer(state: Values, action: ValuesAction) {
    if (state[action.name] === action.value) {
        return state;
    }
    return {...state, [action.name]: action.value};
}
function initValues(elements?: DialogElement[]) {
    const values: Values = {};
    elements?.forEach((e) => {
        if (e.type === 'bool') {
            values[e.name] = (e.default === true || String(e.default).toLowerCase() === 'true');
        } else if (e.default) {
            values[e.name] = e.default;
        }
    });
    return values;
}

const emptyElementList: DialogElement[] = [];
function InteractiveDialog({
    config: {
        url,
        dialog: {
            callback_id: callbackId,
            introduction_text: introductionText,
            elements = emptyElementList,
            notify_on_cancel: notifyOnCancel,
            state,
            submit_label: submitLabel,
        },
    },
    componentId,
}: Props) {
    const theme = useTheme();
    const navigation = useNavigation();
    const style = getStyleFromTheme(theme);
    const [error, setError] = useState('');
    const [errors, setErrors] = useState(emptyErrorsState);
    const [values, dispatchValues] = useReducer(valuesReducer, elements, initValues);
    const [submitting, setSubmitting] = useState(false);
    const serverUrl = useServerUrl();
    const intl = useIntl();

    const scrollView = useRef<KeyboardAwareScrollView>(null);

    const onChange = useCallback((name: string, value: string | number | boolean) => {
        dispatchValues({name, value});
    }, []);

    const handleSubmit = useCallback(async () => {
        const newErrors: Errors = {};
        const submission = {...values};
        let hasErrors = false;
        if (elements) {
            elements.forEach((elem) => {
                // Delete empty number fields before submissions
                if (elem.type === 'text' && elem.subtype === 'number' && secureGetFromRecord(submission, elem.name) === '') {
                    delete submission[elem.name];
                }

                const newError = checkDialogElementForError(elem, secureGetFromRecord(submission, elem.name));
                if (newError) {
                    newErrors[elem.name] = intl.formatMessage(newError as any, newError.values);
                    hasErrors = true;
                }
            });
        }

        setErrors(hasErrors ? newErrors : emptyErrorsState);

        if (hasErrors) {
            return;
        }

        const dialog = {
            url,
            callback_id: callbackId,
            state,
            submission,
        } as DialogSubmission;

        setSubmitting(true);
        const {data} = await submitInteractiveDialog(serverUrl, dialog);

        if (data) {
            if (data.errors &&
                Object.keys(data.errors).length >= 0 &&
                checkIfErrorsMatchElements(data.errors, elements)
            ) {
                hasErrors = true;
                setErrors(data.errors);
            }

            if (data.error) {
                hasErrors = true;
                setError(data.error);
                scrollView.current?.scrollToPosition(0, 0, true);
            } else {
                setError('');
            }
        }

        if (hasErrors) {
            setSubmitting(false);
        } else {
            close();
        }
    }, [elements, url, callbackId, state, values, serverUrl, intl]);

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <NavigationButton
                    onPress={() => {
                        if (notifyOnCancel) {
                            submitInteractiveDialog(serverUrl, {
                                url,
                                callback_id: callbackId,
                                state,
                                cancelled: true,
                            } as DialogSubmission);
                        }
                        close();
                    }}
                    testID='close.more_direct_messages.button'
                />
            ),
            headerRight: () => (
                <NavigationButton
                    disabled={submitting}
                    onPress={handleSubmit}
                    text={submitLabel || intl.formatMessage({id: 'interactive_dialog.submit', defaultMessage: 'Submit'})}
                    testID='interactive_dialog.submit.button'
                />
            ),
        });

    // The dependencies should include all values used in the setOptions callback
    }, [navigation, notifyOnCancel, serverUrl, url, callbackId, state, handleSubmit, submitting, intl, submitLabel, theme.sidebarHeaderTextColor]);

    useAndroidHardwareBackHandler(componentId, close);

    return (
        <SafeAreaView
            testID='interactive_dialog.screen'
            style={style.container}
            nativeID={`${componentId}.screen`}
        >
            <KeyboardAwareScrollView
                ref={scrollView}
                bounces={false}
                style={style.scrollView}
                enableAutomaticScroll={true}
                enableOnAndroid={true}
                noPaddingBottomOnAndroid={true}
                scrollToOverflowEnabled={true}
                enableResetScrollToCoords={true}
                extraScrollHeight={0}
                extraHeight={0}
                keyboardDismissMode='interactive'
                keyboardShouldPersistTaps='handled'
            >
                {Boolean(error) && (
                    <ErrorText
                        testID='interactive_dialog.error.text'
                        textStyle={style.errorContainer}
                        error={error}
                    />
                )}
                {Boolean(introductionText) &&
                <DialogIntroductionText
                    value={introductionText}
                />
                }
                {Boolean(elements) && elements.map((e) => {
                    const value = secureGetFromRecord(values, e.name);
                    return (
                        <DialogElement
                            key={'dialogelement' + e.name}
                            displayName={e.display_name}
                            name={e.name}
                            type={e.type}
                            subtype={e.subtype}
                            helpText={e.help_text}
                            errorText={secureGetFromRecord(errors, e.name)}
                            placeholder={e.placeholder}
                            maxLength={e.max_length}
                            dataSource={e.data_source}
                            optional={e.optional}
                            options={e.options}
                            value={value}
                            onChange={onChange}
                        />
                    );
                })}
            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
}

export default InteractiveDialog;
