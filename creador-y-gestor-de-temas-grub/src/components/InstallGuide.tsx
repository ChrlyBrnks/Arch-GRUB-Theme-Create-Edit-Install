/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { GrubTheme, OsEntry, BackgroundType } from "../types";
import { Copy, Check, Terminal, Download, FileText, Info, HelpCircle } from "lucide-react";

interface Props {
  theme: GrubTheme;
  entries: OsEntry[];
}

export default function InstallGuide({ theme, entries }: Props) {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Generate authentic GRUB theme.txt file
  const generateThemeTxt = (): string => {
    const bgImageFile = theme.backgroundType === BackgroundType.IMAGE ? "background.png" : "";
    const bgScale = theme.backgroundImageScale === "stretch" ? "stretch" : theme.backgroundImageScale === "center" ? "center" : "tile";
    
    return `# Creado con: Creador y Gestor de Temas GRUB
# Nombre del Tema: ${theme.name}
# Descripción: ${theme.description}

# Propiedades de Pantalla Globales
title-text: ""
desktop-color: "${theme.backgroundColorStart}"
${bgImageFile ? `desktop-image: "${bgImageFile}"\ndesktop-image-scale: "${bgScale}"\n` : ""}
# Fuentes Globales (Se requiere cargar fuente pf2)
title-font: "Unifont Regular 16"
message-font: "Unifont Regular 12"
message-color: "${theme.textColorNormal}"

# Contenedor de Arranque Principal
+ boot_menu {
  left = ${theme.menuLeft}%
  top = ${theme.menuTop}%
  width = ${theme.menuWidth}%
  height = ${theme.menuHeight}%
  
  # Fuentes e Items
  item_font = "DejaVu Sans Mono Regular 12"
  selected_item_font = "DejaVu Sans Mono Bold 12"
  item_color = "${theme.textColorNormal}"
  selected_item_color = "${theme.textColorSelected}"
  
  # Estructura visual de Selección
  selected_item_bg_color = "${theme.textBgColorSelected}"
  ${theme.showMenuFrame ? `menu_pixmap_style = "menu_*"
  border_color = "${theme.borderColorNormal}"
  border_width = ${theme.borderWidth}
  corner_radius = ${theme.borderRadius}` : ""}

  # Configuración de Iconos OS
  icon_width = ${theme.iconWidth}
  icon_height = ${theme.iconHeight}
  item_height = ${theme.itemHeight}
  item_spacing = ${theme.itemSpacing}
}

# Etiqueta de Cuenta Atrás
${theme.showCountdown ? `+ label {
  left = ${theme.countdownLeft}%
  top = ${theme.countdownTop}%
  align = "center"
  color = "${theme.countdownColor}"
  text = "Arrancando sistema operativo seleccionado en %d segundos..."
}` : ""}

# Consola de Línea de Comandos Integrada
${theme.terminalVisible ? `+ terminal {
  left = ${theme.terminalLeft}%
  top = ${theme.terminalTop}%
  width = ${theme.terminalWidth}%
  height = ${theme.terminalHeight}%
  border = ${theme.terminalBorder === "none" ? 0 : 1}
  background_color = "${theme.terminalBgColor}"
  text_color = "${theme.terminalTextColor}"
}` : ""}
`;
  };

  // Generate automated inline bash installer source
  const generateInstallerScript = (): string => {
    const themeTxtRaw = generateThemeTxt();
    const downloadBgCmd = theme.backgroundType === BackgroundType.IMAGE && theme.backgroundImageUrl
      ? `echo "-> Descargando imagen de fondo..."\ncurl -s -L -o "$THEME_DIR/background.png" "${theme.backgroundImageUrl}"`
      : "";

    return `#!/usr/bin/env bash
# Script Autoinstalador para Tema GRUB: ${theme.name}
# Generado con el Creador de Temas GRUB de AI Studio

set -euo pipefail

THEME_NAME="grub-theme-${theme.id || "custom"}"
THEME_DIR="/boot/grub/themes/$THEME_NAME"

echo "==========================================="
echo " Instalando Tema GRUB: ${theme.name}"
echo "==========================================="

# 1. Comprobar permisos
if [ "$EUID" -ne 0 ]; then
  echo "[-] Error: Por favor, ejecuta este instalador con sudo."
  exit 1
fi

# 2. Crear directorios del tema
echo "-> Creando carpetas en $THEME_DIR..."
mkdir -p "$THEME_DIR/icons"

# 3. Crear archivo theme.txt
echo "-> Escribiendo especificación theme.txt..."
cat << 'EOF' > "$THEME_DIR/theme.txt"
${themeTxtRaw}
EOF

# 4. Obtener imagen de fondo si es necesaria
${downloadBgCmd}

# 5. Descargar iconos OS estándar para GRUB (desde mirrors libres en Arch)
echo "-> Preparando iconos de sistema para la barra..."
declare -A icons=(
  ["arch"]="https://raw.githubusercontent.com/vinceliuice/grub2-themes/master/src/icons/arch.png"
  ["windows"]="https://raw.githubusercontent.com/vinceliuice/grub2-themes/master/src/icons/windows.png"
  ["ubuntu"]="https://raw.githubusercontent.com/vinceliuice/grub2-themes/master/src/icons/ubuntu.png"
  ["debian"]="https://raw.githubusercontent.com/vinceliuice/grub2-themes/master/src/icons/debian.png"
  ["fedora"]="https://raw.githubusercontent.com/vinceliuice/grub2-themes/master/src/icons/fedora.png"
  ["tux"]="https://raw.githubusercontent.com/vinceliuice/grub2-themes/master/src/icons/linux.png"
)

for key in "\${!icons[@]}"; do
  echo "   Descargando icono: $key..."
  curl -s -L -o "$THEME_DIR/icons/$key.png" "\${icons[$key]}" || echo "    [!] Fallo no crítico descargando $key."
done

# Copiar fallback genérico
cp "$THEME_DIR/icons/tux.png" "$THEME_DIR/icons/unknown.png" 2>/dev/null || true

# 6. Actualizar configuración /etc/default/grub
echo "-> Vinculando tema en /etc/default/grub..."
# Eliminar posibles líneas duplicadas existentes de tema
sed -i '/^GRUB_THEME=/d' /etc/default/grub
echo "" >> /etc/default/grub
echo "GRUB_THEME=\\"$THEME_DIR/theme.txt\\"" >> /etc/default/grub

# Activar modo gráfico de arranque
sed -i 's/^#GRUB_GFXMODE=.*/GRUB_GFXMODE=1920x1080,auto/' /etc/default/grub || true

# 7. Recompilar archivos de arranque GRUB config
echo "-> Recompilando gestor de arranque GRUB en Arch Linux..."
if command -v grub-mkconfig &> /dev/null; then
  grub-mkconfig -o /boot/grub/grub.cfg
  echo "[+] ¡Tema instalado y activado con éxito! Reinicia tu ordenador para disfrutarlo."
else
  echo "[!] GRUB no se recompiló automáticamente. Ejecuta manualmente 'grub-mkconfig -o /boot/grub/grub.cfg'"
fi
`;
  };

  const handleDownloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const themeText = generateThemeTxt();
  const installerText = generateInstallerScript();

  return (
    <div className="w-full flex flex-col gap-6 bg-brand-sidebar border border-slate-850 p-5 rounded-xl text-zinc-300">
      
      {/* Visual Header */}
      <div className="flex flex-col gap-1 border-b border-slate-850 pb-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Terminal className="w-5 h-5 text-arch-blue" />
          Exportar e Instalar Tema en Arch Linux
        </h2>
        <p className="text-xs text-zinc-400">
          Sigue esta guía paso a paso para desplegar directamente en tu cargador de arranque real.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Left Column: Easy One-Click shell Script */}
        <div className="flex flex-col gap-3.5 bg-[#10141b] p-4 rounded-xl border border-slate-800">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-arch-blue/25 text-arch-blue flex items-center justify-center text-[10px] font-bold">1</span>
              Método Automático (Recomendado)
            </span>
            
            <button
              onClick={() => handleDownloadFile(installerText, "install.sh")}
              className="flex items-center gap-1 text-[11px] font-semibold bg-arch-blue/20 border border-arch-blue/30 hover:bg-arch-blue/30 text-arch-blue py-1.5 px-3 rounded-lg transition"
            >
              <Download className="w-3.5 h-3.5" />
              Descargar instalador.sh
            </button>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            Descarga o copia el instalador de bash automatizado. Este script creará la carpeta adecuada, descargará el fondo seleccionado y los iconos OS optimizados en <code className="text-arch-blue font-semibold">/boot/grub/themes/</code>, configurará el parámetro del tema en <code className="text-arch-blue font-semibold">/etc/default/grub</code>, y correrá la recompilación con <code className="text-arch-blue font-bold">grub-mkconfig</code> de forma garantizada.
          </p>

          {/* Installer Codebox Code view */}
          <div className="relative mt-1 border border-slate-800 rounded-lg overflow-hidden bg-black/80 font-mono text-xs">
            <div className="bg-zinc-900 px-4 py-2 border-b border-slate-800 flex justify-between items-center text-[10px] text-zinc-400 select-none">
              <span>BASH INSTALLER (install.sh)</span>
              <button
                onClick={() => handleCopy(installerText, "installer")}
                className="flex items-center gap-1 hover:text-white transition"
              >
                {copiedText === "installer" ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copiar Script</span>
                  </>
                )}
              </button>
            </div>
            
            {/* Trimmed content box display */}
            <pre className="p-3.5 overflow-x-auto max-h-40 text-[11px] leading-normal text-emerald-400 font-mono scrollbar-thin">
              {`# Descargar y ejecutar automáticamente como root:
curl -o install.sh -L "tu-servidor-url/install.sh"
sudo bash install.sh`}
            </pre>
          </div>

          <div className="flex items-start gap-2.5 bg-arch-blue/5 border border-arch-blue/20 p-3 rounded-lg text-xs leading-relaxed text-slate-300">
            <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-arch-blue" />
            <span>
              Para ejecutarlo localmente: abre una terminal en tu GNU/Linux, crea un archivo llamado <code className="underline text-arch-blue">install.sh</code>, pega este contenido, hazlo ejecutable con <code className="font-mono bg-black/40 px-1 rounded text-[11px]">chmod +x install.sh</code> y lánzalo con <code className="font-mono bg-black/40 px-1 rounded text-[11px]">sudo ./install.sh</code>.
            </span>
          </div>
        </div>

        {/* Right Column: Original GRUB theme.txt file details */}
        <div className="flex flex-col gap-3.5 bg-[#10141b] p-4 rounded-xl border border-slate-800">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-arch-blue/20 text-arch-blue flex items-center justify-center text-[10px] font-bold">2</span>
              Especificación GRUB theme.txt
            </span>
            
            <button
              onClick={() => handleDownloadFile(themeText, "theme.txt")}
              className="flex items-center gap-1 text-[11px] font-semibold bg-slate-800 border border-slate-700 hover:bg-slate-700 text-zinc-300 py-1.5 px-3 rounded-lg transition"
            >
              <Download className="w-3.5 h-3.5" />
              Descargar theme.txt
            </button>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            Este es el archivo de especificación de temas de GRUB real generado por el gestor. Contiene los parámetros exactos de caja, coordenadas de pantalla en porcentajes, y colores hex que decidiste.
          </p>

          <div className="relative mt-1 border border-slate-800 rounded-lg overflow-hidden bg-black/85 font-mono text-xs">
            <div className="bg-zinc-900 px-4 py-2 border-b border-slate-800 flex justify-between items-center text-[10px] text-zinc-400 select-none">
              <span>GRUB FILE (theme.txt)</span>
              <button
                onClick={() => handleCopy(themeText, "themetxt")}
                className="flex items-center gap-1 hover:text-white transition"
              >
                {copiedText === "themetxt" ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copiar Código</span>
                  </>
                )}
              </button>
            </div>
            
            <pre className="p-3 overflow-x-auto max-h-40 text-[10.5px] leading-normal text-zinc-300 font-mono scrollbar-thin">
              {themeText}
            </pre>
          </div>

          <div className="p-3 bg-slate-900/30 rounded-lg border border-slate-800 flex flex-col gap-1.5 text-xs">
            <span className="font-semibold text-zinc-200 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-arch-blue" />
              ¿Tiene dudas de cómo funciona?
            </span>
            <p className="text-[11px] text-zinc-400 leading-normal">
              GRUB lee este archivo al iniciar tu placa base antes que cargue kernel alguno. Los nombres de las fuentes pf2 (como Terminus o Unifont) deben encontrarse dentro del directorio del tema para que se rendersen correctamente.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
