package com.mattermost.call

import android.app.KeyguardManager
import android.app.KeyguardManager.KeyguardDismissCallback
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.Build
import android.os.Bundle
import android.view.WindowManager
import androidx.appcompat.app.AppCompatActivity
import androidx.localbroadcastmanager.content.LocalBroadcastManager
import com.mattermost.call.IntentUtils.getMainActivityIntent
import com.mattermost.call.IntentUtils.getMainActivityPendingIntent
import com.mattermost.notification.NotificationUtils
import com.mattermost.notification.NotificationUtils.dismissCallNotification
import com.mattermost.rnbeta.*
import com.mattermost.rnbeta.databinding.ActivityCallBinding

class CallActivity : AppCompatActivity() {

    private val binding by lazy { ActivityCallBinding.inflate(layoutInflater) }

    private val callManagerModule by lazy { CallManagerModule.getInstance() }
    private val conferenceId by lazy {
        intent.getStringExtra(NotificationUtils.INTENT_EXTRA_CONFERENCE_ID_KEY)
    }
    private val channelName by lazy {
        intent.getStringExtra(NotificationUtils.INTENT_EXTRA_CHANNEL_NAME_KEY)
    }
    private val channelId by lazy {
        intent.getStringExtra(NotificationUtils.INTENT_EXTRA_CHANNEL_ID_KEY)
    }
    private val serverId by lazy {
        intent.getStringExtra(NotificationUtils.INTENT_EXTRA_SERVER_ID_KEY)
    }
    private val conferenceJWT by lazy {
        intent.getStringExtra(NotificationUtils.INTENT_EXTRA_CONFERENCE_JWT_KEY)
    }

    private val localBroadcastManager by lazy { LocalBroadcastManager.getInstance(this) }
    private val keyguardManager by lazy { getSystemService(KEYGUARD_SERVICE) as KeyguardManager }

    private val dismissCallReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent) {
            val eventConferenceId = intent.getStringExtra(
                NotificationUtils.INTENT_EXTRA_CONFERENCE_ID_KEY
            ) ?: ""

            if (eventConferenceId == conferenceId) {
                finish()
            }
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) = with(binding) {
        super.onCreate(savedInstanceState)
        setContentView(binding.root)

        configureActivityOverLockScreen()

        idCaller.text = channelName
        answerButton.setOnClickListener {
            conferenceId?.let { dismissCallNotification(it) }
            if (keyguardManager.isKeyguardLocked) askToUnlockPhone() else acceptCall()
        }
        declineButton.setOnClickListener {
            conferenceId?.let { dismissCallNotification(it) }
            callManagerModule?.callEnded(serverId = serverId!!, conferenceId = conferenceId!!)
            finish()
        }

        localBroadcastManager.registerReceiver(
            dismissCallReceiver,
            IntentFilter(BROADCAST_RECEIVER_DISMISS_CALL_TAG)
        )
    }

    @Suppress("DEPRECATION")
    private fun configureActivityOverLockScreen() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
            setShowWhenLocked(true)
            setTurnScreenOn(true)
        } else {
            window.addFlags(
                WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD or
                        WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED or
                        WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON
            )
        }
    }

    private fun askToUnlockPhone() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
            keyguardManager.requestDismissKeyguard(this, object : KeyguardDismissCallback() {
                override fun onDismissSucceeded() {
                    super.onDismissSucceeded()
                    acceptCall()
                }
            })
        }
    }

    private fun acceptCall() {
        val callExtras = NotificationUtils.CallExtras(
            channelId,
            serverId,
            conferenceId,
            channelName,
            conferenceJWT
        )
        startActivity(getMainActivityIntent(callExtras))
        /*callManagerModule?.callAnswered(
            serverId = serverId!!,
            channelId = channelId!!,
            conferenceJWT = conferenceJWT!!
        )*/
        finish()
    }

    override fun onDestroy() {
        super.onDestroy()
        localBroadcastManager.unregisterReceiver(dismissCallReceiver)
    }

    companion object {
        const val BROADCAST_RECEIVER_DISMISS_CALL_TAG = "DismissCall"
    }
}
