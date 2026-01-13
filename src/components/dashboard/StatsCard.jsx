// src/components/dashboard/StatsCard.jsx
export const StatsCard = ({ title, value, icon: Icon, color, bgColor }) => {
  return (
    <div className="bg-card border border-border rounded-xl p-5  shadow-sm  transition-all duration-200 hover:shadow-lg">
      <div className="flex items-center justify-between space-x-3">
        <div className={`p-2 rounded-lg ${bgColor}`}>
          <Icon className={`h-7 w-7 ${color}`} />
        </div>
      
      <div className="flex-1">
        <h2 className="font-medium text-muted-foreground">
          {title}
        </h2>
        <p className="text-xl font-bold text-foreground">
          {value.toLocaleString()}
        </p>
      </div>
      </div>
    </div>
  );
};
