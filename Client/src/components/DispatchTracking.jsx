
//this is with dummy data
// import React, { useState } from 'react';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
// import { Badge } from './ui/badge';
// import { Button } from './ui/button';
// import { Input } from './ui/input';
// import { Progress } from './ui/progress';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
// import {
//   Truck,
//   MapPin,
//   Clock,
//   CheckCircle,
//   AlertCircle,
//   Search,
//   RefreshCw,
//   Route,
//   Phone,
//   Package
// } from 'lucide-react';
// import axios from 'axios';

// const dispatchData = [
//   {
//     id: 'DO-2025-001',
//     vehicleNo: 'MH12AB1234',
//     driver: 'Rajesh Kumar',
//     driverPhone: '+91 98765 43210',
//     // status: 'In Transit',
//     location: 'Mumbai - Pune Highway',
//     destination: 'Dewas',
//     progress: 65,
//     estimatedDelivery: '2025-01-06 14:00',
//     dispatchTime: '2025-01-05 08:00',
//     items: 5,
//     value: 125000
//   },
//   {
//     id: 'DO-2025-002',
//     vehicleNo: 'MP09CD5678',
//     driver: 'Suresh Patel',
//     driverPhone: '+91 98765 43211',
//     // status: 'Delivered',
//     location: 'Jabalpur Warehouse',
//     destination: 'Jabalpur',
//     progress: 100,
//     estimatedDelivery: '2025-01-05 16:30',
//     dispatchTime: '2025-01-04 10:00',
//     items: 3,
//     value: 89000
//   },
//   {
//     id: 'DO-2025-003',
//     vehicleNo: 'RJ14EF9012',
//     driver: 'Amit Singh',
//     driverPhone: '+91 98765 43212',
//     // status: 'Loading',
//     location: 'Central Warehouse',
//     destination: 'Dewas',
//     progress: 10,
//     estimatedDelivery: '2025-01-07 12:00',
//     dispatchTime: '2025-01-05 06:00',
//     items: 8,
//     value: 156000
//   },
//   {
//     id: 'DO-2025-004',
//     vehicleNo: 'GJ05GH3456',
//     driver: 'Vinod Joshi',
//     driverPhone: '+91 98765 43213',
//     // status: 'Delayed',
//     location: 'Indore Bypass',
//     destination: 'Jabalpur',
//     progress: 45,
//     estimatedDelivery: '2025-01-06 18:00',
//     dispatchTime: '2025-01-03 14:00',
//     items: 2,
//     value: 67000
//   }
// ];

// const trackingStages = [
//   { stage: 'Vehicle Reported', progress: 0, time: "12:15 PM" },
//   { stage: 'vehicle Gate in ', progress: 25, time: "12:45 PM" },
//   { stage: 'Tare Weight', progress: 50, time: "01:05 PM" },
//   { stage: 'DO Collected', progress: 75, time: "01:55 PM" },
//   { stage: 'Gross Weight', progress: 100, time: "02:15 PM" },
//   { stage: 'Invoice', progress: 100, time: "02:35 PM" },
//   { stage: 'Vehicle Gate Out', progress: 100, time: "02:55 PM" }
// ];

// export function DispatchTracking() {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedDispatch, setSelectedDispatch] = useState(dispatchData[0]);
//   const [zfrt, setzfrt] = useState([])
//   const url = `api/sap/opu/odata/sap/ZDMS_ZFRT_DTL_SRV/ET_ZFRTSet?$filter=Billdate ge '24.09.2024' and Billdate le '24.11.2025' and Regio eq '20' and Vkorg eq '1100' &$format=json`

//   const filteredData = dispatchData.filter(item =>
//     item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     item.vehicleNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     item.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     item.destination.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'Delivered': return 'default';
//       case 'In Transit': return 'default';
//       case 'Loading': return 'secondary';
//       case 'Delayed': return 'destructive';
//       default: return 'secondary';
//     }
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case 'Delivered': return <CheckCircle className="w-4 h-4 text-green-500" />;
//       case 'In Transit': return <Truck className="w-4 h-4 text-blue-500" />;
//       case 'Loading': return <Package className="w-4 h-4 text-yellow-500" />;
//       case 'Delayed': return <AlertCircle className="w-4 h-4 text-red-500" />;
//       default: return <Clock className="w-4 h-4 text-gray-500" />;
//     }
//   };

