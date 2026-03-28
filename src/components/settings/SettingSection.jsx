// components/settings/SettingSection.jsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const SettingSection = ({ title, description, children, footer }) => (
  <Card className="border-none shadow-none bg-transparent lg:border">
    <CardHeader>
      <CardTitle className="text-xl font-bold">{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent className="space-y-6">
      {children}
      {footer && (
        <div className="flex justify-end pt-4 border-t">
          {footer}
        </div>
      )}
    </CardContent>
  </Card>
);

