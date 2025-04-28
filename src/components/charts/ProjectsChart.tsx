"use client";
import { useState, useEffect } from "react";

type ProjectStats = {
  pass: number;
  fail: number;
};

export function ProjectsChart({ data }: { data: any[] }) {
  const [projectStats, setProjectStats] = useState<ProjectStats>({
    pass: 0,
    fail: 0,
  });

  useEffect(() => {
    // Count passed and failed projects
    const stats = data.reduce(
      (acc, item) => {
        if (item.grade > 0) acc.pass += 1;
        else acc.fail += 1;
        return acc;
      },
      { pass: 0, fail: 0 }
    );

    setProjectStats(stats);
  }, [data]);

  // Dimensions
  const width = 300;
  const height = 300;
  const radius = Math.min(width, height) / 2;
  const centerX = width / 2;
  const centerY = height / 2;

  // Calculate percentages and angles
  const total = projectStats.pass + projectStats.fail;
  const passPercentage = total ? (projectStats.pass / total) * 100 : 0;

  // SVG arc paths
  const createSlice = (startAngle: number, endAngle: number) => {
    const startRad = ((startAngle - 90) * Math.PI) / 180;
    const endRad = ((endAngle - 90) * Math.PI) / 180;

    const startX = centerX + radius * Math.cos(startRad);
    const startY = centerY + radius * Math.sin(startRad);
    const endX = centerX + radius * Math.cos(endRad);
    const endY = centerY + radius * Math.sin(endRad);

    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

    return `M ${centerX} ${centerY} L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;
  };

  const passAngle = (projectStats.pass / total) * 360;

  // Animation settings
  const [currentAngle, setCurrentAngle] = useState(0);

  useEffect(() => {
    // Animate the chart
    const timer = setTimeout(() => {
      setCurrentAngle(passAngle);
    }, 100);

    return () => clearTimeout(timer);
  }, [passAngle]);

  return (
    <div className="flex flex-col items-center">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* Background circle */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="var(--color-chart-5)"
          opacity="0.3"
        />

        {/* Pass slice */}
        <path
          d={createSlice(0, currentAngle)}
          fill="var(--color-chart-1)"
          transform={`rotate(-90, ${centerX}, ${centerY})`}
        />

        {/* Inner circle for donut chart */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius * 0.6}
          fill="var(--color-card)"
        />

        {/* Text in the center */}
        <text
          x={centerX}
          y={centerY - 10}
          textAnchor="middle"
          fill="currentColor"
          fontWeight="bold"
          fontSize="24"
        >
          {passPercentage.toFixed(1)}%
        </text>
        <text
          x={centerX}
          y={centerY + 15}
          textAnchor="middle"
          fill="currentColor"
          fontSize="14"
        >
          Success Rate
        </text>
      </svg>

      {/* Legend */}
      <div className="flex gap-8 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[var(--color-chart-1)]"></div>
          <span>Pass ({projectStats.pass})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[var(--color-chart-5)]"></div>
          <span>Fail ({projectStats.fail})</span>
        </div>
      </div>
    </div>
  );
}
