self.importScripts('./dist/xlsx.full.min.js');

function sendAnswer(id, success, payload) {
	self.postMessage({
		id: id,
		success: success,
		payload: payload,
	});
}

self.onmessage = function(msg) {
	var data = msg.data;
	var result;

	switch (data.payload.name) {
		case 'write':
			try {
				result = XLSX.write(data.payload.data[0], data.payload.data[1]);
				sendAnswer(data.id, true, result);
			}
			catch (e) {
				sendAnswer(data.id, false, e);
			}
		break;
	}
};
