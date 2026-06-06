export function calculateDuration(startTime: Date, endTime: Date): number {
  const ms = endTime.getTime() - startTime.getTime();
  if (ms <= 0) return 0;
  const hours = ms / 3600000;
  return Math.round(hours * 100) / 100;
}

export function calculateCost(hours: number, hourlyRate: number): number {
  return Math.round(hours * hourlyRate * 100) / 100;
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}

export function sanitizeInput(str: string): string {
  return str.replace(/[<>"'&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '&': '&amp;' }[c] || c));
}

export function paginate(page: number, limit: number) {
  const p = Math.max(1, page);
  const l = Math.min(100, Math.max(1, limit));
  return { skip: (p - 1) * l, take: l, page: p, limit: l };
}

export function parsePagination(query: { page?: string; limit?: string }) {
  const page = parseInt(query.page || '1', 10);
  const limit = parseInt(query.limit || '20', 10);
  return { page, limit };
}

export function parseDateRange(query: { dateFrom?: string; dateTo?: string }) {
  return {
    startDate: query.dateFrom ? new Date(query.dateFrom) : undefined,
    endDate: query.dateTo ? new Date(query.dateTo) : undefined,
  };
}
