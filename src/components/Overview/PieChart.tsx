// src/components/Overview/PieChart.tsx
import React, { useState } from 'react';
import { PieChart as RePieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Colors from '../Reusable/Colors';

export interface PieChartProps {
    data: Array<{
        name: string;
        value: number;
        color?: string;
    }>;
    height?: number;
    innerRadius?: number;
    outerRadius?: number;
    showLegend?: boolean;
    showTooltip?: boolean;
    showLabels?: boolean;
    loading?: boolean;
    className?: string;
}

// Professional color palette using your Colors
const DEFAULT_COLORS = [
    Colors.deepTeal,    // #007590
    Colors.skyTeal,     // #33A3B9
    Colors.deepBlue,    // #17304F
    Colors.deepAqua,    // #0089A8
    Colors.lightTeal,   // #6FCCC2
    Colors.red,         // #EF4444
    Colors.smokyGray,   // #6C6A6A
];

// Professional Custom Tooltip with better percentage display
const CustomTooltip: React.FC<any> = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0];
        const percent = ((data.payload.percent || 0) * 100).toFixed(1);
        
        return (
            <div className="bg-white rounded-xl shadow-xl border p-3 min-w-[180px]" style={{ borderColor: Colors.lightGray }}>
                <div className="flex items-center gap-2 mb-2 pb-2 border-b" style={{ borderBottomColor: Colors.lightGray }}>
                    <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: data.payload.fill || data.color }}
                    />
                    <p className="font-semibold text-sm" style={{ color: Colors.deepBlue }}>{data.payload.name}</p>
                </div>
                <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                        <span style={{ color: Colors.smokyGray }}>Value:</span>
                        <span className="font-semibold" style={{ color: Colors.deepBlue }}>
                            {typeof data.value === 'number' ? data.value.toLocaleString() : data.value}
                        </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                        <span style={{ color: Colors.smokyGray }}>Percentage:</span>
                        <span className="font-semibold" style={{ color: Colors.deepTeal }}>{percent}%</span>
                    </div>
                </div>
            </div>
        );
    }
    return null;
};

// Professional Legend Component with percentage display
const CustomLegend: React.FC<any> = ({ payload }) => {
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    
    if (!payload) return null;
    
    // Calculate total for percentages in legend
    const total = payload.reduce((sum: number, entry: any) => sum + entry.payload.value, 0);
    
    return (
        <div className="flex flex-wrap justify-center gap-3 mt-4">
            {payload.map((entry: any, index: number) => {
                const percentage = ((entry.payload.value / total) * 100).toFixed(1);
                return (
                    <div
                        key={`legend-${index}`}
                        className="flex items-center gap-2 px-2 py-1 rounded-lg transition-all duration-200 cursor-pointer"
                        style={{ 
                            backgroundColor: hoveredItem === entry.value ? Colors.lightGray : 'transparent',
                            transform: hoveredItem === entry.value ? 'scale(1.02)' : 'scale(1)'
                        }}
                        onMouseEnter={() => setHoveredItem(entry.value)}
                        onMouseLeave={() => setHoveredItem(null)}
                    >
                        <div 
                            className="w-3 h-3 rounded-full transition-all duration-200"
                            style={{ 
                                backgroundColor: entry.color,
                                transform: hoveredItem === entry.value ? 'scale(1.3)' : 'scale(1)'
                            }}
                        />
                        <span className="text-xs" style={{ color: Colors.smokyGray }}>{entry.value}</span>
                        <span className="text-xs font-semibold" style={{ color: Colors.deepTeal }}>({percentage}%)</span>
                    </div>
                );
            })}
        </div>
    );
};

const RADIAN = Math.PI / 180;

// Improved label renderer for better visibility
const renderCustomizedLabel = (props: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent, name } = props;
    
    // Calculate position - place label in the middle of the slice
    const radius = innerRadius + (outerRadius - innerRadius) * 0.7;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    const percentage = (percent * 100);
    
    // Only show label if percentage is at least 3% to avoid clutter
    if (percentage < 3) return null;
    
    // Determine text color based on background brightness
    const isDarkSlice = percentage > 50;
    
    return (
        <text 
            x={x} 
            y={y} 
            textAnchor="middle"
            dominantBaseline="central"
            className="font-bold"
            style={{ 
                fill: isDarkSlice ? 'white' : 'white',
                fontSize: '13px',
                fontWeight: 700,
                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                paintOrder: 'stroke',
                stroke: 'rgba(0,0,0,0.3)',
                strokeWidth: '0.5px',
                strokeLinecap: 'round',
                strokeLinejoin: 'round'
            }}
        >
            {`${percentage.toFixed(0)}%`}
        </text>
    );
};

// Label renderer for donut charts (places labels slightly outward)
const renderDonutLabel = (props: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent, name } = props;
    
    // For donut charts, place labels in the middle of the ring
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    const percentage = (percent * 100);
    
    // Only show label if percentage is at least 3%
    if (percentage < 3) return null;
    
    return (
        <text 
            x={x} 
            y={y} 
            textAnchor="middle"
            dominantBaseline="central"
            className="font-bold"
            style={{ 
                fill: 'white',
                fontSize: '12px',
                fontWeight: 700,
                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
            }}
        >
            {`${percentage.toFixed(0)}%`}
        </text>
    );
};

