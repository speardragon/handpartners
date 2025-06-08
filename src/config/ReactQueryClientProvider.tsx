"use client";

import {
  MutationCache,
  Query,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { toast } from "sonner";

const handleReactQueryError = (
  err: Error,
  query?: Query<unknown, unknown, unknown>
) => {
  const meta = query?.meta ?? {};

  if ("preventGlobalError" in meta && meta.preventGlobalError) {
    return;
  }

  if (meta?.errorMessage) {
    toast.error(meta.errorMessage as string);
  } else if (err.message) {
    toast.error(err.message);
  } else {
    toast.error("요청을 처리할 수 없습니다. 잠시 후 다시 시도해 주세요.");
  }
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // 윈도우가 다시 포커스되었을때 데이터를 refetch
      refetchOnMount: true, // 데이터가 stale 상태이면 컴포넌트가 마운트될 때 refetch
      retryOnMount: false,
      refetchOnReconnect: true,
      retry: 2, //// API 요청 실패시 재시도 하는 옵션 (설정값 만큼 재시도)
      retryDelay: 1000,
      staleTime: 1000 * 60 * 10, // 10분 동안 데이터가 stale 상태이면 refetch
      gcTime: 1000 * 60 * 60,
    },
  },
  queryCache: new QueryCache({
    onError: (err, query) => {
      handleReactQueryError(err, query);
    },
  }),
  // mutationCache: new MutationCache({
  //   onError: (err) => {
  //     handleReactQueryError(err);
  //   },
  // }),
});

export default function ReactQueryClientProvider({
  children,
}: React.PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
