import http from 'http';
import app from './express/app';

const port = process.env.PORT || 8080;

const server = app().listen(port, () => {
    console.log(`Server online on port: ${port}`)
})