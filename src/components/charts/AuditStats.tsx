import React from "react";
import { formatDate } from "@/lib/utils";

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

  const formatDateLocal = (dateString: string) => formatDate(dateString);

  return (
    <div className="max-w-8xl mx-auto p-4">
      <div className="space-y-4">
        {audits.map((audit, index) => (
          <div
            key={index}
            className="bg-card rounded-lg shadow p-4 border border-border"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  {audit.group.object.name}
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    ({audit.group.object.type})
                  </span>
                </h2>
                <p className="text-sm text-muted-foreground">
                  {formatDateLocal(audit.createdAt)}
                </p>
              </div>

              <div
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  audit.grade !== null
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                }`}
              >
                {audit.grade !== null ? "Completed" : "Not done"}
              </div>
            </div>

            <div className="mt-3">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Group Members:
              </h3>
              <div className="flex flex-wrap gap-2">
                {audit.group.members.map((member, memberIndex) => (
                  <div
                    key={memberIndex}
                    className="bg-accent/50 dark:bg-accent/30 px-3 py-1 rounded-full text-sm text-foreground flex items-center"
                  >
                    <span className="inline-block w-2 h-2 rounded-full bg-primary mr-2"></span>
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
