import { useState, useRef, useEffect } from 'react';
import {
  Sun,
  Sunset,
  Moon,
  CloudMoon,
  Calendar,
  X,
  ChevronDown,
  User,
  Filter,
} from 'lucide-react';

// ─────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────

interface FilterBarProps {
  turno: string | undefined;
  onTurnoChange: (turno: string | undefined) => void;
  dataInicio: Date | undefined;
  dataFim: Date | undefined;
  onPeriodoChange: (inicio: Date | undefined, fim: Date | undefined) => void;
  colaboradorSelecionado: { id: number; nome: string } | null;
  onLimparColaborador: () => void;
}

type PresetKey = 'hoje' | 'ontem' | '7dias' | '30dias' | 'custom';

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

const startOfDay = (d: Date) => {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
};

const endOfDay = (d: Date) => {
  const copy = new Date(d);
  copy.setHours(23, 59, 59, 999);
  return copy;
};

const getPresetDates = (preset: PresetKey): [Date | undefined, Date | undefined] => {
  const now = new Date();
  switch (preset) {
    case 'hoje':
      return [startOfDay(now), endOfDay(now)];
    case 'ontem': {
      const ontem = new Date(now);
      ontem.setDate(ontem.getDate() - 1);
      return [startOfDay(ontem), endOfDay(ontem)];
    }
    case '7dias': {
      const inicio = new Date(now);
      inicio.setDate(inicio.getDate() - 7);
      return [startOfDay(inicio), endOfDay(now)];
    }
    case '30dias': {
      const inicio = new Date(now);
      inicio.setDate(inicio.getDate() - 30);
      return [startOfDay(inicio), endOfDay(now)];
    }
    default:
      return [undefined, undefined];
  }
};



// ─────────────────────────────────────────────
// Turnos
// ─────────────────────────────────────────────

const TURNOS = [
  { key: 'Manhã', label: 'Manhã', icon: Sun, desc: '06h–12h' },
  { key: 'Tarde', label: 'Tarde', icon: Sunset, desc: '12h–18h' },
  { key: 'Noite', label: 'Noite', icon: Moon, desc: '18h–00h' },
  { key: 'Madrugada', label: 'Madrugada', icon: CloudMoon, desc: '00h–06h' },
] as const;

