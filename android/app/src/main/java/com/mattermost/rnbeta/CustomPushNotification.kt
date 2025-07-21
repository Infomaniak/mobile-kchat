package com.mattermost.rnbeta

import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Bundle
import androidx.core.app.NotificationCompat
import androidx.localbroadcastmanager.content.LocalBroadcastManager
import com.mattermost.call.CallActivity
import com.mattermost.helpers.CustomPushNotificationHelper
import com.mattermost.helpers.DatabaseHelper
import com.mattermost.helpers.Network
import com.mattermost.helpers.PushNotificationDataHelper
import com.mattermost.helpers.database_extension.getServerUrlForIdentifier
import com.mattermost.notification.NotificationUtils
import com.mattermost.notification.NotificationUtils.NOTIFICATION_TYPE_CANCEL_CALL_VALUE
import com.mattermost.notification.NotificationUtils.NOTIFICATION_TYPE_JOINED_CALL_VALUE
import com.mattermost.notification.NotificationUtils.createCallNotification
import com.mattermost.notification.NotificationUtils.dismissCallNotification
import com.mattermost.rnutils.helpers.NotificationHelper
import com.mattermost.turbolog.TurboLog
import com.wix.reactnativenotifications.Defs.NOTIFICATION_RECEIVED_EVENT_NAME
import com.wix.reactnativenotifications.core.AppLaunchHelper
import com.wix.reactnativenotifications.core.AppLifecycleFacade
import com.wix.reactnativenotifications.core.JsIOHelper
import com.wix.reactnativenotifications.core.NotificationIntentAdapter
import com.wix.reactnativenotifications.core.notification.PushNotification
import kotlinx.coroutines.DelicateCoroutinesApi
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch

