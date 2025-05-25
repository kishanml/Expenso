import React, { useState } from "react";
import { format, subDays } from "date-fns";

const getRandomCount = () => Math.floor(Math.random() * 50);

const GitHubContributionGrid = ({ daysToShow = 365 }) => {
  const today = new Date();

  const data = [];
  for (let i = 0; i < daysToShow; i++) {
    const date = subDays(today, daysToShow - 1 - i);
    data.push({
      date,
      count: getRandomCount()*100,
    });
  }

  const rows = 7;
  const cols = Math.ceil(daysToShow / rows);

const getColor = (count) => {
  if (count < 100) return "bg-red-100";
  if (count >= 100 && count < 500) return "bg-red-200";
  if (count >= 500 && count < 1000) return "bg-red-300";
  if (count >= 1000 && count < 5000) return "bg-red-500";
  return "bg-red-700"; // 5000 and above
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
          {format(data[hover.idx].date, "MMM d, yyyy")} : Rs {data[hover.idx].count} 
        </div>
      )}
    </>
  );
};

export default GitHubContributionGrid;
