package com.mattermost.call

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import androidx.core.app.NotificationManagerCompat

class DeclineCallBroadcastReceiver : BroadcastReceiver() {

    private val callManagerModule by lazy { CallManagerModule.getInstance() }

    override fun onReceive(context: Context, intent: Intent) {
        val serverId = intent.getStringExtra("serverId")
        val conferenceId = intent.getStringExtra("conferenceId")
        callManagerModule?.callEnded(serverId = serverId!!, conferenceId = conferenceId!!)
        NotificationManagerCompat.from(context).cancel(-1)
    }
}
