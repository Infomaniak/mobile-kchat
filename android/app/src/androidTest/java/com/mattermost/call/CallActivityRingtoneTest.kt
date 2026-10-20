package com.mattermost.call

import android.content.Context
import android.content.Intent
import android.media.AudioAttributes
import android.media.AudioManager
import android.os.Build
import android.os.SystemClock
import androidx.test.platform.app.InstrumentationRegistry
import org.junit.After
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Assume
import org.junit.Before
import org.junit.Test

/**
 * Regression tests for the incoming-call ringtone of CallActivity.
 *
 * The ringtone must be played on the ring stream (USAGE_NOTIFICATION_RINGTONE),
 * never on the media stream (USAGE_UNKNOWN), so that vibrate mode and
 * Do-Not-Disturb mute it like any other ringtone.
 */
class CallActivityRingtoneTest {

    private val instrumentation = InstrumentationRegistry.getInstrumentation()
    private val audioManager =
        instrumentation.targetContext.getSystemService(Context.AUDIO_SERVICE) as AudioManager

    @Before
    fun setUp() {
        Assume.assumeTrue(
            "getActivePlaybackConfigurations requires API 26 (app minSdk is 24)",
            Build.VERSION.SDK_INT >= Build.VERSION_CODES.O
        )
    }

    @After
    fun tearDown() {
        audioManager.ringerMode = AudioManager.RINGER_MODE_NORMAL
    }

    @Test
    fun shouldRouteRingtoneToRingStreamWhenRingerIsNormal() {
        audioManager.ringerMode = AudioManager.RINGER_MODE_NORMAL
        val activity = instrumentation.startActivitySync(callActivityIntent())

        try {
            val usages = eventuallyWithUsage(AudioAttributes.USAGE_NOTIFICATION_RINGTONE)
            assertTrue(
                "Ringtone playback expected with USAGE_NOTIFICATION_RINGTONE, got usages=$usages",
                usages.contains(AudioAttributes.USAGE_NOTIFICATION_RINGTONE)
            )
            assertFalse(
                "Ringtone must not be played as media (USAGE_UNKNOWN), got usages=$usages",
                usages.contains(AudioAttributes.USAGE_UNKNOWN)
            )
        } finally {
            activity.finish()
        }
    }

    @Test
    fun shouldNotPlayRingtoneWhenRingerIsVibrate() {
        audioManager.ringerMode = AudioManager.RINGER_MODE_VIBRATE
        val activity = instrumentation.startActivitySync(callActivityIntent())

        try {
            val deadline = SystemClock.elapsedRealtime() + OBSERVE_WINDOW_MS
            while (SystemClock.elapsedRealtime() < deadline) {
                val usages = activeUsages()
                assertFalse(
                    "No ringtone playback expected in vibrate mode, got usages=$usages",
                    usages.contains(AudioAttributes.USAGE_NOTIFICATION_RINGTONE) ||
                        usages.contains(AudioAttributes.USAGE_UNKNOWN)
                )
                SystemClock.sleep(200)
            }
        } finally {
            activity.finish()
        }
    }

    private fun callActivityIntent(): Intent {
        val context = instrumentation.targetContext
        return Intent(context, CallActivity::class.java)
            .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
    }

    private fun activeUsages(): Set<Int> =
        audioManager.activePlaybackConfigurations
            .map { it.audioAttributes.usage }
            .toSet()

    /**
     * Polls active playback usages until the target usage appears or the timeout
     * expires, then returns the last observed usage set.
     */
    private fun eventuallyWithUsage(targetUsage: Int, timeoutMs: Long = 5_000): Set<Int> {
        val deadline = SystemClock.elapsedRealtime() + timeoutMs
        var usages = activeUsages()
        while (!usages.contains(targetUsage) && SystemClock.elapsedRealtime() < deadline) {
            SystemClock.sleep(200)
            usages = activeUsages()
        }
        return usages
    }

    private companion object {
        const val OBSERVE_WINDOW_MS = 5_000L
    }
}
