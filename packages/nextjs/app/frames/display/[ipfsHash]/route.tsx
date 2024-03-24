import axios from "axios";

/* eslint-disable react/jsx-key */
import { Button, createFrames } from "frames.js/next";

const frames = createFrames({
  initialState: {
    pageIndex: 0,
    answers: "[]",
  },
});

const cacheStore: Record<string, IFrame> = {};

async function get(url: string): Promise<IFrame> {
  url = url.split("?")[0];
  console.log(url, cacheStore);
  if (cacheStore[url]) {
    return cacheStore[url];
  }

  const { data } = await axios.get(url);
  cacheStore[url] = data;
  return data;
}

// const frame = {
//   name: "Test",
//   pages: [
//     {
//       question: "What is your name?",
//       options: ["Alice", "Bob", "Charlie"],
//     },
//     {
//       question: "What is your favorite color?",
//       options: ["Red", "Green", "Blue"],
//     },
//     {
//       question: "What is your favorite food?",
//       options: ["Pizza", "Pasta", "Salad"],
//     },
//   ],
// };

interface IFrame {
  name: string;
  // owner: string; ToDo
  pages: {
    image?: string;
    question: string;
    options: string[];
    correctOption: number;
  }[];
}

const handleRequest = frames(async (ctx: any) => {
  const ipfsHash = ctx.url.href.split("/").slice(-1)[0];
  const frame = await get(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`);
  console.log(frame);

  if (
    !frame ||
    !frame.name ||
    !frame.pages ||
    !frame.pages.length ||
    !frame.pages[0].question ||
    !frame.pages[0].options ||
    !frame.pages[0].options.length
  ) {
    return {
      image: <div tw="w-full h-full bg-red-500 text-white justify-center flex items-center">Invalid Frame</div>,
      buttons: [],
    };
  }

  const pageIndex = Number(ctx.searchParams.pageIndex || 0);
  const prevAnswers = JSON.parse(ctx.searchParams.answers || "[]");
  console.log(pageIndex, prevAnswers);

  const state = typeof ctx.message?.state === "string" ? JSON.parse(ctx.message?.state || "{}") : ctx.message?.state;
  console.log(state);

  return {
    image: frame.pages[pageIndex]?.image ? (
      frame.pages[pageIndex]?.image || "https://picsum.photos/seed/frames.js/1146/600"
    ) : (
      <div tw="w-full h-full bg-slate-700 text-white justify-center flex items-center">
        {pageIndex !== frame.pages.length
          ? state
            ? frame.pages[pageIndex].question
            : `Welcome to the "${frame.name}" Questionare`
          : `Thank you for completing the Questionare "${frame?.name}"`}
      </div>
    ),
    buttons:
      pageIndex !== frame.pages.length
        ? state
          ? (!frame.pages[pageIndex]?.options || !frame.pages[pageIndex]?.options.length) &&
            pageIndex !== frame.pages.length
            ? [
                <Button
                  key={1}
                  target={{
                    pathname: ctx.url.pathname,
                    query: {
                      pageIndex: pageIndex - 1,
                    },
                  }}
                  action="post"
                >
                  Previous
                </Button>,
                <Button
                  key={2}
                  target={{
                    pathname: ctx.url.pathname,
                    query: {
                      pageIndex: pageIndex + 1,
                    },
                  }}
                  action="post"
                >
                  Next
                </Button>,
              ]
            : frame.pages[pageIndex].options.map((option, key) => (
                <Button
                  key={key}
                  target={{
                    pathname: ctx.url.pathname,
                    query: {
                      pageIndex: pageIndex + 1,
                      answers: JSON.stringify([...prevAnswers, key]),
                    },
                  }}
                  action="post"
                >
                  {option}
                </Button>
              ))
          : [
              <Button key={1} action="post">
                Start Questionare
              </Button>,
            ]
        : [
            <Button action="link" target={process.env.NEXT_PUBLIC_APP_API_URL}>
              Create Your Own Quiz
            </Button>,
          ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
