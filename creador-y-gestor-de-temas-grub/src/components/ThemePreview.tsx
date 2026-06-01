/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Pause, RotateCcw, Monitor, Terminal, Cpu, Info, Check, ArrowRight } from "lucide-react";
import { GrubTheme, OsEntry, BackgroundType, TerminalBorderStyle } from "../types";

// Vector icons helper to display pretty SVG icons inside the preview
export function OSLogo({ type, color }: { type: string; color: string }) {
  switch (type) {
    case "arch":
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 transition-colors duration-150" fill="currentColor" style={{ color: color || "currentColor" }}>
          <path d="M12 2.2C11.5 3.3 9.4 8 7 12.8c-2.3 4.7-4.5 9-4.8 9.5-.4.6-.2.7.7.3.9-.4 2.3-.9 3.1-1.2.8-.2.7-.1-.2.4-.9.5-1.9 1.1-2.2 1.3-.4.2-.3.3.3.2 1.2-.2 3.1-.7 4.1-1 .9-.2 1.1-.3 1-.3-.6-.1-1.3-.3-1.6-.4-.3-.1-.5-.2-.5-.3s.1-.1.3-.1c.3.1.9.2 1.4.3 1.2.2 1.2.2.8-.4-.4-.5-.9-1.2-1.3-1.6-.3-.3-.4-.4-.2-.1.2.3.9 1.2 1.5 2 .7.8 1.1 1.2 1.1 1.1s-.4-.4-.8-.7c-.4-.4-.8-.8-.8-1s.1-.1.3-.1c.3 0 1 .5 1.5.9.8.7.9.7.7-.2-.1-.5-.3-1.3-.4-1.7-.1-.4-.1-.5.1-.3.2.1.6 1 1 1.9.4.9.7 1.5.8 1.4.1-.1-.1-.7-.4-1.2c-.3-.5-.6-1.1-.6-1.2s.2.1.5.4c.4.3.9 1 1.2 1.6.4.7.5.8.5.3-.1-.6-.2-1.5-.3-2.1l-.1-1.1c.3-.1.6 0 .8.2s.4.4.4.5c.1.2-.1-1.2-.2-1.6-.2-.6-.3-1.1-.3-1.2s.5.6 1.1 1.3c.6.7 1 1.3 1 1.4s-.3-.5-.8-1.2c-.4-.7-.8-1.3-.8-1.4 0 0 .5.3 1 .6.5.3.9.5 1 .4s-.2-.7-.5-1.3c-.3-.6-.6-1.1-.6-1.2s.6.5 1.3 1.2c.7.7 1.2 1.2 1.3 1.1.1 0-.3-.8-.9-1.8C15 9 12.5 3.3 12 2.2z" />
        </svg>
      );
    case "windows":
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 transition-colors duration-150" fill="currentColor" style={{ color: color || "currentColor" }}>
          <path d="M3 5.543l7.854-1.07v7.243H3V5.543zm8.854-1.2l9.146-1.314V11.72h-9.146V4.343zM3 12.7h7.854v7.359l-7.854-1.09V12.7zm8.854 0h9.146v8.423l-9.146-1.3V12.7z" />
        </svg>
      );
    case "ubuntu":
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 transition-colors duration-150" fill="currentColor" style={{ color: color || "currentColor" }}>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2.5-9.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zm5 0c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zm-2.5 5c1.38 0 2.5-1.12 2.5-2.5s-1.12-2.5-2.5-2.5-2.5 1.12-2.5 2.5 1.12 2.5 2.5 2.5z" />
        </svg>
      );
    case "debian":
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 transition-colors duration-150" fill="currentColor" style={{ color: color || "currentColor" }}>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm-.5-4.5c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm0-3c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
        </svg>
      );
    case "gentoo":
    case "fedora":
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 transition-colors duration-150" fill="currentColor" style={{ color: color || "currentColor" }}>
          <path d="M12 2c5.522 0 10 4.477 10 10s-4.478 10-10 10S2 17.523 2 12 6.478 2 12 2zm3.325 5.564c-.958-.088-2.607.355-3.321 1.258-1-.741-2.518-.621-3.321.258C7.5 10.3 8 12.3 9 13.5c1.1.9 2.5 1 3.5.5.8.6 2.1.8 3 .5s1.5-1.4 1.5-2.5c0-1.879-1-3.69-2.675-4.436z" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 transition-colors duration-150" fill="currentColor" style={{ color: color || "currentColor" }}>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
        </svg>
      );
  }
}

interface Props {
  theme: GrubTheme;
  entries: OsEntry[];
}

