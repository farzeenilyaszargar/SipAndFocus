'use client';

import Timer from "./Timer";
import ToDo from "./ToDo";


export default function Main() {
    return (
        <div className="mt-12 flex w-screen justify-center px-4 sm:mt-16">
            <div className="max-h-[calc(100vh-10rem)] w-[min(92vw,24rem)] overflow-y-auto rounded-[2rem] border border-white/70 bg-white/85 text-black shadow-2xl shadow-black/20 backdrop-blur-md">
                <Timer />
                <div className="mx-6 border-t border-slate-200/80">
                    <ToDo />
                </div>
            </div>
        </div>
    );
}
