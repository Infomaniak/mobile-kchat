package com.mattermost.helpers.push_notification

import android.util.Log
import com.facebook.react.bridge.ReadableMap
import com.mattermost.helpers.Network
import com.mattermost.helpers.PushNotificationDataRunnable
import com.mattermost.helpers.ResolvePromise

import java.io.IOException

import kotlin.coroutines.suspendCoroutine

internal suspend fun PushNotificationDataRunnable.Companion.fetch(serverUrl: String, endpoint: String): ReadableMap? {
    return suspendCoroutine { cont ->
        Network.get(serverUrl, endpoint, null, object : ResolvePromise() {
            override fun resolve(value: Any?) {
                val response = value as? ReadableMap

                response?.takeUnless { it.getBoolean("ok") }?.let { res ->
                    val error = res.getMap("data")

                    val statusCode = runCatching {
                        error?.takeIf { it.hasKey("status_code") }?.getInt("status_code")
                    }.getOrElse {
                        Log.w(
                            "PushNotificationFetch",
                            "Missing or invalid 'status_code' in response from $serverUrl/$endpoint\nFull response: $response"
                        )
                        -1
                    }

                    val message = runCatching {
                        error?.takeIf { it.hasKey("message") }?.getString("message")
                    }.getOrDefault("Unknown error")

                    cont.resumeWith(Result.failure(IOException("Unexpected code $statusCode $message")))
                    return
                }

                cont.resumeWith(Result.success(response))
            }
            override fun reject(code: String, message: String?) {
                cont.resumeWith(Result.failure(IOException("Unexpected code $code $message")))
            }

            override fun reject(throwable: Throwable) {
                cont.resumeWith(Result.failure(IOException("Unexpected code $throwable")))
            }
        })
    }
}

internal suspend fun PushNotificationDataRunnable.Companion.fetchWithPost(serverUrl: String, endpoint: String, options: ReadableMap?) : ReadableMap? {
    return suspendCoroutine { cont ->
        Network.post(serverUrl, endpoint, options, object : ResolvePromise() {
            override fun resolve(value: Any?) {
                val response = value as ReadableMap?
                cont.resumeWith(Result.success(response))
            }

            override fun reject(code: String, message: String?) {
                cont.resumeWith(Result.failure(IOException("Unexpected code $code $message")))
            }

            override fun reject(throwable: Throwable) {
                cont.resumeWith(Result.failure(IOException("Unexpected code $throwable")))
            }
        })
    }
}
