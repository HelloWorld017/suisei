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

  return <Book book={bookList[0]} />;
  /*
    <>
      {bookList.map(book => <Book book={bookList} />)}
    </>
  ) */
}

const server = http.createServer(async (req, res) => {
  await renderToStream(res, <BookList />);
});

server.listen(3000, () => {
  console.log('Listening on 3000!');
});
