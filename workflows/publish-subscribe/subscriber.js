const amqp = require('amqplib');

const { EXCHANGE } = require('./config.json');

amqp.connect('amqp://127.0.0.1').then((connection) => {

    connection.createChannel().then(async (channel) => {

        await channel.assertExchange(EXCHANGE, 'fanout', {
            durable: false
        });

        const assertQueue = await channel.assertQueue('', { exclusive: true });

        await channel.bindQueue(assertQueue.queue, EXCHANGE, '');

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", assertQueue.queue);

        await channel.consume(assertQueue.queue, handleMessage, { noAck: true });
    });
});

function handleMessage(message) {
    console.log(" [x] Received %s", message.content.toString());
}
