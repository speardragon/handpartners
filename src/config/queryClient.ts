import {
  isServer,
  Query,
  QueryCache,
  QueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/action";

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
  } else {
    toast.error(getErrorMessage(err));
  }
};

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        retryOnMount: false,
        refetchOnReconnect: true,
        retry: 2,
        retryDelay: 1000,
        staleTime: 1000 * 60 * 10,
        gcTime: 1000 * 60 * 60,
      },
    },
    queryCache: new QueryCache({
      onError: (err, query) => {
        handleReactQueryError(err, query);
      },
    }),
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  }
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}
