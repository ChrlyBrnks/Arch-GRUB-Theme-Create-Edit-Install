/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GrubTheme, BackgroundType, TerminalBorderStyle, OsEntry, IconAsset } from "./types";

export const PRESET_BACKGROUND_IMAGE_URLS = [
  {
    id: "arch_dark",
    name: "Arch Minimalist Dark",
    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "neon_lines",
    name: "Cyberpunk Grid",
    url: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "nord_synth",
    name: "Abstract Waves",
    url: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "terminal",
    name: "Deep Matrix Rain",
    url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "arch_nordic",
    name: "Nordic Frost",
    url: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=1200&q=80"
  }
];

export const OS_ICONS: IconAsset[] = [
  {
    key: "arch",
    name: "Arch Linux",
    svgPath: "M12 2L2 22h20L12 2z M12 6l6.5 13H5.5L12 6z" // We will build beautiful realistic custom SVGs for the preview
  },
  {
    key: "ubuntu",
    name: "Ubuntu",
    svgPath: ""
  },
  {
    key: "windows",
    name: "Windows",
    svgPath: ""
  },
  {
    key: "debian",
    name: "Debian",
    svgPath: ""
  },
  {
    key: "fedora",
    name: "Fedora",
    svgPath: ""
  },
  {
    key: "manjaro",
    name: "Manjaro",
    svgPath: ""
  },
  {
    key: "tux",
    name: "Linux (Tux)",
    svgPath: ""
  },
  {
    key: "unknown",
    name: "Generic OS",
    svgPath: ""
  }
];

