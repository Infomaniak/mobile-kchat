// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {FormattedDate} from 'react-intl';
import {Text, View} from 'react-native';

import FormattedText from '@components/formatted_text';
import {useTheme} from '@context/theme';
import {changeOpacity, makeStyleSheetFromTheme} from '@utils/theme';
import {typography} from '@utils/typography';

import KMailIcon from './kmail_icon';

export type MailAttachmentProps = { to: string; subject: string;created_at: number};

const getStyleSheet = makeStyleSheetFromTheme((theme: Theme) => ({
    icon: {
        borderRadius: 4,
        backgroundColor: theme.bgSecondary,
        flexShrink: 0,
        padding: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 32,
        width: 32,
    },
    mail_attachment: {
        borderRadius: 4,
        paddingTop: 12,
        paddingBottom: 12,
        paddingLeft: 16,
        paddingRight: 16,
        backgroundColor: theme.bgSecondary,
        marginBottom: 8,
        marginTop: 8,
        width: '100%',
    },
    container: {
        overflow: 'hidden',
        flexDirection: 'row',
        gap: 16,
        borderRadius: 4,
        marginTop: 16,
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 16,
        paddingRight: 16,
        width: '100%',
        backgroundColor: theme.centerChannelBg,
    },
    rows: {
        flexShrink: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        overflow: 'hidden',
        ...typography('Body', 100),
    },
    row: {
        width: '100%',
        maxWidth: '100%',
        overflow: 'hidden',
        display: 'flex',
        gap: 8,
        flexDirection: 'row',
    },
    thin: {
        flexShrink: 0,
        color: changeOpacity(theme.centerChannelColor, 0.64),
    },
    bold: {
        flexShrink: 1,
        fontWeight: 'bold',
        color: theme.centerChannelColor,
    },
}));

export const IkMailAttachmentCustomMessage = (props: MailAttachmentProps) => {
    const {subject, to, created_at} = props;
    const theme = useTheme();
    const styles = getStyleSheet(theme);
    return (
        <View style={styles.mail_attachment}>
            <FormattedText
                id='mobile.mail_preview.title'
                style={styles.thin}
                defaultMessage='About the email:'
            />

            <View style={styles.container}>
                <View style={styles.icon}>
                    <KMailIcon/>
                </View>
                <View style={styles.rows}>
                    <View style={{...styles.row, flexWrap: 'wrap', gap: 0}}>
                        <Text
                            numberOfLines={1}
                            style={{
                                marginRight: 'auto',
                                ...styles.bold,
                            }}
                        >{to}</Text>
                        <Text
                            style={styles.thin}
                        >
                            <FormattedDate value={created_at * 1000}/></Text>
                    </View>
                    <View style={styles.row}>
                        <FormattedText
                            id='mobile.mail_preview.subject'
                            style={styles.thin}
                            defaultMessage='Subject:'
                        />
                        <Text
                            numberOfLines={3}
                            style={styles.bold}
                        >{subject}</Text>
                    </View>
                </View>

            </View>
        </View>
    );
};
