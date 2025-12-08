import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
    format,
    startOfWeek,
    addDays,
    startOfYear,
    endOfYear,
    differenceInCalendarDays,
    getDay,
    getMonth,
} from "date-fns";
import { Loader2 } from "lucide-react";
import { useLazyGetDashboardDataQuery } from "../../services/dashboardApi";
import { useSelector } from "react-redux";
import Card from "../Charts/Card";

/* -------------------------
   CONFIG: cell sizing & spacing
   ------------------------- */
const CELL = 20; // px cell size
const GAP = 6; // px gap between week columns
const COLUMN_TOTAL = CELL + GAP;

/* -------------------------
   Color logic (transaction_type + thresholds)
   thresholds: <500, <1000, <5000, >=5000
   ------------------------- */
const getShade = (count) => {
    if (count < 500) return 200;
    if (count < 1000) return 400;
    if (count < 5000) return 600;
    return 800;
};

const getColorClass = (type, count) => {
    if (!type || type === "none" || !count) return "bg-gray-200 hover:bg-gray-300";
    const shade = getShade(count);
    const hoverShade = shade === 800 ? 900 : shade + 100;
    if (type === "credit") return `bg-green-${shade} hover:bg-green-${hoverShade}`;
    if (type === "debit") return `bg-red-${shade} hover:bg-red-${hoverShade}`;
    return "bg-gray-200 hover:bg-gray-300";
};

/* -------------------------
   Tooltip (inline)
   ------------------------- */
const Tooltip = ({ x, y, data }) => {
    if (!data) return null;
    const formattedDate = format(data.date, "MMM d, yyyy");
    return (
        <div
            className="fixed pointer-events-none bg-gray-900 text-white text-xs rounded px-2 py-1 shadow-lg z-50"
            style={{
                top: Math.max(8, y - 36),
                left: x,
                transform: "translateX(-50%)",
                whiteSpace: "nowrap",
            }}
        >
            <div className="font-medium">{formattedDate}</div>
            <div className="mt-0.5 text-[12px]">
                {data.type === "none"
                    ? "No Activity"
                    : `${data.type === "credit" ? "Income" : "Expense"} ₹${Number(data.count).toFixed(2)}`}
            </div>
        </div>
    );
};

/* -------------------------
   Helpers
   ------------------------- */
const toKey = (d) => format(new Date(d), "yyyy-MM-dd");

const mapApiToYear = (apiData = []) => {
    const map = new Map();
    (apiData || []).forEach((item) => {
        if (!item || !item.date) return;
        const key = toKey(item.date);
        const amt = Number(item.amount || 0);
        const t = (item.transaction_type || item.type || "none").toLowerCase();

        const existing = map.get(key);
        if (!existing) {
            map.set(key, { date: new Date(item.date), count: amt, type: t });
        } else {
            const newCount = Number(existing.count || 0) + amt;
            // choose dominant type by absolute count (simple heuristic)
            let dominantType = existing.type;
            if (Math.abs(amt) > Math.abs(existing.count || 0)) dominantType = t;
            map.set(key, { date: new Date(item.date), count: newCount, type: dominantType });
        }
    });
    return map;
};

/* -------------------------
   YearHeatmapGrid Component
   - renders full Jan-Dec for selected year
   - month labels and vertical separators inside scroll
   ------------------------- */
