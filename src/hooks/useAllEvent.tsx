import { useInfiniteQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "src/contexts/AuthContext";
import { OverlayLoadingContext } from "src/contexts/OverlayLoadingContext";
import { Event } from "src/services/eventService";
import { EventType } from "src/types/event";
import { PaginatorResponseType, ResponseType } from "src/types/response";

export const useAllEvent = (
  queryKey: string[],
  debounceValue: string | null = null,
  period: string | null = null
) => {
  const { toggleLoading } = useContext(OverlayLoadingContext);
  const { dispatch } = useContext(AuthContext);

  const {
    isFetching,
    isLoading,
    data,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: queryKey,
    queryFn: ({ pageParam = 1 }) => {
      toggleLoading(true);
      return Event.all(debounceValue, period, pageParam, true);
    },

    getNextPageParam: (lastPage) => {
      const paginator: PaginatorResponseType = lastPage?.data;
      return paginator?.has_more ? paginator.current_page + 1 : undefined;
    },
    //staleTime: Infinity, // Data is considered always fresh, disable re-fetching
    keepPreviousData: true, // Keep previous data while loading new pages
    retry: false, // Disable automatic retrying on error
    onSettled(data) {
      const dataResponse: ResponseType =
        data?.pages.flatMap((page) => page)[0] || {};
      if (dataResponse.message === "Unauthenticated.") {
        toggleLoading(false);
        dispatch({ type: "LOGOUT" });
        return;
      }
      toggleLoading(false);
    },
  });

  const events: EventType[] =
    data?.pages.flatMap((page) => page?.data?.data) || [];

  const dataResponse: ResponseType =
    data?.pages.flatMap((page) => page)[0] || {};

  return {
    isFetching,
    isLoading,
    data,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    events,
    dataResponse,
  };
};
