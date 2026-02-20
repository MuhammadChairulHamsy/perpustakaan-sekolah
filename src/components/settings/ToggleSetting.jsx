import { Switch } from "../ui/switch";

// components/settings/ToggleSetting.jsx
export const ToggleSetting = ({ title, description, checked, onCheckedChange }) => (
  <div className="flex items-center justify-between rounded-xl border p-4 hover:bg-muted/50 transition-colors">
    <div className="space-y-0.5">
      <p className="font-medium">{title}</p>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
    <Switch checked={checked} onCheckedChange={onCheckedChange} />
  </div>
);