import { useCallback, useState } from "react";

import type { Staff } from "@shared/types";
import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/axiosInstance";
import { queryKeys } from "@/react-query/constants";
import { filterByTreatment } from "../utils";

// query function for useQuery
async function getStaff(): Promise<Staff[]> {
  const { data } = await axiosInstance.get("/staff");
  return data;
}

export function useStaff() {
  // for filtering staff by treatment
  const [filter, setFilter] = useState("all");

  const fallback: Staff[] = [];

  const selectFn = useCallback(
    (data: Staff[]) => {
      if (filter === "all") return data;
      return filterByTreatment(data, filter);
    },
    [filter]
  );

  const { data: staff = fallback } = useQuery({
    queryKey: [queryKeys.staff],
    queryFn: getStaff,
    select: selectFn,
  });

  return { staff, filter, setFilter };
}
