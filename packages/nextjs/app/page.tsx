"use client";

// import React, { useEffect, useState } from "react";
// import Link from "next/link";
import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import type { NextPage } from "next";
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

const validationSchema = Yup.object().shape({
  userName: Yup.string().required("Username is required"),
  numQuestions: Yup.number().min(1, "Minimum 1 question").required("Number of questions is required"),
});

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

const apiUrl = `http://${process.env.NEXT_PUBLIC_APP_API_URL}/frames`;

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  // const [frameData, setFrameData] = useState<FrameData>({
  //   frame: {
  //     name: "Test",
  //     pages: [
  //       { question: "What is your name?", options: ["Alice", "Bob", "Charlie"] },
  //     ],
  //   },
  //   owner: "0x99ccAa5a770051C6ca30709E7c73204c7b10b8d9",
  // });

  const createFrame = async (initialData: QuizValues) => {
    try {
      console.log(apiUrl);
      const newFrameMetadata = {
        frame: {
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
                        <Field type="text" name="farcasterId" placeholder="Farcaster Id" />
                        <Field type="text" name="userName" placeholder="Enter Username" />
                        <ErrorMessage name="userName" component="div" className="error" />
                        <Field type="number" name="numQuestions" placeholder="Number of Questions" />
                        <ErrorMessage name="numQuestions" component="div" className="error" />

                        <div>{JSON.stringify(values)}</div>

                        <div>
                          {Array.from({ length: values.numQuestions }, (_, index) => (
                            <div key={index} className="my-6">
                              <h3>Question {index + 1}</h3>
                              <Field
                                type="text"
                                name={`questions[${index}].title`}
                                placeholder="Enter Question Title"
                              />
                              <ErrorMessage name={`questions[${index}].title`} component="div" className="error" />
                              <div>
                                <h4>Answers</h4>
                                {Array.from({ length: 4 }, (_, answerIndex) => (
                                  <div key={answerIndex}>
                                    <input
                                      type="text"
                                      name={`questions[${index}].answers[${answerIndex}].text`}
                                      placeholder={`Answer ${answerIndex + 1}`}
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

                        {/* <button type="submit">Generate Quiz</button> */}
                        <button
                          type="button"
                          className="bg-secondary rounded-xl px-2 py-1 font-bold my-2"
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