//   const getCurrentStage = (progress) => {
//     if (progress >= 100) return 'Vehicle Gate Out';
//     if (progress >= 75) return 'Out for Delivery';
//     if (progress >= 50) return 'In Transit';
//     if (progress >= 25) return 'Loading';
//     return 'Order Confirmed';
//   };

//   const getDispatchData = async (url) => {
//     const res = axios.get(url, {
//       auth: { username: "dev01", password: "Kriti@12" },
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//       },
//     })
//     const data = res.data.d.results || [];
//     setzfrt(data)
//   }


//   return (
//     <div className="p-6 space-y-6">
//       <div className="flex justify-between items-start">
//         <div>
//           <h1 className="text-3xl font-bold flex items-center">
//             <Truck className="w-8 h-8 mr-3" />
//             Dispatch Tracking
//           </h1>
//           <p className="text-muted-foreground">Real-time vehicle status and delivery tracking</p>
//         </div>
//         <Button variant="outline">
//           <RefreshCw className="w-4 h-4 mr-2" />
//           Refresh Status
//         </Button>
//       </div>

//       {/* Search and Summary */}
//       {/* <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//         <Card className="lg:col-span-4">
//           <CardHeader>
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
//               <CardTitle>Dispatch Overview</CardTitle>
//               <div className="relative">
//                 <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//                 <Input
//                   placeholder="Search by DO, vehicle, driver..."
//                   className="pl-10 w-80"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
//             </div>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//               <div className="text-center p-4 bg-blue-50 rounded-lg">
//                 <div className="text-2xl font-bold text-blue-600">
//                   {dispatchData.filter(d => d.status === 'In Transit').length}
//                 </div>
//                 <div className="text-sm text-blue-600">In Transit</div>
//               </div>
//               <div className="text-center p-4 bg-green-50 rounded-lg">
//                 <div className="text-2xl font-bold text-green-600">
//                   {dispatchData.filter(d => d.status === 'Delivered').length}
//                 </div>
//                 <div className="text-sm text-green-600">Delivered</div>
//               </div>
//               <div className="text-center p-4 bg-yellow-50 rounded-lg">
//                 <div className="text-2xl font-bold text-yellow-600">
//                   {dispatchData.filter(d => d.status === 'Loading').length}
//                 </div>
//                 <div className="text-sm text-yellow-600">Loading</div>
//               </div>
//               <div className="text-center p-4 bg-red-50 rounded-lg">
//                 <div className="text-2xl font-bold text-red-600">
//                   {dispatchData.filter(d => d.status === 'Delayed').length}
//                 </div>
//                 <div className="text-sm text-red-600">Delayed</div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div> */}

//       {/* Main Tracking Interface */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Dispatch List */}
//         <Card className="lg:col-span-2">
//           <CardHeader>
//             <CardTitle>Active Dispatches</CardTitle>
//             <CardDescription>Click on any delivery to view detailed tracking</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-3">
//               {filteredData.map((dispatch) => (
//                 <div
//                   key={dispatch.id}
//                   className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-accent ${selectedDispatch.id === dispatch.id ? 'border-primary bg-accent' : ''
//                     }`}
//                   onClick={() => setSelectedDispatch(dispatch)}
//                 >
//                   <div className="flex items-start justify-between mb-2">
//                     <div>
//                       <h4 className="font-medium">{dispatch.id}</h4>
//                       <div className="flex items-center text-sm text-muted-foreground">
//                         <Truck className="w-3 h-3 mr-1" />
//                         {dispatch.vehicleNo} • {dispatch.driver}
//                       </div>
//                     </div>
//                     <Badge variant={getStatusColor(dispatch.status)}>
//                       {dispatch.status}
//                     </Badge>
//                   </div>

//                   <div className="space-y-2">
//                     <div className="flex items-center text-sm">
//                       <MapPin className="w-3 h-3 mr-1 text-muted-foreground" />
//                       <span>{dispatch.location} → {dispatch.destination}</span>
//                     </div>

//                     <div className="space-y-1">
//                       <div className="flex justify-between text-sm">
//                         <span>Progress</span>
//                         <span>{dispatch.progress}%</span>
//                       </div>
//                       <Progress value={dispatch.progress} />
//                     </div>

