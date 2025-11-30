import type { FlightPhase, PhaseAwareness } from '@/types';

export const phaseAwarenessData: Record<FlightPhase, PhaseAwareness> = {
  planning: {
    phase: 'planning',
    risks: [
      'Falta de revisión de NOTAMs relevantes',
      'Subestimar condiciones meteorológicas adversas',
      'Planificación de combustible inadecuada',
      'No considerar terreno en ruta y aproximación',
      'Fatiga acumulada no evaluada',
    ],
    bestPractices: [
      'Revisar METAR/TAF de origen, destino y alternos',
      'Verificar NOTAMs de aeropuertos y ruta',
      'Analizar perfil de terreno en la aproximación',
      'Calcular combustible con reservas adecuadas',
      'Evaluar estado personal y del equipo (fatiga, estrés)',
      'Briefing completo con tripulación',
    ],
  },
  taxi: {
    phase: 'taxi',
    risks: [
      'Incursión en pista activa',
      'Pérdida de consciencia situacional en plataforma',
      'Colisión con otros aviones o vehículos',
      'Confusión con instrucciones ATC',
    ],
    bestPractices: [
      'Mantener cabeza afuera durante rodaje',
      'Confirmar autorización antes de cruzar pistas',
      'Usar luces de taxi apropiadamente',
      'Readback completo de instrucciones ATC',
      'Velocidad de rodaje adecuada',
    ],
  },
  takeoff: {
    phase: 'takeoff',
    risks: [
      'Configuración incorrecta de flaps/slats',
      'Uso de pista incorrecta',
      'Pérdida de control en rotación',
      'Falla de motor en momento crítico',
      'Colisión con obstáculos después del despegue',
    ],
    bestPractices: [
      'Verificar configuración de despegue',
      'Confirmar pista asignada visualmente',
      'Briefing de procedimientos de emergencia',
      'Monitorear parámetros de motor',
      'Conocer obstáculos en la salida',
    ],
  },
  climb: {
    phase: 'climb',
    risks: [
      'Colisión con tráfico o terreno',
      'Exceder limitaciones de velocidad/altitud',
      'Pérdida de consciencia de posición',
      'Falla de sistema en ascenso',
    ],
    bestPractices: [
      'Mantener separación con terreno (MSA)',
      'Monitorear instrumentos y navegación',
      'Seguir SID publicada o vectores ATC',
      'Comunicación clara con ATC',
      'Transición suave a altitud de crucero',
    ],
  },
  cruise: {
    phase: 'cruise',
    risks: [
      'Complacencia y pérdida de vigilancia',
      'Desviación de ruta sin detectar',
      'Problemas de combustible no identificados',
      'Deterioro meteorológico no anticipado',
    ],
    bestPractices: [
      'Monitoreo periódico de sistemas',
      'Verificar progreso vs plan de vuelo',
      'Actualizar información meteorológica en destino',
      'Mantener comunicación con ATC',
      'Preparar descenso con anticipación',
    ],
  },
  descent: {
    phase: 'descent',
    risks: [
      'Descenso prematuro por debajo de altitud segura',
      'Pérdida de consciencia de terreno',
      'Aproximación inestabilizada desde temprano',
      'Configuración tardía de aeronave',
    ],
    bestPractices: [
      'Seguir STAR publicada o vectores',
      'Verificar MSA y altitudes mínimas',
      'Briefing de aproximación completo',
      'Configuración progresiva de la aeronave',
      'Monitorear perfil de descenso',
    ],
  },
  approach: {
    phase: 'approach',
    risks: [
      'CFIT: Colisión con terreno en aproximación',
      'Aproximación no estabilizada',
      'Pérdida de referencias visuales',
      'Confusión con luces de pista/entorno',
      'Descenso por debajo de mínimos',
    ],
    bestPractices: [
      'Criterios de aproximación estabilizada a 1000ft (IMC) / 500ft (VMC)',
      'Verificar altitud en cada punto de la aproximación',
      'Callouts de altitud y velocidad',
      'Go-around sin dudarlo si no estabilizado',
      'Monitorear GPWS/EGPWS',
      'Confirmar referencias visuales antes de continuar',
    ],
  },
  landing: {
    phase: 'landing',
    risks: [
      'ALAR: Aterrizaje largo o corto',
      'Excursión de pista',
      'Pérdida de control direccional',
      'Aterrizaje duro',
      'Falla de sistemas de frenado',
    ],
    bestPractices: [
      'Aterrizar en zona de touchdown',
      'Uso apropiado de reversas y frenos',
      'Mantener línea central',
      'Desacelerar antes de salir de pista',
      'Confirmar pista y condiciones de superficie',
    ],
  },
  go_around: {
    phase: 'go_around',
    risks: [
      'Retraso en decisión de go-around',
      'Configuración incorrecta durante maniobra',
      'Pérdida de control por pitch excesivo',
      'Colisión con terreno u obstáculos',
    ],
    bestPractices: [
      'Ejecutar sin hesitar cuando sea necesario',
      'TOGA, pitch up, positive climb, gear up',
      'Seguir procedimiento de missed approach',
      'Comunicar a ATC inmediatamente',
      'Reconfigurar para segundo intento o alternativo',
    ],
  },
  post_flight: {
    phase: 'post_flight',
    risks: [
      'No reportar discrepancias encontradas',
      'Fatiga que afecte siguientes decisiones',
      'Pérdida de información operacional importante',
    ],
    bestPractices: [
      'Debriefing con tripulación',
      'Reportar cualquier anomalía técnica',
      'Completar documentación requerida',
      'Evaluar lecciones aprendidas',
      'Descanso adecuado antes de siguiente vuelo',
    ],
  },
};

export function getPhaseAwareness(phase: FlightPhase): PhaseAwareness {
  return phaseAwarenessData[phase];
}

export function getAllPhases(): FlightPhase[] {
  return Object.keys(phaseAwarenessData) as FlightPhase[];
}

export function getPhaseLabel(phase: FlightPhase): string {
  const labels: Record<FlightPhase, string> = {
    planning: 'Planificación',
    taxi: 'Taxi',
    takeoff: 'Despegue',
    climb: 'Ascenso / En ruta',
    cruise: 'Crucero',
    descent: 'Descenso',
    approach: 'Aproximación',
    landing: 'Aterrizaje',
    go_around: 'Go-around',
    post_flight: 'Post-vuelo',
  };
  return labels[phase];
}
