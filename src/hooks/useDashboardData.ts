import { useQuery } from '@apollo/client/react';
import { gql } from "@apollo/client";

interface AtendimentoPorCanal {
  canal: string;
  total: number;
}

interface RankingColaborador {
  nome: string;
  equipe: string;
  totalAtendimentos: number;
  tempoMedioSegundos: number;
  taxaSatisfacao: number;
}

interface MetricasConsolidadas {
  totalAtendimentos: number;
  slaPercentual: number;
  tempoMedioAtendimentoSegundos: number;
  tempoMedioRespostaSegundos: number;
  taxaSatisfacao: number;
  atendimentosPorCanal: AtendimentoPorCanal[];
  rankingColaboradores: RankingColaborador[];
}

interface DashboardData {
  metricasConsolidadas: MetricasConsolidadas;
}

// Query otimizada que busca todas as métricas de uma vez
const GET_METRICAS_CONSOLIDADAS = gql`
  query GetMetricasConsolidadas($dataInicio: DateTime, $dataFim: DateTime) {
    metricasConsolidadas(dataInicio: $dataInicio, dataFim: $dataFim) {
      totalAtendimentos
      slaPercentual
      tempoMedioAtendimentoSegundos
      tempoMedioRespostaSegundos
      taxaSatisfacao
      atendimentosPorCanal {
        canal
        total
      }
      rankingColaboradores {
        nome
        equipe
        totalAtendimentos
        tempoMedioSegundos
        taxaSatisfacao
      }
    }
  }
`;

export const useDashboardData = (dataInicio?: Date, dataFim?: Date) => {
  const { loading, error, data, refetch } = useQuery<DashboardData>(
    GET_METRICAS_CONSOLIDADAS,
    {
      variables: {
        dataInicio: dataInicio?.toISOString(),
        dataFim: dataFim?.toISOString(),
      },
      // Atualiza a cada 5 minutos automaticamente
      pollInterval: 300000,
    }
  );

  return {
    loading,
    error,
    metricas: data?.metricasConsolidadas,
    refetch,
  };
};