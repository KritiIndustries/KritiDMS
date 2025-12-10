
import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "./ui/table";
import { Alert, AlertTitle, AlertDescription } from "./ui/alert";
import { AlertCircle } from "lucide-react";

export default function PendingContracts() {
  const storedDealer = JSON.parse(localStorage.getItem("dealerData"));
  const custCode = storedDealer?.UserName || "";

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  // ✅ Set fromDate = today - 15 days
  const firstDayOfMonth = new Date();
  firstDayOfMonth.setDate(today.getDate() - 15);

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

  const [skuData, setSkuData] = useState([]);
  const [fromDate, setFromDate] = useState(formatForInput(firstDayOfMonth));
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
  const fetchSkuData = async () => {
    try {
      setLoading(true);
      const config = {
        method: "get",
        url: "http://udaan.kritinutrients.com/dealer/getMaterial",
      };
      const response = await axios(config);
      const apiSkus = response.data.data;
      setSkuData(apiSkus);
    } catch (err) {
      console.error("Error fetching SKU data:", err);
      setError("Failed to load SKU data.");
    } finally {
      setLoading(false);
    }
  };

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
            const invoiceNumbers =
              del.InvoiceSet?.results.map((inv) => inv.INVOICE_NO_I).join(", ") || "";
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

      // ✅ 🔥 Filter only contracts which DON'T have invoice number
      const withoutInvoice = uniqueOrders.filter(
        (order) => !order.INVOICE_NUMBERS || order.INVOICE_NUMBERS === "-" || order.INVOICE_NUMBERS.trim() === ""
      );
      const parseSAPDate = (sapDate) => {
        if (!sapDate || sapDate.length !== 8) return new Date(0);
        const year = Number(sapDate.substring(0, 4));
        const month = Number(sapDate.substring(4, 6)) - 1;
        const day = Number(sapDate.substring(6, 8));
        return new Date(year, month, day);
      };
      const todayDate = new Date();
      const activeOrders = withoutInvoice.filter((order) => {
        const expiryDate = parseSAPDate(order.TO_DATE);
        return expiryDate >= todayDate;
      });


      const sortedOrders = activeOrders.sort((a, b) => {
        const dateA = parseSAPDate(a.TO_DATE);
        const dateB = parseSAPDate(b.TO_DATE);

        if (dateA.getTime() === dateB.getTime()) {
          // Secondary sort: Sales Order Number ascending
          return Number(a.S_ORDER_NO) - Number(b.S_ORDER_NO);
        }
        return dateA - dateB;
      });
      setSalesOrders(sortedOrders);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch sales orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  // const fetchSalesOrders = async () => {
  //   if (!custCode) {
  //     setError("Customer code not found in local storage.");
  //     return;
  //   }

  //   setLoading(true);
  //   setError("");

  //   // Create TODAY in SAP numeric format yyyyMMdd
  //   const today = new Date();
  //   const todayNum = Number(
  //     `${today.getFullYear()}${String(today.getMonth() + 1).padStart(
  //       2,
  //       "0"
  //     )}${String(today.getDate()).padStart(2, "0")}`
  //   );

  //   const apiUrl = `api/sap/opu/odata/sap/ZSALES_ORDER_VIEW_SRV/SalesOrderSet?$filter=FROM_DATE eq '${formatForAPI(
  //     fromDate
  //   )}' and CUST_CODE_S eq '${custCode}'&$expand=DeliveryOrderSet/InvoiceSet`;

  //   try {
  //     const response = await axios.get(apiUrl, {
  //       auth: { username: "dev01", password: "Kriti@12" },
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //       },
  //     });

  //     const data = response.data.d.results || [];

  //     let allOrders = [];
  //     data.forEach((order) => {
  //       if (order.DeliveryOrderSet?.results.length > 0) {
  //         order.DeliveryOrderSet.results.forEach((del) => {
  //           const invoiceNumbers =
  //             del.InvoiceSet?.results?.map((inv) => inv.INVOICE_NO_I).join(", ") ||
  //             "";
  //           allOrders.push({ ...order, INVOICE_NUMBERS: invoiceNumbers });
  //         });
  //       } else {
  //         allOrders.push({ ...order, INVOICE_NUMBERS: "-" });
  //       }
  //     });

  //     const uniqueOrders = removeDuplicateOrders(allOrders);

  //     // Remove orders with invoice
  //     const withoutInvoice = uniqueOrders.filter(
  //       (o) =>
  //         !o.INVOICE_NUMBERS ||
  //         o.INVOICE_NUMBERS === "-" ||
  //         o.INVOICE_NUMBERS.trim() === ""
  //     );

  //     // Convert 20251128 → numeric for comparison
  //     const parseSAPNumber = (val) => {
  //       if (!val) return null;
  //       const cleaned = val.replace(/[^0-9]/g, "");
  //       return cleaned.length === 8 ? Number(cleaned) : null;
  //     };

  //     // FINAL FILTER: SHOW only future or active saudas
  //     const activeOrders = withoutInvoice.filter((order) => {
  //       const toNum = parseSAPNumber(order.TO_DATE);
  //       return toNum && toNum >= todayNum;
  //     });

  //     const sortedOrders = activeOrders.sort((a, b) => {
  //       const aDate = parseSAPNumber(a.TO_DATE);
  //       const bDate = parseSAPNumber(b.TO_DATE);
  //       return aDate - bDate || Number(a.S_ORDER_NO) - Number(b.S_ORDER_NO);
  //     });

  //     setSalesOrders(sortedOrders);
  //   } catch (err) {
  //     console.error(err);
  //     setError("Failed to fetch sales orders. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };


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

      {/* <Card>
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
        </Card> */}

      {loading &&
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="h-4 bg-gray-300 rounded w-24 animate-pulse"></div>
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="h-4 bg-gray-300 rounded w-32 animate-pulse"></div>
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="h-4 bg-gray-300 rounded w-20 animate-pulse"></div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">

              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>}

      {salesOrders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Sauda</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contract Number</TableHead>
                  <TableHead>Material Description</TableHead>
                  <TableHead>List Price</TableHead>
                  <TableHead>Date of Sales Order</TableHead>
                  <TableHead>From Date</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Quantities</TableHead>
                  <TableHead>Delivery No.</TableHead>
                  {/* <TableHead>Vehicle No.</TableHead>
                    <TableHead>Driver Name</TableHead>
                    <TableHead>Invoice Number</TableHead> */}
                </TableRow>
              </TableHeader>
              {console.log(salesOrders)}
              <TableBody>
                {salesOrders.map((order) => (
                  <TableRow key={`${order.S_ORDER_NO}_${order.QUANTITIES_S}`}>
                    <TableCell>{order.S_ORDER_NO}</TableCell>
                    <TableCell>{order.MATERIAL_DES_S}</TableCell>
                    <TableCell>
                      {(order.NET_PRICE_S / Math.trunc(Number(order.QUANTITIES_S))).toFixed(2)}
                    </TableCell>

                    <TableCell>{formatSAPDate(order.CREATIONDATE_S)}</TableCell>
                    <TableCell>{formatSAPDate(order.FROM_DATE)}</TableCell>
                    <TableCell>{formatSAPDate(order.TO_DATE)}</TableCell>
                    <TableCell>{Math.trunc(Number(order.QUANTITIES_S))}</TableCell>
                    <TableCell> {order.DELIVERY_NO_S || "-"}   </TableCell>
                    {/* <TableCell>{order.VEHICLENO || "-"}</TableCell>
                      <TableCell>{order.DRIVERNAME || "-"}</TableCell>
                      <TableCell>{order.INVOICE_NUMBERS}</TableCell>  */}
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