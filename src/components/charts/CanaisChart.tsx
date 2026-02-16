interface AtendimentoPorCanal {
  canal: string;
  total: number;
}

interface CanaisChartProps {
  dados: AtendimentoPorCanal[];
}

export const CanaisChart = ({ dados }: CanaisChartProps) => {
  if (!dados || dados.length === 0) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 text-center text-slate-500">
        Nenhum dado disponível
      </div>
    );
  }

  const total = dados.reduce((acc, item) => acc + item.total, 0);

  // Cores para cada canal
  const cores = [
    'bg-blue-500',
    'bg-emerald-500',
    'bg-amber-500',
    'bg-purple-500',
    'bg-rose-500',
    'bg-cyan-500',
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-6">
        📊 Distribuição por Canal
      </h3>

      <div className="space-y-4">
        {dados.map((item, index) => {
          const percentual = (item.total / total) * 100;
          
          return (
            <div key={item.canal}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">
                  {item.canal}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-900">
                    {item.total.toLocaleString('pt-BR')}
                  </span>
                  <span className="text-xs text-slate-500">
                    ({percentual.toFixed(1)}%)
                  </span>
                </div>
              </div>
              
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full ${cores[index % cores.length]} transition-all duration-500 rounded-full`}
                  style={{ width: `${percentual}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-500">
            Total Geral
          </span>
          <span className="text-lg font-bold text-slate-900">
            {total.toLocaleString('pt-BR')}
          </span>
        </div>
      </div>
    </div>
  );
};