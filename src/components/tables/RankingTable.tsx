import { formatarTempo, formatarNumero } from '../../utils/formatters';
import type { RankingColaborador } from '../../hooks/useDashboardData';
import { EmptyState } from '../ui/EmptyState';
import { Trophy } from 'lucide-react';

interface RankingTableProps {
  colaboradores: RankingColaborador[];
  loading?: boolean;
}

export const RankingTable = ({ colaboradores, loading = false }: RankingTableProps) => {
  if (loading) {
    return (
      <div className="p-6 space-y-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
            <div className="skeleton w-8 h-8 rounded-full" />
            <div className="skeleton h-4 flex-1" />
            <div className="skeleton h-4 w-16" />
            <div className="skeleton h-4 w-12" />
          </div>
        ))}
      </div>
    );
  }

  if (!colaboradores || colaboradores.length === 0) {
    return (
      <EmptyState
        title="Nenhum colaborador encontrado"
        message="Os dados de ranking aparecerão aqui."
        icon={<Trophy className="text-ink-300" size={28} />}
      />
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-surface-300 overflow-hidden animate-fade-in-up">
      {/* Header */}
      <div className="px-6 py-5 border-b border-surface-200 bg-surface-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-50 rounded-lg">
            <Trophy className="text-brand-600" size={18} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-ink-900 font-display">
              Ranking de Colaboradores
            </h3>
            <p className="text-xs text-ink-400 mt-0.5">
              Top {colaboradores.length} — ordenado por Nota Final
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-sm">
          <thead>
            {/* Group headers */}
            <tr className="text-[10px] font-bold text-ink-300 uppercase tracking-widest bg-surface-50 border-b border-surface-200">
              <th colSpan={4} className="px-4 py-2 text-left border-r border-surface-200" />
              <th colSpan={4} className="px-4 py-2 text-center border-r border-surface-200 text-brand-400">
                Ligação
              </th>
              <th colSpan={3} className="px-4 py-2 text-center border-r border-surface-200 text-amber-500">
                WhatsApp
              </th>
              <th colSpan={4} className="px-4 py-2 text-center text-ink-400">
                Consolidado
              </th>
            </tr>

            {/* Column headers */}
            <tr className="text-[11px] font-semibold text-ink-400 uppercase tracking-wider bg-surface-50/50 border-b border-surface-200">
              <th className="px-4 py-3 text-left w-12">#</th>
              <th className="px-4 py-3 text-left">Colaborador</th>
              <th className="px-4 py-3 text-left">Equipe</th>
              <th className="px-4 py-3 text-left border-r border-surface-200">Turno</th>
              <th className="px-4 py-3 text-right">Atend.</th>
              <th className="px-4 py-3 text-right">Perdidas</th>
              <th className="px-4 py-3 text-right" title="Tempo Médio de Espera na fila">TME</th>
              <th className="px-4 py-3 text-right border-r border-surface-200" title="Tempo Médio de Atendimento">TMA</th>
              <th className="px-4 py-3 text-right">Atend.</th>
              <th className="px-4 py-3 text-right" title="Tempo Médio de Espera na fila">TME</th>
              <th className="px-4 py-3 text-right border-r border-surface-200" title="Tempo Médio de Atendimento">TMA</th>
              <th className="px-4 py-3 text-right">Nota Lig.</th>
              <th className="px-4 py-3 text-right">Nota Omni</th>
              <th className="px-4 py-3 text-right">Total</th>
              <th className="px-4 py-3 text-right">Nota Final</th>
            </tr>
          </thead>

          <tbody>
            {colaboradores.map((col, index) => (
              <tr
                key={col.colaboradorId}
                className={`
                  border-b border-surface-100 
                  hover:bg-brand-50/30 
                  transition-all duration-200
                  animate-fade-in-up
                  ${index < 3 ? 'bg-surface-50/50' : ''}
                `}
                style={{ animationDelay: `${index * 0.03}s` }}
              >
                {/* Position */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <PosicaoBadge posicao={col.posicao} />
                </td>

                {/* Name */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="font-semibold text-ink-900 max-w-[180px] truncate block">
                    {col.nome}
                  </span>
                </td>

                {/* Team */}
                <td className="px-4 py-4 whitespace-nowrap">
                  {col.equipe ? (
                    <span className="px-2.5 py-1 text-[11px] font-semibold bg-brand-50 text-brand-700 rounded-full border border-brand-100">
                      {col.equipe}
                    </span>
                  ) : <Dash />}
                </td>

                {/* Shift */}
                <td className="px-4 py-4 whitespace-nowrap text-ink-500 border-r border-surface-100">
                  {col.turno ?? <Dash />}
                </td>

                {/* — LIGAÇÃO — */}
                <td className="px-4 py-4 whitespace-nowrap text-right font-bold text-ink-900">
                  {col.ligacoesAtendidas > 0 ? formatarNumero(col.ligacoesAtendidas) : <Dash />}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right font-semibold text-brand-500">
                  {col.ligacoesPerdidas > 0 ? formatarNumero(col.ligacoesPerdidas) : <Dash />}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right text-ink-500">
                  {col.tmeLigacaoSegundos > 0 ? formatarTempo(col.tmeLigacaoSegundos) : <Dash />}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right text-ink-500 border-r border-surface-100">
                  {col.tmaLigacaoSegundos > 0 ? formatarTempo(col.tmaLigacaoSegundos) : <Dash />}
                </td>

                {/* — WHATSAPP — */}
                <td className="px-4 py-4 whitespace-nowrap text-right font-bold text-ink-900">
                  {col.atendimentosOmni > 0 ? formatarNumero(col.atendimentosOmni) : <Dash />}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right text-ink-500">
                  {col.tmeOmniSegundos > 0 ? formatarTempo(col.tmeOmniSegundos) : <Dash />}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right text-ink-500 border-r border-surface-100">
                  {col.tmaOmniSegundos > 0 ? formatarTempo(col.tmaOmniSegundos) : <Dash />}
                </td>

                {/* — NOTAS — */}
                <td className="px-4 py-4 whitespace-nowrap text-right">
                  <NotaBadge nota={col.notaLigacao} />
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right">
                  <NotaBadge nota={col.notaOmni} />
                </td>

                {/* — CONSOLIDADO — */}
                <td className="px-4 py-4 whitespace-nowrap text-right font-bold text-ink-900">
                  {formatarNumero(col.totalAtendimentos)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right">
                  <NotaBadge nota={col.notaFinal} bold />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="px-6 py-3 border-t border-surface-200 bg-surface-50/50 flex flex-wrap gap-x-6 gap-y-1 text-[11px] text-ink-300">
        <span><strong className="text-ink-500">TME</strong> = Tempo Médio de Espera na fila</span>
        <span><strong className="text-ink-500">TMA</strong> = Tempo Médio de Atendimento (conversa)</span>
      </div>
    </div>
  );
};

/* ─── Sub-components ──────────────────────────────────── */

const Dash = () => <span className="text-ink-200">—</span>;

const PosicaoBadge = ({ posicao }: { posicao: number }) => {
  if (posicao === 1) {
    return (
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 text-white flex items-center justify-center font-bold text-xs shadow-sm shadow-amber-300/40">
        1
      </div>
    );
  }
  if (posicao === 2) {
    return (
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 text-white flex items-center justify-center font-bold text-xs shadow-sm">
        2
      </div>
    );
  }
  if (posicao === 3) {
    return (
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-600 to-amber-700 text-white flex items-center justify-center font-bold text-xs shadow-sm">
        3
      </div>
    );
  }
  return (
    <div className="w-8 h-8 rounded-full bg-surface-100 text-ink-500 flex items-center justify-center font-semibold text-xs border border-surface-200">
      {posicao}
    </div>
  );
};

const NotaBadge = ({ nota, bold = false }: { nota: number | null; bold?: boolean }) => {
  if (nota === null || nota === undefined) {
    return <Dash />;
  }

  const config =
    nota >= 8
      ? { color: 'text-emerald-600', bg: bold ? 'bg-emerald-50 border-emerald-200' : '' }
      : nota >= 6
      ? { color: 'text-amber-600', bg: bold ? 'bg-amber-50 border-amber-200' : '' }
      : { color: 'text-brand-600', bg: bold ? 'bg-brand-50 border-brand-200' : '' };

  if (bold) {
    return (
      <span className={`inline-flex items-center justify-center min-w-[3rem] px-2 py-0.5 rounded-lg text-sm font-bold border ${config.color} ${config.bg}`}>
        {nota.toFixed(1)}
      </span>
    );
  }

  return (
    <span className={`font-semibold text-sm ${config.color}`}>
      {nota.toFixed(1)}
    </span>
  );
};
