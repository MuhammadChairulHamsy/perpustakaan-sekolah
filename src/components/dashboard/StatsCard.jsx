import React from "react";

export const StatsCard = React.memo(
  ({ title, value, icon: Icon, color, bgColor, description }) => {
    const formattedValue = value;
    const borderColor = React.useMemo(() => {
      if (!bgColor || typeof bgColor !== "string") return "";
      return bgColor.includes("bg-")
        ? bgColor.replace("bg-", "bg-opacity-50 bg-")
        : "";
    }, [bgColor]);

    return (
      <div className="group relative overflow-hidden bg-white border rounded-2xl p-6 shadow-sm transition-all duration-300 hover:shadow-lg">
        <div
          className={`absolute -right-4 -top-4 h-20 w-20 rounded-full opacity-10 blur-xl transition-opacity group-hover:opacity-20 ${bgColor}`}
        />

        <div className="relative flex items-center justify-between">
          <div className="space-y-2">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              {title}
            </h2>

            <p className="text-2xl font-bold tracking-tight text-foreground">
              {formattedValue}
            </p>

            <p className="text-xs text-muted-foreground leading-relaxed max-w-40">
              {description}
            </p>
          </div>

          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl ${bgColor}`}
          >
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
        </div>

        <div
          className={`absolute bottom-0 left-0 h-1 w-0 transition-all duration-500 group-hover:w-full ${borderColor}`}
        />
      </div>
    );
  },
);
