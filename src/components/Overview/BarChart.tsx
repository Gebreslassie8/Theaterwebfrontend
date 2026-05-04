// src/components/Overview/BarChart.tsx
import React from 'react';
import {
    BarChart as ReBarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import Colors from '../Reusable/Colors';

export interface BarChartProps {
    data: Array<{ [key: string]: any }>;
    bars: Array<{
        dataKey: string;
        name: string;
        color?: string;
        stackId?: string;
    }>;
    xAxisKey?: string;
    xAxisLabel?: string;
    yAxisLabel?: string;
    height?: number;
    layout?: 'vertical' | 'horizontal';
    barSize?: number;
    stacked?: boolean;
    showGrid?: boolean;
    showLegend?: boolean;
    showTooltip?: boolean;
    loading?: boolean;
}

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 rounded-lg shadow-lg border" style={{ borderColor: Colors.lightGray }}>
                <p className="font-semibold mb-1" style={{ color: Colors.deepBlue }}>{label}</p>
                {payload.map((p: any, idx: number) => (
                    <p key={idx} className="text-xs" style={{ color: p.fill || Colors.smokyGray }}>
                        {p.name}: {typeof p.value === 'number' ? p.value.toLocaleString() : p.value}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export const BarChart: React.FC<BarChartProps> = ({
    data,
    bars,
    xAxisKey = 'name',
    xAxisLabel,
    yAxisLabel,
    height = 350,
    layout = 'horizontal',
    barSize = 40,
    stacked = false,
    showGrid = true,
    showLegend = true,
    showTooltip = true,
    loading = false,
}) => {
    const isHorizontal = layout === 'vertical';
    
    if (loading) {
        return (
            <div className="animate-pulse" style={{ height }}>
                <div className="bg-gray-200 rounded h-full w-full" style={{ backgroundColor: Colors.lightGray }}></div>
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={height}>
            <ReBarChart data={data} layout={layout} barSize={barSize}>
                {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={Colors.lightGray} />}
                {!isHorizontal && <XAxis dataKey={xAxisKey} stroke={Colors.smokyGray} label={xAxisLabel ? { value: xAxisLabel, position: 'insideBottom', offset: -5 } : undefined} />}
                {!isHorizontal && <YAxis stroke={Colors.smokyGray} label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : undefined} />}
                {isHorizontal && <XAxis type="number" stroke={Colors.smokyGray} />}
                {isHorizontal && <YAxis type="category" dataKey={xAxisKey} stroke={Colors.smokyGray} />}
                {showTooltip && <Tooltip content={<CustomTooltip />} />}
                {showLegend && <Legend />}
                {bars.map((bar, index) => (
                    <Bar
                        key={bar.dataKey}
                        dataKey={bar.dataKey}
                        name={bar.name}
                        fill={bar.color || (index === 0 ? Colors.deepTeal : Colors.skyTeal)}
                        stackId={stacked ? (bar.stackId || 'stack') : undefined}
                        radius={[8, 8, 0, 0]}
                    />
                ))}
            </ReBarChart>
        </ResponsiveContainer>
    );
};