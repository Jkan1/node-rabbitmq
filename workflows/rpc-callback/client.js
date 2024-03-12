const amqp = require('amqplib');

const { QUEUE } = require('./config.json');

const args = process.argv.slice(2);
if (args.length == 0) {
    console.log("Usage: node client <num>");
    process.exit(1);
}

amqp.connect('amqp://127.0.0.1').then((connection) => {

    connection.createChannel().then(async (channel) => {

        const queueData = await channel.assertQueue('', {
            exclusive: true,
            durable: false
        });

        const correlationId = generateUuid();
        const num = parseInt(args[0]) || 2;

        console.log(' [x] Requesting fib(%d)', num);

        channel.consume(queueData.queue, (msg) => {
            if (msg.properties.correlationId == correlationId) {
                console.log(' [.] Got %s', msg.content.toString());
                setTimeout(function () {
                    connection.close();
                    process.exit(0)
                }, 500);
            }
        }, { noAck: true });

        channel.sendToQueue(QUEUE, Buffer.from(num.toString()), {
            correlationId: correlationId,
            replyTo: queueData.queue
        })
    });
});

function generateUuid() {
    return Math.random().toString() +
        Math.random().toString() +
        Math.random().toString();
}
