import { Building2, FileText, TrendingUp, Calendar } from 'lucide-react';

export default function BusinessDetails({ 
  businessInfo = {
    businessType: "Technology & Software",
    businessDescription: "Leading provider of enterprise solutions and cloud services"
  }, 
  createdAt = { seconds: 1640995200 }, 
  commission = 15 
}) {
  const topRowDetails = [
    { 
      icon: Building2, 
      label: "Business Type", 
      value: businessInfo.businessType || '-',
      color: "emerald"
    },
    { 
      icon: TrendingUp, 
      label: "Commission Rate", 
      value: commission ? `${commission}%` : '-',
      color: "purple"
    },
     { 
      icon: Calendar, 
      label: "Member Since", 
      value: createdAt?.seconds ? new Date(createdAt.seconds * 1000).toLocaleDateString('en-IN') : '-',
      color: "amber"
    }
  ];

  const descriptionDetail = { 
    icon: FileText, 
    label: "Description", 
    value: businessInfo.businessDescription || '-',
    color: "blue"
  };

  const colorClasses = {
    emerald: {
      icon: "text-emerald-500 dark:text-emerald-400",
      label: "text-emerald-600 dark:text-emerald-300",
      bg: "bg-emerald-500/10"
    },
    blue: {
      icon: "text-blue-500 dark:text-blue-400",
      label: "text-blue-600 dark:text-blue-300",
      bg: "bg-blue-500/10"
    },
    purple: {
      icon: "text-purple-500 dark:text-purple-400",
      label: "text-purple-600 dark:text-purple-300",
      bg: "bg-purple-500/10"
    },
    amber: {
      icon: "text-amber-500 dark:text-amber-400",
      label: "text-amber-600 dark:text-amber-300",
      bg: "bg-amber-500/10"
    }
  };

  return (
    <div className="w-full pb-5 mx-auto">
      <div className="relative bg-gradient-to-br from-violet-50 to-purple-100 dark:from-gray-900 dark:via-purple-900/30 dark:to-slate-900 rounded-2xl p-5 shadow-xl dark:shadow-2xl overflow-hidden border border-dashed border-violet-700 dark:border-violet-500">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 dark:bg-violet-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 shadow-lg shadow-violet-500/30 dark:shadow-violet-500/20">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Business Details</h2>
              <p className="text-sm text-violet-600 dark:text-violet-300">Company information & profile</p>
            </div>
          </div>

          {/* First Row - Business Type, Commission, Member Since */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {topRowDetails.map((item, index) => (
              <div 
                key={index} 
                className="group bg-white/70 dark:bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-violet-100 dark:border-white/10 hover:bg-white dark:hover:bg-white/10 hover:border-violet-300 dark:hover:border-violet-400/50 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${colorClasses[item.color].bg}`}>
                    <item.icon className={`w-4 h-4 ${colorClasses[item.color].icon}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-xs font-semibold ${colorClasses[item.color].label} uppercase tracking-wide mb-2`}>
                      {item.label}
                    </div>
                    <p className="text-base font-bold text-gray-900 dark:text-white break-words leading-tight">
                      {item.value}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Second Row - Description (Full Width) */}
          <div className="group bg-white/70 dark:bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-violet-100 dark:border-white/10 hover:bg-white dark:hover:bg-white/10 hover:border-violet-300 dark:hover:border-violet-400/50 hover:shadow-lg transition-all duration-300">
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${colorClasses[descriptionDetail.color].bg}`}>
                <descriptionDetail.icon className={`w-4 h-4 ${colorClasses[descriptionDetail.color].icon}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-xs font-semibold ${colorClasses[descriptionDetail.color].label} uppercase tracking-wide mb-2`}>
                  {descriptionDetail.label}
                </div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-relaxed">
                  {descriptionDetail.value}
                </p>
              </div>
            </div>
          </div>

          
        </div>
      </div>
    </div>
  );
}