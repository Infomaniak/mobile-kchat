package com.mattermost.call

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import com.mattermost.notification.NotificationUtils
import com.mattermost.notification.NotificationUtils.dismissCallNotification

// Used in the call notification pending intent to cancel the call if the user
// press the "Cancel" button
class CancelCallBroadcastReceiver : BroadcastReceiver() {

    private val callManagerModule by lazy { CallManagerModule.getInstance() }

    override fun onReceive(context: Context, intent: Intent) {
        val serverId = intent.getStringExtra(NotificationUtils.INTENT_EXTRA_SERVER_ID_KEY) ?: ""
        val conferenceId =
            intent.getStringExtra(NotificationUtils.INTENT_EXTRA_CONFERENCE_ID_KEY) ?: ""
        context.dismissCallNotification(conferenceId)
        callManagerModule?.callEnded(serverId = serverId, conferenceId = conferenceId)
    }
}
