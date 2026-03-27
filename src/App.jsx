import { Analytics } from "@vercel/analytics/react";
import AppRouter from "./routes/AppRouter";

export default function App() {
  return (
    <>
      <AppRouter />
      <Analytics />
    </>
  );
}
