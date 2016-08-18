xlsx = require('./xlsx');

var xlsxWorker = new Worker('/node_modules/xlsx/worker.js');
var xlsxWorkerIds = 0;
var xlsxWorkerCallbacks = {};


xlsxWorker.onmessage = function(msg) {
	var data = msg.data;
	if (xlsxWorkerCallbacks[data.id]) {
		xlsxWorkerCallbacks[data.id](data.success, data.payload);
		delete xlsxWorkerCallbacks[data.id];
	}
};

function doWork(name, data) {
	var xlsxWorkerId = xlsxWorkerIds++;
	xlsxWorker.postMessage({
		id: xlsxWorkerId,
		payload: {
			name: name,
			data: data,
		},
	});

	return new Promise(function(resolve, reject) {
		xlsxWorkerCallbacks[xlsxWorkerId] = function(success, payload) {
			if (success) {
				return resolve(payload);
			}
			else {
				return reject(payload);
			}
		};
	});
}

exports.write = function(wb, opts) { return doWork('write', [ wb, opts ]); };
exports.utils = xlsx.utils;
