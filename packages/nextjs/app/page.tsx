"use client";

import React, { useState } from "react";
// import Link from "next/link";
import axios from "axios";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
// import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
// import { Address } from "~~/components/scaffold-eth";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";

interface FramePage {
  question: string;
  options: string[];
}

// interface FrameData {
//   frame: {
//     name: string;
//     pages: FramePage[];
//   };
//   owner: string;
// }

interface FrameData {
  frame: {
    name: string;
    pages: FramePage[];
    [key: string]: any;
  };
  owner: string;
}

// const frameData = {
//   frame: {
//     name: "Test",
//     pages: [
//       {
//         question: "What is your name?",
//         options: ["Alice", "Bob", "Charlie"],
//       },
//       {
//         question: "What is your favorite color?",
//         options: ["Red", "Green", "Blue"],
//       },
//       {
//         question: "What is your favorite food?",
//         options: ["Pizza", "Pasta", "Salad"],
//       },
//     ],
//   },
//   owner: "0x99ccAa5a770051C6ca30709E7c73204c7b10b8d9",
// };

const apiUrl = `http://${process.env.NEXT_PUBLIC_APP_API_URL}/frames`;

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  const [frameData, setFrameData] = useState<FrameData>({
    frame: {
      name: "Test",
      pages: [
        { question: "What is your name?", options: ["Alice", "Bob", "Charlie"] },
        { question: "What is your favorite color?", options: ["Red", "Green", "Blue"] },
        { question: "What is your favorite food?", options: ["Pizza", "Pasta", "Salad"] },
      ],
    },
    owner: "0x99ccAa5a770051C6ca30709E7c73204c7b10b8d9",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;

    // Update frameData based on the changed field
    setFrameData(prevData => {
      const updatedFrameData = { ...prevData };
      const path = name.split("."); // Split name to access nested properties

      // Update nested properties using reduce
      updatedFrameData.frame = path.reduce((acc, prop, index, arr) => {
        if (index === arr.length - 1) {
          return { ...acc, [prop]: value }; // Update final property
        }
        return acc[prop]; // Traverse nested objects
      }, updatedFrameData.frame); // Initial accumulator

      return updatedFrameData;
    });
  };

  const createFrame = async () => {
    try {
      console.log(apiUrl);
      const response = await axios.post(apiUrl, frameData);
      console.log("Frame created successfully:", response.data);
    } catch (error) {
      console.error("Error creating frame:", error);
    }
  };

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        {connectedAddress ? (
          <div>
            <div>
              <div className="text-center text-lg border border-white px-4 py-2 rounded-xl">
                Connected with <span className="text-center text-lg font-bold">{connectedAddress}</span>
              </div>
              {/* <div onClick={createFrame}>GENERATE</div> */}
              {apiUrl}
            </div>
            <div className="text-center text-lg mt-4">
              <h2 className="text-xl">Create Frame Poll</h2>
              <div className="flex flex-col border border-white px-4 py-2 rounded-xl">
                <form className="flex flex-col justify-evenly">
                  {/* Form fields to update frameData properties */}
                  <label htmlFor="frameName">Frame Name:</label>
                  <input
                    type="text"
                    id="frameName"
                    name="frame.name"
                    value={frameData.frame.name}
                    onChange={handleChange}
                  />
                  {/* Add similar fields for each page and its properties (question, options) */}
                  <button type="button" className="bg-secondary rounded-xl px-2 py-1 font-bold" onClick={createFrame}>
                    Create Frame
                  </button>
                </form>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col mx-auto">
            <div className="flex flex-row mx-auto">
              <p className="text-center text-lg">You need to authenticate in order to use the dashboard</p>
            </div>
            <RainbowKitCustomConnectButton />
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
