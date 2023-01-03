import { renderToStream } from 'suisei-dom/server';
import http from 'node:http';
import { Primitives, WrapProps } from 'suisei';

type BookProps = WrapProps<{
  book: {
    title: string,
    author: string,
    starRate: number
  }
}>;

const Book = ({ book }: BookProps, $: Primitives) => {
  const titleWithAuthor = $(_ => `${_(book).title} - ${_(book).author}`);

  return (
    <div>
      <h1>{titleWithAuthor}</h1>
      <div>{'\u2B50'}{$(_ => _(book).starRate.toFixed(2))}</div>
    </div>
  );
};

const BookList = () => {
  const bookList = [
    { title: '푸른 상자', author: '미우라 코우지', starRate: 5 },
    { title: '봇치 더 록!', author: '하마지 아키', starRate: 4.9}
  ];

  return (
    <>
      {bookList.map(book => <Book book={book} />)}
    </>
  );
};

const App = async (_props: Record<string, never>, $: Primitives) => {
  const bookListId = $.constant(234);
  $.future($(async _ => {
    const bookList = _(bookListId);

    await new Promise(resolve => {
      setTimeout(resolve, 1000);
    });
    // Fetched
  }))
};

const server = http.createServer(async (req, res) => {
  res.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Suisei Test</title>
      </head>
      <body>
  `.trim());
  await renderToStream(res, <BookList />);
  res.write(`
      </body>
    </html>
  `);
  res.end();
});

server.listen(3000, () => {
  console.log('Listening on 3000!');
});
