// TODO:Working Fine but user have to select sales order 
// import { useState, useEffect, useMemo } from "react";
// import axios from "axios";

// import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "./ui/table";
// import {
//   ShoppingCart, Plus, Minus, Trash2, Search, Filter, Package, Tag, IndianRupee, CheckCircle, AlertCircle, Package2,
//   ClipboardList,
//   Truck
// } from 'lucide-react';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
// import { Input } from "./ui/input";
// import { Separator } from './ui/separator';
// import { Button } from "./ui/button";
// import { Progress } from './ui/progress';
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "../components/ui/alert-dialog"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
// async function fetchSAPData(apiUrl) {
//   try {
//     const response = await axios.get(apiUrl, {
//       auth: {
//         username: 'dev01',
//         password: 'Kriti@12',
//       },
//       headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/json; charset=utf-8',
//       },
//     });
//     return response.data.d.results;
//   } catch (err) {
//     let errorMessage = 'Failed to fetch SAP data. Please try again later.';
//     if (err.code === 'ERR_NETWORK') {
//       errorMessage = 'Network error: Unable to connect to the API.';
//     } else if (err.response?.status === 401) {
//       errorMessage = 'Authentication failed: Invalid username or password.';
//     } else if (err.response?.status) {
//       errorMessage = `API error: ${err.response.status} - ${err.response.statusText}`;
//     }
//     throw new Error(errorMessage);
//   }
// }
// export function MyOrders() {
//   const formatForInput = (date) => {
//     const yyyy = date.getFullYear();
//     const mm = String(date.getMonth() + 1).padStart(2, "0");
//     const dd = String(date.getDate()).padStart(2, "0");
//     return `${yyyy}-${mm}-${dd}`;
//   };
//   const today = new Date();
//   const yesterday = new Date();
//   yesterday.setDate(today.getDate() - 1);
//   const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
//   const [summurySelected, setSummurySelected] = useState(false)
//   const [selectedSalesOrder, setSelectedSalesOrder] = useState({})
//   const [dealerCategory, setDealerCategory] = useState('');
//   const [searchTerm, setSearchTerm] = useState("");
//   const [skuData, setSkuData] = useState([]);
//   const [salesOrders, setSalesOrders] = useState([]);
//   const [pendingOrders, setPendingOrders] = useState([])
//   const [summary, setSummary] = useState([]);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [filteredSKU, setFilteredSKU] = useState([])
//   const [cart, setCart] = useState([]);
//   const [skuWithPrice, setSkuWithPrice] = useState({})
//   const [capacity, setCapacity] = useState(1)
//   const [subCategory, setSubCategory] = useState('BP')
//   const [fromDate, setFromDate] = useState(formatForInput(firstDayOfMonth));
//   const [toDate, setToDate] = useState(formatForInput(today));
//   const [alertMessage, setAlertMessage] = useState("");
//   const [showAlert, setShowAlert] = useState(false);

//   const storedDealer = JSON.parse(localStorage.getItem("dealerData"));
//   const custCode = storedDealer?.UserName || "";
//   const DENSITY = 1;
//   const formatForAPI = (dateStr) => {
//     const [yyyy, mm, dd] = dateStr.split("-");
//     return `${dd}.${mm}.${yyyy}`;
//   };
//   // ✅ Convert SAP date 20251020 → 20.10.2025
//   function formatSAPDate(sapDate) {
//     if (!sapDate || sapDate.length !== 8) return "";
//     const year = sapDate.substring(0, 4);
//     const month = sapDate.substring(4, 6);
//     const day = sapDate.substring(6, 8);
//     return `${day}.${month}.${year}`;
//   }
//   // Function to remove duplicate orders by Sales Order + Quantity
//   const removeDuplicateOrders = (orders) => {
//     const uniqueMap = new Map();
//     orders.forEach((order) => {
//       const key = `${order.S_ORDER_NO}_${order.QUANTITIES_S}`;
//       if (!uniqueMap.has(key)) {
//         uniqueMap.set(key, order);
//       }
//     });
//     return Array.from(uniqueMap.values());
//   };

//   // ✅ Fetch SKU data (contains Primary_category, weight, price, etc.)
//   const fetchSkuData = async () => {
//     try {
//       setLoading(true);
//       const config = {
//         method: "get",
//         url: "http://udaan.kritinutrients.com/dealer/getMaterial",
//       };
//       const response = await axios(config);
//       const apiSkus = response.data.data;
//       setSkuData(apiSkus);
//     } catch (err) {
//       console.error("Error fetching SKU data:", err);
//       setError("Failed to load SKU data.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Fetch Sales Orders (contains MATERIAL_S)
//   const fetchSalesOrders = async () => {
//     if (!custCode) {
//       setError("Customer code not found in local storage.");
//       return;
//     }
//     setLoading(true);
//     setError("");

//     const apiUrl = `api/sap/opu/odata/sap/ZSALES_ORDER_VIEW_SRV/SalesOrderSet?$filter=FROM_DATE eq '${formatForAPI(fromDate)}' and TO_DATE eq '${formatForAPI(toDate)}' and CUST_CODE_S eq '${custCode}'&$expand=DeliveryOrderSet/InvoiceSet`;

//     try {
//       const response = await axios.get(apiUrl, {
//         auth: { username: "dev01", password: "Kriti@12" },
//         headers: {
//           Accept: "application/json",
//           "Content-Type": "application/json",
//         },
//       });

//       const data = response.data.d.results || [];

//       // ✅ Flatten nested DeliveryOrderSet results
//       let allOrders = [];
//       data.forEach((order) => {
//         if (order.DeliveryOrderSet?.results.length > 0) {
//           order.DeliveryOrderSet.results.forEach((del) => {
//             const invoiceNumbers =
//               del.InvoiceSet?.results.map((inv) => inv.INVOICE_NO_I).join(", ") || "";
//             allOrders.push({
//               ...order,
//               DELIVERY_NO_S: del.DELIVERY_NO_D,
//               VEHICLENO: del.VEHICLENO,
//               DRIVERNAME: del.DRIVERNAME,
//               INVOICE_NUMBERS: invoiceNumbers,
//             });
//           });
//         } else {
//           allOrders.push({
//             ...order,
//             INVOICE_NUMBERS: "-",
//           });
//         }
//       });
//       const uniqueOrders = removeDuplicateOrders(allOrders);
//       const withoutInvoice = uniqueOrders.filter(
//         (order) => !order.INVOICE_NUMBERS || order.INVOICE_NUMBERS === "-" || order.INVOICE_NUMBERS.trim() === ""
//       );
//       setSalesOrders(withoutInvoice);
//       setPendingOrders(withoutInvoice)
//     } catch (err) {
//       console.error("Error fetching sales orders:", err);
//       setError("Failed to fetch sales orders.");
//     } finally {
//       setLoading(false);
//     }
//   };
//   const getPrice = async (sku) => {
//     try {
//       console.log(selectedSalesOrder);
//       const priceURL = `/api/sap/opu/odata/sap/ZSD_PRICING_SALES_SRV/zprice_customerSet?$filter=ZcustNo eq '${storedDealer.UserName}' and ZdistChn eq 'O3' and ZdocType eq 'Z02' and ZPlant eq '${storedDealer.Location}' and   ZPriceList eq '${selectedSalesOrder.PRICELIST}' and Material eq '${sku}'`;
//       console.log("get Price SKU", sku);
//       console.log("URL Price", priceURL);
//       const priceData = await fetchSAPData(priceURL);
//       console.log("Pricedata", priceData);
//       const matchingRecord = priceData.find(record => record.Material === sku);
//       if (matchingRecord) {
//         const priceInfo = {
//           BasicPrice: parseFloat(matchingRecord.BasicPrice) || 0,
//           FinalBP: parseFloat(matchingRecord.FinalBP) || 0,
//           TaxValue: parseFloat(matchingRecord.TaxValue) || 0,
//           BaseUnit: matchingRecord.BaseUnit || "",
//           BasicPrice: parseFloat(matchingRecord.BasicPrice) || 0,
//           CONVERTUNITVALUE: parseFloat(matchingRecord.CONVERTUNITVALUE) || 0,
//           FinalBP: parseFloat(matchingRecord.FinalBP) || 0,
//           FinalMP: parseFloat(matchingRecord.FinalMP) || 0,
//           MatDescription: matchingRecord.MatDescription || "",
//           MatGrpDesc: matchingRecord.MatGrpDesc || "",
//           MatGrpDesc2: matchingRecord.MatGrpDesc2 || "",
//           MatPrice: parseFloat(matchingRecord.MatPrice) || 0,
//           Material: matchingRecord.Material || "",
//           MaterialDesc: matchingRecord.MaterialDesc || "",
//           NetValue: parseFloat(matchingRecord.NetValue) || 0,
//           Quantity: parseFloat(matchingRecord.Quantity) || 0,
//           Tax: parseFloat(matchingRecord.Tax) || 0,
//           TaxValue: parseFloat(matchingRecord.TaxValue) || 0,
//           UMREN: parseFloat(matchingRecord.UMREN) || 0,
//           UMREZ: parseFloat(matchingRecord.UMREZ) || 0,
//           ZPlant: matchingRecord.ZPlant || "",
//           ZPriceGroup: matchingRecord.ZPriceGroup || "",
//           ZPriceList: matchingRecord.ZPriceList || "",
//           ZcustNo: matchingRecord.ZcustNo || "",
//           ZdistChn: matchingRecord.ZdistChn || "",
//           Zdivision: matchingRecord.Zdivision || "",
//           ZdocType: matchingRecord.ZdocType || ""
//         };
//         console.log("Price Infor", priceInfo);

//         // Store price for that specific SKU
//         setSkuWithPrice(prev => ({
//           ...prev,
//           [sku.Code]: priceInfo
//         }));
//         return priceInfo;
//       } else {
//         console.warn(`No price found for ${sku}`);
//         return { BasicPrice: 0, FinalBP: 0, TaxValue: 0 };
//       }
//     } catch (error) {
//       console.error("Error fetching price:", error);
//       return { BasicPrice: 0, FinalBP: 0, TaxValue: 0 };
//     }
//   };
//   // ✅ Combine both datasets and calculate totals
//   useEffect(() => {
//     if (skuData.length > 0 && salesOrders.length > 0) {
//       const combined = salesOrders.map((order) => {
//         const sku = skuData.find((s) => s.Code === order.MATERIAL_S);
//         console.log("Combine ke andr SKU", sku);

//         return {
//           MATERIAL_S: order.MATERIAL_S,
//           QUANTITIES_S: Number(order.QUANTITIES_S),
//           Primary_category: sku?.Primary_category || "Unknown",
//           Gross_Weight: Number(sku?.Net_Weight || 0),
//           Price: Number(order?.GROSS_VALUE_S || 0),
//         };
//       });
//       console.log("Combine SKU", combined);

