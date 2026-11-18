import React from 'react';

interface StatItem {
  label: string;
  value: string | number;
  subtext?: string;
}

interface SectionHeaderCardProps {
  category: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  iconTone?: 'emerald' | 'gold' | 'red' | 'slate';
  badge?: {
    text: string;
    tone?: 'emerald' | 'gold' | 'red' | 'neutral';
  };
  action?: React.ReactNode;
  stats?: StatItem[];
  children?: React.ReactNode;
}

export const SectionHeaderCard: React.FC<SectionHeaderCardProps> = ({
  category,
  title,
  subtitle,
  icon: Icon,
  iconTone = 'emerald',
  badge,
  action,
  stats,
  children,
}) => {
  const iconBgClasses = {
    emerald: 'bg-gradient-to-br from-[#007A43] to-[#005A30] text-white shadow-emerald-950/20',
    gold: 'bg-gradient-to-br from-[#C9963B] to-[#8F651C] text-white shadow-amber-950/20',
    red: 'bg-gradient-to-br from-[#D61F33] to-[#AD1425] text-white shadow-rose-950/20',
    slate: 'bg-gradient-to-br from-[#1E293B] to-[#0F172A] text-white shadow-slate-950/20',
  }[iconTone];

  const badgeClasses = {
    emerald: 'bg-[#007A43]/10 text-[#007A43] border-[#007A43]/20',
    gold: 'bg-[#F3E5C2] text-[#8F651C] border-[#C9963B]/30',
    red: 'bg-[#D61F33]/10 text-[#D61F33] border-[#D61F33]/20',
    neutral: 'bg-stone-100 text-stone-600 border-stone-200',
  }[badge?.tone ?? 'emerald'];

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_6px_20px_rgba(0,0,0,0.02)] p-6 md:p-7 relative overflow-hidden transition-all">
      {/* Subtle background ambient glow matching institutional tone */}
      <div
        className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 rounded-full bg-gradient-to-br from-[#007A43]/[0.04] to-transparent blur-2xl"
        aria-hidden="true"
      />

      <div className="relative flex flex-col md:flex-row md:items-start justify-between gap-5">
        <div className="space-y-3 max-w-3xl">
          {/* Category Chip + Optional Badge */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-[0.14em] uppercase bg-[#007A43]/10 text-[#007A43] border border-[#007A43]/15">
              {category}
            </span>
            {badge && (
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${badgeClasses}`}
              >
                {badge.text}
              </span>
            )}
          </div>

          {/* Module Icon + Title Header */}
          <div className="flex items-start gap-3.5 sm:gap-4">
            <div
              className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm mt-0.5 ${iconBgClasses}`}
            >
              <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>

            <div className="min-w-0 space-y-1">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#111412] tracking-tight leading-snug">
                {title}
              </h1>
              <p className="text-xs sm:text-sm text-[#636C67] leading-relaxed">
                {subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Action Button Area */}
        {action && <div className="shrink-0 flex items-center self-start pt-1">{action}</div>}
      </div>

      {/* Optional Stats Bar */}
      {stats && stats.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 mt-5 border-t border-stone-100">
          {stats.map((st) => (
            <div
              key={st.label}
              className="px-3.5 py-2.5 rounded-xl bg-stone-50/80 border border-stone-200/60"
            >
              <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider truncate">
                {st.label}
              </div>
              <div className="font-serif text-lg font-bold text-[#111412] tabular-nums mt-0.5">
                {st.value}
              </div>
              {st.subtext && (
                <div className="text-[10px] text-stone-400 truncate mt-0.5">{st.subtext}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {children && <div className="mt-5 pt-5 border-t border-stone-100">{children}</div>}
    </div>
  );
};
