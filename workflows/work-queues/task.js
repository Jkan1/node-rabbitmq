const amqp = require('amqplib');

const { QUEUE1 } = require('./config.json');

const inputMessage = process.argv.slice(2).join(' ') || "Hello World!";

amqp.connect('amqp://127.0.0.1').then((connection) => {

    connection.createChannel().then(async (channel) => {

        const message = { message: inputMessage };

        await channel.assertQueue(QUEUE1, {
            durable: true
        });

        channel.sendToQueue(QUEUE1, Buffer.from(JSON.stringify(message)), { persistent: true });
        console.log(" [x] Sent %s", message);

        setTimeout(async () => {
            connection.close();
            process.exit(0);
        }, 500);
    });
});