//       // ✅ Group by Primary_category
//       const categoryMap = {};
//       combined.forEach((item) => {
//         if (!categoryMap[item.Primary_category]) {
//           categoryMap[item.Primary_category] = { totalVolume: 0, totalPrice: 0 };
//         }
//         categoryMap[item.Primary_category].totalVolume +=
//           item.QUANTITIES_S * item.Gross_Weight;
//         categoryMap[item.Primary_category].totalPrice +=
//           item.QUANTITIES_S * item.Price;
//       });

//       // ✅ Convert to array for table display
//       const result = Object.keys(categoryMap).map((cat) => ({
//         category: cat,
//         totalVolume: (categoryMap[cat].totalVolume / 1000).toFixed(3),
//         totalPrice: categoryMap[cat].totalPrice.toFixed(2),
//       }));

//       setSummary(result);

//     }
//   }, [skuData, salesOrders]);

//   useEffect(() => {
//     if (!searchTerm.trim()) {
//       setFilteredSKU(skuData);
//       return;
//     }

//     const lower = searchTerm.toLowerCase();

//     const filtered = skuData.filter(
//       (item) =>
//         item.Code?.toLowerCase().includes(lower) ||
//         item.Name?.toLowerCase().includes(lower) ||
//         item.Primary_category?.toLowerCase().includes(lower)
//     );

//     setFilteredSKU(filtered);
//   }, [searchTerm, skuData]);

//   // ✅ Fetch data on mount
//   useEffect(() => {
//     fetchSkuData();
//     fetchSalesOrders();
//   }, []);

//   const cartTotal = useMemo(() =>
//     cart.reduce((sum, item) => sum + item.total, 0),
//     [cart]
//   );
//   const cartItems = useMemo(() =>
//     cart.reduce((sum, item) => sum + item.quantity, 0),
//     [cart]
//   );
//   const totalVolume = useMemo(() =>
//     cart.reduce((sum, item) => sum + (item.totalVolume || 0), 0),
//     [cart]
//   );
//   const handleContinue = () => {
//     setCart([]); // clear old category items
//     setShowAlert(false);
//   };
//   const addToCart = async (sku, quantity = 1) => {
//     try {
//       console.log("Add to cart SKU", sku);

//       setError(null);
//       setLoading(true);

//       const priceInfo = skuWithPrice[sku.Code] || await getPrice(sku.Code);

//       // Get category of the new SKU being added
//       const newCategory = sku.Primary_category?.trim();

//       setCart(prevCart => {
//         // Get all existing categories in cart
//         const existingCategories = [...new Set(prevCart.map(item => item.Primary_category?.trim()))];

//         // ✅ If cart is not empty and existing category doesn’t match new one
//         if (existingCategories.length > 0 && !existingCategories.includes(newCategory)) {
//           setAlertMessage(
//             `❌ You can only place orders for one category at a time.\n\nRemove ${existingCategories.join(
//               ", "
//             )} items before adding ${newCategory} items.`
//           );
//           setShowAlert(true);
//           return prevCart; // stop adding new item
//         }

//         const existingItem = prevCart.find(item => item.sku === sku.Code);
//         const totalPrice = ((sku.Net_Weight * priceInfo.BasicPrice) + priceInfo.MatPrice) * quantity;
//         console.log("Total Price", totalPrice);

//         if (existingItem) {
//           // Update existing quantity
//           return prevCart.map(item =>
//             item.sku === sku.Code
//               ? {
//                 ...item, quantity: item.quantity + quantity, total: parseFloat(totalPrice + totalPrice), totalVolume: parseFloat(item.Net_Weight + item.Net_Weight), totalTons: parseFloat((item.Net_Weight / 1000) + (item.Net_Weight / 1000))
//               }
//               : item
//           );
//         } else {
//           // Add new item
//           return [
//             ...prevCart,
//             {
//               sku: sku.Code,
//               name: sku.Name,
//               quantity,
//               price: ((sku.Net_Weight * priceInfo.BasicPrice) + priceInfo.MatPrice),
//               total: totalPrice,
//               unit: sku.SAP_Unit,
//               Primary_category: newCategory, // store category in cart
//               totalVolume: sku.Net_Weight,
//               totalTons: (sku.Net_Weight / 1000)

//             },
//           ];
//         }
//       });
//       console.log("cart", cart);

//     } catch (err) {
//       console.error("Error fetching price:", err);
//       setError("⚠️ Failed to add item to cart. Please try again.");
//       setTimeout(() => setError(null), 1000);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateCartQuantity = (sku, newQuantity) => {
//     console.log("New Quantity", newQuantity);
//     if (newQuantity <= 0) {
//       removeFromCart(sku);
//       return;
//     }

//     setCart(prevCart => {
//       // ✅ Log current cart before updating
//       console.log("🛒 Previous Cart:", prevCart);

//       // ✅ Find the current item being updated
//       const currentItem = prevCart.find(item => item.sku === sku);
//       console.log("📦 Item before update:", currentItem);

//       // ✅ Perform update
//       const updatedCart = prevCart.map(item =>
//         item.sku === sku
//           ? {
//             ...item,
//             quantity: newQuantity,
//             total: newQuantity * item.price,
//             totalTons: newQuantity * item.totalTons * DENSITY,
//             totalVolume: newQuantity * item.totalVolume,
//           }
//           : item
//       );

//       // ✅ Log the new updated cart
//       console.log("✅ Updated Cart:", updatedCart);
//       return updatedCart;
//     });
//   };
//   const removeFromCart = (sku) => {
//     setCart(prevCart => prevCart.filter(item => item.sku !== sku));
//   };
//   const clearCart = () => {
//     setCart([]);
//     setTotalVolume(0);
//   };
//   const submitOrder = () => {
//     if (cart.length === 0) return;
//     // console.log("Dealer", storedDealer);
//     // console.log("cart", cart);
//     console.log('Order submitted:', {
//       subCategory,
//       items: cart,
//       selectedSalesOrder,
//       total: cartTotal,
//       totalVolume,
//       timestamp: new Date().toISOString()
//     });
//     setCart([]);
//     // setTotalVolume(0);

//     alert("Order submitted successfully!");
//   };
//   const handleCapacityChange = (e) => {
//     const value = Number(e.target.value);

//     // ✅ Validation: restrict above 20
//     if (value > 20) {
//       setError("❌ Capacity cannot be more than 20 tons.");
//       setCapacity(20); // automatically set to 20 if exceeded
//       setTimeout(() => setError(""), 2000); // hide error after 2 seconds
//     } else {
//       setError("");
//       setCapacity(value);
//     }
//   };

//   const handleSalesOrder = async (sku) => {
//     let keyword = "";
//     switch (sku.category.toUpperCase()) {
//       case "SBO":
//         keyword = "SOYABEAN";
//         break;
//       case "GNO":
//         keyword = "GROUNDNUT";
//         break;
//       case "SFO":
//         keyword = "SUNFLOWER";
//         break;
//       case "KGMO":
//         keyword = "MUSTARD";
//         break;
//       default:
//         keyword = "";
//     }
//     const filteredOrders = salesOrders.filter(order =>
//       order.MATERIAL_DES_S?.toUpperCase().includes(keyword)
//     );
//     console.log("Filtered Orders for", sku.category, filteredOrders);
//     setPendingOrders(filteredOrders);
//     setSummurySelected(false)

//   }
//   const handleFilterSKU = async (sku) => {
//     console.log("SKU ", sku);
//     setSelectedSalesOrder(sku)
//     console.log("Material", skuData);
//     console.log("subcategory", subCategory);
//     let cate = "";
//     if (selectedSalesOrder && Object.keys(selectedSalesOrder).length > 0) {
//       setSelectedSalesOrder({});
//     } else {
//       setSelectedSalesOrder(sku);
//     }

//     const materialDesc = sku.MATERIAL_DES_S?.toUpperCase() || "";
//     switch (true) {
//       case materialDesc.includes("SOYABEAN"):
//         cate = "SBO";
//         break;

//       case materialDesc.includes("GROUNDNUT"):
//         cate = "GNO";
//         break;

//       case materialDesc.includes("SUNFLOWER"):
//         cate = "SFO";
//         break;

//       case materialDesc.includes("MUSTARD"):
//         cate = "KGMO";
//         break;

//       default:
//         cate = "UNKNOWN";
//         return;
//     }
//     console.log("Detected Category:", cate);
//     setDealerCategory(cate)
//     const filtered = skuData.filter(
//       (item) =>
//         item.Primary_category === cate);
//     // const filtered = skuData.filter(
//     //   (item) =>
//     //     item.Primary_category === cate &&
//     //     item.Secondary_Category === subCategory
//     // );
//     console.log(filtered);
//     setFilteredSKU(filtered);
//     setSummurySelected(true)
//     // console.log(skucheck);
//     // const filtered = skuData.filter(item => item.Primary_category === sku.category && item.Secondary_Category === subCategory);
//     // console.log(filtered);

//     // setFilteredSKU(filtered)

//   }
//   //🔹 When subCategory dropdown changes
//   const handleSubCategoryChange = (value) => {
//     console.log("Subcategory Changed:", value);
//     setSubCategory(value);
//     console.log("Filterd SKU", filteredSKU);
//     // 🔸 If user has already filtered by category
//     if (filteredSKU.length > 0) {
//       const category = filteredSKU[0]?.Primary_category;

//       if (category) {
//         // re-filter based on same category + new subCategory
//         const filtered = skuData.filter(
//           (item) =>
//             item.Primary_category === category &&
//             item.Secondary_Category === value
//         );
//         console.log("SubcategoryFilter", filtered);

//         setFilteredSKU(filtered);
//       } else {
//         // if no category found, just filter by subCategory only
//         const filtered = skuData.filter(
//           (item) => item.Secondary_Category === value
//         );
//         setFilteredSKU(filtered);
//       }
//     } else {
//       // 🔸 If no category selected yet → default to subCategory only
//       const filtered = skuData.filter(
//         (item) => item.Secondary_Category === value
//       );
//       setFilteredSKU(filtered);
//     }
//   };
//   return (
//     <>
//       {loading && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center space-y-3">
//             <svg
//               className="animate-spin h-8 w-8 text-blue-600"
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//             >
//               <circle
//                 className="opacity-25"
//                 cx="12"
//                 cy="12"
//                 r="10"
//                 stroke="currentColor"
//                 strokeWidth="4"
//               ></circle>
//               <path
//                 className="opacity-75"
//                 fill="currentColor"
//                 d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
//               ></path>
//             </svg>
//             <p className="text-gray-700 font-medium">Fetching Price...</p>
//           </div>
//         </div>
//       )}

