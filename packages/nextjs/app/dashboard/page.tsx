"use client";

// @ts-nocheck
import React, { useEffect, useState } from "react";
// import Link from "next/link";
import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useAccount } from "wagmi";
import * as Yup from "yup";
// import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
// import { Address } from "~~/components/scaffold-eth";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";

interface QuizQuestion {
  title: string;
  answers: { text: string; isCorrect: boolean }[];
}

interface QuizValues {
  farcasterId: string;
  userName: string;
  numQuestions: number;
  questions: QuizQuestion[];
}

const initialValues: QuizValues = {
  farcasterId: "",
  userName: "",
  numQuestions: 1,
  questions: [],
};

interface Frame {
  id: string;
  ipfs_pin_hash: string;
}

const validationSchema = Yup.object().shape({
  userName: Yup.string().required("Username is required"),
  numQuestions: Yup.number().min(1, "Minimum 1 question").required("Number of questions is required"),
});

interface Frame {
  id: string;
  ipfs_pin_hash: string;
  size: number;
  user_id: string;
  date_pinned: string;
  date_unpinned: string | null;
  metadata: {
    name: string;
    keyvalues: {
      type: string;
      owner: string;
    };
  };
  regions: {
    regionId: string;
    currentReplicationCount: number;
    desiredReplicationCount: number;
  }[];
  mime_type: string;
  number_of_files: number;
}

