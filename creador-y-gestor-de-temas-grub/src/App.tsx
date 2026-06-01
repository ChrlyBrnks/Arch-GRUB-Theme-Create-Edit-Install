/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Cpu, Terminal, Layout, Layers, Info, Check, Sparkles, HelpCircle } from "lucide-react";
import ThemePreview from "./components/ThemePreview";
import ThemeEditor from "./components/ThemeEditor";
import InstallGuide from "./components/InstallGuide";
import { GrubTheme, OsEntry } from "./types";
import { DEFAULT_PRESET_THEMES, PRESET_BOOT_ENTRIES } from "./presets";

export default function App() {
  const [theme, setTheme] = useState<GrubTheme>(DEFAULT_PRESET_THEMES[0]);
  const [entries, setEntries] = useState<OsEntry[]>(PRESET_BOOT_ENTRIES);
  const [toast, setToast] = useState<string | null>(null);

  // Trigger brief visual toasts when theme templates are changed
  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleLoadThemePreset = (preset: GrubTheme) => {
    setTheme(preset);
    triggerToast(`Plantilla "${preset.name}" cargada correctamente`);
  };

  return (
    <div className="min-h-screen bg-brand-bg text-slate-300 flex flex-col font-sans selection:bg-arch-blue/30 selection:text-white">
      
      {/* Visual Header panel */}
      <header className="h-12 border-b border-slate-850 bg-brand-panel flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-arch-blue/10 flex items-center justify-center rounded border border-arch-blue/20 text-arch-blue">
            <Layout className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-xs font-bold tracking-tight text-white flex items-center gap-2">
              CREADOR Y GESTOR DE TEMAS GRUB
              <span className="text-[9px] font-sans font-bold tracking-wider text-arch-blue border border-arch-blue/20 bg-arch-blue/5 px-2 py-0.5 rounded uppercase">
                v2.1.0-STABLE
              </span>
            </h1>
          </div>
        </div>

        {/* Live System stats ticker badge to feel native */}
        <div className="flex items-center gap-3 text-[11px] select-none">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-brand-sidebar border border-slate-800/90">
            <Cpu className="w-3 h-3 text-arch-blue" />
            <span className="text-slate-400 font-mono">linux 6.13.2-arch</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-brand-sidebar border border-slate-800/90">
            <Terminal className="w-3 h-3 text-emerald-400" />
            <span className="text-slate-400 font-mono">modo_gráfico_ok</span>
          </div>
        </div>
      </header>

      {/* Main Workspace Scroll Area */}
      <main className="flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto flex flex-col gap-6">
        
        {/* Dynamic Warning Toast notification */}
        {toast && (
          <div className="fixed bottom-12 right-5 z-50 bg-arch-blue text-white rounded-md px-4 py-3 shadow-lg flex items-center gap-2 border border-arch-blue-hover animate-fadeIn font-medium text-xs">
            <Check className="w-4 h-4 shrink-0" />
            <span>{toast}</span>
          </div>
        )}

        {/* Dual-column Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Interactive Screen simulated preview (7 columns wide) */}
          <section className="lg:col-span-7 flex flex-col gap-4">
            
            {/* Interactive Simulation Panel */}
            <div className="bg-brand-preview border border-slate-800/90 p-4 rounded-xl flex flex-col gap-3 shadow-2xl">
              <ThemePreview theme={theme} entries={entries} />
            </div>

            {/* Quick Informational Tips Box */}
            <div className="p-4 rounded-xl bg-brand-sidebar border border-slate-800/90 text-xs flex gap-3 text-slate-400">
              <Info className="w-5 h-5 text-arch-blue shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1.5">
                <span className="font-semibold text-zinc-300">💡 Consejos Rápidos para Diseñadores de Arranque:</span>
                <p className="leading-normal">
                  Cualquier color de texto o borde que especifiques se adaptará perfectamente a los estándares de GRUB2. Los valores en porcentaje (<code className="text-arch-blue">%</code>) garantizan que tu tema se verá centrado en cualquier resolución de pantalla (e.g. 1080p, 1440p, 4K UHD).
                </p>
              </div>
            </div>

          </section>

          {/* Right Column: Configurations Sidebar menu (5 columns wide) */}
          <section className="lg:col-span-5 h-full">
            <ThemeEditor 
              theme={theme} 
              onChangeTheme={setTheme} 
              entries={entries}
              onChangeEntries={setEntries}
              onLoadPreset={handleLoadThemePreset}
            />
          </section>

        </div>

        {/* Full-width Installation Guide underneath */}
        <section className="mt-2 text-slate-350">
          <InstallGuide theme={theme} entries={entries} />
        </section>

      </main>

      {/* High Density Bottom Status Bar + Humbler Footer credit info */}
      <footer className="border-t border-slate-850 bg-brand-sidebar flex flex-col sm:flex-row items-center justify-between px-4 py-2 sm:py-0 sm:h-8 text-[11px] font-mono text-slate-500 shrink-0 select-none gap-2">
        <div className="flex flex-wrap gap-4 items-center">
          <span className="text-emerald-500 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            CONEXIÓN ACTIVA: /etc/default/grub
          </span>
          <span className="opacity-80">PERMISOS: RW (ROOT)</span>
        </div>
        <div className="text-center text-[10px] text-slate-600 hidden md:block">
          Creador & Gestor de Temas GRUB — Arch-based Linux Support.
        </div>
        <div className="flex gap-4 items-center">
          <span>DISCO: 24.1 GB LIBRE</span>
          <span className="text-slate-400">UTF-8</span>
          <span className="bg-slate-800 px-2 py-0.5 text-arch-blue font-bold rounded text-[10px]">INS</span>
        </div>
      </footer>
      
    </div>
  );
}
