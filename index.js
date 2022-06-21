const ws = require('ws');

const PORT = 7878;

const wss = new ws.Server(
	{
		port: PORT,
	},
	() => {
		console.log(`Server starter on port ${PORT}`);
	},
);

wss.on('connection', (ws) => {
	ws.id = Date.now();
	ws.on('message', (data) => {
		message = JSON.parse(data);
		switch (message.event) {
			case 'connection':
				broadcastMessage(message, ws.id);
				break;

			case 'message':
				broadcastMessage(message, ws.id);
				break;

			default:
				break;
		}
	});
});

function broadcastMessage(message, id) {
	console.log('room id', id);
	wss.clients.forEach((client) => {
		console.log(message.userName, client.id);
		client.send(JSON.stringify(message));
	});
}
