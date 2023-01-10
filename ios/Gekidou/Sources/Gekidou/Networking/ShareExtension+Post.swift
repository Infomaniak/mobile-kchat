//
//  File.swift
//  
//
//  Created by Elias Nahum on 26-06-22.
//

import Foundation
import os.log

extension ShareExtension {
    public func uploadFiles(serverUrl: String, channelId: String, message: String,
files: [String], completionHandler: @escaping () -> Void) {
        let id = "mattermost-share-upload-\(UUID().uuidString)"
        
        createUploadSessionData(
            id: id, serverUrl: serverUrl,
            channelId: channelId, message: message,
            files: files
        )

        if !files.isEmpty {
            createBackroundSession(id: id)
            for file in files {
                if let fileUrl = URL(string: file),
                   fileUrl.isFileURL {
                    let filename = fileUrl.lastPathComponent
                    
                    if let url = URL(string: "\(serverUrl)/api/v4/files?channel_id=\(channelId)&filename=\(filename)&client_ids=\(UUID().uuidString)"),
                       let token = try? Keychain.default.getToken(for: serverUrl) {
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
                        
                        let temporaryURL = FileManager.default.temporaryDirectory.appendingPathExtension(UUID().uuidString)
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
                        }
                    }
                    
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
        
        if let serverUrl = data.serverUrl,
           let channelId = data.channelId {
            Network.default.createPost(
                serverUrl: serverUrl,
                channelId: channelId,
                message: data.message,
                fileIds: data.fileIds,
                completionHandler: {info, reponse, error in
                    self.removeUploadSessionData(id: id)
                    self.deleteUploadedFiles(files: data.files)
                    
                    if let handler = completionHandler {
                        os_log(
                            OSLogType.default,
                            "Mattermost BackgroundSession: postMessageForSession without files call completionHandler for identifier=%{public}@",
                            id
                        )
                        handler()
                    }
                })
        }
    }
}
