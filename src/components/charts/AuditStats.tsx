import React from "react";

interface User {
  id: number;
  login: string;
}

interface Member {
  user: User;
}

interface ProjectObject {
  name: string;
  type: string;
}

interface Group {
  object: ProjectObject;
  members: Member[];
}

interface Audit {
  createdAt: string;
  grade: number | null;
  group: Group;
}

interface UserData {
  audits_as_auditor: Audit[];
}

interface QueryData {
  user: UserData[];
}

interface AuditListProps {
  data: QueryData;
}

const AuditList: React.FC<AuditListProps> = ({ data }) => {
  if (!data.user || data.user.length === 0 || !data.user[0].audits_as_auditor) {
    return <div className="p-4 text-gray-500">No audits found</div>;
  }

  const audits = data.user[0].audits_as_auditor;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="max-w-8xl mx-auto p-4">
      {/* <h1 className="text-2xl font-bold mb-6 text-gray-800">Audit History</h1> */}

      <div className="space-y-4">
        {audits.map((audit, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow p-4 border border-gray-200"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {audit.group.object.name}
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    ({audit.group.object.type})
                  </span>
                </h2>
                <p className="text-sm text-gray-500">
                  {formatDate(audit.createdAt)}
                </p>
              </div>

              <div
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  audit.grade !== null
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {audit.grade !== null ? "Completed" : "Not done"}
              </div>
            </div>

            <div className="mt-3">
              <h3 className="text-sm font-medium text-gray-700 mb-1">
                Group Members:
              </h3>
              <div className="flex flex-wrap gap-2">
                {audit.group.members.map((member, memberIndex) => (
                  <div
                    key={memberIndex}
                    className="bg-gray-50 px-3 py-1 rounded-full text-sm text-gray-700 flex items-center"
                  >
                    <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                    {member.user.login} (ID: {member.user.id})
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuditList;
