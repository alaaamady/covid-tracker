import app from './app';

const greeting = { message: 'Welcome to api!' };

app.get('/api', (req, res) => {
  res.send(greeting);
});

const port = process.env.PORT ? Number(process.env.PORT) : 3000;
const server = app.listen(port, () => {
  console.log('Listening at port' + port + '/api');
});
server.on('error', console.error);
