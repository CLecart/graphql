"use client";

import { CheckCircle2, Clock } from "lucide-react";
import { useQuery } from "@apollo/client";
import {
  GET_USER_INFO,
  GET_USER_XP,
  GET_USER_PROGRESS,
  GET_USER_RESULTS,
  GET_USER_AUDITS,
  GET_USER_DETAILED_XP,
  GET_USER_SKILLS,
  GET_BEST_FRIEND,
  GET_ACTIVITY,
  GET_AUDITS,
  GET_PROJECTS,
} from "@/lib/queries";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { XPChart } from "@/components/charts/XPChart";
import { ProjectsChart } from "@/components/charts/ProjectsChart";
import { XPByProjectChart } from "@/components/charts/XPByProjectChart";
import { SkillsRadarChart } from "@/components/charts/SkillsRadarChart";
import ActivityHeatmap from "@/components/charts/ActivityHeatmap";
import { Button } from "@/components/ui/button";
import { XpTimelineChart } from "@/components/charts/XpOverTime";
import { SpiderWebChart } from "@/components/charts/SpiderWebGraph";
import BestFriendsComponent from "@/components/charts/BestFriends";
import RecentXPGains from "@/components/charts/RecentXpGained";
import AuditList from "@/components/charts/AuditStats";
import AuditPieChart from "@/components/charts/AuditPie";

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
// First, define your TypeScript interfaces
interface TransactionObject {
  name: string;
  type: string;
}

interface Transaction {
  type: string;
  amount: number;
  createdAt: string;
  path: string;
  object: TransactionObject | null;
}

interface User {
  transactions?: Transaction[];
}

interface QueryData {
  user?: User[];
}

