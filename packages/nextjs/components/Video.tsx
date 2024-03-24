import { useState } from "react";
import Container from "./Container";

const Video = () => {
  const [playVideo, setPlayVideo] = useState(true);
  return (
    <Container>
      <div className="w-full h-screen mx-auto overflow-hidden rounded-2xl flex flex-col justify-around">
        <div
          onClick={() => setPlayVideo(!playVideo)}
          className="flex flex-row mx-auto justify-around relative cursor-pointer lg:mb-20 w-4/5 lg:w-3/5 h-1/2"
        >
          {!playVideo && (
            <button className=" inset-auto w-16 h-16 text-white lg:w-28 lg:h-28">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-16 h-16  lg:w-28 lg:h-28"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="sr-only">Play Video</span>
            </button>
          )}
          {playVideo && (
            <iframe
              //   src="https://www.youtube-nocookie.com/embed/aOq49euWnIo?controls=0&autoplay=1"
              src="https://www.youtube-nocookie.com/embed/0XhNM_2gYBQ?si=iZ56txUE2yhCwaAT"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded-lg"
            ></iframe>
          )}
        </div>
      </div>
    </Container>
  );
};

export default Video;
