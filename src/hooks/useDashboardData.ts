import { useQuery } from '@apollo/client/react';
import { gql } from "@apollo/client";

// ─────────────────────────────────────────────
// Tipos
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
  tmeLigacaoSegundos: number;
  tmaLigacaoSegundos: number;
  notaMediaLigacao: number;
  tmeOmniSegundos: number;
  tmaOmniSegundos: number;
  notaMediaOmni: number;
  notaMediaSolucaoOmni: number;
  atendimentosPorCanal: AtendimentoPorCanal[];
}

export interface RankingColaborador {
  posicao: number;
  colaboradorId: number;
  nome: string;
  equipe: string | null;
  turno: string | null;
  ligacoesAtendidas: number;
  ligacoesPerdidas: number;
  tmeLigacaoSegundos: number;
  tmaLigacaoSegundos: number;
  notaLigacao: number | null;
  atendimentosOmni: number;
  tmeOmniSegundos: number;
  tmaOmniSegundos: number;
  notaOmni: number | null;
  voalleClientesAtendidos: number;
  voalleAtendimentos: number;
  voalleFinalizados: number;
  voalleTaxaFinalizacao: number | null;
  totalAtendimentos: number;
  notaFinal: number | null;
}

export interface UltimaAtualizacao {
  omni: string | null;
  ligacao: string | null;
  voalle: string | null;
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
  query GetRankingColaboradores(
    $dataInicio: DateTime,
    $dataFim: DateTime,
    $turno: String,
    $colaboradorId: Int,
    $limite: Int
  ) {
    rankingColaboradores(
      dataInicio: $dataInicio,
      dataFim: $dataFim,
      turno: $turno,
      colaboradorId: $colaboradorId,
      limite: $limite
    ) {
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

const GET_ULTIMA_ATUALIZACAO = gql`
  query GetUltimaAtualizacao {
    ultimaAtualizacao {
      omni
      ligacao
      voalle
    }
  }
`;

// ─────────────────────────────────────────────
// Hook principal
// ─────────────────────────────────────────────

const POLL_INTERVAL_MS = 300_000; // 5 minutos

export const useDashboardData = (
  dataInicio?: Date,
  dataFim?: Date,
  turno?: string,
  colaboradorId?: number | null,
) => {
  const variables = {
    dataInicio: dataInicio?.toISOString() ?? null,
    dataFim: dataFim?.toISOString() ?? null,
    turno: turno ?? null,
  };

  const rankingVariables = {
    ...variables,
    colaboradorId: colaboradorId ?? null,
    limite: 50,
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
    { variables: rankingVariables, pollInterval: POLL_INTERVAL_MS }
  );

  const {
    data: dataAtualizacao,
    refetch: refetchAtualizacao,
  } = useQuery<{ ultimaAtualizacao: UltimaAtualizacao }>(
    GET_ULTIMA_ATUALIZACAO,
    { pollInterval: POLL_INTERVAL_MS }
  );

  const refetch = () => {
    refetchMetricas();
    refetchRanking();
    refetchAtualizacao();
  };

  return {
    loading: loadingMetricas || loadingRanking,
    error: errorMetricas ?? errorRanking,
    metricas: dataMetricas?.metricasConsolidadas,
    rankingColaboradores: dataRanking?.rankingColaboradores ?? [],
    ultimaAtualizacao: dataAtualizacao?.ultimaAtualizacao ?? null,
    refetch,
  };
};