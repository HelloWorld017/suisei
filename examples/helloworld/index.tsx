import { renderToStream } from 'suisei/dom-server';
import http from 'node:http';

http.createServer(async (req, res) => {
  await renderToStream(res, <div>Hello, World! from {req.url as string}</div>);
});
