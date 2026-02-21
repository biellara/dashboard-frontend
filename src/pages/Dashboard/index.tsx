import { useState } from 'react';
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
  Menu,
} from 'lucide-react';

import { StatCard } from '../../components/cards/StatCard';
import { RankingTable } from '../../components/tables/RankingTable';
import { CanaisChart } from '../../components/charts/CanaisChart';
import { FilterBar } from '../../components/filters/FilterBar';
import { UltimaAtualizacaoBadge } from '../../components/ui/UltimaAtualizacaoBadge';
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
  // ── Filter state ──────────────────────────────────────
  const [turno, setTurno] = useState<string | undefined>(undefined);
  const [dataInicio, setDataInicio] = useState<Date | undefined>(undefined);
  const [dataFim, setDataFim] = useState<Date | undefined>(undefined);
  const [colaboradorSelecionado, setColaboradorSelecionado] = useState<{
    id: number;
    nome: string;
  } | null>(null);

  // ── Data fetching with filters ────────────────────────
  const {
    metricas,
    rankingColaboradores,
    ultimaAtualizacao,
    loading,
    error,
    refetch,
  } = useDashboardData(dataInicio, dataFim, turno, colaboradorSelecionado?.id);

  // ── Filter handlers ───────────────────────────────────
  const handlePeriodoChange = (inicio: Date | undefined, fim: Date | undefined) => {
    setDataInicio(inicio);
    setDataFim(fim);
  };

  const handleColaboradorClick = (colaboradorId: number, nome: string) => {
    // Toggle: se clicar no mesmo, remove o filtro
    if (colaboradorSelecionado?.id === colaboradorId) {
      setColaboradorSelecionado(null);
    } else {
      setColaboradorSelecionado({ id: colaboradorId, nome });
    }
  };

  const handleLimparColaborador = () => {
    setColaboradorSelecionado(null);
  };

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
        <header className="flex flex-col gap-4 mb-10 text-white animate-fade-in-up">
          {/* Top row: title + actions */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-2 h-8 bg-white/30 rounded-full" />
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight font-display">
                  Dashboard SAC
                </h1>
              </div>
              <p className="text-white/50 text-sm ml-5">
                Monitoramento em tempo real
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Última atualização badges */}
              <UltimaAtualizacaoBadge dados={ultimaAtualizacao} />

              <Link
                to="/upload"
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold
                           bg-white/15 hover:bg-white/25 rounded-xl backdrop-blur-sm
                           border border-white/10 hover:border-white/20
                           transition-all duration-200"
              >
                <Download size={15} /> Importar
              </Link>
            </div>
          </div>

          {/* Filter bar — inline no header */}
          <div className="ml-5">
            <FilterBar
              turno={turno}
              onTurnoChange={setTurno}
              dataInicio={dataInicio}
              dataFim={dataFim}
              onPeriodoChange={handlePeriodoChange}
              colaboradorSelecionado={colaboradorSelecionado}
              onLimparColaborador={handleLimparColaborador}
            />
          </div>
        </header>

        {/* ═══════════════════════════════════════════════════
            1. KPI CARDS (primeira linha)
           ═══════════════════════════════════════════════════ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <StatCard
            title="Atendimentos"
            value={formatarNumero(metricas?.totalAtendimentos ?? 0)}
            icon={<Phone size={18} />}
            description="Total (excl. perdidas)"
          />
          <StatCard
            title="SLA"
            value={formatarPercentual(metricas?.slaPercentual ?? 0)}
            icon={<Timer size={18} />}
            description="Atendidos em até 5 min"
            badge={renderStatusBadge(metricas?.slaPercentual ?? 0)}
            valueColor={getCorSLA(metricas?.slaPercentual ?? 0)}
          />
          <StatCard
            title="Nota Média"
            value={notaMediaConsolidada.toFixed(1)}
            icon={<Smile size={18} />}
            description="Ligação + Omni"
          />
          <StatCard
            title="TMA Consolidado"
            value={formatarTempo(tmaConsolidadoSegundos)}
            icon={<Clock size={18} />}
            description="Tempo médio de conversa"
          />
        </div>

        {/* ═══════════════════════════════════════════════════
            2. KPI CARDS (segunda linha)
           ═══════════════════════════════════════════════════ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
          <StatCard
            title="Abandono"
            value={formatarPercentual(metricas?.taxaAbandono ?? 0)}
            icon={<AlertCircle size={18} />}
            description={`${formatarNumero(metricas?.totalPerdidas ?? 0)} perdidas`}
          />
          <StatCard
            title="TME Ligação"
            value={formatarTempo(metricas?.tmeLigacaoSegundos ?? 0)}
            icon={<Phone size={18} />}
            description="Espera na fila"
          />
          <StatCard
            title="TME Omni"
            value={formatarTempo(metricas?.tmeOmniSegundos ?? 0)}
            icon={<MessageSquare size={18} />}
            description="Espera na fila"
          />
          <StatCard
            title="Nota Solução"
            value={(metricas?.notaMediaSolucaoOmni ?? 0).toFixed(1)}
            icon={<CheckCheck size={18} />}
            description="Nota da solução (Omni)"
          />
        </div>

        {/* ═══════════════════════════════════════════════════
            3. GRÁFICO + VOALLE
           ═══════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>

          {/* Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-surface-300 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-1.5 bg-surface-200 rounded-lg">
                <BarChart3 size={16} className="text-ink-400" />
              </div>
              <h2 className="text-sm font-bold text-ink-500 uppercase tracking-widest font-display">
                Atendimentos por Canal
              </h2>
            </div>
            <CanaisChart dados={metricas?.atendimentosPorCanal ?? []} />
          </div>

          {/* Voalle Summary */}
          <div className="bg-white rounded-2xl shadow-sm border border-surface-300 p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-1.5 bg-brand-50 rounded-lg border border-brand-100">
                <Database size={16} className="text-brand-600" />
              </div>
              <h2 className="text-sm font-bold text-ink-500 uppercase tracking-widest font-display">
                Voalle (ISP)
              </h2>
            </div>

            <div className="space-y-5">
              <ProgressMetric
                label="Taxa de Finalização"
                value={`${voalleTaxaFinalizacao}%`}
                valueColor={voalleTaxaFinalizacao >= 80 ? 'text-emerald-600' : 'text-amber-600'}
                progress={voalleTaxaFinalizacao}
                barColor={voalleTaxaFinalizacao >= 80 ? 'bg-emerald-500' : 'bg-amber-500'}
              />

              <div className="grid grid-cols-3 gap-2">
                <QuickStat label="Clientes" value={formatarNumero(voalleTotais.clientes)} accent />
                <QuickStat label="Atend." value={formatarNumero(voalleTotais.atendimentos)} />
                <QuickStat label="Finaliz." value={formatarNumero(voalleTotais.finalizados)} />
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════
            4. QUICK STATS ROW
           ═══════════════════════════════════════════════════ */}
        <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="bg-white rounded-2xl shadow-sm border border-surface-300 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-1.5 bg-surface-200 rounded-lg">
                <TrendingUp size={14} className="text-ink-400" />
              </div>
              <span className="text-[10px] font-bold text-ink-400 uppercase tracking-widest">Resumo Rápido</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <QuickStat label="Nota Lig." value={(metricas?.notaMediaLigacao ?? 0).toFixed(1)} />
              <QuickStat label="Nota Omni" value={(metricas?.notaMediaOmni ?? 0).toFixed(1)} />
              <QuickStat label="TME Lig." value={formatarTempo(metricas?.tmeLigacaoSegundos ?? 0)} />
              <QuickStat label="TMA Lig." value={formatarTempo(metricas?.tmaLigacaoSegundos ?? 0)} />
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
          <RankingTable
            colaboradores={rankingColaboradores}
            loading={loading}
            onColaboradorClick={handleColaboradorClick}
            colaboradorSelecionadoId={colaboradorSelecionado?.id}
          />
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