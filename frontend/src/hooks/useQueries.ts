import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Position } from '../backend';

// Market Briefing
export function useMarketBriefing() {
  const { actor, isFetching } = useActor();
  return useQuery<string | null>({
    queryKey: ['marketBriefing'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getLatestMarketBriefing();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateMarketBriefing() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (content: string) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updateMarketBriefing(content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketBriefing'] });
    },
  });
}

// Watchlist
export function useWatchlist() {
  const { actor, isFetching } = useActor();
  return useQuery<Array<[string, string]>>({
    queryKey: ['watchlist'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getWatchlist();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddToWatchlist() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ ticker, description }: { ticker: string; description: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addToWatchlist(ticker, description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
    },
  });
}

export function useRemoveFromWatchlist() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ticker: string) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.removeFromWatchlist(ticker);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
    },
  });
}

// Portfolio
export function usePortfolioPositions() {
  const { actor, isFetching } = useActor();
  return useQuery<Position[]>({
    queryKey: ['positions'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPositions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddOrUpdatePosition() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      ticker: string;
      entryPrice: number;
      quantity: number;
      stopLoss: number | null;
      takeProfit: number | null;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addOrUpdatePosition(
        params.ticker,
        params.entryPrice,
        params.quantity,
        params.stopLoss,
        params.takeProfit
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['positions'] });
    },
  });
}

export function useRemovePosition() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ticker: string) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.removePosition(ticker);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['positions'] });
    },
  });
}