//                     <div className="flex justify-between text-xs text-muted-foreground">
//                       <span>₹{dispatch.value.toLocaleString()}</span>
//                       <span>ETA: {new Date(dispatch.estimatedDelivery).toLocaleString()}</span>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>

//         {/* Detailed Tracking */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center">
//               {getStatusIcon(selectedDispatch.status)}
//               <span className="ml-2">Tracking Details</span>
//             </CardTitle>
//             <CardDescription>{selectedDispatch.id}</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             <div className="space-y-3">
//               <div className="flex justify-between">
//                 <span className="text-sm text-muted-foreground">Status</span>
//                 <Badge variant={getStatusColor(selectedDispatch.status)}>
//                   {selectedDispatch.status}
//                 </Badge>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-sm text-muted-foreground">Vehicle</span>
//                 <span className="text-sm font-medium">{selectedDispatch.vehicleNo}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-sm text-muted-foreground">Driver</span>
//                 <span className="text-sm font-medium">{selectedDispatch.driver}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-sm text-muted-foreground">Phone</span>
//                 <Button variant="link" size="sm" className="h-auto p-0">
//                   <Phone className="w-3 h-3 mr-1" />
//                   {selectedDispatch.driverPhone}
//                 </Button>
//               </div>
//             </div>

//             <div className="space-y-3">
//               <h4 className="font-medium">Delivery Progress</h4>
//               <div className="space-y-4">
//                 {trackingStages.map((stage, index) => {
//                   const isCompleted = selectedDispatch.progress >= stage.progress;
//                   const isCurrent =
//                     selectedDispatch.progress >= stage.progress &&
//                     (index === trackingStages.length - 1 || selectedDispatch.progress < trackingStages[index + 1].progress);

//                   return (
//                     <div
//                       key={index}
//                       className="flex items-center justify-between w-full space-x-3"
//                     >
//                       {/* Left side: dot + stage text */}
//                       <div className="flex items-center space-x-3">
//                         <div
//                           className={`w-3 h-3 rounded-full ${isCompleted ? "bg-green-500" : isCurrent ? "bg-blue-500" : "bg-gray-300"
//                             }`}
//                         />
//                         <span
//                           className={`text-sm ${isCompleted
//                             ? "text-green-700 font-medium"
//                             : isCurrent
//                               ? "text-blue-700 font-medium"
//                               : "text-muted-foreground"
//                             }`}
//                         >
//                           {stage.stage}
//                         </span>
//                       </div>

//                       {isCompleted && (
//                         <span className="text-sm text-green-700 font-medium">{stage.time}</span>
//                       )}
//                     </div>


//                   );
//                 })}
//               </div>
//             </div>

//             <div className="space-y-3">
//               <h4 className="font-medium">Shipment Details</h4>
//               <div className="text-sm space-y-2">
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">Items</span>
//                   <span>{selectedDispatch.items} units</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">Value</span>
//                   <span>₹{selectedDispatch.value.toLocaleString()}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">Dispatched</span>
//                   <span>{new Date(selectedDispatch.dispatchTime).toLocaleString()}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">ETA</span>
//                   <span>{new Date(selectedDispatch.estimatedDelivery).toLocaleString()}</span>
//                 </div>
//               </div>
//             </div>

