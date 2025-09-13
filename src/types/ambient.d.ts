declare module 'react-native-sqlite-storage';
declare module 'react-native-fs';
// react-native-svg types are usually present but ensure fallback
declare module 'react-native-svg' {
  import * as React from 'react';
  import { ViewProps } from 'react-native';
  export interface SvgProps extends ViewProps { width?: number|string; height?: number|string; }
  export default class Svg extends React.Component<SvgProps> {}
}
