
// import { useState } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// import Sidebar from './components/Sidebar';
// import { LoginPage } from './components/LoginPage';
// import Dashboard from './components/Dashboard';
// import { TodayPricing } from './components/TodayPricing';
// import { Reports } from './components/Reports';
// import { Notifications } from './components/Notifications';
// import { ProcessManagement } from './components/ProcessManagement';
// import { DispatchTracking } from './components/DispatchTracking';
// import { CreateOrder } from './components/CreateOrder';
// import { MyOrders } from './components/MyOrders';
// import logo from './Images/Krity_logo.png';
// import Profile from './components/Profile';
// import ForgetPassword from './components/ForgetPassword';
// import PendingContracts from './components/PendingContracts';
// import { Upload } from './components/Upload';
// import ViewMySalesOrder from './components/ViewMySalesOrder';
// import IndentedOrders from './components/IndentedOrders';
// export default function App() {
//   const [isLoggedIn, setIsLoggedIn] = useState(true);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//   const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
//   const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

//   if (!isLoggedIn) {
//     return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
//   }

//   return (
//     <Router>
//       <header className="bg-[#0072bc] text-white p-4 lg:hidden">
//         <div className="flex justify-between items-center">
//           <button onClick={toggleSidebar} className="text-2xl">☰</button>
//           {/* <div className="flex items-center space-x-2 cursor-pointer ml-6" onClick={toggleDropdown}>
//             <img className="w-8 rounded-full bg-sky-600" src={logo} alt="User avatar" />
//             <span>A. B. Electricals</span>
//             <span className="text-xs">▼</span>
//           </div> */}
//         </div>
//         {/* {isDropdownOpen && (
//           <div
//             className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg p-2 z-10 ease-in-out transition-transform duration-500"
//             style={{ transform: isDropdownOpen ? 'translateY(20px)' : 'translateY(0)', opacity: isDropdownOpen ? 1 : 0 }}
//           >
//             <ul>
//               <li className="p-2 hover:bg-gray-100 cursor-pointer">Profile</li>
//               <li className="p-2 hover:bg-gray-100 cursor-pointer">Change Password</li>
//               <li className="p-2 hover:bg-gray-100 cursor-pointer">Logout</li>
//             </ul>
//           </div>
//         )} */}
//       </header>
//       <div className="flex min-h-screen">
//         {isSidebarOpen && (
//           <div
//             className="fixed inset-0 bg-black opacity-50 z-20 lg:hidden"
//             onClick={toggleSidebar}
//           />
//         )}
//         <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
//         <div className="flex flex-col flex-1 min-w-0 lg:ml-64 bg-gray-100 font-sans">
//           <main className="flex-1 overflow-y-auto overflow-x-visible mt-4">
//             <Routes>
//               <Route path='/login' element={<LoginPage />} />
//               <Route path="/" element={<Navigate to="/dashboard" replace />} />
//               <Route path="/dashboard" element={<Dashboard toggleSidebar={toggleSidebar} />} />
//               <Route path="/pricing" element={<TodayPricing />} />
//               <Route path="/reports" element={<Reports />} />
//               <Route path="/notifications" element={<Notifications />} />
//               <Route path="/processes" element={<ProcessManagement />} />
//               <Route path="/dispatch" element={<DispatchTracking />} />
//               <Route path="/create-order" element={<CreateOrder />} />
//               <Route path="/my-order" element={<MyOrders />} />
//               <Route path="/*" element={<Dashboard />} />
//               <Route path='/Profile' element={<Profile />} />
//               <Route path='/ForgetPassword' element={<ForgetPassword />} />
//               <Route path='/PendingContracts' element={<PendingContracts />} />
//               <Route path='/Upload' element={<Upload />} />
//               <Route path='/View-salesorder' element={<ViewMySalesOrder />} />
//               <Route path="/indented-orders" element={<IndentedOrders />} />
//             </Routes>
//           </main>
//         </div>
//       </div>
//     </Router>
//   );
// }


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

