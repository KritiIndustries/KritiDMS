// import React, { useState } from "react";
// import axios from "axios";

// export default PendingContracts = () => {
//     const [fromDate, setFromDate] = useState("");
//     const [toDate, setToDate] = useState("");
//     const [orders, setOrders] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [expandedOrder, setExpandedOrder] = useState(null);
//     const [error, setError] = useState("");

//     const fetchOrders = async () => {
//         try {
//             setError("");
//             setLoading(true);

//             const dealerData = JSON.parse(localStorage.getItem("storeDealer"));
//             const custCode = dealerData?.UserName;

//             if (!fromDate || !toDate || !custCode) {
//                 setError("Please select date range and ensure Dealer info is stored.");
//                 setLoading(false);
//                 return;
//             }

//             // Format date to DD.MM.YYYY for SAP API
//             const formatDate = (dateStr) => {
//                 const [yyyy, mm, dd] = dateStr.split("-");
//                 return `${dd}.${mm}.${yyyy}`;
//             };

//             const url = `http://182.74.4.110:1084/sap/opu/odata/sap/ZSALES_ORDER_VIEW_SRV/SalesOrderSet?$filter=FROM_DATE eq '${formatDate(
//                 fromDate
//             )}' and TO_DATE eq '${formatDate(
//                 toDate
//             )}' and CUST_CODE_S eq '${custCode}' and VTWEG_S eq '' and SPART_S eq '' and MATERIAL_S eq ''&$expand=DeliveryOrderSet/InvoiceSet`;

//             const res = await axios.get(url, {
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//             });

//             const data = res.data?.d?.results || [];
//             setOrders(data);
//         } catch (err) {
//             console.error("Error fetching data:", err);
//             setError("Failed to load data from SAP OData Service");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="p-6 bg-gray-50 min-h-screen">
//             <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">
//                 📦 My Sales Orders
//             </h1>

//             {/* --- Filter Section --- */}
//             <div className="bg-white shadow-md p-4 rounded-xl mb-6 flex flex-col md:flex-row gap-4 justify-center items-center">
//                 <div>
//                     <label className="text-sm text-gray-600 mr-2">From Date:</label>
//                     <input
//                         type="date"
//                         className="border p-2 rounded-md"
//                         value={fromDate}
//                         onChange={(e) => setFromDate(e.target.value)}
//                     />
//                 </div>
//                 <div>
//                     <label className="text-sm text-gray-600 mr-2">To Date:</label>
//                     <input
//                         type="date"
//                         className="border p-2 rounded-md"
//                         value={toDate}
//                         onChange={(e) => setToDate(e.target.value)}
//                     />
//                 </div>
//                 <button
//                     onClick={fetchOrders}
//                     disabled={loading}
//                     className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-md"
//                 >
//                     {loading ? "Loading..." : "Search"}
//                 </button>
//             </div>

//             {error && (
//                 <p className="text-center text-red-500 font-medium mb-4">{error}</p>
//             )}

//             {/* --- Orders List --- */}
//             {orders.length === 0 && !loading && !error && (
//                 <p className="text-center text-gray-500">No orders found.</p>
//             )}

//             <div className="space-y-4">
//                 {orders.map((order, index) => (
//                     <div
//                         key={index}
//                         className="bg-white rounded-2xl shadow-md p-4 border border-gray-200"
//                     >
//                         {/* --- Sales Order Header --- */}
//                         <div
//                             className="flex justify-between cursor-pointer"
//                             onClick={() =>
//                                 setExpandedOrder(expandedOrder === index ? null : index)
//                             }
//                         >
//                             <div>
//                                 <h2 className="text-lg font-semibold text-gray-800">
//                                     Order No: {order.S_ORDER_NO}
//                                 </h2>
//                                 <p className="text-sm text-gray-500">
//                                     Customer: {order.CUSTNAME} ({order.CUST_CODE_S})
//                                 </p>
//                                 <p className="text-sm text-gray-500">
//                                     Material: {order.MATERIAL_DES_S}
//                                 </p>
//                             </div>
//                             <div className="text-right">
//                                 <p className="text-sm font-semibold text-gray-600">
//                                     Net: ₹{order.NET_PRICE_S}
//                                 </p>
//                                 <p className="text-xs text-gray-400">{order.ORDER_STATUS}</p>
//                             </div>
//                         </div>

