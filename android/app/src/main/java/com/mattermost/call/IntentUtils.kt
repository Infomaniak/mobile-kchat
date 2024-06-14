package com.mattermost.call

import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import com.mattermost.notification.NotificationUtils.INTENT_EXTRA_CHANNEL_ID_KEY
import com.mattermost.notification.NotificationUtils.INTENT_EXTRA_CHANNEL_NAME_KEY
import com.mattermost.notification.NotificationUtils.INTENT_EXTRA_CONFERENCE_ID_KEY
import com.mattermost.notification.NotificationUtils.INTENT_EXTRA_CONFERENCE_JWT_KEY
import com.mattermost.notification.NotificationUtils.INTENT_EXTRA_SERVER_ID_KEY
import com.mattermost.notification.NotificationUtils.CallExtras
import com.mattermost.rnbeta.MainActivity

object IntentUtils {

    fun Intent.addExtrasToIntent(notificationExtras: CallExtras) = with(notificationExtras) {
        putExtra(INTENT_EXTRA_CHANNEL_ID_KEY, channelId)
        putExtra(INTENT_EXTRA_SERVER_ID_KEY, serverId)
        putExtra(INTENT_EXTRA_CONFERENCE_ID_KEY, conferenceId)
        putExtra(INTENT_EXTRA_CHANNEL_NAME_KEY, channelName)
        putExtra(INTENT_EXTRA_CONFERENCE_JWT_KEY, conferenceJWT)
    }

    fun Context.getDeclineCallPendingIntent(notificationExtras: CallExtras): PendingIntent {
        val callEventIntent = Intent(this, CancelCallBroadcastReceiver::class.java)
        callEventIntent.addExtrasToIntent(notificationExtras)

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
            //addExtrasToIntent(callExtras)
        }
    }
}
