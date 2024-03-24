"use client";

// @ts-nocheck
import React, { useEffect, useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";

// interface FormValues {
//   userName: string;
//   numQuestions: number;
//   questions: Question[];
// }

// interface Question {
//   title: string;
//   answers: Answer[];
// }

// interface Answer {
//   text: string;
//   isCorrect: boolean;
// }

// const initialValues = {
//   userName: "",
//   numQuestions: 0,
//   questions: [],
// };

// /**
//  * This function defines the validation schema for the quiz generator form using Yup's schema builder.
//  *
//  * @returns Yup.ObjectSchema - The validation schema for the form.
//  */
// export const createQuestionSchema = (): Yup.ObjectSchema<FormValues> => {
//   const questionSchema = Yup.object().shape({
//     title: Yup.string().required("Question title is required"),
//     answers: Yup.array(
//       Yup.object().shape({
//         text: Yup.string().required("Answer text is required"),
//         isCorrect: Yup.boolean().required("Correct answer is required"),
//       }),
//     )
//       .min(4, "Minimum 4 answers required")
//       .max(10, "Maximum 10 answers allowed")
//       .required("Question must have answers"),
//   });

//   return Yup.object().shape({
//     userName: Yup.string().required("Username is required"),
//     numQuestions: Yup.number()
//       .required("Number of questions is required")
//       .min(1, "Minimum 1 question allowed")
//       .max(10, "Maximum 10 questions allowed")
//       .when("numQuestions", {
//         is: (numQuestions: number) => numQuestions > 0,
//         // No need for of here
//       }),
//     questions: Yup.array().when("numQuestions", {
//       is: (numQuestions: number) => numQuestions > 0,
//       then: schema => schema.of(questionSchema), // Provide only questionSchema
//     }),
//   });
// };

interface QuizQuestion {
  title: string;
  answers: { text: string; isCorrect: boolean }[];
}

const initialValues: {
  userName: string;
  numQuestions: number;
  questions: QuizQuestion[];
} = {
  userName: "",
  numQuestions: 1,
  questions: [],
};

const validationSchema = Yup.object().shape({
  userName: Yup.string().required("Username is required"),
  numQuestions: Yup.number().min(1, "Minimum 1 question").required("Number of questions is required"),
});

const QuizForm = () => {
  // useEffect(() => {
  //   // Code to execute when values change
  // }, [values]);
  return (
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
            <Field type="text" name="userName" placeholder="Enter Username" />
            <ErrorMessage name="userName" component="div" className="error" />
            <Field type="number" name="numQuestions" placeholder="Number of Questions" />
            <ErrorMessage name="numQuestions" component="div" className="error" />

            <div>{JSON.stringify(values)}</div>

            {/* {({ values, handleChange }) => ( */}
            <div>
              {Array.from({ length: values.numQuestions }, (_, index) => (
                <div key={index}>
                  <h3>Question {index + 1}</h3>
                  <Field type="text" name={`questions[${index}].title`} placeholder="Enter Question Title" />
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
                        <label htmlFor={`questions[${index}].answers[${answerIndex}].isCorrect`}>Correct Answer</label>
                      </div>
                    ))}
                    {/* {Array.from({ length: 4 }, (_, answerIndex) => (
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
                        <Field
                          type="radio"
                          name={`questions[${index}].answers[${answerIndex}].isCorrect`}
                          value={answerIndex}
                          onChange={e =>
                            handleChange({
                              target: {
                                ...e.target,
                                name: `questions[${index}].answers[${answerIndex}].isCorrect`,
                              },
                            })
                          }
                        />
                        <label htmlFor={`questions[${index}].answers[${answerIndex}].isCorrect`}>Correct Answer</label>
                      </div>
                    ))} */}
                  </div>
                </div>
              ))}
            </div>
            {/* )} */}

            <button type="submit">Generate Quiz</button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default QuizForm;
