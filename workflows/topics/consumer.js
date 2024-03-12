const amqp = require('amqplib');

const { EXCHANGE } = require('./config.json');

const args = process.argv.slice(2);
if (args.length == 0) {
    console.log("Usage: node consumer [topic] [topic] [topic]");
    process.exit(1);
}

amqp.connect('amqp://127.0.0.1').then((connection) => {

    connection.createChannel().then(async (channel) => {

        await channel.assertExchange(EXCHANGE, 'topic', {
            durable: false
        });

        const assertQueue = await channel.assertQueue('', { exclusive: true });

        for (const topic of args) {
            await channel.bindQueue(assertQueue.queue, EXCHANGE, topic);
        }

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", assertQueue.queue);

        await channel.consume(assertQueue.queue, handleMessage, { noAck: true });
    });
});

function handleMessage(message) {
    console.log(" [x] Received %s : %s", message.fields.routingKey, message.content.toString());
}
