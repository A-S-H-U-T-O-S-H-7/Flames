export default function StatsCard({ title, value, subValue, icon, color, alert = false }) {
  return (
    <div className={`bg-gradient-to-br ${color} rounded-xl p-4 md:p-6 text-white relative overflow-hidden transition-all duration-300 hover:scale-105 ${alert ? 'ring-2 ring-yellow-400 animate-pulse' : ''}`}>
      {alert && (
        <div className="absolute top-2 right-2 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
      )}
      <div className="flex items-center justify-between mb-3">
        <div className="text-2xl md:text-3xl opacity-80">{icon}</div>
      </div>
      <div>
        <h3 className="text-xs md:text-sm font-medium opacity-90 mb-1">{title}</h3>
        <p className="text-xl md:text-2xl font-bold mb-1">{value}</p>
        {subValue && (
          <p className="text-xs opacity-75">{subValue}</p>
        )}
      </div>
    </div>
  );
}