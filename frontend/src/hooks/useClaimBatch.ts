import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/config";
import type { Batch } from "../types/batch";
import { useAuth } from "../context/AuthContext";
import { toast } from "../components/Toast";

export function useClaimBatch() {
  const queryClient = useQueryClient();
  const { buyer } = useAuth();

  return useMutation({
    mutationFn: (batchId: string) => {
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

    onSuccess: () => {
      toast("Batch claimed successfully!", "success");
    },

    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["batches"], context.previous);
      }
      toast("Failed to claim batch. Please try again.", "error");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["batches"] });
    },
  });
}