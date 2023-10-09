// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

type ProgressiveImageProps = {
    defaultSource?: {
        headers?: { Authorization: string };
        uri: string;
    };
    imageUri?: string;
    inViewPort?: boolean;
    thumbnailUri?: string;
}
