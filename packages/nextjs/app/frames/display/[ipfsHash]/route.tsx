import axios from "axios";

/* eslint-disable react/jsx-key */
import { Button, createFrames } from "frames.js/next";

const frames = createFrames();
const handleRequest = frames(async (ctx: any) => {
  const ipfsHash = ctx.url.href.split("/").slice(-1)[0];
  console.log(ipfsHash);
  const { data } = await axios.get(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`);
  console.log(data);

  return {
    image: (
      <div tw="w-full h-full bg-slate-700 text-white justify-center items-center">
        {(ctx.message?.state as any)?.count ?? 0}
      </div>
    ),
    buttons: [
      <Button key={1} action="post">
        Increment counter
      </Button>,
    ],
    state: { count: ((ctx.message?.state as any)?.count ?? 0) + 1 },
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
