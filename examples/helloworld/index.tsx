import { renderToStream } from 'suisei-dom/server';
import http from 'node:http';

const server = http.createServer(async (req, res) => {
  await renderToStream(res, <div>Hello, World! from {req.url as string}</div>);
});

server.listen(3000);
