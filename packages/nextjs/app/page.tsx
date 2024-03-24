"use client";

import type { NextPage } from "next";
import Hero from "~~/components/Hero";
import SectionTitle from "~~/components/SectionTitle";
import Video from "~~/components/Video";

const Home: NextPage = () => {
  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <Hero />
        <div className="mt-48"></div>
        <SectionTitle pretitle="Watch a video" title="Learn how to create polls">
          This video showcases a demo of setup and interaction with poll through our web app. This MVP was created for
          the EthGlobal Farcaster Frames hackathon.
        </SectionTitle>
        <Video />
      </div>
    </>
  );
};

export default Home;
