'use client';

import Timer from "./Timer";
import ToDo from "./ToDo";


export default function Main({start}:{start:boolean}) {
    return (
        <div className="flex justify-center items-center w-screen mt-20">
            <div className="h-130 w-90 space-y-3 overflow-y-auto rounded-2xl bg-blue-50 text-black opacity-80 duration-200 transition-all">
                <Timer started={start}/>
                <ToDo />
            </div>
        </div>
    );
}
