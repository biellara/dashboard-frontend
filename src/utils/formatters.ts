/**
 * Utilitários para formatação de dados no Dashboard
 */

/**
 * Converte segundos para formato "Xmin Ys" ou "Xh Ymin"
 */
export const formatarTempo = (segundos: number): string => {
  if (segundos < 60) {
    return `${segundos}s`;
  }
  
  if (segundos < 3600) {
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return segs > 0 ? `${minutos}min ${segs}s` : `${minutos}min`;
  }
  
  const horas = Math.floor(segundos / 3600);
  const minutos = Math.floor((segundos % 3600) / 60);
  return minutos > 0 ? `${horas}h ${minutos}min` : `${horas}h`;
};

/**
 * Formata número com separador de milhares
 */
export const formatarNumero = (numero: number): string => {
  return numero.toLocaleString('pt-BR');
};

/**
 * Formata percentual com 1 casa decimal
 */
export const formatarPercentual = (valor: number): string => {
  return `${valor.toFixed(1)}%`;
};

/**
 * Retorna cor baseada no SLA
 */
export const getCorSLA = (slaPercentual: number): string => {
  if (slaPercentual >= 95) return 'text-emerald-600';
  if (slaPercentual >= 85) return 'text-amber-600';
  return 'text-rose-600';
};

/**
 * Retorna cor de fundo baseada no SLA
 */
export const getBgCorSLA = (slaPercentual: number): string => {
  if (slaPercentual >= 95) return 'bg-emerald-50';
  if (slaPercentual >= 85) return 'bg-amber-50';
  return 'bg-rose-50';
};