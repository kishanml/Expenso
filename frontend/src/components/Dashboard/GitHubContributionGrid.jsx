import React, { useState } from "react";
import { format, subDays } from "date-fns";

const getRandomCount = () => Math.floor(Math.random() * 5);

const GitHubContributionGrid = ({ daysToShow = 365 }) => {
  const today = new Date();

  const data = [];
  for (let i = 0; i < daysToShow; i++) {
    const date = subDays(today, daysToShow - 1 - i);
    data.push({
      date,
      count: getRandomCount(),
    });
  }

  const rows = 7;
  const cols = Math.ceil(daysToShow / rows);

  const getColor = (count) => {
    if (count === 0) return "bg-red-100";
    if (count === 1) return "bg-red-200";
    if (count === 2) return "bg-red-300";
    if (count === 3) return "bg-red-500";
    return "bg-red-700";
  };

  const [hover, setHover] = useState({ idx: null, x: 0, y: 0 });

  const onMouseEnter = (e, idx) => {
    const rect = e.target.getBoundingClientRect();
    setHover({
      idx,
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
  };

  // Handler for mouse leave
  const onMouseLeave = () => {
    setHover({ idx: null, x: 0, y: 0 });
  };

  return (
    <>
      <div
        className="grid gap-[6px]"
        style={{
          gridTemplateRows: `repeat(${rows}, 18px)`,
          gridTemplateColumns: `repeat(${cols},18px)`,
          userSelect: "none",
        }}
      >
        {data.map((day, idx) => (
          <div
            key={idx}
            className={`w-4 h-4 rounded-sm cursor-default ${getColor(
              day.count
            )}`}
            onMouseEnter={(e) => onMouseEnter(e, idx)}
            onMouseLeave={onMouseLeave}
          />
        ))}
      </div>

      {hover.idx !== null && (
        <div
          className="fixed pointer-events-none bg-gray-800 text-white text-xs rounded px-2 py-1 shadow-lg z-50"
          style={{
            top: hover.y - 36,
            left: hover.x,
            transform: "translateX(-50%)",
            whiteSpace: "nowrap",
          }}
        >
          {format(data[hover.idx].date, "MMM d, yyyy")} –{" "}
          {data[hover.idx].count} commits
        </div>
      )}
    </>
  );
};

export default GitHubContributionGrid;