const YearHeatmapGrid = ({ year, fetchActivityData, access_token }) => {
    const [rawData, setRawData] = useState([]);
    const [loading, setLoading] = useState(true);

    // fetch Jan 1 -> Dec 31 of the year
    useEffect(() => {
        let active = true;
        const load = async () => {
            setLoading(true);
            try {
                const start = format(startOfYear(new Date(Number(year), 0, 1)), "yyyy-MM-dd");
                const end = format(endOfYear(new Date(Number(year), 0, 1)), "yyyy-MM-dd");

                const res = await fetchActivityData({
                    access_token,
                    type: "activity_grid",
                    path: "activity",
                    startDate: start,
                    endDate: end,
                }).unwrap();

                if (!active) return;
                setRawData(Array.isArray(res) ? res : res?.data || []);
            } catch (err) {
                console.error("Failed to fetch year activity:", err);
                if (active) setRawData([]);
            } finally {
                if (active) setLoading(false);
            }
        };

        load();
        return () => {
            active = false;
        };
    }, [year, fetchActivityData, access_token]);

    // build days for the year (Jan 1 -> Dec 31)
    const yearStart = useMemo(() => startOfYear(new Date(Number(year), 0, 1)), [year]);
    const yearEnd = useMemo(() => endOfYear(new Date(Number(year), 0, 1)), [year]);
    const totalDays = useMemo(() => differenceInCalendarDays(yearEnd, yearStart) + 1, [yearStart, yearEnd]);
    const yearDays = useMemo(() => Array.from({ length: totalDays }, (_, i) => addDays(yearStart, i)), [yearStart, totalDays]);

    // map API
    const apiMap = useMemo(() => mapApiToYear(rawData), [rawData]);

    // create daysWithData aligned with yearDays
    const daysWithData = useMemo(() => yearDays.map((d) => apiMap.get(toKey(d)) || { date: d, count: 0, type: "none" }), [yearDays, apiMap]);

    // compute weeks starting from the Sunday on or before Jan 1
    const { weeks, weekStartDate } = useMemo(() => {
        const startCol = startOfWeek(yearStart, { weekStartsOn: 0 });
        const totalDaysSpan = differenceInCalendarDays(yearEnd, startCol) + 1;
        const totalWeeks = Math.ceil(totalDaysSpan / 7);

        const weeksArr = Array.from({ length: totalWeeks }, (_, wi) => {
            const weekStart = addDays(startCol, wi * 7);
            return Array.from({ length: 7 }, (_, di) => {
                const day = addDays(weekStart, di);
                if (day.getFullYear() !== Number(year)) return null;
                const idx = differenceInCalendarDays(day, yearStart);
                if (idx < 0 || idx >= yearDays.length) return null;
                return daysWithData[idx];
            });
        });

        return { weeks: weeksArr, weekStartDate: startCol };
    }, [yearStart, yearEnd, daysWithData, year, yearDays]);

    // compute month metadata (startWeek and spanWeeks)
    const monthMeta = useMemo(() => {
        const meta = [];
        for (let m = 0; m < 12; m++) {
            const monthStart = new Date(Number(year), m, 1);
            const monthEnd = new Date(Number(year), m + 1, 0);
            const firstWeekIdx = Math.floor(differenceInCalendarDays(monthStart, weekStartDate) / 7);
            const lastWeekIdx = Math.floor(differenceInCalendarDays(monthEnd, weekStartDate) / 7);
            const span = Math.max(1, lastWeekIdx - firstWeekIdx + 1);
            meta.push({
                month: m,
                label: format(monthStart, "MMM"),
                startWeek: firstWeekIdx,
                spanWeeks: span,
            });
        }
        return meta;
    }, [year, weekStartDate]);

    // precompute separators: a Set of week indices where a vertical separator should appear (before start of month, excluding Jan)
    const separatorWeeks = useMemo(() => {
        const s = new Set();
        monthMeta.forEach((m) => {
            if (m.month > 0) {
                s.add(m.startWeek); // draw separator at this week's left edge
            }
        });
        return s;
    }, [monthMeta]);

    // tooltip
    const [hover, setHover] = useState({ x: 0, y: 0, data: null });
    const onEnter = useCallback((e, day) => {
        if (!day) return;
        const rect = e.currentTarget.getBoundingClientRect();
        setHover({ x: rect.left + rect.width / 2, y: rect.top, data: day });
    }, []);
    const onLeave = useCallback(() => setHover({ x: 0, y: 0, data: null }), []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-44 w-full">
                <Loader2 className="w-6 h-6 animate-spin text-red-500" />
                <span className="ml-3 text-gray-600">Loading year activity...</span>
            </div>
        );
    }

    const totalWeeks = weeks.length;
    const scrollMinWidth = totalWeeks * COLUMN_TOTAL;

    return (
        <div className="w-full">
            <div
                className="overflow-x-auto overflow-y-hidden bg-white border border-gray-200 rounded-lg p-3 shadow-inner"
                style={{ WebkitOverflowScrolling: "touch" }}
            >
                {/* Month labels row */}
                {/* Month labels row */}
                <div
                    className="relative mb-2"
                    style={{ minWidth: scrollMinWidth, paddingLeft: 68 }}
                >
                    {monthMeta.map((m) => {
                        const left = m.startWeek * COLUMN_TOTAL;
                        const width = m.spanWeeks * COLUMN_TOTAL - GAP;
                        return (
                            <div
                                key={m.month}
                                className="absolute top-0 flex items-center justify-center"
                                style={{
                                    left,
                                    width,
                                    height: 28,
                                }}
                            >
                                <div className="bg-gray-100 rounded-md px-2 py-1 text-xs font-semibold text-gray-700 shadow-sm">
                                    {m.label}
                                </div>
                            </div>
                        );
                    })}
                </div>


                <div className="flex" style={{ minWidth: scrollMinWidth }}>
                    {/* Vertical day labels column */}
                    <div className="flex flex-col text-xs text-gray-500 mr-3 w-14 flex-shrink-0">
                        <div className="h-6" /> {/* spacer to align with month row */}
                        <div className="h-5 flex items-center">Sun</div>
                        <div className="h-5 flex items-center">Mon</div>
                        <div className="h-5 flex items-center">Tue</div>
                        <div className="h-5 flex items-center">Wed</div>
                        <div className="h-5 flex items-center">Thu</div>
                        <div className="h-5 flex items-center">Fri</div>
                        <div className="h-5 flex items-center">Sat</div>
                    </div>

                    {/* Week columns */}
                    <div className="flex items-start">
                        {weeks.map((week, wi) => {
                            const hasSeparator = separatorWeeks.has(wi);
                            return (
                                <div
                                    key={wi}
                                    className="flex flex-col items-center"
                                    style={{
                                        marginRight: GAP,
                                        minWidth: CELL,
                                        borderLeft: hasSeparator ? "1px solid #e5e7eb" : undefined, // gray-300 thin line
                                        paddingLeft: hasSeparator ? 6 : 0,
                                    }}
                                >
                                    <div style={{ height: 6 }} /> {/* space under month labels */}
                                    {week.map((day, di) => {
                                        const key = day ? toKey(day.date) : `empty-${wi}-${di}`;
                                        const colorClass = day ? getColorClass(day.type, day.count) : "bg-gray-100";
                                        return (
                                            <button
                                                key={key}
                                                onMouseEnter={(e) => day && onEnter(e, day)}
                                                onMouseLeave={onLeave}
                                                className={`${colorClass} rounded-sm transition-shadow border border-black/5`}
                                                title={day ? `${format(day.date, "MMM d, yyyy")} - ${day.type} ₹${Number(day.count).toFixed(2)}` : ""}
                                                style={{
                                                    width: CELL,
                                                    height: CELL,
                                                    marginBottom: 6,
                                                }}
                                                aria-label={day ? `${format(day.date, "MMM d, yyyy")}: ${day.type} ${Number(day.count).toFixed(2)}` : "empty"}
                                            />
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <Tooltip x={hover.x} y={hover.y} data={hover.data} />
        </div>
    );
};

/* -------------------------
   Main Overview component
   ------------------------- */
const Overview = () => {
    const { access_token } = useSelector((s) => s.auth);
    const [fetchActivityData] = useLazyGetDashboardDataQuery();

    const [activeYearOffset, setActiveYearOffset] = useState(0); // 0=current, 1=previous
    const [loadingOverview, setLoadingOverview] = useState(true);
    const [spendSummary, setSpendSummary] = useState({
        weekly: { current: 0, previous: 0, difference: 0 },
        monthly: { current: 0, previous: 0, difference: 0 },
        yearly: { current: 0, previous: 0, difference: 0 },
    });

    // fetch summary cards
    useEffect(() => {
        let active = true;
        const load = async () => {
            setLoadingOverview(true);
            try {
                const [w, m, y] = await Promise.all([
                    fetchActivityData({ access_token, type: "weekly", path: "overview" }).unwrap(),
                    fetchActivityData({ access_token, type: "monthly", path: "overview" }).unwrap(),
                    fetchActivityData({ access_token, type: "yearly", path: "overview" }).unwrap(),
                ]);
                if (!active) return;
                setSpendSummary({
                    weekly: { current: w?.data?.current_total || 0, previous: w?.data?.prev_total || 0, difference: w?.data?.difference || 0 },
                    monthly: { current: m?.data?.current_total || 0, previous: m?.data?.prev_total || 0, difference: m?.data?.difference || 0 },
                    yearly: { current: y?.data?.current_total || 0, previous: y?.data?.prev_total || 0, difference: y?.data?.difference || 0 },
                });
            } catch (err) {
                console.error("Failed to fetch overview:", err);
            } finally {
                if (active) setLoadingOverview(false);
            }
        };

        load();
        return () => { active = false; };
    }, [access_token, fetchActivityData]);

    const currentYear = String(new Date().getFullYear());
    const previousYear = String(new Date().getFullYear() - 1);
    const selectedYear = activeYearOffset === 0 ? currentYear : previousYear;

    if (loadingOverview) {
        return (
            <div className="flex items-center justify-center h-52">
                <Loader2 className="w-8 h-8 animate-spin text-red-500" />
                <span className="ml-3 text-gray-600">Loading dashboard...</span>
            </div>
        );
    }

    return (
        <>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-screen-2xl mx-auto">
                <Card title="Weekly Spending/Income" data={spendSummary.weekly} />
                <Card title="Monthly Spending/Income" data={spendSummary.monthly} />
                <Card title="Yearly Spending/Income" data={spendSummary.yearly} />
            </div>

            <div className="mt-10 p-6 bg-white rounded-xl shadow-lg border border-gray-100 max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex space-x-2 border-b border-gray-200">
                        <button
                            className={`px-4 py-2 text-sm font-medium rounded-t-lg ${activeYearOffset === 0 ? "bg-red-500 text-white" : "text-gray-600 hover:bg-gray-50"}`}
                            onClick={() => setActiveYearOffset(0)}
                        >
                            {currentYear}
                        </button>
                        <button
                            className={`px-4 py-2 text-sm font-medium rounded-t-lg ${activeYearOffset === 1 ? "bg-red-500 text-white" : "text-gray-600 hover:bg-gray-50"}`}
                            onClick={() => setActiveYearOffset(1)}
                        >
                            {previousYear}
                        </button>
                    </div>

                    <p className="text-sm text-gray-500">
                        Showing full calendar year <span className="font-semibold text-gray-700">{selectedYear}</span>
                    </p>
                </div>

                <YearHeatmapGrid year={selectedYear} fetchActivityData={fetchActivityData} access_token={access_token} />
            </div>
        </>
    );
};

export default Overview;