//                         {/* --- Expandable Delivery + Invoice --- */}
//                         {expandedOrder === index && (
//                             <div className="mt-3 border-t border-gray-200 pt-3 space-y-3">
//                                 {order.DeliveryOrderSet?.results?.length > 0 ? (
//                                     order.DeliveryOrderSet.results.map((delivery, dIdx) => (
//                                         <div
//                                             key={dIdx}
//                                             className="bg-gray-50 p-3 rounded-xl border border-gray-100"
//                                         >
//                                             <p className="font-medium text-gray-700">
//                                                 🚚 Delivery No: {delivery.DELIVERY_NO_D}
//                                             </p>
//                                             <p className="text-sm text-gray-500">
//                                                 Date: {delivery.DELIVERY_DATE} | Vehicle:{" "}
//                                                 {delivery.VEHICLENO || "N/A"} | Driver:{" "}
//                                                 {delivery.DRIVERNAME || "N/A"}
//                                             </p>

//                                             {/* --- Invoice Section --- */}
//                                             {delivery.InvoiceSet?.results?.length > 0 && (
//                                                 <div className="mt-2 pl-4 border-l-2 border-gray-300">
//                                                     {delivery.InvoiceSet.results.map((inv, iIdx) => (
//                                                         <div
//                                                             key={iIdx}
//                                                             className="bg-white p-2 rounded-lg shadow-sm mt-2 border"
//                                                         >
//                                                             <p className="text-sm text-gray-600">
//                                                                 🧾 Invoice No: {inv.INVOICE_NO_I}
//                                                             </p>
//                                                             <p className="text-xs text-gray-500">
//                                                                 Material: {inv.MATERIAL_DES_I} | Qty:{" "}
//                                                                 {inv.QUANTITIES_I} {inv.UNIT_I}
//                                                             </p>
//                                                             <p className="text-xs text-gray-500">
//                                                                 Net: ₹{inv.NET_PRICE_I} | Tax: ₹{inv.TAX_I}
//                                                             </p>
//                                                         </div>
//                                                     ))}
//                                                 </div>
//                                             )}
//                                         </div>
//                                     ))
//                                 ) : (
//                                     <p className="text-sm text-gray-400 pl-2">
//                                         No delivery records found.
//                                     </p>
//                                 )}
//                             </div>
//                         )}
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };




// import { useState, useEffect } from "react";
// import axios from "axios";
// import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
// import { Input } from "./ui/input";
// import { Button } from "./ui/button";
// import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "./ui/table";
// import { Alert, AlertTitle, AlertDescription } from "./ui/alert";
// import { AlertCircle } from "lucide-react";

// export default function PendingContracts() {
//     const storedDealer = JSON.parse(localStorage.getItem("dealerData"));
//     const custCode = storedDealer?.UserName || "";

//     const today = new Date();
//     const yesterday = new Date();
//     yesterday.setDate(today.getDate() - 1);
//     // ✅ Format date to yyyy-MM-dd for <input type="date">
//     const formatForInput = (date) => {
//         const yyyy = date.getFullYear();
//         const mm = String(date.getMonth() + 1).padStart(2, "0");
//         const dd = String(date.getDate()).padStart(2, "0");
//         return `${yyyy}-${mm}-${dd}`;
//     };
//     // ✅ Convert yyyy-MM-dd (from input) to dd.MM.yyyy (for API)
//     const formatForAPI = (dateStr) => {
//         const [yyyy, mm, dd] = dateStr.split("-");
//         return `${dd}.${mm}.${yyyy}`;
//     };

//     function formatSAPDate(sapDate) {
//         if (!sapDate || sapDate.length !== 8) return '';

//         const year = sapDate.substring(0, 4);
//         const month = sapDate.substring(4, 6);
//         const day = sapDate.substring(6, 8);

//         return `${day}.${month}.${year}`;
//     }

//     const formatDDMMYYYY = (date) => {
//         const dd = String(date.getDate()).padStart(2, "0");
//         const mm = String(date.getMonth() + 1).padStart(2, "0");
//         const yyyy = date.getFullYear();
//         return `${dd}.${mm}.${yyyy}`;
//     };

//     const [fromDate, setFromDate] = useState(formatDDMMYYYY(yesterday));
//     const [toDate, setToDate] = useState(formatDDMMYYYY(today));
//     const [salesOrders, setSalesOrders] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState("");

