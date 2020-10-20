import http from 'http';
import app from './express/app';

const port = process.env.PORT || 8060;

const server = app().listen(port, () => {
    console.log(`Server online on port: ${port}`)
})

import kafka from 'kafka-node';

const consumer = new kafka.ConsumerGroupStream({
    kafkaHost: 'localhost:9092',
    groupId: 'test',
    fromOffset: 'latest',
    batch: undefined,
    ssl: false,
    sessionTimeout: 30000,
    protocol: ['roundrobin'],
    encoding: 'utf8',
    outOfRangeOffset: 'earliest',
    autoCommit: true,
    autoCommitIntervalMs: 10000,
    migrateHLC: false,
    migrateRolling: true,
    maxTickMessages: 800,
    fetchMinBytes: 1,
    fetchMaxBytes: 10 * 1024
}, 'test')

consumer.on('data', (chunk) => {
    console.log(chunk);
})

consumer.on('error', console.error)

// const producer = new kafka.HighLevelProducer(new kafka.KafkaClient({
//     kafkaHost: '172.30.0.1:9092'
// }), {

// })

// producer.send([{ topic: 'test', messages: JSON.stringify({ message: 'testing' }) }], (error, data) => {
//     if (error) {
//         console.error(error);
//     } else {
//         console.log('success')
//     }
// })