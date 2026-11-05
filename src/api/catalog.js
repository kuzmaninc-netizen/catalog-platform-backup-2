import { base44 } from '@/api/base44Client';

export async function catalogApi(action, payload = {}) {
  const response = await base44.functions.invoke('catalogApi', { action, ...payload });
  const data = response?.data ?? {};
  if (data.error) throw new Error(data.error);
  return data;
}