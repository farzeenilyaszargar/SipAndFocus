'use client';

import { useEffect, useState } from "react";
import Image from "next/image";

const TOTAL_STORAGE_KEY = "studyTotalSeconds";
const STATS_STORAGE_KEY = "studyTimeStats";

type StoredStudyStats = {
    dateKey: string;
    weekKey: string;
    todaySeconds: number;
    weekSeconds: number;
    totalSeconds: number;
};

function getDateKey(date: Date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function getWeekKey(date: Date) {
    const monday = new Date(date);
    const day = monday.getDay();
    const daysSinceMonday = day === 0 ? 6 : day - 1;

    monday.setDate(monday.getDate() - daysSinceMonday);
    return getDateKey(monday);
}

function formatTime(totalSeconds: number) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [hours, minutes, seconds]
        .map((value) => value.toString().padStart(2, "0"))
        .join(":");
}

export default function Timer({ started }: { started: boolean }) {
    const [sessionSeconds, setSessionSeconds] = useState(0);
    const [totalSeconds, setTotalSeconds] = useState(0);
    const [todaySeconds, setTodaySeconds] = useState(0);
    const [weekSeconds, setWeekSeconds] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [hasLoaded, setHasLoaded] = useState(false);

    useEffect(() => {
        const now = new Date();
        const currentDateKey = getDateKey(now);
        const currentWeekKey = getWeekKey(now);
        const savedStats = window.localStorage.getItem(STATS_STORAGE_KEY);
        const legacyTotal = window.localStorage.getItem(TOTAL_STORAGE_KEY);
        const parsedLegacyTotal = legacyTotal ? Number.parseInt(legacyTotal, 10) : 0;

        let stats: StoredStudyStats | null = null;
        try {
            stats = savedStats ? JSON.parse(savedStats) as StoredStudyStats : null;
        } catch {
            stats = null;
        }

        const storedTotal = stats?.totalSeconds ?? parsedLegacyTotal;
        setTotalSeconds(Number.isFinite(storedTotal) && storedTotal >= 0 ? storedTotal : 0);

        if (stats?.dateKey === currentDateKey) {
            setTodaySeconds(stats.todaySeconds);
        }

        if (stats?.weekKey === currentWeekKey) {
            setWeekSeconds(stats.weekSeconds);
        }
        setHasLoaded(true);
    }, []);

    useEffect(() => {
        if (started && hasLoaded) {
            setIsRunning(true);
        }
    }, [started, hasLoaded]);

    useEffect(() => {
        if (!isRunning) return;

        const interval = window.setInterval(() => {
            setSessionSeconds((currentTime) => currentTime + 1);
            setTotalSeconds((currentTime) => currentTime + 1);
            setTodaySeconds((currentTime) => currentTime + 1);
            setWeekSeconds((currentTime) => currentTime + 1);
        }, 1000);

        return () => window.clearInterval(interval);
    }, [isRunning]);

    useEffect(() => {
        if (hasLoaded) {
            const now = new Date();
            const stats: StoredStudyStats = {
                dateKey: getDateKey(now),
                weekKey: getWeekKey(now),
                todaySeconds,
                weekSeconds,
                totalSeconds,
            };

            window.localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
            window.localStorage.setItem(TOTAL_STORAGE_KEY, totalSeconds.toString());
        }
    }, [todaySeconds, weekSeconds, totalSeconds, hasLoaded]);

    function reset() {
        setIsRunning(false);
        setSessionSeconds(0);
    }

    return (
        <div className="flex flex-col items-center px-6 pb-6 pt-7 text-slate-900">
            <div className="mb-6 flex w-full items-center justify-between">
                <div>
                    <p className="text-[9px] uppercase tracking-[0.25em] text-slate-400">Focus</p>
                    <p className="mt-1 text-sm">Study session</p>
                </div>
                <span className={`h-2 w-2 rounded-full ${isRunning ? "bg-emerald-500" : "bg-slate-300"}`} />
            </div>

            <p className="text-5xl tabular-nums tracking-tight text-slate-800">{formatTime(sessionSeconds)}</p>
            <p className="mt-3 text-[9px] uppercase tracking-[0.2em] text-slate-400">
                {isRunning ? "In progress" : "Ready when you are"}
            </p>

            <div className="mt-6 flex items-center gap-3">
                <button
                    aria-label={isRunning ? "Pause stopwatch" : "Start stopwatch"}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 p-2 shadow-lg shadow-slate-900/20 transition-transform hover:scale-105"
                    onClick={() => setIsRunning((running) => !running)}
                >
                    <Image
                        src={isRunning ? "/pause.png" : "/play.png"}
                        alt={isRunning ? "Pause" : "Start"}
                        width={35}
                        height={35}
                        className="brightness-0 invert"
                        unoptimized
                    />
                </button>
                <button
                    className="rounded-full border border-slate-200 px-4 py-3 text-[9px] text-slate-500 transition-colors hover:border-slate-400 hover:text-slate-800"
                    onClick={reset}
                >
                    Reset
                </button>
            </div>

            <div className="mt-7 grid w-full grid-cols-3 divide-x divide-slate-200 border-t border-slate-200 pt-5 text-center">
                <div>
                    <p className="text-[8px] uppercase tracking-wide text-slate-400">Today</p>
                    <p className="mt-2 text-[10px] text-slate-700">{formatTime(todaySeconds)}</p>
                </div>
                <div>
                    <p className="text-[8px] uppercase tracking-wide text-slate-400">Week</p>
                    <p className="mt-2 text-[10px] text-slate-700">{formatTime(weekSeconds)}</p>
                </div>
                <div>
                    <p className="text-[8px] uppercase tracking-wide text-slate-400">Total</p>
                    <p className="mt-2 text-[10px] text-slate-700">{formatTime(totalSeconds)}</p>
                </div>
            </div>
        </div>
    );
}
