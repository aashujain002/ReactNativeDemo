import React, { useMemo, useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, LayoutChangeEvent } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { CategoryTotal } from '../db/expenseDb';

interface Props { data: CategoryTotal[]; minSlicePercent?: number; maxLegendColumns?: number; styleVariant?: 'default' | 'performance'; }

function colorForCategory(cat: string) {
    let hash = 0; for (let i = 0; i < cat.length; i++) hash = cat.charCodeAt(i) + ((hash << 5) - hash); const hue = Math.abs(hash) % 360; return `hsl(${hue},60%,45%)`;
}

export const ExpensePieChart: React.FC<Props> = ({ data, minSlicePercent = 4, maxLegendColumns = 2, styleVariant = 'default' }) => {
    const [active, setActive] = useState<number | null>(null);
    const [labelMode, setLabelMode] = useState<'percent' | 'value'>('percent');
    const total = data.reduce((s, d) => s + d.total, 0);

    const anim = useRef(new Animated.Value(0)).current;
    const [animProgress, setAnimProgress] = useState(0);
    useEffect(() => {
        const id = anim.addListener(({ value }) => setAnimProgress(value));
        Animated.timing(anim, { toValue: 1, duration: 900, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
        return () => { anim.removeListener(id); };
    }, [anim]);

    const [chartLayout, setChartLayout] = useState({ width: 0, height: 0 });
    const onChartLayout = (e: LayoutChangeEvent) => setChartLayout(e.nativeEvent.layout);
    const [tooltipSize, setTooltipSize] = useState({ width: 0, height: 0 });

    const processed = useMemo(() => {
        if (!total) return [] as CategoryTotal[];
        const thresholdValue = (minSlicePercent / 100) * total;
        const big: CategoryTotal[] = []; const small: CategoryTotal[] = [];
        data.forEach(d => (d.total >= thresholdValue ? big : small).push(d));
        if (small.length) {
            const otherTotal = small.reduce((s, d) => s + d.total, 0);
            big.push({ category: 'other', total: otherTotal });
        }
        return big.sort((a, b) => b.total - a.total);
    }, [data, total, minSlicePercent]);

    const performancePalette = ['#2F54EB', '#40E0D0', '#B39DFF', '#FF8DA1', '#FFA940', '#13C2C2'];

    const sliceGeometry = useMemo(() => {
        let acc = 0;
        return processed.map(d => {
            const start = acc; acc += d.total; const mid = (start + acc) / 2;
            const angle = total ? (mid / total) * Math.PI * 2 : 0;
            return { angle };
        });
    }, [processed, total]);

    const chartData = useMemo(() => processed.map((d, i) => {
        const colorBase = styleVariant === 'performance' ? performancePalette[i % performancePalette.length] : colorForCategory(d.category === 'other' ? 'other-synth' : d.category);
        const color = i === active ? brighten(colorBase, 10) : colorBase;
        const pctRaw = total ? (d.total / total) * 100 : 0;
        const pct = Math.round(pctRaw);
        const valueLabel = `$${d.total.toFixed(0)}`;
        const displayText = styleVariant === 'performance' ? '' : (labelMode === 'percent' ? (pct >= minSlicePercent ? `${pct}%` : '') : (pct >= minSlicePercent ? valueLabel : ''));
        const progress = animProgress;
        return {
            value: d.total * progress,
            color,
            label: d.category,
            text: displayText,
            shiftX: active === i ? 8 : 0,
            shiftY: active === i ? 8 : 0,
            onPress: () => setActive(active === i ? null : i)
        };
    }), [processed, total, active, labelMode, minSlicePercent, styleVariant, animProgress]);

    const activeSlice = active != null ? processed[active] : null;

    const legendItems = chartData.map((c, i) => ({
        name: processed[i].category,
        value: processed[i].total,
        color: c.color,
        pct: total ? Math.round((processed[i].total / total) * 100) : 0,
        press: () => chartData[i].onPress?.()
    }));

    type LegendItem = { name: string; value: number; color: string; pct: number; press: () => void };
    const columns = Math.min(maxLegendColumns, legendItems.length);
    const rows: LegendItem[][] = [];
    for (let r = 0; r < Math.ceil(legendItems.length / columns); r++) {
        rows.push(legendItems.slice(r * columns, r * columns + columns) as LegendItem[]);
    }

    let tooltipStyle: any = null;
    if (active != null && chartLayout.width && chartLayout.height && sliceGeometry[active]) {
        const radius = styleVariant === 'performance' ? 100 : 110;
        const centerX = chartLayout.width / 2;
        const centerY = chartLayout.height / 2;
        const dist = radius * 0.65;
        const angle = sliceGeometry[active].angle;
        const rawX = centerX + Math.cos(angle) * dist;
        const rawY = centerY + Math.sin(angle) * dist;
        const w = tooltipSize.width || 120;
        const h = tooltipSize.height || 44;
        const left = clamp(rawX - w / 2, 4, chartLayout.width - w - 4);
        const top = clamp(rawY - h / 2, 4, chartLayout.height - h - 4);
        tooltipStyle = { position: 'absolute', left, top };
    }

    return (
        <View style={styles.wrapper}>
            <View onLayout={onChartLayout} style={{ justifyContent: 'center', alignItems: 'center' }}>
                <PieChart
                    data={chartData}
                    donut
                    radius={styleVariant === 'performance' ? 100 : 110}
                    innerRadius={styleVariant === 'performance' ? 60 : 62}
                    showText={styleVariant !== 'performance'}
                    innerCircleColor="#121821"
                    textColor="#fff"
                    textSize={16}
                    focusOnPress
                    sectionAutoFocus
                    centerLabelComponent={() => (
                        <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => styleVariant === 'performance' ? setActive(null) : setLabelMode(m => m === 'percent' ? 'value' : 'percent')}>
                            {styleVariant === 'performance' ? (
                                <>
                                    <Text style={[styles.centerTitle, { fontSize: 28, fontWeight: '700' }]}>{Math.round((processed[0]?.total || 0) / total * 100)}%</Text>
                                    <Text style={[styles.centerValue, { fontSize: 14, fontWeight: '600' }]}>{capitalize(processed[0]?.category || '')}</Text>
                                </>
                            ) : (
                                <>
                                    <Text style={styles.centerTitle}>Total</Text>
                                    <Text style={styles.centerValue}>{`$${formatNumber(total)}`}</Text>
                                    <Text style={styles.centerHint}>{labelMode === 'percent' ? 'tap: values' : 'tap: %'}</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    )}
                />
                {activeSlice && tooltipStyle && (
                    <View
                        style={[styles.tooltip, tooltipStyle]}
                        onLayout={e => setTooltipSize(e.nativeEvent.layout)}
                    >
                        <Text style={styles.tooltipTitle}>{capitalize(activeSlice.category)}</Text>
                        <Text style={styles.tooltipValue}>{`$${formatNumber(activeSlice.total)} • ${Math.round((activeSlice.total / total) * 100)}%`}</Text>
                    </View>
                )}
            </View>
            <View style={[styles.legend, styleVariant === 'performance' && { marginTop: 20 }]}>
                {rows.map((row, ri) => (
                    <View key={ri} style={styles.legendRowWrap}>
                        {row.map((item, ci) => (
                            <TouchableOpacity key={item.name + ci} style={styles.legendItem} onPress={item.press}>
                                <View style={[styles.swatch, { backgroundColor: item.color, opacity: activeSlice?.category === item.name ? 1 : 0.7 }]} />
                                <Text style={styles.legendText} numberOfLines={1}>{truncate(capitalize(item.name), 12)}{styleVariant === 'performance' ? `: ${item.pct}%` : ` • $${formatNumber(item.value)} (${item.pct}%)`}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: { alignItems: 'center', position: 'relative' },
    centerTitle: { color: '#fff', fontSize: 14, fontWeight: '600' },
    centerValue: { color: '#9aa4b1', fontSize: 13, marginTop: 2 },
    centerHint: { color: '#566170', fontSize: 10, marginTop: 2 },
    legend: { width: '100%', marginTop: 14 },
    legendRowWrap: { flexDirection: 'row', marginBottom: 6 },
    legendItem: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingRight: 8, minWidth: 0 },
    swatch: { width: 14, height: 14, borderRadius: 4, marginRight: 6 },
    legendText: { color: '#fff', fontSize: 11, flex: 1 },
    tooltip: { backgroundColor: '#1f2732', borderRadius: 8, paddingVertical: 6, paddingHorizontal: 10, borderWidth: 1, borderColor: '#2e3945', maxWidth: 160 },
    tooltipTitle: { color: '#fff', fontSize: 12, fontWeight: '600' },
    tooltipValue: { color: '#9aa4b1', fontSize: 11, marginTop: 2 }
});

function truncate(str: string, len: number) { return str.length > len ? str.slice(0, len - 1) + '…' : str; }
function formatNumber(n: number) {
    if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 0 : 1) + 'k';
    return n.toFixed(2);
}
function brighten(hsl: string, inc: number) {
    const m = /hsl\((\d+),\s*(\d+)%?,\s*(\d+)%?\)/.exec(hsl);
    if (!m) return hsl; const h = +m[1], s = +m[2], l = +m[3];
    return `hsl(${h},${s}%,${Math.min(90, l + inc)}%)`;
}
function capitalize(str: string) { return str ? str.charAt(0).toUpperCase() + str.slice(1) : str; }
function clamp(v: number, min: number, max: number) { return Math.min(max, Math.max(min, v)); }

export default ExpensePieChart;
