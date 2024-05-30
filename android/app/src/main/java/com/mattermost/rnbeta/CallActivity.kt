package com.mattermost.rnbeta

import android.app.KeyguardManager
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.Build
import android.os.Bundle
import android.view.WindowManager
import androidx.appcompat.app.AppCompatActivity
import androidx.localbroadcastmanager.content.LocalBroadcastManager
import com.mattermost.rnbeta.databinding.ActivityCallBinding

class CallActivity : AppCompatActivity() {

    private val binding: ActivityCallBinding by lazy { ActivityCallBinding.inflate(layoutInflater) }

    private val callManagerModule by lazy { CallManagerModule.getInstance() }
    private val channelId by lazy { intent.getStringExtra("channelId") }
    private val serverId by lazy { intent.getStringExtra("serverId") }
    private val conferenceId by lazy { intent.getStringExtra("conferenceId") }
    private val channelName by lazy { intent.getStringExtra("channelName") }
    private val conferenceJWT by lazy { intent.getStringExtra("conferenceJWT") }

    private val localBroadcastManager by lazy { LocalBroadcastManager.getInstance(this) }

    private val callCanceledReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent) {
            finish()
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) = with(binding) {
        super.onCreate(savedInstanceState)
        setContentView(root)

        configureActivityOverLockScreen()

        idCaller.text = channelName
        answerButton.setOnClickListener {
            callManagerModule?.callAnswered(
                serverId = serverId!!,
                channelId = channelId!!,
                conferenceJWT = conferenceJWT!!
            )
            finish()
        }
        declineButton.setOnClickListener {
            callManagerModule?.callEnded(serverId = serverId!!, conferenceId = conferenceId!!)
            finish()
        }

        localBroadcastManager.registerReceiver(
            callCanceledReceiver,
            IntentFilter(BROADCAST_RECEIVER_CALL_CANCELED_TAG)
        )
    }

    private fun configureActivityOverLockScreen() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
            setShowWhenLocked(true)
            setTurnScreenOn(true)
            val keyguardManager = getSystemService(KEYGUARD_SERVICE) as KeyguardManager
            keyguardManager.requestDismissKeyguard(this, null)
        } else {
            this.window.addFlags(
                WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD or
                        WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED or
                        WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON
            )
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        localBroadcastManager.unregisterReceiver(callCanceledReceiver)
    }

    companion object {
        const val BROADCAST_RECEIVER_CALL_CANCELED_TAG = "CallCanceledReceiver"
    }
}
