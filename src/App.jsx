import { Route, Routes } from "react-router-dom";
import Navigation from "./components/Navigation";
import HomePage from "./pages/HomePage";
import ArchivePage from "./pages/ArchivePage";
import SystemDetailPage from "./pages/SystemDetailPage";
import ResearchPage from "./pages/ResearchPage";

export default function App() {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/archive" element={<ArchivePage />} />
        <Route path="/archive/:id" element={<SystemDetailPage />} />
        <Route path="/research" element={<ResearchPage />} />
      </Routes>
    </>
  );
}
