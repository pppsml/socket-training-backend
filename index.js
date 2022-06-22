import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

import cors from './middleware/cors.middleware.js';

const PORT = 7878;

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
	cors: { origin: '*' },
});

app.use(cors);
app.use(express.json());

const rooms = {};

io.on('connection', (socket) => {
	console.log('connected', socket.id, socket.rooms);

	socket.on('ROOM:join', (data) => {
		console.log(data);
		socket.join(data.roomId);
		socket.broadcast.to(data.roomId).emit('ROOM:user_connected', {
			username: data.username,
		});
		socket.send('connecting success');
	});

	socket.on('ROOM:send_message', (data) => {
		console.log(socket.id, data);
		io.to(data.roomId).emit('ROOM:get_message', data);
	});
});

httpServer.listen(PORT, () => {
	console.log(`Server started on port ${PORT}`);
});
