declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        close: () => void;
        MainButton: {
          text: string;
          isVisible: boolean;
          show: () => void;
          hide: () => void;
          enable: () => void;
          disable: () => void;
          onClick: (fn: () => void) => void;
          offClick: (fn: () => void) => void;
          setParams: (params: {
            text?: string;
            color?: string;
            text_color?: string;
            is_active?: boolean;
            is_visible?: boolean;
          }) => void;
        };
        BackButton: {
          isVisible: boolean;
          show: () => void;
          hide: () => void;
          onClick: (fn: () => void) => void;
          offClick: (fn: () => void) => void;
        };
        HapticFeedback: {
          impactOccurred: (
            style: "light" | "medium" | "heavy" | "rigid" | "soft"
          ) => void;
          notificationOccurred: (type: "success" | "error" | "warning") => void;
          selectionChanged: () => void;
        };
        CloudStorage: {
          setItem: (
            key: string,
            value: string,
            callback?: (error: unknown, success: boolean) => void
          ) => void;
          getItem: (
            key: string,
            callback: (error: unknown, value: string) => void
          ) => void;
          getItems: (
            keys: string[],
            callback: (error: unknown, values: Record<string, string>) => void
          ) => void;
          removeItem: (
            key: string,
            callback?: (error: unknown, success: boolean) => void
          ) => void;
          getKeys: (callback: (error: unknown, keys: string[]) => void) => void;
        };
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
          };
          start_param?: string;
        };
        themeParams: {
          bg_color?: string;
          text_color?: string;
          hint_color?: string;
          link_color?: string;
          button_color?: string;
          button_text_color?: string;
          secondary_bg_color?: string;
        };
        colorScheme: "light" | "dark";
        isExpanded: boolean;
        viewportHeight: number;
        viewportStableHeight: number;
      };
    };
  }
}

const tg = typeof window !== "undefined" ? window.Telegram?.WebApp : null;

export function initTelegramApp() {
  if (!tg) {
    console.warn("Not running in Telegram");
    return;
  }
  tg.ready();
  tg.expand();
}

export function useTelegram() {
  const user = tg?.initDataUnsafe?.user ?? null;
  const colorScheme = tg?.colorScheme ?? "light";

  const vibrate = (
    type: "success" | "error" | "warning" | "light" | "medium" | "heavy"
  ) => {
    if (!tg?.HapticFeedback) return;

    if (type === "success" || type === "error" || type === "warning") {
      tg.HapticFeedback.notificationOccurred(type);
    } else {
      tg.HapticFeedback.impactOccurred(type);
    }
  };

  const showMainButton = (text: string, onClick: () => void) => {
    if (!tg?.MainButton) return;
    tg.MainButton.setParams({ text, is_visible: true });
    tg.MainButton.onClick(onClick);
  };

  const hideMainButton = () => {
    tg?.MainButton?.hide();
  };

  const offMainButtonClick = (onClick: () => void) => {
    tg?.MainButton?.offClick(onClick);
  };

  const showBackButton = (onClick: () => void) => {
    if (!tg?.BackButton) return;
    tg.BackButton.show();
    tg.BackButton.onClick(onClick);
  };

  const hideBackButton = () => {
    tg?.BackButton?.hide();
  };

  const offBackButtonClick = (onClick: () => void) => {
    tg?.BackButton?.offClick(onClick);
  };

  // Cloud Storage обёртки
  const saveToCloud = (key: string, data: unknown): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!tg?.CloudStorage) {
        localStorage.setItem(key, JSON.stringify(data));
        resolve();
        return;
      }
      tg.CloudStorage.setItem(key, JSON.stringify(data), (error) => {
        if (error) reject(error);
        else resolve();
      });
    });
  };

  const loadFromCloud = <T>(key: string): Promise<T | null> => {
    return new Promise((resolve, reject) => {
      if (!tg?.CloudStorage) {
        const data = localStorage.getItem(key);
        resolve(data ? JSON.parse(data) : null);
        return;
      }
      tg.CloudStorage.getItem(key, (error, value) => {
        if (error) reject(error);
        else resolve(value ? JSON.parse(value) : null);
      });
    });
  };

  return {
    tg,
    user,
    colorScheme,
    vibrate,
    showMainButton,
    hideMainButton,
    offMainButtonClick,
    showBackButton,
    hideBackButton,
    offBackButtonClick,
    saveToCloud,
    loadFromCloud,
  };
}
