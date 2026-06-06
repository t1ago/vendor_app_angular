/**
 * Converte de ISO (yyyy-MM-ddTHH:mm:ss.sssZ) para input date (yyyy-MM-dd)
 * Exemplo: "1990-06-15T03:00:00.000Z" → "1990-06-15"
 */
export const isoToInputDate = (date: string): string => {
    return date.split('T')[0];
};

/**
 * Converte de input date (yyyy-MM-dd) para brasileiro (dd/MM/yyyy)
 * Exemplo: "1990-06-15" → "15/06/1990"
 */
export const inputDateToBrazilian = (date: string): string => {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
};

/**
 * Converte de brasileiro (dd/MM/yyyy) para input date (yyyy-MM-dd)
 * Exemplo: "15/06/1990" → "1990-06-15"
 */
export const brazilianToInputDate = (date: string): string => {
    const [day, month, year] = date.split('/');
    return `${year}-${month}-${day}`;
};

/**
 * Converte de ISO (yyyy-MM-ddTHH:mm:ss.sssZ) para brasileiro (dd/MM/yyyy)
 * Exemplo: "1990-06-15T03:00:00.000Z" → "15/06/1990"
 */
export const isoToBrazilian = (date: string): string => {
    return inputDateToBrazilian(isoToInputDate(date));
};
