import { formatarTempo, formatarPercentual, formatarNumero } from '../../utils/formatters';

interface RankingColaborador {
  nome: string;
  equipe: string;
  totalAtendimentos: number;
  tempoMedioSegundos: number;
  taxaSatisfacao: number;
}

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
          Top {colaboradores.length} por volume de atendimentos
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Colaborador
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Equipe
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                Atendimentos
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                TMA
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                Satisfação
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {colaboradores.map((colaborador, index) => (
              <tr 
                key={index} 
                className="hover:bg-slate-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-semibold text-sm">
                    {index + 1}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-slate-900">
                    {colaborador.nome}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium bg-indigo-50 text-indigo-700 rounded-full">
                    {colaborador.equipe}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right font-semibold text-slate-900">
                  {formatarNumero(colaborador.totalAtendimentos)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-slate-600">
                  {formatarTempo(colaborador.tempoMedioSegundos)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <span className={`font-semibold ${
                    colaborador.taxaSatisfacao >= 90 
                      ? 'text-emerald-600' 
                      : colaborador.taxaSatisfacao >= 80 
                        ? 'text-amber-600' 
                        : 'text-rose-600'
                  }`}>
                    {formatarPercentual(colaborador.taxaSatisfacao)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};