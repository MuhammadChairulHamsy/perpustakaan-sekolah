// src/components/dashboard/StatsCard.jsx
export const StatsCard = ({ title, value, icon: Icon, color, bgColor }) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <div className={`p-3 rounded-lg ${bgColor}`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
      </div>
      <h3 className="text-sm font-medium text-muted-foreground mb-1">
        {title}
      </h3>
      <p className="text-2xl font-bold text-foreground">
        {value.toLocaleString()}
      </p>
    </div>
  );
};