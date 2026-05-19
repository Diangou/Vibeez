type EventPayloads = {
  'favorite:added': { artistName: string };
  'favorite:removed': { artistName: string };
  'mood:changed': { moodName: string; emoji: string };
};

type EventName = keyof EventPayloads;

type Listener = (data: EventPayloads[EventName]) => void;

export class EventBus {
  private listeners = new Map<EventName, Set<Listener>>();

  on<E extends EventName>(event: E, fn: (data: EventPayloads[E]) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(fn as Listener);
  }

  off<E extends EventName>(event: E, fn: (data: EventPayloads[E]) => void) {
    this.listeners.get(event)?.delete(fn as Listener);
  }

  emit<E extends EventName>(event: E, data: EventPayloads[E]) {
    this.listeners.get(event)?.forEach(fn => fn(data));
  }
}

export const eventBus = new EventBus();
