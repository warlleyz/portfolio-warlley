// Datas ausentes ou inválidas ficam no fim, sem substituir criação por atualização.
export function compareProjectsByCreation(first, second) {
    const timestamp = (value) => {
        const parsed = value ? Date.parse(value) : NaN
        return Number.isFinite(parsed) ? parsed : Infinity
    }
    const firstDate = timestamp(first.createdAt)
    const secondDate = timestamp(second.createdAt)
    return firstDate === secondDate
        ? String(first.title ?? '').localeCompare(String(second.title ?? ''), 'pt-BR')
        : firstDate - secondDate
}
