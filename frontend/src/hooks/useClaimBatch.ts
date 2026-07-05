import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/config";
import type { Batch } from "../types/batch";
import { useAuth } from "../context/AuthContext";

export function useClaimBatch() {
  const queryClient = useQueryClient();
  const { buyer } = useAuth();

  return useMutation({
    mutationFn: (batchId: string) => {
        console.log("Claiming batch:", batchId, "buyer:", buyer);
      if (!buyer?.id) throw new Error("Not authenticated");
      return api.batches.claim(batchId, buyer.id);
    },

    onMutate: async (batchId) => {
      await queryClient.cancelQueries({ queryKey: ["batches"] });
      const previous = queryClient.getQueryData<Batch[]>(["batches"]);

      queryClient.setQueryData<Batch[]>(["batches"], (old) =>
        old?.map((b) =>
          b.id === batchId
            ? { ...b, status: "claimed" as const, claimedAt: new Date().toISOString() }
            : b
        ) ?? []
      );

      return { previous };
    },

    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["batches"], context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["batches"] });
    },
  });
}