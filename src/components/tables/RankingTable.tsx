import { formatarTempo, formatarNumero } from '../../utils/formatters';
import type { RankingColaborador } from '../../hooks/useDashboardData';

interface RankingTableProps {
  colaboradores: RankingColaborador[];
}

export const RankingTable = ({ colaboradores }: RankingTableProps) => {
  if (!colaboradores || colaboradores.length === 0) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 text-center text-slate-500">
        Nenhum dado disponível
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <h3 className="text-lg font-semibold text-slate-900">
          🏆 Ranking de Colaboradores
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          Top {colaboradores.length} — ordenado por Nota Final
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">

            {/* Linha de grupos */}
            <tr className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <th colSpan={4} className="px-4 py-2 text-left border-r border-slate-200" />
              <th colSpan={4} className="px-4 py-2 text-center border-r border-slate-200 text-indigo-500">
                📞 Ligação
              </th>
              <th colSpan={4} className="px-4 py-2 text-center border-r border-slate-200 text-emerald-500">
                💬 WhatsApp
              </th>
              <th colSpan={2} className="px-4 py-2 text-center text-slate-500">
                Consolidado
              </th>
            </tr>

            {/* Linha de colunas */}
            <tr className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              {/* Identidade */}
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Colaborador</th>
              <th className="px-4 py-3 text-left">Equipe</th>
              <th className="px-4 py-3 text-left border-r border-slate-200">Turno</th>
              {/* Ligação */}
              <th className="px-4 py-3 text-right">Atend.</th>
              <th className="px-4 py-3 text-right">Perdidas</th>
              <th className="px-4 py-3 text-right" title="Tempo Médio de Espera na fila">TME</th>
              <th className="px-4 py-3 text-right border-r border-slate-200" title="Tempo Médio de Atendimento (conversa)">TMA</th>
              {/* WhatsApp */}
              <th className="px-4 py-3 text-right">Atend.</th>
              <th className="px-4 py-3 text-right" title="Tempo Médio de Espera na fila">TME</th>
              <th className="px-4 py-3 text-right border-r border-slate-200" title="Tempo Médio de Atendimento (conversa)">TMA</th>
              {/* Notas — coluna única por canal para economizar espaço */}
              <th className="px-4 py-3 text-right">Nota Lig.</th>
              {/* Consolidado */}
              <th className="px-4 py-3 text-right">Nota Omni</th>
              <th className="px-4 py-3 text-right">Total</th>
              <th className="px-4 py-3 text-right">Nota Final</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {colaboradores.map((col) => (
              <tr key={col.colaboradorId} className="hover:bg-slate-50 transition-colors">

                {/* Posição */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 text-slate-700 font-semibold text-xs">
                    {col.posicao}
                  </div>
                </td>

                {/* Nome */}
                <td className="px-4 py-4 whitespace-nowrap font-medium text-slate-900 max-w-[180px] truncate">
                  {col.nome}
                </td>

                {/* Equipe */}
                <td className="px-4 py-4 whitespace-nowrap">
                  {col.equipe ? (
                    <span className="px-2 py-0.5 text-xs font-medium bg-indigo-50 text-indigo-700 rounded-full">
                      {col.equipe}
                    </span>
                  ) : <span className="text-slate-300">—</span>}
                </td>

                {/* Turno */}
                <td className="px-4 py-4 whitespace-nowrap text-slate-500 border-r border-slate-100">
                  {col.turno ?? <span className="text-slate-300">—</span>}
                </td>

                {/* ── LIGAÇÃO ── */}
                <td className="px-4 py-4 whitespace-nowrap text-right font-semibold text-slate-900">
                  {col.ligacoesAtendidas > 0 ? formatarNumero(col.ligacoesAtendidas) : <span className="text-slate-300">—</span>}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right font-medium text-rose-500">
                  {col.ligacoesPerdidas > 0 ? formatarNumero(col.ligacoesPerdidas) : <span className="text-slate-300">—</span>}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right text-slate-500">
                  {col.tmeLigacaoSegundos > 0 ? formatarTempo(col.tmeLigacaoSegundos) : <span className="text-slate-300">—</span>}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right text-slate-600 border-r border-slate-100">
                  {col.tmaLigacaoSegundos > 0 ? formatarTempo(col.tmaLigacaoSegundos) : <span className="text-slate-300">—</span>}
                </td>

                {/* ── WHATSAPP ── */}
                <td className="px-4 py-4 whitespace-nowrap text-right font-semibold text-slate-900">
                  {col.atendimentosOmni > 0 ? formatarNumero(col.atendimentosOmni) : <span className="text-slate-300">—</span>}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right text-slate-500">
                  {col.tmeOmniSegundos > 0 ? formatarTempo(col.tmeOmniSegundos) : <span className="text-slate-300">—</span>}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right text-slate-600 border-r border-slate-100">
                  {col.tmaOmniSegundos > 0 ? formatarTempo(col.tmaOmniSegundos) : <span className="text-slate-300">—</span>}
                </td>

                {/* ── NOTAS ── */}
                <td className="px-4 py-4 whitespace-nowrap text-right">
                  <NotaBadge nota={col.notaLigacao} />
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right">
                  <NotaBadge nota={col.notaOmni} />
                </td>

                {/* ── CONSOLIDADO ── */}
                <td className="px-4 py-4 whitespace-nowrap text-right font-bold text-slate-900">
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

      {/* Legenda */}
      <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex gap-6 text-xs text-slate-400">
        <span><strong className="text-slate-500">TME</strong> = Tempo Médio de Espera na fila</span>
        <span><strong className="text-slate-500">TMA</strong> = Tempo Médio de Atendimento (duração da conversa)</span>
      </div>
    </div>
  );
};

const NotaBadge = ({ nota, bold = false }: { nota: number | null; bold?: boolean }) => {
  if (nota === null || nota === undefined) {
    return <span className="text-slate-300 text-sm">—</span>;
  }
  const cor =
    nota >= 8 ? 'text-emerald-600' :
    nota >= 6 ? 'text-amber-600' :
    'text-rose-600';

  return (
    <span className={`${cor} ${bold ? 'font-bold text-base' : 'font-semibold text-sm'}`}>
      {nota.toFixed(1)}
    </span>
  );
};