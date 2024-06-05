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

    static final String CHANNEL_ID_CALL = "KCHAT_CHANNEL_ID_CALL";
    static final int NOTIFICATION_ID_CALL = -1;

    private final PushNotificationDataHelper dataHelper;

    private String type;
    private String ackId;
    private String postId;
    private String channelId;
    private String serverId;
    private String conferenceId;
    private String channelName;
    private String conferenceJWT;

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
        type = initialData.getString("type");
        ackId = initialData.getString("ack_id");
        postId = initialData.getString("post_id");
        channelId = initialData.getString("channel_id");
        serverId = initialData.getString("server_id");
        conferenceId = initialData.getString("conference_id");
        channelName = initialData.getString("channel_name");
        conferenceJWT = initialData.getString("conference_jwt");

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
            //startIncomingCallActivity(channelId, serverId, conferenceId, channelName, conferenceJWT);
            Notification callNotification = createNotification();
            super.postNotification(callNotification, NOTIFICATION_ID_CALL);
        } else {
            finishProcessingNotification(
                    serverUrl,
                    type,
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

    private Notification createNotification() {
        Intent contentIntent = new Intent(mContext, MainActivity.class);
        PendingIntent contentPendingIntent = PendingIntent.getActivity(mContext, 0, contentIntent, PendingIntent.FLAG_IMMUTABLE);

        Intent fullScreenIntent = new Intent(mContext, CallActivity.class);
        addExtrasToIntent(fullScreenIntent);
        PendingIntent fullScreenPendingIntent = PendingIntent.getActivity(mContext, 0, fullScreenIntent, PendingIntent.FLAG_IMMUTABLE);

        return new NotificationCompat.Builder(mContext, CHANNEL_ID_CALL)
                .setSmallIcon(R.drawable.ic_kchat_notification)
                .setContentTitle(mContext.getString(R.string.notificationCallFrom, channelName))
                .setAutoCancel(false)
                .setContentIntent(contentPendingIntent)
                .setFullScreenIntent(fullScreenPendingIntent, true)
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setCategory(NotificationCompat.CATEGORY_CALL)
                .addAction(R.drawable.ic_decline, mContext.getString(R.string.declineCall), getCallPendingIntent(false))
                .addAction(R.drawable.ic_accept, mContext.getString(R.string.acceptCall), getCallPendingIntent(true))
                .build();
    }

    private void addExtrasToIntent(Intent intent) {
        intent.putExtra("channelId", channelId);
        intent.putExtra("serverId", serverId);
        intent.putExtra("conferenceId", conferenceId);
        intent.putExtra("channelName", channelName);
        intent.putExtra("conferenceJWT", conferenceJWT);
    }

    private PendingIntent getCallPendingIntent(boolean isAccepted) {
        Intent cancelCallIntent = new Intent(mContext, ActiveCallServiceReceiver.class);
        String action = isAccepted ? ActiveCallServiceReceiver.ACTION_ACCEPT : ActiveCallServiceReceiver.ACTION_DECLINE;
        cancelCallIntent.setAction(action);
        addExtrasToIntent(cancelCallIntent);
        return PendingIntent.getBroadcast(mContext, 0, cancelCallIntent, PendingIntent.FLAG_IMMUTABLE);
    }

    private void startIncomingCallActivity() {
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
