import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
    format,
    subDays,
    startOfWeek,
    endOfYear,
    getDay,
    getMonth,
    isSameYear
} from "date-fns";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import { useLazyGetDashboardDataQuery } from "../../services/dashboardApi";

// Bigger cells
const CELL = 24;
const GAP = 6;
const CELL_TOTAL = CELL + GAP;

const toKey = (d) => format(new Date(d), "yyyy-MM-dd");

const create365DayData = (apiData, baseDate) => {
    const map = new Map();
    apiData?.forEach((x) => {
        map.set(toKey(x.date), {
            date: new Date(x.date),
            count: Number(x.amount || 0),
            type: (x.type || "none").toLowerCase(),
        });
    });

    const out = [];
    for (let i = 0; i < 365; i++) {
        const d = subDays(baseDate, 364 - i);
        out.push(map.get(toKey(d)) || { date: d, type: "none", count: 0 });
    }
    return out;
};

const shade = (c) => {
    if (c < 500) return 200;
    if (c < 1000) return 300;
    if (c < 5000) return 500;
    return 700;
};

const getColor = (type, count) => {
    if (type === "none" || count === 0) return "bg-gray-200";
    const s = shade(count);
    return type === "credit" ? `bg-green-${s}` : `bg-red-${s}`;
};

const FinancialActivityGrid = ({ yearOffset = 0 }) => {
    const today = new Date();
    const { access_token } = useSelector((s) => s.auth);
    const [fetchActivity] = useLazyGetDashboardDataQuery();

    const [raw, setRaw] = useState([]);
    const [loading, setLoading] = useState(true);

    const baseDate = yearOffset === 0
        ? today
        : endOfYear(subDays(today, 365 * yearOffset));

    useEffect(() => {
        let active = true;
        const load = async () => {
            setLoading(true);

            try {
                const result = await fetchActivity({
                    access_token,
                    type: "activity_grid",
                    path: "activity",
                    startDate: format(subDays(baseDate, 364), "yyyy-MM-dd"),
                    endDate: format(baseDate, "yyyy-MM-dd")
                }).unwrap();

                if (!active) return;
                setRaw(result?.data || result || []);
            } catch (err) {
                console.error("Failed:", err);
                if (active) setRaw([]);
            } finally {
                if (active) setLoading(false);
            }
        };
        load();
        return () => { active = false };
    }, [access_token, fetchActivity, baseDate]);

    const days = useMemo(() => create365DayData(raw, baseDate), [raw, baseDate]);

    const weeks = useMemo(() => {
        if (!days.length) return [];
        const f = days[0].date;
        const pad = getDay(startOfWeek(f, { weekStartsOn: 0 }));

        const arr = [];
        let w = Array(pad).fill(null);

        days.forEach(d => {
            if (w.length === 7) {
                arr.push(w);
                w = [];
            }
            w.push(d);
        });

        while (w.length < 7) w.push(null);
        arr.push(w);

        return arr;
    }, [days]);

    const monthLabels = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    const monthHeaders = useMemo(() => {
        let curMonth = -1;
        const out = [];

        weeks.forEach((w, i) => {
            const d = w.find(x => x);
            if (!d) return;

            const m = getMonth(d.date);
            if (m !== curMonth) {
                out.push({ index: i, label: monthLabels[m] });
                curMonth = m;
            }
        });

        return out;
    }, [weeks]);

    if (loading)
        return (
            <div className="flex justify-center items-center h-40">
                <Loader2 className="w-6 h-6 animate-spin text-red-500" />
            </div>
        );

    const totalWidth = weeks.length * CELL_TOTAL;

    return (
        <div className="w-full">
            {/* SCROLL AREA */}
            <div
                className="overflow-x-auto bg-white shadow-inner border border-gray-200 p-3 rounded-lg"
                style={{ WebkitOverflowScrolling: "touch" }}
            >
                {/* Month labels INSIDE scroll container */}
                <div
                    className="relative h-6 mb-2"
                    style={{ minWidth: totalWidth }}
                >
                    {monthHeaders.map((m) => (
                        <div
                            key={m.label + m.index}
                            className="absolute text-xs font-semibold text-gray-700"
                            style={{
                                left: m.index * CELL_TOTAL,
                                whiteSpace: "nowrap",
                            }}
                        >
                            {m.label}
                        </div>
                    ))}
                </div>

                <div
                    className="flex"
                    style={{ minWidth: totalWidth }}
                >
                    {/* Day labels */}
                    <div className="flex flex-col text-xs text-gray-500 mr-3 space-y-1">
                        <span>Sun</span>
                        <span>Mon</span>
                        <span>Tue</span>
                        <span>Wed</span>
                        <span>Thu</span>
                        <span>Fri</span>
                        <span>Sat</span>
                    </div>

                    {/* GRID */}
                    <div className="flex">
                        {weeks.map((week, wi) => (
                            <div key={wi} className="flex flex-col space-y-1 mr-1">
                                {week.map((d, di) => (
                                    <div
                                        key={di}
                                        className={`rounded-sm w-[${CELL}px] h-[${CELL}px] ${
                                            d ? getColor(d.type, d.count) : "bg-gray-100"
                                        }`}
                                        title={d ? `${format(d.date, "MMM d")} - ${d.type} (${d.count})` : ""}
                                        style={{
                                            width: CELL,
                                            height: CELL,
                                        }}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinancialActivityGrid;
