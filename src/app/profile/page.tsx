'use client';

import { useQuery } from '@apollo/client';
import { GET_USER_INFO, GET_USER_XP, GET_USER_PROGRESS, GET_USER_RESULTS } from '@/lib/queries';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { XPChart } from '@/components/charts/XPChart';
import { ProjectsChart } from '@/components/charts/ProjectsChart';
import { Button } from '@/components/ui/button';

export default function ProfilePage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  
  const { data: userData, loading: userLoading } = useQuery(GET_USER_INFO);
  const { data: xpData, loading: xpLoading } = useQuery(GET_USER_XP);
  const { data: progressData, loading: progressLoading } = useQuery(GET_USER_PROGRESS);
  const { data: resultsData, loading: resultsLoading } = useQuery(GET_USER_RESULTS);
  
  // Handle authentication check on client side
  useEffect(() => {
    setIsClient(true);
    const token = localStorage.getItem('jwt_token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);
  
  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    router.push('/login');
  };
  
  // Calculate total XP
  const totalXP = xpData?.transaction?.reduce((sum: number, tx: { amount: number }) => sum + tx.amount, 0) || 0;
  
  // Loading state
  if (userLoading || xpLoading || progressLoading || resultsLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading profile data...</div>;
  }
  
  // Auth check for SSR
  if (!isClient) {
    return null;
  }

  return (
    <div className="min-h-screen p-8">
      <header className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-bold">My Profile</h1>
        <Button variant="destructive" onClick={handleLogout}>Logout</Button>
      </header>
      
      {/* User Info Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">User Information</h2>
        {userData?.user && userData.user[0] && (
          <div className="bg-card p-6 rounded-lg shadow">
            <p className="text-lg mb-2">Login: {userData.user[0].login}</p>
            <p className="text-lg mb-2">User ID: {userData.user[0].id}</p>
            {userData.user[0].attrs && (
              <p className="mb-2">Campus: {JSON.parse(userData.user[0].attrs)?.campus || 'N/A'}</p>
            )}
          </div>
        )}
      </section>
      
      {/* XP Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Experience Points</h2>
        <div className="bg-card p-6 rounded-lg shadow">
          <p className="text-lg mb-4">Total XP: {totalXP.toLocaleString()}</p>
          
          {/* XP Timeline Chart */}
          {xpData?.transaction && (
            <div className="h-64 mt-6">
              <XPChart data={xpData.transaction} />
            </div>
          )}
        </div>
      </section>
      
      {/* Projects Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Projects</h2>
        <div className="bg-card p-6 rounded-lg shadow grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Project Stats */}
          <div>
            <h3 className="text-xl mb-4">Project Completion</h3>
            {progressData?.progress && (
              <ProjectsChart data={progressData.progress} />
            )}
          </div>
          
          {/* Recent Projects */}
          <div>
            <h3 className="text-xl mb-4">Recent Projects</h3>
            <ul className="space-y-2">
              {resultsData?.result?.slice(0, 5).map((result: any) => (
                <li key={result.id} className="flex items-center justify-between">
                  <span className="truncate max-w-[200px]">
                    {result.path?.split('/').pop() || 'Unknown Project'}
                  </span>
                  <span className={result.grade > 0 ? "text-chart-1" : "text-destructive"}>
                    {result.grade > 0 ? 'PASS' : 'FAIL'}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}