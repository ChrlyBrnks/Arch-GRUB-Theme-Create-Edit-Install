/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  GrubTheme, 
  OsEntry, 
  BackgroundType, 
  TerminalBorderStyle 
} from "../types";
import { 
  DEFAULT_PRESET_THEMES, 
  PRESET_BACKGROUND_IMAGE_URLS, 
  OS_ICONS 
} from "../presets";
import { 
  Sparkles, 
  Settings2, 
  Type as FontIcon, 
  Tv, 
  FolderSync, 
  Plus, 
  Trash2, 
  Layers, 
  Image as ImageIcon, 
  Eye, 
  Sliders, 
  RefreshCw,
  Paintbrush,
  Terminal
} from "lucide-react";

interface Props {
  theme: GrubTheme;
  onChangeTheme: (theme: GrubTheme) => void;
  entries: OsEntry[];
  onChangeEntries: (entries: OsEntry[]) => void;
  onLoadPreset: (preset: GrubTheme) => void;
}

export default function ThemeEditor({ 
  theme, 
  onChangeTheme, 
  entries, 
  onChangeEntries,
  onLoadPreset
}: Props) {
  const [activeTab, setActiveTab] = useState<"layout" | "fonts" | "terminal" | "entries" | "ai">("layout");
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiStatus, setAiStatus] = useState("");
  const [apiError, setApiError] = useState("");

  const handleFieldChange = (key: keyof GrubTheme, value: any) => {
    onChangeTheme({
      ...theme,
      [key]: value
    });
  };

  // Add a new mock OS entry
  const handleAddEntry = () => {
    const newEntry: OsEntry = {
      id: `entry-${Date.now()}`,
      label: "Nuevo Sistema OS (" + (entries.length + 1) + ")",
      icon: "unknown",
      kernel: "/boot/vmlinuz-custom",
      initrd: "/boot/initrd.img-custom",
      isCustom: true
    };
    onChangeEntries([...entries, newEntry]);
  };

  // Update OS entry field
  const handleUpdateEntry = (index: number, key: keyof OsEntry, value: any) => {
    const updated = [...entries];
    updated[index] = { ...updated[index], [key]: value };
    onChangeEntries(updated);
  };

  // Delete OS entry
  const handleDeleteEntry = (index: number) => {
    if (entries.length <= 1) return; // Prevent deleting everything
    const updated = entries.filter((_, i) => i !== index);
    onChangeEntries(updated);
  };

  // Call Gemini backend to generate custom theme
  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    setApiError("");
    setAiStatus("Iniciando Asistente de Diseño Inteligente...");
    
    // Stagger statuses for retro cool effect
    const scheduleStatus = (msg: string, delay: number) => {
      setTimeout(() => setAiStatus(msg), delay);
    };

    scheduleStatus("Consultando los núcleos estéticos en Gemini 3.5-Flash...", 600);
    scheduleStatus("Calculando combinaciones de colores óptimas de contraste...", 1300);
    scheduleStatus("Extrayendo dimensiones y márgenes sugeridos...", 2200);

    try {
      const res = await fetch("/api/generate-theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Algo salió mal consultando la API");
      }

      if (data.success && data.theme) {
        setAiStatus("¡Tema diseñado con éxito! Aplicando al simulador...");
        setTimeout(() => {
          onChangeTheme({
            ...theme,
            ...data.theme,
            id: `ai-${Date.now()}`
          });
          setIsGenerating(false);
          setAiPrompt("");
        }, 600);
      } else {
        throw new Error("Formato de respuesta desconocido");
      }
    } catch (err: any) {
      console.error(err);
      setApiError(err.message || "No se pudo contactar con el backend");
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full bg-brand-sidebar border border-slate-850 rounded-xl overflow-hidden flex flex-col h-full">
      
      {/* Quick Presets Carousel Banner */}
      <div className="p-4 bg-brand-panel border-b border-slate-850">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
          <Paintbrush className="w-3.5 h-3.5 text-arch-blue" />
          Selecciona un Estilo Base (Plantillas Gratuitas)
        </label>
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 gap-2">
          {DEFAULT_PRESET_THEMES.map((preset) => {
            const isSelected = theme.id === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => onLoadPreset(preset)}
                className={`group flex flex-col items-center justify-between p-2 rounded-lg text-left transition h-16 border ${
                  isSelected 
                    ? "bg-arch-blue/10 border-arch-blue ring-1 ring-arch-blue/30" 
                    : "bg-[#10141b] border-slate-800/80 hover:bg-slate-850/50 hover:border-slate-700"
                }`}
              >
                <span className="text-[11px] font-medium text-zinc-200 line-clamp-1 w-full group-hover:text-white">
                  {preset.name}
                </span>
                
                {/* Visual palette row bubble indicator */}
                <div className="flex gap-1 items-center mt-1 w-full">
                  <div 
                    className="w-3 h-3 rounded-full border border-white/10 shrink-0" 
                    style={{ backgroundColor: preset.backgroundColorStart }} 
                    title="Fondo"
                  />
                  <div 
                    className="w-3 h-3 rounded-full border border-white/10 shrink-0" 
                    style={{ backgroundColor: preset.textColorNormal }} 
                    title="Texto normal"
                  />
                  <div 
                    className="w-3 h-3 rounded-full border border-white/10 shrink-0" 
                    style={{ backgroundColor: preset.textBgColorSelected }} 
                    title="Selección Box"
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Configuration Navigation Tab-bar */}
      <div className="p-1.5 bg-brand-panel border-b border-slate-850 flex overflow-x-auto gap-1 scrollbar-none shrink-0">
        <button
          onClick={() => setActiveTab("layout")}
          className={`flex items-center gap-1.5 text-xs py-2 px-3 rounded-lg font-medium whitespace-nowrap transition ${
            activeTab === "layout" ? "bg-slate-800 text-white" : "text-zinc-400 hover:bg-slate-850/40 hover:text-zinc-200"
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          Fondo y Distribución
        </button>

        <button
          onClick={() => setActiveTab("fonts")}
          className={`flex items-center gap-1.5 text-xs py-2 px-3 rounded-lg font-medium whitespace-nowrap transition ${
            activeTab === "fonts" ? "bg-slate-800 text-white" : "text-zinc-400 hover:bg-slate-850/40 hover:text-zinc-200"
          }`}
        >
          <FontIcon className="w-3.5 h-3.5" />
          Fuentes y Colores
        </button>

        <button
          onClick={() => setActiveTab("terminal")}
          className={`flex items-center gap-1.5 text-xs py-2 px-3 rounded-lg font-medium whitespace-nowrap transition ${
            activeTab === "terminal" ? "bg-slate-800 text-white" : "text-zinc-400 hover:bg-slate-850/40 hover:text-zinc-200"
          }`}
        >
          <Tv className="w-3.5 h-3.5" />
          Terminal y Tiempo
        </button>

        <button
          onClick={() => setActiveTab("entries")}
          className={`flex items-center gap-1.5 text-xs py-2 px-3 rounded-lg font-medium whitespace-nowrap transition ${
            activeTab === "entries" ? "bg-slate-800 text-white" : "text-zinc-400 hover:bg-slate-850/40 hover:text-zinc-200"
          }`}
        >
          <FolderSync className="w-3.5 h-3.5" />
          Sistemas S.O.
        </button>

        <button
          onClick={() => setActiveTab("ai")}
          className={`flex items-center gap-1.5 text-xs py-1.5 px-2 rounded-lg font-medium whitespace-nowrap transition text-cyan-400 border border-cyan-500/20 bg-cyan-950/20 hover:bg-cyan-950/40 relative ${
            activeTab === "ai" ? "bg-cyan-950/60 text-white border-cyan-400" : ""
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          Diseñador IA
          <span className="absolute -top-1 -right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
        </button>
      </div>

      {/* Editor Main Controls Scroll Area */}
      <div className="p-4 flex-1 overflow-y-auto max-h-[500px] sm:max-h-none scrollbar-thin flex flex-col gap-5 text-sm">
        
        {/* TAB 1: BACKGROUND & LAYOUT */}
        {activeTab === "layout" && (
          <div className="flex flex-col gap-4 animate-fadeIn">
            
            {/* Background Style Section */}
            <div className="bg-[#10141b] p-3.5 rounded-lg border border-slate-800/80 flex flex-col gap-3">
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wide flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5 text-arch-blue" />
                Estilo de Fondo de Pantalla
              </label>

              <div className="grid grid-cols-3 gap-2">
                {Object.values(BackgroundType).map((type) => (
                  <button
                    key={type}
                    onClick={() => handleFieldChange("backgroundType", type)}
                    className={`py-2 px-2.5 text-xs font-medium rounded-lg capitalize border ${
                      theme.backgroundType === type
                        ? "bg-arch-blue/10 text-arch-blue border-arch-blue"
                        : "bg-brand-sidebar text-slate-400 border-slate-800 hover:bg-slate-850/50"
                    }`}
                  >
                    {type === "gradient" ? "Degradado" : type === "solid" ? "Color Sólido" : "Imagen JPG/PNG"}
                  </button>
                ))}
              </div>

              {/* Conditionally render settings depending on BackgroundType */}
              {theme.backgroundType === BackgroundType.SOLID && (
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs text-zinc-400 font-medium">Color de Fondo</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={theme.backgroundColorStart}
                      onChange={(e) => handleFieldChange("backgroundColorStart", e.target.value)}
                      className="w-10 h-8 rounded border border-zinc-700 bg-transparent cursor-pointer"
                    />
                    <input
                      type="text"
                      value={theme.backgroundColorStart}
                      onChange={(e) => handleFieldChange("backgroundColorStart", e.target.value)}
                      className="flex-1 bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-xs font-mono text-zinc-300 focus:outline-none focus:border-arch-blue"
                    />
                  </div>
                </div>
              )}

              {theme.backgroundType === BackgroundType.GRADIENT && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs text-zinc-400 font-medium">Color Inicial (Arriba)</span>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={theme.backgroundColorStart}
                        onChange={(e) => handleFieldChange("backgroundColorStart", e.target.value)}
                        className="w-8 h-8 rounded border border-zinc-700 bg-transparent cursor-pointer"
                      />
                      <input
                        type="text"
                        value={theme.backgroundColorStart}
                        onChange={(e) => handleFieldChange("backgroundColorStart", e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-[11px] font-mono text-zinc-300 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs text-zinc-400 font-medium">Color Final (Abajo)</span>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={theme.backgroundColorEnd}
                        onChange={(e) => handleFieldChange("backgroundColorEnd", e.target.value)}
                        className="w-8 h-8 rounded border border-zinc-700 bg-transparent cursor-pointer"
                      />
                      <input
                        type="text"
                        value={theme.backgroundColorEnd}
                        onChange={(e) => handleFieldChange("backgroundColorEnd", e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-[11px] font-mono text-zinc-300 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {theme.backgroundType === BackgroundType.IMAGE && (
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs text-zinc-400 font-medium">Dirección URL de la Imagen</span>
                    <input
                      type="text"
                      placeholder="https://ejemplo.com/fondo.jpg"
                      value={theme.backgroundImageUrl}
                      onChange={(e) => handleFieldChange("backgroundImageUrl", e.target.value)}
                      className="bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-arch-blue w-full"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs text-zinc-400 font-medium font-semibold uppercase text-[10px]">Galería de Wallpapers de Muestra:</span>
                    <div className="grid grid-cols-5 gap-1.5">
                      {PRESET_BACKGROUND_IMAGE_URLS.map((wp) => (
                        <button
                          key={wp.id}
                          onClick={() => handleFieldChange("backgroundImageUrl", wp.url)}
                          className="group relative rounded-md overflow-hidden aspect-video border border-zinc-800 hover:border-zinc-500 transition duration-150"
                          title={wp.name}
                        >
                          <img
                            src={wp.url}
                            alt={wp.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition duration-150"
                            referrerPolicy="no-referrer"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Menu Box Sizing & Placement Layout Section */}
            <div className="bg-[#10141b] p-3.5 rounded-lg border border-slate-800/80 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wide flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-arch-blue" />
                  Dimensiones y Márgenes de Caja GRUB
                </label>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-zinc-400">Mostrar Marco</span>
                  <input
                    type="checkbox"
                    checked={theme.showMenuFrame}
                    onChange={(e) => handleFieldChange("showMenuFrame", e.target.checked)}
                    className="w-4 h-4 text-arch-blue bg-zinc-900 border-zinc-700 rounded focus:ring-arch-blue"
                  />
                </div>
              </div>

              {/* Slider for Menu Width */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-xs font-mono text-zinc-400">
                  <span>Ancho de Caja:</span>
                  <span className="text-zinc-200">{theme.menuWidth}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="90"
                  value={theme.menuWidth}
                  onChange={(e) => handleFieldChange("menuWidth", parseInt(e.target.value))}
                  className="w-full accent-arch-blue cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
                />
              </div>

              {/* Slider for Menu Height */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-xs font-mono text-zinc-400">
                  <span>Alto de Caja:</span>
                  <span className="text-zinc-200">{theme.menuHeight}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="80"
                  value={theme.menuHeight}
                  onChange={(e) => handleFieldChange("menuHeight", parseInt(e.target.value))}
                  className="w-full accent-arch-blue cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
                />
              </div>

              {/* Grid with Positioning X and Y coordinates */}
              <div className="grid grid-cols-2 gap-3.5">
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs font-mono text-zinc-400">
                    <span>Posición Izquierda (X):</span>
                    <span className="text-zinc-200">{theme.menuLeft}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="60"
                    value={theme.menuLeft}
                    onChange={(e) => handleFieldChange("menuLeft", parseInt(e.target.value))}
                    className="w-full accent-arch-blue cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs font-mono text-zinc-400">
                    <span>Posición Superior (Y):</span>
                    <span className="text-zinc-200">{theme.menuTop}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="60"
                    value={theme.menuTop}
                    onChange={(e) => handleFieldChange("menuTop", parseInt(e.target.value))}
                    className="w-full accent-arch-blue cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
                  />
                </div>
              </div>

              {/* Border parameters if frame is visible */}
              {theme.showMenuFrame && (
                <div className="border-t border-zinc-800/80 pt-3 mt-1 grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] text-zinc-400 font-medium">Borde Normal</span>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={theme.borderColorNormal}
                        onChange={(e) => handleFieldChange("borderColorNormal", e.target.value)}
                        className="w-7 h-7 rounded border border-zinc-700 bg-transparent cursor-pointer"
                      />
                      <input
                        type="text"
                        value={theme.borderColorNormal}
                        onChange={(e) => handleFieldChange("borderColorNormal", e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded p-1 text-[10px] font-mono text-zinc-300 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] text-zinc-400 font-medium">Borde Seleccionado</span>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={theme.borderColorSelected}
                        onChange={(e) => handleFieldChange("borderColorSelected", e.target.value)}
                        className="w-7 h-7 rounded border border-zinc-700 bg-transparent cursor-pointer"
                      />
                      <input
                        type="text"
                        value={theme.borderColorSelected}
                        onChange={(e) => handleFieldChange("borderColorSelected", e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded p-1 text-[10px] font-mono text-zinc-300 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] text-zinc-400 font-medium">Grosor de Borde (px)</span>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={theme.borderWidth}
                      onChange={(e) => handleFieldChange("borderWidth", parseInt(e.target.value) || 1)}
                      className="bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-200"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] text-zinc-400 font-medium">Esquinas Redondas (px)</span>
                    <input
                      type="number"
                      min="0"
                      max="24"
                      value={theme.borderRadius}
                      onChange={(e) => handleFieldChange("borderRadius", parseInt(e.target.value) || 0)}
                      className="bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-200"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Retro Scanlines Toggle */}
            <div className="p-3 bg-[#10141b]/40 border border-slate-800/60 rounded-lg flex justify-between items-center">
              <div className="flex flex-col">
                <span className="font-semibold text-zinc-300 text-xs">Efecto Líneas Monitor CRT</span>
                <span className="text-[11px] text-zinc-500">Añade líneas de escaneo de fósforo retro</span>
              </div>
              <input
                type="checkbox"
                checked={theme.retroScanlines}
                onChange={(e) => handleFieldChange("retroScanlines", e.target.checked)}
                className="w-4 h-4 text-arch-blue bg-zinc-900 border-zinc-700 rounded focus:ring-arch-blue"
              />
            </div>

          </div>
        )}

        {/* TAB 2: FONTS & TYPOGRAPHY */}
        {activeTab === "fonts" && (
          <div className="flex flex-col gap-4 animate-fadeIn">
            
            {/* Fonts configuration */}
            <div className="bg-[#10141b] p-3.5 rounded-lg border border-slate-800/80 flex flex-col gap-3">
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wide flex items-center gap-1">
                <FontIcon className="w-3.5 h-3.5 text-arch-blue" />
                Familia y Tamaño de Fuente
              </label>

              <div className="flex flex-col gap-1.5">
                <span className="text-xs text-zinc-400 font-medium">Tipografía Predefinida</span>
                <select
                  value={theme.fontFamily}
                  onChange={(e) => handleFieldChange("fontFamily", e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-2 text-xs text-zinc-300 focus:outline-none focus:border-arch-blue w-full cursor-pointer font-medium"
                >
                  <option value="Inter, sans-serif">Inter (Estilo Moderno Sans-Serif)</option>
                  <option value="Space Grotesk, sans-serif">Space Grotesk (Estilo Geométrico Tecnológico)</option>
                  <option value="JetBrains Mono, monospace">JetBrains Mono (Consola Programador)</option>
                  <option value="Fira Code, monospace">Fira Code (Consola Nerd Font)</option>
                  <option value="Playfair Display, serif">Playfair Display (Serifa Elegante / Retro)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>Tamaño de Letra (px)</span>
                  <span className="font-mono text-zinc-200 font-bold">{theme.fontSize}px</span>
                </div>
                <input
                  type="range"
                  min="11"
                  max="28"
                  value={theme.fontSize}
                  onChange={(e) => handleFieldChange("fontSize", parseInt(e.target.value))}
                  className="w-full accent-arch-blue cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
                />
              </div>
            </div>

            {/* Colors picker section */}
            <div className="bg-[#10141b] p-3.5 rounded-lg border border-slate-800/80 flex flex-col gap-3">
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wide flex items-center gap-1">
                <Paintbrush className="w-3.5 h-3.5 text-arch-blue" />
                Paleta de Colores de Letras GRUB
              </label>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs text-zinc-400 font-medium">Texto General</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={theme.textColorNormal}
                      onChange={(e) => handleFieldChange("textColorNormal", e.target.value)}
                      className="w-7 h-7 rounded border border-zinc-700 bg-transparent cursor-pointer"
                    />
                    <input
                      type="text"
                      value={theme.textColorNormal}
                      onChange={(e) => handleFieldChange("textColorNormal", e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded p-1 text-xs font-mono text-zinc-300 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-xs text-zinc-400 font-medium">Texto Seleccionado</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={theme.textColorSelected}
                      onChange={(e) => handleFieldChange("textColorSelected", e.target.value)}
                      className="w-7 h-7 rounded border border-zinc-700 bg-transparent cursor-pointer"
                    />
                    <input
                      type="text"
                      value={theme.textColorSelected}
                      onChange={(e) => handleFieldChange("textColorSelected", e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded p-1 text-xs font-mono text-zinc-300 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 border-t border-zinc-800/80 pt-3 mt-1">
                <span className="text-xs text-zinc-400 font-medium">Sombreado / Fondo del Elemento Activo</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={theme.textBgColorSelected.startsWith("rgba") ? "#3f3f46" : theme.textBgColorSelected}
                    onChange={(e) => handleFieldChange("textBgColorSelected", e.target.value)}
                    className="w-8 h-8 rounded border border-zinc-700 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={theme.textBgColorSelected}
                    onChange={(e) => handleFieldChange("textBgColorSelected", e.target.value)}
                    className="flex-1 bg-zinc-900 border border-zinc-800 rounded px-2 py-1.5 text-xs font-mono text-zinc-350 focus:outline-none"
                    placeholder="Eje: #1e1e2e o rgba(255,255,255,0.1)"
                  />
                  <button
                    onClick={() => handleFieldChange("textBgColorSelected", "rgba(255,255,255,0.15)")}
                    className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded text-[10px] text-zinc-300"
                  >
                    Por Defecto Opaco
                  </button>
                </div>
              </div>
            </div>

            {/* Menu Sizing properties inside box */}
            <div className="bg-[#10141b] p-3.5 rounded-lg border border-slate-800/80 flex flex-col gap-3">
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wide flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5 text-arch-blue" />
                Espaciado de Líneas del Menú
              </label>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-zinc-400">Altura de Item (px)</span>
                  <input
                    type="number"
                    min="20"
                    max="50"
                    value={theme.itemHeight}
                    onChange={(e) => handleFieldChange("itemHeight", parseInt(e.target.value) || 28)}
                    className="bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-200"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs text-zinc-400">Espacio entre Items (px)</span>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={theme.itemSpacing}
                    onChange={(e) => handleFieldChange("itemSpacing", parseInt(e.target.value) || 6)}
                    className="bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-200"
                  />
                </div>
              </div>

              {/* OS Icons setup */}
              <div className="border-t border-zinc-800/80 pt-3 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-zinc-300 font-semibold">Mostrar Iconos de Sistemas S.O.</span>
                  <input
                    type="checkbox"
                    checked={theme.showOsIcons}
                    onChange={(e) => handleFieldChange("showOsIcons", e.target.checked)}
                    className="w-4 h-4 text-arch-blue bg-zinc-900 border-zinc-700 rounded focus:ring-arch-blue"
                  />
                </div>

                {theme.showOsIcons && (
                  <div className="grid grid-cols-2 gap-3 mt-1 animate-fadeIn">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-zinc-500">Ancho Icono (px)</span>
                      <input
                        type="number"
                        min="16"
                        max="32"
                        value={theme.iconWidth}
                        onChange={(e) => handleFieldChange("iconWidth", parseInt(e.target.value) || 20)}
                        className="bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-250"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-zinc-500">Alto Icono (px)</span>
                      <input
                        type="number"
                        min="16"
                        max="32"
                        value={theme.iconHeight}
                        onChange={(e) => handleFieldChange("iconHeight", parseInt(e.target.value) || 20)}
                        className="bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-250"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: TERMINAL & TIMER CONFIG */}
        {activeTab === "terminal" && (
          <div className="flex flex-col gap-4 animate-fadeIn">
            
            {/* Timer countdown settings */}
            <div className="bg-[#10141b] p-3.5 rounded-lg border border-slate-800/80 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wide flex items-center gap-1">
                  <Tv className="w-3.5 h-3.5 text-arch-blue" />
                  Cuenta Atrás de Arranque
                </label>
                <input
                  type="checkbox"
                  checked={theme.showCountdown}
                  onChange={(e) => handleFieldChange("showCountdown", e.target.checked)}
                  className="w-4 h-4 text-arch-blue bg-zinc-900 border-zinc-700 rounded focus:ring-arch-blue"
                />
              </div>

              {theme.showCountdown && (
                <div className="flex flex-col gap-3 mt-1.5 animate-fadeIn">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-zinc-400">Segundos antes de Boot</span>
                      <input
                        type="number"
                        min="2"
                        max="60"
                        value={theme.countdownSeconds}
                        onChange={(e) => handleFieldChange("countdownSeconds", parseInt(e.target.value) || 5)}
                        className="bg-zinc-900 border border-zinc-800 rounded px-2 py-1.5 text-xs text-zinc-200"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <span className="text-xs text-zinc-400 font-medium">Color de Letras</span>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="color"
                          value={theme.countdownColor}
                          onChange={(e) => handleFieldChange("countdownColor", e.target.value)}
                          className="w-7 h-7 rounded border border-zinc-700 bg-transparent cursor-pointer"
                        />
                        <input
                          type="text"
                          value={theme.countdownColor}
                          onChange={(e) => handleFieldChange("countdownColor", e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded p-1 text-[11px] font-mono text-zinc-300 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Positioning countdown in percentage */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-[11px] text-zinc-400">
                        <span>Línea X (%):</span>
                        <span className="text-zinc-200">{theme.countdownLeft}%</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="95"
                        value={theme.countdownLeft}
                        onChange={(e) => handleFieldChange("countdownLeft", parseInt(e.target.value))}
                        className="w-full h-1 bg-zinc-800 accent-arch-blue"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-[11px] text-zinc-400">
                        <span>Línea Y (%):</span>
                        <span className="text-zinc-200">{theme.countdownTop}%</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="95"
                        value={theme.countdownTop}
                        onChange={(e) => handleFieldChange("countdownTop", parseInt(e.target.value))}
                        className="w-full h-1 bg-zinc-800 accent-arch-blue"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Terminal emulator frame parameters */}
            <div className="bg-[#10141b] p-3.5 rounded-lg border border-slate-800/80 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wide flex items-center gap-1">
                  <Terminal className="w-3.5 h-3.5 text-arch-blue" />
                  Terminal Integrada GRUB (F8)
                </label>
                <input
                  type="checkbox"
                  checked={theme.terminalVisible}
                  onChange={(e) => handleFieldChange("terminalVisible", e.target.checked)}
                  className="w-4 h-4 text-arch-blue bg-zinc-900 border-zinc-700 rounded focus:ring-arch-blue"
                />
              </div>

              {theme.terminalVisible && (
                <div className="flex flex-col gap-3 mt-1 animate-fadeIn">
                  
                  {/* Sizing inputs */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] text-zinc-400">Izquierda (X %)</span>
                      <input
                        type="number"
                        min="5"
                        max="80"
                        value={theme.terminalLeft}
                        onChange={(e) => handleFieldChange("terminalLeft", parseInt(e.target.value) || 20)}
                        className="bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-200"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] text-zinc-400">Superior (Y %)</span>
                      <input
                        type="number"
                        min="5"
                        max="80"
                        value={theme.terminalTop}
                        onChange={(e) => handleFieldChange("terminalTop", parseInt(e.target.value) || 50)}
                        className="bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-200"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] text-zinc-400">Ancho (%)</span>
                      <input
                        type="number"
                        min="20"
                        max="90"
                        value={theme.terminalWidth}
                        onChange={(e) => handleFieldChange("terminalWidth", parseInt(e.target.value) || 60)}
                        className="bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-200"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] text-zinc-400">Alto (%)</span>
                      <input
                        type="number"
                        min="15"
                        max="60"
                        value={theme.terminalHeight}
                        onChange={(e) => handleFieldChange("terminalHeight", parseInt(e.target.value) || 25)}
                        className="bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-200"
                      />
                    </div>
                  </div>

                  {/* Style of border */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs text-zinc-400">Estilo del Borde de Consola</span>
                    <select
                      value={theme.terminalBorder}
                      onChange={(e) => handleFieldChange("terminalBorder", e.target.value)}
                      className="bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-300 w-full"
                    >
                      <option value={TerminalBorderStyle.NONE}>Ninguno (Transparente)</option>
                      <option value={TerminalBorderStyle.SOLID}>Simple Sólido</option>
                      <option value={TerminalBorderStyle.DOUBLE}>Doble Línea (Clásico)</option>
                      <option value={TerminalBorderStyle.RETRO}>Retro Terminal CRT</option>
                    </select>
                  </div>

                  {/* Theme terminal color */}
                  <div className="grid grid-cols-2 gap-3.5">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-xs text-zinc-400">Fondo Terminal</span>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="color"
                          value={theme.terminalBgColor.startsWith("#") ? theme.terminalBgColor : "#0a0014"}
                          onChange={(e) => handleFieldChange("terminalBgColor", e.target.value)}
                          className="w-6 h-6 rounded bg-transparent cursor-pointer"
                        />
                        <input
                          type="text"
                          value={theme.terminalBgColor}
                          onChange={(e) => handleFieldChange("terminalBgColor", e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded p-1 text-[11px] font-mono text-zinc-300 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <span className="text-xs text-zinc-400">Letras Terminal</span>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="color"
                          value={theme.terminalTextColor.startsWith("#") ? theme.terminalTextColor : "#39ff14"}
                          onChange={(e) => handleFieldChange("terminalTextColor", e.target.value)}
                          className="w-6 h-6 rounded bg-transparent cursor-pointer"
                        />
                        <input
                          type="text"
                          value={theme.terminalTextColor}
                          onChange={(e) => handleFieldChange("terminalTextColor", e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded p-1 text-[11px] font-mono text-zinc-300 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 4: EDIT OS ENTRIES */}
        {activeTab === "entries" && (
          <div className="flex flex-col gap-4 animate-fadeIn">
            
            <div className="flex justify-between items-center bg-brand-panel p-2 rounded-lg border border-slate-800/60">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-zinc-300 uppercase tracking-wide">Configurar Entradas del Menú</span>
                <span className="text-[11px] text-zinc-500">Prueba cómo encajan los textos en la caja</span>
              </div>
              <button
                onClick={handleAddEntry}
                className="flex items-center gap-1 text-xs py-1.5 px-3 rounded-lg font-semibold bg-arch-blue hover:bg-arch-blue-hover text-white transition-all shadow-md shadow-arch-blue/10"
              >
                <Plus className="w-3.5 h-3.5" />
                Añadir Entrada
              </button>
            </div>

            {/* List of Entries scroll */}
            <div className="flex flex-col gap-3">
              {entries.map((entry, index) => (
                <div 
                  key={entry.id} 
                  className="p-3 bg-[#10141b] border border-slate-800/60 rounded-lg flex flex-col gap-2.5 relative group/item"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-mono font-bold bg-slate-800 text-zinc-300 py-0.5 px-1.5 rounded">
                      Entrada #{index + 1}
                    </span>
                    
                    {entries.length > 1 && (
                      <button
                        onClick={() => handleDeleteEntry(index)}
                        className="text-zinc-500 hover:text-red-400 p-1 rounded hover:bg-red-500/10 transition"
                        title="Eliminar Entrada"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Input Fields */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[11px] text-zinc-400">Etiqueta de Pantalla</span>
                    <input
                      type="text"
                      value={entry.label}
                      onChange={(e) => handleUpdateEntry(index, "label", e.target.value)}
                      className="bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-200 focus:outline-none focus:border-arch-blue"
                    />
                  </div>

                  {/* Row for Icon Selector and Kernel Path */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] text-zinc-500">Icono OS</span>
                      <select
                        value={entry.icon}
                        onChange={(e) => handleUpdateEntry(index, "icon", e.target.value)}
                        className="bg-zinc-950 border border-zinc-800 rounded px-1.5 py-1 text-xs text-zinc-300 cursor-pointer"
                      >
                        {OS_ICONS.map((ico) => (
                          <option key={ico.key} value={ico.key}>
                            {ico.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] text-zinc-500">Ruta de Kernel (Simulada)</span>
                      <input
                        type="text"
                        value={entry.kernel}
                        onChange={(e) => handleUpdateEntry(index, "kernel", e.target.value)}
                        className="bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-350 font-mono"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 5: AI THEME ASSISTANT */}
        {activeTab === "ai" && (
          <div className="flex flex-col gap-4 animate-fadeIn">
            
            <div className="p-3.5 rounded-lg border border-cyan-500/20 bg-cyan-950/10 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                <Sparkles className="w-5 h-5 animate-pulse" />
                Asistente de Diseño Inteligente Gemini
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Describe el tema que sueñas con palabras naturales y nuestro co-diseñador de inteligencia artificial creará la paleta de colores, fuentes, espaciados y dimensiones ideales al instante.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs text-zinc-400 font-medium">¿De qué temática quieres tu tema GRUB?</label>
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                rows={3}
                disabled={isGenerating}
                placeholder="Por ejemplo: Estilo futurista cyberpunk con colores morado neón y azul cian, bordes brillantes redondeados, letra de programador de tamaño intermedio y una terminal llamativa verde..."
                className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs text-zinc-200 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20 w-full resize-none disabled:opacity-50"
              />
            </div>

            {apiError && (
              <div className="p-3.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/25 text-xs">
                <b>Error:</b> {apiError}
              </div>
            )}

            <button
              onClick={handleAiGenerate}
              disabled={isGenerating || !aiPrompt.trim()}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs text-black bg-cyan-400 hover:bg-cyan-300 disabled:bg-zinc-800 disabled:text-zinc-600 transition shadow-lg shadow-cyan-400/15"
            >
              {isGenerating ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 text-black" />
              )}
              {isGenerating ? "Generando Combinaciones Estéticas..." : "Diseñar con Inteligencia Artificial"}
            </button>

            {/* AI Status loading notification log */}
            {isGenerating && (
              <div className="p-3 bg-zinc-950 text-cyan-400 rounded-lg border border-cyan-500/10 font-mono text-[11px] leading-snug flex items-center gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping shrink-0" />
                <span className="italic">{aiStatus}</span>
              </div>
            )}

            <div className="border-t border-slate-850 pt-3 mt-1 flex flex-col gap-2">
              <span className="text-[11px] text-zinc-500 font-semibold uppercase">Prueba estas ideas de prompt:</span>
              <div className="flex flex-col gap-1.5 text-xs text-zinc-400">
                <button 
                  onClick={() => setAiPrompt("Estilo matrix antiguo minimalista negro con letras verde fósforo brillantes de tamaño grande")}
                  className="text-left bg-[#10141b] border border-slate-800 p-2 rounded hover:bg-slate-850/50 hover:text-zinc-200 transition"
                >
                  📟 "Estilo de terminal Matrix de los años 80..."
                </button>
                <button 
                  onClick={() => setAiPrompt("Un tema volcánico apocalíptico rojo fuego y ceniza gris con bordes afilados sin redondear, caja del menú bastante ancha")}
                  className="text-left bg-[#10141b] border border-slate-800 p-2 rounded hover:bg-slate-850/50 hover:text-zinc-200 transition"
                >
                  🌋 "Un tema volcánico apocalíptico rojo fuego..."
                </button>
                <button 
                  onClick={() => setAiPrompt("Diseño de estilo espacial minimalista con colores azul marino muy oscuro y blanco liso, tipografía sans serif limpia")}
                  className="text-left bg-[#10141b] border border-slate-800 p-2 rounded hover:bg-slate-850/50 hover:text-zinc-200 transition"
                >
                  🌌 "Diseño de estilo espacial limpio minimalista..."
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
