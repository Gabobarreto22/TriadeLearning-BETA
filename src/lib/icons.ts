import {
  Award, BarChart3, BookOpen, CircleHelp, Settings, ShieldCheck, Users, type LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Award, BarChart3, BookOpen, CircleHelp, Settings, ShieldCheck, Users,
};

export const availableIcons = Object.keys(iconMap);

export function getIcon(name: string): LucideIcon {
  return iconMap[name] ?? BookOpen;
}

export const availableAccents = ['gray-1', 'gray-2', 'gray-3', 'gray-4', 'gray-5', 'gray-6'];
