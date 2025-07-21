// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {useCallback, useRef, useState} from 'react';

import {UPLOAD_ERROR_SHOW_INTERVAL} from '@constants/files';
import { Screens } from '@constants';
import { useTheme } from '@context/theme';
import { openAsBottomSheet } from '@screens/navigation';

const useFileUploadError = () => {
    const [uploadError, setUploadError] = useState<React.ReactNode>(null);
    const uploadErrorTimeout = useRef<NodeJS.Timeout>();
    const theme = useTheme();

    const newUploadError = useCallback((error: React.ReactNode) => {
        if (error === 'Quota exceeded') {
                    openAsBottomSheet({
                        closeButtonId: 'close-quota-exceeded',
                        screen: Screens.INFOMANIAK_QUOTA_EXCEEDED,
                        theme,
                        title: '',
                        props: {
                            quotaType: {
                                title: 'infomaniak.size_quota_exceeded.title',
                                description: 'infomaniak.size_quota_exceeded.description',
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
