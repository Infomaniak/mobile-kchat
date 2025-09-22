// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

type BoardsLimitProps = {
    cards: number;
    views: number;
};

 type FilesLimitProps = {
    total_storage: number;
};

 type IntegrationsLimitProps = {
    enabled: number;
};

 type MessagesLimitProps = {
    history: number;
};

 type TeamsLimitProps = {
    active?: number;
    history?: string;
};
