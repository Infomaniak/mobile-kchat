package com.mattermost.call

import com.facebook.react.bridge.Arguments
import com.mattermost.helpers.DatabaseHelper
import com.mattermost.helpers.Network
import com.mattermost.helpers.ResolvePromise
import com.mattermost.helpers.database_extension.getServerUrlForIdentifier

object NetworkUtils {

    fun cancelCall(serverId: String, conferenceId: String) {
        val headers = Arguments.createMap()
        headers.putString("Content-Type", "application/json")
        val options = Arguments.createMap()
        options.putMap("headers", headers)

        val serverUrl = DatabaseHelper.instance?.getServerUrlForIdentifier(serverId)
        Network.post(serverUrl, "/api/v4/conferences/${conferenceId}/decline", options, ResolvePromise())
    }
}
