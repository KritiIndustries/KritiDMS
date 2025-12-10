// import React from 'react';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
// import { Badge } from './ui/badge';
// import { Progress } from './ui/progress';
// import { 
//   IndianRupee, 
//   Target, 
//   TrendingUp, 
//   Calendar,
//   AlertTriangle,
//   CheckCircle,
//   Clock,
//   FileText,
//   Truck,
//   Bell
// } from 'lucide-react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

// const salesData = [
//   { month: 'Jan', sales: 45000, target: 50000 },
//   { month: 'Feb', sales: 52000, target: 50000 },
//   { month: 'Mar', sales: 48000, target: 50000 },
//   { month: 'Apr', sales: 61000, target: 55000 },
//   { month: 'May', sales: 55000, target: 55000 },
//   { month: 'Jun', sales: 67000, target: 60000 },
// ];

// const productMix = [
//   { name: 'SBO', value: 45, color: '#0088FE' },
//   { name: 'SFO', value: 30, color: '#00C49F' },
//   { name: 'GNO', value: 25, color: '#FFBB28' },
//   { name: 'KGMO', value: 25, color: '#FFBB28' },
// ];

// const recentOrders = [
//   { id: 'ORD-001', product: 'SBO 15 kg Jar', quantity: 50, status: 'Processing', amount: 62500 },
//   { id: 'ORD-002', product: 'SFO 15 Ltr Lt Bucket', quantity: 75, status: 'Shipped', amount: 67500 },
//   { id: 'ORD-003', product: 'Weather Shield Paint', quantity: 30, status: 'Delivered', amount: 47400 },
//   { id: 'ORD-004', product: 'KGMO 15 Ltr Tin', quantity: 100, status: 'Processing', amount: 89000 },
// ];

// const notifications = [
//   { id: 1, type: 'credit', message: 'Credit limit utilization at 78%', time: '2 hours ago', urgent: true },
//   { id: 2, type: 'dispatch', message: 'Order ORD-002 dispatched from warehouse', time: '4 hours ago', urgent: false },
//   { id: 3, type: 'achievement', message: 'Monthly target achieved! 🎉', time: '1 day ago', urgent: false },
// ];

// export function Dashboard() {
//   const currentMonth = new Date().toLocaleString('default', { month: 'long' });
//   const mtdSales = 45000;
//   const monthlyTarget = 60000;
//   const achievementPercentage = (mtdSales / monthlyTarget) * 100;
//   const creditLimit = 500000;
//   const creditUsed = 390000;
//   const creditUtilization = (creditUsed / creditLimit) * 100;

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'Processing': return 'default';
//       case 'Shipped': return 'secondary';
//       case 'Delivered': return 'default';
//       default: return 'outline';
//     }
//   };

//   const getNotificationIcon = (type) => {
//     switch (type) {
//       case 'credit': return <AlertTriangle className="w-4 h-4" />;
//       case 'dispatch': return <Truck className="w-4 h-4" />;
//       case 'achievement': return <CheckCircle className="w-4 h-4" />;
//       default: return <Bell className="w-4 h-4" />;
//     }
//   };

//   return (
//     <div className="p-6 space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold">Dashboard</h1>
//         <p className="text-muted-foreground">Welcome back! Here's your business overview</p>
//       </div>

//       {/* Key Metrics Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Credit Limit</CardTitle>
//             <IndianRupee className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">₹{(creditLimit - creditUsed).toLocaleString()}</div>
//             <div className="text-xs text-muted-foreground mb-2">
//               Available out of ₹{creditLimit.toLocaleString()}
//             </div>
//             <Progress value={creditUtilization} className="h-2" />
//             <div className="text-xs text-muted-foreground mt-1">
//               {creditUtilization.toFixed(1)}% utilized
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Monthly Target</CardTitle>
//             <Target className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">₹{monthlyTarget.toLocaleString()}</div>
//             <div className="text-xs text-muted-foreground mb-2">
//               Target for {currentMonth}
//             </div>
//             <Progress value={achievementPercentage} className="h-2" />
//             <div className="text-xs text-green-600 mt-1">
//               {achievementPercentage.toFixed(1)}% achieved
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">MTD Sales</CardTitle>
//             <TrendingUp className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">₹{mtdSales.toLocaleString()}</div>
//             <p className="text-xs text-muted-foreground">
//               Month to date sales
//             </p>
//             <div className="text-xs text-green-600 mt-1">
//               +12.5% from last month
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Monthly Achievement</CardTitle>
//             <Calendar className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{achievementPercentage.toFixed(1)}%</div>
//             <p className="text-xs text-muted-foreground">
//               Of monthly target
//             </p>
//             <div className="text-xs text-blue-600 mt-1">
//               ₹{(monthlyTarget - mtdSales).toLocaleString()} remaining
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Charts Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <Card>
//           <CardHeader>
//             <CardTitle>Sales vs Target Trend</CardTitle>
//             <CardDescription>Monthly performance comparison</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={salesData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="month" />
//                 <YAxis />
//                 <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']} />
//                 <Bar dataKey="target" fill="#e2e8f0" name="Target" />
//                 <Bar dataKey="sales" fill="#3b82f6" name="Sales" />
//               </BarChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Product Mix</CardTitle>
//             <CardDescription>Sales distribution by product category</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie
//                   data={productMix}
//                   cx="50%"
//                   cy="50%"
//                   labelLine={false}
//                   label={({ name, percent }) => `${name} ${(percent).toFixed(0)}%`}
//                   outerRadius={100}
//                   fill="#8884d8"
//                   dataKey="value"
//                 >
//                   {productMix.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={entry.color} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//               </PieChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>
//       </div>



