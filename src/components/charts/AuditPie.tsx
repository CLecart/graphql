interface AuditPieChartProps {
  completed: number;
  pending: number;
}

const AuditPieChart = ({ completed, pending }: AuditPieChartProps) => {
  const total = completed + pending;
  const completedPercentage = total > 0 ? (completed / total) * 100 : 0;

  // SVG circle parameters
  const radius = 30;
  const circumference = 2 * Math.PI * radius;

  // Calculate stroke-dasharray and stroke-dashoffset for pie segments
  const completedDash = (completedPercentage / 100) * circumference;
  const pendingDash = circumference - completedDash;

  return (
    <div className="relative">
      <svg
        width="150"
        height="150"
        viewBox="0 0 100 100"
        className="transform -rotate-90"
      >
        {total > 0 ? (
          <>
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="#F0F0F0"
              strokeWidth="8"
            />

            {/* Pending segment - drawn first */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="#f87171d9" /* yellow-500 */
              strokeWidth="8"
              strokeDasharray={`${circumference}`}
            />

            {/* Completed segment - drawn on top */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="#10B981" /* green-500 */
              strokeWidth="8"
              strokeDasharray={`${completedDash} ${pendingDash}`}
            />
          </>
        ) : (
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke="#D1D5DB" /* gray-300 */
            strokeWidth="8"
          />
        )}
      </svg>

      {/* Display percentages in the center */}
      {total > 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="text-sm font-medium text-green-600">
            {Math.round(completedPercentage)}%
          </div>
          <div className="text-xs text-gray-500">Complete</div>
        </div>
      )}
    </div>
  );
};

export default AuditPieChart;
