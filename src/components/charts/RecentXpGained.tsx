import { formatDate, formatXp } from "@/lib/utils";
import { format } from "date-fns";

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
 * Affiche la liste des gains récents d'XP.
 * @param transactions - Liste des transactions XP
 */
const RecentXPGains: React.FC<RecentXPGainsProps> = ({ transactions }) => {
  const getActivityName = (path: string) => {
    const parts = path.split("/").filter(Boolean);
    return parts[parts.length - 1].replace(/-/g, " ");
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-border">
        <thead>{/* Add table headers here if needed */}</thead>
        <tbody role="list" aria-label="Recent XP gains list">
          {transactions.map((tx, idx) => (
            <tr
              key={idx}
              role="listitem"
              aria-label={`XP gain for project ${tx.object?.name || "Unknown"}`}
              className="hover:bg-accent/20 transition-colors"
            >
              <td className="border-b border-border pb-4 last:border-0 last:pb-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-foreground capitalize">
                      {tx.object?.name || getActivityName(tx.path)}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {tx.path.replace(/-/g, " ").replace(/\//g, " › ")}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm font-semibold px-2 py-1 rounded-full">
                      +{formatXp(tx.amount)}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(tx.createdAt)}
                    </p>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentXPGains;
