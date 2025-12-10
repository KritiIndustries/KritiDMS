
// import React, { useState } from 'react';
// import { Button } from './ui/button';
// import { Input } from './ui/input';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
// import { Building, Shield, User } from 'lucide-react';
// import logo from '../images/Krity_logo.png';
// import { useNavigate } from 'react-router-dom';
// import fetchSAPData from '../lib/getSAPData';
// import axios from 'axios';
// import { useDealer } from '../context/DealerContext';

// export function LoginPage({ onLogin }) {
//   const [credentials, setCredentials] = useState({
//     dealerId: '',
//     password: ''
//   });

//   const [error, setError] = useState('');
//   const navigate = useNavigate();
//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   setError('');

//   //   try {
//   //     if (!credentials.dealerId) {
//   //       setError('Please enter both Dealer ID and Password');
//   //       return;
//   //     }

//   //     const url = `api/sap/opu/odata/sap/ZSALESORDER_ACCESSORIES_SRV/CustCreditSet?$filter=CUSTOMER eq '${credentials.dealerId}' and CONTROLAREA eq '1100'`;
//   //     //const url = `const url = "/api/sap/opu/odata/sap/ZDMS_ORDER_REDESIGN_SRV/ProductsListSet?$filter=Kunnr eq '102115' and Werks eq '1101' and Vtweg eq 'O3'and Bukrs eq '1100'";`
//   //     // ✅ Await the async SAP data call
//   //     const result = await fetchSAPData(url);

//   //     console.log('SAP Login Result:', result);

//   //     if (result[0]) {
//   //       // Login succe
//   //       const customerFull = result[0].CUSTOMER;
//   //       const dealerCode = customerFull.substring(4);
//   //       localStorage.setItem('dealerCode', dealerCode);
//   //       if (onLogin) onLogin(dealerCode);
//   //       navigate('/dashboard'); // redirect to dashboard
//   //     } else {
//   //       setError('Invalid Dealer ID or Password');
//   //     }
//   //   } catch (err) {
//   //     console.error('Login Error:', err);
//   //     setError('Unable to connect to SAP server. Please try again later.');
//   //   }
//   // };
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');

//     try {
//       if (!credentials.dealerId || !credentials.password) {
//         setError('Please enter both Dealer ID and Password');
//         return;
//       }

//       // 🔹 Axios POST request to your API
//       const response = await axios.post('http://udaan.kritinutrients.com/dealer/login', {
//         dealerCode: credentials.dealerId, // ✅ matches backend
//         password: credentials.password
//       });

//       if (response.data.success) {
//         // 🔹 Store full dealer object in localStorage
//         const dealerData = localStorage.setItem('dealerData', JSON.stringify(response.data.data));
//         // 🔹 Extract dealerCode (optional)
//         const dealerCode = response.data.dealer?.UserName || '';
//         if (onLogin) onLogin(dealerData || dealerCode);
//         navigate('/dashboard');
//       } else {
//         setError(response.data.message || 'Invalid Dealer ID or Password');
//       }
//     } catch (err) {
//       console.error('Login Error:', err);
//       if (err.response) {
//         // Server responded with error (4xx / 5xx)
//         setError(err.response.data.message || 'Login failed. Please check credentials.');
//       } else if (err.request) {
//         // No response from server
//         setError('Server not reachable. Please try again later.');
//       } else {
//         // Other errors
//         setError('Unexpected error occurred.');
//       }
//     }
//   };
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
//       <div className="w-full max-w-md">
//         <div className="text-center mb-8">
//           <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
//             <Building className="w-8 h-8 text-primary-foreground" />
//             <img src={logo} alt="Logo" className="h-12 w-auto" />
//           </div>
//           <h1 className="text-3xl font-bold text-gray-900">Dealer Management System</h1>

//         </div>

//         <Card className="shadow-xl">
//           <CardHeader className="space-y-1">
//             <CardTitle className="text-2xl text-center">Welcome </CardTitle>
//             <CardDescription className="text-center">
//               Enter your dealer credentials to Login
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div className="space-y-2">
//                 <label className="block">Dealer ID</label>
//                 <div className="relative">
//                   <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//                   <Input
//                     type="text"
//                     placeholder="Enter your dealer ID"
//                     className="pl-10"
//                     value={credentials.dealerId}
//                     onChange={(e) =>
//                       setCredentials({ ...credentials, dealerId: e.target.value })
//                     }
//                     required
//                   />
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <label className="block">Password</label>
//                 <div className="relative">
//                   <Shield className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//                   <Input
//                     type="password"
//                     placeholder="Enter your password"
//                     className="pl-10"
//                     value={credentials.password}
//                     onChange={(e) =>
//                       setCredentials({ ...credentials, password: e.target.value })
//                     }
//                     required
//                   />
//                 </div>
//               </div>

//               {error && (
//                 <p className="text-red-500 text-center text-sm">{error}</p>
//               )}

//               <Button type="submit" className="w-full">
//                 Sign In
//               </Button>
//             </form>

//             <div className="mt-6 p-4 bg-blue-50 rounded-lg">
//               <div className="flex items-center text-sm text-blue-700">
//                 <Shield className="w-4 h-4 mr-2" />
//                 <span>Secure dealer portal with encrypted data transmission</span>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <div className="text-center mt-6 text-sm text-gray-500">
//           <p>© 2025 Dealer Management System. All rights reserved.</p>
//         </div>
//       </div>
//     </div>
//   );
// }

// LoginPage.jsx
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Building, Shield, User } from 'lucide-react';
import logo from '../images/Krity_logo.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export function LoginPage({ onLogin }) {
  const [credentials, setCredentials] = useState({
    dealerId: '',
    password: ''
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (!credentials.dealerId || !credentials.password) {
        setError('Please enter both Dealer ID and Password');
        return;
      }

      const response = await axios.post('http://udaan.kritinutrients.com/dealer/login', {
        dealerCode: credentials.dealerId,
        password: credentials.password,
      });

      if (response.data.success) {
        localStorage.setItem('dealerData', JSON.stringify(response.data.data));

        // 🔑 Mark user as logged in in App state
        if (onLogin) onLogin();

        // 🔁 Navigate to dashboard
        navigate('/dashboard');
      } else {
        setError(response.data.message || 'Invalid Dealer ID or Password');
      }
    } catch (err) {
      console.error('Login Error:', err);
      if (err.response) {
        setError(err.response.data.message || 'Login failed. Please check credentials.');
      } else if (err.request) {
        setError('Server not reachable. Please try again later.');
      } else {
        setError('Unexpected error occurred.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
            <Building className="w-8 h-8 text-primary-foreground" />
            <img src={logo} alt="Logo" className="h-12 w-auto" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dealer Management System
          </h1>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Welcome</CardTitle>
            <CardDescription className="text-center">
              Enter your dealer credentials to Login
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="block">Dealer ID</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Enter your dealer ID"
                    className="pl-10"
                    value={credentials.dealerId}
                    onChange={(e) =>
                      setCredentials({ ...credentials, dealerId: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block">Password</label>
                <div className="relative">
                  <Shield className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    className="pl-10"
                    value={credentials.password}
                    onChange={(e) =>
                      setCredentials({ ...credentials, password: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-center text-sm">{error}</p>
              )}

              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center text-sm text-blue-700">
                <Shield className="w-4 h-4 mr-2" />
                <span>Secure dealer portal with encrypted data transmission</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-sm text-gray-500">
          <p>© 2025 Dealer Management System. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

