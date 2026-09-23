import React from 'react';

export const StatCard = ({ title, value, change, icon: Icon, color = "maroon" }) => {
  const colorMap = {
    maroon: "bg-maroon-50 text-maroon-600 border-rose-100",
    gold: "bg-amber-50 text-amber-700 border-amber-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    sky: "bg-sky-50 text-sky-600 border-sky-100"
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-xs hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-muted-500 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-bold text-dark-800 mt-1">{value}</h3>
          {change && (
            <p className="text-xs font-medium text-emerald-600 mt-1 flex items-center gap-1">
              <span>{change}</span>
            </p>
          )}
        </div>
        {Icon && (
          <div className={`p-3.5 rounded-xl border ${colorMap[color] || colorMap.maroon}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
};
export default StatCard;
