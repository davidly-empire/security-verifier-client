// app/components/home-ui/LivePatrolStatus.tsx
interface Patrol {
  id: number;
  guardName: string;
  routeName: string;
  startTime: string;
  expectedEndTime: string;
  progress: number;
}

interface LivePatrolStatusProps {
  patrols: Patrol[];
}

export function LivePatrolStatus({ patrols }: LivePatrolStatusProps) {
  const getProgressColor = (progress: number) => {
    if (progress >= 75) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Live Patrol Status</h2>
        <div className="flex items-center">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
          <span className="text-sm text-gray-600">Live</span>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <th className="pb-3">Guard</th>
              <th className="pb-3">Route</th>
              <th className="pb-3">Time</th>
              <th className="pb-3">Progress</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {patrols.map((patrol) => (
              <tr key={patrol.id} className="hover:bg-gray-50">
                <td className="py-3">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium text-gray-700">
                      {patrol.guardName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="ml-3 text-sm font-medium text-gray-900">{patrol.guardName}</div>
                  </div>
                </td>
                <td className="py-3 text-sm text-gray-700">{patrol.routeName}</td>
                <td className="py-3 text-sm text-gray-500">
                  <div>{patrol.startTime}</div>
                  <div className="text-xs">- {patrol.expectedEndTime}</div>
                </td>
                <td className="py-3">
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className={`h-2 rounded-full ${getProgressColor(patrol.progress)}`}
                        style={{ width: `${patrol.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700">{patrol.progress}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}