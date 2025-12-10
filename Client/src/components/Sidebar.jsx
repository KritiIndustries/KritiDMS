





// // import React from 'react';
// // import { NavLink } from 'react-router-dom';
// import logo from '../images/Krity_logo.png';
// // import { Building } from 'lucide-react';

// import React from 'react';
// import { Button } from './ui/button';
// import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
// import { Badge } from './ui/badge';
// import { 
//   LayoutDashboard, 
//   IndianRupee, 
//   FileText, 
//   Bell, 
//   GitBranch, 
//   Truck, 
//   LogOut,
//   Building,
//   ShoppingCart
// } from 'lucide-react';
// import { NavLink } from 'react-router-dom';

// export default function Sidebar({ isSidebarOpen, toggleSidebar }) {
//   const navItems = [
//     { label: 'Dashboard', path: '/dashboard' },
//     { label: 'Today Pricing', path: '/pricing' },
//     { label: 'Reports', path: '/reports' },
//     { label: 'Notifications', path: '/notifications' },
//     { label: 'Processes', path: '/processes' },
//     { label: 'Dispatch Tracking', path: '/dispatch' },
//     { label: 'Create Order', path: '/create-order' },
//   ];
//   const menuItems = [
//     { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard , path: '/dashboard'},
//     { id: 'create-order', label: 'Create Order', icon: ShoppingCart , path: '/create-order'},
//     { id: 'pricing', label: 'Today Pricing', icon: IndianRupee , path: '/pricing'},
//     { id: 'reports', label: 'Reports', icon: FileText , path: '/reports'},
//     { id: 'notifications', label: 'Notifications', icon: Bell , path: '/notifications' },
//     { id: 'processes', label: 'Process Management', icon: GitBranch , path: '/processes' },
//     { id: 'dispatch', label: 'Dispatch Tracking', icon: Truck  , path: '/dispatch'},
//   ];


//   return (
//     <>
//       {/* Hamburger button - visible only on small screens */}
//       {/* <div className="lg:hidden fixed top-4 left-4 z-40">
//         <button onClick={toggleSidebar} className="text-3xl text-white bg-[#1e2a3a] p-2 rounded-md">
//           ☰
//         </button>

//       </div> */}



//       {/* Sidebar */}
//       <aside
//         className={`w-64  bg-[#1e2a3a] text-white transform ${
//           isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
//         } transition-transform duration-300 ease-in-out fixed lg:translate-x-0 lg:relative z-30 h-full`}
//       >
//         <div className="px-5 py-4">
//           <div className="sidebar-title mb-6">
//             <img
//               className="w-24"
//               src={logo}
//               alt="Company Logo"
//             />
//           </div>
//           <div className="p-6 border-b border-sidebar-border">
//         <div className="flex items-center space-x-3">
//           <div className="w-10 h-10 bg-sidebar-primary rounded-lg flex items-center justify-center">
//           <div className="sidebar-title">
//             <img
//               className="w-24"
//               src={logo}
//               alt="Company Logo"
//             />
//           </div>
//           </div>
//           <div>
//             <h2 className="font-semibold text-white">DMS Portal</h2>
//             <p className="text-xs text-white ">Dealer Management</p>
//           </div>
//         </div>
//       </div>

//           <nav className='mt-3 mx-auto'>
//             <ul className="space-y-2">
//               {menuItems.map((item) => (
//                 <li key={item.id} >
//                   <NavLink
//                     to={item.path}
//                     className={({ isActive }) =>
//                       `block py-2 px-4 rounded ${
//                         isActive ? 'bg-blue-500 text-white font-bold' : 'hover:bg-[#0e1620] text-white'
//                       }`
//                     }
//                     onClick={() => toggleSidebar()} // close sidebar on nav click (optional)
//                   >


//                     {item.label}
//                   </NavLink>
//                 </li>
//               ))}
//             </ul>
//           </nav>
//           {/* <nav className="flex-1 p-4">
//         <div className="space-y-2">
//           {menuItems.map((item) => {
//             const Icon = item.icon;


//             return (


//               <Button
//                 key={item.path}
//                 className='w-full justify-start'
//                 onClick={() => {
//                     navigate(item.path);
//                     toggleSidebar();

