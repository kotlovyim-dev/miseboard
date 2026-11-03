export const TRANSFORMER_TIMEOUT_MS = 1000;

const WORKER_SOURCE = `
self.onmessage = (event) => {
  try {
    const transform = new Function("data", event.data.snippet);
    self.postMessage({ ok: true, value: transform(event.data.data) });
  } catch (caught) {
    self.postMessage({ ok: false, error: caught instanceof Error ? caught.message : String(caught) });
  }
};
`;

type WorkerReply = { ok: true; value: unknown } | { ok: false; error: string };

export interface TransformerWorker {
  onmessage: ((event: MessageEvent<WorkerReply>) => void) | null;
  onerror: ((event: ErrorEvent) => void) | null;
  postMessage: (message: { snippet: string; data: unknown }) => void;
  terminate: () => void;
}

export type Transform = (snippet: string, data: unknown) => Promise<unknown>;

export function runTransformer(
  snippet: string,
  data: unknown,
  createWorker: () => TransformerWorker = createSandboxWorker,
): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const worker = createWorker();
    const finish = (settle: () => void) => {
      clearTimeout(timer);
      worker.terminate();
      settle();
    };
    const timer = setTimeout(
      () =>
        finish(() => reject(new Error(`Transformer timed out after ${TRANSFORMER_TIMEOUT_MS} ms`))),
      TRANSFORMER_TIMEOUT_MS,
    );
    worker.onmessage = ({ data: reply }) =>
      finish(() => (reply.ok ? resolve(reply.value) : reject(new Error(reply.error))));
    worker.onerror = ({ message }) => finish(() => reject(new Error(message)));
    worker.postMessage({ snippet, data });
  });
}

function createSandboxWorker(): TransformerWorker {
  const url = URL.createObjectURL(new Blob([WORKER_SOURCE], { type: "text/javascript" }));
  const worker = new Worker(url);
  URL.revokeObjectURL(url);
  return worker;
}
