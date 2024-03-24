import axios from "axios";

/* eslint-disable react/jsx-key */
import { Button, createFrames } from "frames.js/next";
import { createWalletClient, getContract, http } from "viem";
import { baseSepolia } from "viem/chains";
import deployedContracts from "~~/contracts/deployedContracts";

function getTimeAgo(unixTimestamp: any) {
  const timestamp = unixTimestamp * 1000; // Convert Unix timestamp to milliseconds
  const now = Date.now();
  let seconds = Math.floor((timestamp - now) / 1000);
  const isFuture = seconds > 0;
  if (!isFuture) seconds = Math.floor((now - timestamp) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  let timeAgoString;
  // const isFuture = seconds > 0;

  if (isFuture) {
    if (days > 0) {
      timeAgoString = days === 1 ? `in ${days} day` : `in ${days} days`;
    } else if (hours > 0) {
      timeAgoString = hours === 1 ? `in ${hours} hour` : `in ${hours} hours`;
    } else if (minutes > 0) {
      timeAgoString = minutes === 1 ? `in ${minutes} minute` : `in ${minutes} minutes`;
    } else {
      timeAgoString = "in seconds"; // Handle cases very close to now (within seconds)
    }
  } else {
    // Logic for past dates remains the same
    if (days > 0) {
      timeAgoString = days === 1 ? `${days} day ago` : `${days} days ago`;
    } else if (hours > 0) {
      timeAgoString = hours === 1 ? `${hours} hour ago` : `${hours} hours ago`;
    } else if (minutes > 0) {
      timeAgoString = minutes === 1 ? `${minutes} minute ago` : `${minutes} minutes ago`;
    } else {
      timeAgoString = "just now";
    }
  }

  return timeAgoString;
}

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

const wallet = createWalletClient({
  key: process.env.SIGNER_PRIVATE_KEY,
  chain: baseSepolia,
  transport: http(),
});

const contract = getContract({
  abi: deployedContracts[84532].PollResults.abi,
  address: deployedContracts[84532].PollResults.address,
  walletClient: wallet,
  publicClient: wallet,
});

interface IFrame {
  name: string;
  // owner: string; ToDo
  timestamp?: number;
  deadline?: number;
  pages: {
    image?: string;
    question: string;
    options: string[];
    correctOption: number;
  }[];
}

const handleRequest = frames(async (ctx: any) => {
  const ipfsHash = ctx.url.href.split("/").slice(-1)[0].split("?")[0];
  const frame = await get(`https://turquoise-hilarious-prawn-9.mypinata.cloud/ipfs/${ipfsHash}`);
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

  let pollSubmitted = false;
  let score = [0, 0];
  if (ctx.message) {
    pollSubmitted = await contract.read.isPollSubmitted([ctx.message.requesterFid, ipfsHash]);
    const [n, d] = await contract.read.getResult([ctx.message.requesterFid, ipfsHash]);
    score = [Number(n), Number(d)];
  }

  if (pollSubmitted) {
    return {
      accepts: [
        {
          id: "farcaster",
          version: "vNext",
        },
        {
          id: "xmtp",
          version: "vNext",
        },
      ],
      image: (
        <div tw="w-full h-full bg-slate-700 text-white justify-center flex flex-col items-center">
          <h1>{frame.name}</h1>
          <h2>
            Your Score: {score[0]}/{score[1]} ({((100 * score[0]) / score[1]).toFixed(2)}%)
          </h2>
        </div>
      ),
      buttons: [
        <Button action="link" target={process.env.NEXT_PUBLIC_APP_API_URL}>
          Create Your Own Quiz
        </Button>,
      ],
    };
  }

  const pageIndex = Number(ctx.searchParams.pageIndex || 0);
  const prevAnswers = JSON.parse(ctx.searchParams.answers || "[]");
  console.log(pageIndex, prevAnswers);

  const state = typeof ctx.message?.state === "string" ? JSON.parse(ctx.message?.state || "{}") : ctx.message?.state;
  console.log(state);

  console.log(ctx.message?.requesterFid, ipfsHash, prevAnswers);
  if (pageIndex === frame.pages.length) {
    await contract.write.submitAnswer([ctx.message?.requesterFid, ipfsHash, prevAnswers], {
      account: (await wallet.getAddresses())[0],
    });
  }

  // const username = "Farcaster User";
  // const postedTime = new Date().toLocaleString(); // Replace with actual post time
  // const disappearsIn = "2 hours"; // Replace with actual disappearance time
  // const content = "something";

  return {
    accepts: [
      {
        id: "farcaster",
        version: "vNext",
      },
      {
        id: "xmtp",
        version: "vNext",
      },
    ],
    ogImage:
      "https://turquoise-blank-manatee-120.mypinata.cloud/ipfs/Qmdru8wSLZKgeXeFdxeZLNRxLr26MV2NiXiEZWC8CwE3TQ/0.png", // Not sure if it's needed or frames.js is already handling that
    image:
      // image: (
      //   <div tw="frame bg-gray-200 shadow-md rounded-lg overflow-hidden flex flex-col w-full h-full">
      //     <div tw="header px-4 py-1 flex justify-between items-center bg-gray-800 text-white font-bold">
      //       <h3 tw="text-2xl font-bold text-bold">{frame.name}</h3>
      //       <p tw=" text-xl">Posted: {getTimeAgo(frame?.timestamp)}</p>
      //       <p tw=" text-xl">Disappears in: {getTimeAgo(frame?.deadline)}</p>
      //     </div>
      //     <div tw="bg-gray-600 text-white w-full h-full justify-center items-center flex">
      //       Welcome to the "{frame.name}" Questionare
      //     </div>
      //   </div>
      // ),
      frame.pages[pageIndex]?.image ? (
        frame.pages[pageIndex]?.image || "https://picsum.photos/seed/frames.js/1146/600"
      ) : (
        <div tw="w-full h-full bg-slate-700 text-white justify-center flex items-center flex-col">
          {pageIndex !== frame.pages.length ? (
            state ? (
              frame.pages[pageIndex].question
            ) : (
              <>
                <p>
                  Welcome to the &quot;{frame.name}&quot; Questionare (Closes{" "}
                  {getTimeAgo((frame.timestamp || (new Date().getTime() / 1000) | 0) + 86400)})
                </p>
              </>
            )
          ) : (
            `Thank you for completing the Questionare "${frame?.name}"`
          )}
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
                      answers: JSON.stringify([...prevAnswers, option]),
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
