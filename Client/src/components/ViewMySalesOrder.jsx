


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


