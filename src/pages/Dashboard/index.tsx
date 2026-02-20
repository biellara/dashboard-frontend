import { Link } from 'react-router-dom';
import {
  BarChart3,
  Phone,
  Clock,
  Smile,
  TrendingUp,
  Activity,
  Download,
  AlertCircle,
  CheckCircle2,
  RefreshCcw,
  Menu,
  Timer,
  MessageSquare,
  Database,
  CheckCheck,
  Users,
} from 'lucide-react';

import { StatCard } from '../../components/cards/StatCard';
import { RankingTable } from '../../components/tables/RankingTable';
import { CanaisChart } from '../../components/charts/CanaisChart';
import { useDashboardData } from '../../hooks/useDashboardData';
import {
  formatarTempo,
  formatarPercentual,
  formatarNumero,
  getCorSLA,
} from '../../utils/formatters';

export const Dashboard = () => {
  const { metricas, rankingColaboradores, loading, error, refetch } = useDashboardData();

  const renderStatusBadge = (percentual: number) => {
    if (percentual >= 95)
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
          <CheckCircle2 className="w-3 h-3 mr-1" /> Excelente
        </span>
      );
    if (percentual >= 85)
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
          <Activity className="w-3 h-3 mr-1" /> Bom
        </span>
      );
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
        <AlertCircle className="w-3 h-3 mr-1" /> Atenção
      </span>
    );
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 w-full">
        <div className="max-w-md w-full bg-white shadow-lg rounded-xl p-8 border border-slate-100 text-center mx-4">
          <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Falha ao carregar dados</h3>
          <p className="text-slate-500 mb-6">{error.message}</p>
          <button
            onClick={refetch}
            className="inline-flex items-center justify-center px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition duration-200"
          >
            <RefreshCcw size={16} className="mr-2" /> Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  // CSAT: média ponderada das notas disponíveis
  const notaMediaConsolidada =
    metricas ? (metricas.notaMediaLigacao + metricas.notaMediaOmni) / 2 : 0;

  // TMA consolidado: média das durações reais de conversa
  const tmaConsolidadoSegundos =
    metricas ? Math.round((metricas.tmaLigacaoSegundos + metricas.tmaOmniSegundos) / 2) : 0;

  // ── Voalle: totais agregados a partir do ranking ──────────────────
  const voalleTotais = rankingColaboradores.reduce(
    (acc, c) => ({
      clientes: acc.clientes + (c.voalleClientesAtendidos ?? 0),
      atendimentos: acc.atendimentos + (c.voalleAtendimentos ?? 0),
      finalizados: acc.finalizados + (c.voalleFinalizados ?? 0),
    }),
    { clientes: 0, atendimentos: 0, finalizados: 0 }
  );

  const voalleTaxaFinalizacao =
    voalleTotais.atendimentos > 0
      ? Math.round((voalleTotais.finalizados / voalleTotais.atendimentos) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12 w-full overflow-x-hidden">

      {/* Background Decorativo Superior */}
      <div className="absolute top-0 left-0 w-full h-64 bg-slate-900 z-0 shadow-xl" />

      {/* Container Principal */}
      <div className="relative z-10 w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">

        {/* ── Header ──────────────────────────────────────────────── */}
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-8 text-white gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Dashboard SAC</h1>
            <p className="text-slate-300 mt-2 flex items-center gap-2 text-sm sm:text-base">
              <Activity size={18} className="text-emerald-400" />
              Monitoramento em tempo real de KPIs e Performance
            </p>
          </div>
          <Link
            to="/upload"
            className="inline-flex items-center justify-center px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-all shadow-lg shadow-indigo-900/40 border border-indigo-400/20 w-full md:w-auto"
          >
            <Download size={18} className="mr-2" />
            Importar Dados
          </Link>
        </header>

        {/* ── 1. KPIs Principais ──────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mb-8">

          <StatCard
            title="Total de Atendimentos"
            value={loading ? '...' : formatarNumero(metricas?.totalAtendimentos ?? 0)}
            icon={<Phone className="text-indigo-600" size={24} />}
            subtitle={`${formatarNumero(metricas?.totalPerdidas ?? 0)} perdidas`}
            loading={loading}
          />

          <StatCard
            title="SLA Cumprido"
            value={loading ? '...' : formatarPercentual(metricas?.slaPercentual ?? 0)}
            icon={
              <Clock
                className={metricas ? getCorSLA(metricas.slaPercentual) : 'text-slate-400'}
                size={24}
              />
            }
            subtitle="Meta Operacional: ≥ 95%"
            valueColor={metricas ? getCorSLA(metricas.slaPercentual) : 'text-slate-900'}
            loading={loading}
          />

          <StatCard
            title="TME — Ligação"
            value={loading ? '...' : formatarTempo(metricas?.tmeLigacaoSegundos ?? 0)}
            icon={<Timer className="text-slate-600" size={24} />}
            subtitle={`TMA: ${formatarTempo(metricas?.tmaLigacaoSegundos ?? 0)} · Omni TME: ${formatarTempo(metricas?.tmeOmniSegundos ?? 0)}`}
            loading={loading}
          />

          <StatCard
            title="Nota Média (CSAT)"
            value={loading ? '...' : notaMediaConsolidada.toFixed(1)}
            icon={<Smile className="text-emerald-500" size={24} />}
            subtitle={`Lig: ${metricas?.notaMediaLigacao.toFixed(1) ?? '—'} · Solução: ${metricas?.notaMediaSolucaoOmni.toFixed(1) ?? '—'}`}
            valueColor={notaMediaConsolidada >= 8 ? 'text-emerald-600' : 'text-slate-900'}
            loading={loading}
          />
        </div>

        {/* ── 2. Métricas de Apoio ─────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

          {/* Taxa de Abandono */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition-all">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Taxa de Abandono</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-2">
                  {loading ? '...' : formatarPercentual(metricas?.taxaAbandono ?? 0)}
                </h3>
              </div>
              <div className="p-3 bg-rose-50 rounded-xl text-rose-500">
                <AlertCircle size={24} />
              </div>
            </div>
            <div className="mt-6">
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-rose-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(metricas?.taxaAbandono ?? 0, 100)}%` }}
                />
              </div>
              <p className="text-xs text-slate-400 mt-2 flex justify-between">
                <span>Perdidas: {formatarNumero(metricas?.totalPerdidas ?? 0)}</span>
                <span>Meta: &lt; 5%</span>
              </p>
            </div>
          </div>

          {/* TMA Consolidado */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition-all">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">TMA Consolidado</p>
                <p className="text-xs text-slate-400 mt-0.5">Duração média da conversa</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-2">
                  {loading ? '...' : formatarTempo(tmaConsolidadoSegundos)}
                </h3>
              </div>
              <div className="p-3 bg-violet-50 rounded-xl text-violet-600">
                <TrendingUp size={24} />
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-50 rounded-lg p-2 text-center">
                <span className="text-slate-400 block mb-0.5">Lig. TMA</span>
                <span className="font-semibold text-slate-700">{formatarTempo(metricas?.tmaLigacaoSegundos ?? 0)}</span>
              </div>
              <div className="bg-slate-50 rounded-lg p-2 text-center">
                <span className="text-slate-400 block mb-0.5">Omni TMA</span>
                <span className="font-semibold text-slate-700">{formatarTempo(metricas?.tmaOmniSegundos ?? 0)}</span>
              </div>
            </div>
          </div>

          {/* Nota de Solução Omni */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition-all">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Nota de Solução</p>
                <p className="text-xs text-slate-400 mt-0.5">WhatsApp — qualidade do que foi resolvido</p>
                <h3 className={`text-3xl font-bold mt-2 ${
                  (metricas?.notaMediaSolucaoOmni ?? 0) >= 8
                    ? 'text-emerald-600'
                    : (metricas?.notaMediaSolucaoOmni ?? 0) >= 6
                    ? 'text-amber-600'
                    : 'text-rose-600'
                }`}>
                  {loading ? '...' : (metricas?.notaMediaSolucaoOmni ?? 0).toFixed(1)}
                </h3>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                <MessageSquare size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-3 text-xs text-slate-500">
              <span>Atend.: <strong className="text-slate-700">{(metricas?.notaMediaOmni ?? 0).toFixed(1)}</strong></span>
              <span className="text-slate-200">|</span>
              <span>Solução: <strong className="text-slate-700">{(metricas?.notaMediaSolucaoOmni ?? 0).toFixed(1)}</strong></span>
            </div>
          </div>

          {/* Saúde da Operação */}
          <div className="bg-gradient-to-br from-indigo-600 to-slate-900 rounded-xl p-6 shadow-lg text-white flex flex-col justify-between hover:scale-[1.01] transform transition-all">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-indigo-200 text-sm font-medium uppercase tracking-wider">Saúde da Operação</p>
                <h3 className="text-3xl font-bold mt-2">
                  {loading
                    ? '...'
                    : metricas && metricas.slaPercentual >= 95
                    ? 'Excelente'
                    : metricas && metricas.slaPercentual >= 85
                    ? 'Estável'
                    : 'Atenção'}
                </h3>
              </div>
              <div className="p-3 bg-white/10 rounded-xl border border-white/10">
                <Activity size={24} />
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-indigo-500/30 flex items-center justify-between">
              <span className="text-indigo-200 text-sm font-medium">Meta SLA: 95%</span>
              {metricas && renderStatusBadge(metricas.slaPercentual)}
            </div>
          </div>
        </div>

        {/* ── 3. Voalle — Produtividade ISP ────────────────────────── */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Database size={18} className="text-slate-400" />
            <h2 className="text-base font-semibold text-slate-700 uppercase tracking-wider">
              Produtividade ISP — Voalle
            </h2>
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">

            {/* Clientes Atendidos */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex items-center justify-between hover:shadow-md transition-all">
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Clientes Atendidos</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-2">
                  {loading ? '...' : formatarNumero(voalleTotais.clientes)}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {formatarNumero(voalleTotais.atendimentos)} atendimentos registrados
                </p>
              </div>
              <div className="p-4 bg-sky-50 rounded-xl text-sky-600 flex-shrink-0">
                <Users size={28} />
              </div>
            </div>

            {/* Solicitações Finalizadas */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex items-center justify-between hover:shadow-md transition-all">
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Solicitações Finalizadas</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-2">
                  {loading ? '...' : formatarNumero(voalleTotais.finalizados)}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  de {formatarNumero(voalleTotais.atendimentos)} atendimentos
                </p>
              </div>
              <div className="p-4 bg-emerald-50 rounded-xl text-emerald-600 flex-shrink-0">
                <CheckCheck size={28} />
              </div>
            </div>

            {/* Taxa de Finalização */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Taxa de Finalização</p>
                  <h3 className={`text-3xl font-bold mt-2 ${
                    voalleTaxaFinalizacao >= 80
                      ? 'text-emerald-600'
                      : voalleTaxaFinalizacao >= 60
                      ? 'text-amber-600'
                      : 'text-rose-600'
                  }`}>
                    {loading ? '...' : `${voalleTaxaFinalizacao}%`}
                  </h3>
                </div>
                <div className={`p-4 rounded-xl flex-shrink-0 ${
                  voalleTaxaFinalizacao >= 80
                    ? 'bg-emerald-50 text-emerald-600'
                    : voalleTaxaFinalizacao >= 60
                    ? 'bg-amber-50 text-amber-600'
                    : 'bg-rose-50 text-rose-600'
                }`}>
                  <TrendingUp size={28} />
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all duration-1000 ${
                      voalleTaxaFinalizacao >= 80
                        ? 'bg-emerald-500'
                        : voalleTaxaFinalizacao >= 60
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${Math.min(voalleTaxaFinalizacao, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1.5 text-right">Meta: ≥ 80%</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── 4. Gráfico + Resumo Executivo ────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">

          <div className="xl:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="text-slate-400" size={20} />
                Volume por Canal
              </h3>
            </div>
            <div className="flex-1 w-full min-h-[350px]">
              <CanaisChart dados={metricas?.atendimentosPorCanal ?? []} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Activity className="text-slate-400" size={20} />
              Resumo Executivo
            </h3>

            <div className="flex flex-col space-y-5">

              {/* SLA */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-slate-600">SLA Global</span>
                  <span className={`text-base font-bold ${metricas ? getCorSLA(metricas.slaPercentual) : 'text-slate-900'}`}>
                    {formatarPercentual(metricas?.slaPercentual ?? 0)}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-1000 ${
                      metricas && metricas.slaPercentual >= 95 ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${Math.min(metricas?.slaPercentual ?? 0, 100)}%` }}
                  />
                </div>
              </div>

              {/* CSAT */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-slate-600">Nota Média CSAT</span>
                  <span className="text-base font-bold text-emerald-600">
                    {notaMediaConsolidada.toFixed(1)} / 10
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3">
                  <div
                    className="h-3 rounded-full bg-emerald-500 transition-all duration-1000"
                    style={{ width: `${(notaMediaConsolidada / 10) * 100}%` }}
                  />
                </div>
              </div>

              {/* Taxa de Finalização Voalle */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-slate-600">Finalização ISP</span>
                  <span className={`text-base font-bold ${
                    voalleTaxaFinalizacao >= 80 ? 'text-emerald-600'
                    : voalleTaxaFinalizacao >= 60 ? 'text-amber-600'
                    : 'text-rose-600'
                  }`}>
                    {voalleTaxaFinalizacao}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-1000 ${
                      voalleTaxaFinalizacao >= 80 ? 'bg-emerald-500'
                      : voalleTaxaFinalizacao >= 60 ? 'bg-amber-500'
                      : 'bg-rose-500'
                    }`}
                    style={{ width: `${Math.min(voalleTaxaFinalizacao, 100)}%` }}
                  />
                </div>
              </div>

              {/* Grid de métricas rápidas */}
              <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-lg text-center">
                  <span className="text-xs text-slate-500 uppercase block mb-1">Volume</span>
                  <span className="font-bold text-slate-900">
                    {formatarNumero(metricas?.totalAtendimentos ?? 0)}
                  </span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg text-center">
                  <span className="text-xs text-slate-500 uppercase block mb-1">TME Lig.</span>
                  <span className="font-bold text-slate-900">
                    {formatarTempo(metricas?.tmeLigacaoSegundos ?? 0)}
                  </span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg text-center">
                  <span className="text-xs text-slate-500 uppercase block mb-1">TMA Lig.</span>
                  <span className="font-bold text-slate-900">
                    {formatarTempo(metricas?.tmaLigacaoSegundos ?? 0)}
                  </span>
                </div>
                <div className="bg-sky-50 p-3 rounded-lg text-center">
                  <span className="text-xs text-sky-500 uppercase block mb-1">ISP Clientes</span>
                  <span className="font-bold text-sky-700">
                    {formatarNumero(voalleTotais.clientes)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── 5. Ranking ───────────────────────────────────────────── */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
          <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Menu size={20} className="text-slate-400" /> Performance por Colaborador
            </h3>
            <span className="text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-4 py-1.5 rounded-full shadow-sm">
              🏆 Top Performers
            </span>
          </div>
          <div className="overflow-x-auto">
            <div className="min-w-full inline-block align-middle">
              <RankingTable colaboradores={rankingColaboradores} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};