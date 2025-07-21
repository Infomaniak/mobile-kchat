//
//  File.swift
//
//
//  Created by Elias Nahum on 26-06-22.
//

import Foundation
import os.log

extension ShareExtension {
    func getImportDirectory() -> URL? {
        guard let appGroupId,
              let sharedContainer = FileManager.default.containerURL(forSecurityApplicationGroupIdentifier: appGroupId) else {
            return nil
        }
        let importDirectory = sharedContainer.appendingPathComponent("imports", isDirectory: true)
        try? FileManager.default.createDirectory(at: importDirectory, withIntermediateDirectories: true)
        return importDirectory
    }
    
    public func uploadFiles(serverUrl: String, channelId: String, message: String,
                            files: [String], completionHandler: @escaping () -> Void) -> String? {
        let id = "mattermost-share-upload-\(UUID().uuidString)"
        
        createUploadSessionData(
            id: id, serverUrl: serverUrl,
            channelId: channelId, message: message,
            files: files
        )
        
        guard let token = try? Keychain.default.getToken(for: serverUrl) else { return "Could not retrieve the session token from the KeyChain" }

        if !files.isEmpty {
            createBackroundSession(id: id)
            os_log(
                OSLogType.default,
                "Mattermost BackgroundSession: uploading %{public}@ files for identifier=%{public}@",
                String(files.count),
                id
            )
            for file in files {
                if let fileUrl = URL(string: file),
                   fileUrl.isFileURL,
                   let filename = fileUrl.lastPathComponent.addingPercentEncoding(withAllowedCharacters: .urlPathAllowed),
                   let temporaryURL = getImportDirectory()?.appendingPathComponent(UUID().uuidString) {
                    if let url = URL(string: "\(serverUrl)/api/v4/files?channel_id=\(channelId)&filename=\(filename)&client_ids=\(UUID().uuidString)") {
                        var uploadRequest = URLRequest(url: url)
                        uploadRequest.httpMethod = "POST"
                        uploadRequest.addValue("Bearer \(token)", forHTTPHeaderField: "Authorization")

                        let boundary = UUID().uuidString
                        uploadRequest.setValue("multipart/form-data; boundary=\(boundary)", forHTTPHeaderField: "Content-Type")
                        
                        let fileData = try? Data(contentsOf: fileUrl)
                        var data = Data()
                        // Add the file data to the raw http request data
                        data.append("--\(boundary)\r\n".data(using: .utf8)!)
                        data.append("Content-Disposition: form-data; name=\"files\"; filename=\"\(filename)\"\r\n\r\n".data(using: .utf8)!)
                        data.append(fileData!)
                        data.append("\r\n--\(boundary)--\r\n".data(using: .utf8)!)
                        // do not forget to set the content-length!
                        uploadRequest.setValue(String(data.count), forHTTPHeaderField: "Content-Length")
                        
                        do {
                            try data.write(to: temporaryURL)
                        } catch {
                            print("Error writing request file")
                        }

                        if let task = backgroundSession?.uploadTask(
                            with: uploadRequest,
                            fromFile: temporaryURL
                        ) {
                            task.resume()
                        } else {
                            os_log(
                                OSLogType.default,
                                "Mattermost BackgroundSession: Task not created to upload file %{public}@ for identifier=%{public}@",
                                filename,
                                id
                            )
                        }
                    } else {
                        os_log(
                            OSLogType.default,
                            "Mattermost BackgroundSession: The file %{public}@ for identifier=%{public}@ could not be processed for upload",
                            filename,
                            id
                        )
                        return "The file \(filename) could not be processed for upload"
                    }
                } else {
                    os_log(
                        OSLogType.default,
                        "Mattermost BackgroundSession: File %{public}@ for identifier=%{public}@ not found or is not a valid URL",
                        file,
                        id
                    )
                    return "File not found \(file)"
                }
            }
            completionHandler()
        } else if !message.isEmpty {
            os_log(
                OSLogType.default,
                "Mattermost BackgroundSession: posting message for identifier=%{public}@ without files",
                id
            )
            self.postMessageForSession(withId: id, completionHandler: completionHandler)
        }
        
        return nil
    }
    
    func postMessageForSession(withId id: String, completionHandler: (() -> Void)? = nil) {
        guard let data = getUploadSessionData(id: id)
        else {
            os_log(
                OSLogType.default,
                "Mattermost BackgroundSession: postMessageForSession fail to get data for identifier=%{public}@",
                id
            )
            return
        }
        
        self.removeUploadSessionData(id: id)
        self.deleteUploadedFiles(files: data.files)
        
        if let serverUrl = data.serverUrl,
           let channelId = data.channelId {
            Network.default.createPost(
                serverUrl: serverUrl,
                channelId: channelId,
                message: data.message,
                fileIds: data.fileIds,
                completionHandler: {info, reponse, error in
                    if let err = error {
                        os_log(
                            "Mattermost BackgroundSession: error to create post for session identifier=%{public}@ -- %{public}@",
                            log: .default,
                            type: .error,
                            id,
                            err.localizedDescription
                        )
                    }
                    
                    if let handler = completionHandler {
                        os_log(
                            OSLogType.default,
                            "Mattermost BackgroundSession: postMessageForSession without files call completionHandler for identifier=%{public}@",
                            id
                        )
                        handler()
                    }
                }
            )
        }
    }
}
