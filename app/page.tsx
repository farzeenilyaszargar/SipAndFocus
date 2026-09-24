'use client';


import Header from "@/components/Header";
import Main from "@/components/Main";
import MusicPlayer from "@/components/MusicPlayer";
import Obstacle from "@/components/Shadow";
import { useState } from "react";

export default function Home() {
  const [started, setStarted] = useState(false);

  return (


    <div className="font-main h-screen bg-[url('/art.gif')] bg-center bg-cover text-white ">
      <Obstacle />
      {
        !started ?
          (
            <div className="top-4/9 left-1/3 w-1/3 absolute z-101 bg-black opacity-70 flex justify-center items-center rounded-2xl ">
              <button className="text-2xl rounded-2xl text-white p-3 pl-10 pr-10  " onClick={() => setStarted(true)}>Start</button>
            </div>) :
          (<></>)
      }
      <Header />
      <Main start={started} />
      <MusicPlayer start={started} />


    </div>
  );
}
