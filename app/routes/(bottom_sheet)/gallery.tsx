// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Screens} from '@constants';
import {usePropsFromParams} from '@hooks/props_from_params';
import GalleryScreen from '@screens/gallery';

import type {GalleryItemType} from '@typings/screens/gallery';
import type {AvailableScreens} from '@typings/screens/navigation';

type Props = {
    componentId?: AvailableScreens;
    galleryIdentifier: string;
    hideActions: boolean;
    initialIndex: number;
    items: GalleryItemType[];
}

export default function GalleryRoute() {
    const props = usePropsFromParams<Props>();

    return (
        <GalleryScreen
            componentId={Screens.GALLERY}
            {...props}
        />
    );
}