const PRESETS = [
  { key: 'hoje' as PresetKey, label: 'Hoje' },
  { key: 'ontem' as PresetKey, label: 'Ontem' },
  { key: '7dias' as PresetKey, label: '7 dias' },
  { key: '30dias' as PresetKey, label: '30 dias' },
  { key: 'custom' as PresetKey, label: 'Personalizado' },
] as const;

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export const FilterBar = ({
  turno,
  onTurnoChange,
  dataInicio,
  onPeriodoChange,
  colaboradorSelecionado,
  onLimparColaborador,
}: FilterBarProps) => {
  const [presetAtivo, setPresetAtivo] = useState<PresetKey | null>(null);
  const [showCustom, setShowCustom] = useState(false);
  const [customInicio, setCustomInicio] = useState('');
  const [customFim, setCustomFim] = useState('');
  const [showTurnoDropdown, setShowTurnoDropdown] = useState(false);
  const turnoRef = useRef<HTMLDivElement>(null);

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (turnoRef.current && !turnoRef.current.contains(e.target as Node)) {
        setShowTurnoDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handlePreset = (preset: PresetKey) => {
    if (preset === 'custom') {
      setShowCustom(true);
      setPresetAtivo('custom');
      return;
    }
    setShowCustom(false);
    if (presetAtivo === preset) {
      // Toggle off
      setPresetAtivo(null);
      onPeriodoChange(undefined, undefined);
    } else {
      setPresetAtivo(preset);
      const [inicio, fim] = getPresetDates(preset);
      onPeriodoChange(inicio, fim);
    }
  };

  const handleCustomApply = () => {
    if (customInicio && customFim) {
      onPeriodoChange(
        startOfDay(new Date(customInicio + 'T00:00:00')),
        endOfDay(new Date(customFim + 'T00:00:00'))
      );
    }
  };

  const handleClearAll = () => {
    onTurnoChange(undefined);
    onPeriodoChange(undefined, undefined);
    setPresetAtivo(null);
    setShowCustom(false);
    setCustomInicio('');
    setCustomFim('');
    onLimparColaborador();
  };

  const hasActiveFilters = turno || dataInicio || colaboradorSelecionado;

  const turnoAtivo = TURNOS.find(t => t.key === turno);

  return (
    <div className="flex flex-wrap items-center gap-2">

      {/* ── Turno Dropdown ────────────────────────── */}
      <div ref={turnoRef} className="relative">
        <button
          onClick={() => setShowTurnoDropdown(!showTurnoDropdown)}
          className={`
            flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
            transition-all duration-200 border
            ${turno
              ? 'bg-white/20 text-white border-white/30'
              : 'bg-white/10 text-white/70 border-white/10 hover:bg-white/15 hover:text-white'
            }
          `}
        >
          {turnoAtivo ? (
            <>
              <turnoAtivo.icon size={13} />
              {turnoAtivo.label}
            </>
          ) : (
            <>
              <Filter size={13} />
              Turno
            </>
          )}
          <ChevronDown size={12} className={`transition-transform ${showTurnoDropdown ? 'rotate-180' : ''}`} />
        </button>

        {showTurnoDropdown && (
          <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-xl border border-surface-200 py-1 z-50 min-w-[160px] animate-fade-in">
            {turno && (
              <button
                onClick={() => { onTurnoChange(undefined); setShowTurnoDropdown(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-ink-400 hover:bg-surface-50 transition-colors"
              >
                <X size={12} /> Limpar turno
              </button>
            )}
            {TURNOS.map(t => (
              <button
                key={t.key}
                onClick={() => {
                  onTurnoChange(turno === t.key ? undefined : t.key);
                  setShowTurnoDropdown(false);
                }}
                className={`
                  w-full flex items-center gap-2.5 px-3 py-2 text-xs transition-colors
                  ${turno === t.key
                    ? 'bg-brand-50 text-brand-700 font-bold'
                    : 'text-ink-600 hover:bg-surface-50'
                  }
                `}
              >
                <t.icon size={14} className={turno === t.key ? 'text-brand-500' : 'text-ink-300'} />
                <span className="flex-1 text-left">{t.label}</span>
                <span className={`text-[10px] ${turno === t.key ? 'text-brand-400' : 'text-ink-300'}`}>
                  {t.desc}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Separador ─────────────────────────────── */}
      <span className="w-px h-5 bg-white/20 mx-0.5" />

      {/* ── Presets de Período ─────────────────────── */}
      {PRESETS.map(p => (
        <button
          key={p.key}
          onClick={() => handlePreset(p.key)}
          className={`
            px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 border
            ${presetAtivo === p.key
              ? 'bg-white/20 text-white border-white/30'
              : 'bg-white/10 text-white/60 border-transparent hover:bg-white/15 hover:text-white/80'
            }
            ${p.key === 'custom' ? 'flex items-center gap-1' : ''}
          `}
        >
          {p.key === 'custom' && <Calendar size={12} />}
          {p.label}
        </button>
      ))}

      {/* ── Campos de data personalizada ──────────── */}
      {showCustom && (
        <div className="flex items-center gap-1.5 animate-fade-in">
          <input
            type="date"
            value={customInicio}
            onChange={(e) => setCustomInicio(e.target.value)}
            className="px-2 py-1 rounded-lg text-xs bg-white/15 text-white border border-white/20 
                       focus:outline-none focus:border-white/40 [color-scheme:dark] w-[120px]"
          />
          <span className="text-white/40 text-xs">→</span>
          <input
            type="date"
            value={customFim}
            onChange={(e) => setCustomFim(e.target.value)}
            className="px-2 py-1 rounded-lg text-xs bg-white/15 text-white border border-white/20 
                       focus:outline-none focus:border-white/40 [color-scheme:dark] w-[120px]"
          />
          <button
            onClick={handleCustomApply}
            disabled={!customInicio || !customFim}
            className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-white/20 text-white border border-white/30
                       hover:bg-white/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Aplicar
          </button>
        </div>
      )}

      {/* ── Separador ─────────────────────────────── */}
      {colaboradorSelecionado && <span className="w-px h-5 bg-white/20 mx-0.5" />}

      {/* ── Badge de Atendente Selecionado ─────────── */}
      {colaboradorSelecionado && (
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-400/20 text-amber-100 border border-amber-400/30 text-xs font-semibold animate-fade-in">
          <User size={12} />
          <span className="max-w-[150px] truncate">{colaboradorSelecionado.nome}</span>
          <button
            onClick={onLimparColaborador}
            className="p-0.5 rounded hover:bg-white/20 transition-colors"
            title="Limpar filtro de atendente"
          >
            <X size={12} />
          </button>
        </div>
      )}

      {/* ── Limpar Todos ──────────────────────────── */}
      {hasActiveFilters && (
        <>
          <span className="w-px h-5 bg-white/20 mx-0.5" />
          <button
            onClick={handleClearAll}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold
                       text-white/50 hover:text-white/80 hover:bg-white/10 transition-all border border-transparent"
          >
            <X size={12} />
            Limpar filtros
          </button>
        </>
      )}
    </div>
  );
};