export default function ProfilePage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Requêtes GraphQL
  const { data: userData, loading: userLoading } = useQuery(GET_USER_INFO);
  const { data: xpData, loading: xpLoading } = useQuery(GET_USER_XP);
  const { data: progressData, loading: progressLoading } =
    useQuery(GET_USER_PROGRESS);
  const { data: resultsData, loading: resultsLoading } =
    useQuery(GET_USER_RESULTS);
  // const { data: auditsData, loading: auditsLoading } = useQuery(GET_USER_AUDITS);
  const { data: detailedXpData, loading: detailedXpLoading } =
    useQuery(GET_USER_DETAILED_XP);
  const { data: skillsData, loading: skillsLoading } =
    useQuery(GET_USER_SKILLS);
  const { data: bestFriendData, loading: bestFriendLoading } =
    useQuery(GET_BEST_FRIEND);
  const { data: activityData, loading: activityLoading } =
    useQuery(GET_ACTIVITY);
  const { data: auditData, loading: auditLoading } = useQuery(GET_AUDITS);
  const { data: projectData, loading: projectLoading } = useQuery(GET_PROJECTS);

  // Vérification d'authentification côté client
  useEffect(() => {
    setIsClient(true);
    const token = localStorage.getItem("jwt_token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  // Déconnexion
  const handleLogout = () => {
    localStorage.removeItem("jwt_token");
    router.push("/login");
  };

  // Calcul des statistiques
  const totalXP = xpData?.cursusXpAggregate?.aggregate?.sum?.amount || 0;
  const completedProjects =
    progressData?.progress?.filter((p: { grade: number }) => p.grade > 0)
      .length || 0;
  // const totalAudits = auditsData?.audit?.length || 0;
  // console.log("userData: ", progressData);

  // Activity graph data (github graph)
  const activityGraphData = activityData?.user?.[0]?.progresses || [];

  // Number of projects done
  const projectCount =
    projectData?.user?.[0]?.transactions?.filter(
      (transaction: Transaction) => transaction.object?.type === "project"
    ).length || 0;

  // État de chargement
  const isLoading =
    userLoading ||
    xpLoading ||
    progressLoading ||
    resultsLoading ||
    detailedXpLoading ||
    skillsLoading ||
    bestFriendLoading ||
    activityLoading ||
    auditLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-muted">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-medium">Loading your profile...</p>
      </div>
    );
  }

  // Vérification SSR
  if (!isClient) return null;

  // Fonction utilitaire pour extraire les attributs utilisateur
  const getAttrsValue = (
    attrs: any,
    key: string,
    defaultValue: string = "N/A"
  ) => {
    if (!attrs) return defaultValue;

    try {
      if (typeof attrs === "string") {
        return JSON.parse(attrs)[key] || defaultValue;
      } else if (typeof attrs === "object") {
        return attrs[key] || defaultValue;
      }
    } catch (e) {
      console.error("Error parsing attrs:", e);
    }

    return defaultValue;
  };

  // Combiner les données pour l'activité
  // const allActivityData = [
  //   ...(xpData?.transaction || []),
  //   ...(progressData?.progress || []),
  //   ...(resultsData?.result || [])
  // ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/40">
      {/* Header avec effet blur */}
      <header className="sticky top-0 z-10 backdrop-blur-md bg-background/80 px-8 py-4 border-b border-border/40 flex justify-between items-center">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold mr-3">
            {userData?.user?.[0]?.login?.charAt(0).toUpperCase() || "U"}
          </div>
          <h1 className="text-2xl font-bold">Zone01 Profile</h1>
        </div>
        <Button
          variant="outline"
          onClick={handleLogout}
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
        </Button>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Navigation des onglets */}
        <div className="mb-8 border-b border-border">
          <div className="flex space-x-4 overflow-x-auto pb-1">
            <button
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === "overview"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab("overview")}
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
            >
              Audits
            </button>
            {/* <button
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'activity' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setActiveTab('activity')}
            >
              Activity
            </button> */}
          </div>
        </div>

        {/* Contenu de l'onglet Overview */}
        {activeTab === "overview" && (
          <>
            {/* Carte d'informations utilisateur et XP */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="col-span-1 bg-card rounded-xl shadow-lg overflow-hidden border border-border/50">
                <div className="bg-primary/10 p-6">
                  <h2 className="text-xl font-semibold mb-2">
                    User Information
                  </h2>
                </div>
                {userData?.user && userData.user[0] && (
                  <div className="p-6">
                    <div className="mb-6 flex justify-center">
                      <div className="h-24 w-24 rounded-full bg-primary/20 border-4 border-primary flex items-center justify-center text-2xl font-bold text-primary">
                        {userData.user[0].login?.charAt(0).toUpperCase() || "U"}
                      </div>
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
                )}
              </div>

              {/* XP Card with centered content */}
              <div className="col-span-2 bg-card rounded-xl shadow-lg overflow-hidden border border-border/50">
                <div className="bg-primary/10 p-6 text-center">
                  <h2 className="text-xl font-semibold">Experience Overview</h2>
                </div>
                <div className="p-6">
                  {/* First row - 3 items */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    {/* XP */}
                    <div className="bg-background/50 rounded-lg p-4 border border-border/30 flex flex-col items-center justify-center">
                      <h3 className="text-sm text-muted-foreground mb-1">
                        Total XP
                      </h3>
                      <p className="text-3xl font-bold">
                        {(totalXP / 1000000).toFixed(2)}M
                      </p>
                    </div>

                    {/* Projects */}
                    <div className="bg-background/50 rounded-lg p-4 border border-border/30 flex flex-col items-center justify-center">
                      <h3 className="text-sm text-muted-foreground mb-1">
                        Projects
                      </h3>
                      <p className="text-3xl font-bold">{projectCount}</p>
                    </div>

                    {/* Total Audits */}
                    <div className="bg-background/50 rounded-lg p-4 border border-border/30 flex flex-col items-center justify-center">
                      <h3 className="text-sm text-muted-foreground mb-1">
                        Total Audits
                      </h3>
                      <p className="text-3xl font-bold">
                        {auditData?.user?.[0]?.audits_as_auditor?.length || 0}
                      </p>
                    </div>
                  </div>

                  {/* Second row - 3 items */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Completed Audits */}
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

                    {/* Pending Audits */}
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

                    {/* Pie Chart */}
                    <div className="bg-background/50 rounded-lg p-4 border border-border/30 flex items-center justify-center">
                      <div className="text-center">
                        {/* <h3 className="text-sm text-muted-foreground mb-2">Audit Ratio</h3> */}
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

                  {/* XP Chart (if available) */}
                  {xpData?.transaction && (
                    <div className="h-64 mt-6">
                      <XPChart data={xpData.transaction} />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* XP Over Time section */}
            <div className="bg-card rounded-xl shadow-lg overflow-hidden border border-border/50 mb-8">
              <div className="bg-primary/10 p-6">
                <h2 className="text-xl font-semibold mb-2">Xp Over time</h2>
              </div>
              <XpTimelineChart data={xpData?.cursusXpDetails} />
            </div>

            {/* Graphiques de présentation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Graphique de complétion de projet */}
              {/* <div className="bg-card rounded-xl shadow-lg overflow-hidden border border-border/50">
                <div className="bg-primary/10 p-6">
                  <h2 className="text-xl font-semibold mb-2">Project Completion</h2>
                </div>
                <div className="p-6">
                  {progressData?.progress && (
                    <ProjectsChart data={progressData.progress} />
                  )}
                </div>
              </div> */}
              <div className="bg-card rounded-xl shadow-lg overflow-hidden border border-border/50">
                <div className="bg-primary/10 p-6">
                  <h2 className="text-xl font-semibold mb-2">Skills tree</h2>
                </div>
                {skillsData?.user?.[0]?.transactions && (
                  <div className="bg-card rounded-xl p-6 shadow border border-border">
                    <SpiderWebChart
                      data={skillsData.user[0].transactions}
                      width={500}
                      height={500}
                    />
                  </div>
                )}
              </div>

              {/* Graphique des compétences */}
              <div className="bg-card rounded-xl shadow-lg overflow-hidden border border-border/50">
                <div className="bg-primary/10 p-6">
                  <h2 className="text-xl font-semibold mb-2">
                    Your Coding Companions
                  </h2>
                </div>
                <BestFriendsComponent
                  data={bestFriendData}
                  currentUserLogin={userData?.user[0].login}
                />
              </div>
            </div>

            {/* Carte d'activité */}
            <div className="bg-card rounded-xl shadow-lg overflow-hidden border border-border/50 mb-8">
              <div className="bg-primary/10 p-6">
                <h2 className="text-xl font-semibold mb-2">Activity Heatmap</h2>
              </div>
              <div className="p-4">
                <ActivityHeatmap data={activityGraphData} />
              </div>
            </div>

            {/* Projets récents */}
            {/* <div className="bg-card rounded-xl shadow-lg overflow-hidden border border-border/50"> */}
            {/* <div className="p-6">
                <div className="overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-left pb-3 text-muted-foreground">Project Name</th>
                        <th className="text-center pb-3 text-muted-foreground">Type</th>
                        <th className="text-center pb-3 text-muted-foreground">Date</th>
                        <th className="text-right pb-3 text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resultsData?.result?.slice(0, 8).map((result: any) => {
                        const projectName = result.path?.split('/').pop() || 'Unknown Project';
                        const date = new Date(result.createdAt);
                        const formattedDate = date.toLocaleDateString();
                        
                        return (
                          <tr key={result.id} className="border-b border-border/30 last:border-0">
                            <td className="py-3 truncate max-w-[200px]">
                              {projectName}
                            </td>
                            <td className="py-3 text-center">
                              {result.object?.type || 'Unknown'}
                            </td>
                            <td className="py-3 text-center text-sm text-muted-foreground">
                              {formattedDate}
                            </td>
                            <td className="py-3 text-right">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                result.grade > 0 
                                  ? 'bg-chart-1/20 text-chart-1' 
                                  : 'bg-destructive/20 text-destructive'
                              }`}>
                                {result.grade > 0 ? 'PASS' : 'FAIL'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div> */}
            {/* </div> */}
          </>
        )}

        {/* Contenu de l'onglet Projects */}
        {activeTab === "projects" && (
          <>
            {/* Graphique des XP par projet */}
            {/* <div className="bg-card rounded-xl shadow-lg overflow-hidden border border-border/50 mb-8">
              <div className="bg-primary/10 p-6">
                <h2 className="text-xl font-semibold mb-2">XP by Project</h2>
              </div>
              <div className="p-6">
                {detailedXpData?.transaction && (
                  <XPByProjectChart data={detailedXpData.transaction} />
                )}
              </div>
            </div> */}

            {/* Liste complète des projets */}
            <div className="bg-card rounded-xl shadow-lg overflow-hidden border border-border/50">
              <div className="bg-primary/10 p-6">
                <h2 className="text-xl font-semibold mb-2">All Xp gains</h2>
              </div>
              <RecentXPGains transactions={detailedXpData.transaction} />
              {/* <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-left pb-3 text-muted-foreground">Project Name</th>
                        <th className="text-center pb-3 text-muted-foreground">Type</th>
                        <th className="text-center pb-3 text-muted-foreground">Path</th>
                        <th className="text-center pb-3 text-muted-foreground">Date</th>
                        <th className="text-center pb-3 text-muted-foreground">Grade</th>
                        <th className="text-right pb-3 text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resultsData?.result?.map((result: any) => {
                        const projectName = result.path?.split('/').pop() || 'Unknown Project';
                        const date = new Date(result.createdAt);
                        const formattedDate = date.toLocaleDateString();
                        
                        return (
                          <tr key={result.id} className="border-b border-border/30 last:border-0">
                            <td className="py-3 truncate max-w-[200px]">
                              {projectName}
                            </td>
                            <td className="py-3 text-center text-sm">
                              {result.object?.type || 'Unknown'}
                            </td>
                            <td className="py-3 text-center text-sm text-muted-foreground truncate max-w-[300px]">
                              {result.path}
                            </td>
                            <td className="py-3 text-center text-sm text-muted-foreground">
                              {formattedDate}
                            </td>
                            <td className="py-3 text-center font-mono">
                              {result.grade}
                            </td>
                            <td className="py-3 text-right">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                result.grade > 0 
                                  ? 'bg-chart-1/20 text-chart-1' 
                                  : 'bg-destructive/20 text-destructive'
                              }`}>
                                {result.grade > 0 ? 'PASS' : 'FAIL'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div> */}
            </div>
          </>
        )}

        {/* Contenu de l'onglet Skills & Metrics */}
        {activeTab === "skills" && (
          <>
            {/* Graphique radar des compétences */}
            {/* <div className="bg-card rounded-xl shadow-lg overflow-hidden border border-border/50 mb-8">
              <div className="bg-primary/10 p-6">
                <h2 className="text-xl font-semibold mb-2">Skills Radar</h2>
              </div>
              <div className="p-6">
                {skillsData?.progress && (
                  <div className="flex justify-center">
                    <SkillsRadarChart data={skillsData.progress} />
                  </div>
                )}
              </div>
            </div> */}

            {/* Historique des audits */}
            <div className="bg-card rounded-xl shadow-lg overflow-hidden border border-border/50">
              <div className="bg-primary/10 p-6">
                <h2 className="text-xl font-semibold mb-2">Audit History</h2>
              </div>
              <AuditList data={auditData} />
              {/* <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-left pb-3 text-muted-foreground">ID</th>
                        <th className="text-center pb-3 text-muted-foreground">Grade</th>
                        <th className="text-center pb-3 text-muted-foreground">Date</th>
                        <th className="text-right pb-3 text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditsData?.audit?.map((audit: any) => {
                        const date = new Date(audit.createdAt);
                        const formattedDate = date.toLocaleDateString();
                        
                        return (
                          <tr key={audit.id} className="border-b border-border/30 last:border-0">
                            <td className="py-3 font-mono">
                              {audit.id}
                            </td>
                            <td className="py-3 text-center font-mono">
                              {audit.grade?.toFixed(2) || 'N/A'}
                            </td>
                            <td className="py-3 text-center text-sm text-muted-foreground">
                              {formattedDate}
                            </td>
                            <td className="py-3 text-right">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                audit.grade >= 1 
                                  ? 'bg-chart-1/20 text-chart-1' 
                                  : 'bg-destructive/20 text-destructive'
                              }`}>
                                {audit.grade >= 1 ? 'PASS' : 'FAIL'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div> */}
            </div>
          </>
        )}

        {/* Contenu de l'onglet Activity */}
        {activeTab === "activity" && (
          <>
            {/* Graphique d'activité */}
            <div className="bg-card rounded-xl shadow-lg overflow-hidden border border-border/50 mb-8">
              <div className="bg-primary/10 p-6">
                <h2 className="text-xl font-semibold mb-2">Activity Heatmap</h2>
              </div>
              <div className="p-6">
                <ActivityHeatmap data={activityData} />
              </div>
            </div>

            {/* Timeline d'activité récente
            <div className="bg-card rounded-xl shadow-lg overflow-hidden border border-border/50">
              <div className="bg-primary/10 p-6">
                <h2 className="text-xl font-semibold mb-2">Recent Activity</h2>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {activityData
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .slice(0, 15)
                    .map((activity: any, index: number) => {
                      const date = new Date(activity.createdAt);
                      const formattedDate = date.toLocaleDateString();
                      const formattedTime = date.toLocaleTimeString();
                      
                      // Détermine le type d'activité
                      let activityType = '';
                      let details = '';
                      let icon = null;
                      
                      if ('amount' in activity) {
                        activityType = 'XP Earned';
                        details = `${activity.amount} XP - ${activity.path?.split('/').pop() || 'Unknown'}`;
                        icon = (
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-chart-1">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                          </svg>
                        );
                      } else if ('grade' in activity && 'object' in activity) {
                        activityType = 'Project Progress';
                        details = `${activity.object?.name || activity.path?.split('/').pop() || 'Unknown'} - Grade: ${activity.grade}`;
                        icon = (
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                          </svg>
                        );
                      } else if ('grade' in activity) {
                        activityType = 'Result';
                        details = `${activity.path?.split('/').pop() || 'Unknown'} - Grade: ${activity.grade}`;
                        icon = (
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-chart-3">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10 9 9 9 8 9"></polyline>
                          </svg>
                        );
                      }
                      
                      return (
                        <div key={index} className="flex space-x-4">
                          <div className="mt-1">
                            <div className="bg-muted/50 rounded-full p-2">
                              {icon}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h4 className="text-base font-medium">{activityType}</h4>
                              <span className="text-xs text-muted-foreground">{formattedDate} at {formattedTime}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{details}</p>
                            <div className="mt-2 text-xs text-muted-foreground truncate max-w-full">
                              {activity.path || ''}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div> */}
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-16 py-6 border-t border-border/40">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          © {new Date().getFullYear()} Zone01 Profile Dashboard
        </div>
      </footer>
    </div>
  );
}
