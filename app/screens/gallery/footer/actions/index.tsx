// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {StyleSheet, View} from 'react-native';

import Action from './action';

type Props = {
    allowSaveToLocation: boolean;
    canDownloadFiles: boolean;
    disabled: boolean;
    enablePublicLinks: boolean;
    fileId: string;
    onCopyPublicLink: () => void;
    onDownload: () => void;
    onShare: () => void;
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
});

const Actions = ({
    allowSaveToLocation, canDownloadFiles, disabled,
    enablePublicLinks, fileId,
    onCopyPublicLink, onDownload, onShare,
}: Props) => {
    const canCopyPublicLink = !fileId.startsWith('uid') && enablePublicLinks;

    return (
        <View style={styles.container}>
            {canCopyPublicLink &&
            <Action
                disabled={disabled}
                iconName='link-variant'
                onPress={onCopyPublicLink}
            />}
            {canDownloadFiles &&
            <>
                {allowSaveToLocation &&
                <Action
                    disabled={disabled}
                    iconName='download-outline'
                    onPress={onDownload}
                />
                }
                <Action
                    disabled={disabled}
                    iconName='export-variant'
                    onPress={onShare}
                />
            </>
            }
        </View>
    );
};

export default Actions;
