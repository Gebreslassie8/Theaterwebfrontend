// src/components/Overview/AreaChart.tsx
import React from 'react';
import {
    AreaChart as ReAreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import Colors from '../Reusable/Colors';

export interface AreaChartProps {
    data: Array<{ [key: string]: any }>;
    areas: Array<{
        dataKey: string;
        name: string;
        color?: string;
        strokeWidth?: number;
        fillOpacity?: number;
        gradient?: boolean;
    }>;
    xAxisKey?: string;
    xAxisLabel?: string;
    yAxisLabel?: string;
    height?: number;
    stacked?: boolean;
    showGrid?: boolean;
    showLegend?: boolean;
    showTooltip?: boolean;
    curveType?: 'monotone' | 'linear' | 'step';
    loading?: boolean;
}

// Format large numbers for Y-axis
const formatYAxisTick = (value: number) => {
    if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
        return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toString();
};

// Format currency for tooltip
const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'ETB',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
};

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 rounded-lg shadow-lg border" style={{ borderColor: Colors.lightGray }}>
                <p className="font-semibold mb-1" style={{ color: Colors.deepBlue }}>{label}</p>
                {payload.map((p: any, idx: number) => (
                    <p key={idx} className="text-xs" style={{ color: p.color || Colors.smokyGray }}>
                        {p.name}: {formatCurrency(p.value)}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export const AreaChart: React.FC<AreaChartProps> = ({
    data,
    areas,
    xAxisKey = 'period',
    xAxisLabel,
    yAxisLabel = 'Revenue (ETB)',
    height = 350,
    stacked = false,
    showGrid = true,
    showLegend = true,
    showTooltip = true,
    curveType = 'monotone',
    loading = false,
}) => {
    if (loading) {
        return (
            <div className="animate-pulse" style={{ height }}>
                <div className="bg-gray-200 rounded h-full w-full" style={{ backgroundColor: Colors.lightGray }}></div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center" style={{ height }}>
                <p className="text-sm" style={{ color: Colors.smokyGray }}>No data available</p>
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={height}>
            <ReAreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                    {areas.map((area, index) => (
                        <linearGradient key={`gradient-${area.dataKey}`} id={`gradient-${area.dataKey}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={area.color || Colors.deepTeal} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={area.color || Colors.deepTeal} stopOpacity={0} />
                        </linearGradient>
                    ))}
                </defs>
                {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={Colors.lightGray} opacity={0.5} />}
                <XAxis 
                    dataKey={xAxisKey} 
                    stroke={Colors.smokyGray}
                    tick={{ fontSize: 11, fill: Colors.smokyGray }}
                    tickLine={{ stroke: Colors.lightGray }}
                    axisLine={{ stroke: Colors.lightGray }}
                    label={xAxisLabel ? { value: xAxisLabel, position: 'insideBottom', offset: -5, style: { fill: Colors.smokyGray, fontSize: 12 } } : undefined}
                />
                <YAxis 
                    stroke={Colors.smokyGray}
                    tick={{ fontSize: 11, fill: Colors.smokyGray }}
                    tickLine={{ stroke: Colors.lightGray }}
                    axisLine={{ stroke: Colors.lightGray }}
                    tickFormatter={formatYAxisTick}
                    label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft', style: { fill: Colors.smokyGray, fontSize: 12, textAnchor: 'middle' } } : undefined}
                />
                {showTooltip && <Tooltip content={<CustomTooltip />} />}
                {showLegend && <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />}
                {areas.map((area, index) => (
                    <Area
                        key={area.dataKey}
                        type={curveType}
                        dataKey={area.dataKey}
                        name={area.name}
                        stroke={area.color || Colors.deepTeal}
                        strokeWidth={area.strokeWidth || 2}
                        fill={area.gradient !== false ? `url(#gradient-${area.dataKey})` : (area.color || Colors.deepTeal)}
                        fillOpacity={area.fillOpacity !== undefined ? area.fillOpacity : 1}
                        stackId={stacked ? 'stack' : undefined}
                    />
                ))}
            </ReAreaChart>
        </ResponsiveContainer>
    );
};