import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { publicRouter } from "./routes/Route.jsx";
import DefaultLayout from "../layout/DefaultLayout.jsx";
import React from "react";

function App() {
  return (
      <Routes>
        {publicRouter.map((route, index) => {
          const Page = route.element;
          let Layout
          if(route.path === "/sign-in"){
            Layout = React.Fragment;;
          }else {
            Layout = DefaultLayout;
          }
          return (
            <Route
              key={index}
              path={route.path}
              element={
                <Layout>
                  <Page />
                </Layout>
              }
            />
          );
        })}
      </Routes>
  );
}

export default App;
