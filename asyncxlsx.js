xlsx = require('./xlsx');

let worker = new Worker('/node_modules/xlsx/worker.js');
let xlsxWorkerIds = 0;
let xlsxWorkerCallbacks = {};


worker.onmessage = (msg) => {
	let data = msg.data;
	if (xlsxWorkerCallbacks[data.id]) {
		xlsxWorkerCallbacks[data.id](data.success, data.payload);
		delete xlsxWorkerCallbacks[data.id];
	}
};

function doWork(name, data) {
	let xlsxWorkerId = xlsxWorkerIds++;
	worker.postMessage({
		id: xlsxWorkerId,
		payload: {
			name: name,
			data: data,
		},
	});

	return new Promise((resolve, reject) => {
		xlsxWorkerCallbacks[xlsxWorkerId] = (success, payload) => {
			if (success) {
				return resolve(payload);
			}
			else {
				return reject(payload);
			}
		};
	});
}

exports.write = (wb, opts) => doWork('write', [ wb, opts ]);
exports.utils = xlsx.utils;
