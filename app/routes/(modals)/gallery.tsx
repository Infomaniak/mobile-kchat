// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Screens} from '@constants';
import {useTheme} from '@context/theme';
import {useNavigationHeader} from '@hooks/navigation_header';
import {usePropsFromParams} from '@hooks/props_from_params';
import GalleryScreen from '@screens/gallery';

import type {AvailableScreens} from '@typings/screens/navigation';

type Props = {
    componentId?: AvailableScreens;
    galleryIdentifier: string;
    hideActions: boolean;
    initialIndex: number;
    items: any[];
}

export default function GalleryRoute() {
    const theme = useTheme();
    const props = usePropsFromParams<Props>();

    useNavigationHeader({
        showWhenPushed: true,
        headerOptions: {
            headerShown: false,
            contentStyle: {backgroundColor: theme.centerChannelBg},
        },
    });

    return (
        <GalleryScreen
            componentId={Screens.GALLERY}
            {...props}
        />
    );
}