//     const fetchSalesOrders = async () => {
//         if (!custCode) {
//             setError("Customer code not found in local storage.");
//             return;
//         }
//         setLoading(true);
//         setError("");
//         //const apiUrl = `api/sap/opu/odata/sap/ZSALES_ORDER_VIEW_SRV/SalesOrderSet?$filter=FROM_DATE eq '${fromDate}' and TO_DATE eq '${toDate}' and CUST_CODE_S eq '${100329}'&$expand=DeliveryOrderSet/InvoiceSet`;
//         const apiUrl = `api/sap/opu/odata/sap/ZSALES_ORDER_VIEW_SRV/SalesOrderSet?$filter=FROM_DATE eq '${formatForAPI(fromDate)}' and TO_DATE eq '${formatForAPI(toDate)}' and CUST_CODE_S eq '${100329}'&$expand=DeliveryOrderSet/InvoiceSet`;


//         try {
//             const response = await axios.get(apiUrl, {
//                 auth: { username: "dev01", password: "Kriti@12" },
//                 headers: {
//                     Accept: "application/json",
//                     "Content-Type": "application/json",
//                 },
//             });
//             setSalesOrders(response.data.d.results || []);
//         } catch (err) {
//             console.error(err);
//             setError("Failed to fetch sales orders. Please try again.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchSalesOrders();
//     }, []);

//     return (
//         <div className="p-6 space-y-6">
//             {error && (
//                 <Alert variant="destructive">
//                     <AlertCircle className="h-4 w-4" />
//                     <AlertTitle>Error</AlertTitle>
//                     <AlertDescription>{error}</AlertDescription>
//                 </Alert>
//             )}
//             <Card>
//                 <CardHeader>
//                     <CardTitle>Filter Sales Orders</CardTitle>
//                 </CardHeader>
//                 <CardContent className="flex gap-4 items-end">
//                     <div>
//                         <label className="block text-sm mb-1">From Date</label>
//                         <Input
//                             type="Date"
//                             value={fromDate}
//                             onChange={(e) => setFromDate(e.target.value)}
//                             placeholder="dd.mm.yyyy"
//                         />
//                     </div>
//                     <div>
//                         <label className="block text-sm mb-1">To Date</label>
//                         <Input
//                             type="Date"
//                             value={toDate}
//                             onChange={(e) => setToDate(e.target.value)}
//                             placeholder="dd.mm.yyyy"
//                         />
//                     </div>
//                     <Button onClick={fetchSalesOrders}>Search</Button>
//                 </CardContent>
//             </Card>

//             {loading && <p>Loading sales orders...</p>}

//             {salesOrders.length > 0 && (
//                 <Card>
//                     <CardHeader>
//                         <CardTitle>Sales Orders</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                         <Table>
//                             <TableHeader>
//                                 <TableRow>
//                                     <TableHead>Sales Order</TableHead>
//                                     <TableHead>Material Description</TableHead>
//                                     <TableHead>Date of Sales Order</TableHead>
//                                     <TableHead>From Date</TableHead>
//                                     <TableHead>To Date</TableHead>
//                                     <TableHead>Quantities</TableHead>
//                                     <TableHead>Delivery No.</TableHead>
//                                     <TableHead>Vehicle No.</TableHead>
//                                     <TableHead>Driver Name</TableHead>
//                                     <TableHead>Invoice Number</TableHead>
//                                 </TableRow>
//                             </TableHeader>
//                             <TableBody>
//                                 {salesOrders.map((order) => {
//                                     // If multiple delivery orders, show multiple rows
//                                     if (order.DeliveryOrderSet?.results.length > 0) {
//                                         return order.DeliveryOrderSet.results.map((del) => {
//                                             const invoiceNumbers = del.InvoiceSet?.results
//                                                 .map((inv) => inv.INVOICE_NO_I)
//                                                 .join(", ") || "";
//                                             return (
//                                                 <TableRow key={order.S_ORDER_NO + del.DELIVERY_NO_D}>
//                                                     <TableCell>{order.S_ORDER_NO}</TableCell>
//                                                     <TableCell>{order.MATERIAL_DES_S}</TableCell>
//                                                     <TableCell>{formatSAPDate(order.CREATIONDATE_S)}</TableCell>
//                                                     <TableCell>{fromDate}</TableCell>
//                                                     <TableCell>{toDate}</TableCell>
//                                                     <TableCell>{order.QUANTITIES_S}</TableCell>
//                                                     <TableCell>{del.DELIVERY_NO_D}</TableCell>
//                                                     <TableCell>{del.VEHICLENO}</TableCell>
//                                                     <TableCell>{del.DRIVERNAME}</TableCell>
//                                                     <TableCell>{invoiceNumbers}</TableCell>
//                                                 </TableRow>
//                                             );
//                                         });
//                                     } else {
//                                         return (
//                                             <TableRow key={order.S_ORDER_NO}>
//                                                 <TableCell>{order.S_ORDER_NO}</TableCell>
//                                                 <TableCell>{order.MATERIAL_DES_S}</TableCell>
//                                                 <TableCell>{formatSAPDate(order.CREATIONDATE_S)}</TableCell>
//                                                 <TableCell>{fromDate}</TableCell>
//                                                 <TableCell>{toDate}</TableCell>
//                                                 <TableCell>{order.QUANTITIES_S}</TableCell>
//                                                 <TableCell>{order.DELIVERY_NO_S}</TableCell>
//                                                 <TableCell>{order.VEHICLENO || "-"}</TableCell>
//                                                 <TableCell>{order.DRIVERNAME || "-"}</TableCell>
//                                                 <TableCell>-</TableCell>
//                                             </TableRow>
//                                         );
//                                     }
//                                 })}
//                             </TableBody>
//                         </Table>
//                     </CardContent>
//                 </Card>
//             )}

