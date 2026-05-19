import { useEffect, useRef, useState } from 'react';
import { eventBus } from '../observer/EventBus';

type ToastEvent =
  | { icon: string; message: string }
  | null;

export function Toast() {
  const [toast, setToast] = useState<ToastEvent>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const clearToast = () => {
      setToast(null);
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };

    const showToast = (toastData: { icon: string; message: string }) => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
      setToast(toastData);
      timerRef.current = window.setTimeout(() => setToast(null), 3000);
    };

    const onFavoriteAdded = (payload: { artistName: string }) => {
      showToast({ icon: '💜', message: `${payload.artistName} ajouté aux favoris` });
    };

    const onFavoriteRemoved = (payload: { artistName: string }) => {
      showToast({ icon: '🗑️', message: `${payload.artistName} retiré des favoris` });
    };

    const onMoodChanged = (payload: { moodName: string; emoji: string }) => {
      showToast({ icon: payload.emoji, message: `Mood : ${payload.moodName}` });
    };

    eventBus.on('favorite:added', onFavoriteAdded);
    eventBus.on('favorite:removed', onFavoriteRemoved);
    eventBus.on('mood:changed', onMoodChanged);

    return () => {
      eventBus.off('favorite:added', onFavoriteAdded);
      eventBus.off('favorite:removed', onFavoriteRemoved);
      eventBus.off('mood:changed', onMoodChanged);
      clearToast();
    };
  }, []);

  if (!toast) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm rounded-full bg-black/80 border border-white/10 backdrop-blur-xl px-5 py-3 text-white shadow-2xl flex items-center gap-3">
      <span className="text-xl">{toast.icon}</span>
      <span className="font-medium">{toast.message}</span>
    </div>
  );
}
