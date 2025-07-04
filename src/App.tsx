import { Routes, Route, BrowserRouter } from "react-router-dom";
import * as Pages from "./pages";
import * as Components from "./components";
import "./App.scss";

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Components.Layout />}>
          <Route index element={<Pages.Home />} />
          <Route
            path="about"
            element={<Components.Markdown url="mds/about.md" />}
          />

          <Route path="games">
            <Route path="4row" element={<Pages.Games.Game4Row />} />
          </Route>

          <Route path="*" element={<Pages.NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
