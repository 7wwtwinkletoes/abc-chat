let net = require('net');
let messageTypes = require('../common/messageTypes');
let responseStatus = require('../common/responseStatus');


class Program {
    port = 1337;
    serverAddress = "127.0.0.1";
    nonce = 1;
    callbackArray = [];
    socket;
    isConnected = false;

    Main() {
        this.socket = new net.Socket();
        this.socket.connect(this.port, this.serverAddress, this.OnConnect);
        this.socket.on('data', this.OnDataReceived);
    }

    OnConnect = () => {
        console.log(`Connected to server!`);
        this.isConnected = true;
        // 
        this.RegisterUser('aying', 'aying');
        this.RegisterUser('jon', 'jon');
    }

    OnDataReceived = (data) => {
        const params = data.toString().split('/');
        if (params.length >= 3 && parseInt(params[1])) {
            const responseNonce = parseInt(params[1]);
            for (let i = 0; i < this.callbackArray.length; i++) {
                if (this.callbackArray[i].nonce == responseNonce) {
                    console.log('performing callback');
                    this.callbackArray[i].callback(data);
                    this.callbackArray.splice(i, 1);
                    break;
                }
            }
        }
    }

    RegisterUser = (username, password) => {
        this.socket.write(`${messageTypes.REGISTER}/${this.nonce}/${username}/${password}\r\n`);
        this.callbackArray.push({
            nonce: this.nonce++,
            callback: this.RegisterCallback
        });
    }

    RegisterCallback = (data) => {
        const params = data.toString().split('/');
        if (parseInt(params[0]) && parseInt(params[0]) == messageTypes.REGISTER) {
            let displayString = "[Registration result]: ";
            if (parseInt(params[2]) && parseInt(params[2]) == responseStatus.SUCCESS) {
                displayString += "Registration success!";
            }
            else {
                if (params[3] && params[3].length > 0) {
                    displayString += params[3];
                }
                else {
                    displayString += "Something went wrong!";
                }
            }
            console.log(displayString);
        }
    }
}

(new Program()).Main();