import {
  BarChart3,
  Bookmark,
  Briefcase,
  CalendarCheck,
  FileText,
  LayoutDashboard,
  Settings,
  Sparkles,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface AppNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

/** Company / recruiter workspace navigation. */
export const APP_NAV: AppNavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Jobs", href: "/jobs", icon: Briefcase },
  { label: "Talent Pool", href: "/pool", icon: Sparkles },
  { label: "Shortlist", href: "/shortlist", icon: Bookmark },
  { label: "Candidates", href: "/candidates", icon: Users },
  { label: "Interviews", href: "/interviews", icon: CalendarCheck },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Settings", href: "/settings", icon: Settings },
];

/** Candidate portal navigation. */
export const PORTAL_NAV: AppNavItem[] = [
  { label: "Overview", href: "/portal", icon: LayoutDashboard },
  { label: "Browse Jobs", href: "/portal/jobs", icon: Briefcase },
  { label: "My Applications", href: "/portal/applications", icon: FileText },
  { label: "Profile", href: "/portal/profile", icon: UserRound },
];
