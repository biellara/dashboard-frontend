import { Clock, Phone, MessageSquare, Database } from 'lucide-react';
import type { UltimaAtualizacao } from '../../hooks/useDashboardData';

interface Props {
  dados: UltimaAtualizacao | null;
}

const formatarTempoRelativo = (isoString: string | null): string => {
  if (!isoString) return 'Sem dados';

  const data = new Date(isoString);
  const agora = new Date();
  const diffMs = agora.getTime() - data.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHoras = Math.floor(diffMin / 60);
  const diffDias = Math.floor(diffHoras / 24);

  if (diffMin < 1) return 'Agora';
  if (diffMin < 60) return `${diffMin}min atrás`;
  if (diffHoras < 24) return `${diffHoras}h atrás`;
  if (diffDias === 1) return 'Ontem';
  if (diffDias < 7) return `${diffDias}d atrás`;

  return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
};

const formatarDataCompleta = (isoString: string | null): string => {
  if (!isoString) return 'Nenhum dado importado';
  const data = new Date(isoString);
  return data.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getCorFreshness = (isoString: string | null): string => {
  if (!isoString) return 'text-ink-300';
  const diffHoras = (Date.now() - new Date(isoString).getTime()) / 3600000;
  if (diffHoras < 2) return 'text-emerald-500';
  if (diffHoras < 12) return 'text-amber-500';
  return 'text-red-400';
};

export const UltimaAtualizacaoBadge = ({ dados }: Props) => {
  if (!dados) return null;

  const fontes = [
    { key: 'omni', label: 'Omni', icon: MessageSquare, valor: dados.omni },
    { key: 'ligacao', label: 'Ligação', icon: Phone, valor: dados.ligacao },
    { key: 'voalle', label: 'Voalle', icon: Database, valor: dados.voalle },
  ] as const;

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="flex items-center gap-1 text-white/40">
        <Clock size={11} />
        <span className="text-[10px] font-semibold uppercase tracking-wider">Atualizado:</span>
      </div>
      {fontes.map(f => (
        <div
          key={f.key}
          className="flex items-center gap-1.5 group relative"
          title={`${f.label}: ${formatarDataCompleta(f.valor)}`}
        >
          <f.icon size={11} className="text-white/40" />
          <span className={`text-[10px] font-bold ${getCorFreshness(f.valor)}`}>
            {formatarTempoRelativo(f.valor)}
          </span>
          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 
                          bg-ink-900 text-white text-[10px] rounded-lg shadow-lg 
                          opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity
                          whitespace-nowrap z-50">
            <strong>{f.label}:</strong> {formatarDataCompleta(f.valor)}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 
                            border-4 border-transparent border-t-ink-900" />
          </div>
        </div>
      ))}
    </div>
  );
};