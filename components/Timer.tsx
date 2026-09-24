'use client';

import { useEffect, useState } from "react";
import Image from "next/image";

export default function Timer({ setBgColor, started }: { setBgColor: (color: string) => void, started:boolean }) {
    const [time, setTime] = useState<number>(25 * 60);       // Focus = 25 min
    const [breakTime, setBreakTime] = useState<number>(5 * 60); // Break = 5 min
    const [run, setRun] = useState<boolean>(true);
    const [focusMode, setMode] = useState<boolean>(true);
    const [totalTimeElapsed, setTotalTime] = useState<number>(0);       // Focus = 25 min



    useEffect(() => {
        if(!started) return;



        let interval: NodeJS.Timeout | null = null;

        if (run) {
            if (focusMode) {
                interval = setInterval(() => {
                    setTime(prev => (prev > 0 ? prev - 1 : 0));
                    setTotalTime(x => (x+1));
                }, 1000);
            } else {
                interval = setInterval(() => {
                    setBreakTime(prev => (prev > 0 ? prev - 1 : 0));

                }, 1000);
            }
        }

        return () => {
            if (interval) clearInterval(interval);
        };
        
    }, [run, focusMode, started]); // 👈 include focusMode

    useEffect(() => {
        if (focusMode && time === 0) {
            const audio = new Audio('/breaktime.mp3');
            audio.play();
            setTime(1500);
            setMode(false);
            setBgColor('red-50');


        }

        if (!focusMode && breakTime === 0) {
            const audio = new Audio('/alarm.wav');
            audio.play();
            setBreakTime(300);
            setMode(true);
            setBgColor('blue-50');


        }
    }, [time, breakTime, focusMode]);

    function makeTimeGood(num: number | undefined) {
        if (!num) return "0m 0s";
        const totalTime = Math.floor(num);
        const m = Math.floor((totalTime % 3600) / 60);
        const s = totalTime % 60;
        return `${m}m ${s}s`;
    }
    function makeTimeGoodHr(num: number | undefined) {
        if (!num) return "0h 0m 0s";
        const totalTime = Math.floor(num);
        const m = Math.floor((totalTime % 3600) / 60);
        const s = totalTime % 60;
        const h = Math.floor(totalTime/3600);
        return `${h}h ${m}m ${s}s`;
    }

    const radius = 90;
    const circumference = 2 * Math.PI * radius;
    const offset1 = circumference - (time / 1500) * circumference;
    const offset2 = circumference - (breakTime / 300) * circumference;

    return (
        <div className="mt-0 relative">
            
            {/* Toggle Buttons */}
            <div className="w-full text-xs flex justify-around mb-3 mt-0">
                <button
                    className={`text-sm text-blue-900 pt-4 p-2 w-1/2 ${focusMode ? 'border-none' : 'bg-blue-50 border-b border-r border-gray-300 '}`}
                    onClick={() => { setMode(true); setBgColor('blue-50'); }}>
                    Focus
                </button>
                <button
                    className={`text-sm text-red-900 pt-4 p-2 w-1/2 ${focusMode ? 'bg-red-50 border-b border-l border-gray-300 ' : 'border-none'}`}
                    onClick={() => { setMode(false); setBgColor('red-50'); }}>
                    Break
                </button>
            </div>

            {/* Focus Section */}
            {focusMode && (
                <div className="h-50 rounded-2xl w-full flex flex-col justify-center items-center text-blue-900">
                    <div className="h-55 w-55   border-gray-500 flex flex-col items-center justify-center">
                        <div className="flex flex-col justify-center items-center relative">
                            <svg className="w-55 h-55 transform -rotate-90  absolute">
                                {/* Background circle */}
                                <circle cx="110" cy="110" r={radius} stroke="" strokeWidth="10" fill="transparent" />
                                {/* Progress circle */}
                                <circle cx="110" cy="110" r={radius} stroke="darkblue" strokeWidth="10" fill="transparent" strokeDasharray={circumference} strokeDashoffset={offset1} strokeLinecap="round" className="transition-all duration-500" />
                            </svg>
                            <p className="text-xl mt-5">{makeTimeGood(time)}</p>
                            <button className={`mt-2 z-100 ${run ? 'block' : 'hidden'}`} onClick={() => setRun(false)}>
                                <Image src={'/pause.png'} alt="pause" width={35} height={35} unoptimized/>
                            </button>
                            <button className={`mt-2 z-100 ${run ? 'hidden' : 'block'}`} onClick={() => setRun(true)}>
                                <Image src={'/play.png'} alt="resume" width={35} height={35} unoptimized/>
                            </button>

                        </div>


                    </div>
                </div>
            )}

            {/* Break Section */}
            {!focusMode && (
                <div className="h-50 rounded-2xl w-full flex flex-col justify-center items-center text-red-900">
                    <div className="h-55 w-55   border-gray-500 flex flex-col items-center justify-center">
                        <div className="flex flex-col justify-center items-center relative">
                            <svg className="w-55 h-55 transform -rotate-90  absolute">
                                {/* Background circle */}
                                <circle cx="110" cy="110" r={radius} stroke="" strokeWidth="10" fill="transparent" />
                                {/* Progress circle */}
                                <circle cx="110" cy="110" r={radius} stroke="darkred" strokeWidth="10" fill="transparent" strokeDasharray={circumference} strokeDashoffset={offset2} strokeLinecap="round" className="transition-all duration-500" />
                            </svg>
                            <p className="text-xl mt-5">{makeTimeGood(breakTime)}</p>
                            <button className={`mt-2 z-100 ${run ? '' : 'hidden'}`} onClick={() => setRun(false)}>
                                <Image src={'/pause.png'} alt="pause" width={35} height={35} unoptimized/>
                            </button>
                            <button className={`mt-2 z-100 ${run ? 'hidden' : ''}`} onClick={() => setRun(true)}>
                                <Image src={'/play.png'} alt="resume" width={35} height={35} unoptimized/>
                            </button>

                        </div>


                    </div>
                </div>
            )}
            <p className="mt-3 text-[8px] text-center">Total Focused Time: {makeTimeGoodHr(totalTimeElapsed)}</p>
        </div>
    );
}
