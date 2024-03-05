const amqp = require('amqplib');

const { QUEUE1 } = require('./config.json');

amqp.connect('amqp://127.0.0.1').then((connection) => {

    connection.createChannel().then(async (channel) => {

        const message = { message: 'Hello world' };

        await channel.assertQueue(QUEUE1, {
            durable: false
        });

        channel.sendToQueue(QUEUE1, Buffer.from(JSON.stringify(message)));
        console.log(" [x] Sent %s", message);

        setTimeout(async () => {
            connection.close();
            process.exit(0);
        }, 500);
    });
});
