"use client";

import { useQuery } from "@apollo/client";
import {
  GET_USER_INFO,
  GET_USER_XP,
  GET_USER_PROGRESS,
  GET_USER_DETAILED_XP,
  GET_USER_SKILLS,
  GET_BEST_FRIEND,
  GET_ACTIVITY,
  GET_AUDITS,
} from "@/lib/queries";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { XPChart } from "@/components/charts/XPChart";
import { XpTimelineChart } from "@/components/charts/XpOverTime";
import { SpiderWebChart } from "@/components/charts/SpiderWebGraph";
import BestFriendsComponent from "@/components/charts/BestFriends";
import RecentXPGains from "@/components/charts/RecentXpGained";
import AuditList from "@/components/charts/AuditStats";
import AuditPieChart from "@/components/charts/AuditPie";
import ThemeToggle from "@/components/ui/ThemeToggle";
import ActivityHeatmap from "@/components/charts/ActivityHeatmap";
import Loader from "@/components/ui/Loader";
import Image from "next/image";

// Types
interface Audit {
  createdAt: string;
  grade: number | null;
  group: {
    object: {
      name: string;
      type: string;
    };
    members: {
      user: {
        id: number;
        login: string;
      };
    }[];
  };
}

export default function ProfilePage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [error, setError] = useState<string | null>(null);

  const { data: userData, loading: userLoading } = useQuery(GET_USER_INFO);
  const userId = userData?.user?.[0]?.id;
  const {
    data: xpData,
    loading: xpLoading,
    refetch: refetchXp,
  } = useQuery(GET_USER_XP, {
    variables: { userId },
    fetchPolicy: "network-only",
    skip: !userId,
  });
  const {
    data: progressData,
    loading: progressLoading,
    refetch: refetchProgress,
  } = useQuery(GET_USER_PROGRESS, {
    variables: { userId },
    fetchPolicy: "network-only",
    skip: !userId,
  });
  const {
    data: detailedXpData,
    loading: detailedXpLoading,
    refetch: refetchDetailedXp,
  } = useQuery(GET_USER_DETAILED_XP, {
    variables: { userId },
    fetchPolicy: "network-only",
    skip: !userId,
  });
  const { data: skillsData, loading: skillsLoading } =
    useQuery(GET_USER_SKILLS);
  const { data: bestFriendData, loading: bestFriendLoading } =
    useQuery(GET_BEST_FRIEND);
  const { data: activityData, loading: activityLoading } =
    useQuery(GET_ACTIVITY);
  const { data: auditData, loading: auditLoading } = useQuery(GET_AUDITS);

  useEffect(() => {
    setIsClient(true);
    const token = localStorage.getItem("jwt_token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    if (
      userData?.error ||
      xpData?.error ||
      progressData?.error ||
      detailedXpData?.error ||
      skillsData?.error ||
      bestFriendData?.error ||
      activityData?.error ||
      auditData?.error
    ) {
      setError(
        "An error occurred while loading your data. Please try again later."
      );
    }
  }, [
    userData,
    xpData,
    progressData,
    detailedXpData,
    skillsData,
    bestFriendData,
    activityData,
    auditData,
  ]);

  useEffect(() => {
    if (userId) {
      refetchProgress();
      refetchXp();
      refetchDetailedXp();
    }
  }, [userId, refetchProgress, refetchXp, refetchDetailedXp]);

  const handleLogout = () => {
    localStorage.removeItem("jwt_token");
    router.push("/login");
  };

  const totalXP = xpData?.cursusXpAggregate?.aggregate?.sum?.amount || 0;

  const activityGraphData = activityData?.user?.[0]?.progresses || [];

  const isLoading =
    userLoading ||
    xpLoading ||
    progressLoading ||
    detailedXpLoading ||
    skillsLoading ||
    bestFriendLoading ||
    activityLoading ||
    auditLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-muted">
        <Loader label="Loading your profile..." size={64} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-muted">
        <div className="text-red-500 text-lg font-semibold mb-4">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-white rounded-md"
          aria-label="Reload page"
        >
          Reload
        </button>
      </div>
    );
  }

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/40 color-[var(--foreground)]">
      <header className="sticky top-0 z-10 backdrop-blur-md bg-background/80 px-8 py-4 border-b border-border/40 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 aspect-square rounded-full flex items-center justify-center text-primary-foreground font-bold mr-3 bg-black dark:bg-white">
            <Image
              src="/favicon.ico"
              alt="Logo"
              className="h-6 w-6"
              width={24}
              height={24}
            />
          </div>
          <h1 className="text-2xl font-bold">Zone01 Profile</h1>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleLogout}
            aria-label="Logout"
            className="flex items-center gap-2 hover:bg-destructive hover:text-white transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Logout
          </button>
          <ThemeToggle />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8 border-b border-border">
          <div className="flex space-x-4 overflow-x-auto pb-1">
            <button
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === "overview"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab("overview")}
              aria-label="Show overview tab"
              tabIndex={0}
            >
              Overview
            </button>
            <button
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === "projects"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab("projects")}
              aria-label="Show XP gains tab"
              tabIndex={0}
            >
              Xp gains
            </button>
            <button
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === "skills"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab("skills")}
              aria-label="Show audits tab"
              tabIndex={0}
            >
              Audits
            </button>
          </div>
        </div>

        {activeTab === "overview" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {/* User Information */}
              <div className="col-span-1 bg-card rounded-xl shadow-lg overflow-hidden border border-border/50 w-full flex flex-col">
                <div className="bg-primary/10 p-5">
                  <h2 className="text-xl font-semibold mb-2">
                    User Information
                  </h2>
                </div>
                {userData?.user && userData.user.length > 0 ? (
                  <div className="p-6">
                    <div className="mb-6 flex justify-center">
                      {userData.user[0].id === 3494 ? (
                        <div className="h-24 w-24 aspect-square rounded-full bg-primary/20 border-4 border-primary flex items-center justify-center">
                          <Image
                            src="/favicon.ico"
                            alt="Logo"
                            className="h-12 w-12"
                            width={48}
                            height={48}
                          />
                        </div>
                      ) : (
                        <div className="h-24 w-24 aspect-square rounded-full bg-primary/20 border-4 border-primary flex items-center justify-center text-2xl font-bold text-primary">
                          {userData.user[0].attrs.firstName[0].toUpperCase()}
                          {userData.user[0].attrs.lastName[0].toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center pb-2 border-b border-border/30">
                        <span className="text-muted-foreground">Login</span>
                        <span className="font-medium">
                          {userData.user[0].login}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-border/30">
                        <span className="text-muted-foreground">User ID</span>
                        <span className="font-medium">
                          {userData.user[0].id}
                        </span>
                      </div>
                      {userData.user[0].attrs && (
                        <div className="flex justify-between items-center pb-2 border-b border-border/30">
                          <span className="text-muted-foreground">Campus</span>
                          <span className="font-medium">
                            {progressData.progress[0].campus[0].toUpperCase() +
                              progressData.progress[0].campus.slice(1)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-muted-foreground">
                    No user data available
                  </div>
                )}
              </div>
              {/* Experience Overview */}
              <div className="col-span-1 md:col-span-2 bg-card rounded-xl shadow-lg overflow-hidden border border-border/50 w-full flex flex-col">
                <div className="bg-primary/10 p-6 text-center">
                  <h2 className="text-xl font-semibold">Experience Overview</h2>
                </div>
                <div className="p-6">
                  {/* ...contenu Experience Overview... */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-background/50 rounded-lg p-4 border border-border/30 flex flex-col items-center justify-center">
                      <h3 className="text-sm text-muted-foreground mb-1">
                        Total XP
                      </h3>
                      <p className="text-3xl font-bold">
                        {(totalXP / 1000000).toFixed(2)}M
                      </p>
                    </div>
                    <div className="bg-background/50 rounded-lg p-4 border border-border/30 flex flex-col items-center justify-center">
                      <h3 className="text-sm text-muted-foreground mb-1">
                        Projects
                      </h3>
                      <p className="text-3xl font-bold">
                        {progressData?.progress?.filter(
                          (p: { grade: number }) => p.grade > 0
                        ).length || 0}
                      </p>
                    </div>
                    <div className="bg-background/50 rounded-lg p-4 border border-border/30 flex flex-col items-center justify-center">
                      <h3 className="text-sm text-muted-foreground mb-1">
                        Total Audits
                      </h3>
                      <p className="text-3xl font-bold">
                        {auditData?.user?.[0]?.audits_as_auditor?.length || 0}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-background/50 rounded-lg p-4 border border-border/30 flex flex-col items-center justify-center">
                      <h3 className="text-sm text-muted-foreground mb-1">
                        Completed Audits
                      </h3>
                      <p className="text-3xl font-bold text-green-500">
                        {auditData?.user?.[0]?.audits_as_auditor?.filter(
                          (a: Audit) => a.grade !== null
                        ).length || 0}
                      </p>
                    </div>
                    <div className="bg-background/50 rounded-lg p-4 border border-border/30 flex flex-col items-center justify-center">
                      <h3 className="text-sm text-muted-foreground mb-1">
                        Audits not completed
                      </h3>
                      <p className="text-3xl font-bold text-red-400">
                        {auditData?.user?.[0]?.audits_as_auditor?.filter(
                          (a: Audit) => a.grade === null
                        ).length || 0}
                      </p>
                    </div>
                    <div className="bg-background/50 rounded-lg p-4 border border-border/30 flex items-center justify-center">
                      <div className="text-center">
                        <div className="flex justify-center">
                          <AuditPieChart
                            completed={
                              auditData?.user?.[0]?.audits_as_auditor?.filter(
                                (a: Audit) => a.grade !== null
                              ).length || 0
                            }
                            pending={
                              auditData?.user?.[0]?.audits_as_auditor?.filter(
                                (a: Audit) => a.grade === null
                              ).length || 0
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {xpData?.transaction && (
                    <div className="h-64 mt-6">
                      <XPChart data={xpData.transaction} />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl shadow-lg overflow-hidden border border-border/50 mb-8">
              <div className="bg-primary/10 p-6">
                <h2 className="text-xl font-semibold mb-2">Xp Over time</h2>
              </div>
              <XpTimelineChart data={xpData?.cursusXpDetails} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-card rounded-xl shadow-lg overflow-hidden border border-border/50">
                <div className="bg-primary/10 p-6">
                  <h2 className="text-xl font-semibold mb-2">Skills tree</h2>
                </div>
                {skillsData?.user?.[0]?.transactions && (
                  <div className="overflow-x-auto ">
                    <div className="mx-auto min-w-full min-h-full py-2">
                      <SpiderWebChart data={skillsData.user[0].transactions} />
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-card rounded-xl shadow-lg overflow-hidden border border-border/50">
                <div className="bg-primary/10 p-6">
                  <h2 className="text-xl font-semibold mb-2">
                    Your Coding Companions
                  </h2>
                </div>
                <BestFriendsComponent
                  data={bestFriendData}
                  currentUserLogin={userData?.user?.[0]?.login || ""}
                />
              </div>
            </div>

            <div className="bg-card rounded-xl shadow-lg overflow-hidden border border-border/50 mb-8">
              <div className="bg-primary/10 p-6">
                <h2 className="text-xl font-semibold mb-2">Activity Heatmap</h2>
              </div>
              <div className="p-4 w-full overflow-x-auto">
                <ActivityHeatmap data={activityGraphData} />
              </div>
            </div>
          </>
        )}

        {activeTab === "projects" && (
          <>
            <div className="bg-card rounded-xl shadow-lg overflow-hidden border border-border/50">
              <div className="bg-primary/10 p-6">
                <h2 className="text-xl font-semibold mb-2">All Xp gains</h2>
              </div>
              {detailedXpData?.transaction &&
              detailedXpData.transaction.length > 0 ? (
                <RecentXPGains transactions={detailedXpData.transaction} />
              ) : (
                <div className="p-6 text-muted-foreground">
                  No data available
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === "skills" && (
          <>
            <div className="bg-card rounded-xl shadow-lg overflow-hidden border border-border/50">
              <div className="bg-primary/10 p-6">
                <h2 className="text-xl font-semibold mb-2">Audit History</h2>
              </div>
              {auditData?.user?.[0]?.audits_as_auditor &&
              auditData.user[0].audits_as_auditor.length > 0 ? (
                <AuditList data={auditData} />
              ) : (
                <div className="p-6 text-muted-foreground">
                  No data available
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === "activity" && (
          <>
            <div className="bg-card rounded-xl shadow-lg overflow-hidden border border-border/50 mb-8">
              <div className="bg-primary/10 p-6">
                <h2 className="text-xl font-semibold mb-2">Activity Heatmap</h2>
              </div>
              <div className="p-6">
                <ActivityHeatmap data={activityData} />
              </div>
            </div>
          </>
        )}
      </div>

      <footer className="mt-16 py-6 border-t border-border/40">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          © {new Date().getFullYear()} Zone01 Profile Dashboard
        </div>
      </footer>
    </div>
  );
}
