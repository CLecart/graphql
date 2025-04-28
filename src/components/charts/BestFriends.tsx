import React from "react";

interface User {
  login: string;
}

interface Member {
  user: User;
}

interface Group {
  captainId: number;
  members: Member[];
}

interface GroupData {
  id: number;
  createdAt: string;
  group: Group;
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

const BestFriendsComponent: React.FC<Props> = ({ data, currentUserLogin }) => {
  if (!data?.user?.length || !data.user[0]?.groups) {
    return <div>No data available</div>;
  }

  // Process data to find best friends, new connections, and total unique connections
  const { bestFriends, newConnections, totalUniqueConnections } =
    processFriendsData(data.user[0].groups, currentUserLogin);

  // Calculate progress (every 10 people)
  const progressPercentage = Math.min(
    100,
    Math.floor((totalUniqueConnections % 10) * 10)
  );
  const milestone = Math.floor(totalUniqueConnections / 10) * 10 + 10;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg">
      {/* <h1 className="text-2xl font-bold mb-6 text-gray-800">Your Coding Companions</h1> */}

      {/* People Counter Section */}
      <div className="mb-8 p-4 bg-purple-50 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold text-purple-800">
            People you've worked with
          </h2>
          <span className="text-purple-600 font-bold">
            {totalUniqueConnections}
          </span>
        </div>
        <div className="w-full bg-purple-200 rounded-full h-4">
          <div
            className="bg-purple-600 h-4 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p className="text-sm text-purple-500 mt-2">
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
        {/* Best Friends Section */}
        <div className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-blue-800">
            Top 5 Best Friends
          </h2>
          {bestFriends.length > 0 ? (
            <ul className="space-y-3">
              {bestFriends.map((friend, index) => (
                <li key={friend.login} className="flex items-center">
                  <span className="bg-blue-100 text-blue-800 font-bold rounded-full w-8 h-8 flex items-center justify-center mr-3">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">
                    {friend.login}{" "}
                    <span className="text-blue-600">
                      ({friend.count} groups together)
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No frequent collaborators found</p>
          )}
        </div>

        {/* New Connections Section */}
        <div className="bg-green-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-green-800">
            Latest New Connections
          </h2>
          {newConnections.length > 0 ? (
            <ul className="space-y-3">
              {newConnections.map((person, index) => (
                <li key={person.login} className="flex items-center">
                  <span className="bg-green-100 text-green-800 font-bold rounded-full w-8 h-8 flex items-center justify-center mr-3">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">
                    {person.login}{" "}
                    <span className="text-green-600">
                      (since {new Date(person.firstMet).toLocaleDateString()})
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No new connections found</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Updated helper function to also return total unique connections
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
