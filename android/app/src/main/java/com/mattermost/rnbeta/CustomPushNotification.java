package com.mattermost.rnbeta;

import static com.mattermost.helpers.database_extension.GeneralKt.getServerUrlForIdentifier;
import static com.mattermost.rnbeta.CallActivity.BROADCAST_RECEIVER_CALL_CANCELED_TAG;
import static com.wix.reactnativenotifications.Defs.NOTIFICATION_RECEIVED_EVENT_NAME;

import android.app.Notification;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.core.app.NotificationCompat;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;

import com.mattermost.helpers.CustomPushNotificationHelper;
import com.mattermost.helpers.DatabaseHelper;
import com.mattermost.helpers.Network;
import com.mattermost.helpers.NotificationHelper;
import com.mattermost.helpers.PushNotificationDataHelper;
import com.mattermost.share.ShareModule;
import com.wix.reactnativenotifications.core.AppLaunchHelper;
import com.wix.reactnativenotifications.core.AppLifecycleFacade;
import com.wix.reactnativenotifications.core.JsIOHelper;
import com.wix.reactnativenotifications.core.NotificationIntentAdapter;
import com.wix.reactnativenotifications.core.notification.PushNotification;

import java.util.Objects;


public class CustomPushNotification extends PushNotification {
    private final PushNotificationDataHelper dataHelper;

