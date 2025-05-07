import React from "react";

interface GroupData {
  id: number;
  createdAt: string;
  group: {
    members: Array<{
      user: {
        login: string;
      };
    }>;
  };
}

interface UserData {
  groups: GroupData[];
}

interface Props {
  data: {
    user: UserData[];
  };
  currentUserLogin: string;
}

/**
 * Affiche les meilleurs collaborateurs et nouvelles connexions de l'utilisateur.
 * @param data - Données des groupes de l'utilisateur
 * @param currentUserLogin - Login de l'utilisateur courant
 */
const BestFriendsComponent: React.FC<Props> = ({ data, currentUserLogin }) => {
  if (!data?.user?.length || !data.user[0]?.groups) {
    return <div>No data available</div>;
  }

  const { bestFriends, newConnections, totalUniqueConnections } =
    processFriendsData(data.user[0].groups, currentUserLogin);

  const progressPercentage = Math.min(
    100,
    Math.floor((totalUniqueConnections % 10) * 10)
  );
  const milestone = Math.floor(totalUniqueConnections / 10) * 10 + 10;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-card rounded-lg">
      <div className="mb-8 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold text-purple-800 dark:text-purple-300">
            People you've worked with
          </h2>
          <span className="text-purple-600 dark:text-purple-400 font-bold">
            {totalUniqueConnections}
          </span>
        </div>
        <div className="w-full bg-purple-200 dark:bg-purple-800/30 rounded-full h-4">
          <div
            className="bg-purple-600 dark:bg-purple-500 h-4 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p className="text-sm text-purple-500 dark:text-purple-400 mt-2">
          {progressPercentage > 0 ? (
            <>
              Only {10 - (totalUniqueConnections % 10)} more to reach{" "}
              {milestone} people!
            </>
          ) : (
            <>You've reached a milestone of {totalUniqueConnections} people!</>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-blue-800 dark:text-blue-300">
            Top 5 Best Friends
          </h2>
          {bestFriends.length > 0 ? (
            <ul
              className="space-y-3"
              role="list"
              aria-label="Top 5 best friends"
            >
              {bestFriends.map((friend, index) => (
                <li
                  key={friend.login}
                  className="flex items-center"
                  role="listitem"
                  aria-label={`Best friend ${friend.login}, ${friend.count} groups together`}
                >
                  <span
                    className="bg-blue-100 dark:bg-blue-800/50 text-blue-800 dark:text-blue-300 font-bold rounded-full flex items-center justify-center mr-3 text-base shrink-0"
                    style={{
                      width: "1.75rem",
                      height: "1.75rem",
                      minWidth: "1.75rem",
                      minHeight: "1.75rem",
                      aspectRatio: "1 / 1",
                    }}
                  >
                    {index + 1}
                  </span>
                  <span className="text-gray-700 dark:text-gray-200">
                    {friend.login}{" "}
                    <span className="text-blue-600 dark:text-blue-400">
                      ({friend.count} groups together)
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              No frequent collaborators found
            </p>
          )}
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-green-800 dark:text-green-300">
            Latest New Connections
          </h2>
          {newConnections.length > 0 ? (
            <ul
              className="space-y-3"
              role="list"
              aria-label="Latest new connections"
            >
              {newConnections.map((person, index) => (
                <li
                  key={person.login}
                  className="flex items-center"
                  role="listitem"
                  aria-label={`New connection ${person.login}, since ${new Date(
                    person.firstMet
                  ).toLocaleDateString()}`}
                >
                  <span
                    className="bg-green-100 dark:bg-green-800/50 text-green-800 dark:text-green-300 font-bold rounded-full flex items-center justify-center mr-3 text-base shrink-0"
                    style={{
                      width: "1.75rem",
                      height: "1.75rem",
                      minWidth: "1.75rem",
                      minHeight: "1.75rem",
                      aspectRatio: "1 / 1",
                    }}
                  >
                    {index + 1}
                  </span>
                  <span className="text-gray-700 dark:text-gray-200">
                    {person.login}{" "}
                    <span className="text-green-600 dark:text-green-400">
                      (since {new Date(person.firstMet).toLocaleDateString()})
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              No new connections found
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

function processFriendsData(groups: GroupData[], currentUserLogin: string) {
  const friendCounts: Record<string, { count: number; firstMet: string }> = {};
  const allConnections: Array<{ login: string; firstMet: string }> = [];

  groups.forEach((group) => {
    const groupMembers = group.group.members;
    const groupDate = group.createdAt;

    const uniqueLoginsInGroup = groupMembers
      .map((member) => member.user.login)
      .filter((login) => login !== currentUserLogin);

    uniqueLoginsInGroup.forEach((login) => {
      if (!friendCounts[login]) {
        friendCounts[login] = { count: 0, firstMet: groupDate };
      } else {
        friendCounts[login].count += 1;
        if (new Date(groupDate) < new Date(friendCounts[login].firstMet)) {
          friendCounts[login].firstMet = groupDate;
        }
      }
    });

    uniqueLoginsInGroup.forEach((login) => {
      allConnections.push({ login, firstMet: groupDate });
    });
  });

  const sortedBestFriends = Object.entries(friendCounts)
    .map(([login, data]) => ({ login, ...data }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const uniqueConnections = Array.from(
    new Map(allConnections.map((item) => [item.login, item])).values()
  );

  const sortedNewConnections = uniqueConnections
    .sort(
      (a, b) => new Date(b.firstMet).getTime() - new Date(a.firstMet).getTime()
    )
    .slice(0, 5);

  return {
    bestFriends: sortedBestFriends,
    newConnections: sortedNewConnections,
    totalUniqueConnections: uniqueConnections.length,
  };
}

export default BestFriendsComponent;
