package com.mattermost.call

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import com.mattermost.call.NetworkUtils.cancelCall
import com.mattermost.notification.NotificationUtils
import com.mattermost.notification.NotificationUtils.dismissCallNotification

// Used in the call notification pending intent to cancel the call if the user
// press the "Cancel" button
class CancelCallBroadcastReceiver : BroadcastReceiver() {

    private val callManagerModule by lazy { CallManagerModule.getInstance() }

    override fun onReceive(context: Context, intent: Intent) {
        intent.extras?.let { callBundle ->
            val serverId = callBundle.getString(NotificationUtils.SERVER_ID_KEY) ?: ""
            val conferenceId = callBundle.getString(NotificationUtils.CONFERENCE_ID_KEY) ?: ""
            context.dismissCallNotification(conferenceId)
            cancelCall(serverId, conferenceId)
            callManagerModule?.callEnded(serverId = serverId, conferenceId = conferenceId)
        }
    }
}
