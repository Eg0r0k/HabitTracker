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

  // Back Button
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
    </div>
  );
}
