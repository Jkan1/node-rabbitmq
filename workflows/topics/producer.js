const amqp = require('amqplib');

const { EXCHANGE } = require('./config.json');

amqp.connect('amqp://127.0.0.1').then((connection) => {

    connection.createChannel().then(async (channel) => {

        const message = { message: 'Hello world' };
        const topic = process.argv[2] || '#.info.#';

        await channel.assertExchange(EXCHANGE, 'topic', {
            durable: false
        });

        channel.publish(EXCHANGE, topic, Buffer.from(JSON.stringify(message)));
        console.log(" [x] Published %s : %s", topic, message);

        setTimeout(async () => {
            connection.close();
            process.exit(0);
        }, 500);
    });
});
