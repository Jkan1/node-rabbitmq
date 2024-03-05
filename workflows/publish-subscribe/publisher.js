const amqp = require('amqplib');

const { EXCHANGE } = require('./config.json');

amqp.connect('amqp://127.0.0.1').then((connection) => {

    connection.createChannel().then(async (channel) => {

        const message = { message: 'Hello world' };

        await channel.assertExchange(EXCHANGE, 'fanout', {
            durable: false
        });

        channel.publish(EXCHANGE, '', Buffer.from(JSON.stringify(message)));
        console.log(" [x] Published %s", message);

        setTimeout(async () => {
            connection.close();
            process.exit(0);
        }, 500);
    });
});
