import http from 'http';
import app from './express/app';
import { redisClient } from './redis';
import ffmpeg from 'fluent-ffmpeg'

const port = process.env.PORT || 8060;

const server = app().listen(port, () => {
    console.log(`Server online on port: ${port}`)
})

redisClient.on('connect', () => {
    console.log('Redis Connected')
});

; (
    async () => {
        try {
            const vid = ffmpeg({ source: '/home/pertinate/fileserver/trap-remix.mp4' });
            // vid.ffprobe()
            console.log(JSON.stringify(vid, null, '\t'))
            console.log(vid)
        } catch (error) {
            console.error(error);
        }
    }
)();

// redisClient.hmset('trap-remix.mp4', {
//     binaryRanges: '0-12345,12345-25567',
//     '0': 'mybinary',
//     '12345': 'mybinary',
//     '25567': 'mybinary'
// })



// import kafka from 'kafka-node';

// const consumer = new kafka.ConsumerGroupStream({
//     kafkaHost: '172.17.0.3:9092',
//     groupId: 'test',
//     fromOffset: 'latest',
//     batch: undefined,
//     ssl: false,
//     sessionTimeout: 30000,
//     protocol: ['roundrobin'],
//     encoding: 'utf8',
//     outOfRangeOffset: 'earliest',
//     autoCommit: true,
//     autoCommitIntervalMs: 10000,
//     migrateHLC: false,
//     migrateRolling: true,
//     maxTickMessages: 800,
//     fetchMinBytes: 1,
//     fetchMaxBytes: 10 * 1024,
// }, 'testt')

// consumer.on('data', (chunk) => {
//     console.log(chunk);
// })

// consumer.on('error', console.error)

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