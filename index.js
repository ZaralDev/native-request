`use strict`

let http = require('http');
let https = require('https');
const url = require('url');


function getProtocol(path) {
	let protocol = url.parse(path).protocol;
	return protocol === "http:" ? http : https;
}
/**
 * Send a get request
 * @param path is the url endpoint
 * @param headers of the request
 * @param callback contains (error, statusCode, data)
 */
 function get(path, headers, callback) {

 	request(path, "GET", null, headers, callback);

/* 	getProtocol(path).get(path, headers, function (response) {
	 	console.log("Hi");

 		handleResponse(response, callback);

 	}).on('error', function (error) {
 		callback(true, 404);
 		console.error(error);
 	});*/


 }

/**
 * Send a post request
 * @param path is the url endpoint
 * @param headers of the request
 * @param callback contains (error, statusCode, data)
 * @param data contains the data :)
 */
 function post(path, data,headers, callback) {
 	request(path, "POST", data,headers , callback);
 }

/**
 * Send a custom request
 * @param path is the url endpoint
 * @param headers of the request
 * @param callback contains (error, statusCode, data)
 * @param data contains the data :)
 * @param method is the protocol used like POST GET DELETE PUT etc...
 */
 function request(path, method, data, headers = '', callback) {
 	if (typeof data === 'function') {
 		callback = data;
 		data = ''
 	} else if (typeof headers === 'function') {
 		callback = headers;
 		headers = {};
 	} 
 	const postData = typeof data === "object" ? JSON.stringify(data) : data;
 	let parsedUrl = url.parse(path);
 	const options = {
 		hostname: parsedUrl.hostname,
 		port: parsedUrl.port,
 		path: parsedUrl.pathname,
 		method: method,
 		...headers
 	};
 	const req = getProtocol(path).request(options, function (response) {
 		handleResponse(response, callback);
 	});

 	req.on('error', function (error) {
 		callback(error);
 		console.error(error);
 	});

	// Write data to request body
	req.write(postData);
	req.end();
}


function handleResponse(response, callback) {
	let body = '';
	let status = response.statusCode;
	let hasError = status >= 300;
	response.setEncoding('utf8');
	response.on('data', function (d) {
		body += d;
	});
	response.on('end', function () {
        // Data reception is done, do whatever with it!
       // let parsed = JSON.parse(body);
        callback(hasError ? body : null, hasError ? null : body, response.statusCode, response.headers);
    });
}

module.exports = {
	get,
	request,
	post
};