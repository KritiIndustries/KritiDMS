


// App.jsx
import { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';

import Sidebar from './components/Sidebar';
import { LoginPage } from './components/LoginPage';
import Dashboard from './components/Dashboard';
import { TodayPricing } from './components/TodayPricing';
import { Reports } from './components/Reports';
import { Notifications } from './components/Notifications';
import { ProcessManagement } from './components/ProcessManagement';
import { DispatchTracking } from './components/DispatchTracking';
import { CreateOrder } from './components/CreateOrder';
import { MyOrders } from './components/MyOrders';
import Profile from './components/Profile';
import ForgetPassword from './components/ForgetPassword';
import PendingContracts from './components/PendingContracts';
import { Upload } from './components/Upload';
import ViewMySalesOrder from './components/ViewMySalesOrder';
import IndentedOrders from './components/IndentedOrders';

function AppLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const savedDealer = localStorage.getItem("dealerData");
    return !!savedDealer;   // ✔ true if data exists
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div className="flex min-h-screen">
      {isLoggedIn && !isLoginPage && (
        <>
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black opacity-50 z-20 lg:hidden"
              onClick={toggleSidebar}
            />
          )}
          <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        </>
      )}

      <div
        className={`flex flex-col flex-1 min-w-0 bg-gray-100 font-sans ${isLoggedIn && !isLoginPage ? "lg:ml-64" : ""
          }`}
      >
        {isLoggedIn && !isLoginPage && (
          <header className="bg-[#0072bc] text-white p-4 lg:hidden">
            <button onClick={toggleSidebar} className="text-2xl">
              ☰
            </button>
          </header>
        )}

        <main className="flex-1 overflow-y-auto overflow-x-visible mt-4">
          <Routes>
            <Route
              path="/login"
              element={<LoginPage onLogin={() => setIsLoggedIn(true)} />}
            />

            <Route
              path="/"
              element={
                isLoggedIn ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* Protected Route Example */}
            <Route
              path="/dashboard"
              element={
                isLoggedIn ? (
                  <Dashboard toggleSidebar={toggleSidebar} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            <Route
              path="/my-order"
              element={isLoggedIn ? <MyOrders /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/create-order"
              element={isLoggedIn ? <CreateOrder /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/PendingContracts"
              element={isLoggedIn ? <PendingContracts /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/View-salesorder"
              element={isLoggedIn ? <ViewMySalesOrder /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/dispatch"
              element={isLoggedIn ? <DispatchTracking /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/pricing"
              element={isLoggedIn ? <TodayPricing /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/Upload"
              element={isLoggedIn ? <Upload /> : <Navigate to="/login" replace />}
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}


export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

