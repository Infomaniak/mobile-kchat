// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

/* eslint-disable max-lines */

import type {DatabaseType} from '@constants/database';
import type AppDataOperator from '@database/operator/app_data_operator';
import type ServerDataOperator from '@database/operator/server_data_operator';
import type {Database, Q} from '@nozbe/watermelondb';
import type Model from '@nozbe/watermelondb/Model';
import type {Clause} from '@nozbe/watermelondb/QueryDescription';
import type {Class} from '@nozbe/watermelondb/types';
import type System from '@typings/database/models/servers/system';

export type WithDatabaseArgs = { database: Database }

export type CreateServerDatabaseConfig = {
  dbName: string;
  dbType?: DatabaseType;
  displayName?: string;
  serverUrl?: string;
  identifier?: string;
};

export type RegisterServerDatabaseArgs = {
  databaseFilePath: string;
  displayName: string;
  serverUrl: string;
  identifier?: string;
};

export type AppDatabase = {
  database: Database;
  operator: AppDataOperator;
};

export type ServerDatabase = {
  database: Database;
  operator: ServerDataOperator;
}

export type ServerDatabases = {
  [x: string]: ServerDatabase | undefined;
};

export type TransformerArgs = {
  action: string;
  database: Database;
  fieldsMapper?: (model: Model) => void;
  tableName?: string;
  value: RecordPair;
};

export type PrepareBaseRecordArgs = TransformerArgs & {
  fieldsMapper: (model: Model) => void;
}

export type OperationArgs<T extends Model> = {
  tableName: string;
  createRaws?: RecordPair[];
  updateRaws?: RecordPair[];
  deleteRaws?: T[];
  transformer: (args: TransformerArgs) => Promise<T>;
};

export type Models = Array<Class<Model>>;

// The elements needed to create a new database
export type CreateServerDatabaseArgs = {
  config: CreateServerDatabaseConfig;
  shouldAddToAppDatabase?: boolean;
};

export type HandleReactionsArgs = {
  prepareRecordsOnly: boolean;
  postsReactions?: ReactionsPerPost[];
  skipSync?: boolean;
};

export type HandleFilesArgs = {
  files?: FileInfo[];
  prepareRecordsOnly: boolean;
};

export type HandlePostsArgs = {
  actionType: string;
  order?: string[];
  previousPostId?: string;
  posts?: Post[];
  prepareRecordsOnly?: boolean;
};

export type HandleThreadsArgs = {
  threads?: ThreadWithLastFetchedAt[];
  prepareRecordsOnly?: boolean;
  teamId?: string;
};

export type HandleThreadParticipantsArgs = {
  prepareRecordsOnly: boolean;
  skipSync?: boolean;
  threadsParticipants: ParticipantsPerThread[];
};

export type HandleThreadInTeamArgs = {
  threadsMap?: Record<string, Thread[]>;
  prepareRecordsOnly?: boolean;
};

export type HandleTeamThreadsSyncArgs = {
  data: TeamThreadsSync[];
  prepareRecordsOnly?: boolean;
};

export type SanitizeReactionsArgs = {
  database: Database;
  post_id: string;
  rawReactions: Reaction[];
  skipSync?: boolean;
};

export type SanitizeThreadParticipantsArgs = {
  database: Database;
  skipSync?: boolean;
  thread_id: $ID<Thread>;
  rawParticipants: ThreadParticipant[];
}

export type ChainPostsArgs = {
  order?: string[];
  previousPostId: string;
  posts: Post[];
};

export type SanitizePostsArgs = {
  orders: string[];
  posts: Post[];
};

export type IdenticalRecordArgs = {
  existingRecord: Model;
  newValue: RawValue;
  tableName: string;
};

export type RetrieveRecordsArgs = {
  database: Database;
  tableName: string;
  condition: Clause;
};

export type ProcessRecordsArgs<T extends Model, R extends RawValue> = {
  createOrUpdateRawValues: R[];
  deleteRawValues?: R[];
  tableName: string;
  buildClauseFromRawValues?: (rawValues: R[]) => Q.Clause | null;
  matchRecord?: (existingRecord: T, newRaw: R) => boolean;
  shouldUpdate?: (existingRecord: T, newRaw: R) => boolean;
} & ({
  fieldName: keyof R;
  buildKeyRecordBy: (obj: T | R) => string | number;
} | {

  // If "fieldName" is common to Model and RawValue, "buildKeyRecordBy" becomes optionnal
  fieldName: keyof R & keyof T;
  buildKeyRecordBy?: (obj: T | R) => string | number;
});

