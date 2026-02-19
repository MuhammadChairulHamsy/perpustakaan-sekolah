// src/components/dashboard/StatsCard.jsx
export const StatsCard = ({
  title,
  value,
  icon: Icon,
  color,
  bgColor,
  description,
}) => {
  return (
   <div className="group relative overflow-hidden bg-white/50 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Efek Gradient Glow saat Hover */}
      <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full opacity-10 blur-2xl transition-opacity group-hover:opacity-30 ${bgColor}`} />
      
      <div className="relative flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            {title}
          </h1>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold tracking-tight text-foreground">
              {(value ?? 0).toLocaleString()}
            </p>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-[150px]">
            {description}
          </p>
        </div>

        <div className={`relative flex h-14 w-14 items-center justify-center rounded-2xl ${bgColor} shadow-inner transition-transform duration-500 group-hover:rotate-[10deg] group-hover:scale-110`}>
          <Icon className={`h-8 w-8 ${color}`} />
        </div>
      </div>

      {/* Garis Dekoratif di Bawah */}
      <div className={`absolute bottom-0 left-0 h-1 w-0 transition-all duration-500 group-hover:w-full ${bgColor.replace('bg-', 'bg-opacity-50 bg-')}`} />
    </div>
  );
};
