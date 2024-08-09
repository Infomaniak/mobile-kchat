package com.mattermost.notification

import android.app.Application
import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.annotation.RequiresApi
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import androidx.core.os.bundleOf
import com.mattermost.call.CallActivity
import com.mattermost.call.IntentUtils.addExtraToIntent
import com.mattermost.call.IntentUtils.getCallDeclinedBundle
import com.mattermost.call.IntentUtils.getDeclineCallPendingIntent
import com.mattermost.call.IntentUtils.getMainActivityPendingIntent
//Keep that import for RN...
import com.mattermost.rnbeta.*

object NotificationUtils {

    // Yes, call type = message, call bundle key = pushNotification ... But this is because
    // we don't want to change a lot of thing on the React side. Sorry about that.
    const val CALL_TYPE_VALUE = "message"
    const val CALL_BUNDLE_KEY = "pushNotification"

    const val NOTIFICATION_TYPE_KEY = "type"
    const val NOTIFICATION_TYPE_JOINED_CALL_VALUE = "joined_call"
    const val NOTIFICATION_TYPE_CANCEL_CALL_VALUE = "cancel_call"

    const val NOTIFICATION_ACK_ID_KEY = "ack_id"
    const val NOTIFICATION_POST_ID_KEY = "post_id"

    const val EVENT_CHANNEL_ID_KEY = "channelId"
    const val EVENT_SERVER_ID_KEY = "serverId"
    const val EVENT_CONFERENCE_ID_KEY = "conferenceId"
    const val EVENT_CONFERENCE_JWT_KEY = "conferenceJWT"

    const val CHANNEL_ID_KEY = "channel_id"
    const val SERVER_ID_KEY = "server_id"
    const val SERVER_URL_KEY = "server_url"
    const val CONFERENCE_ID_KEY = "conference_id"
    const val CHANNEL_NAME_KEY = "channel_name"
    const val CONFERENCE_JWT_KEY = "conference_jwt"

    const val NOTIFICATION_ID_LOADED_KEY = "id_loaded"

    private const val CHANNEL_ID_CALL: String = "KCHAT_CHANNEL_ID_CALL"

    @JvmStatic
    @RequiresApi(api = Build.VERSION_CODES.O)
    fun Context.createCallNotificationChannel() {
        val callChannel = buildNotificationChannel(
            CHANNEL_ID_CALL,
            getString(R.string.notificationChannelName),
            NotificationManager.IMPORTANCE_HIGH,
            getString(R.string.notificationChannelDescription)
        )
        createNotificationChannels(listOf(callChannel))
    }

    @JvmStatic
    @RequiresApi(Build.VERSION_CODES.O)
    fun buildNotificationChannel(
        channelId: String,
        name: String,
        importance: Int,
        description: String
    ): NotificationChannel {
        return NotificationChannel(channelId, name, importance).apply {
            this.description = description

            val isImportant = importance == NotificationManager.IMPORTANCE_HIGH
            setSound(null, null)
            enableLights(isImportant)
            setShowBadge(isImportant)
            enableVibration(isImportant)
        }
    }

    @JvmStatic
    @RequiresApi(Build.VERSION_CODES.O)
    fun Context.createNotificationChannels(
        channelList: List<NotificationChannel>
    ) {
        val notificationManager =
            getSystemService(Application.NOTIFICATION_SERVICE) as NotificationManager?
        notificationManager?.createNotificationChannels(channelList)
    }

    @JvmStatic
    fun Context.createCallNotification(
        callExtras: CallExtras
    ): Notification {
        val fullScreenIntent = Intent(this, CallActivity::class.java)
        fullScreenIntent.addExtraToIntent(callExtras)
        val fullScreenPendingIntent =
            PendingIntent.getActivity(
                this,
                0,
                fullScreenIntent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_MUTABLE
            )

        return buildCallNotification(fullScreenPendingIntent, callExtras)
    }

    @JvmStatic
    fun Context.dismissCallNotification(conferenceIdCall: String) {
        val notificationManagerCompat = NotificationManagerCompat.from(this)
        notificationManagerCompat.activeNotifications.forEach { statusBarNotification ->
            val callBundle = statusBarNotification.notification.extras.getBundle(CALL_BUNDLE_KEY)
            callBundle?.getString(CONFERENCE_ID_KEY).let { conferenceId ->
                if (conferenceId == conferenceIdCall) {
                    notificationManagerCompat.cancel(statusBarNotification.id)
                    return
                }
            }
        }
    }

    private fun Context.buildCallNotification(
        fullScreenPendingIntent: PendingIntent,
        callExtras: CallExtras
    ): Notification = with(callExtras) {
        return NotificationCompat.Builder(this@buildCallNotification, CHANNEL_ID_CALL)
            .setSmallIcon(R.drawable.ic_kchat_notification)
            .setContentTitle(
                this@buildCallNotification.getString(
                    R.string.notificationCallFrom,
                    channelName
                )
            )
            .setSound(null)
            .setAutoCancel(false)
            .setFullScreenIntent(fullScreenPendingIntent, true)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setCategory(NotificationCompat.CATEGORY_CALL)
            .addAction(
                R.drawable.ic_decline,
                this@buildCallNotification.getString(R.string.declineCall),
                this@buildCallNotification.getDeclineCallPendingIntent(callExtras)
            )
            .addAction(
                R.drawable.ic_accept,
                this@buildCallNotification.getString(R.string.acceptCall),
                this@buildCallNotification.getMainActivityPendingIntent(callExtras)
            )
            .setExtras(bundleOf(CALL_BUNDLE_KEY to getCallDeclinedBundle(callExtras)))
            .build()
    }

    data class CallExtras(
        val channelId: String? = null,
        val serverId: String? = null,
        val conferenceId: String? = null,
        val channelName: String? = null,
        val conferenceJWT: String? = null,
    )
}