//                   }}



//               >
//                 <Icon className="mr-3 h-4 w-4" />
//                 {item.label} 
//                 {item.path === 'notifications' && (
//                   <Badge variant="destructive" className="ml-auto h-5 w-5 p-0 text-xs ">
//                     <div className='mx-auto '>
//                         3
//                     </div>

//                   </Badge>
//                 )}
//               </Button>
//             );
//           })}
//         </div>
//       </nav> */}
//       {/* Footer */}
//       <div className="p-4 border-t border-sidebar-border mt-2  ">
//         <Button 
//           variant="ghost" 
//           className="w-full justify-start text-white hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"

//         >
//           <LogOut className="mr-3 h-4 w-4" />
//           Sign Out
//         </Button>

//         <div className="mt-4 text-xs text-white text-center">
//           <p>DMS </p>
//           <p>© 2025 All rights reserved</p>
//         </div>
//       </div>
//           <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">

//     </div>


//         </div>
//       </aside>
//     </>
//   );
// }

//This is Working
// import {
//   LayoutDashboard,
//   IndianRupee,
//   FileText,
//   Bell,
//   GitBranch,
//   Truck,
//   LogOut,
//   ShoppingCart
// } from 'lucide-react';
// import { NavLink } from 'react-router-dom';
// import logo from '../images/Krity_logo.png'; // Adjust path as needed

// export default function Sidebar({ isSidebarOpen, toggleSidebar }) {
//   const menuItems = [
//     { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
//     { id: 'create-order', label: 'Create Order', icon: ShoppingCart, path: '/create-order' },
//     { id: 'pricing', label: 'Today Pricing', icon: IndianRupee, path: '/pricing' },
//     { id: 'reports', label: 'Reports', icon: FileText, path: '/reports' },
//     { id: 'notifications', label: 'Notifications', icon: Bell, path: '/notifications' },
//     { id: 'processes', label: 'Process Management', icon: GitBranch, path: '/processes' },
//     { id: 'dispatch', label: 'Dispatch Tracking', icon: Truck, path: '/dispatch' },
//   ];

//   return (
//     <aside
//       className={`w-64 bg-[#1e2a3a] text-white transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
//         } transition-transform duration-300 ease-in-out fixed top-0 lg:sticky lg:translate-x-0 z-30 min-h-screen lg:min-h-0 lg:h-auto`}
//     >
//       <div className="flex flex-col min-h-screen lg:min-h-0">
//         {/* Header Section */}
//         <div className="px-5 py-4 border-b border-gray-700">
//           <div className="flex items-center space-x-3">
//             <img className="w-10 rounded-lg" src={logo} alt="Company Logo" />
//             <div>
//               <h2 className="font-semibold text-white">DMS Portal</h2>
//               <p className="text-xs text-gray-300">Dealer Management</p>
//             </div>
//           </div>
//         </div>

//         {/* Navigation */}
//         <nav className="flex-1 px-5 py-4">
//           <ul className="space-y-2">
//             {menuItems.map((item) => (
//               <li key={item.id}>
//                 <NavLink
//                   to={item.path}
//                   className={({ isActive }) =>
//                     `flex items-center py-2 px-4 rounded ${isActive ? 'bg-blue-500 text-white font-bold' : 'hover:bg-[#0e1620] text-white'
//                     }`
//                   }
//                   onClick={() => toggleSidebar()} // Close sidebar on nav click (mobile)
//                 >
//                   <item.icon className="w-5 h-5 mr-3" />
//                   {item.label}
//                   {item.id === 'notifications' && (
//                     <span className="ml-auto bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
//                       3
//                     </span>
//                   )}
//                 </NavLink>
//               </li>
//             ))}
//           </ul>
//         </nav>

//         {/* Footer */}
//         <div className="px-5 py-4 border-t border-gray-700">
//           <button
//             className="flex items-center w-full py-2 px-4 text-white hover:bg-[#0e1620] rounded"
//           >
//             <LogOut className="w-5 h-5 mr-3" />
//             Sign Out
//           </button>
//           <div className="mt-4 text-xs text-gray-300 text-center">
//             <p>DMS</p>
//             <p>© 2025 All rights reserved</p>
//           </div>
//         </div>
//       </div>
//     </aside>
//   );
// }


