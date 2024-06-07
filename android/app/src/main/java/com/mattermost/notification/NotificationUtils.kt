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
import com.mattermost.call.CancelCallBroadcastReceiver
import com.mattermost.rnbeta.MainActivity
import com.mattermost.rnbeta.R

object NotificationUtils {

    const val NOTIFICATION_TYPE_KEY = "type"
    const val NOTIFICATION_TYPE_JOINED_CALL_VALUE = "joined_call"
    const val NOTIFICATION_TYPE_CANCEL_CALL_VALUE = "cancel_call"

    const val NOTIFICATION_ACK_ID_KEY = "ack_id"
    const val NOTIFICATION_POST_ID_KEY = "post_id"

    const val NOTIFICATION_CHANNEL_ID_KEY = "channel_id"
    const val NOTIFICATION_SERVER_ID_KEY = "server_id"
    const val NOTIFICATION_SERVER_URL_KEY = "server_url"
    const val NOTIFICATION_CONFERENCE_ID_KEY = "conference_id"
    const val NOTIFICATION_CHANNEL_NAME_KEY = "channel_name"
    const val NOTIFICATION_CONFERENCE_JWT_KEY = "conference_jwt"

    const val INTENT_EXTRA_CHANNEL_ID_KEY = "channelId"
    const val INTENT_EXTRA_SERVER_ID_KEY = "serverId"
    const val INTENT_EXTRA_CONFERENCE_ID_KEY = "conferenceId"
    const val INTENT_EXTRA_CHANNEL_NAME_KEY = "channelName"
    const val INTENT_EXTRA_CONFERENCE_JWT_KEY = "conferenceJWT"

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
        notificationExtras: NotificationExtras
    ): Notification {
        val contentIntent = Intent(this, MainActivity::class.java)
        val contentPendingIntent =
            PendingIntent.getActivity(
                this,
                0,
                contentIntent,
                PendingIntent.FLAG_IMMUTABLE
            )

        val fullScreenIntent = Intent(this, CallActivity::class.java)
        addExtrasToIntent(fullScreenIntent, notificationExtras)
        val fullScreenPendingIntent =
            PendingIntent.getActivity(
                this,
                0,
                fullScreenIntent,
                PendingIntent.FLAG_IMMUTABLE
            )

        return buildCallNotification(
            contentPendingIntent,
            fullScreenPendingIntent,
            notificationExtras
        )
    }

    @JvmStatic
    fun Context.dismissCallNotification(canceledConferenceIdCall: String) {
        val notificationManagerCompat = NotificationManagerCompat.from(this)
        notificationManagerCompat.activeNotifications.forEach { statusBarNotification ->
            val notificationExtras = statusBarNotification.notification.extras
            notificationExtras.getString(NOTIFICATION_CONFERENCE_ID_KEY)?.let { conferenceId ->
                if (conferenceId == canceledConferenceIdCall) {
                    notificationManagerCompat.cancel(statusBarNotification.id)
                    return
                }
            }
        }
    }

    private fun Context.buildCallNotification(
        contentPendingIntent: PendingIntent,
        fullScreenPendingIntent: PendingIntent,
        notificationExtras: NotificationExtras
    ): Notification = with(notificationExtras) {
        return NotificationCompat.Builder(this@buildCallNotification, CHANNEL_ID_CALL)
            .setSmallIcon(R.drawable.ic_kchat_notification)
            .setContentTitle(
                this@buildCallNotification.getString(
                    R.string.notificationCallFrom,
                    channelName
                )
            )
            .setAutoCancel(false)
            .setContentIntent(contentPendingIntent)
            .setFullScreenIntent(fullScreenPendingIntent, true)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setCategory(NotificationCompat.CATEGORY_CALL)
            .addAction(
                R.drawable.ic_decline,
                this@buildCallNotification.getString(R.string.declineCall),
                getDeclineCallPendingIntent(notificationExtras)
            )
            .addAction(
                R.drawable.ic_accept,
                this@buildCallNotification.getString(R.string.acceptCall),
                getMainActivityPendingIntent(notificationExtras)
            )
            .setExtras(bundleOf(NOTIFICATION_CONFERENCE_ID_KEY to conferenceId))
            .build()
    }

    private fun addExtrasToIntent(
        intent: Intent,
        notificationExtras: NotificationExtras
    ) = with(notificationExtras) {
        intent.putExtra(INTENT_EXTRA_CHANNEL_ID_KEY, channelId)
        intent.putExtra(INTENT_EXTRA_SERVER_ID_KEY, serverId)
        intent.putExtra(INTENT_EXTRA_CONFERENCE_ID_KEY, conferenceId)
        intent.putExtra(INTENT_EXTRA_CHANNEL_NAME_KEY, channelName)
        intent.putExtra(INTENT_EXTRA_CONFERENCE_JWT_KEY, conferenceJWT)
    }

    private fun Context.getDeclineCallPendingIntent(
        notificationExtras: NotificationExtras
    ): PendingIntent {
        val callEventIntent = Intent(this, CancelCallBroadcastReceiver::class.java)
        addExtrasToIntent(callEventIntent, notificationExtras)

        return PendingIntent.getBroadcast(
            this,
            0,
            callEventIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_MUTABLE
        )
    }

    private fun Context.getMainActivityPendingIntent(
        notificationExtras: NotificationExtras
    ): PendingIntent {
        val intent = Intent(this@getMainActivityPendingIntent, MainActivity::class.java)
        addExtrasToIntent(intent, notificationExtras)

        return PendingIntent.getActivity(
            this@getMainActivityPendingIntent,
            0,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_MUTABLE
        )
    }

    data class NotificationExtras(
        val channelId: String? = null,
        val serverId: String? = null,
        val conferenceId: String? = null,
        val channelName: String? = null,
        val conferenceJWT: String? = null,
    )
}
