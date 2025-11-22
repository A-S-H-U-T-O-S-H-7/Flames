export default function AlertItem({ icon, text, action, severity = 'normal' }) {
  const getSeverityStyle = () => {
    switch(severity) {
      case 'error': return 'bg-red-900/20 border-red-500/30';
      case 'warning': return 'bg-yellow-900/20 border-yellow-500/30';
      case 'info': return 'bg-blue-900/20 border-blue-500/30';
      case 'good': return 'bg-green-900/20 border-green-500/30';
      default: return 'bg-[#1e2737] border-gray-600/30';
    }
  };

  return (
    <div className={`flex items-center justify-between p-3 rounded-lg border ${getSeverityStyle()} transition-all duration-300 hover:scale-105`}>
      <div className="flex items-center space-x-3">
        {icon}
        <span className="text-gray-300 text-sm">{text}</span>
      </div>
      <button className="text-[#22c7d5] text-xs font-medium hover:text-[#1aa5b5] transition-colors">
        {action}
      </button>
    </div>
  );
}