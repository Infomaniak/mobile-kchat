// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {useCallback, useRef, useState} from 'react';

import {Screens} from '@constants';
import {UPLOAD_ERROR_SHOW_INTERVAL} from '@constants/files';
import {useTheme} from '@context/theme';
import {openAsBottomSheet} from '@screens/navigation';

import {getQuotaDescription, type PackName} from './plans';

const useFileUploadError = (currentPackName: PackName, isCurrentUserAdmin: boolean) => {
    const [uploadError, setUploadError] = useState<React.ReactNode>(null);
    const uploadErrorTimeout = useRef<NodeJS.Timeout>();
    const theme = useTheme();

    const newUploadError = useCallback((error: React.ReactNode) => {
        const quotaDescription = getQuotaDescription(currentPackName, isCurrentUserAdmin);

        if (error === 'Quota exceeded') {
            openAsBottomSheet({
                closeButtonId: 'close-quota-exceeded',
                screen: Screens.INFOMANIAK_QUOTA_EXCEEDED,
                theme,
                title: '',
                props: {
                    quotaType: {
                        title: 'infomaniak.size_quota_exceeded.title',
                        description: quotaDescription,
                        image: 'storage',
                    },
                },
            });
        }
        if (uploadErrorTimeout.current) {
            clearTimeout(uploadErrorTimeout.current);
        }
        setUploadError(error);

        uploadErrorTimeout.current = setTimeout(() => {
            setUploadError(null);
        }, UPLOAD_ERROR_SHOW_INTERVAL);
    }, []);

    return {
        uploadError,
        newUploadError,
    };
};

export default useFileUploadError;
