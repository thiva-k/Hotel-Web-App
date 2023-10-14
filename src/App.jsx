import React, { useState, lazy, Suspense } from "react";
import Login from "./pages/Login";
import { Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import { AuthContextProvider } from "./context/AuthContext";
import { ThemeProviderComp } from "./components/ThemeProvider";
import { LoadingSkeleton } from "./components/LoadingSkeleton";
import MyProfile from "./pages/MyProfile";
import PrivateRoute from "./components/PrivateRoute";
import { QueryClient, QueryClientProvider } from "react-query";
import Reservation from "./pages/Reservation";
import Menu from "./pages/Menu";
import Chat from "./pages/Chat";
import AboutUs from "./pages/AboutUs";
import Home from "./pages/Home";
// const Home = lazy(() => import("./pages/Home"));
const RoomInfo = lazy(() => import("./pages/RoomInfo"));

const queryClient = new QueryClient();

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  

  return (
    <>
      <ThemeProviderComp darkMode={darkMode}>
        <AuthContextProvider setDarkMode={setDarkMode}>
          <Suspense fallback={<LoadingSkeleton />}>
            <QueryClientProvider client={queryClient}>
              <Routes>
                <Route path="/" element={<AboutUs />} />
                <Route
                  path="/rooms"
                  element={<PrivateRoute component={Home} />}
                />
                <Route
                  path="/rooms/:id"
                  element={<PrivateRoute component={RoomInfo} />}
                />
                <Route
                  path="/my-profile"
                  element={<PrivateRoute component={MyProfile} />}
                />
                <Route
                  path="/reserve"
                  element={<PrivateRoute component={Reservation} />}
                />
                <Route
                  path="/menu"
                  element={<PrivateRoute component={Menu} />}
                />
                <Route
                  path="/about"
                  element={<PrivateRoute component={AboutUs} />}
                />
                <Route
                  path="/chat"
                  element={<PrivateRoute component={Chat} />}
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </QueryClientProvider>
          </Suspense>
        </AuthContextProvider>
      </ThemeProviderComp>
    </>
  );
}
