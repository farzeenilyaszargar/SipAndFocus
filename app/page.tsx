'use client';


import Header from "@/components/Header";
import Main from "@/components/Main";
import MusicPlayer from "@/components/MusicPlayer";
import Obstacle from "@/components/Shadow";
import { useState } from "react";

export default function Home() {
  const [started, setStarted] = useState(false);

  return (


    <div className="font-main relative h-screen overflow-hidden bg-[url('/art.gif')] bg-center bg-cover text-white ">
      <Obstacle />
      {
        !started ?
          (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 px-6 backdrop-blur-sm">
              <div className="w-full max-w-xs rounded-[2rem] border border-white/20 bg-slate-950/85 p-8 text-center text-white shadow-2xl">
                <p className="text-[9px] uppercase tracking-[0.3em] text-slate-400">Sip&apos;n Focus</p>
                <h1 className="mt-4 text-lg">Ready to study?</h1>
                <p className="mt-3 text-[9px] leading-5 text-slate-300">Start your stopwatch and make this session count.</p>
                <button
                  className="mt-7 w-full rounded-full bg-white px-6 py-3 text-[10px] text-slate-900 transition-transform hover:scale-[1.02]"
                  onClick={() => setStarted(true)}
                >
                  Start session
                </button>
              </div>
            </div>) :
          (<></>)
      }
      <Header />
      <Main start={started} />
      <MusicPlayer start={started} />


    </div>
  );
}
