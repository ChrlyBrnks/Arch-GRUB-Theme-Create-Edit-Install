/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum BackgroundType {
  GRADIENT = "gradient",
  SOLID = "solid",
  IMAGE = "image"
}

export enum TerminalBorderStyle {
  NONE = "none",
  SOLID = "solid",
  DOUBLE = "double",
  RETRO = "retro"
}

export interface GrubTheme {
  id: string;
  name: string;
  description: string;
  // Background configuration
  backgroundType: BackgroundType;
  backgroundColorStart: string;
  backgroundColorEnd: string;
  backgroundImageUrl: string;
  backgroundImageScale: "stretch" | "center" | "tile";
  
  // Font Configuration
  fontFamily: string;
  fontSize: number;
  textColorNormal: string;
  textColorSelected: string;
  textBgColorSelected: string; // pixmap or color
  itemHeight: number;
  itemSpacing: number;
  
  // Menu Container Layout
  menuWidth: number; // percentage (%, e.g., 60)
  menuHeight: number; // percentage (%, e.g., 50)
  menuLeft: number; // percentage (%, e.g., 20)
  menuTop: number; // percentage (%, e.g., 25)
  showMenuFrame: boolean;
  borderColorNormal: string;
  borderColorSelected: string;
  borderWidth: number;
  borderRadius: number;

  // OS Icons Selection
  iconWidth: number;
  iconHeight: number;
  showOsIcons: boolean;
  
  // Boot Countdown Label
  showCountdown: boolean;
  countdownSeconds: number;
  countdownLeft: number; // percentage
  countdownTop: number; // percentage
  countdownColor: string;
  
  // Terminal Emulator Frame
  terminalVisible: boolean;
  terminalLeft: number;
  terminalTop: number;
  terminalWidth: number;
  terminalHeight: number;
  terminalBorder: TerminalBorderStyle;
  terminalBgColor: string;
  terminalTextColor: string;
  
  // Advanced features
  retroScanlines: boolean;
  isCustom?: boolean;
}

export interface OsEntry {
  id: string;
  label: string;
  icon: string; // key matching internal icon lists
  kernel: string;
  initrd: string;
  isCustom?: boolean;
}

export interface IconAsset {
  key: string;
  name: string;
  svgPath: string;
}
