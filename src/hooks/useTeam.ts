"use client";

import { useQuery } from "@tanstack/react-query";
import { teamService } from "@/services";
import { queryKeys } from "@/lib/query-keys";

export function useTeam() {
  return useQuery({
    queryKey: queryKeys.team.members,
    queryFn: () => teamService.members(),
  });
}