//This is correct
// import {
//   LayoutDashboard,
//   IndianRupee,
//   FileText,
//   Bell,
//   GitBranch,
//   Truck,
//   LogOut,
//   ShoppingCart
// } from 'lucide-react';
// import { NavLink } from 'react-router-dom';
// import logo from '../images/Krity_logo.png'; // Adjust path as needed

// export default function Sidebar({ isSidebarOpen, toggleSidebar }) {
//   const menuItems = [
//     { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
//     { id: 'create-order', label: 'Create Order', icon: ShoppingCart, path: '/create-order' },
//     { id: 'pricing', label: 'Today Pricing', icon: IndianRupee, path: '/pricing' },
//     { id: 'reports', label: 'Reports', icon: FileText, path: '/reports' },
//     { id: 'notifications', label: 'Notifications', icon: Bell, path: '/notifications' },
//     { id: 'processes', label: 'Process Management', icon: GitBranch, path: '/processes' },
//     { id: 'dispatch', label: 'Dispatch Tracking', icon: Truck, path: '/dispatch' },
//   ];

//   return (
//     <aside
//       className={`w-64  bg-[#1e2a3a] text-white transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
//         } fixed top-0 left-0 z-30 min-h-screen transition-transform duration-300 ease-in-out lg:translate-x-0`}
//     >
//       <div className="flex flex-col min-h-screen mt-10 p-2">
//         {/* Header Section */}
//         <div className="px-5 py-4 border-b border-gray-700">
//           <div className="flex items-center space-x-3">
//             <img className="w-10 rounded-lg" src={logo} alt="Company Logo" />
//             <div>
//               <h2 className="font-semibold text-white">DMS Portal</h2>
//               <p className="text-xs text-gray-300">Dealer Management</p>
//             </div>
//           </div>
//         </div>

//         {/* Navigation */}
//         <nav className="flex-1 px-5 py-4">
//           <ul className="space-y-2">
//             {menuItems.map((item) => (
//               <li key={item.id}>
//                 <NavLink
//                   to={item.path}
//                   className={({ isActive }) =>
//                     `flex items-center py-2 px-4 rounded ${isActive ? 'bg-blue-500 text-white font-bold' : 'hover:bg-[#0e1620] text-white'
//                     }`
//                   }
//                   onClick={() => toggleSidebar()} // Close sidebar on nav click (mobile)
//                 >
//                   <item.icon className="w-5 h-5 mr-3" />
//                   {item.label}
//                   {item.id === 'notifications' && (
//                     <span className="ml-auto bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
//                       3
//                     </span>
//                   )}
//                 </NavLink>
//               </li>
//             ))}
//           </ul>
//         </nav>

//         {/* Footer */}
//         <div className="px-5 py-4 border-t border-gray-700">
//           <button
//             className="flex items-center w-full py-2 px-4 text-white hover:bg-[#0e1620] rounded"
//           >
//             <LogOut className="w-5 h-5 mr-3" />
//             Sign Out
//           </button>
//           <div className="mt-4 text-xs text-gray-300 text-center">
//             <p>DMS</p>
//             <p>© 2025 All rights reserved</p>
//           </div>
//         </div>
//       </div>
//     </aside>
//   );
// }


