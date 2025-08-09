import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { publicRouter, privateRouter } from "./routes/routes.jsx";
import PrivateRouteWrapper from "./config/PrivateWrapper/PrivateRouteWrapper.jsx";
import "./App.css";

function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          {publicRouter.map((route, index) => {
            const Page = route.element;
            return <Route key={index} path={route.path} element={<Page />} />;
          })}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
