import express from 'express';

const router = express.Router();

router.get('/test', (request, response) => {
    response.status(200).send({ test: 'hello' })
})

export default router;