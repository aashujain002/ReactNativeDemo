declare module 'react-native-gifted-charts' {
  import * as React from 'react';
  import { ViewStyle, TextStyle } from 'react-native';
  interface PieDataItem { value: number; color: string; text?: string; label?: string; shiftX?: number; shiftY?: number; onPress?: () => void; }
  interface PieChartProps {
    data: PieDataItem[];
    donut?: boolean;
    radius?: number;
    innerRadius?: number;
    showText?: boolean;
    innerCircleColor?: string;
    textColor?: string;
    textSize?: number;
    focusOnPress?: boolean;
    sectionAutoFocus?: boolean;
    centerLabelComponent?: () => React.ReactNode;
    style?: ViewStyle;
  }
  export class PieChart extends React.Component<PieChartProps> {}
}
