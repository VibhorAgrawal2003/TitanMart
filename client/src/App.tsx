import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";

import Auth from "./pages/auth";
import Home from "./pages/home";
import Layout from "./components/Layout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Auth Page */}
          <Route path="auth" element={<Auth />} />

          {/* Home Page */}
          <Route index element={<Home />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
