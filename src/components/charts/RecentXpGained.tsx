import { formatDate, formatXp } from "@/lib/utils";

interface XPTransaction {
  id: number;
  amount: number;
  path: string;
  createdAt: string;
  objectId: number;
  object?: {
    name: string;
    type: string;
  };
}

interface RecentXPGainsProps {
  transactions: XPTransaction[];
}

/**
 * Affiche la liste des gains récents d'XP sous forme de cartes, façon "Audit History".
 * @param transactions - Liste des transactions XP
 */
const RecentXPGains: React.FC<RecentXPGainsProps> = ({ transactions }) => {
  const getActivityName = (path: string) => {
    const parts = path.split("/").filter(Boolean);
    return parts[parts.length - 1].replace(/-/g, " ");
  };

  if (!transactions || transactions.length === 0) {
    return <div className="p-4 text-gray-500">No XP gains found</div>;
  }

  return (
    <div className="max-w-8xl mx-auto p-4">
      <div className="space-y-4" role="list" aria-label="XP gains list">
        {transactions.map((tx, idx) => (
          <div
            key={tx.id || idx}
            className="bg-card rounded-lg shadow p-4 border border-border"
            role="listitem"
            aria-label={`XP gain for project ${
              tx.object?.name || getActivityName(tx.path)
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  {tx.object?.name || getActivityName(tx.path)}
                  {tx.object?.type && (
                    <span className="ml-2 text-sm font-normal text-muted-foreground">
                      ({tx.object.type})
                    </span>
                  )}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {tx.path.replace(/-/g, " ").replace(/\//g, " › ")}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <span className="inline-block bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-base font-semibold px-3 py-1 rounded-full mb-1">
                  +{formatXp(tx.amount)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatDate(tx.createdAt)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentXPGains;