export const DEFAULT_PRESET_THEMES: GrubTheme[] = [
  {
    id: "arch-neon-cyber",
    name: "Arch Cyber Neon",
    description: "Estilo cyberpunk con un degradado profundo de azul a morado, bordes de neón rosa y tipografía moderna en Space Grotesk.",
    backgroundType: BackgroundType.GRADIENT,
    backgroundColorStart: "#03001e",
    backgroundColorEnd: "#7303c0",
    backgroundImageUrl: "",
    backgroundImageScale: "stretch",
    fontFamily: "Space Grotesk, sans-serif",
    fontSize: 16,
    textColorNormal: "#00f2fe",
    textColorSelected: "#ffffff",
    textBgColorSelected: "#fe309e",
    itemHeight: 32,
    itemSpacing: 8,
    menuWidth: 60,
    menuHeight: 52,
    menuLeft: 20,
    menuTop: 24,
    showMenuFrame: true,
    borderColorNormal: "#00f2fe",
    borderColorSelected: "#fe309e",
    borderWidth: 2,
    borderRadius: 8,
    iconWidth: 24,
    iconHeight: 24,
    showOsIcons: true,
    showCountdown: true,
    countdownSeconds: 8,
    countdownLeft: 20,
    countdownTop: 80,
    countdownColor: "#00f2fe",
    terminalVisible: true,
    terminalLeft: 20,
    terminalTop: 45,
    terminalWidth: 60,
    terminalHeight: 30,
    terminalBorder: TerminalBorderStyle.RETRO,
    terminalBgColor: "#0a0014",
    terminalTextColor: "#39ff14",
    retroScanlines: true
  },
  {
    id: "nordic-glacier",
    name: "Nordic Glacier",
    description: "Esquema de color ultra limpio inspirado en la paleta de colores Nord. Suave, sutil y minimalista para pantallas de alta resolución.",
    backgroundType: BackgroundType.GRADIENT,
    backgroundColorStart: "#2e3440",
    backgroundColorEnd: "#4c566a",
    backgroundImageUrl: "",
    backgroundImageScale: "stretch",
    fontFamily: "Inter, sans-serif",
    fontSize: 15,
    textColorNormal: "#d8dee9",
    textColorSelected: "#81a1c1",
    textBgColorSelected: "#434c5e",
    itemHeight: 28,
    itemSpacing: 6,
    menuWidth: 50,
    menuHeight: 45,
    menuLeft: 25,
    menuTop: 22,
    showMenuFrame: true,
    borderColorNormal: "#4c566a",
    borderColorSelected: "#88c0d0",
    borderWidth: 1,
    borderRadius: 4,
    iconWidth: 20,
    iconHeight: 20,
    showOsIcons: true,
    showCountdown: true,
    countdownSeconds: 5,
    countdownLeft: 25,
    countdownTop: 75,
    countdownColor: "#8fbcbb",
    terminalVisible: false,
    terminalLeft: 20,
    terminalTop: 50,
    terminalWidth: 60,
    terminalHeight: 30,
    terminalBorder: TerminalBorderStyle.SOLID,
    terminalBgColor: "#2e3440",
    terminalTextColor: "#d8dee9",
    retroScanlines: false
  },
  {
    id: "retro-hacker-crt",
    name: "CRT Phosphor Mono",
    description: "Un tributo de estilo terminal de fósforo verde monocroma de los años 80 con efecto de líneas de escaneo de monitor CRT antiguo.",
    backgroundType: BackgroundType.SOLID,
    backgroundColorStart: "#051105",
    backgroundColorEnd: "#051105",
    backgroundImageUrl: "",
    backgroundImageScale: "stretch",
    fontFamily: "JetBrains Mono, monospace",
    fontSize: 16,
    textColorNormal: "#33ff33",
    textColorSelected: "#000000",
    textBgColorSelected: "#33ff33",
    itemHeight: 30,
    itemSpacing: 4,
    menuWidth: 70,
    menuHeight: 48,
    menuLeft: 15,
    menuTop: 20,
    showMenuFrame: true,
    borderColorNormal: "#11aa11",
    borderColorSelected: "#33ff33",
    borderWidth: 1,
    borderRadius: 0,
    iconWidth: 20,
    iconHeight: 20,
    showOsIcons: false,
    showCountdown: true,
    countdownSeconds: 10,
    countdownLeft: 15,
    countdownTop: 72,
    countdownColor: "#33ff33",
    terminalVisible: true,
    terminalLeft: 15,
    terminalTop: 45,
    terminalWidth: 70,
    terminalHeight: 25,
    terminalBorder: TerminalBorderStyle.RETRO,
    terminalBgColor: "#051105",
    terminalTextColor: "#33ff33",
    retroScanlines: true
  },
  {
    id: "arch-glacial-ice",
    name: "Arch Frosty Ice",
    description: "Tema de fondo fotográfico con un tema frío y minimalista para amantes de Arch.",
    backgroundType: BackgroundType.IMAGE,
    backgroundColorStart: "#000000",
    backgroundColorEnd: "#1a1a1a",
    backgroundImageUrl: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=1200&q=80",
    backgroundImageScale: "stretch",
    fontFamily: "Space Grotesk, sans-serif",
    fontSize: 15,
    textColorNormal: "#e5e9f0",
    textColorSelected: "#81a1c1",
    textBgColorSelected: "rgba(255, 255, 255, 0.15)",
    itemHeight: 28,
    itemSpacing: 6,
    menuWidth: 55,
    menuHeight: 46,
    menuLeft: 22,
    menuTop: 25,
    showMenuFrame: true,
    borderColorNormal: "rgba(255, 255, 255, 0.2)",
    borderColorSelected: "#88c0d0",
    borderWidth: 2,
    borderRadius: 12,
    iconWidth: 22,
    iconHeight: 22,
    showOsIcons: true,
    showCountdown: true,
    countdownSeconds: 6,
    countdownLeft: 22,
    countdownTop: 82,
    countdownColor: "#88c0d0",
    terminalVisible: false,
    terminalLeft: 20,
    terminalTop: 50,
    terminalWidth: 60,
    terminalHeight: 30,
    terminalBorder: TerminalBorderStyle.SOLID,
    terminalBgColor: "#2e3440",
    terminalTextColor: "#d8dee9",
    retroScanlines: false
  },
  {
    id: "minimalist-obsidian",
    name: "Obsidian Minimalist",
    description: "Estilo ultra minimalista y sobrio ideal para pantallas OLED. Fondo de color negro azabache con contrastes blancos nítidos y elegantes.",
    backgroundType: BackgroundType.SOLID,
    backgroundColorStart: "#09090b",
    backgroundColorEnd: "#09090b",
    backgroundImageUrl: "",
    backgroundImageScale: "stretch",
    fontFamily: "Inter, sans-serif",
    fontSize: 14,
    textColorNormal: "#71717a",
    textColorSelected: "#f4f4f5",
    textBgColorSelected: "#27272a",
    itemHeight: 26,
    itemSpacing: 8,
    menuWidth: 46,
    menuHeight: 42,
    menuLeft: 27,
    menuTop: 28,
    showMenuFrame: true,
    borderColorNormal: "#27272a",
    borderColorSelected: "#52525b",
    borderWidth: 1,
    borderRadius: 6,
    iconWidth: 18,
    iconHeight: 18,
    showOsIcons: true,
    showCountdown: true,
    countdownSeconds: 5,
    countdownLeft: 27,
    countdownTop: 78,
    countdownColor: "#a1a1aa",
    terminalVisible: true,
    terminalLeft: 23,
    terminalTop: 54,
    terminalWidth: 54,
    terminalHeight: 20,
    terminalBorder: TerminalBorderStyle.SOLID,
    terminalBgColor: "#09090b",
    terminalTextColor: "#f4f4f5",
    retroScanlines: false
  }
];

export const PRESET_BOOT_ENTRIES: OsEntry[] = [
  {
    id: "entry1",
    label: "Arch Linux (6.13.2-arch1-1)",
    icon: "arch",
    kernel: "/boot/vmlinuz-linux",
    initrd: "/boot/initramfs-linux.img"
  },
  {
    id: "entry2",
    label: "Arch Linux (fallback initramfs)",
    icon: "arch",
    kernel: "/boot/vmlinuz-linux",
    initrd: "/boot/initramfs-linux-fallback.img"
  },
  {
    id: "entry3",
    label: "Windows Boot Manager (OLED SSD)",
    icon: "windows",
    kernel: "/EFI/Microsoft/Boot/bootmgfw.efi",
    initrd: "N/A"
  },
  {
    id: "entry4",
    label: "Ubuntu 24.04.1 LTS (Noble Numbat)",
    icon: "ubuntu",
    kernel: "/boot/vmlinuz-6.8.0-generic",
    initrd: "/boot/initrd.img-6.8.0-generic"
  },
  {
    id: "entry5",
    label: "Debian GNU/Linux 12 (bookworm)",
    icon: "debian",
    kernel: "/boot/vmlinuz-6.1.0-debian",
    initrd: "/boot/initrd.img-6.1.0-debian"
  }
];
