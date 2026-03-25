/**
 * Structured JSON logger for production observability.
 *
 * In development: pretty-prints to console with colors.
 * In production:  outputs JSON lines suitable for log aggregation (Vercel Logs, Datadog, etc.).
 */

type LogLevel = "debug" | "info" | "warn" | "error";

type LogContext = Record<string, unknown>;

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: LogContext;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const MIN_LEVEL: LogLevel = process.env.NODE_ENV === "production" ? "info" : "debug";

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[MIN_LEVEL];
}

function formatError(err: unknown): LogEntry["error"] | undefined {
  if (!err) return undefined;
  if (err instanceof Error) {
    return {
      name: err.name,
      message: err.message,
      stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
    };
  }
  return { name: "UnknownError", message: String(err) };
}

function emit(entry: LogEntry) {
  const output =
    process.env.NODE_ENV === "production"
      ? JSON.stringify(entry)
      : `[${entry.level.toUpperCase()}] ${entry.message}${entry.context ? " " + JSON.stringify(entry.context) : ""}${entry.error ? " | " + entry.error.message : ""}`;

  switch (entry.level) {
    case "error":
      console.error(output);
      break;
    case "warn":
      console.warn(output);
      break;
    default:
      console.log(output);
  }
}

function log(level: LogLevel, message: string, context?: LogContext, err?: unknown) {
  if (!shouldLog(level)) return;

  const entry: LogEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    context: context && Object.keys(context).length > 0 ? context : undefined,
    error: formatError(err),
  };

  emit(entry);
}

export const logger = {
  debug: (message: string, context?: LogContext) => log("debug", message, context),
  info: (message: string, context?: LogContext) => log("info", message, context),
  warn: (message: string, context?: LogContext) => log("warn", message, context),
  error: (message: string, context?: LogContext, err?: unknown) =>
    log("error", message, context, err),
};