//             <div className="flex space-x-2 border">
//               {/* <Button variant="outline" size="sm" className="flex-1">
//                 <Route className="w-4 h-4 mr-2" />
//                 Track Route
//               </Button>
//               <Button variant="outline" size="sm" className="flex-1">
//                 <Phone className="w-4 h-4 mr-2" />
//                 Call Driver
//               </Button> */}
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Recent Deliveries Table */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Recent Deliveries</CardTitle>
//           <CardDescription>Complete delivery history and performance metrics</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="border rounded-lg overflow-hidden">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>DO Number</TableHead>
//                   <TableHead>Vehicle</TableHead>
//                   <TableHead>Driver</TableHead>
//                   <TableHead>Destination</TableHead>
//                   {/* <TableHead>Status</TableHead> */}
//                   <TableHead className="">Value (₹)</TableHead>
//                   {/* <TableHead>Delivery Time</TableHead> */}
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {dispatchData.map((item) => (
//                   <TableRow key={item.id}>
//                     <TableCell className="font-medium">{item.id}</TableCell>
//                     <TableCell>{item.vehicleNo}</TableCell>
//                     <TableCell>{item.driver}</TableCell>
//                     <TableCell>{item.destination}</TableCell>
//                     {/* <TableCell>
//                       <Badge variant={getStatusColor(item.status)}>
//                         {item.status}
//                       </Badge>
//                     </TableCell> */}
//                     <TableCell className="">₹{item.value.toLocaleString()}</TableCell>
//                     <TableCell>
//                       {item.status === 'Delivered'
//                         ? new Date(item.estimatedDelivery).toLocaleString()
//                         : `ETA: ${new Date(item.estimatedDelivery).toLocaleString()}`
//                       }
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }



import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Truck,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Phone,
  Package
} from "lucide-react";

import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from "./ui/table";

/* ================= HELPERS (YOUR LOGIC – KEPT AS-IS) ================= */

const parseSAPDate = (sapDate) => {
  if (!sapDate || sapDate.includes("253402")) return null;
  const ts = Number(sapDate.replace(/\D/g, ""));
  return new Date(ts);
};

const calculateProgress = (rec) => {
  if (rec.ChoutDate && !rec.ChoutDate.includes("253402")) return 100;
  if (rec.ChinDate && !rec.ChinDate.includes("253402")) return 75;
  if (rec.RptDt && !rec.RptDt.includes("253402")) return 40;
  return 10;
};

const calculateStatus = (progress) => {
  if (progress >= 100) return "Delivered";
  if (progress >= 75) return "In Transit";
  if (progress >= 40) return "Loading";
  return "Reported";
};

const countDOs = (rec) =>
  Object.keys(rec).filter(k => k.startsWith("Do") && rec[k]).length;

/* ================= UI HELPERS ================= */

const getStatusColor = (status) => {
  if (status === "Delivered") return "default";
  if (status === "In Transit") return "default";
  if (status === "Loading") return "secondary";
  return "secondary";
};

const getStatusIcon = (status) => {
  if (status === "Delivered") return <CheckCircle className="w-4 h-4 text-green-500" />;
  if (status === "In Transit") return <Truck className="w-4 h-4 text-blue-500" />;
  if (status === "Loading") return <Package className="w-4 h-4 text-yellow-500" />;
  return <Clock className="w-4 h-4 text-gray-500" />;
};

/* ================= COMPONENT ================= */

export function DispatchTracking() {
  const [dispatchData, setDispatchData] = useState([]);
  const [selectedDispatch, setSelectedDispatch] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH + NORMALIZE ================= */
  const trackingStages = [
    { stage: 'Vehicle Reported', progress: 0, time: "12:15 PM" },
    { stage: 'vehicle Gate in ', progress: 25, time: "12:45 PM" },
    { stage: 'Tare Weight', progress: 50, time: "01:05 PM" },
    { stage: 'DO Collected', progress: 75, time: "01:55 PM" },
    { stage: 'Gross Weight', progress: 100, time: "02:15 PM" },
    { stage: 'Invoice', progress: 100, time: "02:35 PM" },
    { stage: 'Vehicle Gate Out', progress: 100, time: "02:55 PM" }
  ];
  const fetchDispatchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://udaan.kritinutrients.com/dealer/dispatch");
      const sapData = res.data.data || [];
      console.log(sapData[0]);
      /* 🔥 CRITICAL PART – SHAPE MATCHING */
      setDispatchData(sapData);
      setSelectedDispatch(sapData[0] || null);

    } catch (e) {
      console.error("Dispatch fetch failed", e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDispatchData();
  }, []);

  if (loading) return <div className="p-6">Please wait...</div>;
  if (!selectedDispatch) return <div className="p-6">No dispatch data</div>;

  /* ================= RENDER (YOUR UI – UNCHANGED) ================= */

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Truck className="w-8 h-8 mr-3" />
            Dispatch Tracking
          </h1>
          <p className="text-muted-foreground">
            Real-time vehicle status and delivery tracking
          </p>
        </div>

        <Button variant="outline" onClick={fetchDispatchData}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Status
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ================= LEFT LIST ================= */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Active Dispatches</CardTitle>
            <CardDescription>
              Click on any delivery to view detailed tracking
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-3">
              {dispatchData.map((dispatch) => (
                <div
                  key={dispatch.id}
                  onClick={() => setSelectedDispatch(dispatch)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-accent ${selectedDispatch.id === dispatch.id
                    ? "border-primary bg-accent"
                    : ""
                    }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium">DO -{dispatch.dispatchId}</h4>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Truck className="w-3 h-3 mr-1" />
                        {dispatch.vehicleNo} • {dispatch.transporter}
                      </div>
                    </div>
                    <Badge variant={getStatusColor(dispatch.status)}>
                      {dispatch.status}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <MapPin className="w-3 h-3 mr-1 text-muted-foreground" />
                      <span>{dispatch.destination} </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{dispatch.progress}%</span>
                      </div>
                      <Progress value={dispatch.progress} />
                    </div>

                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>₹{dispatch.
                        totalValue.toLocaleString()}</span>
                      {/* <span>
                        ETA:{" "}
                        {dispatch.estimatedDelivery
                          ? dispatch.estimatedDelivery.toLocaleString()
                          : "-"}
                      </span> */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ================= RIGHT DETAILS ================= */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              {getStatusIcon(selectedDispatch.status)}
              <span className="ml-2">Tracking Details</span>
            </CardTitle>
            <CardDescription>{selectedDispatch.id}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">

            {/* BASIC INFO */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant={getStatusColor(selectedDispatch.status)}>
                  {selectedDispatch.status}
                </Badge>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Vehicle</span>
                <span className="text-sm font-medium">
                  {selectedDispatch.vehicleNo}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Driver</span>
                <span className="text-sm font-medium">
                  {selectedDispatch.driver}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Phone</span>
                <Button variant="link" size="sm" className="h-auto p-0">
                  <Phone className="w-3 h-3 mr-1" />
                  {selectedDispatch.driverPhone || "-"}
                </Button>
              </div>
            </div>

            {/* DELIVERY PROGRESS */}
            <div className="space-y-3">
              <h4 className="font-medium">Delivery Progress</h4>

              <div className="space-y-4">
                {trackingStages.map((stage, index) => {
                  const isCompleted = selectedDispatch.progress >= stage.progress;
                  const isCurrent =
                    selectedDispatch.progress >= stage.progress &&
                    (index === trackingStages.length - 1 ||
                      selectedDispatch.progress < trackingStages[index + 1].progress);

                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between w-full"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-3 h-3 rounded-full ${isCompleted
                            ? "bg-green-500"
                            : isCurrent
                              ? "bg-blue-500"
                              : "bg-gray-300"
                            }`}
                        />
                        <span
                          className={`text-sm ${isCompleted
                            ? "text-green-700 font-medium"
                            : isCurrent
                              ? "text-blue-700 font-medium"
                              : "text-muted-foreground"
                            }`}
                        >
                          {stage.stage}
                        </span>
                      </div>

                      {isCompleted && (
                        <span className="text-sm text-green-700 font-medium">
                          {stage.time}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SHIPMENT DETAILS */}
            <div className="space-y-3">
              <h4 className="font-medium">Shipment Details</h4>

              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Items</span>
                  <span>{selectedDispatch.items} units</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Value</span>
                  <span>
                    ₹{(selectedDispatch.value || 0).toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dispatched</span>
                  <span>
                    {selectedDispatch.dispatchTime
                      ? new Date(selectedDispatch.dispatchTime).toLocaleString()
                      : "-"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">ETA</span>
                  <span>
                    {selectedDispatch.estimatedDelivery
                      ? new Date(selectedDispatch.estimatedDelivery).toLocaleString()
                      : "-"}
                  </span>
                </div>
              </div>
            </div>

          </CardContent>
        </Card>



      </div>

      {/* ================= TABLE ================= */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Deliveries</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>DO Number</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {dispatchData.map((d) => (
                <TableRow key={d.id}>
                  <TableCell>{d.id}</TableCell>
                  <TableCell>{d.vehicleNo}</TableCell>
                  <TableCell>{d.destination}</TableCell>
                  {/* <TableCell>₹{d.value.toLocaleString()}</TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