//       {/* Recent Orders and Notifications */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center">
//               <FileText className="w-5 h-5 mr-2" />
//               Recent Orders
//             </CardTitle>
//             <CardDescription>Your latest order activities</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {recentOrders.map((order) => (
//                 <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
//                   <div className="flex-1">
//                     <div className="font-medium">{order.id}</div>
//                     <div className="text-sm text-muted-foreground">{order.product}</div>
//                     <div className="text-xs text-muted-foreground">Qty: {order.quantity}</div>
//                   </div>
//                   <div className="text-right">
//                     <div className="font-medium">₹{order.amount.toLocaleString()}</div>
//                     <Badge variant={getStatusColor(order.status)}>{order.status}</Badge>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center">
//               <Bell className="w-5 h-5 mr-2" />
//               Recent Notifications
//             </CardTitle>
//             <CardDescription>Important updates and alerts</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {notifications.map((notification) => (
//                 <div 
//                   key={notification.id} 
//                   className={`flex items-start space-x-3 p-3 rounded-lg ${
//                     notification.urgent ? 'bg-red-50 border-red-200' : 'bg-gray-50'
//                   }`}
//                 >
//                   <div className={`${notification.urgent ? 'text-red-600' : 'text-gray-600'}`}>
//                     {getNotificationIcon(notification.type)}
//                   </div>
//                   <div className="flex-1">
//                     <div className="text-sm font-medium">{notification.message}</div>
//                     <div className="flex items-center text-xs text-muted-foreground mt-1">
//                       <Clock className="w-3 h-3 mr-1" />
//                       {notification.time}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Quick Actions */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Quick Actions</CardTitle>
//           <CardDescription>Frequently used features</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             <div className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
//               <IndianRupee className="w-8 h-8 text-blue-600 mb-2" />
//               <span className="text-sm font-medium">View Pricing</span>
//             </div>
//             <div className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
//               <FileText className="w-8 h-8 text-green-600 mb-2" />
//               <span className="text-sm font-medium"> Report</span>
//             </div>
//             <div className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
//               <Truck className="w-8 h-8 text-orange-600 mb-2" />
//               <span className="text-sm font-medium">Track Dispatch</span>
//             </div>
//             <div className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
//               <Bell className="w-8 h-8 text-purple-600 mb-2" />
//               <span className="text-sm font-medium">View Alerts</span>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// import React from 'react';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
// import { Progress } from './ui/progress';
// import { Badge } from './ui/badge';
// import { 
//   CreditCard, 
//   Target, 
//   TrendingUp, 
//   Calendar,
//   ArrowUp,
//   ArrowDown,
//   IndianRupee,
//   FileText,
//   Truck,
//   Bell
// } from 'lucide-react';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

// const salesData = [
//   { month: 'Jan', target: 100, achievement: 85 },
//   { month: 'Feb', target: 120, achievement: 110 },
//   { month: 'Mar', target: 140, achievement: 125 },
//   { month: 'Apr', target: 130, achievement: 145 },
//   { month: 'May', target: 150, achievement: 140 },
//   { month: 'Jun', target: 160, achievement: 155 },
// ];

// const mtdData = [
//   { week: 'Week 1', sales: 25 },
//   { week: 'Week 2', sales: 35 },
//   { week: 'Week 3', sales: 42 },
//   { week: 'Week 4', sales: 38 },
// ];

// const productMix = [
//   { name: 'Product A', value: 35, color: '#8884d8' },
//   { name: 'Product B', value: 25, color: '#82ca9d' },
//   { name: 'Product C', value: 20, color: '#ffc658' },
//   { name: 'Product D', value: 20, color: '#ff7300' },
// ];

