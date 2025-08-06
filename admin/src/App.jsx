import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { publicRouter } from "./routes/Route.jsx";

function App() {
  return (
    <Router>
      <Routes>
        {publicRouter.map((route, index) => {
          const Page = route.element;
          return <Route key={index} path={route.path} element={<Page />} />;
        })}
      </Routes>
    </Router>
  );
}

export default App;
