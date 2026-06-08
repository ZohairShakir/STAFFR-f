'use client';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { cn } from '@/lib/utils';
import type { HiringFunnelReport } from '@/lib/api';

interface HiringFunnelChartProps {
  data: HiringFunnelReport[];
  className?: string;
  bare?: boolean;
}

export function HiringFunnelChart({ data, className, bare }: HiringFunnelChartProps) {
  const chartData = data.map((d) => ({
    name: d.projectTitle,
    pending: d.pending,
    reviewing: d.reviewing,
    accepted: d.accepted,
    rejected: d.rejected,
    withdrawn: d.withdrawn,
  }));

  const content = (
    <>
      {!bare && (
        <h3 className="section-heading mb-4">Hiring Funnel</h3>
      )}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,23,42,0.06)" />
            <XAxis
              dataKey="name"
              tick={{ fill: '#6B7280', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFFFFF',
                border: '1px solid rgba(15,23,42,0.08)',
                borderRadius: 12,
                fontSize: 12,
                boxShadow: '0 4px 16px rgba(15,23,42,0.08)',
              }}
              labelStyle={{ color: '#111827', fontWeight: 600 }}
            />
            <Bar dataKey="pending" fill="#4F6EF7" radius={[3, 3, 0, 0]} />
            <Bar dataKey="reviewing" fill="#F59E0B" radius={[3, 3, 0, 0]} />
            <Bar dataKey="accepted" fill="#22C55E" radius={[3, 3, 0, 0]} />
            <Bar dataKey="rejected" fill="#EF4444" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-4">
        {[
          { label: 'Pending', color: 'bg-[#4F6EF7]' },
          { label: 'Reviewing', color: 'bg-amber-500' },
          { label: 'Accepted', color: 'bg-emerald-500' },
          { label: 'Rejected', color: 'bg-[#EF4444]' },
        ].map(({ label, color }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className={cn('h-2.5 w-2.5 rounded-sm', color)} />
            <span className="text-xs text-[var(--text-muted)]">{label}</span>
          </div>
        ))}
      </div>
    </>
  );

  if (bare) {
    return <div className={className}>{content}</div>;
  }

  return (
    <div className={cn('surface-card p-5', className)}>
      {content}
    </div>
  );
}