class CustomPushNotification(
    val context: Context,
    bundle: Bundle,
    appLifecycleFacade: AppLifecycleFacade,
    appLaunchHelper: AppLaunchHelper,
    jsIoHelper: JsIOHelper
) : PushNotification(context, bundle, appLifecycleFacade, appLaunchHelper, jsIoHelper) {
    private val dataHelper = PushNotificationDataHelper(context)

    init {
        try {
            DatabaseHelper.instance?.init(context)
            NotificationHelper.cleanNotificationPreferencesIfNeeded(context)
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    @OptIn(DelicateCoroutinesApi::class)
    override fun onReceived() {
        val initialData = mNotificationProps.asBundle()
        val type = initialData.getString(NotificationUtils.NOTIFICATION_TYPE_KEY)
        val ackId = initialData.getString(NotificationUtils.NOTIFICATION_ACK_ID_KEY)
        val postId = initialData.getString(NotificationUtils.NOTIFICATION_POST_ID_KEY)
        val channelId = initialData.getString(NotificationUtils.CHANNEL_ID_KEY)
        val serverId = initialData.getString(NotificationUtils.SERVER_ID_KEY)
        val conferenceId = initialData.getString(NotificationUtils.CONFERENCE_ID_KEY)
        val channelName = initialData.getString(NotificationUtils.CHANNEL_NAME_KEY)
        val conferenceJWT = initialData.getString(NotificationUtils.CONFERENCE_JWT_KEY)
        val signature = initialData.getString(NotificationUtils.SIGNATURE_KEY)
        val isIdLoaded =
            initialData.getString(NotificationUtils.NOTIFICATION_ID_LOADED_KEY) == "true"
        val notificationId = NotificationHelper.getNotificationId(initialData)
        val serverUrl = addServerUrlToBundle(initialData)
        Network.init(mContext)

        GlobalScope.launch {
            try {
                handlePushNotificationInCoroutine(
                    serverId, serverUrl, type, channelId, channelName, postId,
                    notificationId, ackId, conferenceId, conferenceJWT, isIdLoaded, signature
                )
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    private suspend fun handlePushNotificationInCoroutine(
        serverId: String?,
        serverUrl: String?,
        type: String?,
        channelId: String?,
        channelName: String?,
        postId: String?,
        notificationId: Int,
        ackId: String?,
        conferenceId: String?,
        conferenceJWT: String?,
        isIdLoaded: Boolean,
        signature: String?
    ) {
        if (ackId != null && serverUrl != null) {
            val response = ReceiptDelivery.send(ackId, serverUrl, postId, type, isIdLoaded)
            if (isIdLoaded && response != null) {
                val current = mNotificationProps.asBundle()
                if (!current.containsKey(NotificationUtils.SERVER_URL_KEY)) {
                    response.putString(NotificationUtils.SERVER_URL_KEY, serverUrl)
                }
                current.putAll(response)
                mNotificationProps = createProps(current)
            }
        }

        if (!CustomPushNotificationHelper.verifySignature(mContext, signature, serverUrl, ackId)) {
            TurboLog.i("Mattermost Notifications Signature verification", "Notification skipped because we could not verify it.")
            return
        }

        finishProcessingNotification(
            serverId,
            serverUrl,
            type,
            channelId,
            channelName,
            notificationId,
            conferenceId,
            conferenceJWT,
        )
    }

    override fun onOpened() {
        mNotificationProps?.let {
            digestNotification()
            NotificationHelper.clearChannelOrThreadNotifications(context, it.asBundle())
        }
    }

    private suspend fun finishProcessingNotification(
        serverId: String?,
        serverUrl: String?,
        type: String?,
        channelId: String?,
        channelName: String?,
        notificationId: Int,
        conferenceId: String?,
        conferenceJWT: String?,
    ) {
        val isReactInit = mAppLifecycleFacade.isReactInitialized()

         if ((type == NOTIFICATION_TYPE_CANCEL_CALL_VALUE || type == NOTIFICATION_TYPE_JOINED_CALL_VALUE) && conferenceId != null) {
            context.dismissCallNotification(conferenceId)
            broadcastCallEvent(conferenceId)
        } else if (conferenceJWT != null) {
            val callExtras = NotificationUtils.CallExtras(
                channelId, serverId, conferenceId,
                channelName, conferenceJWT
            )
            val callNotification = context.createCallNotification(callExtras)
            super.postNotification(callNotification, notificationId)
        } else {
            when (type) {
                CustomPushNotificationHelper.PUSH_TYPE_MESSAGE, CustomPushNotificationHelper.PUSH_TYPE_SESSION -> {
                    val currentActivityName = mAppLifecycleFacade.runningReactContext?.currentActivity?.componentName?.className ?: ""
                    TurboLog.i("ReactNative", currentActivityName)
                    if (!mAppLifecycleFacade.isAppVisible() || !currentActivityName.contains("MainActivity")) {
                        var createSummary = type == CustomPushNotificationHelper.PUSH_TYPE_MESSAGE
                        if (type == CustomPushNotificationHelper.PUSH_TYPE_MESSAGE) {
                            channelId?.let {
                                val notificationBundle = mNotificationProps.asBundle()
                                serverUrl?.let {
                                    val notificationResult = dataHelper.fetchAndStoreDataForPushNotification(notificationBundle, isReactInit)
                                    notificationResult?.let { result ->
                                        notificationBundle.putBundle("data", result)
                                        mNotificationProps = createProps(notificationBundle)
                                    }
                                    createSummary = NotificationHelper.addNotificationToPreferences(
                                        context,
                                        notificationId,
                                        notificationBundle
                                    )
                                }
                            }
                            buildNotification(notificationId, createSummary)
                        }
                    }

                }
                CustomPushNotificationHelper.PUSH_TYPE_CLEAR -> NotificationHelper.clearChannelOrThreadNotifications(context, mNotificationProps.asBundle())
            }
        }

        if (isReactInit) {
            notifyReceivedToJS()
        }
    }

    private fun broadcastCallEvent(conferenceId: String) {
        val callEventIntent = Intent()
        callEventIntent.putExtra(NotificationUtils.CONFERENCE_ID_KEY, conferenceId)
        callEventIntent.setAction(CallActivity.BROADCAST_RECEIVER_DISMISS_CALL_TAG)
        LocalBroadcastManager.getInstance(context).sendBroadcast(callEventIntent)
    }

    private fun buildNotification(notificationId: Int, createSummary: Boolean) {
        val pendingIntent =
            NotificationIntentAdapter.createPendingNotificationIntent(context, mNotificationProps)
        val notification = buildNotification(pendingIntent)
        if (createSummary) {
            val summary = getNotificationSummaryBuilder(pendingIntent).build()
            super.postNotification(summary, notificationId + 1)
        }
        super.postNotification(notification, notificationId)
    }

    override fun getNotificationBuilder(intent: PendingIntent): NotificationCompat.Builder {
        val bundle = mNotificationProps.asBundle()
        return CustomPushNotificationHelper.createNotificationBuilder(
            context,
            intent,
            bundle,
            false
        )
    }

    private fun getNotificationSummaryBuilder(intent: PendingIntent): NotificationCompat.Builder {
        val bundle = mNotificationProps.asBundle()
        return CustomPushNotificationHelper.createNotificationBuilder(context, intent, bundle, true)
    }

    private fun notifyReceivedToJS() {
        mJsIOHelper.sendEventToJS(
            NOTIFICATION_RECEIVED_EVENT_NAME,
            mNotificationProps.asBundle(),
            mAppLifecycleFacade.runningReactContext
        )
    }

    private fun addServerUrlToBundle(bundle: Bundle): String? {
        val dbHelper = DatabaseHelper.instance
        val serverId = bundle.getString("server_id")
        var serverUrl: String? = null

        dbHelper?.let {
            serverUrl = if (serverId == null) {
                it.onlyServerUrl
            } else {
                it.getServerUrlForIdentifier(serverId)
            }

            if (!serverUrl.isNullOrEmpty()) {
                bundle.putString("server_url", serverUrl)
                mNotificationProps = createProps(bundle)
            }
        }
        return serverUrl
    }
}
