import axios from "axios";

/* eslint-disable react/jsx-key */
import { Button, createFrames } from "frames.js/next";

const frames = createFrames({
  initialState: {
    pageIndex: 0,
    answers: "[]",
  },
});

const cacheStore: Record<string, any> = {};

async function get(url: string): Promise<any> {
  url = url.split("?")[0];
  console.log(url, cacheStore);
  if (cacheStore[url]) {
    return cacheStore[url];
  }

  const { data } = await axios.get(url);
  cacheStore[url] = data;
  return data;
}

const frame = {
  name: "Test",
  pages: [
    {
      question: "What is your name?",
      options: ["Alice", "Bob", "Charlie"],
    },
    {
      question: "What is your favorite color?",
      options: ["Red", "Green", "Blue"],
    },
    {
      question: "What is your favorite food?",
      options: ["Pizza", "Pasta", "Salad"],
    },
  ],
};

const handleRequest = frames(async (ctx: any) => {
  const ipfsHash = ctx.url.href.split("/").slice(-1)[0];
  const data = await get(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`);
  console.log(data);

  const pageIndex = Number(ctx.searchParams.pageIndex || 0);
  const prevAnswers = JSON.parse(ctx.searchParams.answers || "[]");
  console.log(pageIndex, prevAnswers);

  const state = typeof ctx.message?.state === "string" ? JSON.parse(ctx.message?.state || "{}") : ctx.message?.state;
  console.log(state);

  return {
    image: (
      <div tw="w-full h-full bg-slate-700 text-white justify-center flex items-center">
        {pageIndex !== frame.pages.length
          ? state
            ? frame.pages[pageIndex].question
            : `Welcome to the "${frame.name}" Questionare`
          : "Thank you for completing the Questionare"}
      </div>
    ),
    buttons:
      pageIndex !== frame.pages.length
        ? state
          ? frame.pages[pageIndex].options.map((option, key) => (
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
        : [],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
