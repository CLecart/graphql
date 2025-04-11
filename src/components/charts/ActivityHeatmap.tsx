'use client';
import { useState, useEffect } from 'react';

type ActivityData = {
  date: string;
  count: number;
};

export function ActivityHeatmap({ data }: { data: any[] }) {
  const [activityData, setActivityData] = useState<ActivityData[]>([]);
  
  // Traitement des données pour créer un heatmap
  useEffect(() => {
    if (!data || data.length === 0) return;
    
    // Organiser les données par date
    const activityByDate = new Map<string, number>();
    
    // Utiliser la date de création comme date d'activité
    data.forEach((item) => {
      const date = new Date(item.createdAt);
      const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      
      const count = activityByDate.get(dateString) || 0;
      activityByDate.set(dateString, count + 1);
    });
    
    // Remplir les jours manquants au cours des 6 derniers mois
    const today = new Date();
    const sixMonthsAgo = new Date(today);
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    let currentDate = new Date(sixMonthsAgo);
    while (currentDate <= today) {
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
      
      if (!activityByDate.has(dateStr)) {
        activityByDate.set(dateStr, 0);
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Convertir en tableau pour le rendu
    const sortedActivity = Array.from(activityByDate.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
    
    setActivityData(sortedActivity);
  }, [data]);
  
  if (activityData.length === 0) return <div>No activity data available</div>;
  
  // Configuration du rendu
  const cellSize = 12;
  const cellMargin = 2;
  const daysInWeek = 7;
  const weeksCount = Math.ceil(activityData.length / daysInWeek);
  const width = weeksCount * (cellSize + cellMargin);
  const height = daysInWeek * (cellSize + cellMargin);
  
  // Trouver la valeur maximale pour l'échelle de couleur
  const maxActivity = Math.max(...activityData.map(d => d.count));
  
  // Fonction pour déterminer la couleur d'une cellule
  const getCellColor = (count: number) => {
    if (count === 0) return 'var(--color-muted)';
    const intensity = Math.min(1, count / (maxActivity * 0.7));
    return `hsl(var(--chart-1-hsl), ${intensity * 100}%)`;
  };
  
  // Mois à afficher
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthLabels = new Set<string>();
  activityData.forEach(item => {
    const date = new Date(item.date);
    monthLabels.add(`${months[date.getMonth()]} ${date.getFullYear()}`);
  });
  
  return (
    <div className="w-full overflow-x-auto">
      <h3 className="text-lg font-medium mb-4">Activity Overview</h3>
      <div className="min-w-[700px]">
        <svg width="100%" height={height + 30} viewBox={`0 0 ${width + 30} ${height + 30}`}>
          {/* Jours de la semaine */}
          <text x="10" y={cellSize + 4} fontSize="9" fill="currentColor" opacity="0.7">Mon</text>
          <text x="10" y={(cellSize + cellMargin) * 3 + 4} fontSize="9" fill="currentColor" opacity="0.7">Wed</text>
          <text x="10" y={(cellSize + cellMargin) * 5 + 4} fontSize="9" fill="currentColor" opacity="0.7">Fri</text>
          
          {/* Cellules d'activité */}
          {activityData.map((day, index) => {
            const weekIndex = Math.floor(index / daysInWeek);
            const dayIndex = index % daysInWeek;
            const x = 30 + weekIndex * (cellSize + cellMargin);
            const y = dayIndex * (cellSize + cellMargin);
            const color = getCellColor(day.count);
            const date = new Date(day.date);
            const formattedDate = date.toLocaleDateString(undefined, { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            });
            
            return (
              <rect
                key={day.date}
                x={x}
                y={y}
                width={cellSize}
                height={cellSize}
                rx={2}
                fill={color}
                opacity={day.count > 0 ? 1 : 0.3}
                data-tip={`${formattedDate}: ${day.count} contributions`}
                className="cursor-pointer hover:stroke-primary hover:stroke-1"
              >
                <title>{`${formattedDate}: ${day.count} activities`}</title>
              </rect>
            );
          })}
          
          {/* Labels des mois */}
          {Array.from(monthLabels).map((month, index) => {
            // Approximatif, pour positionner les mois
            const x = 30 + index * (width / monthLabels.size);
            return (
              <text 
                key={month} 
                x={x} 
                y={height + 20} 
                fontSize="10" 
                fill="currentColor"
              >
                {month}
              </text>
            );
          })}
        </svg>
        
        {/* Légende */}
        <div className="flex items-center gap-2 mt-4 justify-end">
          <span className="text-xs text-muted-foreground">Less</span>
          {[0, 1, 2, 3, 4].map(level => (
            <div 
              key={level} 
              className="w-3 h-3 rounded-sm" 
              style={{ 
                backgroundColor: level === 0 ? 'var(--color-muted)' : `hsl(var(--chart-1-hsl), ${level * 25}%)`,
                opacity: level === 0 ? 0.3 : 1
              }}
            ></div>
          ))}
          <span className="text-xs text-muted-foreground">More</span>
        </div>
      </div>
    </div>
  );
}