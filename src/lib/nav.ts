import { LayoutGrid, CheckSquare, Calendar, BookOpen, TrendingUp, Sparkles, Settings, User } from "lucide-react";

export const mainNav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/assignments", label: "Assignments", icon: CheckSquare },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/subjects", label: "Subjects", icon: BookOpen },
  { href: "/analytics", label: "Analytics", icon: TrendingUp },
  { href: "/ai-scanner", label: "AI Scanner", icon: Sparkles },
] as const;

export const personalNav = [
  { href: "/profile", label: "Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;
