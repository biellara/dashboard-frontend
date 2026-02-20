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
  Timer,
  MessageSquare,
  Database,
  CheckCheck,
  Users,
  Menu,
} from 'lucide-react';

import { StatCard } from '../../components/cards/StatCard';
import { RankingTable } from '../../components/tables/RankingTable';
import { CanaisChart } from '../../components/charts/CanaisChart';
import { ErrorState } from '../../components/ui/ErrorState';
import { PageLoader } from '../../components/ui/PageLoader';
import { useDashboardData } from '../../hooks/useDashboardData';
import {
  formatarTempo,
  formatarPercentual,
  formatarNumero,
  getCorSLA,
} from '../../utils/formatters';

export const Dashboard = () => {
  const { metricas, rankingColaboradores, loading, error, refetch } = useDashboardData();

  /* ── Loading state ───────────────────────────────────── */
  if (loading && !metricas) {
    return <PageLoader />;
  }

  /* ── Error state ─────────────────────────────────────── */
  if (error) {
    return (
      <ErrorState
        fullScreen
        type="connection"
        title="Falha ao carregar dados"
        message={error.message || 'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.'}
        onRetry={refetch}
      />
    );
  }

  /* ── Derived data ────────────────────────────────────── */
  const notaMediaConsolidada =
    metricas ? (metricas.notaMediaLigacao + metricas.notaMediaOmni) / 2 : 0;

  const tmaConsolidadoSegundos =
    metricas ? Math.round((metricas.tmaLigacaoSegundos + metricas.tmaOmniSegundos) / 2) : 0;

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

  const renderStatusBadge = (percentual: number) => {
    if (percentual >= 95)
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3 h-3 mr-1" /> Excelente
        </span>
      );
    if (percentual >= 85)
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">
          <Activity className="w-3 h-3 mr-1" /> Bom
        </span>
      );
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200">
        <AlertCircle className="w-3 h-3 mr-1" /> Atenção
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-surface-100 pb-16 w-full overflow-x-hidden">

      {/* ── Background decorativo ─────────────────────────── */}
      <div className="absolute top-0 left-0 w-full h-72 bg-gradient-to-br from-brand-800 via-brand-700 to-brand-900 z-0 overflow-hidden">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-[0.07]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }} />
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -left-10 bottom-0 w-60 h-60 bg-brand-600/30 rounded-full blur-3xl" />
      </div>

      {/* ── Container principal ────────────────────────────── */}
      <div className="relative z-10 w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* ── Header ────────────────────────────────────────── */}
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-10 text-white gap-4 animate-fade-in-up">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-2 h-8 bg-white/80 rounded-full" />
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight font-display">
                Dashboard SAC
              </h1>
            </div>
            <p className="text-brand-200 mt-2 flex items-center gap-2 text-sm sm:text-base ml-5">
              <Activity size={16} className="text-emerald-400 animate-pulse" />
              Monitoramento em tempo real de KPIs e Performance
            </p>
          </div>

          <Link
            to="/upload"
            className="
              inline-flex items-center justify-center gap-2 
              px-5 py-3 
              bg-white text-brand-700 font-semibold rounded-xl 
              hover:bg-surface-100 active:scale-[0.97]
              transition-all duration-200
              shadow-lg shadow-black/10
              w-full md:w-auto
              animate-fade-in-up stagger-2
            "
          >
            <Download size={18} />
            Importar Dados
          </Link>
        </header>

        {/* ═══════════════════════════════════════════════════
            1. KPIs PRINCIPAIS
           ═══════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mb-8">
          <StatCard
            title="Total de Atendimentos"
            value={formatarNumero(metricas?.totalAtendimentos ?? 0)}
            icon={<Phone className="text-brand-600" size={22} />}
            subtitle={`${formatarNumero(metricas?.totalPerdidas ?? 0)} perdidas`}
            loading={loading}
            delay={0.05}
          />
          <StatCard
            title="SLA Cumprido"
            value={formatarPercentual(metricas?.slaPercentual ?? 0)}
            icon={
              <Clock
                className={metricas ? getCorSLA(metricas.slaPercentual) : 'text-ink-300'}
                size={22}
              />
            }
            subtitle="Meta Operacional: ≥ 95%"
            valueColor={metricas ? getCorSLA(metricas.slaPercentual) : 'text-ink-900'}
            loading={loading}
            delay={0.1}
          />
          <StatCard
            title="TME — Ligação"
            value={formatarTempo(metricas?.tmeLigacaoSegundos ?? 0)}
            icon={<Timer className="text-ink-500" size={22} />}
            subtitle={`TMA: ${formatarTempo(metricas?.tmaLigacaoSegundos ?? 0)} · Omni TME: ${formatarTempo(metricas?.tmeOmniSegundos ?? 0)}`}
            loading={loading}
            delay={0.15}
          />
          <StatCard
            title="Nota Média (CSAT)"
            value={notaMediaConsolidada.toFixed(1)}
            icon={<Smile className="text-emerald-500" size={22} />}
            subtitle={`Lig: ${metricas?.notaMediaLigacao.toFixed(1) ?? '—'} · Solução: ${metricas?.notaMediaSolucaoOmni.toFixed(1) ?? '—'}`}
            valueColor={notaMediaConsolidada >= 8 ? 'text-emerald-600' : 'text-ink-900'}
            loading={loading}
            delay={0.2}
          />
        </div>

        {/* ═══════════════════════════════════════════════════
            2. MÉTRICAS DE APOIO
           ═══════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mb-8">

          {/* Taxa de Abandono */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-surface-300 flex flex-col justify-between hover-lift animate-fade-in-up stagger-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-ink-400 uppercase tracking-wider">Taxa de Abandono</p>
                <h3 className="text-3xl font-bold text-ink-900 mt-2 font-display">
                  {formatarPercentual(metricas?.taxaAbandono ?? 0)}
                </h3>
              </div>
              <div className="p-3 bg-brand-50 rounded-xl text-brand-500 border border-brand-100">
                <AlertCircle size={22} />
              </div>
            </div>
            <div className="mt-5">
              <div className="w-full bg-surface-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-brand-500 h-2.5 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${Math.min(metricas?.taxaAbandono ?? 0, 100)}%` }}
                />
              </div>
              <p className="text-[11px] text-ink-300 mt-2 flex justify-between">
                <span>Perdidas: {formatarNumero(metricas?.totalPerdidas ?? 0)}</span>
                <span>Meta: &lt; 5%</span>
              </p>
            </div>
          </div>

          {/* TMA Consolidado */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-surface-300 flex flex-col justify-between hover-lift animate-fade-in-up stagger-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-ink-400 uppercase tracking-wider">TMA Consolidado</p>
                <p className="text-[11px] text-ink-300 mt-0.5">Duração média da conversa</p>
                <h3 className="text-3xl font-bold text-ink-900 mt-2 font-display">
                  {formatarTempo(tmaConsolidadoSegundos)}
                </h3>
              </div>
              <div className="p-3 bg-violet-50 rounded-xl text-violet-600 border border-violet-100">
                <TrendingUp size={22} />
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <div className="bg-surface-100 rounded-lg p-2.5 text-center border border-surface-200">
                <span className="text-ink-300 block mb-0.5 text-[10px] font-semibold uppercase">Lig. TMA</span>
                <span className="font-bold text-ink-700">{formatarTempo(metricas?.tmaLigacaoSegundos ?? 0)}</span>
              </div>
              <div className="bg-surface-100 rounded-lg p-2.5 text-center border border-surface-200">
                <span className="text-ink-300 block mb-0.5 text-[10px] font-semibold uppercase">Omni TMA</span>
                <span className="font-bold text-ink-700">{formatarTempo(metricas?.tmaOmniSegundos ?? 0)}</span>
              </div>
            </div>
          </div>

          {/* Nota de Solução Omni */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-surface-300 flex flex-col justify-between hover-lift animate-fade-in-up stagger-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-ink-400 uppercase tracking-wider">Nota de Solução</p>
                <p className="text-[11px] text-ink-300 mt-0.5">WhatsApp — qualidade do que foi resolvido</p>
                <h3 className={`text-3xl font-bold mt-2 font-display ${
                  (metricas?.notaMediaSolucaoOmni ?? 0) >= 8
                    ? 'text-emerald-600'
                    : (metricas?.notaMediaSolucaoOmni ?? 0) >= 6
                    ? 'text-amber-600'
                    : 'text-brand-600'
                }`}>
                  {(metricas?.notaMediaSolucaoOmni ?? 0).toFixed(1)}
                </h3>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 border border-emerald-100">
                <MessageSquare size={22} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-3 text-xs text-ink-400">
              <span>Atend.: <strong className="text-ink-700">{(metricas?.notaMediaOmni ?? 0).toFixed(1)}</strong></span>
              <span className="text-ink-200">|</span>
              <span>Solução: <strong className="text-ink-700">{(metricas?.notaMediaSolucaoOmni ?? 0).toFixed(1)}</strong></span>
            </div>
          </div>

          {/* Saúde da Operação */}
          <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-2xl p-6 shadow-lg text-white flex flex-col justify-between hover-lift animate-fade-in-up stagger-6 relative overflow-hidden">
            {/* Decorative circle */}
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full" />
            <div className="absolute -right-2 -bottom-8 w-20 h-20 bg-white/5 rounded-full" />
            
            <div className="relative z-10">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-brand-200 text-xs font-semibold uppercase tracking-wider">Saúde da Operação</p>
                  <h3 className="text-3xl font-bold mt-2 font-display">
                    {metricas && metricas.slaPercentual >= 95
                      ? 'Excelente'
                      : metricas && metricas.slaPercentual >= 85
                      ? 'Estável'
                      : 'Atenção'}
                  </h3>
                </div>
                <div className="p-3 bg-white/10 rounded-xl border border-white/10">
                  <Activity size={22} />
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-white/15 flex items-center justify-between">
                <span className="text-brand-200 text-sm font-medium">Meta SLA: 95%</span>
                {metricas && renderStatusBadge(metricas.slaPercentual)}
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════
            3. VOALLE — Produtividade ISP
           ═══════════════════════════════════════════════════ */}
        <div className="mb-8 animate-fade-in-up stagger-7">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-1.5 bg-surface-200 rounded-lg">
              <Database size={16} className="text-ink-400" />
            </div>
            <h2 className="text-sm font-bold text-ink-500 uppercase tracking-widest font-display">
              Produtividade ISP — Voalle
            </h2>
            <span className="h-px flex-1 bg-surface-300" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            {/* Clientes Atendidos */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-surface-300 flex items-center justify-between hover-lift">
              <div>
                <p className="text-xs font-semibold text-ink-400 uppercase tracking-wider">Clientes Atendidos</p>
                <h3 className="text-3xl font-bold text-ink-900 mt-2 font-display">
                  {formatarNumero(voalleTotais.clientes)}
                </h3>
                <p className="text-[11px] text-ink-300 mt-1">
                  {formatarNumero(voalleTotais.atendimentos)} atendimentos registrados
                </p>
              </div>
              <div className="p-4 bg-sky-50 rounded-xl text-sky-600 flex-shrink-0 border border-sky-100">
                <Users size={26} />
              </div>
            </div>

            {/* Solicitações Finalizadas */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-surface-300 flex items-center justify-between hover-lift">
              <div>
                <p className="text-xs font-semibold text-ink-400 uppercase tracking-wider">Solicitações Finalizadas</p>
                <h3 className="text-3xl font-bold text-ink-900 mt-2 font-display">
                  {formatarNumero(voalleTotais.finalizados)}
                </h3>
                <p className="text-[11px] text-ink-300 mt-1">
                  de {formatarNumero(voalleTotais.atendimentos)} atendimentos
                </p>
              </div>
              <div className="p-4 bg-emerald-50 rounded-xl text-emerald-600 flex-shrink-0 border border-emerald-100">
                <CheckCheck size={26} />
              </div>
            </div>

            {/* Taxa de Finalização */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-surface-300 flex flex-col justify-between hover-lift">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-ink-400 uppercase tracking-wider">Taxa de Finalização</p>
                  <h3 className={`text-3xl font-bold mt-2 font-display ${
                    voalleTaxaFinalizacao >= 80
                      ? 'text-emerald-600'
                      : voalleTaxaFinalizacao >= 60
                      ? 'text-amber-600'
                      : 'text-brand-600'
                  }`}>
                    {voalleTaxaFinalizacao}%
                  </h3>
                </div>
                <div className={`p-4 rounded-xl flex-shrink-0 border ${
                  voalleTaxaFinalizacao >= 80
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                    : voalleTaxaFinalizacao >= 60
                    ? 'bg-amber-50 text-amber-600 border-amber-100'
                    : 'bg-brand-50 text-brand-600 border-brand-100'
                }`}>
                  <TrendingUp size={26} />
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full bg-surface-200 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-1000 ease-out ${
                      voalleTaxaFinalizacao >= 80
                        ? 'bg-emerald-500'
                        : voalleTaxaFinalizacao >= 60
                        ? 'bg-amber-500'
                        : 'bg-brand-500'
                    }`}
                    style={{ width: `${Math.min(voalleTaxaFinalizacao, 100)}%` }}
                  />
                </div>
                <p className="text-[11px] text-ink-300 mt-1.5 text-right">Meta: ≥ 80%</p>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════
            4. GRÁFICO + RESUMO EXECUTIVO
           ═══════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">

          {/* Chart */}
          <div className="xl:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-surface-300 flex flex-col animate-fade-in-up stagger-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-brand-50 rounded-lg border border-brand-100">
                <BarChart3 className="text-brand-600" size={18} />
              </div>
              <h3 className="text-lg font-bold text-ink-900 font-display">
                Volume por Canal
              </h3>
            </div>
            <div className="flex-1 w-full min-h-[350px]">
              <CanaisChart dados={metricas?.atendimentosPorCanal ?? []} loading={loading} />
            </div>
          </div>

          {/* Resumo Executivo */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-surface-300 animate-fade-in-up stagger-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-surface-200 rounded-lg">
                <Activity className="text-ink-500" size={18} />
              </div>
              <h3 className="text-lg font-bold text-ink-900 font-display">
                Resumo Executivo
              </h3>
            </div>

            <div className="flex flex-col space-y-5">
              {/* SLA */}
              <ProgressMetric
                label="SLA Global"
                value={formatarPercentual(metricas?.slaPercentual ?? 0)}
                valueColor={metricas ? getCorSLA(metricas.slaPercentual) : 'text-ink-900'}
                progress={Math.min(metricas?.slaPercentual ?? 0, 100)}
                barColor={metricas && metricas.slaPercentual >= 95 ? 'bg-emerald-500' : 'bg-brand-500'}
              />

              {/* CSAT */}
              <ProgressMetric
                label="Nota Média CSAT"
                value={`${notaMediaConsolidada.toFixed(1)} / 10`}
                valueColor="text-emerald-600"
                progress={(notaMediaConsolidada / 10) * 100}
                barColor="bg-emerald-500"
              />

              {/* Voalle */}
              <ProgressMetric
                label="Finalização ISP"
                value={`${voalleTaxaFinalizacao}%`}
                valueColor={
                  voalleTaxaFinalizacao >= 80 ? 'text-emerald-600'
                  : voalleTaxaFinalizacao >= 60 ? 'text-amber-600'
                  : 'text-brand-600'
                }
                progress={Math.min(voalleTaxaFinalizacao, 100)}
                barColor={
                  voalleTaxaFinalizacao >= 80 ? 'bg-emerald-500'
                  : voalleTaxaFinalizacao >= 60 ? 'bg-amber-500'
                  : 'bg-brand-500'
                }
              />

              {/* Quick metrics grid */}
              <div className="pt-4 border-t border-surface-200 grid grid-cols-2 gap-3">
                <QuickStat label="Volume" value={formatarNumero(metricas?.totalAtendimentos ?? 0)} />
                <QuickStat label="TME Lig." value={formatarTempo(metricas?.tmeLigacaoSegundos ?? 0)} />
                <QuickStat label="TMA Lig." value={formatarTempo(metricas?.tmaLigacaoSegundos ?? 0)} />
                <QuickStat label="ISP Clientes" value={formatarNumero(voalleTotais.clientes)} accent />
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════
            5. RANKING
           ═══════════════════════════════════════════════════ */}
        <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center gap-3 mb-5">
            <div className="p-1.5 bg-surface-200 rounded-lg">
              <Menu size={16} className="text-ink-400" />
            </div>
            <h2 className="text-sm font-bold text-ink-500 uppercase tracking-widest font-display">
              Performance por Colaborador
            </h2>
            <span className="h-px flex-1 bg-surface-300" />
            <span className="text-[11px] font-bold text-brand-600 bg-brand-50 border border-brand-100 px-3 py-1 rounded-full">
              Top Performers
            </span>
          </div>
          <RankingTable colaboradores={rankingColaboradores} loading={loading} />
        </div>

      </div>
    </div>
  );
};

/* ─── Sub-components ──────────────────────────────────── */

const ProgressMetric = ({
  label, value, valueColor, progress, barColor
}: {
  label: string; value: string; valueColor: string; progress: number; barColor: string;
}) => (
  <div>
    <div className="flex justify-between items-center mb-2">
      <span className="text-sm font-semibold text-ink-500">{label}</span>
      <span className={`text-base font-bold ${valueColor}`}>{value}</span>
    </div>
    <div className="w-full bg-surface-200 rounded-full h-3 overflow-hidden">
      <div
        className={`h-3 rounded-full transition-all duration-1000 ease-out ${barColor}`}
        style={{ width: `${progress}%` }}
      />
    </div>
  </div>
);

const QuickStat = ({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) => (
  <div className={`p-3 rounded-xl text-center border ${
    accent
      ? 'bg-brand-50 border-brand-100'
      : 'bg-surface-100 border-surface-200'
  }`}>
    <span className={`text-[10px] font-bold uppercase block mb-1 ${accent ? 'text-brand-400' : 'text-ink-300'}`}>
      {label}
    </span>
    <span className={`font-bold text-sm ${accent ? 'text-brand-700' : 'text-ink-900'}`}>
      {value}
    </span>
  </div>
);