export type HandleRecordsArgs<T extends Model, R extends RawValue> = ProcessRecordsArgs<T, R> & {
  prepareRecordsOnly: boolean;
  transformer: (args: TransformerArgs) => Promise<T>;
};

export type RangeOfValueArgs<R extends RawValue> = {
  raws: R[];
  fieldName: keyof R;
};

export type RecordPair = {
  record?: Model;
  raw: RawValue;
};

type PrepareOnly = {
    prepareRecordsOnly: boolean;
}

export type HandleInfoArgs = PrepareOnly & {
    info?: AppInfo[];
}

export type HandleGlobalArgs = PrepareOnly & {
    globals?: IdValue[];
}

export type HandleRoleArgs = PrepareOnly & {
    roles?: Role[];
}

export type HandleCustomEmojiArgs = PrepareOnly & {
    emojis?: CustomEmoji[];
}

export type HandleSystemArgs = PrepareOnly & {
    systems?: IdValue[];
}

export type HandleConfigArgs = PrepareOnly & {
  configs: IdValue[];
  configsToDelete: IdValue[];
}

export type HandleMyChannelArgs = PrepareOnly & {
  channels?: Channel[];
  myChannels?: ChannelMembership[];
  isCRTEnabled?: boolean;
};

export type HandleChannelInfoArgs = PrepareOnly &{
  channelInfos?: Array<Partial<ChannelInfo>>;
};

export type HandleMyChannelSettingsArgs = PrepareOnly & {
  settings?: ChannelMembership[];
};

export type HandleChannelArgs = PrepareOnly & {
  channels?: Channel[];
};

export type HandleCategoryArgs = PrepareOnly & {
  categories?: Category[];
};

export type HandleGroupArgs = PrepareOnly & {
  groups?: Group[];
};

export type HandleGroupChannelsForChannelArgs = PrepareOnly & {
  channelId: string;
  groups?: Array<Pick<Group, 'id'>>;
}

export type HandleGroupMembershipForMemberArgs = PrepareOnly & {
  userId: string;
  groups?: Array<Pick<Group, 'id'>>;
}

export type HandleGroupTeamsForTeamArgs = PrepareOnly & {
  teamId: string;
  groups?: Array<Pick<Group, 'id'>>;
}

export type HandleCategoryChannelArgs = PrepareOnly & {
  categoryChannels?: CategoryChannel[];
};

export type HandleMyTeamArgs = PrepareOnly & {
  myTeams?: MyTeam[];
};

export type HandleTeamSearchHistoryArgs = PrepareOnly &{
  teamSearchHistories?: TeamSearchHistory[];
};

export type HandleTeamChannelHistoryArgs = PrepareOnly & {
  teamChannelHistories?: TeamChannelHistory[];
};

export type HandleTeamArgs = PrepareOnly & {
    teams?: Team[];
};

export type HandleChannelMembershipArgs = PrepareOnly & {
  channelMemberships?: ChannelMembership[];
};

export type HandleTeamMembershipArgs = PrepareOnly & {
  teamMemberships?: TeamMembership[];
};

export type HandlePreferencesArgs = PrepareOnly & {
  preferences?: PreferenceType[];
  sync?: boolean;
};

export type HandleUsersArgs = PrepareOnly & {
    users?: UserProfile[];
 };

export type HandleDraftArgs = PrepareOnly & {
  drafts?: Draft[];
};

export type HandleConferencesArgs = PrepareOnly & {
  conferences: Conference[];
}

export type HandleConferenceParticipantsArgs = PrepareOnly & {
  conferencesParticipants: ConferenceParticipant[];
}

export type LoginArgs = {
  config: Partial<ClientConfig>;
  ldapOnly?: boolean;
  license: Partial<ClientLicense>;
  loginId: string;
  mfaToken?: string;
  password: string;
  serverDisplayName: string;
};

export type ServerUrlChangedArgs = {
  configRecord: System;
  licenseRecord: System;
  selectServerRecord: System;
  serverUrl: string;
};

export type GetDatabaseConnectionArgs = {
  serverUrl: string;
  connectionName?: string;
  setAsActiveDatabase: boolean;
}

export type ProcessRecordResults<T extends Model> = {
    createRaws: RecordPair[];
    updateRaws: RecordPair[];
    deleteRaws: T[];
}
