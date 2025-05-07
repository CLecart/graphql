import React from "react";

type ActivityHeatmapProps = {
  data: { createdAt: string; __typename?: string }[] | null | undefined;
};

/**
 * Affiche une heatmap d'activité façon GitHub sur 1 an.
 * @param data - Liste des activités avec date
 */
const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({ data }) => {
  // Process data to count activities per day
  const processData = (
    activities: { createdAt: string; __typename?: string }[] | null | undefined
  ) => {
    const activityMap: Record<string, number> = {};

    if (!activities || !Array.isArray(activities)) {
      return activityMap;
    }

    activities.forEach((activity) => {
      if (!activity?.createdAt) return;

      try {
        const date = new Date(activity.createdAt);
        const dateStr = date.toISOString().split("T")[0];
        activityMap[dateStr] = (activityMap[dateStr] || 0) + 1;
      } catch (e) {
        console.warn("Invalid date format", activity.createdAt);
      }
    });

    return activityMap;
  };

  const activityCounts = processData(data);

  // Generate 52 weeks of data (like GitHub)
  const generateGitHubWeeks = () => {
    const weeks: Date[][] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find most recent Sunday
    const lastSunday = new Date(today);
    lastSunday.setDate(lastSunday.getDate() - lastSunday.getDay());

    // Generate 52 weeks (364 days)
    for (let week = 0; week < 52; week++) {
      const weekDays: Date[] = [];
      for (let day = 0; day < 7; day++) {
        const date = new Date(lastSunday);
        date.setDate(date.getDate() - (51 - week) * 7 + day);
        weekDays.push(date);
      }
      weeks.push(weekDays);
    }

    return weeks;
  };

  const weeks = generateGitHubWeeks();

  // Get month labels for the heatmap
  const getMonthLabels = () => {
    const months: { name: string; position: number }[] = [];
    let currentMonth = "";

    // Check the first week (oldest dates) for month transitions
    weeks[0].forEach((date, dayIndex) => {
      const month = date.toLocaleDateString("en-US", { month: "short" });
      if (month !== currentMonth) {
        months.push({ name: month, position: dayIndex });
        currentMonth = month;
      }
    });

    return months;
  };

  const monthLabels = getMonthLabels();

  // Determine color intensity
  const getColorIntensity = (count: number) => {
    if (!count) return "bg-gray-100 dark:bg-gray-700";
    if (count <= 2) return "bg-blue-200 dark:bg-blue-900";
    if (count <= 5) return "bg-blue-300 dark:bg-blue-800";
    if (count <= 8) return "bg-blue-400 dark:bg-blue-700";
    return "bg-blue-500 dark:bg-blue-600";
  };

  // Format date for tooltip
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get count for a specific date
  const getActivityCount = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return activityCounts[dateStr] || 0;
  };

  return (
    <div className="p-5 mx-12">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <span>Less</span>
          <div className="flex space-x-1">
            <div className="w-4 h-4 bg-gray-100 dark:bg-gray-700 rounded-xs"></div>
            <div className="w-4 h-4 bg-blue-200 dark:bg-blue-900 rounded-xs"></div>
            <div className="w-4 h-4 bg-blue-300 dark:bg-blue-800 rounded-xs"></div>
            <div className="w-4 h-4 bg-blue-400 dark:bg-blue-700 rounded-xs"></div>
            <div className="w-4 h-4 bg-blue-500 dark:bg-blue-600 rounded-xs"></div>
          </div>
          <span>More</span>
        </div>
      </div>

      <div className="flex">
        <div className="flex flex-col mr-4 mt-7">
          {["", "Mon", "", "Wed", "", "Fri", ""].map((day, index) => (
            <div
              key={index}
              className="h-3 text-xs text-gray-500 dark:text-gray-400 mb-1"
              style={{ height: "15px" }}
            >
              {day}
            </div>
          ))}
        </div>

        <div className="flex-1 my-2">
          <div className="flex mb-1 h-4">
            {monthLabels.map((label, index) => (
              <div
                key={index}
                className="text-xs text-gray-500 dark:text-gray-400"
                style={{
                  marginLeft: index === 0 ? "0" : `${label.position * 14}px`,
                  width: `${
                    (index < monthLabels.length - 1
                      ? monthLabels[index + 1].position - label.position
                      : 7 - label.position) * 14
                  }px`,
                }}
              >
                {label.name}
              </div>
            ))}
          </div>

          <div className="flex">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col mr-1">
                {week.map((date, dayIndex) => {
                  const count = getActivityCount(date);
                  const dateStr = formatDate(date);
                  return (
                    <div
                      key={dayIndex}
                      className={`rounded-xs w-4 h-4 mb-[3px] ${getColorIntensity(
                        count
                      )}`}
                      title={`${count} activities on ${dateStr}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        {Object.keys(activityCounts).length} days with activity in the last year
      </div>
    </div>
  );
};

export default ActivityHeatmap;
