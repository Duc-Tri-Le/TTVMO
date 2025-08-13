import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { publicRouter, privateRouter } from "./routes/routes.jsx";
import PrivateRouteWrapper from "./config/PrivateWrapper/PrivateRouteWrapper.jsx";
import DefaultLayout from "./DefaultLayout/DefaultLayout.jsx";
import SignInUp from "./pages/SignInUp/SignInUp.jsx";
import React from "react";
import "./App.css";

function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          {publicRouter.map((route, index) => {
            const Page = route.element;
            const LayOut = Page === SignInUp ? React.Fragment : DefaultLayout;
            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <LayOut>
                    <Page />
                  </LayOut>
                }
              />
            );
          })}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
