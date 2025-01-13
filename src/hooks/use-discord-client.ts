'use client';

import useSWR from 'swr';
import type { DiscordApiResponse, ErrorResponse } from '@/types/api';

const fetcher = async (url: string) => {
  const response = await fetch(url);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch data');
  }
  return data;
};

export function useDiscordData() {
  const { data, error, isLoading } = useSWR<DiscordApiResponse, Error>(
    '/api/discord',
    fetcher
  );

  return {
    data,
    error,
    isLoading,
  };
}
