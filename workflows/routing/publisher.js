const amqp = require('amqplib');

const { EXCHANGE } = require('./config.json');

amqp.connect('amqp://127.0.0.1').then((connection) => {

    connection.createChannel().then(async (channel) => {

        const message = { message: 'Hello world' };
        const args = process.argv.slice(2);
        const route = (args.length > 0) ? args[0] : 'info';

        await channel.assertExchange(EXCHANGE, 'direct', {
            durable: false
        });

        channel.publish(EXCHANGE, route, Buffer.from(JSON.stringify(message)));
        console.log(" [x] Published %s : %s", route, message);

        setTimeout(async () => {
            connection.close();
            process.exit(0);
        }, 500);
    });
});
