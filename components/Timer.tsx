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
        <div className="relative mt-0 flex flex-col items-center px-4 pb-5 pt-4 text-blue-950">
            <p className="mb-4 text-[10px] uppercase tracking-wide">Study stopwatch</p>

            <div className="flex h-55 w-55 flex-col items-center justify-center rounded-full border-8 border-blue-900/80 bg-blue-50/70 shadow-inner">
                <p className="text-2xl tabular-nums">{formatTime(sessionSeconds)}</p>
                <p className="mt-2 text-[8px] uppercase tracking-wide">
                    {isRunning ? "Studying" : "Paused"}
                </p>
            </div>

            <div className="mt-5 flex items-center gap-5">
                <button
                    aria-label={isRunning ? "Pause stopwatch" : "Start stopwatch"}
                    className="rounded-full p-2 transition-transform hover:scale-110"
                    onClick={() => setIsRunning((running) => !running)}
                >
                    <Image
                        src={isRunning ? "/pause.png" : "/play.png"}
                        alt={isRunning ? "Pause" : "Start"}
                        width={35}
                        height={35}
                        unoptimized
                    />
                </button>
                <button
                    className="rounded-xl border border-blue-900/40 px-3 py-2 text-[9px] transition-colors hover:bg-blue-100"
                    onClick={reset}
                >
                    Reset
                </button>
            </div>

            <div className="mt-5 grid w-full grid-cols-2 gap-2 text-center text-[8px]">
                <p>Today: {formatTime(todaySeconds)}</p>
                <p>This week: {formatTime(weekSeconds)}</p>
            </div>
            <p className="mt-2 text-[9px]">Total study time: {formatTime(totalSeconds)}</p>
        </div>
    );
}
