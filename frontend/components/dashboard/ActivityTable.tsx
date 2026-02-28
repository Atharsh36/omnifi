'use client';

export default function ActivityTable() {
  const activities = [
    { type: 'Prediction', action: 'Bought YES', amount: '0.5 BNB', time: '2 hours ago' },
    { type: 'Launchpad', action: 'Contributed', amount: '2.0 BNB', time: '5 hours ago' },
    { type: 'Credit', action: 'Borrowed', amount: '0.8 BNB', time: '1 day ago' },
    { type: 'Prediction', action: 'Claimed', amount: '1.2 BNB', time: '2 days ago' },
  ];

  return (
    <div className="bg-background-dark border border-white/5 rounded-xl p-6">
      <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-slate-400 text-sm border-b border-white/5">
              <th className="pb-3">Type</th>
              <th className="pb-3">Action</th>
              <th className="pb-3">Amount</th>
              <th className="pb-3">Time</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity, i) => (
              <tr key={i} className="border-b border-white/5 last:border-0">
                <td className="py-3">
                  <span className="bg-primary/10 text-primary px-2 py-1 rounded text-sm">
                    {activity.type}
                  </span>
                </td>
                <td className="py-3 text-gray-300">{activity.action}</td>
                <td className="py-3 font-medium">{activity.amount}</td>
                <td className="py-3 text-slate-400 text-sm">{activity.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