import {
  LayoutDashboard,
  IndianRupee,
  FileText,
  Bell,
  GitBranch,
  Truck,
  LogOut,
  ShoppingCart,
  Package2
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import logo from '../images/Krity_logo.png'; // Updated path as provided
import { useEffect, useState } from 'react';
import { useDealer } from '../context/DealerContext';
export default function Sidebar({ isSidebarOpen, toggleSidebar }) {
  const menuItems = [
    { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'Sauda-Booking', label: 'Sauda-Booking', icon: ShoppingCart, path: '/create-order' },
    { id: 'Delivery Indent', label: 'Delivery Indent', icon: Package2, path: '/my-order' },
    { id: 'Pending Contracts', label: 'Pending Sauda', icon: Package2, path: '/PendingContracts' },
    { id: 'viewSalesOrder', label: 'View My Fullfilled Sauda', icon: Package2, path: '/View-salesorder' },
    { id: 'Todays Pricing', label: 'Todays Pricing', icon: IndianRupee, path: '/pricing' },
    // { id: 'Reports', label: 'Reports', icon: FileText, path: '/reports' },
    // { id: 'Notifications', label: 'Notifications', icon: Bell, path: '/notifications' },
    // { id: 'Processes', label: 'Process Management', icon: GitBranch, path: '/processes' },
    { id: 'Vehicle Status', label: 'Vehicle Status', icon: Truck, path: '/dispatch' },

  ];
  const [dealer, setDealer] = useState('');
  useEffect(() => {
    const storedDealer = JSON.parse(localStorage.getItem('dealerData'))
    if (storedDealer) {
      setDealer(storedDealer);
    }
  }, []);

  return (
    <aside
      className={`w-64 bg-[#1e2a3a] text-white transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed top-0 left-0 z-30 min-h-screen transition-transform duration-300 ease-in-out lg:translate-x-0`}
    >
      <div className="flex flex-col h-full mt-10">
        {/* Header Section */}
        <div className="px-5 py-4 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <img className="w-15 rounded-lg" src={logo} alt="Company Logo" />
            <div>
              <h2 className="font-semibold text-white">DMS Portal</h2>
              {dealer ? (
                <div>
                  <p className="mt-2 text-white">
                    Dealer Code: <span className="font-semibold ">{dealer.UserName}</span>

                  </p>
                  <p className="mt-2 text-white">

                    <span className="font-semibold ">{dealer.FirstName}</span>
                  </p>
                </div>

              ) : (
                <p className="mt-2 text-red-500">No dealer found. Please login again.</p>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-5 py-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center py-2 px-4 rounded ${isActive ? 'bg-blue-500 text-white font-bold' : 'hover:bg-[#0e1620] text-white'
                    }`
                  }
                  onClick={() => toggleSidebar()} // Close sidebar on nav click (mobile)
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.label}
                  {item.id === 'notifications' && (
                    <span className="ml-auto bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      3
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-700">
          <button
            className="flex items-center w-full py-2 px-4 text-white hover:bg-[#0e1620] rounded"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </button>
          <div className="mt-4 text-xs text-gray-300 text-center">
            <p> Kriti DMS</p>
            <p>© 2025 All rights reserved</p>
          </div>
        </div>
      </div>
    </aside>
  );
}























// import React from 'react';
// import { NavLink } from 'react-router-dom';

// export default function Sidebar({ isSidebarOpen, toggleSidebar }) {
//   const navItems = [
//     { label: 'Dashboard', path: '/dashboard' },
//     { label: 'Today Pricing', path: '/pricing' },
//     { label: 'Reports', path: '/reports' },
//     { label: 'Notifications', path: '/notifications' },
//     { label: 'Processes', path: '/processes' },
//     { label: 'Dispatch Tracking', path: '/dispatch' },
//     { label: 'Create Order', path: '/create-order' },
//   ];

//   return (
//     <aside className={`w-64 bg-[#1e2a3a] text-white text-base transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 fixed lg:relative z-30 h-full`}>
//       <div className="px-5">
//         {/* <div className="sidebar-title flex items-center justify-between py-4">
//           <img
//             className='w-24 cursor-pointer'
//             src='https://images.pexels.com/photos/32844414/pexels-photo-32844414.jpeg'
//             alt='Company Logo'
//           />
//           <button onClick={toggleSidebar} className="lg:hidden text-2xl">☰</button>
//         </div> */}

//         <nav>
//           <ul className="space-y-1">
//             {navItems.map((item) => (
//               <li key={item.path}>
//                 <NavLink
//                   to={item.path}
//                   className={({ isActive }) =>
//                     `block py-2 px-4 rounded ${isActive ? 'bg-[#0e1620]' : 'hover:bg-[#0e1620]'}`
//                   }
//                 >
//                   {item.label}
//                 </NavLink>
//               </li>
//             ))}
//           </ul>
//         </nav>
//       </div>
//     </aside>
//   );
// }