export default function ThemePreview({ theme, entries }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [countdown, setCountdown] = useState(theme.countdownSeconds);
  const [isPlaying, setIsPlaying] = useState(false);
  const [booting, setBooting] = useState(false);
  const [bootLogs, setBootLogs] = useState<string[]>([]);
  const screenRef = useRef<HTMLDivElement>(null);

  // Reset selection index when entries change
  useEffect(() => {
    if (selectedIndex >= entries.length) {
      setSelectedIndex(0);
    }
  }, [entries]);

  // Handle countdown logic
  useEffect(() => {
    setCountdown(theme.countdownSeconds);
  }, [theme.countdownSeconds]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying && countdown > 0 && !booting) {
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            handleBoot();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, countdown, booting]);

  // Pre-boot logs simulation
  const handleBoot = () => {
    setBooting(true);
    setIsPlaying(false);
    setBootLogs(["[    0.000000] Linux version 6.13.2-arch1-1 (linux@archlinux) (gcc version 14.2.1) #1 SMP PREEMPT_DYNAMIC", "[    0.000000] Command line: BOOT_IMAGE=/boot/vmlinuz-linux root=UUID=8f7e2a9b-3c4d-5e6f-7a8b-9c0d1e2f3a4b rw quiet splash", "[    0.000000] x86/fpu: Supporting XSAVE feature 0x01: 'x87 floating point registers'", "[    0.000000] x86/fpu: Supporting XSAVE feature 0x02: 'SSE registers'", "[    0.000000] BIOS-provided physical RAM map:", "[    0.000000] BIOS-e820: [mem 0x0000000000000000-0x000000000009ffff] usable", "[    0.012356] ACPI: Core revision 20240101", "[    0.045098] Secure Boot Enabled in hardware firmware.", "[    0.158734] pci 0000:00:00.0: [8086:9b44] superfine bridge controller", "[    0.341255] SCSI subsystem initialized", "[    0.548911] libata version 3.00 loaded.", "[    0.781299] i8042: AUX port is not detected.", "[    1.025341] EXT4-fs (sda2): mounted system root file system with ordered data mode.", "[    1.258900] systemd[1]: Inserted systemd module path.", "[    1.502123] systemd[1]: Started Journal Service.", "[    1.810245] systemd[1]: Created slice system-getty.slice.", "[    2.103988] ARCH LINUX: Welcome to Arch Linux (6.13.2) - Boot Successful!"]);
  };

  const handleReset = () => {
    setBooting(false);
    setCountdown(theme.countdownSeconds);
    setIsPlaying(false);
    setBootLogs([]);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (booting) return;
    if (e.key === "ArrowUp") {
      setSelectedIndex((prev) => (prev === 0 ? entries.length - 1 : prev - 1));
      e.preventDefault();
    } else if (e.key === "ArrowDown") {
      setSelectedIndex((prev) => (prev === entries.length - 1 ? 0 : prev + 1));
      e.preventDefault();
    } else if (e.key === "Enter") {
      handleBoot();
      e.preventDefault();
    }
  };

  // Build screen background inline style
  const getBackgroundStyle = (): React.CSSProperties => {
    if (theme.backgroundType === BackgroundType.SOLID) {
      return { backgroundColor: theme.backgroundColorStart };
    } else if (theme.backgroundType === BackgroundType.GRADIENT) {
      return {
        backgroundImage: `linear-gradient(135deg, ${theme.backgroundColorStart}, ${theme.backgroundColorEnd})`
      };
    } else if (theme.backgroundType === BackgroundType.IMAGE && theme.backgroundImageUrl) {
      return {
        backgroundImage: `url(${theme.backgroundImageUrl})`,
        backgroundSize: theme.backgroundImageScale === "stretch" ? "cover" : theme.backgroundImageScale === "center" ? "auto" : "repeat",
        backgroundPosition: "center"
      };
    }
    return { backgroundColor: "#0c0f12" }; // Default dark slate
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Simulation Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-brand-panel p-3 rounded-xl border border-slate-850">
        <div className="flex items-center gap-2">
          <Monitor className="w-5 h-5 text-arch-blue" />
          <span className="font-semibold text-zinc-300 text-sm">Simulador de Pantalla</span>
          <span className="text-xs bg-slate-800 text-slate-400 py-0.5 px-2 rounded font-mono">
            1920x1080 (16:9)
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={booting}
            className={`flex items-center gap-1.5 text-xs py-1.5 px-3 rounded-lg font-medium transition-all ${
              isPlaying 
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30" 
                : "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/30"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            title={isPlaying ? "Pausar cuenta atrás" : "Iniciar cuenta atrás"}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isPlaying ? "Pausar" : "Iniciar Cuenta Atrás"}
          </button>

          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-xs py-1.5 px-3 rounded-lg font-medium bg-slate-800 hover:bg-slate-700 text-zinc-300 border border-slate-700/80 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reiniciar
          </button>
          
          <button
            onClick={handleBoot}
            disabled={booting}
            className="flex items-center gap-1 text-xs py-1.5 px-3 rounded-lg font-medium bg-arch-blue hover:bg-arch-blue-hover text-white transition disabled:opacity-50 font-semibold"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            Iniciar OS
          </button>
        </div>
      </div>

      {/* Main Screen Container */}
      <div 
        id="grub-simulator-screen"
        onClick={() => screenRef.current?.focus()}
        tabIndex={0}
        ref={screenRef}
        onKeyDown={handleKeyDown}
        className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl relative border-4 border-slate-800 group focus:outline-none focus:ring-2 focus:ring-arch-blue cursor-pointer text-white"
        style={{ fontFamily: theme.fontFamily }}
      >
        <AnimatePresence mode="wait">
          {!booting ? (
            <motion.div 
              key="grub-display"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full relative overflow-hidden" 
              style={getBackgroundStyle()}
            >
              {/* Optional Scanlines */}
              {theme.retroScanlines && (
                <div className="absolute inset-0 pointer-events-none bg-scanlines opacity-[0.12] z-50 mix-blend-overlay" />
              )}

              {/* Title Header */}
              <div className="absolute top-6 left-6 flex items-center gap-2 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono text-zinc-300">GNU GRUB version 2.12</span>
              </div>

              {/* Instructions Banner */}
              <div className="absolute top-6 right-6 text-[11px] font-mono opacity-80 bg-black/40 backdrop-blur-sm p-2 rounded border border-white/10 text-right cursor-default select-none pointer-events-none">
                <div className="text-emerald-400">Teclas de Navegación</div>
                <div>↑/↓ : Seleccionar Línea</div>
                <div>ENTER : Arrancar Sistema</div>
              </div>

              {/* Boot Menu Container */}
              <div 
                className="absolute flex flex-col justify-between"
                style={{
                  left: `${theme.menuLeft}%`,
                  top: `${theme.menuTop}%`,
                  width: `${theme.menuWidth}%`,
                  height: `${theme.menuHeight}%`,
                  padding: "16px",
                  borderRadius: `${theme.borderRadius}px`,
                  backgroundColor: theme.showMenuFrame ? "rgba(0, 0, 0, 0.45)" : "transparent",
                  backdropFilter: theme.showMenuFrame ? "blur(4px)" : "none",
                  border: theme.showMenuFrame ? `${theme.borderWidth}px solid ${theme.borderColorNormal}` : "none",
                  boxShadow: theme.showMenuFrame ? "0 10px 25px -5px rgba(0,0,0,0.5)" : "none"
                }}
              >
                {/* List of Menu Entries */}
                <div className="flex flex-col overflow-y-auto no-scrollbar gap-1">
                  {entries.map((entry, index) => {
                    const isSelected = index === selectedIndex;
                    return (
                      <div
                        key={entry.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedIndex(index);
                        }}
                        className="flex items-center gap-3 px-3 py-1 cursor-pointer transition-all duration-150 rounded"
                        style={{
                          height: `${theme.itemHeight}px`,
                          marginBottom: `${theme.itemSpacing}px`,
                          backgroundColor: isSelected ? theme.textBgColorSelected : "transparent",
                          borderRadius: "4px",
                          border: isSelected && theme.showMenuFrame 
                            ? `1px solid ${theme.borderColorSelected}` 
                            : "1px solid transparent"
                        }}
                      >
                        {/* OS Icon Indicator */}
                        {theme.showOsIcons && (
                          <div 
                            className="flex items-center justify-center rounded shrink-0"
                            style={{ 
                              width: `${theme.iconWidth}px`, 
                              height: `${theme.iconHeight}px`,
                              color: isSelected ? theme.textColorSelected : theme.textColorNormal
                            }}
                          >
                            <OSLogo 
                              type={entry.icon} 
                              color={isSelected ? theme.textColorSelected : theme.textColorNormal} 
                            />
                          </div>
                        )}

                        {/* Text Label */}
                        <span
                          className="font-medium truncate"
                          style={{
                            fontSize: `${theme.fontSize}px`,
                            color: isSelected ? theme.textColorSelected : theme.textColorNormal,
                          }}
                        >
                          {entry.label}
                        </span>

                        {/* Animated selection cursor */}
                        {isSelected && (
                          <motion.div 
                            layoutId="active-indicator"
                            className="ml-auto w-1.5 h-1.5 rounded-full bg-white block"
                            style={{ backgroundColor: theme.textColorSelected }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Simulated Quick Help Panel at bottom of Menu Box */}
                <div className="pt-2 border-t border-white/10 flex justify-between items-center text-[10px] opacity-70 font-mono tracking-wide">
                  <span>Espacio: Editar Entrada</span>
                  <span>c: Línea de Comandos GRUB</span>
                </div>
              </div>

              {/* Terminal Frame Overlay (if toggled) */}
              {theme.terminalVisible && (
                <div 
                  className="absolute p-4 border overflow-hidden font-mono text-left hidden sm:flex flex-col shadow-xl"
                  style={{
                    left: `${theme.terminalLeft}%`,
                    top: `${theme.terminalTop}%`,
                    width: `${theme.terminalWidth}%`,
                    height: `${theme.terminalHeight}%`,
                    backgroundColor: theme.terminalBgColor || "rgba(0, 0, 0, 0.8)",
                    color: theme.terminalTextColor || "#33ff33",
                    borderRadius: theme.terminalBorder === TerminalBorderStyle.RETRO ? "0px" : "6px",
                    border: theme.terminalBorder !== TerminalBorderStyle.NONE 
                      ? `${theme.terminalBorder === TerminalBorderStyle.DOUBLE ? "3px double" : "1px solid"} ${theme.borderColorNormal}` 
                      : "none"
                  }}
                >
                  <div className="flex items-center gap-1.5 pb-2 mb-2 border-b border-white/10 text-xs text-zinc-400 select-none">
                    <Terminal className="w-3 h-3 text-emerald-400" />
                    <span>Línea de Comandos Terminal Interactiva (F8 / c)</span>
                  </div>
                  <div className="text-[11px] leading-relaxed flex-1 select-all cursor-text overflow-y-auto font-mono scrollbar-thin">
                    <p className="opacity-90">{">"} load_env</p>
                    <p className="opacity-90">{">"} set prefix=(hd0,gpt2)/boot/grub</p>
                    <p className="opacity-90">{">"} set theme=$prefix/themes/custom/theme.txt</p>
                    <p className="opacity-90">{">"} insmod all_video</p>
                    <p className="opacity-90">{">"} insmod png</p>
                    <p className="opacity-90">{">"} echo GRUB_THEME cargado con éxito. Ejecutando boot loader...</p>
                    <p className="animate-pulse">{">"} _</p>
                  </div>
                </div>
              )}

              {/* Boot countdown message */}
              {theme.showCountdown && (
                <div
                  className="absolute backdrop-blur-xs bg-black/25 px-4 py-2 rounded-xl text-center font-mono select-none"
                  style={{
                    left: `${theme.countdownLeft}%`,
                    top: `${theme.countdownTop}%`,
                    color: theme.countdownColor,
                    fontSize: "13px",
                    transform: "translateX(-50%)",
                    border: "1px solid rgba(255,255,255,0.08)"
                  }}
                >
                  <span className="opacity-75">El sistema seleccionado arrancará en </span>
                  <span className="font-bold underline text-base px-1">{countdown}</span>
                  <span className="opacity-75"> segundos...</span>
                </div>
              )}
              
              {/* Target info popup explaining hotkey binding */}
              <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded text-[11px] font-mono opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <Info className="w-3.5 h-3.5 text-arch-blue shrink-0" />
                <span>Haz clic dentro de la pantalla para usar las flechas del teclado <b>↑/↓</b>.</span>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="boot-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full bg-zinc-950 font-mono text-emerald-500 text-[11px] leading-tight p-6 text-left overflow-y-auto flex flex-col gap-1 cursor-default scrollbar-thin selection:bg-emerald-500/20"
            >
              {bootLogs.map((log, index) => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ delay: index * 0.08 }}
                  key={index}
                >
                  {log}
                </motion.div>
              ))}
              
              {/* Succesful greeting */}
              {bootLogs.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 2.2 }}
                  className="mt-8 self-center bg-zinc-900 border border-emerald-500/30 p-8 rounded-xl max-w-md w-full text-center flex flex-col items-center gap-3 text-zinc-300"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Check className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-lg text-white">¡Sistema Arrancado!</h3>
                  <p className="text-xs text-zinc-400">
                    Has arrancado correctamente <b className="text-emerald-400">{entries[selectedIndex]?.label}</b>. Esta es la simulación de carga del sistema operativo GNU/Linux.
                  </p>
                  <button
                    onClick={handleReset}
                    className="mt-2 text-xs font-semibold text-arch-blue hover:text-arch-blue-hover flex items-center gap-1 bg-arch-blue/5 py-2 px-4 rounded border border-arch-blue/15 hover:bg-arch-blue/15 transition-all"
                  >
                    Volver al Menú GRUB
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
