package com.mattermost.call

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableMap
import com.mattermost.helpers.DatabaseHelper
import com.mattermost.helpers.Network
import com.mattermost.helpers.ResolvePromise
import com.mattermost.helpers.database_extension.getServerUrlForIdentifier
import java.io.IOException
import kotlin.coroutines.suspendCoroutine

object NetworkUtils {

    fun cancelCall(serverId: String, conferenceId: String) {
        val serverUrl = DatabaseHelper.instance?.getServerUrlForIdentifier(serverId)
        Network.post(
            serverUrl,
            "/api/v4/conferences/${conferenceId}/decline",
            getOptions(),
            ResolvePromise()
        )
    }

    suspend fun getUserIdFromConference(serverId: String, conferenceId: String): String? {
        return suspendCoroutine { cont ->
            val serverUrl = DatabaseHelper.instance?.getServerUrlForIdentifier(serverId)
            Network.get(
                serverUrl,
                "/api/v4/conferences/$conferenceId",
                getOptions(),
                object : ResolvePromise() {
                    override fun resolve(value: Any?) {
                        val response = value as ReadableMap?
                        if (response != null && !response.getBoolean("ok")) {
                            val error = response.getMap("data")
                            val exception = IOException("Unexpected code ${error?.getInt("status_code")} ${error?.getString("message")}")
                            cont.resumeWith(Result.failure(exception))
                        } else {
                            val userId = response?.getMap("data")?.getString("user_id")
                            cont.resumeWith(Result.success(userId))
                        }
                    }
                }
            )
        }
    }

    suspend fun getUserImage(serverId: String, userId: String): ByteArray {
        return suspendCoroutine { cont ->
            val serverUrl = DatabaseHelper.instance?.getServerUrlForIdentifier(serverId)
            val response = Network.getSync(serverUrl, "/api/v4/users/$userId/image", getOptions())
            if (response.code == 200) {
                cont.resumeWith(Result.success(response.body!!.bytes()))
            } else {
                cont.resumeWith(Result.failure((IOException("Unexpected code ${response.code} ${response.message}"))))
            }
        }
    }

    private fun getOptions(): WritableMap {
        val headers = Arguments.createMap()
        headers.putString("Content-Type", "application/json")
        val options = Arguments.createMap()
        options.putMap("headers", headers)

        return options
    }
}
