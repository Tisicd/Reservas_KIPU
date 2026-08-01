export const COMO_SE_ENTERO_OPCIONES = [
  "Redes sociales (Instagram/Facebook)",
  "Recomendación de un amigo",
  "Google / búsqueda web",
  "Volante o cartel",
  "Ya soy cliente frecuente",
  "Otro",
] as const;

export const IDIOMAS_OPCIONES = [
  "Español",
  "Inglés",
  "Francés",
  "Alemán",
  "Portugués",
  "Italiano",
  "Japonés",
  "Coreano",
  "Chino",
  "Otro",
] as const;

export function formatearFecha(fecha: string): string {
  const [year, month, day] = fecha.split("-");
  const meses = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];
  return `${parseInt(day)} de ${meses[parseInt(month) - 1]} de ${year}`;
}

export function formatearHora(hora: string): string {
  const [h, m] = hora.split(":");
  const horaNum = parseInt(h);
  const periodo = horaNum >= 12 ? "p.m." : "a.m.";
  const hora12 = horaNum % 12 || 12;
  return `${hora12}:${m} ${periodo}`;
}
