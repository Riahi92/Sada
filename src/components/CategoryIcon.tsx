import React from 'react';
import { 
  Landmark, 
  Globe, 
  TrendingUp, 
  Users, 
  Scale, 
  Palette, 
  Trophy, 
  Cpu, 
  HeartPulse, 
  Sparkles, 
  Folder,
  LucideProps
} from 'lucide-react';

interface CategoryIconProps extends LucideProps {
  name?: string;
  slug?: string;
  icon?: string;
  showBadge?: boolean;
}

// Icon mapping by slug or icon name
export const getCategoryIconComponent = (slugOrIcon?: string): React.ComponentType<LucideProps> => {
  const key = (slugOrIcon || '').toLowerCase();
  
  if (key === 'tunisia' || key === 'landmark' || key === 'flag') return Landmark;
  if (key === 'world' || key === 'globe') return Globe;
  if (key === 'economy' || key === 'trendingup' || key === 'trending-up') return TrendingUp;
  if (key === 'society' || key === 'users') return Users;
  if (key === 'incidents' || key === 'crimes' || key === 'justice' || key === 'scale') return Scale;
  if (key === 'culture' || key === 'palette') return Palette;
  if (key === 'sports' || key === 'trophy') return Trophy;
  if (key === 'technology' || key === 'tech-ai' || key === 'cpu' || key === 'bot') return Cpu;
  if (key === 'health' || key === 'heartpulse' || key === 'heart-pulse') return HeartPulse;
  if (key === 'variety' || key === 'sparkles') return Sparkles;
  
  return Folder;
};

// Distinctive color palettes for each category
export const getCategoryColorClasses = (slug?: string) => {
  const key = (slug || '').toLowerCase();
  switch (key) {
    case 'tunisia':
      return {
        bg: 'bg-red-50 text-red-600 border-red-200',
        activeBg: 'bg-red-600 text-white',
        dot: 'bg-red-600',
        text: 'text-red-600'
      };
    case 'world':
      return {
        bg: 'bg-blue-50 text-blue-600 border-blue-200',
        activeBg: 'bg-blue-600 text-white',
        dot: 'bg-blue-600',
        text: 'text-blue-600'
      };
    case 'economy':
      return {
        bg: 'bg-amber-50 text-amber-600 border-amber-200',
        activeBg: 'bg-amber-600 text-white',
        dot: 'bg-amber-600',
        text: 'text-amber-600'
      };
    case 'society':
      return {
        bg: 'bg-purple-50 text-purple-600 border-purple-200',
        activeBg: 'bg-purple-600 text-white',
        dot: 'bg-purple-600',
        text: 'text-purple-600'
      };
    case 'incidents':
      return {
        bg: 'bg-slate-100 text-slate-700 border-slate-300',
        activeBg: 'bg-slate-800 text-white',
        dot: 'bg-slate-700',
        text: 'text-slate-700'
      };
    case 'culture':
      return {
        bg: 'bg-pink-50 text-pink-600 border-pink-200',
        activeBg: 'bg-pink-600 text-white',
        dot: 'bg-pink-600',
        text: 'text-pink-600'
      };
    case 'sports':
      return {
        bg: 'bg-emerald-50 text-emerald-600 border-emerald-200',
        activeBg: 'bg-emerald-600 text-white',
        dot: 'bg-emerald-600',
        text: 'text-emerald-600'
      };
    case 'technology':
      return {
        bg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
        activeBg: 'bg-cyan-700 text-white',
        dot: 'bg-cyan-600',
        text: 'text-cyan-700'
      };
    case 'health':
      return {
        bg: 'bg-rose-50 text-rose-600 border-rose-200',
        activeBg: 'bg-rose-600 text-white',
        dot: 'bg-rose-600',
        text: 'text-rose-600'
      };
    case 'variety':
      return {
        bg: 'bg-yellow-50 text-yellow-700 border-yellow-200',
        activeBg: 'bg-yellow-600 text-white',
        dot: 'bg-yellow-600',
        text: 'text-yellow-700'
      };
    default:
      return {
        bg: 'bg-gray-100 text-gray-700 border-gray-200',
        activeBg: 'bg-gray-800 text-white',
        dot: 'bg-gray-600',
        text: 'text-gray-700'
      };
  }
};

export default function CategoryIcon({
  slug,
  icon,
  showBadge = false,
  className = 'w-4 h-4',
  ...props
}: CategoryIconProps) {
  const IconComponent = getCategoryIconComponent(slug || icon);
  const color = getCategoryColorClasses(slug);

  if (showBadge) {
    return (
      <span className={`inline-flex items-center justify-center p-1 rounded-md border ${color.bg}`}>
        <IconComponent className={className} {...props} />
      </span>
    );
  }

  return <IconComponent className={className} {...props} />;
}
