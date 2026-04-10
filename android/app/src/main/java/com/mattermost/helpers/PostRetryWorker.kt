package com.mattermost.helpers

import android.content.Context
import android.database.Cursor
import android.util.Log
import androidx.work.Constraints
import androidx.work.ExistingWorkPolicy
import androidx.work.NetworkType
import androidx.work.OneTimeWorkRequestBuilder
import androidx.work.WorkManager
import androidx.work.Worker
import androidx.work.WorkerParameters
import com.mattermost.helpers.database_extension.getServerUrlForIdentifier
import com.mattermost.helpers.database_extension.getDatabaseForServer
import com.nozbe.watermelondb.WMDatabase
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONArray
import org.json.JSONException
import org.json.JSONObject
import java.io.IOException

class PostRetryWorker(private val context: Context, workerParameters: WorkerParameters) : Worker(context, workerParameters) {
    companion object {
        const val UNIQUE_WORK_NAME = "post_retry_worker"
        const val TAG = "PostRetryWorker"
        const val MAX_RETRIES = 5
        const val BASE_DELAY_SECONDS = 10L

        fun enqueue(context: Context) {
            val constraints = Constraints.Builder()
                .setRequiredNetworkType(NetworkType.CONNECTED)
                .build()

            val workRequest = OneTimeWorkRequestBuilder<PostRetryWorker>()
                .setConstraints(constraints)
                .addTag(UNIQUE_WORK_NAME)
                .build()

            WorkManager.getInstance(context).enqueueUniqueWork(
                UNIQUE_WORK_NAME,
                ExistingWorkPolicy.REPLACE,
                workRequest
            )

            Log.d(TAG, "Enqueued post retry worker")
        }
    }

    private val jsonType = "application/json; charset=utf-8".toMediaTypeOrNull()
    private val okHttpClient: OkHttpClient = OkHttpClient.Builder().build()

    override fun doWork(): Result {
        Log.d(TAG, "Starting post retry work")

        try {
            DatabaseHelper.instance?.init(context)
            val database = DatabaseHelper.instance?.defaultDatabase

            if (database == null) {
                Log.e(TAG, "Database not available")
                return Result.retry()
            }

            val pendingPosts = getPendingOrFailedPosts(database)

            if (pendingPosts.isEmpty()) {
                Log.d(TAG, "No pending posts to retry")
                return Result.success()
            }

            Log.d(TAG, "Found ${pendingPosts.size} pending posts to retry")

            var successCount = 0
            var failureCount = 0
            var skippedCount = 0

            for (post in pendingPosts) {
                // Skip posts that have exceeded max retries
                if (post.retryCount >= MAX_RETRIES) {
                    Log.d(TAG, "Post ${post.id} exceeded max retries ($MAX_RETRIES), skipping")
                    skippedCount++
                    continue
                }

                val result = retryPost(database, post)
                if (result) {
                    successCount++
                } else {
                    failureCount++
                }
            }

            Log.d(TAG, "Retry complete. Success: $successCount, Failed: $failureCount, Skipped: $skippedCount")

            Log.d(TAG, "Retry complete. Success: $successCount, Failed: $failureCount")

            return if (failureCount > 0) {
                Result.retry()
            } else {
                Result.success()
            }

        } catch (e: Exception) {
            Log.e(TAG, "Error during post retry work", e)
            return Result.retry()
        }
    }

    private data class PendingPost(
        val id: String,
        val channelId: String,
        val message: String,
        val userId: String,
        val rootId: String,
        val serverId: String?,
        val props: String,
        val failed: Boolean,
        val retryCount: Int
    )