export const PieChart: React.FC<PieChartProps> = ({
    data,
    height = 350,
    innerRadius = 0,
    outerRadius = 120,
    showLegend = true,
    showTooltip = true,
    showLabels = true,
    loading = false,
    className = '',
}) => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    if (loading) {
        return (
            <div className="animate-pulse" style={{ height }}>
                <div className="rounded-full mx-auto" style={{ height: 200, width: 200, backgroundColor: Colors.lightGray }}></div>
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

    // Calculate total for percentage display
    const total = data.reduce((sum, item) => sum + item.value, 0);

    // Prepare data with percentages
    const dataWithPercent = data.map((item, idx) => ({
        ...item,
        percent: item.value / total,
        percentageValue: ((item.value / total) * 100).toFixed(1),
        id: idx,
    }));

    // Choose label renderer based on chart type
    const labelRenderer = innerRadius > 0 ? renderDonutLabel : renderCustomizedLabel;

    // Handle pie click
    const onPieClick = (_: any, index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    // Handle pie hover
    const onPieEnter = (_: any, index: number) => {
        setHoveredIndex(index);
    };

    const onPieLeave = () => {
        setHoveredIndex(null);
    };

    return (
        <ResponsiveContainer width="100%" height={height} className={className}>
            <RePieChart>
                <Pie
                    data={dataWithPercent}
                    cx="50%"
                    cy="50%"
                    innerRadius={innerRadius}
                    outerRadius={outerRadius}
                    paddingAngle={innerRadius > 0 ? 2 : 0}
                    dataKey="value"
                    nameKey="name"
                    labelLine={false}
                    label={showLabels ? labelRenderer : false}
                    onClick={onPieClick}
                    onMouseEnter={onPieEnter}
                    onMouseLeave={onPieLeave}
                    activeIndex={activeIndex !== null ? activeIndex : (hoveredIndex !== null ? hoveredIndex : undefined)}
                >
                    {dataWithPercent.map((entry, index) => {
                        const isActive = activeIndex === index;
                        const isHovered = hoveredIndex === index;
                        
                        return (
                            <Cell 
                                key={`cell-${index}`} 
                                fill={entry.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
                                style={{
                                    cursor: 'pointer',
                                    filter: isActive ? 'brightness(1.15) drop-shadow(0 4px 8px rgba(0,0,0,0.2))' : 
                                            isHovered ? 'brightness(1.08) drop-shadow(0 2px 4px rgba(0,0,0,0.15))' : 'none',
                                    stroke: isActive || isHovered ? Colors.white : 'none',
                                    strokeWidth: isActive || isHovered ? 2.5 : 0,
                                    transition: 'all 0.25s ease-in-out',
                                }}
                            />
                        );
                    })}
                </Pie>
                {showTooltip && <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />}
                {showLegend && <Legend content={<CustomLegend />} />}
            </RePieChart>
        </ResponsiveContainer>
    );
};

// Donut Chart component with proper size and labels enabled by default
export const DonutChart: React.FC<Omit<PieChartProps, 'innerRadius'>> = (props) => (
    <PieChart {...props} innerRadius={70} outerRadius={100} showLabels={props.showLabels !== undefined ? props.showLabels : true} />
);

// Donut Chart with customized center text
export const DonutChartWithCenter: React.FC<PieChartProps & { centerText?: string; centerSubtext?: string }> = ({ 
    centerText, 
    centerSubtext, 
    ...props 
}) => {
    // Calculate total if centerText not provided
    const total = props.data.reduce((sum, item) => sum + item.value, 0);
    const defaultCenterText = centerText || total.toLocaleString();
    
    return (
        <div className="relative">
            <DonutChart {...props} showLabels={false} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p className="text-2xl font-bold" style={{ color: Colors.deepBlue }}>{defaultCenterText}</p>
                {centerSubtext && (
                    <p className="text-xs" style={{ color: Colors.smokyGray }}>{centerSubtext}</p>
                )}
            </div>
        </div>
    );
};

// Percentage Donut Chart - specifically for showing a single percentage value
export const PercentageDonutChart: React.FC<{
    percentage: number;
    size?: number;
    label?: string;
    color?: string;
}> = ({ percentage, size = 150, label = 'Completion', color = Colors.deepTeal }) => {
    const data = [
        { name: 'Completed', value: percentage, color: color },
        { name: 'Remaining', value: 100 - percentage, color: Colors.lightGray },
    ];
    
    return (
        <DonutChartWithCenter
            data={data}
            height={size}
            centerText={`${percentage}%`}
            centerSubtext={label}
            showLegend={false}
            showTooltip={true}
        />
    );
};

// Half Donut Chart (for progress/percentage displays)
export const HalfDonutChart: React.FC<PieChartProps> = (props) => {
    const startAngle = -180;
    const endAngle = 0;
    
    return (
        <ResponsiveContainer width="100%" height={props.height || 200}>
            <RePieChart>
                <Pie
                    data={props.data}
                    cx="50%"
                    cy="100%"
                    startAngle={startAngle}
                    endAngle={endAngle}
                    innerRadius={70}
                    outerRadius={100}
                    dataKey="value"
                    nameKey="name"
                    labelLine={false}
                    label={renderDonutLabel}
                >
                    {props.data.map((entry, index) => (
                        <Cell 
                            key={`cell-${index}`} 
                            fill={entry.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
                        />
                    ))}
                </Pie>
                {props.showTooltip && <Tooltip content={<CustomTooltip />} />}
            </RePieChart>
        </ResponsiveContainer>
    );
};

// Small Donut Chart for metrics
export const SmallDonutChart: React.FC<PieChartProps> = (props) => (
    <DonutChart {...props} height={150} showLegend={false} showTooltip={true} />
);

export default {
    PieChart,
    DonutChart,
    DonutChartWithCenter,
    PercentageDonutChart,
    HalfDonutChart,
    SmallDonutChart,
};