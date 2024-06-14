package com.mattermost.call

import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Bundle
import com.mattermost.notification.NotificationUtils.CALL_BUNDLE_KEY
import com.mattermost.notification.NotificationUtils.CALL_TYPE_VALUE
import com.mattermost.notification.NotificationUtils.CHANNEL_ID_KEY
import com.mattermost.notification.NotificationUtils.CHANNEL_NAME_KEY
import com.mattermost.notification.NotificationUtils.CONFERENCE_ID_KEY
import com.mattermost.notification.NotificationUtils.CONFERENCE_JWT_KEY
import com.mattermost.notification.NotificationUtils.CallExtras
import com.mattermost.notification.NotificationUtils.NOTIFICATION_TYPE_KEY
import com.mattermost.notification.NotificationUtils.SERVER_ID_KEY
import com.mattermost.rnbeta.MainActivity

object IntentUtils {

    fun getCallDeclinedBundle(notificationExtras: CallExtras): Bundle = with(notificationExtras) {
        return Bundle().apply {
            putString(SERVER_ID_KEY, serverId)
            putString(CONFERENCE_ID_KEY, conferenceId)
        }
    }

    fun Intent.addExtraToIntent(notificationExtras: CallExtras) = with(notificationExtras) {
        putExtra(NOTIFICATION_TYPE_KEY, CALL_TYPE_VALUE)
        putExtra(CHANNEL_ID_KEY, channelId)
        putExtra(SERVER_ID_KEY, serverId)
        putExtra(CONFERENCE_ID_KEY, conferenceId)
        putExtra(CHANNEL_NAME_KEY, channelName)
        putExtra(CONFERENCE_JWT_KEY, conferenceJWT)
    }

    //We have to encapsulate this into a bundle in order for React to open the right page for a call
    private fun Intent.addBundleExtraToIntent(notificationExtras: CallExtras) = with(notificationExtras) {
        putExtra(CALL_BUNDLE_KEY, Bundle().apply {
            putString(NOTIFICATION_TYPE_KEY, CALL_TYPE_VALUE)
            putString(CHANNEL_ID_KEY, channelId)
            putString(SERVER_ID_KEY, serverId)
            putString(CONFERENCE_ID_KEY, conferenceId)
            putString(CHANNEL_NAME_KEY, channelName)
            putString(CONFERENCE_JWT_KEY, conferenceJWT)
        })
    }

    fun Context.getDeclineCallPendingIntent(notificationExtras: CallExtras): PendingIntent {
        val callEventIntent = Intent(this, CancelCallBroadcastReceiver::class.java)
        callEventIntent.addExtraToIntent(notificationExtras)

        return PendingIntent.getBroadcast(
            this,
            0,
            callEventIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_MUTABLE
        )
    }

    fun Context.getMainActivityPendingIntent(callExtras: CallExtras): PendingIntent {
        val mainActivityIntent = getMainActivityIntent(callExtras)

        return PendingIntent.getActivity(
            this,
            0,
            mainActivityIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_MUTABLE
        )
    }

    fun Context.getMainActivityIntent(callExtras: CallExtras): Intent {
        return Intent(this, MainActivity::class.java).apply {
            addExtraToIntent(callExtras)
            addBundleExtraToIntent(callExtras)
        }
    }
}
