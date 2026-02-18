import { useQuery } from '@apollo/client/react';
import { gql } from "@apollo/client";

// ==========================================
// TIPOS
// ==========================================

export interface AtendimentoPorCanal {
  canal: string;
  total: number;
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
  tmeLigacaoSegundos: number;
  notaLigacao: number | null;
  // Omni
  atendimentosOmni: number;
  tmeOmniSegundos: number;
  notaOmni: number | null;
  // Consolidado
  totalAtendimentos: number;
  notaFinal: number | null;
}

export interface MetricasConsolidadas {
  totalAtendimentos: number;
  totalPerdidas: number;
  taxaAbandono: number;
  slaPercentual: number;
  // Ligação
  tmeLigacaoSegundos: number;
  notaMediaLigacao: number;
  // Omni
  tmeOmniSegundos: number;
  notaMediaOmni: number;
  // Distribuição
  atendimentosPorCanal: AtendimentoPorCanal[];
}

interface DashboardData {
  metricasConsolidadas: MetricasConsolidadas;
  rankingColaboradores: RankingColaborador[];
}

// ==========================================
// QUERIES GRAPHQL
// ==========================================

const GET_DASHBOARD = gql`
  query GetDashboard(
    $dataInicio: DateTime
    $dataFim: DateTime
    $turno: String
  ) {
    metricasConsolidadas(
      dataInicio: $dataInicio
      dataFim: $dataFim
      turno: $turno
    ) {
      totalAtendimentos
      totalPerdidas
      taxaAbandono
      slaPercentual
      tmeLigacaoSegundos
      notaMediaLigacao
      tmeOmniSegundos
      notaMediaOmni
      atendimentosPorCanal {
        canal
        total
      }
    }

    rankingColaboradores(
      dataInicio: $dataInicio
      dataFim: $dataFim
      turno: $turno
      limite: 50
    ) {
      posicao
      colaboradorId
      nome
      equipe
      turno
      ligacoesAtendidas
      ligacoesPerdidas
      tmeLigacaoSegundos
      notaLigacao
      atendimentosOmni
      tmeOmniSegundos
      notaOmni
      totalAtendimentos
      notaFinal
    }
  }
`;

// ==========================================
// HOOK
// ==========================================

export type Turno = 'Madrugada' | 'Manhã' | 'Tarde' | 'Noite' | null;

export const useDashboardData = (
  dataInicio?: Date,
  dataFim?: Date,
  turno?: Turno,
) => {
  const { loading, error, data, refetch } = useQuery<DashboardData>(
    GET_DASHBOARD,
    {
      variables: {
        dataInicio: dataInicio?.toISOString() ?? null,
        dataFim: dataFim?.toISOString() ?? null,
        turno: turno ?? null,
      },
      fetchPolicy: 'cache-and-network',
    }
  );

  return {
    loading,
    error,
    metricas: data?.metricasConsolidadas,
    ranking: data?.rankingColaboradores ?? [],
    refetch,
  };
};