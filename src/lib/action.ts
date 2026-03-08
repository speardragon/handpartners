export const DEFAULT_ACTION_ERROR_MESSAGE =
  "요청을 처리할 수 없습니다. 잠시 후 다시 시도해 주세요.";

const MASKED_ERROR_PATTERNS = [
  "An error occurred in the Server Components render",
  "The specific message is omitted in production builds",
  "An unexpected response was received from the server",
];

export type ActionResult<T = void> =
  | {
      ok: true;
      data: T;
    }
  | {
      ok: false;
      message: string;
      statusCode?: number;
    };

function getStatusCode(error: unknown): number | undefined {
  if (!error || typeof error !== "object") {
    return undefined;
  }

  const statusCode = (error as { statusCode?: unknown }).statusCode;
  return typeof statusCode === "number" ? statusCode : undefined;
}

function isMeaningfulMessage(message: unknown): message is string {
  if (typeof message !== "string") {
    return false;
  }

  const trimmed = message.trim();

  if (!trimmed || trimmed === "[object Object]") {
    return false;
  }

  return !MASKED_ERROR_PATTERNS.some((pattern) => trimmed.includes(pattern));
}

function extractMessageFromRecord(
  record: Record<string, unknown>
): string | null {
  const candidates = [
    record.message,
    record.error,
    record.details,
    record.hint,
    record.cause,
  ];

  for (const candidate of candidates) {
    const message = getErrorMessage(candidate, "");
    if (message) {
      return message;
    }
  }

  return null;
}

export function getErrorMessage(
  error: unknown,
  fallback = DEFAULT_ACTION_ERROR_MESSAGE
): string {
  console.log("Extracting error message from:", error);
  if (isMeaningfulMessage(error)) {
    return error.trim();
  }

  if (error instanceof Error) {
    if (isMeaningfulMessage(error.message)) {
      return error.message.trim();
    }

    const causeMessage = getErrorMessage(error.cause, "");
    return causeMessage || fallback;
  }

  if (error && typeof error === "object") {
    const recordMessage = extractMessageFromRecord(
      error as Record<string, unknown>
    );
    return recordMessage || fallback;
  }

  return fallback;
}

export function raiseActionError(
  error: unknown,
  fallback = DEFAULT_ACTION_ERROR_MESSAGE
): never {
  console.error(error);
  throw new Error(getErrorMessage(error, fallback));
}

export function actionSuccess<T>(data: T): ActionResult<T> {
  return {
    ok: true,
    data,
  };
}

export function actionFailure(
  error: unknown,
  fallback = DEFAULT_ACTION_ERROR_MESSAGE
): ActionResult<never> {
  const statusCode = getStatusCode(error);

  console.error(error);
  return {
    ok: false,
    message: getErrorMessage(error, fallback),
    statusCode,
  };
}

export async function withActionResult<T>(
  execute: () => Promise<T>,
  fallback = DEFAULT_ACTION_ERROR_MESSAGE
): Promise<ActionResult<T>> {
  try {
    return actionSuccess(await execute());
  } catch (error) {
    return actionFailure(error, fallback);
  }
}

export function unwrapActionResult<T>(
  result: ActionResult<T>,
  fallback = DEFAULT_ACTION_ERROR_MESSAGE
): T {
  if (!result.ok) {
    throw Object.assign(new Error(result.message || fallback), {
      statusCode: result.statusCode,
    });
  }

  return result.data;
}

export async function executeAction<T>(
  resultPromise: Promise<ActionResult<T>>,
  fallback = DEFAULT_ACTION_ERROR_MESSAGE
): Promise<T> {
  const result = await resultPromise;
  return unwrapActionResult(result, fallback);
}
