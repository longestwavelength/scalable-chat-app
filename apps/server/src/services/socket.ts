import { Server } from "socket.io";
import Redis from 'ioredis';

const pub = new Redis({
    host: '',
    port: 0,
    username: 'default',
    password: ''
});
const sub = new Redis({
    host: '',
    port: 0,
    username: 'default',
    password: ''
});

class SocketService {
    private _io: Server;

    constructor() {
        console.log('Init Socket Service..')
        this._io = new Server({
            cors: {
                allowedHeaders: ['*'],
                origin: "*"
            }
        });
        sub.subscribe('MESSAGES');
    }

    public initListeners() {
        const io = this.io;
        console.log('Init Socket Listeners...')
        io.on('connect', (socket) => {
            console.log(`New Socket connected`, socket.id);

            socket.on('event:message', async ({ message }: { message: string }) => {
                console.log('New Message Received', message);
                //publish this message to redis
                await pub.publish('MESSAGES', JSON.stringify({ message }))
            })
        })

        sub.on('message', (channel, message) => {
            if(channel === 'MESSAGES') {
                io.emit('message', message);
            }
        })
    }

    get io() {
        return this._io;
    }
}

export default SocketService;