    private fun getPendingOrFailedPosts(db: WMDatabase): List<PendingPost> {
        val posts = mutableListOf<PendingPost>()

        try {
            // Query for posts where pending_post_id is not empty and equals id
            // This indicates a post that hasn't been confirmed by the server
            // Note: Each post's server is determined by its channel - we fetch the server 
            // associated with the active database context
            val query = """
                SELECT p.id, p.channel_id, p.message, p.user_id, p.root_id, p.props
                FROM Post p
                JOIN Channel c ON p.channel_id = c.id
                WHERE p.pending_post_id != '' 
                AND p.pending_post_id = p.id
                AND p.delete_at = 0
                ORDER BY p.create_at ASC
                LIMIT 10
            """.trimIndent()

            db.rawQuery(query).use { cursor ->
                while (cursor.moveToNext()) {
                    val props = cursor.getStringOrNull(5) ?: "{}"
                    val failed = isPostFailed(props)
                    val retryCount = getRetryCount(props)
                    val channelId = cursor.getString(1)

                    posts.add(
                        PendingPost(
                            id = cursor.getString(0),
                            channelId = channelId,
                            message = cursor.getStringOrNull(2) ?: "",
                            userId = cursor.getString(3),
                            rootId = cursor.getStringOrNull(4) ?: "",
                            serverId = getServerIdForChannel(db, channelId),
                            props = props,
                            failed = failed,
                            retryCount = retryCount
                        )
                    )
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error querying pending posts", e)
        }

        return posts
    }

    private fun isPostFailed(props: String): Boolean {
        return try {
            val propsJson = JSONObject(props)
            propsJson.optBoolean("failed", false)
        } catch (e: JSONException) {
            false
        }
    }

    private fun getRetryCount(props: String): Int {
        return try {
            val propsJson = JSONObject(props)
            propsJson.optInt("retry_count", 0)
        } catch (e: JSONException) {
            0
        }
    }

    private fun getServerIdForChannel(db: WMDatabase, channelId: String): String? {
        return try {
            // Get the active server for this post
            // We check which server database contains this channel
            val query = "SELECT url FROM Servers WHERE last_active_at != 0 AND identifier != '' LIMIT 1"
            db.rawQuery(query).use { cursor ->
                if (cursor.count > 0 && cursor.moveToFirst()) {
                    val serverUrl = cursor.getString(0)
                    // For the server database, we need to open it
                    // The server db is named with the serverId
                    getServerIdFromUrl(context, serverUrl)
                } else {
                    null
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error getting server id", e)
            null
        }
    }

    private fun getServerIdFromUrl(context: Context, serverUrl: String): String? {
        return try {
            val databaseName = "app.db"
            val db = DatabaseHelper.instance?.defaultDatabase
            val query = "SELECT identifier FROM Servers WHERE url = ? AND last_active_at != 0"
            db?.rawQuery(query, arrayOf(serverUrl))?.use { cursor ->
                if (cursor.count > 0 && cursor.moveToFirst()) {
                    cursor.getString(0)
                } else {
                    null
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error getting server id from url", e)
            null
        }
    }

    private fun retryPost(db: WMDatabase, post: PendingPost): Boolean {
        return try {
            val serverUrl = post.serverId?.let { 
                DatabaseHelper.instance?.getServerUrlForIdentifier(it) 
            } ?: DatabaseHelper.instance?.onlyServerUrl

            if (serverUrl == null) {
                Log.e(TAG, "No server url found for post ${post.id}")
                return false
            }

            val token = Credentials.getCredentialsForServerSync(context, serverUrl)
            if (token == null) {
                Log.e(TAG, "No credentials found for server $serverUrl")
                return false
            }

            val postData = JSONObject().apply {
                put("id", post.id)
                put("channel_id", post.channelId)
                put("message", post.message)
                put("user_id", post.userId)
                if (post.rootId.isNotEmpty()) {
                    put("root_id", post.rootId)
                }
                put("pending_post_id", post.id)
            }

            val body = postData.toString().toRequestBody(jsonType)
            val request = Request.Builder()
                .header("Authorization", "Bearer $token")
                .header("Content-Type", "application/json")
                .url("$serverUrl/api/v4/posts")
                .post(body)
                .build()

            okHttpClient.newCall(request).execute().use { response ->
                val responseBody = response.body?.string()

                return if (response.isSuccessful) {
                    Log.d(TAG, "Successfully retried post ${post.id}")
                    // Update the post in database to reflect it was sent
                    updatePostAfterSuccess(db, post, responseBody)
                    true
                } else {
                    Log.e(TAG, "Failed to retry post ${post.id}: ${response.code}")
                    updatePostAfterFailure(db, post)
                    false
                }
            }

        } catch (e: IOException) {
            Log.e(TAG, "Network error retrying post ${post.id}", e)
            false
        } catch (e: JSONException) {
            Log.e(TAG, "JSON error retrying post ${post.id}", e)
            false
        } catch (e: Exception) {
            Log.e(TAG, "Unexpected error retrying post ${post.id}", e)
            false
        }
    }

    private fun updatePostAfterSuccess(db: WMDatabase, post: PendingPost, responseBody: String?) {
        try {
            // Parse the server response to get the real post id
            val serverPost = responseBody?.let { JSONObject(it) }
            val realPostId = serverPost?.optString("id", post.id) ?: post.id

            // Update the post - clear the pending_post_id to mark it as confirmed
            // and update the id with the real server id if different
            val updateQuery = """
                UPDATE Post 
                SET pending_post_id = '',
                    id = ?,
                    update_at = ?,
                    _status = 'updated',
                    props = ?
                WHERE id = ?
            """.trimIndent()

            // Clear the failed flag from props
            val newProps = JSONObject(post.props).apply {
                remove("failed")
            }.toString()

            db.execute(updateQuery, arrayOf(
                realPostId,
                System.currentTimeMillis(),
                newProps,
                post.id
            ))

            Log.d(TAG, "Updated post ${post.id} -> $realPostId after successful retry")

        } catch (e: Exception) {
            Log.e(TAG, "Error updating post after success", e)
        }
    }

    private fun updatePostAfterFailure(db: WMDatabase, post: PendingPost) {
        try {
            // Update props to mark as failed and increment retry count
            val newRetryCount = post.retryCount + 1
            val newProps = try {
                JSONObject(post.props).apply {
                    put("failed", true)
                    put("retry_count", newRetryCount)
                }.toString()
            } catch (e: JSONException) {
                "{\"failed\":true,\"retry_count\":$newRetryCount}"
            }

            val updateQuery = """
                UPDATE Post 
                SET props = ?,
                    _status = 'updated'
                WHERE id = ?
            """.trimIndent()

            db.execute(updateQuery, arrayOf(newProps, post.id))
            Log.d(TAG, "Updated post ${post.id} after failure, retry_count: $newRetryCount")

        } catch (e: Exception) {
            Log.e(TAG, "Error updating post after failure", e)
        }
    }

    private fun Cursor.getStringOrNull(index: Int): String? {
        return if (isNull(index)) null else getString(index)
    }
}
