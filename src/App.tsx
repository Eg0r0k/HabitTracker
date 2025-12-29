import { useState, useEffect } from "react";
import { initTelegramApp, useTelegram } from "./hooks/useTelegram";
import Home from "./pages/Home";
import { AddHabit } from "./pages/AddHabit";

type Page = "home" | "add";

initTelegramApp();

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const {
    showMainButton,
    hideMainButton,
    offMainButtonClick,
    showBackButton,
    hideBackButton,
    offBackButtonClick,
    vibrate,
    isInTelegram,
  } = useTelegram();

  useEffect(() => {
    if (page === "home") {
      const handleClick = () => {
        vibrate("light");
        setPage("add");
      };
      showMainButton("Добавить привычку", handleClick);

      return () => {
        offMainButtonClick(handleClick);
      };
    } else {
      hideMainButton();
    }
  }, [page]);

  useEffect(() => {
    if (page !== "home") {
      const handleBack = () => setPage("home");
      showBackButton(handleBack);

      return () => {
        offBackButtonClick(handleBack);
        hideBackButton();
      };
    } else {
      hideBackButton();
    }
  }, [page]);

  return (
    <div className="min-h-screen bg-tg-bg">
      {page === "home" && <Home />}
      {page === "add" && <AddHabit onSuccess={() => setPage("home")} />}

      {!isInTelegram && page === "home" && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-tg-bg border-t">
          <button
            onClick={() => setPage("add")}
            className="w-full py-4 bg-blue-500 text-white font-medium rounded-xl"
          >
            Добавить привычку
          </button>
        </div>
      )}
      {!isInTelegram && page !== "home" && (
        <button
          onClick={() => setPage("home")}
          className="fixed top-4 left-4 p-2 bg-tg-secondary rounded-full"
        >
          ← Назад
        </button>
      )}
    </div>
  );
}
