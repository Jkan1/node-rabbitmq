const amqp = require('amqplib');

const { QUEUE1 } = require('./config.json');

const inputSeconds = parseInt(process.argv[2]) || 1;

amqp.connect('amqp://127.0.0.1').then((connection) => {

    connection.createChannel().then(async (channel) => {

        await channel.assertQueue(QUEUE1, {
            durable: true
        });
        await channel.prefetch(1);

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", QUEUE1);

        function handleMessage(message) {
            console.log(" [x] Received %s", message.content.toString());
            // manual acknowledgment mode
            setTimeout(function () {
                console.log(" [x] Done");
                channel.ack(message);
            }, inputSeconds * 1000);
        }

        await channel.consume(QUEUE1, handleMessage, { noAck: false });
    });
});