// export function Dashboard() {
//   const creditUtilization = 75;
//   const monthlyAchievement = 92;

//   return (
//     <div className="p-6 space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold">Dealer Dashboard</h1>
//         <p className="text-muted-foreground">Welcome back! Here's your business overview.</p>
//       </div>

//       {/* Key Metrics Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Credit Limit</CardTitle>
//             <CreditCard className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">₹15,00,000</div>
//             <div className="flex items-center space-x-2 mt-2">
//               <Progress value={creditUtilization} className="flex-1" />
//               <span className="text-sm text-muted-foreground">{creditUtilization}%</span>
//             </div>
//             <p className="text-xs text-muted-foreground mt-1">
//               ₹{(1500000 * creditUtilization / 100).toLocaleString()} utilized
//             </p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Monthly Target</CardTitle>
//             <Target className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">₹12,50,000</div>
//             <div className="flex items-center mt-2">
//               <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
//               <span className="text-sm text-green-500">8.2% from last month</span>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">MTD Sales</CardTitle>
//             <TrendingUp className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">₹8,75,000</div>
//             <div className="flex items-center mt-2">
//               <Progress value={70} className="flex-1 mr-2" />
//               <Badge variant="secondary">70%</Badge>
//             </div>
//             <p className="text-xs text-muted-foreground mt-1">
//               22 days remaining
//             </p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Monthly Achievement</CardTitle>
//             <Calendar className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{monthlyAchievement}%</div>
//             <div className="flex items-center mt-2">
//               {monthlyAchievement >= 100 ? (
//                 <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
//               ) : (
//                 <ArrowDown className="h-4 w-4 text-orange-500 mr-1" />
//               )}
//               <span className={`text-sm ${monthlyAchievement >= 100 ? 'text-green-500' : 'text-orange-500'}`}>
//                 {monthlyAchievement >= 100 ? 'Target Exceeded' : 'Below Target'}
//               </span>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Charts Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <Card>
//           <CardHeader>
//             <CardTitle>Target vs Achievement Trend</CardTitle>
//             <CardDescription>Monthly performance comparison</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={300}>
//               <LineChart data={salesData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="month" />
//                 <YAxis />
//                 <Tooltip formatter={(value, name) => [`₹${value}L`, name]} />
//                 <Line 
//                   type="monotone" 
//                   dataKey="target" 
//                   stroke="#8884d8" 
//                   strokeWidth={2}
//                   name="Target"
//                 />
//                 <Line 
//                   type="monotone" 
//                   dataKey="achievement" 
//                   stroke="#82ca9d" 
//                   strokeWidth={2}
//                   name="Achievement"
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>MTD Sales by Week</CardTitle>
//             <CardDescription>Current month weekly breakdown</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={mtdData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="week" />
//                 <YAxis />
//                 <Tooltip formatter={(value) => [`₹${value}L`]} />
//                 <Bar dataKey="sales" fill="#8884d8" radius={[4, 4, 0, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <Card className="lg:col-span-1">
//           <CardHeader>
//             <CardTitle>Product Mix</CardTitle>
//             <CardDescription>Sales distribution by product category</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={250}>
//               <PieChart>
//                 <Pie
//                   data={productMix}
//                   cx="50%"
//                   cy="50%"
//                   innerRadius={60}
//                   outerRadius={100}
//                   paddingAngle={5}
//                   dataKey="value"
//                 >
//                   {productMix.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={entry.color} />
//                   ))}
//                 </Pie>
//                 <Tooltip formatter={(value) => [`${value}%`]} />
//               </PieChart>
//             </ResponsiveContainer>
//             <div className="space-y-2 mt-4">
//               {productMix.map((item, index) => (
//                 <div key={index} className="flex items-center justify-between">
//                   <div className="flex items-center">
//                     <div 
//                       className="w-3 h-3 rounded-full mr-2" 
//                       style={{ backgroundColor: item.color }}
//                     />
//                     <span className="text-sm">{item.name}</span>
//                   </div>
//                   <span className="text-sm font-medium">{item.value}%</span>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="lg:col-span-2">
//           <CardHeader>
//             <CardTitle>Quick Actions</CardTitle>
//             <CardDescription>Frequently used features</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-2 gap-4">
//               <div className="p-4 border rounded-lg cursor-pointer hover:bg-accent transition-colors">
//                 <IndianRupee className="w-8 h-8 text-primary mb-2" />
//                 <h3 className="font-medium">Check Today's Pricing</h3>
//                 <p className="text-sm text-muted-foreground">View current SKU prices</p>
//               </div>
//               <div className="p-4 border rounded-lg cursor-pointer hover:bg-accent transition-colors">
//                 <FileText className="w-8 h-8 text-primary mb-2" />
//                 <h3 className="font-medium">Generate Reports</h3>
//                 <p className="text-sm text-muted-foreground">Sales and ledger reports</p>
//               </div>
//               <div className="p-4 border rounded-lg cursor-pointer hover:bg-accent transition-colors">
//                 <Truck className="w-8 h-8 text-primary mb-2" />
//                 <h3 className="font-medium">Track Dispatch</h3>
//                 <p className="text-sm text-muted-foreground">Monitor delivery status</p>
//               </div>
//               <div className="p-4 border rounded-lg cursor-pointer hover:bg-accent transition-colors">
//                 <Bell className="w-8 h-8 text-primary mb-2" />
//                 <h3 className="font-medium">View Notifications</h3>
//                 <p className="text-sm text-muted-foreground">Latest updates & alerts</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <Card>
//           <CardHeader>
//             <CardTitle>Sales vs Target Trend</CardTitle>
//             <CardDescription>Monthly performance comparison</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={salesData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="month" />
//                 <YAxis />
//                 <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']} />
//                 <Bar dataKey="target" fill="#e2e8f0" name="Target" />
//                 <Bar dataKey="sales" fill="#3b82f6" name="Sales" />
//               </BarChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Product Mix</CardTitle>
//             <CardDescription>Sales distribution by product category</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie
//                   data={productMix}
//                   cx="50%"
//                   cy="50%"
//                   labelLine={false}
//                   label={({ name, percent }) => `${name} ${(percent).toFixed(0)}%`}
//                   outerRadius={100}
//                   fill="#8884d8"
//                   dataKey="value"
//                 >
//                   {productMix.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={entry.color} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//               </PieChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }


