import axios from "axios";

/* eslint-disable react/jsx-key */
import { Button, createFrames } from "frames.js/next";

const frames = createFrames();
const handleRequest = frames(async (ctx: any) => {
  const ipfsHash = ctx.url.href.split("/").slice(-1)[0];
  const { data } = await axios.get(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`);
  console.log(data);

  const state = typeof ctx.message?.state === "string" ? JSON.parse(ctx.message?.state || "{}") : ctx.message?.state;
  const oldCount = state?.["count"] || 0;

  return {
    image: <div tw="w-full h-full bg-slate-700 text-white justify-center flex items-center">{oldCount}</div>,
    buttons: [
      <Button key={1} action="post">
        Increment counter
      </Button>,
    ],
    state: { count: oldCount + 1 },
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