//       <div className="p-6 space-y-6">
//         {loading && <p>Loading...</p>}
//         {error && <p className="text-red-500">{error}</p>}
//         <div className="p-6 space-y-6">
//           <div className="flex justify-between items-start">
//             <div>
//               <h1 className="text-3xl font-bold flex items-center">
//                 <ClipboardList className="w-8 h-8 mr-3" />
//                 My Contracts
//               </h1>
//               <p className="text-muted-foreground">Break your sales Order in available SKUs</p>
//             </div>
//             <div>
//               <h1 className="text-xl font-bold flex items-center">
//                 <Truck className="w-8 h-8 mr-3" />
//                 Vehicle Capacity (in Tons)
//               </h1>
//               <Input
//                 type="number"
//                 placeholder="Select Vehical Capacity "
//                 min={1}
//                 max={20}
//                 className="w-full text-center text-sm"
//                 onChange={handleCapacityChange}
//               />
//             </div>
//           </div>
//         </div>
//         <Card>
//           <CardHeader>
//             <CardTitle>Category Summary</CardTitle>
//             <CardDescription className='text-red-600 font-bold' >which salesorder expiring first that have to order first </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Category</TableHead>
//                   <TableHead>Total Volume</TableHead>
//                   {/* <TableHead>Total Price</TableHead> */}
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {summary
//                   .filter(item => item.category && item.category !== "Unknown") // 👈 filter valid categories
//                   .map((item) => (
//                     <TableRow key={item.category} onClick={() => handleSalesOrder(item)}>
//                       <TableCell>{item.category}</TableCell>
//                       <TableCell>{item.totalVolume} MT</TableCell>
//                       {/* <TableCell>{item.totalPrice} ₹</TableCell> */}
//                     </TableRow>
//                   ))}
//               </TableBody>

//             </Table>
//           </CardContent>
//         </Card>
//       </div>

//       {pendingOrders.length > 0 && (
//         <div className="p-6 space-y-6">

//           <Card>
//             <CardHeader>
//               <CardTitle>Sales Orders</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <Table>
//                 <TableHeader>
//                   <TableRow >
//                     <TableHead>Sales Order</TableHead>
//                     <TableHead>Material Description</TableHead>
//                     <TableHead>Date of Sales Order</TableHead>
//                     <TableHead>From Date</TableHead>
//                     <TableHead>Expiry Date</TableHead>
//                     <TableHead>Quantities</TableHead>
//                     {/* <TableHead>Delivery No.</TableHead>
//                   <TableHead>Vehicle No.</TableHead>
//                   <TableHead>Driver Name</TableHead>
//                   <TableHead>Invoice Number</TableHead> */}
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {pendingOrders.map((order) => (
//                     <TableRow key={`${order.S_ORDER_NO}_${order.QUANTITIES_S}`} onClick={() => handleFilterSKU(order)}>
//                       <TableCell>{order.S_ORDER_NO}</TableCell>
//                       <TableCell>{order.MATERIAL_DES_S}</TableCell>
//                       <TableCell>{formatSAPDate(order.CREATIONDATE_S)}</TableCell>
//                       <TableCell>{formatSAPDate(order.FROM_DATE)}</TableCell>
//                       <TableCell>{formatSAPDate(order.TO_DATE)}</TableCell>
//                       <TableCell>{Math.trunc(Number(order.QUANTITIES_S))}</TableCell>

//                       {/* <TableCell>{order.DELIVERY_NO_S}</TableCell>
//                     <TableCell>{order.VEHICLENO || "-"}</TableCell>
//                     <TableCell>{order.DRIVERNAME || "-"}</TableCell>
//                     <TableCell>{order.INVOICE_NUMBERS}</TableCell> */}
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </CardContent>
//           </Card>
//         </div>
//       )}

//       {/* //Vehicle  */}
//       {cart.length > 0 && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Vehicle Summary</CardTitle>
//             <CardDescription>Review your order before submission</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <h4 className="font-medium mb-3">vehicle Details</h4>
//                 <div className="space-y-2 text-sm items-center">
//                   <div className="flex justify-between p-1 ">
//                     <span>Vehicle Volume FullFillment Satus:</span>
//                     <Progress value={totalVolume / .01} className=" h-2 items-center" color="orange" />
//                     {/* <LucideTruck className="w-10 h-8 text-center" /> */}
//                   </div>

//                   <div className="flex justify-between">
//                     <span className='p-1'>Vehicle Number:</span>
//                     <input className=" border-b border-black text-gray-900   focus:ring-blue-500 focus:border-blue-500 block p-1  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder='Vehicle Number'></input>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className='p-1'>Vehicle Placement date:</span>
//                     <input className=" border-b border-black text-gray-900  focus:ring-blue-500 focus:border-blue-500 block p-1  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder='Vehicle Placement date'></input>
//                   </div>
//                   <Separator />
//                   {/* <div className="flex justify-between">
//                          <span className="font-medium">Total Amount:</span>
//                          <span className="font-bold">₹{cartTotal.toLocaleString()}</span>
//                        </div> */}
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       )}
//       {cart.length > 0 && (
//         <Card>
//           <CardHeader>
//             <div className="flex justify-between items-center">
//               <CardTitle className="flex items-center">
//                 <ShoppingCart className="w-5 h-5 mr-2" />
//                 Shopping Cart ({cartItems} items)
//               </CardTitle>
//               <div className="flex items-center space-x-2">
//                 <span className="font-medium">Total: ₹{cartTotal.toLocaleString()}</span>
//                 <Button variant="outline" size="sm" onClick={clearCart}>
//                   Clear Cart
//                 </Button>
//               </div>
//             </div>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-2 max-h-40 overflow-y-auto">
//               {cart.map((item) => (
//                 <div key={item.sku} className="flex items-center justify-between p-2 border rounded">

//                   <div className="flex-1">
//                     <span className="font-medium text-sm">{item.name}</span>
//                     <div className="text-xs text-muted-foreground">{item.sku}</div>
//                   </div>
//                   <div className="flex items-center space-x-2 cursor-pointer">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => updateCartQuantity(item.sku, item.quantity - 1)}
//                     >
//                       <Minus className="w-3 h-3" />
//                     </Button>
//                     <Input
//                       type="number"
//                       value={item.quantity}
//                       min={0}
//                       className="w-20 text-center text-sm"
//                       onChange={(e) => updateCartQuantity(item.sku, Number(e.target.value))}
//                     />
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => updateCartQuantity(item.sku, item.quantity + 1)}
//                     >
//                       <Plus className="w-3 h-3" />
//                     </Button>
//                     <span className="w-20 text-right text-sm">₹{item.total.toLocaleString()}</span>
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={() => removeFromCart(item.sku)}
//                     >
//                       <Trash2 className="w-3 h-3" />
//                     </Button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       )}
//       { /*SKU Listing */}

//       {
//         summurySelected && (<Card>
//           <CardHeader>
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
//               <div>
//                 <CardTitle className="flex items-center">
//                   <Package className="w-5 h-5 mr-2" />
//                   Available SKUs
//                 </CardTitle>
//                 <CardDescription>
//                   Browse and add products to your order
//                 </CardDescription>
//               </div>
//               <div className="relative">
//                 <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//                 <Input
//                   placeholder="Search SKUs..."
//                   className="pl-10 w-80"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
//               {/* <div>
//                 <label className="block text-sm font-medium mb-2">
//                   Product Subcategory
//                 </label>
//                 <Select value={subCategory}  >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select subcategory" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="CP">CP</SelectItem>
//                     <SelectItem value="BP">BP</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div> */}
//             </div>
//           </CardHeader>
//           <CardContent>
//             <div className="border rounded-lg overflow-x-auto">
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>SKU Code</TableHead>
//                     <TableHead>Product Name</TableHead>
//                     <TableHead>Unit</TableHead>
//                     {/* <TableHead>Price (₹)</TableHead> */}
//                     <TableHead>Quantity</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {filteredSKU.map((sku) => {
//                     const cartItem = cart.find(item => item.Code === sku.Code);

//                     return (
//                       <TableRow key={sku.Code}>
//                         <TableCell >{sku.Code}</TableCell>
//                         <TableCell>{sku.Name}</TableCell>
//                         <TableCell>{sku.SAP_Unit}</TableCell>
//                         {/* <TableCell>₹{sku.price.toLocaleString()}</TableCell> */}
//                         <TableCell className="w-40 text-center">
//                           {cartItem ? (
//                             <div className="flex items-center justify-center gap-2 cursor-pointer">
//                               <Button
//                                 variant="outline"
//                                 size="sm"
//                                 onClick={() => updateCartQuantity(sku.sku, cartItem.quantity - 1)}
//                               >
//                                 <Minus className="w-3 h-3" />
//                               </Button>
//                               <Input
//                                 type="number"
//                                 value={cartItem.quantity}
//                                 min={1}
//                                 className="w-16 text-center text-sm"
//                                 onChange={(e) => updateCartQuantity(sku.sku, Number(e.target.value))}
//                               />
//                               <Button
//                                 variant="outline"
//                                 size="sm"
//                                 onClick={() => updateCartQuantity(sku.sku, cartItem.quantity + 1)}
//                               >
//                                 <Plus className="w-3 h-3" />
//                               </Button>
//                             </div>
//                           ) : (
//                             <div className="flex justify-center cursor-pointer">
//                               <Button
//                                 variant="outline"
//                                 size="sm"
//                                 onClick={() => addToCart(sku)}
//                               >
//                                 <Plus className="w-4 h-4 mr-1" />
//                                 Add
//                               </Button>
//                             </div>
//                           )}
//                         </TableCell>
//                       </TableRow>
//                     );
//                   })}
//                 </TableBody>
//               </Table>
//             </div>
//             {filteredSKU.length === 0 && (
//               <div className="text-center py-8">
//                 <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
//                 <p className="text-muted-foreground">
//                   No Data Found
//                 </p>
//               </div>
//             )}
//           </CardContent>
//         </Card>)
//       }
//       {/* Order Summary and Submission */}
//       {cart.length > 0 && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Order Summary </CardTitle>
//             <div className="flex items-center space-x-2">
//               {/* <span className="font-medium">Total: ₹{cartTotal.toLocaleString()}</span> */}
//               <Button variant="outline" size="sm" onClick={clearCart}>
//                 Clear Cart
//               </Button>
//             </div>
//             <CardDescription>Review your order before submission</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="space-y-2 max-h-60 overflow-y-auto">
//               <div className="border rounded-lg overflow-x-auto">
//                 <Table size="2">
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>SKU Code</TableHead>
//                       <TableHead>Product Name</TableHead>
//                       <TableHead>Unit</TableHead>
//                       <TableHead>List Price (₹)</TableHead>
//                       <TableHead>Total (₹)</TableHead>
//                       <TableHead>Quantity</TableHead>
//                     </TableRow>
//                   </TableHeader>

//                   <TableBody>
//                     {cart.map((item) => {
//                       const basic = parseFloat(item.BasicPrice || 0);
//                       const final = parseFloat(item.FinalBP || 0);
//                       const tax = parseFloat(item.TaxValue || 0);
//                       const total = (final + tax) * item.quantity;
//                       { console.log("cart Item", item) }

//                       return (
//                         <TableRow key={item.sku}>
//                           <TableCell>{item.sku}</TableCell>
//                           <TableCell>{item.name}</TableCell>
//                           <TableCell>{item.unit}</TableCell>
//                           <TableCell>₹{item.price ? Number(item.price).toFixed(2) : '0.00'}</TableCell>
//                           <TableCell>₹{item.total.toLocaleString()}</TableCell>
//                           <TableCell className="w-44 text-center">
//                             <div className="flex items-center justify-center gap-2">
//                               <Button
//                                 variant="outline"
//                                 size="sm"
//                                 onClick={() =>
//                                   updateCartQuantity(item.sku, item.quantity - 1)
//                                 }
//                               >
//                                 <Minus className="w-3 h-3" />
//                               </Button>
//                               <Input
//                                 type="number"
//                                 value={item.quantity}
//                                 min={1}
//                                 className="w-16 text-center text-sm"
//                                 onChange={(e) =>
//                                   updateCartQuantity(item.sku, Number(e.target.value))
//                                 }
//                               />
//                               <Button
//                                 variant="outline"
//                                 size="sm"
//                                 onClick={() =>
//                                   updateCartQuantity(item.sku, item.quantity + 1)
//                                 }
//                               >
//                                 <Plus className="w-3 h-3" />
//                               </Button>
//                             </div>
//                           </TableCell>
//                           <TableCell><Button
//                             variant="ghost"
//                             size="sm"
//                             onClick={() => removeFromCart(item.sku)}
//                           >
//                             <Trash2 className="w-3 h-3" />
//                           </Button></TableCell>

//                         </TableRow>
//                       );
//                     })}
//                   </TableBody>
//                 </Table>
//               </div>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <div className="space-y-2 text-sm">
//                   <div className="flex justify-between mt-2">
//                     <span>Total Items:</span>
//                     <span className="font-medium">{cartItems}</span>
//                   </div>
//                   <div className="flex justify-between mt-2">
//                     <span>Unique SKUs:</span>
//                     <span className="font-medium">{cart.length}</span>
//                   </div>
//                   <Separator />
//                   <div className="flex justify-between">
//                     {/* <span className="font-medium">Total Amount:</span> */}
//                     {/* <span className="font-bold">₹{cartTotal.toLocaleString()}</span> */}
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="font-medium">Total Volume:</span>
//                     <span className="font-bold">{(totalVolume / 10000).toFixed(2)} MT</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="flex lg:justify-end lg:gap-2 space-x-2">
//               <Button variant="outline" onClick={clearCart}>
//                 Clear Order
//               </Button>
//               <Button onClick={submitOrder} className="min-w-32">
//                 <CheckCircle className="w-4 h-4 mr-2" />
//                 Submit Order
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       )}
//       <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Category Restriction</AlertDialogTitle>
//             <AlertDialogDescription>{alertMessage}</AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel onClick={() => setShowAlert(false)}>Cancel</AlertDialogCancel>
//             <AlertDialogAction onClick={handleContinue}>Continue (Clear Cart)</AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </>
//   );
// }
