import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { useDealer } from '../context/DealerContext';


import {
  IndianRupee,
  Target,
  TrendingUp,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Truck,
  Bell
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';
import { useNavigate } from 'react-router-dom';

const salesData = [
  { month: 'Jan', sales: 45000, target: 50000 },
  { month: 'Feb', sales: 52000, target: 50000 },
  { month: 'Mar', sales: 48000, target: 50000 },
  { month: 'Apr', sales: 61000, target: 55000 },
  { month: 'May', sales: 55000, target: 55000 },
  { month: 'Jun', sales: 67000, target: 60000 },
];

const productMix = [
  { name: 'SBO', value: 45, color: '#0088FE' },
  { name: 'SFO', value: 55, color: '#00C49F' },
  { name: 'GNO', value: 25, color: '#FFBB28' },
  { name: 'KGMO', value: 25, color: '#FFBB28' },
];
const isMobile = window.matchMedia("(max-width: 640px)").matches;

const recentOrders = [
  { id: 'ORD-001', product: 'SBO 15 kg Jar', quantity: 50, status: 'Processing', amount: 62500 },
  { id: 'ORD-002', product: 'SFO 15 Ltr Lt Bucket', quantity: 75, status: 'Shipped', amount: 67500 },
  { id: 'ORD-003', product: 'Weather Shield Paint', quantity: 30, status: 'Delivered', amount: 47400 },
  { id: 'ORD-004', product: 'KGMO 15 Ltr Tin', quantity: 100, status: 'Processing', amount: 89000 },
];

const notifications = [
  { id: 1, type: 'credit', message: 'Credit limit utilization at 78%', time: '2 hours ago', urgent: true },
  { id: 2, type: 'dispatch', message: 'Order ORD-002 dispatched from warehouse', time: '4 hours ago', urgent: false },
  { id: 3, type: 'achievement', message: 'Monthly target achieved! 🎉', time: '1 day ago', urgent: false },
];

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleContact = () => {
    setIsContactOpen(!isContactOpen);
  };
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const mtdSales = 450;
  const monthlyTarget = 1000;
  const achievementPercentage = (mtdSales / monthlyTarget) * 100;
  const creditLimit = 500000;
  const creditUsed = 390000;
  const creditUtilization = (creditUsed / creditLimit) * 100;

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing': return 'default';
      case 'Shipped': return 'secondary';
      case 'Delivered': return 'default';
      default: return 'outline';
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'credit': return <AlertTriangle className="w-4 h-4" />;
      case 'dispatch': return <Truck className="w-4 h-4" />;
      case 'achievement': return <CheckCircle className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  return (

    <div className="flex h-screen font-sans">

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">



        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4">


          <div className="p-6 space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back! Here's your business overview</p>
            </div>

            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Credit Limit</CardTitle>
                  <IndianRupee className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{(creditLimit - creditUsed).toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground mb-2">
                    Available out of ₹{creditLimit.toLocaleString()}
                  </div>
                  <Progress value={creditUtilization} className="h-2" />
                  <div className="text-xs text-muted-foreground mt-1">
                    {creditUtilization.toFixed(1)}% utilized
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Target</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{monthlyTarget.toLocaleString()} MT</div>
                  <div className="text-xs text-muted-foreground mb-2">
                    Target for {currentMonth}
                  </div>
                  <Progress value={achievementPercentage} className="h-2" />
                  <div className="text-xs text-green-600 mt-1">
                    {achievementPercentage.toFixed(1)}% achieved
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">MTD Sales</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mtdSales.toLocaleString()} MT</div>
                  <p className="text-xs text-muted-foreground">
                    Month to date sales
                  </p>
                  <div className="text-xs text-green-600 mt-1">
                    +12.5% from last month
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Achievement</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{achievementPercentage.toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground">
                    Of monthly target
                  </p>
                  <div className="text-xs text-blue-600 mt-1">
                    ₹{(monthlyTarget - mtdSales).toLocaleString()} remaining
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sales vs Target Trend</CardTitle>
                  <CardDescription>Monthly performance comparison</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']} />
                      <Bar dataKey="target" fill="#e2e8f0" name="Target" />
                      <Bar dataKey="sales" fill="#3b82f6" name="Sales" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Product Mix</CardTitle>
                  <CardDescription>Sales distribution by product category</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300} >
                    <PieChart >
                      {/* <Pie
                        data={productMix}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name} ${(value).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {productMix.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie> */}
                      <Pie
                        data={productMix}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name} ${(value).toFixed(0)}%`}
                        outerRadius={isMobile ? 75 : 100}
                        dataKey="value"
                      >
                        {productMix.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>

                    </PieChart>
                  </ResponsiveContainer>
                  {/* <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={productMix}
                        cx="50%"
                        cy="50%"
                        outerRadius="80%"
                        dataKey="value"
                        label={
                          window.innerWidth > 640
                            ? ({ name, value }) => `${name} ${(value).toFixed(0)}%`
                            : false
                        }
                      >
                        {productMix.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} /> // ✅ color from productMix
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        formatter={(value, entry, index) => {
                          const product = productMix.find((p) => p.name === value);
                          return (
                            <span style={{ color: product?.color || "#000" }}>
                              {value}-{product?.value}%
                            </span>
                          );
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer> */}

                </CardContent>
              </Card>
            </div>



            {/* Recent Orders and Notifications */}
            {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Recent Orders
                  </CardTitle>
                  <CardDescription>Your latest order activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium">{order.id}</div>
                          <div className="text-sm text-muted-foreground">{order.product}</div>
                          <div className="text-xs text-muted-foreground">Qty: {order.quantity}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">₹{order.amount.toLocaleString()}</div>
                          <Badge variant={getStatusColor(order.status)}>{order.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="w-5 h-5 mr-2" />
                    Recent Notifications
                  </CardTitle>
                  <CardDescription>Important updates and alerts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`flex items-start space-x-3 p-3 rounded-lg ${notification.urgent ? 'bg-red-50 border-red-200' : 'bg-gray-50'
                          }`}
                      >
                        <div className={`${notification.urgent ? 'text-red-600' : 'text-gray-600'}`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">{notification.message}</div>
                          <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <Clock className="w-3 h-3 mr-1" />
                            {notification.time}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div> */}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Frequently used features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => navigate("/pricing")}>
                    <IndianRupee className="w-8 h-8 text-blue-600 mb-2" />
                    <span className="text-sm font-medium">View Pricing</span>
                  </div>
                  <div className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => navigate("/reports")}>
                    <FileText className="w-8 h-8 text-green-600 mb-2" />
                    <span className="text-sm font-medium"> Report</span>
                  </div>
                  <div className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => navigate("/dispatch")}>
                    <Truck className="w-8 h-8 text-orange-600 mb-2" />
                    <span className="text-sm font-medium">Track Dispatch</span>
                  </div>
                  <div className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => navigate("/notifications")}>
                    <Bell className="w-8 h-8 text-purple-600 mb-2" />
                    <span className="text-sm font-medium">View Alerts</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        {/* Footer */}
        <footer className="bg-gray-200 text-center py-4 text-sm text-gray-600">
          2025 © Kriti Industries India Limited.
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;