import {
  LayoutGrid,
  CheckSquare,
  Calendar,
  BookOpen,
  TrendingUp,
  Sparkles,
  Settings,
  User,
} from "lucide-react";

export const primaryNav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/assignments", label: "Assignments", icon: CheckSquare },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/subjects", label: "Subjects", icon: BookOpen },
  { href: "/analytics", label: "Analytics", icon: TrendingUp },
] as const;

export const intelligentNav = [
  { href: "/ai-scanner", label: "AI Scanner", icon: Sparkles },
] as const;

export const personalNav = [
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/profile", label: "Profile", icon: User },
] as const;

export const mobileNav = [
  { href: "/dashboard", label: "Home", icon: LayoutGrid },
  { href: "/assignments", label: "Tasks", icon: CheckSquare },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/subjects", label: "Subjects", icon: BookOpen },
] as const;
