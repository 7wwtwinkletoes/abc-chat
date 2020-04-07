const net = require('net');
const messageTypes = require('../common/messageTypes');
const responseStatus = require('../common/responseStatus');
const UserService = require('./userService');


class Program{
    port = 1337;
    host = "127.0.0.1";
    userList = [];
    userService = new UserService();
    server;

    Main(){
        this.server = net.createServer();
        this.server.on('connection', this.OnClientConnection);
        this.server.listen(this.port, this.host);
        console.log(`Server is running at ${this.host}:${this.port}`);
    }

    OnClientConnection = (socket) => {
        console.log(`Client connected: ${socket.remoteAddress}:${socket.remotePort}`);
        socket.on('data', (data) => this.OnSocketDataReceived(socket, data));
    }

    OnSocketDataReceived = (socket, data) => {
        console.log(`Data received from client(${socket.remoteAddress}:${socket.remotePort}):${data}`);
        data = data.toString();
        const params = data.split('/');
        const mType = params[0]; //check if mType is number
        switch(parseInt(mType))
        {
            case messageTypes.REGISTER:
                if(params.length == 4)
                {
                    const result = this.userService.RegisterUser(params[2], params[3]);
                    if(result)
                        socket.write(`1/${params[1]}/${responseStatus.SUCCESS}`);
                    else socket.write(`1/${params[1]}/${responseStatus.FAIL}/"Invalid username/password."`);
                }
                else socket.write(`1/${params[1]}/${responseStatus.FAIL}/"Invalid request."`);
                break;
            default:
                break;
        }
    }
}

(new Program()).Main();