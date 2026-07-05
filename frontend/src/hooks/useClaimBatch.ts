import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/config";
import type { Batch } from "../types/batch";

export function useClaimBatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (batchId: string) => api.batches.claim(batchId),

    // Optimistic update – runs BEFORE the API call
    onMutate: async (batchId) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ["batches"] });

      // Snapshot the previous value
      const previous = queryClient.getQueryData<Batch[]>(["batches"]);

      // Optimistically update the cache to set status = "claimed"
      queryClient.setQueryData<Batch[]>(["batches"], (old) =>
        old?.map((b) =>
          b.id === batchId
            ? { ...b, status: "claimed" as const, claimedAt: new Date().toISOString() }
            : b
        ) ?? []
      );

      // Return the snapshot so we can roll back on error
      return { previous };
    },

    // If the mutation fails, roll back to the previous value
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["batches"], context.previous);
      }
    },

    // After success or error, refetch to be sure we're in sync with the server
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["batches"] });
    },
  });
}