export function fetchData(connectedAddress: string): any {
  //   const [data, setData] = useState<Frame[] | null>(null);
  //   const [error, setError] = useState<Error | null>(null);
  //   const { address: connectedAddress } = useAccount();

  //   useEffect(() => {
  const fetchData = async () => {
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_APP_API_URL}/frames/list/${connectedAddress}`;

      console.log(apiUrl);

      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      const responseJson = await response.json(); // Parse the response as JSON
      const frames: Frame[] = responseJson.frames.map((frameData: any) => ({
        id: frameData.id,
        ipfs_pin_hash: frameData.ipfs_pin_hash,
        size: frameData.size,
        user_id: frameData.user_id,
        date_pinned: frameData.date_pinned,
        date_unpinned: frameData.date_unpinned,
        metadata: {
          name: frameData.metadata.name,
          keyvalues: {
            type: frameData.metadata.keyvalues.type,
            owner: frameData.metadata.keyvalues.owner,
          },
        },
        regions: frameData.regions,
        mime_type: frameData.mime_type,
        number_of_files: frameData.number_of_files,
      }));
      // setData(frames);
      console.log(frames);
    } catch (error) {
      // setError(error as Error);
    }
  };

  fetchData();
  //   }, []);

  //   return { data, error };
  return frames;
}

// interface FramePage {
//   question: string;
//   options: string[];
// }

// interface FrameData {
//   frame: {
//     name: string;
//     pages: FramePage[];
//     [key: string]: any;
//   };
//   owner: string;
// }

const apiUrl = `${process.env.NEXT_PUBLIC_APP_API_URL}/frames`;

const Dashboard = () => {
  const { address: connectedAddress } = useAccount();
  const [data, setData] = useState<any | null>(null);

  useEffect(() => {
    const fetchDataAsync = async () => {
      if (connectedAddress) {
        try {
          const dataTemp = await fetchData(connectedAddress);
          console.log(dataTemp);
          setData(dataTemp);
        } catch (error) {
          console.error("Error fetching data:", error);
          // Handle error appropriately (e.g., display an error message)
        }
      }
    };

    if (connectedAddress) fetchDataAsync();
  }, [connectedAddress]);

  useEffect(() => {
    const fetchDataAsync = async () => {
      if (connectedAddress) {
        try {
          const dataTemp = await fetchData(connectedAddress);
          console.log(dataTemp);
          setData(dataTemp);
        } catch (error) {
          console.error("Error fetching data:", error);
          // Handle error appropriately (e.g., display an error message)
        }
      }
    };

    if (connectedAddress) fetchDataAsync();
  }, []);

  const createFrame = async (initialData: QuizValues) => {
    try {
      const currentUnixTimestamp = Math.floor(Date.now() / 1000);
      console.log("Current Unix Timestamp (seconds):", currentUnixTimestamp);
      const newFrameMetadata = {
        frame: {
          timestamp: currentUnixTimestamp,
          deadline: currentUnixTimestamp + 1200000,
          farcasterId: initialData.farcasterId,
          name: initialData.userName || "Default Poll",
          pages: initialData.questions.map(question => ({
            question: question.answers[0].text,
            options: question.answers.map(answer => answer.text),
          })),
        },
        owner: connectedAddress,
      };
      const response = await axios.post(apiUrl, newFrameMetadata);
      console.log("Frame created successfully:", response.data);
    } catch (error) {
      console.error("Error creating frame:", error);
    }
  };

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        {/* <fetchData /> */}
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
              <h2 className="text-xl">Create Poll Frame</h2>
              <div className="flex flex-col border border-white px-4 py-2 rounded-xl">
                <div>
                  <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={values => console.log(values)}
                    enableReintialize={true}
                  >
                    {({ values, handleChange }) => (
                      <Form>
                        <h2>Quiz Generator</h2>
                        <div className="flex flex-col space-y-4">
                          <Field
                            type="text"
                            name="farcasterId"
                            placeholder="Farcaster Id"
                            className="input rounded-lg px-3 py-2"
                          />
                          <Field
                            type="text"
                            name="userName"
                            placeholder="Enter Username"
                            className="input rounded-lg px-3 py-2"
                          />
                          <ErrorMessage name="userName" component="div" className="text-red-500 text-sm" />
                          <Field
                            type="number"
                            name="numQuestions"
                            placeholder="Number of Questions"
                            className="input rounded-lg px-3 py-2"
                          />
                          <ErrorMessage name="numQuestions" component="div" className="text-red-500 text-sm" />
                        </div>

                        <div className="mt-6">
                          {Array.from({ length: values.numQuestions }, (_, index) => (
                            <div key={index} className="rounded-lg shadow-md p-4 mb-4">
                              <h3>Question {index + 1}</h3>
                              <Field
                                type="text"
                                name={`questions[${index}].title`}
                                placeholder="Enter Question Title"
                                className="input rounded-lg px-3 py-2"
                              />
                              <ErrorMessage
                                name={`questions[${index}].title`}
                                component="div"
                                className="text-red-500 text-sm"
                              />
                              <div className="mt-2">
                                <h4>Answers</h4>
                                {Array.from({ length: 4 }, (_, answerIndex) => (
                                  <div key={answerIndex} className="flex items-center mb-2">
                                    <input
                                      type="text"
                                      name={`questions[${index}].answers[${answerIndex}].text`}
                                      placeholder={`Answer ${answerIndex + 1}`}
                                      className="input rounded-lg w-full mr-2 px-3 py-2"
                                      onChange={e =>
                                        handleChange({
                                          target: {
                                            ...e.target,
                                            name: `questions[${index}].answers[${answerIndex}].text`,
                                          },
                                        })
                                      }
                                    />
                                    <input
                                      type="radio"
                                      name={`questions[${index}].isCorrect`}
                                      value={answerIndex}
                                      onChange={handleChange}
                                      className="mr-2"
                                    />
                                    <label htmlFor={`questions[${index}].answers[${answerIndex}].isCorrect`}>
                                      Correct Answer
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>

                        <button
                          type="button"
                          className="bg-blue-500 rounded-xl px-4 py-2 text-white font-bold hover:bg-blue-700"
                          onClick={() => createFrame(values)}
                        >
                          Create Frame
                        </button>
                      </Form>
                    )}
                  </Formik>
                </div>
                {/* <form className="flex flex-col justify-evenly">
                  <label htmlFor="frameName">Frame Name:</label>
                  <input
                    type="text"
                    id="frameName"
                    name="frame.name"
                    value={frameData.frame.name}
                    onChange={handleChange}
                  />
                  <button type="button" className="bg-secondary rounded-xl px-2 py-1 font-bold" onClick={createFrame}>
                    Create Frame
                  </button>
                </form> */}
              </div>
              <div className="flex flex-col border border-white px-4 py-2 rounded-xl mt-6">
                {data ? (
                  <div>
                    {/* {
                      <ul>
                        {data.frames.length}
                        {data.frames.map(frame => (
                          <li key={frame.id}>IPFS Pin Hash: {frame.ipfs_pin_hash}</li>
                        ))}
                      </ul>
                    } */}
                    <div>You havent created any Frames yet. </div>
                  </div>
                ) : (
                  <div>You havent created any Frames yet. </div>
                )}
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

export default Dashboard;
