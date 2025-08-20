    //
//  Network.swift
//  Gekidou
//
//  Created by Miguel Alatzar on 8/20/21.
//

import Foundation
import os.log

public typealias ResponseHandler = (_ data: Data?, _ response: URLResponse?, _ error: Error?) -> Void

public class Network: NSObject {
    internal var session: URLSession?
    internal let queue = OperationQueue()
    internal let urlVersion = "/api/v4"
    internal var certificates: [String: [SecCertificate]] = [:]

    @objc public static let `default` = Network()
    
    override private init() {
        super.init()
        
        queue.maxConcurrentOperationCount = 1
        
        let config = URLSessionConfiguration.default
        config.httpAdditionalHeaders = ["X-Requested-With": "XMLHttpRequest"]
        config.allowsCellularAccess = true
        config.httpMaximumConnectionsPerHost = 10
        config.timeoutIntervalForRequest = 10
        
        self.session = URLSession.init(
            configuration: config,
            delegate: self,
            delegateQueue: nil
        )
    }
    
    public func buildApiUrl(_ serverUrl: String, _ endpoint: String) -> URL {
        return URL(string: "\(serverUrl)\(urlVersion)\(endpoint)")!
    }
    
    public func responseOK(_ response: URLResponse?) -> Bool {
        return (response as? HTTPURLResponse)?.statusCode == 200
    }
    
    public func buildURLRequest(for url: URL, usingMethod method: String, withBody body: Data?, andHeaders headers: [String:String]?, forServerUrl serverUrl: String) -> URLRequest {
        let request = NSMutableURLRequest(url: url)
        request.httpMethod = method
        
        if let body = body {
            request.httpBody = body
        }
        
        if let headers = headers {
            for (key, value) in headers {
                request.setValue(value, forHTTPHeaderField: key)
            }
        }
        
        if let token = try? Keychain.default.getToken(for: serverUrl) {
            request.addValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }
        
        return request as URLRequest
    }
    
    public func request(_ url: URL, usingMethod method: String, forServerUrl serverUrl: String, completionHandler: @escaping ResponseHandler) {
        return request(url, withMethod: method, withBody: nil, andHeaders: nil, forServerUrl: serverUrl, completionHandler: completionHandler)
    }
    
    public func request(_ url: URL, withMethod method: String, withBody body: Data?, andHeaders headers: [String:String]?, forServerUrl serverUrl: String, completionHandler: @escaping ResponseHandler) {
        let urlRequest = buildURLRequest(for: url, usingMethod: method, withBody: body, andHeaders: headers, forServerUrl: serverUrl)
        
        let task = session!.dataTask(with: urlRequest) { data, response, error in
            completionHandler(data, response, error)
        }
        
        task.resume()
    }
}
