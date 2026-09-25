import {
  Award, BarChart3, BookOpen, CircleHelp, Lock, Settings, ShieldCheck, Star, Target,
  TrendingUp, Trophy, Users, Zap, type LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Award, BarChart3, BookOpen, CircleHelp, Lock, Settings, ShieldCheck, Star, Target,
  TrendingUp, Trophy, Users, Zap,
};

export const availableIcons = Object.keys(iconMap);

const aliasMap: Record<string, string> = {
  aprendizconstante: 'TrendingUp',
  aprendiz: 'BookOpen',
  constante: 'TrendingUp',
  experto: 'Trophy',
  expert: 'Trophy',
  primercurso: 'BookOpen',
  primer: 'BookOpen',
  curso: 'BookOpen',
  logro: 'Award',
  certificacion: 'Award',
  seguridad: 'ShieldCheck',
  progreso: 'TrendingUp',
};

export function getIcon(name?: string | null): LucideIcon {
  const normalized = (name ?? '').trim();
  if (!normalized) return BookOpen;

  const direct = iconMap[normalized] ?? iconMap[normalized.charAt(0).toUpperCase() + normalized.slice(1)];
  if (direct) return direct;

  const lookup = normalized.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  const matchByExact = Object.entries(iconMap).find(([key]) => key.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() === lookup);
  if (matchByExact) return matchByExact[1];

  const matchByAlias = Object.entries(aliasMap).find(([key]) => lookup.includes(key) || key.includes(lookup));
  if (matchByAlias) {
    const resolved = iconMap[matchByAlias[1]] ?? BookOpen;
    return resolved;
  }

  const fallback = Object.entries(iconMap).find(([key]) => lookup.includes(key.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()));
  return fallback?.[1] ?? BookOpen;
}

export const availableAccents = ['gray-1', 'gray-2', 'gray-3', 'gray-4', 'gray-5', 'gray-6'];
