// src/components/ui/sonner.jsx
"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

const Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      position="top-right"
      closeButton
      richColors
      expand={false}
      duration={4000}
      gap={12}
      visibleToasts={5}
      icons={{
        success: <CircleCheckIcon className="size-5" />,
        info: <InfoIcon className="size-5" />,
        warning: <TriangleAlertIcon className="size-5" />,
        error: <OctagonXIcon className="size-5" />,
        loading: <Loader2Icon className="size-5 animate-spin" />,
      }}
      toastOptions={{
        unstyled: false,
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border group-[.toaster]:shadow-2xl group-[.toaster]:rounded-xl group-[.toaster]:p-4 group-[.toaster]:gap-3 group-[.toaster]:backdrop-blur-sm",
          
          description: 
            "group-[.toast]:text-muted-foreground group-[.toast]:text-sm group-[.toast]:mt-1",
          
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:rounded-lg group-[.toast]:px-4 group-[.toast]:py-2 group-[.toast]:font-medium group-[.toast]:transition-all group-[.toast]:hover:bg-primary/90 group-[.toast]:shadow-sm",
          
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:rounded-lg group-[.toast]:px-4 group-[.toast]:py-2 group-[.toast]:font-medium group-[.toast]:transition-all group-[.toast]:hover:bg-muted/80",
          
          closeButton:
            "group-[.toast]:bg-background group-[.toast]:text-muted-foreground group-[.toast]:border group-[.toast]:border-border group-[.toast]:hover:bg-muted group-[.toast]:rounded-lg group-[.toast]:transition-all",
          
          // Success Toast - Green Theme
          success:
            "group-[.toaster]:bg-gradient-to-r group-[.toaster]:from-green-50 group-[.toaster]:to-emerald-50 dark:group-[.toaster]:from-green-950/50 dark:group-[.toaster]:to-emerald-950/50 group-[.toaster]:border-green-200 dark:group-[.toaster]:border-green-800 group-[.toaster]:text-green-900 dark:group-[.toaster]:text-green-100 [&>svg]:text-green-600 dark:[&>svg]:text-green-400",
          
          // Error Toast - Red Theme
          error:
            "group-[.toaster]:bg-gradient-to-r group-[.toaster]:from-red-50 group-[.toaster]:to-rose-50 dark:group-[.toaster]:from-red-950/50 dark:group-[.toaster]:to-rose-950/50 group-[.toaster]:border-red-200 dark:group-[.toaster]:border-red-800 group-[.toaster]:text-red-900 dark:group-[.toaster]:text-red-100 [&>svg]:text-red-600 dark:[&>svg]:text-red-400",
          
          // Warning Toast - Yellow/Orange Theme
          warning:
            "group-[.toaster]:bg-gradient-to-r group-[.toaster]:from-amber-50 group-[.toaster]:to-yellow-50 dark:group-[.toaster]:from-amber-950/50 dark:group-[.toaster]:to-yellow-950/50 group-[.toaster]:border-amber-200 dark:group-[.toaster]:border-amber-800 group-[.toaster]:text-amber-900 dark:group-[.toaster]:text-amber-100 [&>svg]:text-amber-600 dark:[&>svg]:text-amber-400",
          
          // Info Toast - Blue Theme
          info:
            "group-[.toaster]:bg-gradient-to-r group-[.toaster]:from-blue-50 group-[.toaster]:to-sky-50 dark:group-[.toaster]:from-blue-950/50 dark:group-[.toaster]:to-sky-950/50 group-[.toaster]:border-blue-200 dark:group-[.toaster]:border-blue-800 group-[.toaster]:text-blue-900 dark:group-[.toaster]:text-blue-100 [&>svg]:text-blue-600 dark:[&>svg]:text-blue-400",
          
          // Loading Toast - Gray Theme
          loading:
            "group-[.toaster]:bg-gradient-to-r group-[.toaster]:from-slate-50 group-[.toaster]:to-gray-50 dark:group-[.toaster]:from-slate-950/50 dark:group-[.toaster]:to-gray-950/50 group-[.toaster]:border-slate-200 dark:group-[.toaster]:border-slate-800 group-[.toaster]:text-slate-900 dark:group-[.toaster]:text-slate-100 [&>svg]:text-slate-600 dark:[&>svg]:text-slate-400",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }