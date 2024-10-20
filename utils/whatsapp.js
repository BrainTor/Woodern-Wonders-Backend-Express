import {Client, LocalAuth} from "whatsapp-web.js";

const client = new Client({
    authStrategy: new LocalAuth()
});

let isInit = false;

function initialize() {
    const promise = new Promise((rs, rj) => {
        client.on('ready', () => {
            console.log(`Whatsapp client is ready@${client.info.phone}`);
            rs();
        });
    });
    isInit = true;
    client.initialize();
    return promise;
}