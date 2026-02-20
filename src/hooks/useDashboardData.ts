import { useQuery } from '@apollo/client/react';
import { gql } from "@apollo/client";

// ─────────────────────────────────────────────
// Tipos alinhados com MetricasConsolidadasType
// e RankingColaboradorType do backend (schema.py)
// ─────────────────────────────────────────────

interface AtendimentoPorCanal {
  canal: string;
  total: number;
}

interface MetricasConsolidadas {
  totalAtendimentos: number;
  totalPerdidas: number;
  taxaAbandono: number;
  slaPercentual: number;
  // Ligação
  tmeLigacaoSegundos: number;   // Tempo Médio de Espera (fila)
  tmaLigacaoSegundos: number;   // Tempo Médio de Atendimento (conversa)
  notaMediaLigacao: number;
  // Omnichannel
  tmeOmniSegundos: number;      // Tempo Médio de Espera (fila)
  tmaOmniSegundos: number;      // Tempo Médio de Atendimento (conversa)
  notaMediaOmni: number;
  notaMediaSolucaoOmni: number; // Nota da solução (separada da nota do atendente)
  // Distribuição
  atendimentosPorCanal: AtendimentoPorCanal[];
}

export interface RankingColaborador {
  posicao: number;
  colaboradorId: number;
  nome: string;
  equipe: string | null;
  turno: string | null;
  // Ligação
  ligacoesAtendidas: number;
  ligacoesPerdidas: number;
  tmeLigacaoSegundos: number;   // Espera na fila
  tmaLigacaoSegundos: number;   // Duração da conversa
  notaLigacao: number | null;
  // Omnichannel
  atendimentosOmni: number;
  tmeOmniSegundos: number;      // Espera na fila
  tmaOmniSegundos: number;      // Duração da conversa
  notaOmni: number | null;
  // Voalle (produtividade ISP)
  voalleClientesAtendidos: number;
  voalleAtendimentos: number;
  voalleFinalizados: number;
  voalleTaxaFinalizacao: number | null;
  // Consolidado
  totalAtendimentos: number;
  notaFinal: number | null;
}

// ─────────────────────────────────────────────
// Queries GraphQL
// ─────────────────────────────────────────────

const GET_METRICAS_CONSOLIDADAS = gql`
  query GetMetricasConsolidadas($dataInicio: DateTime, $dataFim: DateTime, $turno: String) {
    metricasConsolidadas(dataInicio: $dataInicio, dataFim: $dataFim, turno: $turno) {
      totalAtendimentos
      totalPerdidas
      taxaAbandono
      slaPercentual
      tmeLigacaoSegundos
      tmaLigacaoSegundos
      notaMediaLigacao
      tmeOmniSegundos
      tmaOmniSegundos
      notaMediaOmni
      notaMediaSolucaoOmni
      atendimentosPorCanal {
        canal
        total
      }
    }
  }
`;

const GET_RANKING_COLABORADORES = gql`
  query GetRankingColaboradores($dataInicio: DateTime, $dataFim: DateTime, $turno: String, $limite: Int) {
    rankingColaboradores(dataInicio: $dataInicio, dataFim: $dataFim, turno: $turno, limite: $limite) {
      posicao
      colaboradorId
      nome
      equipe
      turno
      ligacoesAtendidas
      ligacoesPerdidas
      tmeLigacaoSegundos
      tmaLigacaoSegundos
      notaLigacao
      atendimentosOmni
      tmeOmniSegundos
      tmaOmniSegundos
      notaOmni
      voalleClientesAtendidos
      voalleAtendimentos
      voalleFinalizados
      voalleTaxaFinalizacao
      totalAtendimentos
      notaFinal
    }
  }
`;

// ─────────────────────────────────────────────
// Hook principal
// ─────────────────────────────────────────────

const POLL_INTERVAL_MS = 300_000; // 5 minutos

export const useDashboardData = (dataInicio?: Date, dataFim?: Date, turno?: string) => {
  const variables = {
    dataInicio: dataInicio?.toISOString() ?? null,
    dataFim: dataFim?.toISOString() ?? null,
    turno: turno ?? null,
  };

  const {
    loading: loadingMetricas,
    error: errorMetricas,
    data: dataMetricas,
    refetch: refetchMetricas,
  } = useQuery<{ metricasConsolidadas: MetricasConsolidadas }>(
    GET_METRICAS_CONSOLIDADAS,
    { variables, pollInterval: POLL_INTERVAL_MS }
  );

  const {
    loading: loadingRanking,
    error: errorRanking,
    data: dataRanking,
    refetch: refetchRanking,
  } = useQuery<{ rankingColaboradores: RankingColaborador[] }>(
    GET_RANKING_COLABORADORES,
    { variables: { ...variables, limite: 50 }, pollInterval: POLL_INTERVAL_MS }
  );

  const refetch = () => {
    refetchMetricas();
    refetchRanking();
  };

  return {
    loading: loadingMetricas || loadingRanking,
    error: errorMetricas ?? errorRanking,
    metricas: dataMetricas?.metricasConsolidadas,
    rankingColaboradores: dataRanking?.rankingColaboradores ?? [],
    refetch,
  };
};