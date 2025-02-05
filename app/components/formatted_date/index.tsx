// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {useIntl} from 'react-intl';
import {Text, type TextProps} from 'react-native';

import formatDateTime from '@utils/format_datetime';

type FormattedDateProps = TextProps & {
    format?: string;
    timezone?: string | UserTimezone | null;
    value: number | string | Date;
}

const FormattedDate = ({timezone, value, ...props}: FormattedDateProps) => {
    const {locale} = useIntl();

    let zone = '';
    if (timezone) {
        if (typeof timezone === 'object') {
            zone = timezone.useAutomaticTimezone ? timezone.automaticTimezone : timezone.manualTimezone;
        } else {
            zone = timezone;
        }
    }

    const dateTime = formatDateTime(value, {timeZone: zone, locale, capitalize: true});

    return (
        <Text
            {...props}
        >
            {dateTime}
        </Text>
    );
};

export default FormattedDate;