    public CustomPushNotification(Context context, Bundle bundle, AppLifecycleFacade appLifecycleFacade, AppLaunchHelper appLaunchHelper, JsIOHelper jsIoHelper) {
        super(context, bundle, appLifecycleFacade, appLaunchHelper, jsIoHelper);
        dataHelper = new PushNotificationDataHelper(context);

        try {
            Objects.requireNonNull(DatabaseHelper.Companion.getInstance()).init(context);
            Network.init(context);
            NotificationHelper.cleanNotificationPreferencesIfNeeded(context);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onReceived() {
        final Bundle initialData = mNotificationProps.asBundle();
        final String type = initialData.getString("type");
        final String ackId = initialData.getString("ack_id");
        final String postId = initialData.getString("post_id");
        final String channelId = initialData.getString("channel_id");
        final String serverId = initialData.getString("server_id");
        final String conferenceId = initialData.getString("conference_id");
        final String channelName = initialData.getString("channel_name");
        final String conferenceJWT = initialData.getString("conference_jwt");

        final boolean isIdLoaded = initialData.getString("id_loaded") != null && initialData.getString("id_loaded").equals("true");

        int notificationId = NotificationHelper.getNotificationId(initialData);

        String serverUrl = addServerUrlToBundle(initialData);

        if (ackId != null && serverUrl != null) {
            Bundle response = ReceiptDelivery.send(ackId, serverUrl, postId, type, isIdLoaded);
            if (isIdLoaded && response != null) {
                Bundle current = mNotificationProps.asBundle();
                if (!current.containsKey("server_url")) {
                    response.putString("server_url", serverUrl);
                }
                current.putAll(response);
                mNotificationProps = createProps(current);
            }
        }

        if (Objects.equals(type, "cancel_call")) {
            broadcastCallEnded();
        } else if (conferenceId != null) {
            startIncomingCallActivity(channelId, serverId, conferenceId, channelName, conferenceJWT);
        } else {
            finishProcessingNotification(
                    serverUrl,
                    type,
                    channelId,
                    notificationId
            );
        }
    }

    @Override
    public void onOpened() {
        if (mNotificationProps != null) {
            digestNotification();

            Bundle data = mNotificationProps.asBundle();
            NotificationHelper.clearChannelOrThreadNotifications(mContext, data);
        }
    }

    private void broadcastCallEnded() {
        Intent callCanceledIntent = new Intent();
        callCanceledIntent.setAction(BROADCAST_RECEIVER_CALL_CANCELED_TAG);
        LocalBroadcastManager.getInstance(mContext).sendBroadcast(callCanceledIntent);
    }

    private void startIncomingCallActivity(
            String channelId,
            String serverId,
            String conferenceId,
            String channelName,
            String conferenceJWT
    ) {
        Intent intent = new Intent(mContext, CallActivity.class);
        intent.putExtra("channelId", channelId);
        intent.putExtra("serverId", serverId);
        intent.putExtra("conferenceId", conferenceId);
        intent.putExtra("channelName", channelName);
        intent.putExtra("conferenceJWT", conferenceJWT);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        intent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
        intent.addCategory(Intent.CATEGORY_LAUNCHER);
        mContext.startActivity(intent);
    }

    private void finishProcessingNotification(
            final String serverUrl,
            @NonNull final String type,
            final String channelId,
            final int notificationId
    ) {
        final boolean isReactInit = mAppLifecycleFacade.isReactInitialized();

        switch (type) {
            case CustomPushNotificationHelper.PUSH_TYPE_MESSAGE:
            case CustomPushNotificationHelper.PUSH_TYPE_SESSION:
                ShareModule shareModule = ShareModule.getInstance();
                String currentActivityName = shareModule != null ? shareModule.getCurrentActivityName() : "";
                Log.i("ReactNative", currentActivityName);
                if (!mAppLifecycleFacade.isAppVisible() || !currentActivityName.equals("MainActivity")) {
                    boolean createSummary = type.equals(CustomPushNotificationHelper.PUSH_TYPE_MESSAGE);
                    if (type.equals(CustomPushNotificationHelper.PUSH_TYPE_MESSAGE)) {
                        if (channelId != null) {
                            Bundle notificationBundle = mNotificationProps.asBundle();
                            if (serverUrl != null) {
                                // We will only fetch the data related to the notification on the native side
                                // as updating the data directly to the db removes the wal & shm files needed
                                // by watermelonDB, if the DB is updated while WDB is running it causes WDB to
                                // detect the database as malformed, thus the app stop working and a restart is required.
                                // Data will be fetch from within the JS context instead.
                                Bundle notificationResult = dataHelper.fetchAndStoreDataForPushNotification(notificationBundle, isReactInit);
                                if (notificationResult != null) {
                                    notificationBundle.putBundle("data", notificationResult);
                                    mNotificationProps = createProps(notificationBundle);
                                }
                            }
                            createSummary = NotificationHelper.addNotificationToPreferences(
                                    mContext,
                                    notificationId,
                                    notificationBundle
                            );
                        }
                    }

                    buildNotification(notificationId, createSummary);
                }
                break;
            case CustomPushNotificationHelper.PUSH_TYPE_CLEAR:
                NotificationHelper.clearChannelOrThreadNotifications(mContext, mNotificationProps.asBundle());
                break;
        }

        if (isReactInit) {
            notifyReceivedToJS();
        }
    }

    private void buildNotification(Integer notificationId, boolean createSummary) {
        final PendingIntent pendingIntent = NotificationIntentAdapter.createPendingNotificationIntent(mContext, mNotificationProps);
        final Notification notification = buildNotification(pendingIntent);
        if (createSummary) {
            final Notification summary = getNotificationSummaryBuilder(pendingIntent).build();
            super.postNotification(summary, notificationId + 1);
        }
        super.postNotification(notification, notificationId);
    }

    @Override
    protected NotificationCompat.Builder getNotificationBuilder(PendingIntent intent) {
        Bundle bundle = mNotificationProps.asBundle();
        return CustomPushNotificationHelper.createNotificationBuilder(mContext, intent, bundle, false);
    }

    protected NotificationCompat.Builder getNotificationSummaryBuilder(PendingIntent intent) {
        Bundle bundle = mNotificationProps.asBundle();
        return CustomPushNotificationHelper.createNotificationBuilder(mContext, intent, bundle, true);
    }

    private void notifyReceivedToJS() {
        mJsIOHelper.sendEventToJS(NOTIFICATION_RECEIVED_EVENT_NAME, mNotificationProps.asBundle(), mAppLifecycleFacade.getRunningReactContext());
    }

    private String addServerUrlToBundle(Bundle bundle) {
        DatabaseHelper dbHelper = DatabaseHelper.Companion.getInstance();
        String serverId = bundle.getString("server_id");
        String serverUrl = null;
        if (dbHelper != null) {
            if (serverId == null) {
                serverUrl = dbHelper.getOnlyServerUrl();
            } else {
                serverUrl = getServerUrlForIdentifier(dbHelper, serverId);
            }

            if (!TextUtils.isEmpty(serverUrl)) {
                bundle.putString("server_url", serverUrl);
                mNotificationProps = createProps(bundle);
            }
        }

        return serverUrl;
    }
}
