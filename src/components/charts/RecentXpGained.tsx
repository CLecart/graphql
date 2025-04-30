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

const RecentXPGains: React.FC<RecentXPGainsProps> = ({ transactions }) => {
  const getActivityName = (path: string) => {
    const parts = path.split("/").filter(Boolean);
    return parts[parts.length - 1].replace(/-/g, " ");
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM dd, yyyy HH:mm");
  };

  return (
    <div className="bg-card rounded-lg shadow p-6">
      <div className="space-y-4">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="border-b border-border pb-4 last:border-0 last:pb-0"
          >
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
                  +{tx.amount.toLocaleString()} XP
                </span>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDate(tx.createdAt)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentXPGains;
