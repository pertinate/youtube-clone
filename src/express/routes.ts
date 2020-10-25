import express from 'express';
import fs from 'fs';
import fetch from 'node-fetch';
import { Duplex, Readable, Stream } from 'stream';
import rStream from 'range-stream'
import streamBuffer from 'stream-buffers';
import download from 'download.js';
import { WriteStream } from 'tty';
import { redisClient } from '../redis';

const router = express.Router();

router.get('/test', (request, response) => {
    response.status(200).send({ test: 'hello' })
})

router.get('/video', async (request, response) => {
    console.log('vid')
    const result = await fetch('http://localhost:8000/trap-remix.mp4', {
        method: 'get',
        headers: {
            'Content-Type': 'video/mp4'
        }
    });

    // redisClient.set('trap-remix.mp4', (await result.buffer()).toString('binary'))

    let videoBuffer = new Buffer(await new Promise((resolve, reject) => {
        redisClient.get('trap-remix.mp4', (error, reply) => {
            if (error) {
                reject(error);
            } else {
                resolve(reply);
            }
        })
    }), 'binary')

    const fileSize = videoBuffer.length;
    const range = request.headers.range;
    
    if (range) {
        console.log('RANGE')
        const positions = range.replace(/bytes=/, "").split('-');
        const start = parseInt(positions[0], 10);
        const end = positions[1] ? parseInt(positions[1], 10) : fileSize - 1;
        const chunkSize = (end - start) + 1;
        console.log(positions, start, end, chunkSize)

        const head = {
            "Content-Range": "bytes " + start + "-" + end + "/" + fileSize,
            "Accept-Ranges": "bytes",
            "Content-Length": chunkSize,
            "Content-Type": "video/mp4"
        }

        response.writeHead(206, head);
        var fileBytes = videoBuffer.copyWithin(0, start, end)

        Readable.from(fileBytes).pipe(response);
    } else {
        console.log('NO RANGE')
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        }
        response.writeHead(200, head);
    }
})

export default router;