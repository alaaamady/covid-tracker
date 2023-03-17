import * as express from 'express';
import * as path from 'path';
import app from './app';

// const CLIENT_BUILD_PATH = path.join(
//   __dirname,
//   '../../../../frontend/index.html'
// );

// app.use(express.static(CLIENT_BUILD_PATH));

const greeting = { message: 'Welcome to api!' };

app.get('/api', (req, res) => {
  res.send(greeting);
});

// app.get('*', (request, response) => {
//   response.sendFile(path.join(CLIENT_BUILD_PATH, 'index.html'));
// });

const port = process.env.PORT ? Number(process.env.PORT) : 3000;
const server = app.listen(port, () => {
  console.log('Listening at port' + port + '/api');
});
server.on('error', console.error);
