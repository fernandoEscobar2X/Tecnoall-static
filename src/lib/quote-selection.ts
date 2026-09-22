export type QuotePick = {
  id: string;
  title: string;
};

type Listener = () => void;

let picks: Record<string, QuotePick> = {};
let snapshot: QuotePick[] = [];
const listeners = new Set<Listener>();

function notify() {
  snapshot = Object.values(picks);
  for (const listener of listeners) listener();
}

export function getQuotePicks(): QuotePick[] {
  return snapshot;
}

export function isQuoted(id: string): boolean {
  return Boolean(picks[id]);
}

export function toggleQuoteItem(id: string, title: string) {
  if (picks[id]) {
    const next = { ...picks };
    delete next[id];
    picks = next;
  } else {
    picks = { ...picks, [id]: { id, title } };
  }
  notify();
}

export function clearQuoteItems() {
  picks = {};
  notify();
}

export function subscribeQuote(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
