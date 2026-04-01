
export function formatDateNumber(number: number): string {
    return new Date(number).toLocaleString()
}