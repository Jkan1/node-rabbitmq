const amqp = require('amqplib');

const { QUEUE1 } = require('./config.json');

amqp.connect('amqp://127.0.0.1').then((connection) => {

    connection.createChannel().then(async (channel) => {

        await channel.assertQueue(QUEUE1, {
            durable: false
        });

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", QUEUE1);

        await channel.consume(QUEUE1, handleMessage, { noAck: true });
    });
});

function handleMessage(message) {
    console.log(" [x] Received %s", message.content.toString());
}