//             {!loading && salesOrders.length === 0 && <p>No sales orders found.</p>}
//         </div>
//     );
// }


import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "./ui/table";
import { Alert, AlertTitle, AlertDescription } from "./ui/alert";
import { AlertCircle } from "lucide-react";

export default function ViewMySalesOrder() {
    const storedDealer = JSON.parse(localStorage.getItem("dealerData"));
    const custCode = storedDealer?.UserName || "";

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    // ✅ Format date to yyyy-MM-dd for <input type="date">
    const formatForInput = (date) => {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
    };

    // ✅ Convert yyyy-MM-dd (from input) to dd.MM.yyyy (for API)
    const formatForAPI = (dateStr) => {
        const [yyyy, mm, dd] = dateStr.split("-");
        return `${dd}.${mm}.${yyyy}`;
    };

    // ✅ Convert SAP date 20251020 → 20.10.2025
    function formatSAPDate(sapDate) {
        if (!sapDate || sapDate.length !== 8) return "";
        const year = sapDate.substring(0, 4);
        const month = sapDate.substring(4, 6);
        const day = sapDate.substring(6, 8);
        return `${day}.${month}.${year}`;
    }

    const [fromDate, setFromDate] = useState(formatForInput(yesterday));
    const [toDate, setToDate] = useState(formatForInput(today));
    const [salesOrders, setSalesOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // ✅ Remove duplicates (same S_ORDER_NO + same QUANTITIES_S)
    const removeDuplicateOrders = (orders) => {
        const uniqueMap = new Map();
        orders.forEach((order) => {
            const key = `${order.S_ORDER_NO}_${order.QUANTITIES_S}`;
            if (!uniqueMap.has(key)) {
                uniqueMap.set(key, order);
            }
        });
        return Array.from(uniqueMap.values());
    };

    // const fetchSalesOrders = async () => {
    //     if (!custCode) {
    //         setError("Customer code not found in local storage.");
    //         return;
    //     }
    //     setLoading(true);
    //     setError("");

    //     const apiUrl = `api/sap/opu/odata/sap/ZSALES_ORDER_VIEW_SRV/SalesOrderSet?$filter=FROM_DATE eq '${formatForAPI(fromDate)}' and TO_DATE eq '${formatForAPI(toDate)}' and CUST_CODE_S eq '${custCode}'&$expand=DeliveryOrderSet/InvoiceSet`;

    //     try {
    //         const response = await axios.get(apiUrl, {
    //             auth: { username: "dev01", password: "Kriti@12" },
    //             headers: {
    //                 Accept: "application/json",
    //                 "Content-Type": "application/json",
    //             },
    //         });

    //         const data = response.data.d.results || [];

    //         // ✅ Flatten nested DeliveryOrderSet results
    //         let allOrders = [];
    //         data.forEach((order) => {
    //             if (order.DeliveryOrderSet?.results.length > 0) {
    //                 order.DeliveryOrderSet.results.forEach((del) => {
    //                     const invoiceNumbers = del.InvoiceSet?.results
    //                         .map((inv) => inv.INVOICE_NO_I)
    //                         .join(", ") || "";
    //                     allOrders.push({
    //                         ...order,
    //                         DELIVERY_NO_S: del.DELIVERY_NO_D,
    //                         VEHICLENO: del.VEHICLENO,
    //                         DRIVERNAME: del.DRIVERNAME,
    //                         INVOICE_NUMBERS: invoiceNumbers,
    //                     });
    //                 });
    //             } else {
    //                 allOrders.push({
    //                     ...order,
    //                     INVOICE_NUMBERS: "-",
    //                 });
    //             }
    //         });

    //         // ✅ Remove duplicate orders
    //         const uniqueOrders = removeDuplicateOrders(allOrders);
    //         setSalesOrders(uniqueOrders);
    //     } catch (err) {
    //         console.error(err);
    //         setError("Failed to fetch sales orders. Please try again.");
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const fetchSalesOrders = async () => {
        if (!custCode) {
            setError("Customer code not found in local storage.");
            return;
        }
        setLoading(true);
        setError("");

        const apiUrl = `api/sap/opu/odata/sap/ZSALES_ORDER_VIEW_SRV/SalesOrderSet?$filter=FROM_DATE eq '${formatForAPI(fromDate)}' and TO_DATE eq '${formatForAPI(toDate)}' and CUST_CODE_S eq '${custCode}'&$expand=DeliveryOrderSet/InvoiceSet`;

        try {
            const response = await axios.get(apiUrl, {
                auth: { username: "dev01", password: "Kriti@12" },
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            });

            const data = response.data.d.results || [];

            // ✅ Flatten nested DeliveryOrderSet results
            let allOrders = [];
            data.forEach((order) => {
                if (order.DeliveryOrderSet?.results.length > 0) {
                    order.DeliveryOrderSet.results.forEach((del) => {
                        // ✅ Remove duplicate invoice numbers
                        const invoiceNumbers = Array.from(
                            new Set(
                                del.InvoiceSet?.results.map((inv) => inv.INVOICE_NO_I)
                            )
                        ).join(", ") || "";

                        allOrders.push({
                            ...order,
                            DELIVERY_NO_S: del.DELIVERY_NO_D,
                            VEHICLENO: del.VEHICLENO,
                            DRIVERNAME: del.DRIVERNAME,
                            INVOICE_NUMBERS: invoiceNumbers,
                        });
                    });
                } else {
                    allOrders.push({
                        ...order,
                        INVOICE_NUMBERS: "-",
                    });
                }
            });

            // ✅ Remove duplicate orders
            const uniqueOrders = removeDuplicateOrders(allOrders);
            setSalesOrders(uniqueOrders);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch sales orders. Please try again.");
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchSalesOrders();
    }, []);
    return (
        <div className="p-6 space-y-6">
            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Filter Sales Orders</CardTitle>
                </CardHeader>
                <CardContent className="flex gap-4 items-end">
                    <div>
                        <label className="block text-sm mb-1">From Date</label>
                        <Input
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm mb-1">To Date</label>
                        <Input
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                        />
                    </div>
                    <Button onClick={fetchSalesOrders}>Search</Button>
                </CardContent>
            </Card>
            {loading && <p>Loading sales orders...</p>}
            {salesOrders.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Sales Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Sales Order</TableHead>
                                    <TableHead>Material Description</TableHead>
                                    <TableHead>Date of Sales Order</TableHead>
                                    <TableHead>From Date</TableHead>
                                    <TableHead>To Date</TableHead>
                                    <TableHead>Quantities</TableHead>
                                    <TableHead>Delivery No.</TableHead>
                                    <TableHead>Vehicle No.</TableHead>
                                    <TableHead>Driver Name</TableHead>
                                    <TableHead>Invoice Number</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {salesOrders.map((order) => (
                                    <TableRow key={`${order.S_ORDER_NO}_${order.QUANTITIES_S}`}>
                                        <TableCell>{order.S_ORDER_NO}</TableCell>
                                        <TableCell>{order.MATERIAL_DES_S}</TableCell>
                                        <TableCell>{formatSAPDate(order.CREATIONDATE_S)}</TableCell>
                                        <TableCell>{formatSAPDate(order.FROM_DATE)}</TableCell>
                                        <TableCell>{formatSAPDate(order.TO_DATE)}</TableCell>
                                        <TableCell>{order.QUANTITIES_S}</TableCell>
                                        <TableCell>{order.DELIVERY_NO_S}</TableCell>
                                        <TableCell>{order.VEHICLENO || "-"}</TableCell>
                                        <TableCell>{order.DRIVERNAME || "-"}</TableCell>
                                        <TableCell>{order.INVOICE_NUMBERS}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}

            {!loading && salesOrders.length === 0 && <p>No sales orders found.</p>}
        </div>
    );
}


