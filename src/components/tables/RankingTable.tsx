import { formatarTempo, formatarNumero } from '../../utils/formatters';
import { RankingColaborador } from '../../hooks/useDashboardData';

interface RankingTableProps {
  colaboradores: RankingColaborador[];
  loading?: boolean;
}

const TURNO_BADGE: Record<string, string> = {
  'Madrugada': 'bg-violet-100 text-violet-700',
  'Manhã':    'bg-amber-100 text-amber-700',
  'Tarde':    'bg-sky-100 text-sky-700',
  'Noite':    'bg-slate-100 text-slate-700',
};

const NotaCell = ({ valor }: { valor: number | null }) => {
  if (valor === null || valor === undefined) {
    return <span className="text-slate-300 text-xs">—</span>;
  }
  const cor =
    valor >= 4.5 ? 'text-emerald-600' :
    valor >= 3.5 ? 'text-amber-600' :
    'text-rose-600';
  return <span className={`font-semibold ${cor}`}>{valor.toFixed(2)}</span>;
};

const PosicaoBadge = ({ posicao }: { posicao: number }) => {
  if (posicao === 1) return (
    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-400 text-white font-bold text-sm shadow">
      🥇
    </div>
  );
  if (posicao === 2) return (
    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-300 text-white font-bold text-sm shadow">
      🥈
    </div>
  );
  if (posicao === 3) return (
    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-400 text-white font-bold text-sm shadow">
      🥉
    </div>
  );
  return (
    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-semibold text-sm">
      {posicao}
    </div>
  );
};

export const RankingTable = ({ colaboradores, loading }: RankingTableProps) => {
  if (loading) {
    return (
      <div className="p-8 text-center text-slate-400 animate-pulse">
        Carregando ranking...
      </div>
    );
  }

  if (!colaboradores || colaboradores.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500">
        Nenhum dado disponível
      </div>
    );
  }

  return (
    <table className="w-full text-sm">
      <thead className="bg-slate-50 border-b border-slate-200">
        <tr>
          <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-10">#</th>
          <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Colaborador</th>
          <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Turno</th>

          {/* Ligação */}
          <th className="px-4 py-3 text-center text-xs font-semibold text-indigo-500 uppercase tracking-wider border-l border-indigo-100" colSpan={3}>
            📞 Ligação
          </th>

          {/* Omni */}
          <th className="px-4 py-3 text-center text-xs font-semibold text-emerald-500 uppercase tracking-wider border-l border-emerald-100" colSpan={3}>
            💬 Omnichannel
          </th>

          {/* Consolidado */}
          <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider border-l border-slate-200" colSpan={2}>
            Consolidado
          </th>
        </tr>
        <tr className="bg-slate-50/80 border-b border-slate-100">
          <th colSpan={3} />
          {/* Ligação sub-headers */}
          <th className="px-4 py-2 text-center text-xs text-slate-400 border-l border-indigo-100">Atendidas</th>
          <th className="px-4 py-2 text-center text-xs text-slate-400">Perdidas</th>
          <th className="px-4 py-2 text-center text-xs text-slate-400">Nota</th>
          {/* Omni sub-headers */}
          <th className="px-4 py-2 text-center text-xs text-slate-400 border-l border-emerald-100">Atendimentos</th>
          <th className="px-4 py-2 text-center text-xs text-slate-400">TME</th>
          <th className="px-4 py-2 text-center text-xs text-slate-400">Nota</th>
          {/* Consolidado sub-headers */}
          <th className="px-4 py-2 text-center text-xs text-slate-400 border-l border-slate-200">Total</th>
          <th className="px-4 py-2 text-center text-xs text-slate-700 font-semibold">Nota Final</th>
        </tr>
      </thead>

      <tbody className="divide-y divide-slate-100">
        {colaboradores.map((c) => (
          <tr key={c.colaboradorId} className="hover:bg-slate-50 transition-colors">
            {/* Posição */}
            <td className="px-4 py-3">
              <PosicaoBadge posicao={c.posicao} />
            </td>

            {/* Nome */}
            <td className="px-4 py-3">
              <div className="font-medium text-slate-900 whitespace-nowrap">{c.nome}</div>
              {c.equipe && (
                <div className="text-xs text-slate-400">{c.equipe}</div>
              )}
            </td>

            {/* Turno */}
            <td className="px-4 py-3">
              {c.turno ? (
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${TURNO_BADGE[c.turno] ?? 'bg-slate-100 text-slate-600'}`}>
                  {c.turno}
                </span>
              ) : (
                <span className="text-slate-300 text-xs">—</span>
              )}
            </td>

            {/* Ligação */}
            <td className="px-4 py-3 text-center border-l border-indigo-50">
              <span className="font-semibold text-slate-900">{formatarNumero(c.ligacoesAtendidas)}</span>
            </td>
            <td className="px-4 py-3 text-center">
              <span className={c.ligacoesPerdidas > 0 ? 'text-rose-500 font-medium' : 'text-slate-400'}>
                {formatarNumero(c.ligacoesPerdidas)}
              </span>
            </td>
            <td className="px-4 py-3 text-center">
              <NotaCell valor={c.notaLigacao} />
            </td>

            {/* Omni */}
            <td className="px-4 py-3 text-center border-l border-emerald-50">
              <span className="font-semibold text-slate-900">{formatarNumero(c.atendimentosOmni)}</span>
            </td>
            <td className="px-4 py-3 text-center text-slate-600">
              {c.tmeOmniSegundos > 0 ? formatarTempo(c.tmeOmniSegundos) : <span className="text-slate-300 text-xs">—</span>}
            </td>
            <td className="px-4 py-3 text-center">
              <NotaCell valor={c.notaOmni} />
            </td>

            {/* Consolidado */}
            <td className="px-4 py-3 text-center border-l border-slate-100">
              <span className="font-semibold text-slate-900">{formatarNumero(c.totalAtendimentos)}</span>
            </td>
            <td className="px-4 py-3 text-center">
              {c.notaFinal !== null ? (
                <span className={`
                  inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-bold
                  ${c.notaFinal >= 4.5 ? 'bg-emerald-100 text-emerald-700' :
                    c.notaFinal >= 3.5 ? 'bg-amber-100 text-amber-700' :
                    'bg-rose-100 text-rose-700'}
                `}>
                  {c.notaFinal.toFixed(2)}
                </span>
              ) : (
                <span className="text-slate-300 text-xs">Sem avaliação</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};