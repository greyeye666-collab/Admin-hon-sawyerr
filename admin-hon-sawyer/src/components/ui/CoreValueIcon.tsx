import React from 'react';
import { BookOpen, Heart, Scale, ShieldCheck, TrendingUp, Users } from 'lucide-react';
import type { CoreValueIconName } from '../../types/database';

export const CoreValueIcon: React.FC<{
  name: CoreValueIconName;
  className?: string;
}> = ({ name, className = 'w-4 h-4' }) => {
  switch (name) {
    case 'heart':
      return <Heart className={className} />;
    case 'book':
      return <BookOpen className={className} />;
    case 'shield':
      return <ShieldCheck className={className} />;
    case 'users':
      return <Users className={className} />;
    case 'trending-up':
      return <TrendingUp className={className} />;
    case 'scale':
      return <Scale className={className} />;
  }
};
