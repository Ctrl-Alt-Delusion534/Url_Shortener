import { RouterProvider } from "@tanstack/react-router";
import { router } from "./routing/router";

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
