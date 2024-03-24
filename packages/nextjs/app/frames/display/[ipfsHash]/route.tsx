import axios from "axios";

/* eslint-disable react/jsx-key */
import { Button, createFrames } from "frames.js/next";

const frames = createFrames({
  initialState: {
    pageIndex: 0,
  },
});

const totalPages = 5;

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

const handleRequest = frames(async (ctx: any) => {
  const ipfsHash = ctx.url.href.split("/").slice(-1)[0];
  const data = await get(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`);
  console.log(data);

  const pageIndex = Number(ctx.searchParams.pageIndex || 0);
  console.log(pageIndex);

  const state = typeof ctx.message?.state === "string" ? JSON.parse(ctx.message?.state || "{}") : ctx.message?.state;
  console.log(state);

  return {
    image: <div tw="w-full h-full bg-slate-700 text-white justify-center flex items-center">{pageIndex}</div>,
    buttons: state
      ? [
          <Button
            key={1}
            target={{
              pathname: ctx.url.pathname,
              query: { pageIndex: (pageIndex - 1) % totalPages },
            }}
            action="post"
          >
            Decrement counter
          </Button>,
          <Button
            key={2}
            target={{
              pathname: ctx.url.pathname,
              query: { pageIndex: (pageIndex + 1) % totalPages },
            }}
            action="post"
          >
            Increment counter
          </Button>,
        ]
      : [
          <Button key={1} action="post">
            Start counter
          </Button>,
        ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
