const amqp = require('amqplib');

const { QUEUE } = require('./config.json');

amqp.connect('amqp://127.0.0.1').then((connection) => {

    connection.createChannel().then(async (channel) => {

        await channel.assertQueue(QUEUE, {
            durable: false
        });
        channel.prefetch(1);

        console.log(" [x] Awaiting RPC requests");

        await channel.consume(QUEUE, function reply(msg) {
            const n = parseInt(msg.content.toString());
            console.log(" [.] fib(%d)", n);
            const r = fibonacci(n);

            channel.sendToQueue(msg.properties.replyTo,
                Buffer.from(r.toString()), {
                correlationId: msg.properties.correlationId
            });

            channel.ack(msg);
        });
    });
});

function fibonacci(n) {
    if (n == 0 || n == 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}