import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Spinner } from '../components/ui/spinner'
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "./ui/table";
import {
    ShoppingCart,
    Plus,
    Minus,
    Trash2,
    Search,
    Filter,
    Package,
    Tag,
    IndianRupee,
    CheckCircle,
    AlertCircle,
    Package2,
    ClipboardList,
    Truck,
} from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "../components/ui/alert-dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import { breakeOrders } from "../lib/UpdateOrders";
import MergeOrdersBySONumber from "../lib/mergeOrdersBySONumber";
import BreakSalesOrder from "../lib/BreakSalesOrder";
import { AlertDialogOverlay } from "@radix-ui/react-alert-dialog";
import GlobalAlert from "./GlobalAlert";
async function fetchSAPData(apiUrl) {
    try {
        const response = await axios.get(apiUrl, {
            auth: {
                username: "dev01",
                password: "Kriti@12",
            },
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json; charset=utf-8",
            },
        });
        return response.data.d.results;
    } catch (err) {
        let errorMessage = "Failed to fetch SAP data. Please try again later.";
        if (err.code === "ERR_NETWORK") {
            errorMessage = "Network error: Unable to connect to the API.";
        } else if (err.response?.status === 401) {
            errorMessage = "Authentication failed: Invalid username or password.";
        } else if (err.response?.status) {
            errorMessage = `API error: ${err.response.status} - ${err.response.statusText}`;
        }
        throw new Error(errorMessage);
    }
}
export function MyOrders() {
    const formatForInput = (date) => {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
    };
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    // ✅ Set fromDate = today - 15 days
    const firstDayOfMonth = new Date();
    firstDayOfMonth.setDate(today.getDate() - 15);

    const [summurySelected, setSummurySelected] = useState(false);
    const [singleSummury, setSingleSummury] = useState({})
    const [vehicleDetails, setVehicleDetails] = useState({
        vehicleNumber: "",
        placementDate: "",
    });
    const vehicleRegex = /^[A-Z]{2}\s?\d{2}\s?[A-Z]{1,2}\s?\d{4}$/i;
    const [selectedSalesOrder, setSelectedSalesOrder] = useState({});
    const [dealerCategory, setDealerCategory] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [skuData, setSkuData] = useState([]);
    const [salesOrders, setSalesOrders] = useState([]);
    const [pendingOrders, setPendingOrders] = useState([]);
    const [summary, setSummary] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [filteredSKU, setFilteredSKU] = useState([]);
    const [cart, setCart] = useState([]);
    const [skuWithPrice, setSkuWithPrice] = useState({});
    const [capacity, setCapacity] = useState(0);
    const [subCategory, setSubCategory] = useState("BP");
    const [fromDate, setFromDate] = useState(formatForInput(firstDayOfMonth));
    const [toDate, setToDate] = useState(formatForInput(today));
    const [alertMessage, setAlertMessage] = useState({
        title: "",
        message: "",
        cancelLabel: "",
        continueLabel: "",
    });
    const [showAlert, setShowAlert] = useState(false);
    const [newCapacity, setNewCapacity] = useState("");
    const [selectedOrders, setSelectedOrders] = useState([]);
    const [totalTonSelected, setTotalTonSelected] = useState(0)

    const storedDealer = JSON.parse(localStorage.getItem("dealerData"));
    const custCode = storedDealer?.UserName || "";
    const DENSITY = 1;
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
    // Function to remove duplicate orders by Sales Order + Quantity
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
    const handleVehicleChange = (e) => {
        const { name, value } = e.target;

        setVehicleDetails((prev) => ({
            ...prev,
            [name]: value.toUpperCase(), // make uppercase automatically
        }));

        if (name === "vehicleNumber") {
            if (value === "" || vehicleRegex.test(value)) {
                setError(""); // valid
            } else {
                setError("Invalid vehicle number format (e.g. MP09CX1234)");
            }
        }
    };

    // ✅ Fetch SKU data (contains Primary_category, weight, price, etc.)
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

    // ✅ Fetch Sales Orders (contains MATERIAL_S)
    const fetchSalesOrders = async () => {
        if (!custCode) {
            setError("Customer code not found in local storage.");
            return;
        }
        setLoading(true);
        setError("");

        const apiUrl = `api/sap/opu/odata/sap/ZSALES_ORDER_VIEW_SRV/SalesOrderSet?$filter=FROM_DATE eq '${formatForAPI(
            fromDate
        )}' and TO_DATE eq '${formatForAPI(
            toDate
        )}' and CUST_CODE_S eq '${custCode}'&$expand=DeliveryOrderSet/InvoiceSet`;

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
                            del.InvoiceSet?.results
                                .map((inv) => inv.INVOICE_NO_I)
                                .join(", ") || "";
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
            const uniqueOrders = removeDuplicateOrders(allOrders);
            const withoutInvoice = uniqueOrders.filter(
                (order) =>
                    !order.INVOICE_NUMBERS ||
                    order.INVOICE_NUMBERS === "-" ||
                    order.INVOICE_NUMBERS.trim() === ""
            );
            console.log("Order Without Invoice", withoutInvoice);
            setSalesOrders(withoutInvoice);

            setPendingOrders(withoutInvoice);
        } catch (err) {
            console.error("Error fetching sales orders:", err);
            setError("Failed to fetch sales orders.");
        } finally {
            setLoading(false);
        }
    };
    const getPrice = async (sku) => {
        try {
            console.log(selectedSalesOrder);
            const priceURL = `/api/sap/opu/odata/sap/ZSD_PRICING_SALES_SRV/zprice_customerSet?$filter=ZcustNo eq '${storedDealer.UserName}' and ZdistChn eq 'O3' and ZdocType eq 'Z02' and ZPlant eq '${storedDealer.Location}' and   ZPriceList eq '${selectedSalesOrder.PRICELIST}' and Material eq '${sku}'`;
            console.log("get Price SKU", sku);
            console.log("URL Price", priceURL);
            const priceData = await fetchSAPData(priceURL);
            console.log("Pricedata", priceData);
            const matchingRecord = priceData.find(
                (record) => record.Material === sku
            );
            if (matchingRecord) {
                const priceInfo = {
                    BasicPrice: parseFloat(matchingRecord.BasicPrice) || 0,
                    FinalBP: parseFloat(matchingRecord.FinalBP) || 0,
                    TaxValue: parseFloat(matchingRecord.TaxValue) || 0,
                    BaseUnit: matchingRecord.BaseUnit || "",
                    BasicPrice: parseFloat(matchingRecord.BasicPrice) || 0,
                    CONVERTUNITVALUE: parseFloat(matchingRecord.CONVERTUNITVALUE) || 0,
                    FinalBP: parseFloat(matchingRecord.FinalBP) || 0,
                    FinalMP: parseFloat(matchingRecord.FinalMP) || 0,
                    MatDescription: matchingRecord.MatDescription || "",
                    MatGrpDesc: matchingRecord.MatGrpDesc || "",
                    MatGrpDesc2: matchingRecord.MatGrpDesc2 || "",
                    MatPrice: parseFloat(matchingRecord.MatPrice) || 0,
                    Material: matchingRecord.Material || "",
                    MaterialDesc: matchingRecord.MaterialDesc || "",
                    NetValue: parseFloat(matchingRecord.NetValue) || 0,
                    Quantity: parseFloat(matchingRecord.Quantity) || 0,
                    Tax: parseFloat(matchingRecord.Tax) || 0,
                    TaxValue: parseFloat(matchingRecord.TaxValue) || 0,
                    UMREN: parseFloat(matchingRecord.UMREN) || 0,
                    UMREZ: parseFloat(matchingRecord.UMREZ) || 0,
                    ZPlant: matchingRecord.ZPlant || "",
                    ZPriceGroup: matchingRecord.ZPriceGroup || "",
                    ZPriceList: matchingRecord.ZPriceList || "",
                    ZcustNo: matchingRecord.ZcustNo || "",
                    ZdistChn: matchingRecord.ZdistChn || "",
                    Zdivision: matchingRecord.Zdivision || "",
                    ZdocType: matchingRecord.ZdocType || "",
                };
                console.log("Price Infor", priceInfo);

                // Store price for that specific SKU
                setSkuWithPrice((prev) => ({
                    ...prev,
                    [sku.Code]: priceInfo,
                }));
                return priceInfo;
            } else {
                console.warn(`No price found for ${sku}`);
                return { BasicPrice: 0, FinalBP: 0, TaxValue: 0 };
            }
        } catch (error) {
            console.error("Error fetching price:", error);
            return { BasicPrice: 0, FinalBP: 0, TaxValue: 0 };
        }
    };

    useEffect(() => {
        if (skuData.length > 0 && salesOrders.length > 0) {
            const combined = salesOrders.map((order) => {
                const sku = skuData.find((s) => s.Code === order.MATERIAL_S);
                return {
                    MATERIAL_S: order.MATERIAL_S,
                    QUANTITIES_S: Number(order.QUANTITIES_S),
                    Primary_category: sku?.Primary_category || "Unknown",
                    Gross_Weight: Number(sku?.Net_Weight || 0),
                    Price: Number(order?.GROSS_VALUE_S || 0),
                };
            });

            const categoryMap = {};
            combined.forEach((item) => {
                if (!categoryMap[item.Primary_category]) {
                    categoryMap[item.Primary_category] = {
                        totalVolume: 0,
                        totalPrice: 0,
                    };
                }

                categoryMap[item.Primary_category].totalVolume +=
                    item.QUANTITIES_S * item.Gross_Weight;
                categoryMap[item.Primary_category].totalPrice +=
                    item.QUANTITIES_S * item.Price;
            });

            let result = Object.keys(categoryMap)
                .filter((cat) => cat !== "Unknown")   // REMOVE Unknown
                .map((cat) => ({
                    category: cat,
                    totalVolume: (categoryMap[cat].totalVolume / 1000).toFixed(3),
                    totalPrice: categoryMap[cat].totalPrice.toFixed(2),
                }));

            // DEFAULT 4 categories
            const defaultCategories = ["SBO", "SFO", "GNO", "KGMO"];

            defaultCategories.forEach((cat) => {
                if (!result.some((item) => item.category === cat)) {
                    result.push({
                        category: cat,
                        totalVolume: "0.00",
                        totalPrice: "0.00",
                    });
                }
            });

            // ORDER by predefined sequence
            result = result.sort(
                (a, b) => defaultCategories.indexOf(a.category) - defaultCategories.indexOf(b.category)
            );
            setSummary(result);
        }
    }, [skuData, salesOrders]);



    // useEffect(() => {
    //   if (showAlert) {
    //     const timer = setTimeout(() => {
    //       setShowAlert(false);
    //     }, 1000);
    //     return () => clearTimeout(timer);
    //   }
    // }, [showAlert]);

    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredSKU(skuData);
            return;
        }
        const lower = searchTerm.toLowerCase();

        const filtered = skuData.filter(
            (item) =>
                item.Code?.toLowerCase().includes(lower) ||
                item.Name?.toLowerCase().includes(lower) ||
                item.Primary_category?.toLowerCase().includes(lower)
        );

        setFilteredSKU(filtered);
    }, [searchTerm, skuData]);

    // ✅ Fetch data on mount
    useEffect(() => {
        fetchSkuData();
        fetchSalesOrders();
    }, []);
    useEffect(() => {
        if (selectedOrders.length === 0) return;

        const total = pendingOrders
            .filter((order) => selectedOrders.includes(order.S_ORDER_NO))
            .reduce((sum, order) => sum + Number(order.totalWeightInTon || 0), 0);

        if (total !== totalTonSelected) {
            setTotalTonSelected(total);
        }
    }, [selectedOrders]);   // ❗ remove pendingOrders dependency


    const cartTotal = useMemo(
        () => cart.reduce((sum, item) => sum + item.total, 0),
        [cart]
    );
    const cartItems = useMemo(
        () => cart.reduce((sum, item) => sum + item.quantity, 0),
        [cart]
    );
    const totalVolume = useMemo(
        () => cart.reduce((sum, item) => sum + (item.totalVolume || 0), 0),
        [cart]
    );
    const handleContinue = () => {
        setCart([]); // clear old category items
        setShowAlert(false);
    };

    const validateCapacity = () => {
        if (capacity === "" || capacity === null || capacity === undefined) {
            setAlertMessage({
                title: "Capacity Required",
                message: "Please enter vehicle capacity first.",
                continueLabel: "OK",
            });
            setShowAlert(true);
            return false;
        }

        if (capacity <= 0) {
            setAlertMessage({
                title: "Invalid Capacity",
                message: "Capacity cannot be zero or negative.",
                continueLabel: "OK",
            });
            setShowAlert(true);
            setCapacity("");
            return false;
        }

        if (capacity > 20) {
            setAlertMessage({
                title: "Capacity Restriction",
                message: "Capacity cannot exceed 20 Tons. Enter capacity ≤ 20.",
                continueLabel: "OK",
            });
            setShowAlert(true);
            setCapacity("");
            return false;
        }

        return true; // VALID
    };

    // const addToCart = async (sku, quantity = 1) => {
    //   if (!validateCapacity()) return;
    //   try {
    //     setError(null);


    //     console.log("Att To Cart AKU", sku);
    //     // const priceInfo = skuWithPrice[sku.Code] || (await getPrice(sku.Code));
    //     const newCategory = sku.Primary_category?.trim();
    //     setCart((prevCart) => {
    //       const existingCategories = [
    //         ...new Set(prevCart.map((item) => item.Primary_category?.trim())),
    //       ];

    //       if (
    //         existingCategories.length > 0 &&
    //         !existingCategories.includes(newCategory)
    //       ) {
    //         setAlertMessage({
    //           title: "Category Restriction",
    //           message: `❌ You can only place orders for one category at a time.\n\nRemove ${existingCategories.join(
    //             ", "
    //           )} items before adding ${newCategory} items.`,
    //           continueLabel: "OK"

    //         });
    //         setShowAlert(true);
    //         return prevCart;
    //       }

    //       const existingItem = prevCart.find((item) => item.sku === sku.Code);
    //       const totalPrice =
    //         (sku.Dewas_ready_price) * quantity;

    //       // Compute the new total tons if this item is added
    //       const newTotalTons =
    //         totalVolume / 1000 +
    //         (sku.Net_Weight / 1000) * (existingItem ? quantity : quantity);

    //       if (newTotalTons > singleSummury.totalVolume) {
    //         setAlertMessage({
    //           title: "Capacity Restriction",
    //           message: `Entered capacity exceeds ${singleSummury.totalVolume} tons. Please enter a valid capacity (≤ ${singleSummury.totalVolume}).`,
    //           continueLabel: "OK"
    //         });
    //         setShowAlert(true);
    //         return prevCart;
    //       }

    //       if (existingItem) {
    //         return prevCart.map((item) =>
    //           item.sku === sku.Code
    //             ? {
    //               ...item,
    //               quantity: item.quantity + quantity,
    //               total: item.price * (item.quantity + quantity),
    //               totalVolume: item.totalVolume + sku.Net_Weight * quantity,
    //               totalTons:
    //                 item.totalTons + (sku.Net_Weight / 1000) * quantity,
    //               singleQTYWeight: sku.Net_Weight,
    //               unit: sku.SAP_Unit,
    //               materialStatus: "",
    //               materialBalance: item.totalVolume + sku.Net_Weight * quantity,
    //             }
    //             : item
    //         );
    //       } else {
    //         return [
    //           ...prevCart,
    //           {
    //             sku: sku.Code,
    //             name: sku.Name,
    //             quantity,
    //             price: sku.Dewas_ready_price,
    //             total: totalPrice,
    //             unit: sku.SAP_Unit,
    //             Primary_category: newCategory,
    //             totalVolume: sku.Net_Weight * quantity,
    //             materialBalance: sku.Net_Weight * quantity,
    //             totalTons: (sku.Net_Weight / 1000) * quantity,
    //             singleQTYWeight: sku.Net_Weight,
    //             materialStatus: "",
    //           },
    //         ];
    //       }
    //     });
    //   } catch (err) {
    //     console.error("Error fetching price:", err);
    //     setError("⚠️ Failed to add item to cart. Please try again.");
    //     setTimeout(() => setError(null), 1000);
    //   } finally {

    //   }
    // };



    const addToCart = async (sku, quantity = 1) => {
        if (!validateCapacity()) return;

        try {
            setError(null);

            const selectedTons = Number(totalTonSelected);     // Allowed tons from selected SOs
            const currentCartTons = totalVolume / 1000;        // Current cart tons
            const newSkuTons = (sku.Net_Weight / 1000) * quantity;
            const updatedCartTons = currentCartTons + newSkuTons;

            // 1️⃣ Restriction: Vehicle capacity (based on selected SO total tons)
            if (updatedCartTons > selectedTons) {
                setAlertMessage({
                    title: "Capacity Restriction",
                    message: `Vehicle capacity exceeded.\nAllowed: ${selectedTons.toFixed(2)} Tons\nTrying: ${updatedCartTons.toFixed(2)} Tons`,
                    continueLabel: "OK"
                });
                setShowAlert(true);
                return;
            }

            // 2️⃣ Restriction: Do not exceed actual Sales Order total volume capacity
            if (updatedCartTons > singleSummury.totalVolume) {
                setAlertMessage({
                    title: "Sales Order Volume Restriction",
                    message: `You cannot exceed ${singleSummury.totalVolume.toFixed(2)} Tons allowed by sales order.`,
                    continueLabel: "OK"
                });
                setShowAlert(true);
                return;
            }

            // 🟩 Continue cart update if valid
            setCart((prevCart) => {
                const newCategory = sku.Primary_category?.trim();
                const existingCategories = [
                    ...new Set(prevCart.map((item) => item.Primary_category?.trim())),
                ];

                if (existingCategories.length > 0 && !existingCategories.includes(newCategory)) {
                    setAlertMessage({
                        title: "Category Restriction",
                        message: `Only one category allowed.\nRemove ${existingCategories.join(", ")} before adding ${newCategory}.`,
                        continueLabel: "OK"
                    });
                    setShowAlert(true);
                    return prevCart;
                }

                const existingItem = prevCart.find((item) => item.sku === sku.Code);
                const totalPrice = sku.Dewas_ready_price * quantity;

                if (existingItem) {
                    return prevCart.map((item) =>
                        item.sku === sku.Code
                            ? {
                                ...item,
                                quantity: item.quantity + quantity,
                                total: item.price * (item.quantity + quantity),
                                totalVolume: item.totalVolume + sku.Net_Weight * quantity,
                                totalTons: item.totalTons + newSkuTons,
                                singleQTYWeight: sku.Net_Weight,
                                unit: sku.SAP_Unit,
                                materialStatus: "",
                                materialBalance: item.totalVolume + sku.Net_Weight * quantity,
                            }
                            : item
                    );
                }

                return [
                    ...prevCart,
                    {
                        sku: sku.Code,
                        name: sku.Name,
                        quantity,
                        price: sku.Dewas_ready_price,
                        total: totalPrice,
                        unit: sku.SAP_Unit,
                        Primary_category: newCategory,
                        totalVolume: sku.Net_Weight * quantity,
                        materialBalance: sku.Net_Weight * quantity,
                        totalTons: newSkuTons,
                        singleQTYWeight: sku.Net_Weight,
                        materialStatus: "",
                    },
                ];
            });
        } catch (err) {
            console.error("Error fetching price:", err);
            setError("Error adding item. Try again.");
            setTimeout(() => setError(null), 1000);
        }
    };

    const updateCartQuantity = (sku, newQuantity) => {
        if (!validateCapacity()) return;
        // Find current item in cart first
        const currentItem = cart.find((item) => item.sku === sku);
        if (!currentItem) return;

        const oldQuantity = currentItem.quantity;
        if (newQuantity < 1) newQuantity = 1;

        const volumePerUnit = currentItem.totalVolume / currentItem.quantity;
        const tonsPerUnit = currentItem.totalTons / currentItem.quantity;

        const currentCartTons = totalVolume / 1000;  // already in tons
        const selectedTons = Number(totalTonSelected);

        // Calculate new total tons if updated
        const updatedCartTons =
            currentCartTons - currentItem.totalTons + tonsPerUnit * newQuantity;

        // 🚨 If total tons exceed allowed tons → don't update
        if (updatedCartTons > selectedTons) {
            setAlertMessage({
                title: "Capacity Restriction",
                message: `You cannot exceed ${selectedTons.toFixed(2)} Tons. Keep quantity ≤ ${oldQuantity}`,
                continueLabel: "OK"
            });
            setShowAlert(true);

            // 🟨 Revert UI quantity back to old value
            setCart((prevCart) =>
                prevCart.map((item) =>
                    item.sku === sku
                        ? { ...item, quantity: oldQuantity } // revert change
                        : item
                )
            );
            return;
        }

        // 🟢 SAFE UPDATE
        setCart((prevCart) =>
            prevCart.map((item) => {
                if (item.sku === sku) {
                    return {
                        ...item,
                        quantity: newQuantity,
                        total: item.price * newQuantity,
                        totalVolume: volumePerUnit * newQuantity,
                        totalTons: tonsPerUnit * newQuantity,
                        materialBalance: volumePerUnit * newQuantity,
                    };
                }
                return item;
            })
        );
    };

    const removeFromCart = (sku) => {
        setCart((prevCart) => prevCart.filter((item) => item.sku !== sku));
    };
    const clearCart = () => {
        setCart([]);
    };

    const stringSAPDate = (sapDate) => {
        if (!sapDate || sapDate.length !== 8) return "";
        const year = sapDate.substring(0, 4);
        const month = sapDate.substring(4, 6);
        const day = sapDate.substring(6, 8);
        return `${day}-${month}-${year}`;   // format dd-mm-yyyy
    };
    const submitOrder = async () => {
        if (!validateCapacity()) return;
        // 🚫 Step 1: Validate
        if (cart.length === 0) {
            setAlertMessage({
                title: "❌ No Items",
                message: "No items in cart to process. Please add items before submitting.",
                continueLabel: "OK"
            });
            setShowAlert(true);
            return;
        }
        try {
            // 🕒 Step 2: Start loading
            setLoading(true);

            console.log("🟦 Order submitted:", {
                subCategory,
                items: cart,
                pendingOrders,
                SelectedOrders: selectedOrders,
                total: cartTotal,
                totalVolumeInKG: totalVolume,
                totalVolumeInTon: totalVolume / 1000,
                timestamp: new Date().toISOString(),
            });
            const selectedOrdersForIndent = pendingOrders.filter(order =>
                selectedOrders.includes(order.S_ORDER_NO)
            );
            // 🟨 Step 3: Merge Sales Orders
            const mergedOrders = MergeOrdersBySONumber(selectedOrdersForIndent);
            console.log("Merged Orders", mergedOrders);
            const parseSAPDate = (sapDate) => {
                if (!sapDate || sapDate.length !== 8) return new Date(0);
                const year = Number(sapDate.substring(0, 4));
                const month = Number(sapDate.substring(4, 6)) - 1;
                const day = Number(sapDate.substring(6, 8));
                return new Date(year, month, day);
            };
            const sortedOrders = mergedOrders.sort((a, b) => {
                const dateA = parseSAPDate(a.TO_DATE);
                const dateB = parseSAPDate(b.TO_DATE);
                return dateA - dateB;
            });
            console.log("🟨 Sorted Orders:", sortedOrders);
            // 🟧 Step 4: Break Orders Logic
            const breakedRecords = await BreakSalesOrder(mergedOrders, cart);
            console.log("🟧 Breaked Records:", breakedRecords);
            //TODO:Handle if breakedRecords is not empty or not null
            // 🟩 Step 5: Success Alert
            setAlertMessage({
                title: "✅ Success",
                message: "Sales Orders processed successfully!",
                continueLabel: "OK"
            });
            setShowAlert(true);
            setCart([]);

        } catch (error) {
            // 🔴 Step 6: Error handling
            console.error("🚨 Error in submitOrder:", error);

            setAlertMessage({
                title: "❌ Error",
                message: error?.response?.data?.message || "Something went wrong while processing orders.",
                continueLabel: "OK"
            });
            setShowAlert(true);
        } finally {
            // ⚪ Step 7: Stop loading
            setLoading(false);
        }
    };

    const handleCapacityChange = (e) => {
        const value = e.target.value === "" ? "" : Number(e.target.value);

        if (value === "" || isNaN(value)) {
            setCapacity("");
            return;
        }

        if (value < 0) {
            setAlertMessage({
                title: "Invalid Capacity",
                message: "Negative capacity not allowed.",
                continueLabel: "OK",
            });
            setShowAlert(true);
            setCapacity("");
            e.target.value = "";
            return;
        }

        if (value > 20) {
            setAlertMessage({
                title: "Capacity Restriction",
                message: "Entered capacity exceeds 20 Tons. Please enter capacity ≤ 20.",
                continueLabel: "OK",
            });
            setShowAlert(true);
            setCapacity("");
            e.target.value = "";
            return;
        }

        setCapacity(value);
    };



    const handleSalesOrder = async (sku) => {
        let keyword = "";
        console.log(capacity);
        if (filteredSKU) {
            setFilteredSKU([])
        }

        if (!capacity || capacity === "" || capacity === 0) {
            setAlertMessage({
                title: "Capacity Required",
                message: "Please enter capacity before selecting category.",
                continueLabel: "OK",
            });
            setShowAlert(true);
            return;
        }
        else if (capacity < 0) {
            setAlertMessage({
                title: "Invalid Capacity",
                message: "Negative capacity not allowed. Please enter a valid positive value.",
                continueLabel: "OK",
            });
            setShowAlert(true);
            setCapacity("");  // reset invalid
            return;
        }
        else if (capacity > 20) {
            setAlertMessage({
                title: "Capacity Limit Exceeded",
                message: "Maximum allowed capacity is 20 tons. Please enter capacity ≤ 20.",
                continueLabel: "OK",
            });
            setShowAlert(true);
            setCapacity("");  // reset invalid
            return;
        }
        setSingleSummury(sku);
        // 🔹 Match keyword based on category
        switch (sku.category.toUpperCase()) {
            case "SBO":
                keyword = "SOYA";
                break;
            case "GNO":
                keyword = "GROUNDNUT";
                break;
            case "SFO":
                keyword = "SUNFLOWER";
                break;
            case "KGMO":
                keyword = "MUSTARD";
                break;
            default:
                keyword = "";
        }


        // salesOrders.map(item => console.log("Sales Order Details", item.MATERIAL_DES_S, item.MATERIAL_S)
        // )

        // 🔹 Filter sales orders for selected category
        const filteredOrders = salesOrders.filter((order) =>
            order.MATERIAL_DES_S?.toUpperCase().includes(keyword)
        );

        // 🔹 For each order, find material weight from skuData
        const updatedOrders = filteredOrders.map((order) => {
            // Find matching SKU record
            const materialWeight = skuData.find(
                (item) => item.Code === order.MATERIAL_S
            );

            return {
                ...order,
                category: sku.category, // extra field
                materialWeight: materialWeight.Net_Weight, // add weight
                totalVolumeInKG: (materialWeight.Net_Weight * order.QUANTITIES_S),
                totalWeightInTon: ((materialWeight.Net_Weight * order.QUANTITIES_S) / 1000),
            };
        });


        const parseSAPDate = (sapDate) => {
            if (!sapDate || sapDate.length !== 8) return new Date(0);
            const year = Number(sapDate.substring(0, 4));
            const month = Number(sapDate.substring(4, 6)) - 1;
            const day = Number(sapDate.substring(6, 8));
            return new Date(year, month, day);
        };


        const sortedOrders = updatedOrders.sort((a, b) => {
            const dateA = parseSAPDate(a.TO_DATE);
            const dateB = parseSAPDate(b.TO_DATE);

            if (dateA.getTime() === dateB.getTime()) {
                // Secondary sort: Sales Order Number ascending
                return Number(a.S_ORDER_NO) - Number(b.S_ORDER_NO);
            }
            return dateA - dateB;
        });

        const mergedOrders = MergeOrdersBySONumber(sortedOrders)

        setPendingOrders(mergedOrders);

        // 🔹 Filter SKUs for the selected category
        const skuCategoryWise = skuData.filter(
            (item) => item.Primary_category === sku.category
        );
        console.log("Categorised SKU List", skuCategoryWise);
        setFilteredSKU(skuCategoryWise);

        console.log("Summary", summary);
        setSummurySelected(true);
    };

    const handleSelect = (value) => {
        const selected = filteredSKU.find((sku) => sku.Code === value);
        if (selected) addToCart(selected);
    };

    const handleCheckboxSku = (skuCode) => {
        if (!validateCapacity()) return;
        const isSelected = cart.some((item) => item.sku === skuCode);

        if (isSelected) {
            // Remove from cart
            setCart((prev) => prev.filter((item) => item.sku !== skuCode));
        } else {
            // Add to cart
            const selectedSKU = filteredSKU.find((item) => item.Code === skuCode);
            if (selectedSKU) addToCart(selectedSKU);
        }
    };

    const handleFilterSKU = async (sku) => {
        console.log("SKU ", sku);
        setSelectedSalesOrder(sku);
        console.log("Material", skuData);
        console.log("subcategory", subCategory);
        let cate = "";
        if (selectedSalesOrder && Object.keys(selectedSalesOrder).length > 0) {
            setSelectedSalesOrder({});
        } else {
            setSelectedSalesOrder(sku);
        }

        const materialDesc = sku.MATERIAL_DES_S?.toUpperCase() || "";
        switch (true) {
            case materialDesc.includes("SOYABEAN"):
                cate = "SBO";
                break;

            case materialDesc.includes("GROUNDNUT"):
                cate = "GNO";
                break;

            case materialDesc.includes("SUNFLOWER"):
                cate = "SFO";
                break;

            case materialDesc.includes("MUSTARD"):
                cate = "KGMO";
                break;

            default:
                cate = "UNKNOWN";
                return;
        }
        console.log("Detected Category:", cate);
        setDealerCategory(cate);
        const filtered = skuData.filter((item) => item.Primary_category === cate);
        // const filtered = skuData.filter(
        //   (item) =>
        //     item.Primary_category === cate &&
        //     item.Secondary_Category === subCategory
        // );
        console.log(filtered);
        setFilteredSKU(filtered);
        setSummurySelected(true);
        // console.log(skucheck);
        // const filtered = skuData.filter(item => item.Primary_category === sku.category && item.Secondary_Category === subCategory);
        // console.log(filtered);

        // setFilteredSKU(filtered)
    };

    const handleSO = (orderNo) => {
        if (!capacity || capacity === "" || capacity === 0) {
            alert('Please enter capacity before selecting category')

            // setAlertMessage({
            //   title: "Capacity Required",
            //   message: "Please enter capacity before selecting category.",
            //   continueLabel: "OK",
            // });
            // setShowAlert(true);

            return;
        }
        else if (capacity < 0) {
            alert('Negative capacity not allowed. Please enter a valid positive value.')
            // setAlertMessage({
            //   title: "Invalid Capacity",
            //   message: "Negative capacity not allowed. Please enter a valid positive value.",
            //   continueLabel: "OK",
            // });
            // setShowAlert(true);
            setCapacity("");  // reset invalid
            return selectedOrders;
        }
        else if (capacity > 20) {
            alert('Maximum allowed capacity is 20 tons. Please enter capacity ≤ 20.')
            // setAlertMessage({
            //   title: "Capacity Limit Exceeded",
            //   message: "Maximum allowed capacity is 20 tons. Please enter capacity ≤ 20.",
            //   continueLabel: "OK",
            // });
            // setShowAlert(true);
            setCapacity("");  // reset invalid
            return selectedOrders;
        }
        const orderIndex = pendingOrders.findIndex(
            (order) => order.S_ORDER_NO === orderNo
        );

        const isSelected = selectedOrders.includes(orderNo);

        // 🔒 Prevent skipping sequence (ex: selecting 3rd without 1st and 2nd)
        if (!isSelected) {
            for (let i = 0; i < orderIndex; i++) {
                if (!selectedOrders.includes(pendingOrders[i].S_ORDER_NO)) {

                    alert(`Please select orders sequentially. You must select Order ${pendingOrders[i].S_ORDER_NO} first.`)
                    // setAlertMessage({
                    //   title: "Selection Restriction",
                    //   message: `Please select orders sequentially. You must select Order ${pendingOrders[i].S_ORDER_NO} first.`,
                    //   continueLabel: "OK"
                    // });

                    // setShowAlert(true);
                    // setTimeout(() => {
                    //   setShowAlert(false);
                    // }, 1500);
                    return; // 🚫 Stop further handling
                }
            }
        }

        // ------------------------------------
        // Toggle selection logic (existing code)
        const updatedSelected = isSelected
            ? selectedOrders.filter((so) => so !== orderNo)
            : [...selectedOrders, orderNo];

        if (updatedSelected.length === 1) {
            const total = pendingOrders
                .filter((order) => updatedSelected.includes(order.S_ORDER_NO))
                .reduce((sum, order) => sum + Number(order.totalWeightInTon || 0), 0);

            setSelectedOrders(updatedSelected);
            setTotalTonSelected(total);
            return;
        }

        const total = pendingOrders
            .filter((order) => updatedSelected.includes(order.S_ORDER_NO))
            .reduce((sum, order) => sum + Number(order.totalWeightInTon || 0), 0);

        if (total > capacity) {

            alert(`Allowed capacity: ${capacity} Tons. Selected: ${total.toFixed(
                2
            )} Tons. Remove orders to continue. or Increase Capacity`)
            // setAlertMessage({
            //   title: "Capacity Restriction",
            //   message: `Allowed capacity: ${capacity} Tons. Selected: ${total.toFixed(
            //     2
            //   )} Tons. Remove orders to continue.`,
            //   continueLabel: "OK"
            // });
            // setShowAlert(true);
            // setTimeout(() => setShowAlert(false), 1500);
            return;
        }

        setSelectedOrders(updatedSelected);
        setTotalTonSelected(total);
    };



    const handleSubCategoryChange = (value) => {
        if (!validateCapacity()) return;
        console.log("Subcategory Changed:", value);
        setSubCategory(value);

        // Ensure you get category safely
        const category = filteredSKU[0]?.Primary_category || "";

        // Use the new 'value' directly instead of subCategory
        const filtered = skuData.filter(
            (item) =>
                item.Primary_category?.trim() === category?.trim() &&
                item.Secondary_Category?.trim() === value?.trim()
        );

        console.log("Filtered SKU Data:", filtered);
    };
    return (
        <>
            {!loading ? (
                <div className="p-6 space-y-6">
                    {error && <p className="text-red-500">{error}</p>}
                    <div className="p-6 space-y-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-bold flex items-center">
                                    <ClipboardList className="w-8 h-8 mr-3" />
                                    My Sauda
                                </h1>
                                <p className="text-muted-foreground">
                                    Break your sales Order in available SKUs
                                </p>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold flex items-center">
                                    <Truck className="w-8 h-8 mr-3" />
                                    Vehicle Capacity (in Tons)
                                </h1>
                                <Input
                                    type="text"                           // <- change from number to text
                                    inputMode="numeric"                   // <- mobile will show numeric keypad
                                    pattern="[0-9]*"                      // <- ensures only digits allowed
                                    placeholder="Select Vehicle Capacity"
                                    min={1}
                                    max={20}
                                    className="w-full text-center text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    onChange={handleCapacityChange}
                                    onKeyDown={(e) => {
                                        const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];
                                        if (!/^[0-9]$/.test(e.key) && !allowedKeys.includes(e.key)) {
                                            e.preventDefault();
                                        }
                                    }}
                                    onWheel={(e) => e.target.blur()}
                                />
                            </div>

                        </div>
                        <div className="mt-4 font-medium text-gray-800 ">
                            Total Tonnage Selected:{" "}
                            <span className="text-blue-600">
                                {totalTonSelected.toFixed(2)} Tons
                            </span>
                            {selectedOrders.length > 0 && (
                                <div className="mt-2 text-sm text-gray-600">
                                    Selected Orders: {selectedOrders.join(", ")}
                                </div>
                            )}
                        </div>
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Active Pending Contracts</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Total Volume</TableHead>
                                        {/* <TableHead>Total Price</TableHead> */}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {summary
                                        .filter(
                                            (item) => item.category && item.category !== "Unknown"
                                        ) // 👈 filter valid categories
                                        .map((item) => (
                                            <TableRow
                                                key={item.category}
                                                onClick={() => handleSalesOrder(item)}
                                            >
                                                <TableCell>{item.category}</TableCell>
                                                <TableCell>{item.totalVolume} MT</TableCell>
                                                {/* <TableCell>{item.totalPrice} ₹</TableCell> */}
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            ) : (<div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-60 z-50">
                <Spinner className="w-12 h-12 text-white animate-spin" />
                <span className="text-white text-lg mt-4 font-semibold">
                    Order Processing...
                </span>
            </div>)}
            {/*SKU Listing */}
            {
                summurySelected && (
                    <div className="p-6 flex flex-col gap-4">
                        <div className="rounded-md bg-blue-50 border border-blue-300 p-3">
                            <span className="text-sm font-medium text-blue-800">
                                You must select Sales Orders sequentially (FIFO: First in First Out)
                            </span>
                        </div>
                        <Select>
                            <SelectTrigger>
                                <SelectValue
                                    placeholder={
                                        selectedOrders.length === 0
                                            ? "Select Sales Orders"
                                            : `${selectedOrders.length} Order${selectedOrders.length > 1 ? "s" : ""} Selected`
                                    }
                                />
                            </SelectTrigger>
                            <SelectContent className="max-h-64 overflow-y-auto w-[420px] rounded-md border shadow-md bg-white">
                                {/* Header */}
                                <div className="flex items-center px-4 py-2 border-b bg-gray-100">
                                    <span className="font-semibold text-gray-700 w-[160px]">Sauda Number</span>
                                    <span className="font-semibold text-gray-700 w-[100px] text-center">Expiry</span>
                                    <span className="font-semibold text-gray-700 w-[100px] text-right">Tonnage</span>
                                </div>
                                {/* Rows */}
                                {pendingOrders.map((order) => {
                                    const isSelected = selectedOrders.includes(order.S_ORDER_NO);
                                    return (
                                        <div
                                            key={`${order.S_ORDER_NO}_${order.MATERIAL_S}`}
                                            className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 rounded"
                                            onClick={() => handleSO(order.S_ORDER_NO)}
                                        >
                                            <div className="flex items-center gap-2 w-[160px]">
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    readOnly
                                                    className="mr-1"
                                                />
                                                <span>{order.S_ORDER_NO}</span>
                                            </div>

                                            <span className="w-[100px] text-center">
                                                {stringSAPDate(order.TO_DATE)}
                                            </span>

                                            <span className="w-[100px] text-right font-medium text-blue-600">
                                                {Number(order.totalWeightInTon).toFixed(2)} MT
                                            </span>
                                        </div>
                                    );
                                })}
                            </SelectContent>
                        </Select>
                    </div>
                )
            }
            {totalTonSelected != 0 && (
                <div className="flex flex-col lg:flex-row gap-6 p-6">
                    {/* LEFT: SKUs Card */}
                    <Card className="w-full lg:w-1/2">
                        <CardHeader>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                                <div>
                                    <CardTitle className="flex items-center">
                                        <Package className="w-5 h-5 mr-2" />
                                        Available SKUs
                                    </CardTitle>
                                    <CardDescription>
                                        Browse and add products to your order
                                    </CardDescription>
                                </div>
                                {/* //TODO:enable Product Subcategory */}
                                {/* <div>
                  <label className="block text-sm font-medium mb-2">
                    Product Subcategory
                  </label>
                  <Select value={subCategory} onValueChange={handleSubCategoryChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CP">CP</SelectItem>
                      <SelectItem value="BP">BP</SelectItem>
                    </SelectContent>
                  </Select>
                </div> */}
                            </div>
                        </CardHeader>

                        <CardContent>
                            <div className="border rounded-lg p-2 max-h-64 overflow-y-auto w-full">
                                {filteredSKU.map((sku) => {
                                    const isSelected = cart.some((item) => item.sku === sku.Code);
                                    return (
                                        <div
                                            key={sku.Code}
                                            className="flex items-center px-2 py-1 cursor-pointer hover:bg-gray-100 rounded"
                                            onClick={() => handleCheckboxSku(sku.Code)}
                                        >
                                            <input type="checkbox" checked={isSelected} readOnly className="mr-2" />
                                            <span>{sku.Code} - {sku.Name}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* RIGHT: Cart Card */}
                    {cart.length > 0 && (
                        <div className="hidden lg:block w-full lg:w-1/2">
                            <Card className="">
                                <CardHeader className="flex flex-col space-y-2">
                                    {/* Top section — title + right-aligned total */}
                                    <div className="flex justify-between items-center w-full">
                                        <CardTitle>Order Preview</CardTitle>

                                        <div className="flex items-center space-x-4 ml-auto">
                                            {/* <span className="font-medium text-lg">
                    Total: ₹{cartTotal.toLocaleString()}
                  </span> */}
                                            <Button variant="outline" size="sm" onClick={clearCart}>
                                                Clear Cart
                                            </Button>
                                        </div>
                                    </div>
                                    {/* Description stays below title */}
                                    <CardDescription>Review your order before submission</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2 max-h-60 overflow-y-auto">
                                        <div className="border rounded-lg overflow-x-auto">
                                            <Table size="2">
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>SKU Code</TableHead>
                                                        <TableHead>Product Name</TableHead>
                                                        <TableHead>Unit</TableHead>
                                                        {/* <TableHead>List Price (₹)</TableHead> */}
                                                        {/* <TableHead>Total (₹)</TableHead> */}
                                                        <TableHead>Quantity</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {cart.map((item) => {
                                                        const basic = parseFloat(item.BasicPrice || 0);
                                                        const final = parseFloat(item.FinalBP || 0);
                                                        const tax = parseFloat(item.TaxValue || 0);
                                                        const total = (final + tax) * item.quantity;
                                                        {
                                                            console.log("cart Item", item);
                                                        }
                                                        return (
                                                            <TableRow key={item.sku}>
                                                                <TableCell>{item.sku}</TableCell>
                                                                <TableCell>{item.name}</TableCell>
                                                                <TableCell>{item.unit}</TableCell>
                                                                {/* <TableCell>
                              ₹
                              {item.price
                                ? Number(item.price).toFixed(2)
                                : "0.00"}
                            </TableCell> */}
                                                                {/* <TableCell>₹{item.total.toLocaleString()}</TableCell> */}
                                                                <TableCell className="w-44 text-center">
                                                                    <div className="flex items-center justify-center gap-2">
                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                            onClick={() =>
                                                                                updateCartQuantity(
                                                                                    item.sku,
                                                                                    item.quantity - 1
                                                                                )
                                                                            }
                                                                        >
                                                                            <Minus className="w-3 h-3" />
                                                                        </Button>
                                                                        <Input
                                                                            type="text"                           // <- change from number to text
                                                                            inputMode="numeric"                   // <- mobile will show numeric keypad
                                                                            pattern="[0-9]*"
                                                                            value={item.quantity}
                                                                            min={1}
                                                                            max={9999}
                                                                            className="w-24 text-center text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                                            onChange={(e) =>
                                                                                updateCartQuantity(
                                                                                    item.sku,
                                                                                    Number(e.target.value)
                                                                                )
                                                                            }
                                                                            onKeyDown={(e) => {
                                                                                if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                                                                                    e.preventDefault();
                                                                                }
                                                                            }}
                                                                            onWheel={(e) => e.target.blur()}
                                                                        />
                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                            onClick={() =>
                                                                                updateCartQuantity(
                                                                                    item.sku,
                                                                                    item.quantity + 1
                                                                                )
                                                                            }
                                                                        >
                                                                            <Plus className="w-3 h-3" />
                                                                        </Button>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => removeFromCart(item.sku)}
                                                                    >
                                                                        <Trash2 className="w-3 h-3" />
                                                                    </Button>
                                                                </TableCell>
                                                            </TableRow>
                                                        );
                                                    })}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between mt-2">
                                                    <span>Total Items:</span>
                                                    <span className="font-medium">{cartItems}</span>
                                                </div>
                                                <div className="flex justify-between mt-2">
                                                    <span>Unique SKUs:</span>
                                                    <span className="font-medium">{cart.length}</span>
                                                </div>
                                                <Separator />
                                                <div className="flex justify-between">
                                                    {/* <span className="font-medium">Total Amount:</span> */}
                                                    {/* <span className="font-bold">₹{cartTotal.toLocaleString()}</span> */}
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-medium">Total Volume:</span>
                                                    <span className="font-bold">
                                                        {(totalVolume / 1000).toFixed(2)} MT
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                </div>
            )}


            {/* Order Summary and Submission */}
            {cart.length > 0 && (
                <div className="block lg:hidden p-6 space-y-6">
                    <Card className="">
                        <CardHeader className="flex flex-col space-y-2">
                            {/* Top section — title + right-aligned total */}
                            <div className="flex justify-between items-center w-full">
                                <CardTitle>Order Preview</CardTitle>

                                <div className="flex items-center space-x-4 ml-auto">
                                    {/* <span className="font-medium text-lg">
                    Total: ₹{cartTotal.toLocaleString()}
                  </span> */}
                                    <Button variant="outline" size="sm" onClick={clearCart}>
                                        Clear Cart
                                    </Button>
                                </div>
                            </div>
                            {/* Description stays below title */}
                            <CardDescription>Review your order before submission</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                                <div className="border rounded-lg overflow-x-auto">
                                    <Table size="2">
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>SKU Code</TableHead>
                                                <TableHead>Product Name</TableHead>
                                                <TableHead>Unit</TableHead>
                                                {/* <TableHead>List Price (₹)</TableHead> */}
                                                {/* <TableHead>Total (₹)</TableHead> */}
                                                <TableHead>Quantity</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {cart.map((item) => {
                                                const basic = parseFloat(item.BasicPrice || 0);
                                                const final = parseFloat(item.FinalBP || 0);
                                                const tax = parseFloat(item.TaxValue || 0);
                                                const total = (final + tax) * item.quantity;
                                                {
                                                    console.log("cart Item", item);
                                                }
                                                return (
                                                    <TableRow key={item.sku}>
                                                        <TableCell>{item.sku}</TableCell>
                                                        <TableCell>{item.name}</TableCell>
                                                        <TableCell>{item.unit}</TableCell>
                                                        {/* <TableCell>
                              ₹
                              {item.price
                                ? Number(item.price).toFixed(2)
                                : "0.00"}
                            </TableCell> */}
                                                        {/* <TableCell>₹{item.total.toLocaleString()}</TableCell> */}
                                                        <TableCell className="w-44 text-center">
                                                            <div className="flex items-center justify-center gap-2">
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        updateCartQuantity(
                                                                            item.sku,
                                                                            item.quantity - 1
                                                                        )
                                                                    }
                                                                >
                                                                    <Minus className="w-3 h-3" />
                                                                </Button>
                                                                <Input
                                                                    type="text"                           // <- change from number to text
                                                                    inputMode="numeric"                   // <- mobile will show numeric keypad
                                                                    pattern="[0-9]*"
                                                                    value={item.quantity}
                                                                    min={1}
                                                                    max={9999}
                                                                    className="w-24 text-center text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                                    onChange={(e) =>
                                                                        updateCartQuantity(
                                                                            item.sku,
                                                                            Number(e.target.value)
                                                                        )
                                                                    }
                                                                    onKeyDown={(e) => {
                                                                        if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                                                                            e.preventDefault();
                                                                        }
                                                                    }}
                                                                    onWheel={(e) => e.target.blur()}
                                                                />
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        updateCartQuantity(
                                                                            item.sku,
                                                                            item.quantity + 1
                                                                        )
                                                                    }
                                                                >
                                                                    <Plus className="w-3 h-3" />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => removeFromCart(item.sku)}
                                                            >
                                                                <Trash2 className="w-3 h-3" />
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between mt-2">
                                            <span>Total Items:</span>
                                            <span className="font-medium">{cartItems}</span>
                                        </div>
                                        <div className="flex justify-between mt-2">
                                            <span>Unique SKUs:</span>
                                            <span className="font-medium">{cart.length}</span>
                                        </div>
                                        <Separator />
                                        <div className="flex justify-between">
                                            {/* <span className="font-medium">Total Amount:</span> */}
                                            {/* <span className="font-bold">₹{cartTotal.toLocaleString()}</span> */}
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-medium">Total Volume:</span>
                                            <span className="font-bold">
                                                {(totalVolume / 1000).toFixed(2)} MT
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
            {cart.length > 0 && (
                <div className="p-6 space-y-6 ">
                    <Card className="">
                        <CardHeader>
                            <CardTitle>Vehicle Details</CardTitle>
                            <CardDescription>
                                Review your order before submission
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    {/* <h4 className="font-medium mb-3">vehicle Details</h4> */}
                                    <div className="space-y-2 text-sm items-center">
                                        {/* <div className="flex justify-between p-1 ">
                    <span>Vehicle Volume FullFillment Satus:</span>
                    <Progress value={totalVolume / .01} className=" h-2 items-center" color="orange" />
                    <LucideTruck className="w-10 h-8 text-center" />
                  </div> */}
                                        <div className="flex justify-between">
                                            <span className="p-1">Vehicle Number:</span>
                                            <input
                                                name="vehicleNumber"
                                                value={vehicleDetails.vehicleNumber}
                                                onChange={handleVehicleChange}
                                                className="border-b border-black text-gray-900 focus:ring-blue-500 focus:border-blue-500 block p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                placeholder="Vehicle Number (e.g. MP09CX1234)"
                                            />
                                        </div>
                                        {error && (
                                            <span className="text-red-500 text-sm block mt-1 text-right">
                                                {error}
                                            </span>
                                        )}
                                        <div className="flex justify-between">
                                            <span className="p-1">Vehicle Placement date:</span>
                                            <input
                                                type="date"
                                                name="placementDate"
                                                value={vehicleDetails.placementDate}
                                                onChange={handleVehicleChange}
                                                required
                                                className="border-b border-black text-gray-900 focus:ring-blue-500 focus:border-blue-500 block p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            />
                                        </div>
                                        <Separator />
                                        {/* <div className="flex justify-between">
                         <span className="font-medium">Total Amount:</span>
                         <span className="font-bold">₹{cartTotal.toLocaleString()}</span>
                       </div> */}
                                    </div>
                                </div>
                            </div>
                            <div className="flex lg:justify-end lg:gap-2 space-x-2">
                                <Button variant="outline" onClick={clearCart}>
                                    Clear Order
                                </Button>
                                <Button onClick={submitOrder} className="min-w-32">
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Submit Order
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )
            }

            <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{alertMessage.title}</AlertDialogTitle>
                        <AlertDialogDescription>{alertMessage.message}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => setShowAlert(false)}>
                            {alertMessage.continueLabel || "OK"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}


