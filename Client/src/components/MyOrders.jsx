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
















// import { useState, useEffect, useMemo } from "react";
// import axios from "axios";
// import { Spinner } from '../components/ui/spinner'
// import {
//   Table,
//   TableHeader,
//   TableBody,
//   TableRow,
//   TableHead,
//   TableCell,
// } from "./ui/table";
// import {
//   ShoppingCart,
//   Plus,
//   Minus,
//   Trash2,
//   Search,
//   Filter,
//   Package,
//   Tag,
//   IndianRupee,
//   CheckCircle,
//   AlertCircle,
//   Package2,
//   ClipboardList,
//   Truck,
// } from "lucide-react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "./ui/card";
// import { Input } from "./ui/input";
// import { Separator } from "./ui/separator";
// import { Button } from "./ui/button";
// import { Progress } from "./ui/progress";
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
// } from "../components/ui/alert-dialog";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "./ui/select";
// import { breakeOrders } from "../lib/UpdateOrders";
// import MergeOrdersBySONumber from "../lib/mergeOrdersBySONumber";
// import BreakSalesOrder from "../lib/BreakSalesOrder";
// import { AlertDialogOverlay } from "@radix-ui/react-alert-dialog";
// import GlobalAlert from "./GlobalAlert";
// async function fetchSAPData(apiUrl) {
//   try {
//     const response = await axios.get(apiUrl, {
//       auth: {
//         username: "dev01",
//         password: "Kriti@12",
//       },
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json; charset=utf-8",
//       },
//     });
//     return response.data.d.results;
//   } catch (err) {
//     let errorMessage = "Failed to fetch SAP data. Please try again later.";
//     if (err.code === "ERR_NETWORK") {
//       errorMessage = "Network error: Unable to connect to the API.";
//     } else if (err.response?.status === 401) {
//       errorMessage = "Authentication failed: Invalid username or password.";
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

//   // ✅ Set fromDate = today - 15 days
//   const firstDayOfMonth = new Date();
//   firstDayOfMonth.setDate(today.getDate() - 15);

//   const [summurySelected, setSummurySelected] = useState(false);
//   const [singleSummury, setSingleSummury] = useState({})
//   const [vehicleDetails, setVehicleDetails] = useState({
//     vehicleNumber: "",
//     placementDate: "",
//   });
//   const vehicleRegex = /^[A-Z]{2}\s?\d{2}\s?[A-Z]{1,2}\s?\d{4}$/i;
//   const [selectedSalesOrder, setSelectedSalesOrder] = useState({});
//   const [dealerCategory, setDealerCategory] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [skuData, setSkuData] = useState([]);
//   const [salesOrders, setSalesOrders] = useState([]);
//   const [pendingOrders, setPendingOrders] = useState([]);
//   const [summary, setSummary] = useState([]);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [filteredSKU, setFilteredSKU] = useState([]);
//   const [cart, setCart] = useState([]);
//   const [skuWithPrice, setSkuWithPrice] = useState({});
//   const [capacity, setCapacity] = useState(0);
//   const [subCategory, setSubCategory] = useState("BP");
//   const [fromDate, setFromDate] = useState(formatForInput(firstDayOfMonth));
//   const [toDate, setToDate] = useState(formatForInput(today));
//   const [alertMessage, setAlertMessage] = useState({
//     title: "",
//     message: "",
//     cancelLabel: "",
//     continueLabel: "",
//   });
//   const [showAlert, setShowAlert] = useState(false);
//   const [newCapacity, setNewCapacity] = useState("");
//   const [selectedOrders, setSelectedOrders] = useState([]);
//   const [totalTonSelected, setTotalTonSelected] = useState(0)

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
//   const handleVehicleChange = (e) => {
//     const { name, value } = e.target;

//     setVehicleDetails((prev) => ({
//       ...prev,
//       [name]: value.toUpperCase(), // make uppercase automatically
//     }));

//     if (name === "vehicleNumber") {
//       if (value === "" || vehicleRegex.test(value)) {
//         setError(""); // valid
//       } else {
//         setError("Invalid vehicle number format (e.g. MP09CX1234)");
//       }
//     }
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

//     const apiUrl = `api/sap/opu/odata/sap/ZSALES_ORDER_VIEW_SRV/SalesOrderSet?$filter=FROM_DATE eq '${formatForAPI(
//       fromDate
//     )}' and TO_DATE eq '${formatForAPI(
//       toDate
//     )}' and CUST_CODE_S eq '${custCode}'&$expand=DeliveryOrderSet/InvoiceSet`;

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
//               del.InvoiceSet?.results
//                 .map((inv) => inv.INVOICE_NO_I)
//                 .join(", ") || "";
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
//         (order) =>
//           !order.INVOICE_NUMBERS ||
//           order.INVOICE_NUMBERS === "-" ||
//           order.INVOICE_NUMBERS.trim() === ""
//       );
//       console.log("Order Without Invoice", withoutInvoice);
//       setSalesOrders(withoutInvoice);

//       setPendingOrders(withoutInvoice);
//     } catch (err) {
//       console.error("Error fetching sales orders:", err);
//       setError("Failed to fetch sales orders.");
//     } finally {
//       setLoading(false);
//     }
//   };
//   // const getPrice = async (sku) => {
//   //   try {
//   //     console.log(selectedSalesOrder);
//   //     const priceURL = `/api/sap/opu/odata/sap/ZSD_PRICING_SALES_SRV/zprice_customerSet?$filter=ZcustNo eq '${storedDealer.UserName}' and ZdistChn eq 'O3' and ZdocType eq 'Z02' and ZPlant eq '${storedDealer.Location}' and   ZPriceList eq '${selectedSalesOrder.PRICELIST}' and Material eq '${sku}'`;
//   //     console.log("get Price SKU", sku);
//   //     console.log("URL Price", priceURL);
//   //     const priceData = await fetchSAPData(priceURL);
//   //     console.log("Pricedata", priceData);
//   //     const matchingRecord = priceData.find(
//   //       (record) => record.Material === sku
//   //     );
//   //     if (matchingRecord) {
//   //       const priceInfo = {
//   //         BasicPrice: parseFloat(matchingRecord.BasicPrice) || 0,
//   //         FinalBP: parseFloat(matchingRecord.FinalBP) || 0,
//   //         TaxValue: parseFloat(matchingRecord.TaxValue) || 0,
//   //         BaseUnit: matchingRecord.BaseUnit || "",
//   //         BasicPrice: parseFloat(matchingRecord.BasicPrice) || 0,
//   //         CONVERTUNITVALUE: parseFloat(matchingRecord.CONVERTUNITVALUE) || 0,
//   //         FinalBP: parseFloat(matchingRecord.FinalBP) || 0,
//   //         FinalMP: parseFloat(matchingRecord.FinalMP) || 0,
//   //         MatDescription: matchingRecord.MatDescription || "",
//   //         MatGrpDesc: matchingRecord.MatGrpDesc || "",
//   //         MatGrpDesc2: matchingRecord.MatGrpDesc2 || "",
//   //         MatPrice: parseFloat(matchingRecord.MatPrice) || 0,
//   //         Material: matchingRecord.Material || "",
//   //         MaterialDesc: matchingRecord.MaterialDesc || "",
//   //         NetValue: parseFloat(matchingRecord.NetValue) || 0,
//   //         Quantity: parseFloat(matchingRecord.Quantity) || 0,
//   //         Tax: parseFloat(matchingRecord.Tax) || 0,
//   //         TaxValue: parseFloat(matchingRecord.TaxValue) || 0,
//   //         UMREN: parseFloat(matchingRecord.UMREN) || 0,
//   //         UMREZ: parseFloat(matchingRecord.UMREZ) || 0,
//   //         ZPlant: matchingRecord.ZPlant || "",
//   //         ZPriceGroup: matchingRecord.ZPriceGroup || "",
//   //         ZPriceList: matchingRecord.ZPriceList || "",
//   //         ZcustNo: matchingRecord.ZcustNo || "",
//   //         ZdistChn: matchingRecord.ZdistChn || "",
//   //         Zdivision: matchingRecord.Zdivision || "",
//   //         ZdocType: matchingRecord.ZdocType || "",
//   //       };
//   //       console.log("Price Infor", priceInfo);

//   //       // Store price for that specific SKU
//   //       setSkuWithPrice((prev) => ({
//   //         ...prev,
//   //         [sku.Code]: priceInfo,
//   //       }));
//   //       return priceInfo;
//   //     } else {
//   //       console.warn(`No price found for ${sku}`);
//   //       return { BasicPrice: 0, FinalBP: 0, TaxValue: 0 };
//   //     }
//   //   } catch (error) {
//   //     console.error("Error fetching price:", error);
//   //     return { BasicPrice: 0, FinalBP: 0, TaxValue: 0 };
//   //   }
//   // };

//   useEffect(() => {
//     if (skuData.length > 0 && salesOrders.length > 0) {
//       const combined = salesOrders.map((order) => {
//         const sku = skuData.find((s) => s.Code === order.MATERIAL_S);
//         return {
//           MATERIAL_S: order.MATERIAL_S,
//           QUANTITIES_S: Number(order.QUANTITIES_S),
//           Primary_category: sku?.Primary_category || "Unknown",
//           Gross_Weight: Number(sku?.Net_Weight || 0),
//           Price: Number(order?.GROSS_VALUE_S || 0),
//         };
//       });

//       const categoryMap = {};
//       combined.forEach((item) => {
//         if (!categoryMap[item.Primary_category]) {
//           categoryMap[item.Primary_category] = {
//             totalVolume: 0,
//             totalPrice: 0,
//           };
//         }

//         categoryMap[item.Primary_category].totalVolume +=
//           item.QUANTITIES_S * item.Gross_Weight;
//         categoryMap[item.Primary_category].totalPrice +=
//           item.QUANTITIES_S * item.Price;
//       });

//       let result = Object.keys(categoryMap)
//         .filter((cat) => cat !== "Unknown")   // REMOVE Unknown
//         .map((cat) => ({
//           category: cat,
//           totalVolume: (categoryMap[cat].totalVolume / 1000).toFixed(3),
//           totalPrice: categoryMap[cat].totalPrice.toFixed(2),
//         }));

//       // DEFAULT 4 categories
//       const defaultCategories = ["SBO", "SFO", "GNO", "KGMO"];

//       defaultCategories.forEach((cat) => {
//         if (!result.some((item) => item.category === cat)) {
//           result.push({
//             category: cat,
//             totalVolume: "0.00",
//             totalPrice: "0.00",
//           });
//         }
//       });

//       // ORDER by predefined sequence
//       result = result.sort(
//         (a, b) => defaultCategories.indexOf(a.category) - defaultCategories.indexOf(b.category)
//       );
//       setSummary(result);
//     }
//   }, [skuData, salesOrders]);



//   // useEffect(() => {
//   //   if (showAlert) {
//   //     const timer = setTimeout(() => {
//   //       setShowAlert(false);
//   //     }, 1000);
//   //     return () => clearTimeout(timer);
//   //   }
//   // }, [showAlert]);

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
//   useEffect(() => {
//     if (selectedOrders.length === 0) return;

//     const total = pendingOrders
//       .filter((order) => selectedOrders.includes(order.S_ORDER_NO))
//       .reduce((sum, order) => sum + Number(order.totalWeightInTon || 0), 0);

//     if (total !== totalTonSelected) {
//       setTotalTonSelected(total);
//     }
//   }, [selectedOrders]);   // ❗ remove pendingOrders dependency


//   const cartTotal = useMemo(
//     () => cart.reduce((sum, item) => sum + item.total, 0),
//     [cart]
//   );
//   const cartItems = useMemo(
//     () => cart.reduce((sum, item) => sum + item.quantity, 0),
//     [cart]
//   );
//   const totalVolume = useMemo(
//     () => cart.reduce((sum, item) => sum + (item.totalVolume || 0), 0),
//     [cart]
//   );
//   const handleContinue = () => {
//     setCart([]); // clear old category items
//     setShowAlert(false);
//   };

//   const validateCapacity = () => {
//     if (capacity === "" || capacity === null || capacity === undefined) {
//       setAlertMessage({
//         title: "Capacity Required",
//         message: "Please enter vehicle capacity first.",
//         continueLabel: "OK",
//       });
//       setShowAlert(true);
//       return false;
//     }

//     if (capacity <= 0) {
//       setAlertMessage({
//         title: "Invalid Capacity",
//         message: "Capacity cannot be zero or negative.",
//         continueLabel: "OK",
//       });
//       setShowAlert(true);
//       setCapacity("");
//       return false;
//     }

//     if (capacity > 20) {
//       setAlertMessage({
//         title: "Capacity Restriction",
//         message: "Capacity cannot exceed 20 Tons. Enter capacity ≤ 20.",
//         continueLabel: "OK",
//       });
//       setShowAlert(true);
//       setCapacity("");
//       return false;
//     }

//     return true; // VALID
//   };

//   // const addToCart = async (sku, quantity = 1) => {
//   //   if (!validateCapacity()) return;
//   //   try {
//   //     setError(null);


//   //     console.log("Att To Cart AKU", sku);
//   //     // const priceInfo = skuWithPrice[sku.Code] || (await getPrice(sku.Code));
//   //     const newCategory = sku.Primary_category?.trim();
//   //     setCart((prevCart) => {
//   //       const existingCategories = [
//   //         ...new Set(prevCart.map((item) => item.Primary_category?.trim())),
//   //       ];

//   //       if (
//   //         existingCategories.length > 0 &&
//   //         !existingCategories.includes(newCategory)
//   //       ) {
//   //         setAlertMessage({
//   //           title: "Category Restriction",
//   //           message: `❌ You can only place orders for one category at a time.\n\nRemove ${existingCategories.join(
//   //             ", "
//   //           )} items before adding ${newCategory} items.`,
//   //           continueLabel: "OK"

//   //         });
//   //         setShowAlert(true);
//   //         return prevCart;
//   //       }

//   //       const existingItem = prevCart.find((item) => item.sku === sku.Code);
//   //       const totalPrice =
//   //         (sku.Dewas_ready_price) * quantity;

//   //       // Compute the new total tons if this item is added
//   //       const newTotalTons =
//   //         totalVolume / 1000 +
//   //         (sku.Net_Weight / 1000) * (existingItem ? quantity : quantity);

//   //       if (newTotalTons > singleSummury.totalVolume) {
//   //         setAlertMessage({
//   //           title: "Capacity Restriction",
//   //           message: `Entered capacity exceeds ${singleSummury.totalVolume} tons. Please enter a valid capacity (≤ ${singleSummury.totalVolume}).`,
//   //           continueLabel: "OK"
//   //         });
//   //         setShowAlert(true);
//   //         return prevCart;
//   //       }

//   //       if (existingItem) {
//   //         return prevCart.map((item) =>
//   //           item.sku === sku.Code
//   //             ? {
//   //               ...item,
//   //               quantity: item.quantity + quantity,
//   //               total: item.price * (item.quantity + quantity),
//   //               totalVolume: item.totalVolume + sku.Net_Weight * quantity,
//   //               totalTons:
//   //                 item.totalTons + (sku.Net_Weight / 1000) * quantity,
//   //               singleQTYWeight: sku.Net_Weight,
//   //               unit: sku.SAP_Unit,
//   //               materialStatus: "",
//   //               materialBalance: item.totalVolume + sku.Net_Weight * quantity,
//   //             }
//   //             : item
//   //         );
//   //       } else {
//   //         return [
//   //           ...prevCart,
//   //           {
//   //             sku: sku.Code,
//   //             name: sku.Name,
//   //             quantity,
//   //             price: sku.Dewas_ready_price,
//   //             total: totalPrice,
//   //             unit: sku.SAP_Unit,
//   //             Primary_category: newCategory,
//   //             totalVolume: sku.Net_Weight * quantity,
//   //             materialBalance: sku.Net_Weight * quantity,
//   //             totalTons: (sku.Net_Weight / 1000) * quantity,
//   //             singleQTYWeight: sku.Net_Weight,
//   //             materialStatus: "",
//   //           },
//   //         ];
//   //       }
//   //     });
//   //   } catch (err) {
//   //     console.error("Error fetching price:", err);
//   //     setError("⚠️ Failed to add item to cart. Please try again.");
//   //     setTimeout(() => setError(null), 1000);
//   //   } finally {

//   //   }
//   // };



//   const addToCart = async (sku, quantity = 1) => {
//     if (!validateCapacity()) return;

//     try {
//       setError(null);

//       const selectedTons = Number(totalTonSelected);     // Allowed tons from selected SOs
//       const currentCartTons = totalVolume / 1000;        // Current cart tons
//       const newSkuTons = (sku.Net_Weight / 1000) * quantity;
//       const updatedCartTons = currentCartTons + newSkuTons;

//       // 1️⃣ Restriction: Vehicle capacity (based on selected SO total tons)
//       if (updatedCartTons > selectedTons) {
//         setAlertMessage({
//           title: "Capacity Restriction",
//           message: `Vehicle capacity exceeded.\nAllowed: ${selectedTons.toFixed(2)} Tons\nTrying: ${updatedCartTons.toFixed(2)} Tons`,
//           continueLabel: "OK"
//         });
//         setShowAlert(true);
//         return;
//       }

//       // 2️⃣ Restriction: Do not exceed actual Sales Order total volume capacity
//       if (updatedCartTons > singleSummury.totalVolume) {
//         setAlertMessage({
//           title: "Sales Order Volume Restriction",
//           message: `You cannot exceed ${singleSummury.totalVolume.toFixed(2)} Tons allowed by sales order.`,
//           continueLabel: "OK"
//         });
//         setShowAlert(true);
//         return;
//       }

//       // 🟩 Continue cart update if valid
//       setCart((prevCart) => {
//         const newCategory = sku.Primary_category?.trim();
//         const existingCategories = [
//           ...new Set(prevCart.map((item) => item.Primary_category?.trim())),
//         ];

//         if (existingCategories.length > 0 && !existingCategories.includes(newCategory)) {
//           setAlertMessage({
//             title: "Category Restriction",
//             message: `Only one category allowed.\nRemove ${existingCategories.join(", ")} before adding ${newCategory}.`,
//             continueLabel: "OK"
//           });
//           setShowAlert(true);
//           return prevCart;
//         }

//         const existingItem = prevCart.find((item) => item.sku === sku.Code);
//         const totalPrice = sku.Dewas_ready_price * quantity;

//         if (existingItem) {
//           return prevCart.map((item) =>
//             item.sku === sku.Code
//               ? {
//                 ...item,
//                 quantity: item.quantity + quantity,
//                 total: item.price * (item.quantity + quantity),
//                 totalVolume: item.totalVolume + sku.Net_Weight * quantity,
//                 totalTons: item.totalTons + newSkuTons,
//                 singleQTYWeight: sku.Net_Weight,
//                 unit: sku.SAP_Unit,
//                 materialStatus: "",
//                 materialBalance: item.totalVolume + sku.Net_Weight * quantity,
//               }
//               : item
//           );
//         }

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
//             totalTons: newSkuTons,
//             singleQTYWeight: sku.Net_Weight,
//             materialStatus: "",
//           },
//         ];
//       });
//     } catch (err) {
//       console.error("Error fetching price:", err);
//       setError("Error adding item. Try again.");
//       setTimeout(() => setError(null), 1000);
//     }
//   };

//   const updateCartQuantity = (sku, newQuantity) => {
//     if (!validateCapacity()) return;
//     // Find current item in cart first
//     const currentItem = cart.find((item) => item.sku === sku);
//     if (!currentItem) return;

//     const oldQuantity = currentItem.quantity;
//     if (newQuantity < 1) newQuantity = 1;

//     const volumePerUnit = currentItem.totalVolume / currentItem.quantity;
//     const tonsPerUnit = currentItem.totalTons / currentItem.quantity;

//     const currentCartTons = totalVolume / 1000;  // already in tons
//     const selectedTons = Number(totalTonSelected);

//     // Calculate new total tons if updated
//     const updatedCartTons =
//       currentCartTons - currentItem.totalTons + tonsPerUnit * newQuantity;

//     // 🚨 If total tons exceed allowed tons → don't update
//     if (updatedCartTons > selectedTons) {
//       setAlertMessage({
//         title: "Capacity Restriction",
//         message: `You cannot exceed ${selectedTons.toFixed(2)} Tons. Keep quantity ≤ ${oldQuantity}`,
//         continueLabel: "OK"
//       });
//       setShowAlert(true);

//       // 🟨 Revert UI quantity back to old value
//       setCart((prevCart) =>
//         prevCart.map((item) =>
//           item.sku === sku
//             ? { ...item, quantity: oldQuantity } // revert change
//             : item
//         )
//       );
//       return;
//     }

//     // 🟢 SAFE UPDATE
//     setCart((prevCart) =>
//       prevCart.map((item) => {
//         if (item.sku === sku) {
//           return {
//             ...item,
//             quantity: newQuantity,
//             total: item.price * newQuantity,
//             totalVolume: volumePerUnit * newQuantity,
//             totalTons: tonsPerUnit * newQuantity,
//             materialBalance: volumePerUnit * newQuantity,
//           };
//         }
//         return item;
//       })
//     );
//   };

//   const removeFromCart = (sku) => {
//     setCart((prevCart) => prevCart.filter((item) => item.sku !== sku));
//   };
//   const clearCart = () => {
//     setCart([]);
//   };

//   const stringSAPDate = (sapDate) => {
//     if (!sapDate || sapDate.length !== 8) return "";
//     const year = sapDate.substring(0, 4);
//     const month = sapDate.substring(4, 6);
//     const day = sapDate.substring(6, 8);
//     return `${day}-${month}-${year}`;   // format dd-mm-yyyy
//   };
//   const submitOrder = async () => {
//     if (!validateCapacity()) return;
//     // 🚫 Step 1: Validate
//     if (cart.length === 0) {
//       setAlertMessage({
//         title: "❌ No Items",
//         message: "No items in cart to process. Please add items before submitting.",
//         continueLabel: "OK"
//       });
//       setShowAlert(true);
//       return;
//     }
//     try {
//       // 🕒 Step 2: Start loading
//       setLoading(true);

//       console.log("🟦 Order submitted:", {
//         subCategory,
//         items: cart,
//         pendingOrders,
//         SelectedOrders: selectedOrders,
//         total: cartTotal,
//         totalVolumeInKG: totalVolume,
//         totalVolumeInTon: totalVolume / 1000,
//         timestamp: new Date().toISOString(),
//       });
//       const selectedOrdersForIndent = pendingOrders.filter(order =>
//         selectedOrders.includes(order.S_ORDER_NO)
//       );
//       // 🟨 Step 3: Merge Sales Orders
//       const mergedOrders = MergeOrdersBySONumber(pendingOrders);
//       console.log("Merged Orders", mergedOrders);
//       const parseSAPDate = (sapDate) => {
//         if (!sapDate || sapDate.length !== 8) return new Date(0);
//         const year = Number(sapDate.substring(0, 4));
//         const month = Number(sapDate.substring(4, 6)) - 1;
//         const day = Number(sapDate.substring(6, 8));
//         return new Date(year, month, day);
//       };
//       const sortedOrders = mergedOrders.sort((a, b) => {
//         const dateA = parseSAPDate(a.TO_DATE);
//         const dateB = parseSAPDate(b.TO_DATE);
//         return dateA - dateB;
//       });
//       console.log("🟨 Sorted Orders:", sortedOrders);
//       // 🟧 Step 4: Break Orders Logic
//       const breakedRecords = await BreakSalesOrder(mergedOrders, cart);
//       console.log("🟧 Breaked Records:", breakedRecords);
//       //TODO:Handle if breakedRecords is not empty or not null
//       // 🟩 Step 5: Success Alert
//       setAlertMessage({
//         title: "✅ Success",
//         message: "Sales Orders processed successfully!",
//         continueLabel: "OK"
//       });
//       setShowAlert(true);
//       setCart([]);

//     } catch (error) {
//       // 🔴 Step 6: Error handling
//       console.error("🚨 Error in submitOrder:", error);

//       setAlertMessage({
//         title: "❌ Error",
//         message: error?.response?.data?.message || "Something went wrong while processing orders.",
//         continueLabel: "OK"
//       });
//       setShowAlert(true);
//     } finally {
//       // ⚪ Step 7: Stop loading
//       setLoading(false);
//     }
//   };

//   const handleCapacityChange = (e) => {
//     const value = e.target.value === "" ? "" : Number(e.target.value);

//     if (value === "" || isNaN(value)) {
//       setCapacity("");
//       return;
//     }

//     if (value < 0) {
//       setAlertMessage({
//         title: "Invalid Capacity",
//         message: "Negative capacity not allowed.",
//         continueLabel: "OK",
//       });
//       setShowAlert(true);
//       setCapacity("");
//       e.target.value = "";
//       return;
//     }

//     if (value > 20) {
//       setAlertMessage({
//         title: "Capacity Restriction",
//         message: "Entered capacity exceeds 20 Tons. Please enter capacity ≤ 20.",
//         continueLabel: "OK",
//       });
//       setShowAlert(true);
//       setCapacity("");
//       e.target.value = "";
//       return;
//     }

//     setCapacity(value);
//   };



//   const handleSalesOrder = async (sku) => {
//     let keyword = "";
//     console.log(capacity);
//     if (filteredSKU) {
//       setFilteredSKU([])
//     }

//     if (!capacity || capacity === "" || capacity === 0) {
//       setAlertMessage({
//         title: "Capacity Required",
//         message: "Please enter capacity before selecting category.",
//         continueLabel: "OK",
//       });
//       setShowAlert(true);
//       return;
//     }
//     else if (capacity < 0) {
//       setAlertMessage({
//         title: "Invalid Capacity",
//         message: "Negative capacity not allowed. Please enter a valid positive value.",
//         continueLabel: "OK",
//       });
//       setShowAlert(true);
//       setCapacity("");  // reset invalid
//       return;
//     }
//     else if (capacity > 20) {
//       setAlertMessage({
//         title: "Capacity Limit Exceeded",
//         message: "Maximum allowed capacity is 20 tons. Please enter capacity ≤ 20.",
//         continueLabel: "OK",
//       });
//       setShowAlert(true);
//       setCapacity("");  // reset invalid
//       return;
//     }
//     setSingleSummury(sku);
//     // 🔹 Match keyword based on category
//     switch (sku.category.toUpperCase()) {
//       case "SBO":
//         keyword = "SOYA";
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


//     // salesOrders.map(item => console.log("Sales Order Details", item.MATERIAL_DES_S, item.MATERIAL_S)
//     // )

//     // 🔹 Filter sales orders for selected category
//     const filteredOrders = salesOrders.filter((order) =>
//       order.MATERIAL_DES_S?.toUpperCase().includes(keyword)
//     );

//     // 🔹 For each order, find material weight from skuData
//     const updatedOrders = filteredOrders.map((order) => {
//       // Find matching SKU record
//       const materialWeight = skuData.find(
//         (item) => item.Code === order.MATERIAL_S
//       );

//       return {
//         ...order,
//         category: sku.category, // extra field
//         materialWeight: materialWeight.Net_Weight, // add weight
//         totalVolumeInKG: (materialWeight.Net_Weight * order.QUANTITIES_S),
//         totalWeightInTon: ((materialWeight.Net_Weight * order.QUANTITIES_S) / 1000),
//       };
//     });


//     const parseSAPDate = (sapDate) => {
//       if (!sapDate || sapDate.length !== 8) return new Date(0);
//       const year = Number(sapDate.substring(0, 4));
//       const month = Number(sapDate.substring(4, 6)) - 1;
//       const day = Number(sapDate.substring(6, 8));
//       return new Date(year, month, day);
//     };


//     const sortedOrders = updatedOrders.sort((a, b) => {
//       const dateA = parseSAPDate(a.TO_DATE);
//       const dateB = parseSAPDate(b.TO_DATE);

//       if (dateA.getTime() === dateB.getTime()) {
//         // Secondary sort: Sales Order Number ascending
//         return Number(a.S_ORDER_NO) - Number(b.S_ORDER_NO);
//       }
//       return dateA - dateB;
//     });

//     const mergedOrders = MergeOrdersBySONumber(sortedOrders)

//     setPendingOrders(mergedOrders);

//     // 🔹 Filter SKUs for the selected category
//     const skuCategoryWise = skuData.filter(
//       (item) => item.Primary_category === sku.category
//     );
//     console.log("Categorised SKU List", skuCategoryWise);
//     setFilteredSKU(skuCategoryWise);

//     console.log("Summary", summary);
//     setSummurySelected(true);
//   };

//   const handleSelect = (value) => {
//     const selected = filteredSKU.find((sku) => sku.Code === value);
//     if (selected) addToCart(selected);
//   };

//   const handleCheckboxSku = (skuCode) => {
//     if (!validateCapacity()) return;
//     const isSelected = cart.some((item) => item.sku === skuCode);

//     if (isSelected) {
//       // Remove from cart
//       setCart((prev) => prev.filter((item) => item.sku !== skuCode));
//     } else {
//       // Add to cart
//       const selectedSKU = filteredSKU.find((item) => item.Code === skuCode);
//       if (selectedSKU) addToCart(selectedSKU);
//     }
//   };

//   const handleFilterSKU = async (sku) => {
//     console.log("SKU ", sku);
//     setSelectedSalesOrder(sku);
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
//     setDealerCategory(cate);
//     const filtered = skuData.filter((item) => item.Primary_category === cate);
//     // const filtered = skuData.filter(
//     //   (item) =>
//     //     item.Primary_category === cate &&
//     //     item.Secondary_Category === subCategory
//     // );
//     console.log(filtered);
//     setFilteredSKU(filtered);
//     setSummurySelected(true);
//     // console.log(skucheck);
//     // const filtered = skuData.filter(item => item.Primary_category === sku.category && item.Secondary_Category === subCategory);
//     // console.log(filtered);

//     // setFilteredSKU(filtered)
//   };

//   const handleSO = (orderNo) => {
//     if (!capacity || capacity === "" || capacity === 0) {
//       alert('Please enter capacity before selecting category')

//       // setAlertMessage({
//       //   title: "Capacity Required",
//       //   message: "Please enter capacity before selecting category.",
//       //   continueLabel: "OK",
//       // });
//       // setShowAlert(true);

//       return;
//     }
//     else if (capacity < 0) {
//       alert('Negative capacity not allowed. Please enter a valid positive value.')
//       // setAlertMessage({
//       //   title: "Invalid Capacity",
//       //   message: "Negative capacity not allowed. Please enter a valid positive value.",
//       //   continueLabel: "OK",
//       // });
//       // setShowAlert(true);
//       setCapacity("");  // reset invalid
//       return selectedOrders;
//     }
//     else if (capacity > 20) {
//       alert('Maximum allowed capacity is 20 tons. Please enter capacity ≤ 20.')
//       // setAlertMessage({
//       //   title: "Capacity Limit Exceeded",
//       //   message: "Maximum allowed capacity is 20 tons. Please enter capacity ≤ 20.",
//       //   continueLabel: "OK",
//       // });
//       // setShowAlert(true);
//       setCapacity("");  // reset invalid
//       return selectedOrders;
//     }
//     const orderIndex = pendingOrders.findIndex(
//       (order) => order.S_ORDER_NO === orderNo
//     );

//     const isSelected = selectedOrders.includes(orderNo);

//     // 🔒 Prevent skipping sequence (ex: selecting 3rd without 1st and 2nd)
//     if (!isSelected) {
//       for (let i = 0; i < orderIndex; i++) {
//         if (!selectedOrders.includes(pendingOrders[i].S_ORDER_NO)) {

//           alert(`Please select orders sequentially. You must select Order ${pendingOrders[i].S_ORDER_NO} first.`)
//           // setAlertMessage({
//           //   title: "Selection Restriction",
//           //   message: `Please select orders sequentially. You must select Order ${pendingOrders[i].S_ORDER_NO} first.`,
//           //   continueLabel: "OK"
//           // });

//           // setShowAlert(true);
//           // setTimeout(() => {
//           //   setShowAlert(false);
//           // }, 1500);
//           return; // 🚫 Stop further handling
//         }
//       }
//     }

//     // ------------------------------------
//     // Toggle selection logic (existing code)
//     const updatedSelected = isSelected
//       ? selectedOrders.filter((so) => so !== orderNo)
//       : [...selectedOrders, orderNo];

//     if (updatedSelected.length === 1) {
//       const total = pendingOrders
//         .filter((order) => updatedSelected.includes(order.S_ORDER_NO))
//         .reduce((sum, order) => sum + Number(order.totalWeightInTon || 0), 0);

//       setSelectedOrders(updatedSelected);
//       setTotalTonSelected(total);
//       return;
//     }

//     const total = pendingOrders
//       .filter((order) => updatedSelected.includes(order.S_ORDER_NO))
//       .reduce((sum, order) => sum + Number(order.totalWeightInTon || 0), 0);

//     if (total > capacity) {

//       alert(`Allowed capacity: ${capacity} Tons. Selected: ${total.toFixed(
//         2
//       )} Tons. Remove orders to continue. or Increase Capacity`)
//       // setAlertMessage({
//       //   title: "Capacity Restriction",
//       //   message: `Allowed capacity: ${capacity} Tons. Selected: ${total.toFixed(
//       //     2
//       //   )} Tons. Remove orders to continue.`,
//       //   continueLabel: "OK"
//       // });
//       // setShowAlert(true);
//       // setTimeout(() => setShowAlert(false), 1500);
//       return;
//     }

//     setSelectedOrders(updatedSelected);
//     setTotalTonSelected(total);
//   };



//   const handleSubCategoryChange = (value) => {
//     if (!validateCapacity()) return;
//     console.log("Subcategory Changed:", value);
//     setSubCategory(value);

//     // Ensure you get category safely
//     const category = filteredSKU[0]?.Primary_category || "";

//     // Use the new 'value' directly instead of subCategory
//     const filtered = skuData.filter(
//       (item) =>
//         item.Primary_category?.trim() === category?.trim() &&
//         item.Secondary_Category?.trim() === value?.trim()
//     );

//     console.log("Filtered SKU Data:", filtered);
//   };
//   return (
//     <>
//       {!loading ? (
//         <div className="p-6 space-y-6">
//           {error && <p className="text-red-500">{error}</p>}
//           <div className="p-6 space-y-6">
//             <div className="flex justify-between items-start">
//               <div>
//                 <h1 className="text-3xl font-bold flex items-center">
//                   <ClipboardList className="w-8 h-8 mr-3" />
//                   My Sauda
//                 </h1>
//                 <p className="text-muted-foreground">
//                   Break your sales Order in available SKUs
//                 </p>
//               </div>
//               <div>
//                 <h1 className="text-xl font-bold flex items-center">
//                   <Truck className="w-8 h-8 mr-3" />
//                   Vehicle Capacity (in Tons)
//                 </h1>
//                 <Input
//                   type="text"                           // <- change from number to text
//                   inputMode="numeric"                   // <- mobile will show numeric keypad
//                   pattern="[0-9]*"                      // <- ensures only digits allowed
//                   placeholder="Select Vehicle Capacity"
//                   min={1}
//                   max={20}
//                   className="w-full text-center text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
//                   onChange={handleCapacityChange}
//                   onKeyDown={(e) => {
//                     const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];
//                     if (!/^[0-9]$/.test(e.key) && !allowedKeys.includes(e.key)) {
//                       e.preventDefault();
//                     }
//                   }}
//                   onWheel={(e) => e.target.blur()}
//                 />
//               </div>

//             </div>
//             <div className="mt-4 font-medium text-gray-800 ">
//               Total Tonnage Selected:{" "}
//               <span className="text-blue-600">
//                 {totalTonSelected.toFixed(2)} Tons
//               </span>
//               {selectedOrders.length > 0 && (
//                 <div className="mt-2 text-sm text-gray-600">
//                   Selected Orders: {selectedOrders.join(", ")}
//                 </div>
//               )}
//             </div>
//           </div>
//           <Card>
//             <CardHeader>
//               <CardTitle>Active Pending Contracts</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Category</TableHead>
//                     <TableHead>Total Volume</TableHead>
//                     {/* <TableHead>Total Price</TableHead> */}
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {summary
//                     .filter((item) => item.category && item.category !== "Unknown")
//                     .map((item) => (
//                       <TableRow
//                         key={item.category}
//                         onClick={() => handleSalesOrder(item)}
//                       >
//                         <TableCell>{item.category}</TableCell>
//                         <TableCell>{item.totalVolume} MT</TableCell>

//                         {/* Show input only if totalVolume > 0 */}
//                         {Number(item.totalVolume) > 0 && (
//                           <TableCell>
//                             <Input
//                               className="w-34 border-black text-center text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
//                               type="text"
//                             />
//                           </TableCell>
//                         )}
//                       </TableRow>
//                     ))}
//                 </TableBody>
//               </Table>
//             </CardContent>
//           </Card>
//         </div>
//       ) : (<div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-60 z-50">
//         <Spinner className="w-12 h-12 text-white animate-spin" />
//         <span className="text-white text-lg mt-4 font-semibold">
//           Order Processing...
//         </span>
//       </div>)}
//       {/*SKU Listing */}
//       {
//         summurySelected && (
//           <div className="p-6 flex flex-col gap-4">
//             <div className="rounded-md bg-blue-50 border border-blue-300 p-3">
//               <span className="text-sm font-medium text-blue-800">
//                 You must select Sales Orders sequentially (FIFO: First in First Out)
//               </span>
//             </div>
//             <Select>
//               <SelectTrigger>
//                 <SelectValue
//                   placeholder={
//                     selectedOrders.length === 0
//                       ? "Select Sales Orders"
//                       : `${selectedOrders.length} Order${selectedOrders.length > 1 ? "s" : ""} Selected`
//                   }
//                 />
//               </SelectTrigger>
//               <SelectContent className="max-h-64 overflow-y-auto w-[420px] rounded-md border shadow-md bg-white">
//                 {/* Header */}
//                 <div className="flex items-center px-4 py-2 border-b bg-gray-100">
//                   <span className="font-semibold text-gray-700 w-[160px]">Sauda Number</span>
//                   <span className="font-semibold text-gray-700 w-[100px] text-center">Expiry</span>
//                   <span className="font-semibold text-gray-700 w-[100px] text-right">Tonnage</span>
//                 </div>
//                 {/* Rows */}
//                 {pendingOrders.map((order) => {
//                   const isSelected = selectedOrders.includes(order.S_ORDER_NO);
//                   return (
//                     <div
//                       key={`${order.S_ORDER_NO}_${order.MATERIAL_S}`}
//                       className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 rounded"
//                       onClick={() => handleSO(order.S_ORDER_NO)}
//                     >
//                       <div className="flex items-center gap-2 w-40">
//                         <input
//                           type="checkbox"
//                           checked={isSelected}
//                           readOnly
//                           className="mr-1"
//                         />
//                         <span>{order.S_ORDER_NO}</span>
//                       </div>

//                       <span className="w-[100px] text-center">
//                         {stringSAPDate(order.TO_DATE)}
//                       </span>

//                       <span className="w-[100px] text-right font-medium text-blue-600">
//                         {Number(order.totalWeightInTon).toFixed(2)} MT
//                       </span>
//                     </div>
//                   );
//                 })}
//               </SelectContent>
//             </Select>
//           </div>
//         )
//       }
//       {totalTonSelected != 0 && (
//         <div className="flex flex-col lg:flex-row gap-6 p-6">
//           {/* LEFT: SKUs Card */}
//           <Card className="w-full lg:w-1/2">
//             <CardHeader>
//               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
//                 <div>
//                   <CardTitle className="flex items-center">
//                     <Package className="w-5 h-5 mr-2" />
//                     Available SKUs
//                   </CardTitle>
//                   <CardDescription>
//                     Browse and add products to your order
//                   </CardDescription>
//                 </div>
//                 {/* //TODO:enable Product Subcategory */}
//                 {/* <div>
//                   <label className="block text-sm font-medium mb-2">
//                     Product Subcategory
//                   </label>
//                   <Select value={subCategory} onValueChange={handleSubCategoryChange}>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select subcategory" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="CP">CP</SelectItem>
//                       <SelectItem value="BP">BP</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div> */}
//               </div>
//             </CardHeader>

//             <CardContent>
//               <div className="border rounded-lg p-2 max-h-64 overflow-y-auto w-full">
//                 {filteredSKU.map((sku) => {
//                   const isSelected = cart.some((item) => item.sku === sku.Code);
//                   return (
//                     <div
//                       key={sku.Code}
//                       className="flex items-center px-2 py-1 cursor-pointer hover:bg-gray-100 rounded"
//                       onClick={() => handleCheckboxSku(sku.Code)}
//                     >
//                       <input type="checkbox" checked={isSelected} readOnly className="mr-2" />
//                       <span>{sku.Code} - {sku.Name}</span>
//                     </div>
//                   );
//                 })}
//               </div>
//             </CardContent>
//           </Card>

//           {/* RIGHT: Cart Card */}
//           {cart.length > 0 && (
//             <div className="hidden lg:block w-full lg:w-1/2">
//               <Card className="">
//                 <CardHeader className="flex flex-col space-y-2">
//                   {/* Top section — title + right-aligned total */}
//                   <div className="flex justify-between items-center w-full">
//                     <CardTitle>Order Preview</CardTitle>

//                     <div className="flex items-center space-x-4 ml-auto">
//                       {/* <span className="font-medium text-lg">
//                     Total: ₹{cartTotal.toLocaleString()}
//                   </span> */}
//                       <Button variant="outline" size="sm" onClick={clearCart}>
//                         Clear Cart
//                       </Button>
//                     </div>
//                   </div>
//                   {/* Description stays below title */}
//                   <CardDescription>Review your order before submission</CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="space-y-2 max-h-60 overflow-y-auto">
//                     <div className="border rounded-lg overflow-x-auto">
//                       <Table size="2">
//                         <TableHeader>
//                           <TableRow>
//                             <TableHead>SKU Code</TableHead>
//                             <TableHead>Product Name</TableHead>
//                             <TableHead>Unit</TableHead>
//                             {/* <TableHead>List Price (₹)</TableHead> */}
//                             {/* <TableHead>Total (₹)</TableHead> */}
//                             <TableHead>Quantity</TableHead>
//                           </TableRow>
//                         </TableHeader>
//                         <TableBody>
//                           {cart.map((item) => {
//                             const basic = parseFloat(item.BasicPrice || 0);
//                             const final = parseFloat(item.FinalBP || 0);
//                             const tax = parseFloat(item.TaxValue || 0);
//                             const total = (final + tax) * item.quantity;
//                             {
//                               console.log("cart Item", item);
//                             }
//                             return (
//                               <TableRow key={item.sku}>
//                                 <TableCell>{item.sku}</TableCell>
//                                 <TableCell>{item.name}</TableCell>
//                                 <TableCell>{item.unit}</TableCell>
//                                 {/* <TableCell>
//                               ₹
//                               {item.price
//                                 ? Number(item.price).toFixed(2)
//                                 : "0.00"}
//                             </TableCell> */}
//                                 {/* <TableCell>₹{item.total.toLocaleString()}</TableCell> */}
//                                 <TableCell className="w-44 text-center">
//                                   <div className="flex items-center justify-center gap-2">
//                                     <Button
//                                       variant="outline"
//                                       size="sm"
//                                       onClick={() =>
//                                         updateCartQuantity(
//                                           item.sku,
//                                           item.quantity - 1
//                                         )
//                                       }
//                                     >
//                                       <Minus className="w-3 h-3" />
//                                     </Button>
//                                     <Input
//                                       type="text"                           // <- change from number to text
//                                       inputMode="numeric"                   // <- mobile will show numeric keypad
//                                       pattern="[0-9]*"
//                                       value={item.quantity}
//                                       min={1}
//                                       max={9999}
//                                       className="w-24 text-center text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
//                                       onChange={(e) =>
//                                         updateCartQuantity(
//                                           item.sku,
//                                           Number(e.target.value)
//                                         )
//                                       }
//                                       onKeyDown={(e) => {
//                                         if (e.key === "ArrowUp" || e.key === "ArrowDown") {
//                                           e.preventDefault();
//                                         }
//                                       }}
//                                       onWheel={(e) => e.target.blur()}
//                                     />
//                                     <Button
//                                       variant="outline"
//                                       size="sm"
//                                       onClick={() =>
//                                         updateCartQuantity(
//                                           item.sku,
//                                           item.quantity + 1
//                                         )
//                                       }
//                                     >
//                                       <Plus className="w-3 h-3" />
//                                     </Button>
//                                   </div>
//                                 </TableCell>
//                                 <TableCell>
//                                   <Button
//                                     variant="ghost"
//                                     size="sm"
//                                     onClick={() => removeFromCart(item.sku)}
//                                   >
//                                     <Trash2 className="w-3 h-3" />
//                                   </Button>
//                                 </TableCell>
//                               </TableRow>
//                             );
//                           })}
//                         </TableBody>
//                       </Table>
//                     </div>
//                   </div>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div>
//                       <div className="space-y-2 text-sm">
//                         <div className="flex justify-between mt-2">
//                           <span>Total Items:</span>
//                           <span className="font-medium">{cartItems}</span>
//                         </div>
//                         <div className="flex justify-between mt-2">
//                           <span>Unique SKUs:</span>
//                           <span className="font-medium">{cart.length}</span>
//                         </div>
//                         <Separator />
//                         <div className="flex justify-between">
//                           {/* <span className="font-medium">Total Amount:</span> */}
//                           {/* <span className="font-bold">₹{cartTotal.toLocaleString()}</span> */}
//                         </div>
//                         <div className="flex justify-between">
//                           <span className="font-medium">Total Volume:</span>
//                           <span className="font-bold">
//                             {(totalVolume / 1000).toFixed(2)} MT
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           )}

//         </div>
//       )}


//       {/* Order Summary and Submission */}
//       {cart.length > 0 && (
//         <div className="block lg:hidden p-6 space-y-6">
//           <Card className="">
//             <CardHeader className="flex flex-col space-y-2">
//               {/* Top section — title + right-aligned total */}
//               <div className="flex justify-between items-center w-full">
//                 <CardTitle>Order Preview</CardTitle>

//                 <div className="flex items-center space-x-4 ml-auto">
//                   {/* <span className="font-medium text-lg">
//                     Total: ₹{cartTotal.toLocaleString()}
//                   </span> */}
//                   <Button variant="outline" size="sm" onClick={clearCart}>
//                     Clear Cart
//                   </Button>
//                 </div>
//               </div>
//               {/* Description stays below title */}
//               <CardDescription>Review your order before submission</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="space-y-2 max-h-60 overflow-y-auto">
//                 <div className="border rounded-lg overflow-x-auto">
//                   <Table size="2">
//                     <TableHeader>
//                       <TableRow>
//                         <TableHead>SKU Code</TableHead>
//                         <TableHead>Product Name</TableHead>
//                         <TableHead>Unit</TableHead>
//                         {/* <TableHead>List Price (₹)</TableHead> */}
//                         {/* <TableHead>Total (₹)</TableHead> */}
//                         <TableHead>Quantity</TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {cart.map((item) => {
//                         const basic = parseFloat(item.BasicPrice || 0);
//                         const final = parseFloat(item.FinalBP || 0);
//                         const tax = parseFloat(item.TaxValue || 0);
//                         const total = (final + tax) * item.quantity;
//                         {
//                           console.log("cart Item", item);
//                         }
//                         return (
//                           <TableRow key={item.sku}>
//                             <TableCell>{item.sku}</TableCell>
//                             <TableCell>{item.name}</TableCell>
//                             <TableCell>{item.unit}</TableCell>
//                             {/* <TableCell>
//                               ₹
//                               {item.price
//                                 ? Number(item.price).toFixed(2)
//                                 : "0.00"}
//                             </TableCell> */}
//                             {/* <TableCell>₹{item.total.toLocaleString()}</TableCell> */}
//                             <TableCell className="w-44 text-center">
//                               <div className="flex items-center justify-center gap-2">
//                                 <Button
//                                   variant="outline"
//                                   size="sm"
//                                   onClick={() =>
//                                     updateCartQuantity(
//                                       item.sku,
//                                       item.quantity - 1
//                                     )
//                                   }
//                                 >
//                                   <Minus className="w-3 h-3" />
//                                 </Button>
//                                 <Input
//                                   type="text"                           // <- change from number to text
//                                   inputMode="numeric"                   // <- mobile will show numeric keypad
//                                   pattern="[0-9]*"
//                                   value={item.quantity}
//                                   min={1}
//                                   max={9999}
//                                   className="w-24 text-center text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
//                                   onChange={(e) =>
//                                     updateCartQuantity(
//                                       item.sku,
//                                       Number(e.target.value)
//                                     )
//                                   }
//                                   onKeyDown={(e) => {
//                                     if (e.key === "ArrowUp" || e.key === "ArrowDown") {
//                                       e.preventDefault();
//                                     }
//                                   }}
//                                   onWheel={(e) => e.target.blur()}
//                                 />
//                                 <Button
//                                   variant="outline"
//                                   size="sm"
//                                   onClick={() =>
//                                     updateCartQuantity(
//                                       item.sku,
//                                       item.quantity + 1
//                                     )
//                                   }
//                                 >
//                                   <Plus className="w-3 h-3" />
//                                 </Button>
//                               </div>
//                             </TableCell>
//                             <TableCell>
//                               <Button
//                                 variant="ghost"
//                                 size="sm"
//                                 onClick={() => removeFromCart(item.sku)}
//                               >
//                                 <Trash2 className="w-3 h-3" />
//                               </Button>
//                             </TableCell>
//                           </TableRow>
//                         );
//                       })}
//                     </TableBody>
//                   </Table>
//                 </div>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <div className="space-y-2 text-sm">
//                     <div className="flex justify-between mt-2">
//                       <span>Total Items:</span>
//                       <span className="font-medium">{cartItems}</span>
//                     </div>
//                     <div className="flex justify-between mt-2">
//                       <span>Unique SKUs:</span>
//                       <span className="font-medium">{cart.length}</span>
//                     </div>
//                     <Separator />
//                     <div className="flex justify-between">
//                       {/* <span className="font-medium">Total Amount:</span> */}
//                       {/* <span className="font-bold">₹{cartTotal.toLocaleString()}</span> */}
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="font-medium">Total Volume:</span>
//                       <span className="font-bold">
//                         {(totalVolume / 1000).toFixed(2)} MT
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       )}
//       {cart.length > 0 && (
//         <div className="p-6 space-y-6 ">
//           <Card className="">
//             <CardHeader>
//               <CardTitle>Vehicle Details</CardTitle>
//               <CardDescription>
//                 Review your order before submission
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   {/* <h4 className="font-medium mb-3">vehicle Details</h4> */}
//                   <div className="space-y-2 text-sm items-center">
//                     {/* <div className="flex justify-between p-1 ">
//                     <span>Vehicle Volume FullFillment Satus:</span>
//                     <Progress value={totalVolume / .01} className=" h-2 items-center" color="orange" />
//                     <LucideTruck className="w-10 h-8 text-center" />
//                   </div> */}
//                     <div className="flex justify-between">
//                       <span className="p-1">Vehicle Number:</span>
//                       <Input
//                         name="vehicleNumber"
//                         value={vehicleDetails.vehicleNumber}
//                         onChange={handleVehicleChange}
//                         className="border-b border-black text-gray-900 focus:ring-blue-500 focus:border-blue-500 block p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//                         placeholder="Vehicle Number (e.g. MP09CX1234)"
//                       />
//                     </div>
//                     {error && (
//                       <span className="text-red-500 text-sm block mt-1 text-right">
//                         {error}
//                       </span>
//                     )}
//                     <div className="flex justify-between">
//                       <span className="p-1">Vehicle Placement date:</span>
//                       <input
//                         type="date"
//                         name="placementDate"
//                         value={vehicleDetails.placementDate}
//                         onChange={handleVehicleChange}
//                         required
//                         className="border-b border-black text-gray-900 focus:ring-blue-500 focus:border-blue-500 block p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//                       />
//                     </div>
//                     <Separator />
//                     {/* <div className="flex justify-between">
//                          <span className="font-medium">Total Amount:</span>
//                          <span className="font-bold">₹{cartTotal.toLocaleString()}</span>
//                        </div> */}
//                   </div>
//                 </div>
//               </div>
//               <div className="flex lg:justify-end lg:gap-2 space-x-2">
//                 <Button variant="outline" onClick={clearCart}>
//                   Clear Order
//                 </Button>
//                 <Button onClick={submitOrder} className="min-w-32">
//                   <CheckCircle className="w-4 h-4 mr-2" />
//                   Submit Order
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       )
//       }

//       <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>{alertMessage.title}</AlertDialogTitle>
//             <AlertDialogDescription>{alertMessage.message}</AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogAction onClick={() => setShowAlert(false)}>
//               {alertMessage.continueLabel || "OK"}
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </>
//   );
// }






// Keep your existing imports, adjust paths as per your project.
import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import { ClipboardList, Package, Truck, CheckCircle, Minus, Plus, Trash2 } from "lucide-react";

import { Spinner } from "../components/ui/spinner";      // adjust if needed
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/card";                          // adjust if needed

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../components/ui/table";                         // adjust if needed

import { Input } from "../components/ui/input";          // adjust if needed
import { Button } from "../components/ui/button";        // adjust if needed
import { Separator } from "../components/ui/separator";  // adjust if needed

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel
} from "../components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../components/ui/dialog";
// adjust if needed

import MergeOrdersBySONumber from "../lib/mergeOrdersBySONumber";
import BreakSalesOrder from "../lib/BreakSalesOrder";
import getCategoryName from "../lib/getCategoryName";
//This is working but user have to select capacity for each category separately
// export function MyOrders() {
//   const formatForInput = (date) => {
//     const yyyy = date.getFullYear();
//     const mm = String(date.getMonth() + 1).padStart(2, "0");
//     const dd = String(date.getDate()).padStart(2, "0");
//     return `${yyyy}-${mm}-${dd}`;
//   };

//   const today = new Date();
//   const firstDayOfMonth = new Date();
//   firstDayOfMonth.setDate(today.getDate() - 15);

//   const [dealerCategory, setDealerCategory] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [skuData, setSkuData] = useState([]);
//   const [salesOrders, setSalesOrders] = useState([]);
//   const [summary, setSummary] = useState([]);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const [showPreviewModal, setShowPreviewModal] = useState(false);
//   const [showConfirmModal, setShowConfirmModal] = useState(false);   // <- ADD THIS
//   const [previewData, setPreviewData] = useState([]);



//   // GLOBAL vehicle capacity (max 20)
//   const [capacity, setCapacity] = useState("");

//   // Per-category capacity in Tons (string to simplify input)
//   const [categoryCapacity, setCategoryCapacity] = useState({
//     SBO: "",
//     SFO: "",
//     GNO: "",
//     KGMO: "",
//     Bari: "",
//   });

//   // Per-category cart: { SBO: [...], SFO: [...], ... }
//   const [cartByCategory, setCartByCategory] = useState({
//     SBO: [],
//     SFO: [],
//     GNO: [],
//     KGMO: [],
//     Bari: [],
//   });

//   // Accordion open state
//   const [openCategory, setOpenCategory] = useState(null);

//   const [fromDate, setFromDate] = useState(formatForInput(firstDayOfMonth));
//   const [toDate, setToDate] = useState(formatForInput(today));

//   const [alertMessage, setAlertMessage] = useState({
//     title: "",
//     message: "",
//     continueLabel: "",
//   });
//   const [showAlert, setShowAlert] = useState(false);

//   const [vehicleDetails, setVehicleDetails] = useState({
//     vehicleNumber: "",
//     placementDate: "",
//   });

//   const vehicleRegex = /^[A-Z]{2}\s?\d{2}\s?[A-Z]{1,2}\s?\d{4}$/i;

//   const storedDealer = JSON.parse(localStorage.getItem("dealerData"));
//   const custCode = storedDealer?.UserName || "";

//   const formatForAPI = (dateStr) => {
//     const [yyyy, mm, dd] = dateStr.split("-");
//     return `${dd}.${mm}.${yyyy}`;
//   };

//   const stringSAPDate = (sapDate) => {
//     if (!sapDate || sapDate.length !== 8) return "";
//     const year = sapDate.substring(0, 4);
//     const month = sapDate.substring(4, 6);
//     const day = sapDate.substring(6, 8);
//     return `${day}-${month}-${year}`; // dd-mm-yyyy
//   };

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

//   const handleVehicleChange = (e) => {
//     const { name, value } = e.target;

//     setVehicleDetails((prev) => ({
//       ...prev,
//       [name]: value.toUpperCase(),
//     }));

//     if (name === "vehicleNumber") {
//       if (value === "" || vehicleRegex.test(value)) {
//         setError("");
//       } else {
//         setError("Invalid vehicle number format (e.g. MP09CX1234)");
//       }
//     }
//   };

//   // =========================
//   // DATA FETCH
//   // =========================

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

//   // const fetchSalesOrders = async () => {
//   //   if (!custCode) {
//   //     setError("Customer code not found in local storage.");
//   //     return;
//   //   }
//   //   setLoading(true);
//   //   setError("");

//   //   const apiUrl = `api/sap/opu/odata/sap/ZSALES_ORDER_VIEW_SRV/SalesOrderSet?$filter=FROM_DATE eq '${formatForAPI(
//   //     fromDate
//   //   )}' and TO_DATE eq '${formatForAPI(
//   //     toDate
//   //   )}' and CUST_CODE_S eq '${custCode}'&$expand=DeliveryOrderSet/InvoiceSet`;

//   //   try {
//   //     const response = await axios.get(apiUrl, {
//   //       auth: { username: "dev01", password: "Kriti@12" },
//   //       headers: {
//   //         Accept: "application/json",
//   //         "Content-Type": "application/json",
//   //       },
//   //     });

//   //     const data = response.data.d.results || [];
//   //     let allOrders = [];
//   //     data.forEach((order) => {
//   //       if (order.DeliveryOrderSet?.results.length > 0) {
//   //         order.DeliveryOrderSet.results.forEach((del) => {
//   //           const invoiceNumbers =
//   //             del.InvoiceSet?.results
//   //               .map((inv) => inv.INVOICE_NO_I)
//   //               .join(", ") || "";
//   //           allOrders.push({
//   //             ...order,
//   //             DELIVERY_NO_S: del.DELIVERY_NO_D,
//   //             VEHICLENO: del.VEHICLENO,
//   //             DRIVERNAME: del.DRIVERNAME,
//   //             INVOICE_NUMBERS: invoiceNumbers,
//   //           });
//   //         });
//   //       } else {
//   //         allOrders.push({
//   //           ...order,
//   //           INVOICE_NUMBERS: "-",
//   //         });
//   //       }
//   //     });

//   //     const uniqueOrders = removeDuplicateOrders(allOrders);
//   //     const withoutInvoice = uniqueOrders.filter(
//   //       (order) =>
//   //         !order.INVOICE_NUMBERS ||
//   //         order.INVOICE_NUMBERS === "-" ||
//   //         order.INVOICE_NUMBERS.trim() === ""
//   //     );

//   //     setSalesOrders(withoutInvoice);
//   //   } catch (err) {
//   //     console.error("Error fetching sales orders:", err);
//   //     setError("Failed to fetch sales orders.");
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };





//   // SUMMARY PER CATEGORY

//   //this is fetching sales orders which have in farward and not activated yet
//   // const fetchSalesOrders = async () => {
//   //   if (!custCode) {
//   //     setError("Customer code not found in local storage.");
//   //     return;
//   //   }
//   //   setLoading(true);
//   //   setError("");

//   //   const today = new Date();
//   //   const todaySAP = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}`;

//   //   // Keep trying SAP filter, but don't rely on it 100%
//   //   const apiUrl = `api/sap/opu/odata/sap/ZSALES_ORDER_VIEW_SRV/SalesOrderSet?$filter=FROM_DATE ge '${formatForAPI(fromDate)}' and CUST_CODE_S eq '${custCode}' and TO_DATE ge '${todaySAP}'&$expand=DeliveryOrderSet/InvoiceSet`;

//   //   try {
//   //     const response = await axios.get(apiUrl, {
//   //       auth: { username: "dev01", password: "Kriti@12" },
//   //       headers: {
//   //         Accept: "application/json",
//   //         "Content-Type": "application/json",
//   //       },
//   //     });

//   //     const data = response.data.d.results || [];
//   //     let allOrders = [];

//   //     data.forEach((order) => {
//   //       if (order.DeliveryOrderSet?.results?.length > 0) {
//   //         order.DeliveryOrderSet.results.forEach((del) => {
//   //           const invoiceNumbers = del.InvoiceSet?.results?.map(inv => inv.INVOICE_NO_I).join(", ") || "";
//   //           allOrders.push({
//   //             ...order,
//   //             INVOICE_NUMBERS: invoiceNumbers,
//   //           });
//   //         });
//   //       } else {
//   //         allOrders.push({ ...order, INVOICE_NUMBERS: "-" });
//   //       }
//   //     });

//   //     const uniqueOrders = removeDuplicateOrders(allOrders);
//   //     const withoutInvoice = uniqueOrders.filter(
//   //       o => !o.INVOICE_NUMBERS || o.INVOICE_NUMBERS === "-" || o.INVOICE_NUMBERS.trim() === ""
//   //     );

//   //     // FINAL FRONTEND FILTER – THIS IS BULLETPROOF
//   //     const todayYYYYMMDD = parseInt(todaySAP);
//   //     const activeOrders = withoutInvoice.filter(order => {
//   //       const expiry = order.TO_DATE;
//   //       if (!expiry || expiry.length !== 8) return false;
//   //       const expiryNum = parseInt(expiry);
//   //       return expiryNum >= todayYYYYMMDD; // Only today or future
//   //     });

//   //     // Sort by expiry date (closest first)
//   //     const sortedOrders = activeOrders.sort((a, b) => {
//   //       const dateA = parseInt(a.TO_DATE || "0");
//   //       const dateB = parseInt(b.TO_DATE || "0");
//   //       return dateA - dateB || a.S_ORDER_NO.localeCompare(b.S_ORDER_NO);
//   //     });

//   //     setSalesOrders(sortedOrders);
//   //     console.log(`Filtered to ${sortedOrders.length} active contracts (TO_DATE >= today)`);

//   //   } catch (err) {
//   //     console.error("API Error:", err.response?.data || err.message);
//   //     setError("Failed to load data.");
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   const fetchSalesOrders = async () => {
//     if (!custCode) {
//       setError("Customer code not found in local storage.");
//       return;
//     }

//     setLoading(true);
//     setError("");

//     const today = new Date();
//     const todaySAP = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}`;

//     const apiUrl = `api/sap/opu/odata/sap/ZSALES_ORDER_VIEW_SRV/SalesOrderSet?$filter=FROM_DATE ge '${formatForAPI(fromDate)}' and CUST_CODE_S eq '${custCode}' and TO_DATE ge '${todaySAP}'&$expand=DeliveryOrderSet/InvoiceSet`;

//     try {
//       const response = await axios.get(apiUrl, {
//         auth: { username: "dev01", password: "Kriti@12" },
//         headers: {
//           Accept: "application/json",
//           "Content-Type": "application/json",
//         },
//       });

//       const data = response.data.d.results || [];
//       let allOrders = [];

//       // Combine Delivery & Invoice Information
//       data.forEach((order) => {
//         if (order.DeliveryOrderSet?.results?.length > 0) {
//           order.DeliveryOrderSet.results.forEach((del) => {
//             const invoiceNumbers = del.InvoiceSet?.results?.map(inv => inv.INVOICE_NO_I).join(", ") || "";
//             allOrders.push({
//               ...order,
//               INVOICE_NUMBERS: invoiceNumbers,
//             });
//           });
//         } else {
//           allOrders.push({ ...order, INVOICE_NUMBERS: "-" });
//         }
//       });

//       // Remove duplicate Orders
//       const uniqueOrders = removeDuplicateOrders(allOrders);

//       // Filter Orders with no invoice
//       const withoutInvoice = uniqueOrders.filter(
//         o => !o.INVOICE_NUMBERS || o.INVOICE_NUMBERS === "-" || o.INVOICE_NUMBERS.trim() === ""
//       );

//       // ===== FINAL FRONTEND FILTER =====
//       const todayYYYYMMDD = parseInt(todaySAP);

//       const activeOrders = withoutInvoice.filter(order => {
//         const expiry = order.TO_DATE;
//         const start = order.FROM_DATE;

//         if (!expiry || expiry.length !== 8) return false;
//         if (!start || start.length !== 8) return false;

//         const expiryNum = parseInt(expiry);
//         const startNum = parseInt(start);

//         return (
//           expiryNum >= todayYYYYMMDD &&   // Expiry must not be passed
//           startNum <= todayYYYYMMDD       // Start date must not be in future
//         );
//       });

//       // Sort by nearest expiry
//       const sortedOrders = activeOrders.sort((a, b) => {
//         const dateA = parseInt(a.TO_DATE || "0");
//         const dateB = parseInt(b.TO_DATE || "0");
//         return dateA - dateB || a.S_ORDER_NO.localeCompare(b.S_ORDER_NO);
//       });

//       setSalesOrders(sortedOrders);

//       console.log(
//         `🎯 Filtered ${sortedOrders.length} valid orders out of ${uniqueOrders.length} (FROM_DATE <= today AND TO_DATE >= today)`
//       );

//     } catch (err) {
//       console.error("API Error:", err.response?.data || err.message);
//       setError("Failed to load data.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (skuData.length > 0 && salesOrders.length > 0) {
//       const combined = salesOrders.map((order) => {
//         const sku = skuData.find((s) => s.Code === order.MATERIAL_S);
//         return {
//           MATERIAL_S: order.MATERIAL_S,
//           QUANTITIES_S: Number(order.QUANTITIES_S),
//           Primary_category: sku?.Primary_category || "Unknown",
//           Gross_Weight: Number(sku?.Net_Weight || 0),
//           Price: Number(order?.GROSS_VALUE_S || 0),
//         };
//       });

//       const categoryMap = {};
//       combined.forEach((item) => {
//         if (!categoryMap[item.Primary_category]) {
//           categoryMap[item.Primary_category] = {
//             totalVolume: 0,
//             totalPrice: 0,
//           };
//         }

//         categoryMap[item.Primary_category].totalVolume +=
//           item.QUANTITIES_S * item.Gross_Weight;
//         categoryMap[item.Primary_category].totalPrice +=
//           item.QUANTITIES_S * item.Price;
//       });

//       let result = Object.keys(categoryMap)
//         .filter((cat) => cat !== "Unknown")
//         .map((cat) => ({
//           category: cat,
//           totalVolume: (categoryMap[cat].totalVolume / 1000).toFixed(3),
//           totalPrice: categoryMap[cat].totalPrice.toFixed(2),
//         }));

//       const defaultCategories = ["SBO", "SFO", "GNO", "KGMO"];
//       defaultCategories.forEach((cat) => {
//         if (!result.some((item) => item.category === cat)) {
//           result.push({
//             category: cat,
//             totalVolume: "0.00",
//             totalPrice: "0.00",
//           });
//         }
//       });

//       result = result.sort(
//         (a, b) =>
//           ["SBO", "SFO", "GNO", "KGMO", "Bari"].indexOf(a.category) -
//           ["SBO", "SFO", "GNO", "KGMO", "Bari"].indexOf(b.category)
//       );

//       setSummary(result);
//     }
//   }, [skuData, salesOrders]);

//   // Fetch on mount
//   useEffect(() => {
//     fetchSkuData();
//     fetchSalesOrders();
//   }, []);

//   // Filter SKU by search term (optional, currently not bound)
//   useEffect(() => {
//     if (!searchTerm.trim()) {
//       return;
//     }
//     const lower = searchTerm.toLowerCase();
//     const filtered = skuData.filter(
//       (item) =>
//         item.Code?.toLowerCase().includes(lower) ||
//         item.Name?.toLowerCase().includes(lower) ||
//         item.Primary_category?.toLowerCase().includes(lower)
//     );
//     // if you want a global filtered list, you can store it
//   }, [searchTerm, skuData]);

//   // =========================
//   // HELPERS
//   // =========================

//   const getCategorySummaryVolume = (category) => {
//     const row = summary.find((s) => s.category === category);
//     return row ? Number(row.totalVolume) || 0 : 0;
//   };

//   const validateGlobalCapacity = () => {
//     if (capacity === "" || capacity === null || capacity === undefined) {
//       setAlertMessage({
//         title: "Capacity Required",
//         message: "Please enter vehicle capacity first.",
//         continueLabel: "OK",
//       });
//       setShowAlert(true);
//       return false;
//     }

//     const cap = Number(capacity);
//     if (isNaN(cap) || cap <= 0) {
//       setAlertMessage({
//         title: "Invalid Capacity",
//         message: "Capacity must be a positive number.",
//         continueLabel: "OK",
//       });
//       setShowAlert(true);
//       return false;
//     }

//     if (cap > 20) {
//       setAlertMessage({
//         title: "Capacity Restriction",
//         message: "Capacity cannot exceed 20 Tons. Enter capacity ≤ 20.",
//         continueLabel: "OK",
//       });
//       setShowAlert(true);
//       return false;
//     }

//     return true;
//   };

//   const handleCapacityChange = (e) => {
//     const value = e.target.value;
//     if (value === "") {
//       setCapacity("");
//       return;
//     }

//     if (!/^\d+(\.\d{0,2})?$/.test(value)) {
//       // only numeric with optional 2 decimal places
//       return;
//     }

//     const num = Number(value);
//     if (num < 0) return;
//     if (num > 20) {
//       setAlertMessage({
//         title: "Capacity Restriction",
//         message: "Entered capacity exceeds 20 Tons. Please enter capacity ≤ 20.",
//         continueLabel: "OK",
//       });
//       setShowAlert(true);
//       return;
//     }

//     setCapacity(value);
//   };


//   // const handleCategoryCapacityChange = (category, value) => {



//   //   if (!validateGlobalCapacity()) return;

//   //   if (value === "") {
//   //     setCategoryCapacity((prev) => ({ ...prev, [category]: "" }));
//   //     return;
//   //   }

//   //   if (!/^\d+(\.\d{0,2})?$/.test(value)) {
//   //     // only numeric, 2 decimals
//   //     return;
//   //   }

//   //   const num = Number(value);
//   //   if (num <= 0) {
//   //     setAlertMessage({
//   //       title: "Invalid Capacity",
//   //       message: "Category capacity must be greater than 0.",
//   //       continueLabel: "OK",
//   //     });
//   //     setShowAlert(true);
//   //     return;
//   //   }

//   //   const globalCap = Number(capacity);
//   //   if (num > globalCap) {
//   //     setAlertMessage({
//   //       title: "Capacity Restriction",
//   //       message: `Category capacity cannot exceed global capacity (${globalCap} Tons).`,
//   //       continueLabel: "OK",
//   //     });
//   //     setShowAlert(true);
//   //     return;
//   //   }

//   //   const maxCategoryVolume = getCategorySummaryVolume(category);
//   //   if (num > maxCategoryVolume) {
//   //     setAlertMessage({
//   //       title: "Category Limit",
//   //       message: `Category capacity cannot exceed available volume (${maxCategoryVolume.toFixed(
//   //         2
//   //       )} Tons).`,
//   //       continueLabel: "OK",
//   //     });
//   //     setShowAlert(true);
//   //     return;
//   //   }


//   //   setCategoryCapacity((prev) => ({
//   //     ...prev,
//   //     [category]: value,
//   //   }));
//   // };


//   const handleCategoryCapacityChange = (category, value) => {
//     if (!validateGlobalCapacity()) return;
//     // Allow clearing the field
//     if (value === "") {
//       setCategoryCapacity(prev => ({ ...prev, [category]: "" }));
//       return;
//     }
//     // Validate number format
//     if (!/^\d+(\.\d{0,2})?$/.test(value)) return;
//     const num = Number(value);
//     if (num <= 0) {

//       setAlertMessage({
//         title: "Invalid Input",
//         message: `Capacity must be greater than 0.`,
//         continueLabel: "OK",
//       });
//       setShowAlert(true);
//       return;
//     }
//     const globalCap = Number(capacity);

//     // Calculate sum of OTHER categories
//     const otherSum = Object.keys(categoryCapacity)
//       .filter(key => key !== category)
//       .reduce((sum, key) => sum + (Number(categoryCapacity[key]) || 0), 0);


//     const newTotal = otherSum + num;

//     // BLOCK + SHOW ALERT (SAFE: outside setState!)
//     if (newTotal > globalCap) {
//       const remaining = globalCap - otherSum;

//       setAlertMessage({
//         title: "Capacity Exceeded",
//         message: `Total category capacity cannot exceed global limit of ${globalCap} Tons.\n\n` +
//           `• Already allocated: ${otherSum.toFixed(2)}T\n` +
//           `• Remaining allowed: ${remaining.toFixed(2)}T\n` +
//           `• You tried: ${num.toFixed(2)}T`,
//         continueLabel: "OK",
//       });
//       setShowAlert(true);

//       return; // ← Block update
//     }

//     // Optional: per-category volume check
//     const maxCategoryVolume = getCategorySummaryVolume(category);
//     if (num > maxCategoryVolume) {

//       setAlertMessage({
//         title: "Not Enough Volume",
//         message: `This category only has ${maxCategoryVolume.toFixed(2)}T available.\nYou entered ${num.toFixed(2)}T`,
//         continueLabel: "OK",
//       });
//       setShowAlert(true);
//       return;
//     }

//     // ALL GOOD → Safe update
//     setCategoryCapacity(prev => ({
//       ...prev,
//       [category]: value,
//     }));
//   };
//   const getCartForCategory = (category) => cartByCategory[category] || [];

//   const getCartTotals = (category) => {
//     const cart = getCartForCategory(category);
//     const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
//     const totalVolumeKG = cart.reduce(
//       (sum, item) => sum + (item.totalVolume || 0),
//       0
//     );
//     const totalTons = totalVolumeKG / 1000;
//     return {
//       totalItems,
//       totalVolumeKG,
//       totalTons,
//       uniqueSkus: cart.length,
//     };
//   };
//   // Auto-build SO data for a given category based on categoryCapacity[category]
//   // Uses FIFO: earliest TO_DATE + S_ORDER_NO
//   // const buildCategorySOData = (category) => {
//   //   const capTon = Number(categoryCapacity[category] || 0);
//   //   if (!capTon || capTon <= 0) return null;

//   //   const targetKg = capTon * 1000; // convert to KG
//   //   let remainingKg = targetKg;

//   //   // 1) Build enriched lines for this category from salesOrders + skuData
//   //   const enriched = salesOrders
//   //     .map((order) => {
//   //       const sku = skuData.find((s) => s.Code === order.MATERIAL_S);
//   //       if (!sku) return null;
//   //       if (sku.Primary_category !== category) return null;

//   //       const materialWeight = Number(sku.Net_Weight || 0); // KG per unit
//   //       const qty = Number(order.QUANTITIES_S || 0);
//   //       if (!materialWeight || !qty) return null;

//   //       const totalVolumeInKG = materialWeight * qty;
//   //       const totalWeightInTon = totalVolumeInKG / 1000;

//   //       return {
//   //         ...order,
//   //         category,
//   //         materialWeight,
//   //         totalVolumeInKG,
//   //         totalWeightInTon,
//   //       };
//   //     })
//   //     .filter(Boolean);

//   //   if (enriched.length === 0) return null;

//   //   // 2) Sort by TO_DATE (SAP date) then S_ORDER_NO
//   //   const parseSAPDate = (sapDate) => {
//   //     if (!sapDate || sapDate.length !== 8) return new Date(0);
//   //     const year = Number(sapDate.substring(0, 4));
//   //     const month = Number(sapDate.substring(4, 6)) - 1;
//   //     const day = Number(sapDate.substring(6, 8));
//   //     return new Date(year, month, day);
//   //   };

//   //   const sorted = enriched.sort((a, b) => {
//   //     const dateA = parseSAPDate(a.TO_DATE);
//   //     const dateB = parseSAPDate(b.TO_DATE);
//   //     if (dateA.getTime() === dateB.getTime()) {
//   //       return Number(a.S_ORDER_NO) - Number(b.S_ORDER_NO);
//   //     }
//   //     return dateA - dateB;
//   //   });

//   //   // 3) FIFO pick orders until we fill capacity (partial last order allowed)
//   //   const selectedLines = [];

//   //   for (const line of sorted) {
//   //     if (remainingKg <= 0) break;
//   //     if (!line.totalVolumeInKG || line.totalVolumeInKG <= 0) continue;

//   //     if (line.totalVolumeInKG <= remainingKg + 1e-6) {
//   //       // take full line
//   //       selectedLines.push(line);
//   //       remainingKg -= line.totalVolumeInKG;
//   //     } else {
//   //       // take partial line to exactly fill remainingKg
//   //       const fraction = remainingKg / line.totalVolumeInKG;

//   //       const partialLine = {
//   //         ...line,
//   //         totalVolumeInKG: remainingKg,
//   //         totalWeightInTon: remainingKg / 1000,
//   //         QUANTITIES_S: line.QUANTITIES_S * fraction, // proportional quantity
//   //       };

//   //       selectedLines.push(partialLine);
//   //       remainingKg = 0;
//   //       break;
//   //     }
//   //   }

//   //   if (selectedLines.length === 0) return null;

//   //   // 4) Merge them by SO number like your old logic
//   //   const mergedOrders = MergeOrdersBySONumber(selectedLines);

//   //   const usedKg = targetKg - remainingKg;
//   //   const usedTon = usedKg / 1000;

//   //   return {
//   //     selectedLines,
//   //     mergedOrders,
//   //     totalVolumeInKG: usedKg,
//   //     totalVolumeInTon: usedTon,
//   //   };
//   // };

//   // Example helper - adjust if you already have a version
//   const buildCategorySOData = (category, categoryCapTon) => {
//     // filter relevant SOs for this category
//     const catOrders = salesOrders
//       .map((order) => {
//         const sku = skuData.find((s) => s.Code === order.MATERIAL_S);
//         if (!sku || sku.Primary_category !== category) return null;

//         const materialWeight = Number(sku.Net_Weight || 0);
//         const qty = Number(order.QUANTITIES_S || 0);
//         if (!materialWeight || !qty) return null;

//         const totalKG = materialWeight * qty;
//         const totalMT = totalKG / 1000;

//         return {
//           ...order,
//           category,
//           materialWeight,
//           totalVolumeInKG: totalKG,
//           totalWeightInTon: totalMT,
//         };
//       })
//       .filter(Boolean)
//       .sort((a, b) => {
//         const dA = Number(a.TO_DATE || 0);
//         const dB = Number(b.TO_DATE || 0);
//         if (dA === dB) return Number(a.S_ORDER_NO) - Number(b.S_ORDER_NO);
//         return dA - dB;
//       });

//     console.log("Filtered FIFO SO list for category", category, catOrders);

//     const merged = MergeOrdersBySONumber(catOrders);

//     return { mergedOrders: merged };
//   };




//   // =========================
//   // CART / SKU LOGIC (PER CATEGORY)
//   // =========================

//   const addToCart = (category, sku, quantity = 1) => {
//     if (!validateGlobalCapacity()) return;

//     // const catCap = Number(categoryCapacity[category] || 0);
//     // if (!catCap || catCap <= 0) {
//     //   setAlertMessage({
//     //     title: "Category Capacity Required",
//     //     message: `Please enter capacity for ${category} before adding SKUs.`,
//     //     continueLabel: "OK",
//     //   });
//     //   setShowAlert(true);
//     //   return;
//     // }

//     const skuTons = (sku.Net_Weight / 1000) * quantity;

//     setCartByCategory((prev) => {
//       const currentCart = prev[category] || [];
//       const currentTotals = getCartTotals(category);
//       const newCartTons = currentTotals.totalTons + skuTons;

//       const maxCategoryVolume = getCategorySummaryVolume(category);

//       // if (newCartTons > catCap) {
//       //   setAlertMessage({
//       //     title: "Capacity Restriction",
//       //     message: `You cannot exceed ${catCap.toFixed(
//       //       2
//       //     )} Tons for ${category} cart.\nTrying: ${newCartTons.toFixed(2)} Tons.`,
//       //     continueLabel: "OK",
//       //   });
//       //   setShowAlert(true);
//       //   return prev;
//       // }

//       if (newCartTons > maxCategoryVolume) {
//         setAlertMessage({
//           title: "Category Volume Restriction",
//           message: `You cannot exceed category available volume ${maxCategoryVolume.toFixed(
//             2
//           )} Tons.`,
//           continueLabel: "OK",
//         });
//         setShowAlert(true);
//         return prev;
//       }

//       const existingItem = currentCart.find((item) => item.sku === sku.Code);
//       const price = sku.Dewas_ready_price || 0;

//       let updatedCart;
//       if (existingItem) {
//         const addedVolume = sku.Net_Weight * quantity; // in KG

//         updatedCart = currentCart.map((item) =>
//           item.sku === sku.Code
//             ? {
//               ...item,
//               quantity: item.quantity + quantity,
//               total: price * (item.quantity + quantity),
//               totalVolume: item.totalVolume + addedVolume,
//               totalTons: item.totalTons + skuTons,
//               singleQTYWeight: sku.Net_Weight,
//               unit: sku.SAP_Unit,
//               // IMPORTANT for BreakSalesOrder:
//               materialBalance: item.totalVolume + addedVolume,
//               materialStatus: item.materialStatus || "",
//             }
//             : item
//         );
//       } else {
//         const totalVolume = sku.Net_Weight * quantity; // KG

//         updatedCart = [
//           ...currentCart,
//           {
//             //TODO:if indent logic is not correct then uncomment below
//             // sku: sku.Code,
//             // name: sku.Name,
//             // quantity,
//             // price,
//             // total: price * quantity,
//             // unit: sku.SAP_Unit,
//             // Primary_category: category,
//             // totalVolume,                  // KG
//             // totalTons: totalVolume / 1000,
//             // singleQTYWeight: sku.Net_Weight,
//             // // IMPORTANT for BreakSalesOrder:
//             // materialBalance: totalVolume, // start = totalVolume
//             // materialStatus: "",           // will be set to "X" by BreakSalesOrder


//             sku: sku.Code,
//             name: sku.Name,
//             quantity,
//             price,
//             total: price * quantity,
//             unit: sku.SAP_Unit,
//             Primary_category: category,

//             netWeightPerUnit: sku.Net_Weight,        // store original Net weight
//             totalVolume: sku.Net_Weight * quantity,  // KG
//             totalTons: (sku.Net_Weight / 1000) * quantity,

//             singleQTYWeight: sku.Net_Weight,
//             materialBalance: sku.Net_Weight * quantity,
//             materialStatus: "",
//           },
//         ];
//       }

//       return {
//         ...prev,
//         [category]: updatedCart,
//       };
//     });
//   };


//   //This is working fine but when user pressing backspace quanity remain 1
//   // const updateCartQuantity = (category, skuCode, newQuantity) => {
//   //   if (!validateGlobalCapacity()) return;

//   //   setCartByCategory((prev) => {
//   //     const currentCart = prev[category] || [];
//   //     const item = currentCart.find((i) => i.sku === skuCode);
//   //     if (!item) return prev;

//   //     if (newQuantity < 1) newQuantity = 1;

//   //     const volumePerUnit = item.totalVolume / item.quantity;
//   //     const tonsPerUnit = item.totalTons / item.quantity;

//   //     const totalsBefore = getCartTotals(category);
//   //     const currentCartTons = totalsBefore.totalTons;

//   //     const updatedCartTons =
//   //       currentCartTons - item.totalTons + tonsPerUnit * newQuantity;

//   //     const catCap = Number(categoryCapacity[category] || 0);
//   //     const maxCategoryVolume = getCategorySummaryVolume(category);

//   //     if (updatedCartTons > catCap) {
//   //       setAlertMessage({
//   //         title: "Capacity Restriction",
//   //         message: `You cannot exceed ${catCap.toFixed(
//   //           2
//   //         )} Tons for ${category}.`,
//   //         continueLabel: "OK",
//   //       });
//   //       setShowAlert(true);
//   //       return prev;
//   //     }

//   //     if (updatedCartTons > maxCategoryVolume) {
//   //       setAlertMessage({
//   //         title: "Category Volume Restriction",
//   //         message: `You cannot exceed category available volume ${maxCategoryVolume.toFixed(
//   //           2
//   //         )} Tons.`,
//   //         continueLabel: "OK",
//   //       });
//   //       setShowAlert(true);
//   //       return prev;
//   //     }

//   //     const newTotalVolume = volumePerUnit * newQuantity;
//   //     const newTotalTons = tonsPerUnit * newQuantity;

//   //     const updatedCart = currentCart.map((i) =>
//   //       i.sku === skuCode
//   //         ? {
//   //           ...i,
//   //           quantity: newQuantity,
//   //           total: i.price * newQuantity,
//   //           totalVolume: newTotalVolume,
//   //           totalTons: newTotalTons,
//   //           materialBalance: newTotalVolume, // sync balance with totalVolume
//   //         }
//   //         : i
//   //     );

//   //     return {
//   //       ...prev,
//   //       [category]: updatedCart,
//   //     };
//   //   });
//   // };


//   const updateCartQuantity = (category, skuCode, newQuantity) => {
//     if (!validateGlobalCapacity()) return;

//     setCartByCategory((prev) => {
//       const currentCart = prev[category] || [];
//       const item = currentCart.find((i) => i.sku === skuCode);
//       if (!item) return prev;

//       if (newQuantity === "" || Number.isNaN(newQuantity)) {
//         // blank allowed so user can type new qty
//         newQuantity = 0;
//       }

//       // If want to block zero:
//       if (newQuantity < 0) newQuantity = 0;

//       const volumePerUnit = item.netWeightPerUnit;
//       const tonsPerUnit = item.netWeightPerUnit / 1000;

//       // recalculate new totals
//       const newTotalVolume = volumePerUnit * newQuantity;
//       const newTotalTons = tonsPerUnit * newQuantity;

//       // check capacity restrictions
//       const totalsBefore = getCartTotals(category);
//       const currentCartTons = totalsBefore.totalTons;
//       const updatedCartTons = currentCartTons - item.totalTons + newTotalTons;

//       // const catCap = Number(categoryCapacity[category] || 0);
//       const maxCategoryVolume = getCategorySummaryVolume(category);

//       // if (updatedCartTons > catCap) {
//       //   setAlertMessage({
//       //     title: "Capacity Restriction",
//       //     message: `You cannot exceed ${catCap.toFixed(2)} Tons for ${category}.`,
//       //     continueLabel: "OK",
//       //   });
//       //   setShowAlert(true);
//       //   return prev;
//       // }

//       if (updatedCartTons > maxCategoryVolume) {
//         setAlertMessage({
//           title: "Category Volume Restriction",
//           message: `Category volume cannot exceed ${maxCategoryVolume.toFixed(
//             2
//           )} Tons.`,
//           continueLabel: "OK",
//         });
//         setShowAlert(true);
//         return prev;
//       }

//       const updatedCart = currentCart.map((i) =>
//         i.sku === skuCode
//           ? {
//             ...i,
//             quantity: newQuantity,
//             total: i.price * newQuantity,
//             totalVolume: newTotalVolume,
//             totalTons: newTotalTons,
//             materialBalance: newTotalVolume,
//           }
//           : i
//       );

//       return {
//         ...prev,
//         [category]: updatedCart,
//       };
//     });
//   };


//   const handleCheckboxSku = (category, skuCode) => {
//     if (!validateGlobalCapacity()) return;

//     const catCart = getCartForCategory(category);
//     const isSelected = catCart.some((item) => item.sku === skuCode);

//     const categorySkuList = skuData.filter(
//       (item) => item.Primary_category === category
//     );
//     const selectedSKU = categorySkuList.find((item) => item.Code === skuCode);
//     if (!selectedSKU) return;

//     if (isSelected) {
//       // remove
//       setCartByCategory((prev) => ({
//         ...prev,
//         [category]: prev[category].filter((item) => item.sku !== skuCode),
//       }));
//     } else {
//       // add
//       addToCart(category, selectedSKU, 1);
//     }
//   };

//   const removeFromCart = (category, skuCode) => {
//     setCartByCategory((prev) => ({
//       ...prev,
//       [category]: (prev[category] || []).filter((item) => item.sku !== skuCode),
//     }));
//   };

//   const clearCart = (category) => {
//     setCartByCategory((prev) => ({
//       ...prev,
//       [category]: [],
//     }));
//   };

//   // =========================
//   // SUBMIT ORDER
//   // =========================

//   // const submitOrder = async () => {
//   //   if (!validateGlobalCapacity()) return;

//   //   const categories = ["SBO", "SFO", "GNO", "KGMO"];

//   //   // Extract categories where user added material
//   //   const activeCategories = categories.filter(
//   //     (cat) => (cartByCategory[cat] || []).length > 0
//   //   );

//   //   if (activeCategories.length === 0) {
//   //     setAlertMessage({
//   //       title: "❌ No Items",
//   //       message: "No items added in any category.",
//   //       continueLabel: "OK",
//   //     });
//   //     setShowAlert(true);
//   //     return;
//   //   }

//   //   try {
//   //     setLoading(true);

//   //     const previewResults = [];

//   //     for (const cat of activeCategories) {
//   //       const catCart = cartByCategory[cat] || [];
//   //       const catCap = Number(categoryCapacity[cat] || 0); // tonnes selected by user

//   //       if (!catCap || catCap <= 0) {
//   //         setAlertMessage({
//   //           title: "Category capacity required",
//   //           message: `Enter capacity for ${cat} before submitting.`,
//   //           continueLabel: "OK",
//   //         });
//   //         setShowAlert(true);
//   //         setLoading(false);
//   //         return;
//   //       }

//   //       // Get SOs required for the category
//   //       const soDataInfo = buildCategorySOData(cat);
//   //       if (!soDataInfo?.mergedOrders?.length) continue;

//   //       const soDataForBreak = soDataInfo.mergedOrders;

//   //       // Copy material data for isolated processing
//   //       const materialDataForBreak = catCart.map((m) => ({ ...m }));

//   //       console.log(`🔷 Category ${cat} SO for preview:`, soDataForBreak);
//   //       console.log(`📦 Material data for ${cat}`, materialDataForBreak);

//   //       // Call BreakSalesOrder with previewMode=true (no API call)
//   //       const previewResp = await BreakSalesOrder(
//   //         soDataForBreak,
//   //         materialDataForBreak,
//   //         true // preview mode to prevent API call
//   //       );

//   //       previewResults.push({
//   //         category: cat,
//   //         preview: previewResp.processedOrders,
//   //       });
//   //     }

//   //     console.log("🟪 Master Preview", previewResults);

//   //     // store preview so we can show to user in popup table
//   //     setPreviewData(previewResults);
//   //     setShowPreviewModal(true);  // open popup UI

//   //   } catch (err) {
//   //     console.error("Preview Error:", err);
//   //     setAlertMessage({
//   //       title: "❌ Error",
//   //       message: "Failed creating preview. Try again.",
//   //       continueLabel: "OK",
//   //     });
//   //     setShowAlert(true);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   const submitOrder = async () => {


//     const categories = ["SBO", "SFO", "GNO", "KGMO", "Bari"];

//     // categories which actually have items in cart
//     const activeCategories = categories.filter(
//       (cat) => (cartByCategory[cat] || []).length > 0
//     );

//     if (activeCategories.length === 0) {
//       setAlertMessage({
//         title: "❌ No Items",
//         message:
//           "No items in any category cart. Please add items before submitting.",
//         continueLabel: "OK",
//       });
//       setShowAlert(true);
//       return;
//     }

//     try {
//       setLoading(true);

//       const previewResults = [];

//       for (const cat of activeCategories) {
//         const catCart = cartByCategory[cat] || [];
//         const catCap = Number(categoryCapacity[cat] || 0);

//         if (!catCap || catCap <= 0) {
//           setAlertMessage({
//             title: "Category Capacity Required",
//             message: `Please enter capacity for ${cat} before submitting.`,
//             continueLabel: "OK",
//           });
//           setShowAlert(true);
//           setLoading(false);
//           return;
//         }

//         // SOs for this category (FIFO, merged)
//         const soInfo = buildCategorySOData(cat, catCap);
//         if (!soInfo.mergedOrders || soInfo.mergedOrders.length === 0) {
//           console.warn(`No Sales Orders available for category ${cat}`);
//           continue;
//         }

//         const soDataForBreak = soInfo.mergedOrders;
//         const materialDataForBreak = catCart.map((m) => ({ ...m }));

//         // 👀 PREVIEW ONLY – DO NOT CALL BACKEND
//         const breakPreview = await BreakSalesOrder(
//           soDataForBreak,
//           materialDataForBreak,
//           { preview: true, categoryCapacityTon: catCap }
//         );


//         previewResults.push({
//           category: cat,
//           processedOrders: breakPreview.processedOrders || [],
//         });
//       }

//       setPreviewData(previewResults);
//       setShowConfirmModal(true); // open confirmation dialog
//     } catch (error) {
//       console.error("🚨 Error during preview submitOrder:", error);
//       setAlertMessage({
//         title: "❌ Error",
//         message:
//           error?.response?.data?.message ||
//           "Something went wrong while preparing order preview.",
//         continueLabel: "OK",
//       });
//       setShowAlert(true);
//     } finally {
//       setLoading(false);
//     }
//   };



//   // const confirmSubmitOrder = async () => {
//   //   try {
//   //     setLoading(true);

//   //     const results = [];

//   //     for (const item of previewData) {
//   //       const { category } = item;

//   //       const soDataInfo = buildCategorySOData(category);
//   //       const soDataForBreak = soDataInfo?.mergedOrders || [];

//   //       const materialDataForBreak = (cartByCategory[category] || []).map((m) => ({
//   //         ...m,
//   //       }));

//   //       console.log(`🚚 Final Submit for ${category}`);

//   //       // FINAL submit -> poster to API
//   //       const finalResp = await BreakSalesOrder(
//   //         soDataForBreak,
//   //         materialDataForBreak,
//   //         false   // real submit
//   //       );

//   //       results.push({ category, finalResp });
//   //     }

//   //     console.log("🟣 Final Submitted Results:", results);

//   //     setAlertMessage({
//   //       title: "✅ Success",
//   //       message: "Orders submitted successfully!",
//   //       continueLabel: "OK",
//   //     });

//   //     setShowAlert(true);

//   //     // clear UI
//   //     setCartByCategory({
//   //       SBO: [],
//   //       SFO: [],
//   //       GNO: [],
//   //       KGMO: [],
//   //     });

//   //     setPreviewData([]);
//   //     setShowPreviewModal(false);

//   //   } catch (error) {
//   //     console.error("Submit Error:", error);

//   //     setAlertMessage({
//   //       title: "❌ Submit Failed",
//   //       message: "Something went wrong while submitting order.",
//   //       continueLabel: "OK",
//   //     });

//   //     setShowAlert(true);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };




//   // =========================
//   // RENDER
//   // =========================

//   const confirmSubmitOrder = async () => {
//     try {
//       setShowConfirmModal(false);
//       setLoading(true);

//       const allResults = [];

//       for (const catBlock of previewData) {
//         const { category: cat } = catBlock;

//         const catCart = cartByCategory[cat] || [];
//         const catCap = Number(categoryCapacity[cat] || 0);

//         if (!catCap || catCap <= 0 || catCart.length === 0) continue;

//         const soInfo = buildCategorySOData(cat, catCap);
//         if (!soInfo.mergedOrders || soInfo.mergedOrders.length === 0) continue;

//         const soDataForBreak = soInfo.mergedOrders;
//         const materialDataForBreak = catCart.map((m) => ({ ...m }));

//         // 🔥 REAL RUN – this time preview=false → API call will happen
//         const result = await BreakSalesOrder(
//           soDataForBreak,
//           materialDataForBreak,
//           { preview: false, categoryCapacityTon: catCap }
//         );

//         allResults.push({ category: cat, ...result });
//       }

//       console.log("🟧 All BreakSalesOrder Results:", allResults);

//       setAlertMessage({
//         title: "✅ Success",
//         message:
//           "Sales Orders processed successfully for all categories. Check SAP / logs for detailed breakdown.",
//         continueLabel: "OK",
//       });
//       setShowAlert(true);

//       // clear carts after success
//       setCartByCategory({
//         SBO: [],
//         SFO: [],
//         GNO: [],
//         KGMO: [],
//         Bari: []
//       });
//     } catch (error) {
//       console.error("🚨 Error in confirmSubmitOrder:", error);
//       setAlertMessage({
//         title: "❌ Error",
//         message:
//           error?.response?.data?.message ||
//           "Something went wrong while processing orders.",
//         continueLabel: "OK",
//       });
//       setShowAlert(true);
//     } finally {
//       setLoading(false);
//     }
//   };


//   return (
//     <>
//       {!loading ? (
//         <div className="p-6 space-y-6">
//           {error && <p className="text-red-500">{error}</p>}

//           {/* HEADER + VEHICLE CAPACITY */}
//           <div className="p-6 space-y-6">
//             <div className="flex justify-between items-start">
//               <div>
//                 <h1 className="text-3xl font-bold flex items-center">
//                   <ClipboardList className="w-8 h-8 mr-3" />
//                   My Sauda
//                 </h1>
//                 <p className="text-muted-foreground">
//                   Break your sales Order in available SKUs (Category-wise)
//                 </p>
//               </div>
//               <div>
//                 <h1 className="text-xl font-bold flex items-center">
//                   <Truck className="w-8 h-8 mr-3" />
//                   Vehicle Capacity (in Tons)
//                 </h1>
//                 <Input
//                   type="text"
//                   inputMode="decimal"
//                   pattern="[0-9]*"
//                   placeholder="Enter Vehicle Capacity"
//                   className="w-full text-center text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
//                   value={capacity}
//                   onChange={handleCapacityChange}
//                   onKeyDown={(e) => {
//                     const allowedKeys = [
//                       "Backspace",
//                       "Delete",
//                       "ArrowLeft",
//                       "ArrowRight",
//                       "Tab",
//                       ".",
//                     ];
//                     if (!/^[0-9]$/.test(e.key) && !allowedKeys.includes(e.key)) {
//                       e.preventDefault();
//                     }
//                   }}
//                   onWheel={(e) => e.target.blur()}
//                 />
//               </div>
//             </div>
//           </div>

//           {/* SUMMARY TABLE WITH CATEGORY CAPACITY INPUTS */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Active Pending Contracts</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Category</TableHead>
//                     <TableHead>Total Volume (MT)</TableHead>
//                     <TableHead>Required Total Quantity (MT)</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {summary
//                     .filter((item) => item.category && item.category !== "Unknown")
//                     .map((item) => {
//                       const cat = item.category;
//                       const hasVolume = Number(item.totalVolume) > 0;
//                       return (
//                         <TableRow key={cat}>
//                           <TableCell>{cat}</TableCell>
//                           <TableCell>{item.totalVolume} MT</TableCell>
//                           <TableCell>
//                             {hasVolume ? (
//                               <Input
//                                 className="w-32 border-black text-center text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
//                                 type="text"
//                                 inputMode="decimal"
//                                 value={categoryCapacity[cat] || ""}
//                                 placeholder="Quantity in MT"
//                                 onChange={(e) =>
//                                   handleCategoryCapacityChange(cat, e.target.value)
//                                 }
//                                 onKeyDown={(e) => {
//                                   const allowedKeys = [
//                                     "Backspace",
//                                     "Delete",
//                                     "ArrowLeft",
//                                     "ArrowRight",
//                                     "Tab",
//                                     ".",
//                                   ];
//                                   if (
//                                     !/^[0-9]$/.test(e.key) &&
//                                     !allowedKeys.includes(e.key)
//                                   ) {
//                                     e.preventDefault();
//                                   }
//                                 }}
//                               />
//                             ) : (
//                               <span className="text-gray-400 text-xs">
//                                 No pending volume
//                               </span>
//                             )}
//                           </TableCell>
//                         </TableRow>
//                       );
//                     })}
//                 </TableBody>
//               </Table>
//             </CardContent>
//           </Card>

//           {/* ACCORDION PER CATEGORY (ONLY WHERE totalVolume > 0) */}
//           <div className="space-y-4">
//             {summary
//               .filter(
//                 (item) =>
//                   item.category &&
//                   item.category !== "Unknown" &&
//                   Number(item.totalVolume) > 0
//               )
//               .map((item) => {
//                 const cat = item.category;
//                 const catCap = Number(categoryCapacity[cat] || 0);
//                 const cart = getCartForCategory(cat);
//                 const totals = getCartTotals(cat);

//                 // SKUs for this category
//                 const categorySkus = skuData.filter(
//                   (s) => s.Primary_category === cat
//                 );

//                 const isOpen = openCategory === cat;

//                 return (
//                   <div
//                     key={cat}
//                     className="border rounded-lg shadow-sm bg-white"
//                   >
//                     {/* Accordion Header */}
//                     <button
//                       type="button"
//                       onClick={() =>
//                         setOpenCategory((prev) => (prev === cat ? null : cat))
//                       }
//                       className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-t-lg"
//                     >
//                       <div className="flex items-center gap-3">
//                         <span className="font-semibold text-gray-800">
//                           {getCategoryName(cat)} Contracts
//                         </span>

//                         <span className="text-xs text-gray-500">
//                           Total Volume: {item.totalVolume} MT
//                         </span>

//                         {catCap > 0 && (
//                           <span className="text-xs text-blue-600 font-medium">
//                             Category Capacity: {catCap.toFixed(2)} MT
//                           </span>
//                         )}
//                       </div>
//                       <span className="text-sm text-gray-600">
//                         {isOpen ? "Hide" : "Show"}
//                       </span>
//                     </button>

//                     {/* Accordion Content */}
//                     {isOpen && (
//                       <div className="p-4 border-t">
//                         {/* SKUs + Cart layout (same as earlier, but per category) */}
//                         <div className="flex flex-col lg:flex-row gap-6">
//                           {/* LEFT: SKUs */}
//                           <Card className="w-full lg:w-1/2">
//                             <CardHeader>
//                               <div className="flex items-center justify-between">
//                                 <div>
//                                   <CardTitle className="flex items-center">
//                                     <Package className="w-5 h-5 mr-2" />
//                                     {cat} SKUs
//                                   </CardTitle>
//                                   <CardDescription>
//                                     Browse and add products for {cat}
//                                   </CardDescription>
//                                 </div>
//                               </div>
//                             </CardHeader>
//                             <CardContent>
//                               <div className="border rounded-lg p-2 max-h-64 overflow-y-auto w-full">
//                                 {categorySkus.length === 0 && (
//                                   <div className="text-sm text-gray-500 text-center py-4">
//                                     No SKU found for {cat}
//                                   </div>
//                                 )}
//                                 {categorySkus.map((sku) => {
//                                   const isSelected = cart.some(
//                                     (item) => item.sku === sku.Code
//                                   );
//                                   return (
//                                     <div
//                                       key={sku.Code}
//                                       className="flex items-center px-2 py-1 cursor-pointer hover:bg-gray-100 rounded"
//                                       onClick={() =>
//                                         handleCheckboxSku(cat, sku.Code)
//                                       }
//                                     >
//                                       <input
//                                         type="checkbox"
//                                         checked={isSelected}
//                                         readOnly
//                                         className="mr-2"
//                                       />
//                                       <span>
//                                         {sku.Code} - {sku.Name}
//                                       </span>
//                                     </div>
//                                   );
//                                 })}
//                               </div>
//                             </CardContent>
//                           </Card>

//                           {/* RIGHT: Cart (Desktop) */}
//                           {cart.length > 0 && (
//                             <div className="hidden lg:block w-full lg:w-1/2">
//                               <Card>
//                                 <CardHeader className="flex flex-col space-y-2">
//                                   <div className="flex justify-between items-center w-full">
//                                     {/* <CardTitle>{cat} Order Preview</CardTitle> */}
//                                     <CardTitle> Enter Quantity Required</CardTitle>
//                                     <div className="flex items-center space-x-4 ml-auto">
//                                       <Button
//                                         variant="outline"
//                                         size="sm"
//                                         onClick={() => clearCart(cat)}
//                                       >
//                                         Clear Cart
//                                       </Button>
//                                     </div>
//                                   </div>
//                                   <CardDescription>
//                                     Review your {cat} order before submission
//                                   </CardDescription>
//                                 </CardHeader>
//                                 <CardContent className="space-y-4">
//                                   <div className="space-y-2 max-h-60 overflow-y-auto">
//                                     <div className="border rounded-lg overflow-x-auto">
//                                       <Table size="2">
//                                         <TableHeader>
//                                           <TableRow>
//                                             <TableHead>SKU Code</TableHead>
//                                             <TableHead>Product Name</TableHead>
//                                             <TableHead>Unit</TableHead>
//                                             <TableHead>Quantity</TableHead>
//                                           </TableRow>
//                                         </TableHeader>
//                                         <TableBody>
//                                           {cart.map((item) => (
//                                             <TableRow key={item.sku}>
//                                               <TableCell>{item.sku}</TableCell>
//                                               <TableCell>{item.name}</TableCell>
//                                               <TableCell>{item.unit}</TableCell>
//                                               <TableCell className="w-44 text-center">
//                                                 <div className="flex items-center justify-center gap-2">
//                                                   <Button
//                                                     variant="outline"
//                                                     size="sm"
//                                                     onClick={() =>
//                                                       updateCartQuantity(
//                                                         cat,
//                                                         item.sku,
//                                                         item.quantity - 1
//                                                       )
//                                                     }
//                                                   >
//                                                     <Minus className="w-3 h-3" />
//                                                   </Button>
//                                                   <Input
//                                                     type="text"
//                                                     inputMode="numeric"
//                                                     pattern="[0-9]*"
//                                                     value={item.quantity === 0 ? "" : item.quantity}
//                                                     className="w-20 text-center text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
//                                                     onChange={(e) =>
//                                                       updateCartQuantity(cat, item.sku, Number(e.target.value || "0"))
//                                                     }
//                                                     onKeyDown={(e) => {
//                                                       const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];
//                                                       if (!/^[0-9]$/.test(e.key) && !allowedKeys.includes(e.key)) {
//                                                         e.preventDefault();
//                                                       }
//                                                     }}
//                                                     onWheel={(e) => e.target.blur()}
//                                                   />

//                                                   <Button
//                                                     variant="outline"
//                                                     size="sm"
//                                                     onClick={() =>
//                                                       updateCartQuantity(
//                                                         cat,
//                                                         item.sku,
//                                                         item.quantity + 1
//                                                       )
//                                                     }
//                                                   >
//                                                     <Plus className="w-3 h-3" />
//                                                   </Button>
//                                                 </div>
//                                               </TableCell>
//                                               <TableCell>
//                                                 <Button
//                                                   variant="ghost"
//                                                   size="sm"
//                                                   onClick={() =>
//                                                     removeFromCart(cat, item.sku)
//                                                   }
//                                                 >
//                                                   <Trash2 className="w-3 h-3" />
//                                                 </Button>
//                                               </TableCell>
//                                             </TableRow>
//                                           ))}
//                                         </TableBody>
//                                       </Table>
//                                     </div>
//                                   </div>
//                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                     <div>
//                                       <div className="space-y-2 text-sm">
//                                         <div className="flex justify-between mt-2">
//                                           <span>Total Items:</span>
//                                           <span className="font-medium">
//                                             {totals.totalItems}
//                                           </span>
//                                         </div>
//                                         <div className="flex justify-between mt-2">
//                                           <span>Unique SKUs:</span>
//                                           <span className="font-medium">
//                                             {totals.uniqueSkus}
//                                           </span>
//                                         </div>
//                                         <Separator />
//                                         <div className="flex justify-between">
//                                           <span className="font-medium">
//                                             Total Volume:
//                                           </span>
//                                           <span className="font-bold">
//                                             {totals.totalTons.toFixed(2)} MT
//                                           </span>
//                                         </div>
//                                       </div>
//                                     </div>
//                                   </div>
//                                 </CardContent>
//                               </Card>
//                             </div>
//                           )}
//                         </div>

//                         {/* Mobile cart for this category */}
//                         {cart.length > 0 && (
//                           <div className="block lg:hidden mt-4">
//                             <Card>
//                               <CardHeader className="flex flex-col space-y-2">
//                                 <div className="flex justify-between items-center w-full">
//                                   <CardTitle>{cat} Order Preview</CardTitle>
//                                   <Button
//                                     variant="outline"
//                                     size="sm"
//                                     onClick={() => clearCart(cat)}
//                                   >
//                                     Clear Cart
//                                   </Button>
//                                 </div>
//                                 <CardDescription>
//                                   Review your {cat} order
//                                 </CardDescription>
//                               </CardHeader>
//                               <CardContent className="space-y-4">
//                                 <div className="space-y-2 max-h-60 overflow-y-auto">
//                                   <div className="border rounded-lg overflow-x-auto">
//                                     <Table size="2">
//                                       <TableHeader>
//                                         <TableRow>
//                                           <TableHead>SKU Code</TableHead>
//                                           <TableHead>Product Name</TableHead>
//                                           <TableHead>Unit</TableHead>
//                                           <TableHead>Quantity</TableHead>
//                                         </TableRow>
//                                       </TableHeader>
//                                       <TableBody>
//                                         {cart.map((item) => (
//                                           <TableRow key={item.sku}>
//                                             <TableCell>{item.sku}</TableCell>
//                                             <TableCell>{item.name}</TableCell>
//                                             <TableCell>{item.unit}</TableCell>
//                                             <TableCell className="w-44 text-center">
//                                               <div className="flex items-center justify-center gap-2">
//                                                 <Button
//                                                   variant="outline"
//                                                   size="sm"
//                                                   onClick={() =>
//                                                     updateCartQuantity(
//                                                       cat,
//                                                       item.sku,
//                                                       item.quantity - 1
//                                                     )
//                                                   }
//                                                 >
//                                                   <Minus className="w-3 h-3" />
//                                                 </Button>
//                                                 <Input
//                                                   type="text"
//                                                   inputMode="numeric"
//                                                   pattern="[0-9]*"
//                                                   value={item.quantity}
//                                                   className="w-20 text-center text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
//                                                   onChange={(e) =>
//                                                     updateCartQuantity(
//                                                       cat,
//                                                       item.sku,
//                                                       Number(e.target.value || "0")
//                                                     )
//                                                   }
//                                                   onKeyDown={(e) => {
//                                                     const allowedKeys = [
//                                                       "Backspace",
//                                                       "Delete",
//                                                       "ArrowLeft",
//                                                       "ArrowRight",
//                                                       "Tab",
//                                                     ];
//                                                     if (
//                                                       !/^[0-9]$/.test(e.key) &&
//                                                       !allowedKeys.includes(e.key)
//                                                     ) {
//                                                       e.preventDefault();
//                                                     }
//                                                   }}
//                                                   onWheel={(e) => e.target.blur()}
//                                                 />
//                                                 <Button
//                                                   variant="outline"
//                                                   size="sm"
//                                                   onClick={() =>
//                                                     updateCartQuantity(
//                                                       cat,
//                                                       item.sku,
//                                                       item.quantity + 1
//                                                     )
//                                                   }
//                                                 >
//                                                   <Plus className="w-3 h-3" />
//                                                 </Button>
//                                               </div>
//                                             </TableCell>
//                                             <TableCell>
//                                               <Button
//                                                 variant="ghost"
//                                                 size="sm"
//                                                 onClick={() =>
//                                                   removeFromCart(cat, item.sku)
//                                                 }
//                                               >
//                                                 <Trash2 className="w-3 h-3" />
//                                               </Button>
//                                             </TableCell>
//                                           </TableRow>
//                                         ))}
//                                       </TableBody>
//                                     </Table>
//                                   </div>
//                                 </div>
//                                 <div className="space-y-2 text-sm">
//                                   <div className="flex justify-between mt-2">
//                                     <span>Total Items:</span>
//                                     <span className="font-medium">
//                                       {totals.totalItems}
//                                     </span>
//                                   </div>
//                                   <div className="flex justify-between mt-2">
//                                     <span>Unique SKUs:</span>
//                                     <span className="font-medium">
//                                       {totals.uniqueSkus}
//                                     </span>
//                                   </div>
//                                   <Separator />
//                                   <div className="flex justify-between">
//                                     <span className="font-medium">
//                                       Total Volume:
//                                     </span>
//                                     <span className="font-bold">
//                                       {totals.totalTons.toFixed(2)} MT
//                                     </span>
//                                   </div>
//                                 </div>
//                               </CardContent>
//                             </Card>
//                           </div>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 );
//               })}
//           </div>

//           {/* VEHICLE DETAILS + SUBMIT (GLOBAL, AFTER ALL CATEGORIES) */}
//           {Object.values(cartByCategory).some(
//             (catCart) => catCart && catCart.length > 0
//           ) && (
//               <div className="p-6 space-y-6">
//                 <Card>
//                   <CardHeader>
//                     <CardTitle>Vehicle Details</CardTitle>
//                     <CardDescription>Review before submission</CardDescription>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       <div>
//                         <div className="space-y-2 text-sm items-center">
//                           <div className="flex justify-between">
//                             <span className="p-1">Vehicle Number:</span>
//                             <Input
//                               name="vehicleNumber"
//                               value={vehicleDetails.vehicleNumber}
//                               onChange={handleVehicleChange}
//                               className="border-b border-black text-gray-900 focus:ring-blue-500 focus:border-blue-500 block p-1"
//                               placeholder="Vehicle Number (e.g. MP09CX1234)"
//                             />
//                           </div>
//                           {error && (
//                             <span className="text-red-500 text-sm block mt-1 text-right">
//                               {error}
//                             </span>
//                           )}
//                           <div className="flex justify-between">
//                             <span className="p-1">Vehicle Placement date:</span>
//                             <input
//                               type="date"
//                               name="placementDate"
//                               value={vehicleDetails.placementDate}
//                               onChange={handleVehicleChange}
//                               required
//                               className="border-b border-black text-gray-900 focus:ring-blue-500 focus:border-blue-500 block p-1"
//                             />
//                           </div>
//                           <Separator />
//                         </div>
//                       </div>
//                     </div>
//                     <div className="flex lg:justify-end lg:gap-2 space-x-2">
//                       <Button
//                         variant="outline"
//                         onClick={() =>
//                           setCartByCategory({
//                             SBO: [],
//                             SFO: [],
//                             GNO: [],
//                             KGMO: [],
//                           })
//                         }
//                       >
//                         Clear All Orders
//                       </Button>
//                       <Button onClick={submitOrder} className="min-w-32">
//                         <CheckCircle className="w-4 h-4 mr-2" />
//                         Submit Order
//                       </Button>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>
//             )}
//         </div>
//       ) : (
//         <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-60 z-50">
//           <Spinner className="w-12 h-12 text-white animate-spin" />
//           <span className="text-white text-lg mt-4 font-semibold">
//             Order Processing...
//           </span>
//         </div>
//       )}

//       {/* <Dialog open={showPreviewModal} onOpenChange={setShowPreviewModal}>
//         <DialogContent className="max-w-3xl">
//           <DialogHeader>
//             <DialogTitle>Confirm Order Allocation</DialogTitle>
//             <DialogDescription>
//               Review allocated Sales Orders and SKUs before submission.
//             </DialogDescription>
//           </DialogHeader>

//           {previewData.map((catInfo) => (
//             <div key={catInfo.category} className="mb-5">
//               <h3 className="font-semibold text-blue-600 mb-2">
//                 {catInfo.category} Allocation
//               </h3>

//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>SO Number</TableHead>
//                     <TableHead>SKU</TableHead>
//                     <TableHead>Quantity</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {catInfo.preview.map((so) =>
//                     so.materialOfSO.map((m, index) => (
//                       <TableRow key={index}>
//                         <TableCell>{so.S_ORDER_NO}</TableCell>
//                         <TableCell>{m.sku}</TableCell>
//                         <TableCell>{m.quantity}</TableCell>
//                       </TableRow>
//                     ))
//                   )}
//                 </TableBody>
//               </Table>
//             </div>
//           ))}

//           <DialogFooter>
//             <Button variant="outline" onClick={() => setShowPreviewModal(false)}>
//               Edit
//             </Button>
//             <Button onClick={confirmSubmitOrder}>
//               Confirm & Submit
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog> */}

//       <AlertDialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
//         <AlertDialogContent className="max-w-2xl">
//           <AlertDialogHeader>
//             <AlertDialogTitle>Confirm Order Allocation</AlertDialogTitle>
//             <AlertDialogDescription>
//               Review allocated Sales Orders and SKUs before submission.
//             </AlertDialogDescription>
//           </AlertDialogHeader>

//           <div className="space-y-4 max-h-[400px] overflow-y-auto">
//             {previewData.map((block) => (
//               <div key={block.category}>
//                 <h3 className="font-semibold mb-2 text-blue-700">
//                   {block.category} Allocation
//                 </h3>
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>SO Number</TableHead>
//                       <TableHead>SKU</TableHead>
//                       <TableHead className="text-right">Quantity</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {block.processedOrders.flatMap((so) =>
//                       so.materialOfSO.map((m, idx) => (
//                         <TableRow key={`${so.S_ORDER_NO}_${m.sku}_${idx}`}>
//                           <TableCell>{so.S_ORDER_NO}</TableCell>
//                           <TableCell>{m.sku}</TableCell>
//                           <TableCell className="text-right">{m.quantity}</TableCell>
//                         </TableRow>
//                       ))
//                     )}
//                   </TableBody>
//                 </Table>
//               </div>
//             ))}
//           </div>

//           <AlertDialogFooter>
//             <AlertDialogCancel onClick={() => setShowConfirmModal(false)}>
//               Edit
//             </AlertDialogCancel>
//             <AlertDialogAction onClick={confirmSubmitOrder}>
//               Confirm &amp; Submit
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>




//       {/* ALERT DIALOG */}
//       <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>{alertMessage.title}</AlertDialogTitle>
//             <AlertDialogDescription>
//               {alertMessage.message}
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogAction onClick={() => setShowAlert(false)}>
//               {alertMessage.continueLabel || "OK"}
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </>
//   );
// }








// MyOrders.jsx

// import React, { useEffect, useState } from "react";
// import axios from "axios";

// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardDescription,
//   CardContent,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import {
//   Table,
//   TableHeader,
//   TableHead,
//   TableRow,
//   TableBody,
//   TableCell,
// } from "@/components/ui/table";
// import { Separator } from "@/components/ui/separator";
// import {
//   AlertDialog,
//   AlertDialogContent,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogAction,
//   AlertDialogCancel,
// } from "@/components/ui/alert-dialog";

// import {
//   ClipboardList,
//   Truck,
//   Package,
//   Minus,
//   Plus,
//   Trash2,
//   CheckCircle,
// } from "lucide-react";

// import { Spinner } from "@/components/ui/spinner";
// // adjust these imports to your actual paths
// import { BreakSalesOrder } from "@/lib/BreakSalesOrder";
// import { MergeOrdersBySONumber } from "@/lib/MergeOrdersBySONumber";

// =========================
// HELPERS
// =========================



// =========================
// COMPONENT
// =========================


//This is fully working without
export function MyOrders() {
  const TOLERANCE_PERCENT = 2; // ✅ business rule
  const applyTolerance = (value) => value * (1 + TOLERANCE_PERCENT / 100);

  const formatForInput = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const today = new Date();
  const firstDayOfMonth = new Date();
  firstDayOfMonth.setDate(today.getDate() - 15);

  const [dealerCategory, setDealerCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [skuData, setSkuData] = useState([]);
  const [salesOrders, setSalesOrders] = useState([]);
  const [summary, setSummary] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [previewData, setPreviewData] = useState([]);

  // GLOBAL vehicle capacity (max 20)
  const [capacity, setCapacity] = useState("");

  // Per-category cart: { SBO: [...], SFO: [...], ... }
  const [cartByCategory, setCartByCategory] = useState({
    SBO: [],
    SFO: [],
    GNO: [],
    KGMO: [],
    Bari: []
  });

  // Accordion open state
  const [openCategory, setOpenCategory] = useState(null);

  const [fromDate, setFromDate] = useState(formatForInput(firstDayOfMonth));
  const [toDate, setToDate] = useState(formatForInput(today));

  const [alertMessage, setAlertMessage] = useState({
    title: "",
    message: "",
    continueLabel: "",
  });
  const [showAlert, setShowAlert] = useState(false);

  const [vehicleDetails, setVehicleDetails] = useState({
    vehicleNumber: "",
    placementDate: "",
  });

  const vehicleRegex = /^[A-Z]{2}\s?\d{2}\s?[A-Z]{1,2}\s?\d{4}$/i;

  const storedDealer = JSON.parse(localStorage.getItem("dealerData"));
  const custCode = storedDealer?.UserName || "";

  const formatForAPI = (dateStr) => {
    const [yyyy, mm, dd] = dateStr.split("-");
    return `${dd}.${mm}.${yyyy}`;
  };

  const stringSAPDate = (sapDate) => {
    if (!sapDate || sapDate.length !== 8) return "";
    const year = sapDate.substring(0, 4);
    const month = sapDate.substring(4, 6);
    const day = sapDate.substring(6, 8);
    return `${day}-${month}-${year}`;
  };

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
      [name]: value.toUpperCase(),
    }));

    if (name === "vehicleNumber") {
      if (value === "" || vehicleRegex.test(value)) {
        setError("");
      } else {
        setError("Invalid vehicle number format (e.g. MP09CX1234)");
      }
    }
  };

  // =========================
  // DATA FETCH
  // =========================

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

  // const fetchSalesOrders = async () => {
  //   if (!custCode) {
  //     setError("Customer code not found in local storage.");
  //     return;
  //   }
  //   setLoading(true);
  //   setError("");

  //   const apiUrl = `api/sap/opu/odata/sap/ZSALES_ORDER_VIEW_SRV/SalesOrderSet?$filter=FROM_DATE eq '${formatForAPI(fromDate)}' and TO_DATE eq '${formatForAPI(toDate)}' and CUST_CODE_S eq '${custCode}'&$expand=DeliveryOrderSet/InvoiceSet`;

  //   try {
  //     const response = await axios.get(apiUrl, {
  //       auth: { username: "dev01", password: "Kriti@12" },
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //       },
  //     });

  //     const data = response.data.d.results || [];

  //     // ✅ Flatten nested DeliveryOrderSet results
  //     let allOrders = [];
  //     data.forEach((order) => {
  //       if (order.DeliveryOrderSet?.results.length > 0) {
  //         order.DeliveryOrderSet.results.forEach((del) => {
  //           const invoiceNumbers =
  //             del.InvoiceSet?.results.map((inv) => inv.INVOICE_NO_I).join(", ") || "";
  //           allOrders.push({
  //             ...order,
  //             DELIVERY_NO_S: del.DELIVERY_NO_D,
  //             VEHICLENO: del.VEHICLENO,
  //             DRIVERNAME: del.DRIVERNAME,
  //             INVOICE_NUMBERS: invoiceNumbers,
  //           });
  //         });
  //       } else {
  //         allOrders.push({
  //           ...order,
  //           INVOICE_NUMBERS: "-",
  //         });
  //       }
  //     });

  //     // ✅ Remove duplicate orders
  //     const uniqueOrders = removeDuplicateOrders(allOrders);

  //     // ✅ 🔥 Filter only contracts which DON'T have invoice number
  //     const withoutInvoice = uniqueOrders.filter(
  //       (order) => !order.INVOICE_NUMBERS || order.INVOICE_NUMBERS === "-" || order.INVOICE_NUMBERS.trim() === ""
  //     );
  //     const parseSAPDate = (sapDate) => {
  //       if (!sapDate || sapDate.length !== 8) return new Date(0);
  //       const year = Number(sapDate.substring(0, 4));
  //       const month = Number(sapDate.substring(4, 6)) - 1;
  //       const day = Number(sapDate.substring(6, 8));
  //       return new Date(year, month, day);
  //     };
  //     const todayDate = new Date();
  //     const activeOrders = withoutInvoice.filter((order) => {
  //       const fromDate = parseSAPDate(order.FROM_DATE);
  //       const expiryDate = parseSAPDate(order.TO_DATE);

  //       return fromDate <= todayDate && expiryDate >= todayDate;
  //     });
  //     const sortedOrders = activeOrders.sort((a, b) => {
  //       const dateA = parseSAPDate(a.TO_DATE);
  //       const dateB = parseSAPDate(b.TO_DATE);

  //       if (dateA.getTime() === dateB.getTime()) {
  //         // Secondary sort: Sales Order Number ascending
  //         return Number(a.S_ORDER_NO) - Number(b.S_ORDER_NO);
  //       }
  //       return dateA - dateB;
  //     });
  //     setSalesOrders(sortedOrders);
  //   } catch (err) {
  //     console.error(err);
  //     setError("Failed to fetch sales orders. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };





  // =========================
  // BUILD SUMMARY BY CATEGORY
  // =========================

  const fetchSalesOrders = async () => {
    if (!custCode) {
      setError("Customer code not found in local storage.");
      return;
    }

    setLoading(true);
    setError("");

    const apiUrl = `api/sap/opu/odata/sap/ZSALES_ORDER_VIEW_SRV/SalesOrderSet?$filter=FROM_DATE eq '${formatForAPI(fromDate)}' and TO_DATE eq '${formatForAPI(toDate)}' and CUST_CODE_S eq '${custCode}'&$expand=DeliveryOrderSet/InvoiceSet`;

    const parseSAPDate = (sapDate) => {
      if (!sapDate || sapDate.length !== 8) return new Date(0);
      return new Date(
        Number(sapDate.substring(0, 4)),
        Number(sapDate.substring(4, 6)) - 1,
        Number(sapDate.substring(6, 8))
      );
    };

    try {
      const response = await axios.get(apiUrl, {
        auth: { username: "dev01", password: "Kriti@12" },
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      const data = response.data.d.results || [];

      // 1. FLATTEN Delivery + Invoice
      let allOrders = [];
      data.forEach((order) => {
        if (order.DELIVERY_STATUS === "Completed") return;
        if (order.DeliveryOrderSet?.results.length > 0) {
          order.DeliveryOrderSet.results.forEach((del) => {
            if (del.DELIVERY_STATUS === "Completed") return;
            const invoiceNumbers =
              del.InvoiceSet?.results.map((i) => i.INVOICE_NO_I).join(", ") || "";

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

      // 2. REMOVE DUPLICATES
      const uniqueOrders = removeDuplicateOrders(allOrders);

      // 3. EXCLUDE orders with any invoice
      const withoutInvoice = uniqueOrders.filter(
        (o) => !o.INVOICE_NUMBERS || o.INVOICE_NUMBERS === "-" || o.INVOICE_NUMBERS.trim() === ""
      );

      const today = new Date();

      // 4. FILTER only valid active contracts
      const activeOrders = withoutInvoice.filter((order) => {
        const from = parseSAPDate(order.FROM_DATE);
        const to = parseSAPDate(order.TO_DATE);

        // EXCLUDE FUTURE From-Date
        if (from > today) return false;

        // INCLUDE only contracts active on today
        return today >= from && today <= to;
      });

      // 5. SORT by expiring first
      const sortedOrders = activeOrders.sort((a, b) => {
        const dateA = parseSAPDate(a.TO_DATE);
        const dateB = parseSAPDate(b.TO_DATE);

        if (dateA.getTime() === dateB.getTime()) {
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
        .filter((cat) => cat !== "Unknown")
        .map((cat) => ({
          category: cat,
          totalVolume: (categoryMap[cat].totalVolume / 1000).toFixed(3),
          totalPrice: categoryMap[cat].totalPrice.toFixed(2),
        }));

      const defaultCategories = ["SBO", "SFO", "GNO", "KGMO", "Bari"];
      defaultCategories.forEach((cat) => {
        if (!result.some((item) => item.category === cat)) {
          result.push({
            category: cat,
            totalVolume: "0.00",
            totalPrice: "0.00",
          });
        }
      });

      result = result.sort(
        (a, b) =>
          ["SBO", "SFO", "GNO", "KGMO", "Bari"].indexOf(a.category) -
          ["SBO", "SFO", "GNO", "KGMO", "Bari"].indexOf(b.category)
      );

      setSummary(result);
    }
  }, [skuData, salesOrders]);

  // Fetch on mount
  useEffect(() => {
    fetchSkuData();
    fetchSalesOrders();
  }, []);

  // Filter SKU by search term (optional, currently not bound)
  useEffect(() => {
    if (!searchTerm.trim()) {
      return;
    }
    const lower = searchTerm.toLowerCase();
    const filtered = skuData.filter(
      (item) =>
        item.Code?.toLowerCase().includes(lower) ||
        item.Name?.toLowerCase().includes(lower) ||
        item.Primary_category?.toLowerCase().includes(lower)
    );
    // if you want a global filtered list, you can store it
  }, [searchTerm, skuData]);

  // =========================
  // HELPERS
  // =========================

  const getCategorySummaryVolume = (category) => {
    const row = summary.find((s) => s.category === category);
    return row ? Number(row.totalVolume) || 0 : 0;
  };

  const validateGlobalCapacity = () => {
    if (capacity === "" || capacity === null || capacity === undefined) {
      setAlertMessage({
        title: "Capacity Required",
        message: "Please enter vehicle capacity first.",
        continueLabel: "OK",
      });
      setShowAlert(true);
      return false;
    }

    const cap = Number(capacity);
    if (isNaN(cap) || cap <= 0) {
      setAlertMessage({
        title: "Invalid Capacity",
        message: "Capacity must be a positive number.",
        continueLabel: "OK",
      });
      setShowAlert(true);
      return false;
    }

    if (cap > 20) {
      setAlertMessage({
        title: "Capacity Restriction",
        message: "Capacity cannot exceed 20 Tons. Enter capacity ≤ 20.",
        continueLabel: "OK",
      });
      setShowAlert(true);
      return false;
    }

    return true;
  };

  const handleCapacityChange = (e) => {
    const value = e.target.value;
    if (value === "") {
      setCapacity("");
      return;
    }

    if (!/^\d+(\.\d{0,2})?$/.test(value)) {
      // only numeric with optional 2 decimal places
      return;
    }

    const num = Number(value);
    if (num < 0) return;
    if (num > 20) {
      setAlertMessage({
        title: "Capacity Restriction",
        message: "Entered capacity exceeds 20 Tons. Please enter capacity ≤ 20.",
        continueLabel: "OK",
      });
      setShowAlert(true);
      return;
    }

    setCapacity(value);
  };

  const getCartForCategory = (category) => cartByCategory[category] || [];

  const getCartTotals = (category) => {
    const cart = getCartForCategory(category);
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const totalVolumeKG = cart.reduce(
      (sum, item) => sum + (item.totalVolume || 0),
      0
    );
    const totalTons = totalVolumeKG / 1000;
    return {
      totalItems,
      totalVolumeKG,
      totalTons,
      uniqueSkus: cart.length,
    };
  };

  // Global used tons across all categories
  const getGlobalCartTotals = () => {
    let totalTons = 0;
    let totalItems = 0;
    Object.keys(cartByCategory).forEach((cat) => {
      const t = getCartTotals(cat);
      totalTons += t.totalTons;
      totalItems += t.totalItems;
    });
    return { totalTons, totalItems };
  };

  // Example helper - adjust if you already have a version
  // const buildCategorySOData = (category, categoryCapTon) => {
  //   const catOrders = salesOrders
  //     .map((order) => {
  //       const sku = skuData.find((s) => s.Code === order.MATERIAL_S);
  //       if (!sku || sku.Primary_category !== category) return null;

  //       const materialWeight = Number(sku.Net_Weight || 0);
  //       const qty = Number(order.QUANTITIES_S || 0);
  //       if (!materialWeight || !qty) return null;

  //       const totalKG = materialWeight * qty;
  //       const totalMT = totalKG / 1000;

  //       return {
  //         ...order,
  //         category,               // <---- ADD THIS
  //         materialWeight,
  //         totalVolumeInKG: totalKG,
  //         totalWeightInTon: totalMT,
  //       };
  //     })
  //     .filter(Boolean)
  //     .sort((a, b) => {
  //       const dA = Number(a.TO_DATE || 0);
  //       const dB = Number(b.TO_DATE || 0);
  //       if (dA === dB) return Number(a.S_ORDER_NO) - Number(b.S_ORDER_NO);
  //       return dA - dB;
  //     });

  //   const merged = MergeOrdersBySONumber(catOrders)
  //     .map(m => ({ ...m, category }));   // <---- KEEP CATEGORY EVEN AFTER MERGE

  //   return { mergedOrders: merged };
  // };



  const buildCategorySOData = (category) => {
    // Filter relevant sales orders for the selected category
    const catOrders = salesOrders
      .map((order) => {
        const sku = skuData.find((s) => s.Code === order.MATERIAL_S);
        if (!sku || sku.Primary_category !== category) return null;

        const materialWeight = Number(sku.Net_Weight || 0);
        const qty = Number(order.QUANTITIES_S || 0);
        if (!materialWeight || !qty) return null;

        const totalKG = materialWeight * qty;       // Total order KG
        const totalMT = totalKG / 1000;            // Total order MT

        return {
          ...order,
          category,
          materialWeight,
          totalVolumeInKG: totalKG,
          totalWeightInTon: totalMT,
        };
      })
      .filter(Boolean)
      .sort((a, b) => {
        const dA = Number(a.TO_DATE || 0);
        const dB = Number(b.TO_DATE || 0);
        if (dA === dB) return Number(a.S_ORDER_NO) - Number(b.S_ORDER_NO);
        return dA - dB;
      });

    // Merge duplicates with same SO number (FIFO grouping)
    const merged = MergeOrdersBySONumber(catOrders).map((m) => ({
      ...m,
      category,
    }));

    return { mergedOrders: merged };
  };


  // =========================
  // CART / SKU LOGIC (PER CATEGORY)
  // =========================

  const addToCart = (category, sku, quantity = 1) => {
    if (!validateGlobalCapacity()) return;

    const vehicleCap = Number(capacity) || 0;
    //const maxCategoryVolume = getCategorySummaryVolume(category); // MT from contracts
    const maxCategoryVolume = Number(getCategorySummaryVolume(category)) || 0;

    setCartByCategory((prev) => {
      const currentCart = prev[category] || [];
      const calcTons = (cartArr) =>
        cartArr.reduce((s, i) => s + (i.totalTons || 0), 0);

      const existingItem = currentCart.find((item) => item.sku === sku.Code);
      const price = sku.Dewas_ready_price || 0;

      let newCart;
      if (existingItem) {
        const addedVolumeKG = sku.Net_Weight * quantity;
        const addedTons = addedVolumeKG / 1000;

        newCart = currentCart.map((item) =>
          item.sku === sku.Code
            ? {
              ...item,
              quantity: item.quantity + quantity,
              total: price * (item.quantity + quantity),
              netWeightPerUnit: sku.Net_Weight,
              totalVolume: item.totalVolume + addedVolumeKG,
              totalTons: item.totalTons + addedTons,
              singleQTYWeight: sku.Net_Weight,
              unit: sku.SAP_Unit,
              materialBalance: item.totalVolume + addedVolumeKG,
              materialStatus: item.materialStatus || "",
            }
            : item
        );
      } else {
        const totalVolume = sku.Net_Weight * quantity; // KG
        const totalTons = totalVolume / 1000;

        newCart = [
          ...currentCart,
          {
            sku: sku.Code,
            name: sku.Name,
            quantity,
            price,
            total: price * quantity,
            unit: sku.SAP_Unit,
            Primary_category: category,

            netWeightPerUnit: sku.Net_Weight,
            totalVolume,
            totalTons,

            singleQTYWeight: sku.Net_Weight,
            materialBalance: totalVolume,
            materialStatus: "",
          },
        ];
      }

      // Per-category volume check (cannot exceed pending volume)
      const newCatTons = calcTons(newCart);

      if (newCatTons > maxCategoryVolume * 1.02 + 1e-6) {
        setAlertMessage({
          title: "Category Volume Restriction",
          message: `You cannot exceed category available volume ${(maxCategoryVolume * 1.02).toFixed(
            2
          )} Tons (incl. 2% tolerance) for ${category}.`,
          continueLabel: "OK",
        });
        setShowAlert(true);
        return prev;
      }


      // Global vehicle capacity check
      const globalTonsAfter = Object.keys(prev).reduce((sum, key) => {
        const cartArr = key === category ? newCart : prev[key] || [];
        return sum + calcTons(cartArr);
      }, 0);

      if (vehicleCap && globalTonsAfter > vehicleCap + 1e-6) {
        setAlertMessage({
          title: "Vehicle Capacity Exceeded",
          message: `Total selected volume (${globalTonsAfter.toFixed(
            2
          )} MT) exceeds vehicle capacity of ${vehicleCap.toFixed(2)} MT.`,
          continueLabel: "OK",
        });
        setShowAlert(true);
        return prev;
      }

      return {
        ...prev,
        [category]: newCart,
      };
    });
  };

  const updateCartQuantity = (category, skuCode, newQuantityRaw) => {
    if (!validateGlobalCapacity()) return;

    let newQuantity = newQuantityRaw;

    setCartByCategory((prev) => {
      const currentCart = prev[category] || [];
      const item = currentCart.find((i) => i.sku === skuCode);
      if (!item) return prev;

      // Allow typing blank in input
      if (newQuantity === "" || Number.isNaN(newQuantity)) {
        newQuantity = 0;
      }

      if (newQuantity < 0) newQuantity = 0;

      const vehicleCap = Number(capacity) || 0;
      const maxCategoryVolume = getCategorySummaryVolume(category); // MT

      const volumePerUnitKG = item.netWeightPerUnit || 0;
      const tonsPerUnit = volumePerUnitKG / 1000;

      const newTotalVolume = volumePerUnitKG * newQuantity;
      const newTotalTons = tonsPerUnit * newQuantity;

      const calcTons = (cartArr) =>
        cartArr.reduce((s, i) => s + (i.totalTons || 0), 0);

      const updatedCart = currentCart.map((i) =>
        i.sku === skuCode
          ? {
            ...i,
            quantity: newQuantity,
            total: i.price * newQuantity,
            totalVolume: newTotalVolume,
            totalTons: newTotalTons,
            materialBalance: newTotalVolume,
          }
          : i
      );

      // Per-category volume check
      const newCatTons = calcTons(updatedCart);
      if (newCatTons > maxCategoryVolume * 1.02 + 1e-6) {
        setAlertMessage({
          title: "Category Volume Restriction",
          message: `You cannot exceed category available volume ${(maxCategoryVolume * 1.02).toFixed(
            2
          )} Tons (incl. 2% tolerance) for ${category}.`,
          continueLabel: "OK",
        });
        setShowAlert(true);
        return prev;
      }
      // Global capacity check
      const globalTonsAfter = Object.keys(prev).reduce((sum, key) => {
        const cartArr = key === category ? updatedCart : prev[key] || [];
        return sum + calcTons(cartArr);
      }, 0);

      if (vehicleCap && globalTonsAfter > vehicleCap + 1e-6) {
        setAlertMessage({
          title: "Vehicle Capacity Exceeded",
          message: `Total selected volume (${globalTonsAfter.toFixed(
            2
          )} MT) exceeds vehicle capacity of ${vehicleCap.toFixed(2)} MT.`,
          continueLabel: "OK",
        });
        setShowAlert(true);
        return prev;
      }

      return {
        ...prev,
        [category]: updatedCart,
      };
    });
  };

  const handleCheckboxSku = (category, skuCode) => {
    if (!validateGlobalCapacity()) return;

    const catCart = getCartForCategory(category);
    const isSelected = catCart.some((item) => item.sku === skuCode);

    const categorySkuList = skuData.filter(
      (item) => item.Primary_category === category
    );
    const selectedSKU = categorySkuList.find((item) => item.Code === skuCode);
    if (!selectedSKU) return;

    if (isSelected) {
      // remove
      setCartByCategory((prev) => ({
        ...prev,
        [category]: prev[category].filter((item) => item.sku !== skuCode),
      }));
    } else {
      // add
      addToCart(category, selectedSKU, 1);
    }
  };

  const removeFromCart = (category, skuCode) => {
    setCartByCategory((prev) => ({
      ...prev,
      [category]: (prev[category] || []).filter((item) => item.sku !== skuCode),
    }));
  };

  const clearCart = (category) => {
    setCartByCategory((prev) => ({
      ...prev,
      [category]: [],
    }));
  };

  // =========================
  // SUBMIT ORDER (PREVIEW + CONFIRM)
  // =========================

  // const submitOrder = async () => {
  //   if (!validateGlobalCapacity()) return;

  //   const categories = ["SBO", "SFO", "GNO", "KGMO"];

  //   // categories which actually have items in cart
  //   const activeCategories = categories.filter(
  //     (cat) => (cartByCategory[cat] || []).length > 0
  //   );

  //   if (activeCategories.length === 0) {
  //     setAlertMessage({
  //       title: "❌ No Items",
  //       message:
  //         "No items in any category cart. Please add items before submitting.",
  //       continueLabel: "OK",
  //     });
  //     setShowAlert(true);
  //     return;
  //   }

  //   try {
  //     setLoading(true);

  //     const previewResults = [];

  //     for (const cat of activeCategories) {
  //       const catCart = cartByCategory[cat] || [];
  //       const totals = getCartTotals(cat);
  //       const catCap = totals.totalTons; // capacity per category = selected SKUs in MT

  //       if (!catCap || catCap <= 0) {
  //         console.warn(`No volume selected for category ${cat}`);
  //         continue;
  //       }

  //       // SOs for this category (FIFO, merged)
  //       const soInfo = buildCategorySOData(cat, catCap);
  //       if (!soInfo.mergedOrders || soInfo.mergedOrders.length === 0) {
  //         console.warn(`No Sales Orders available for category ${cat}`);
  //         continue;
  //       }

  //       const soDataForBreak = soInfo.mergedOrders;
  //       const materialDataForBreak = catCart.map((m) => ({ ...m }));

  //       // PREVIEW ONLY – DO NOT CALL BACKEND
  //       const breakPreview = await BreakSalesOrder(
  //         soDataForBreak,
  //         materialDataForBreak,
  //         { preview: true, categoryCapacityTon: catCap }
  //       );

  //       previewResults.push({
  //         category: cat,
  //         processedOrders: breakPreview.processedOrders || [],
  //       });
  //     }

  //     setPreviewData(previewResults);
  //     setShowConfirmModal(true); // open confirmation dialog
  //   } catch (error) {
  //     console.error("Error during preview submitOrder:", error);
  //     setAlertMessage({
  //       title: "❌ Error",
  //       message:
  //         error?.response?.data?.message ||
  //         "Something went wrong while preparing order preview.",
  //       continueLabel: "OK",
  //     });
  //     setShowAlert(true);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const confirmSubmitOrder = async () => {
  //   try {
  //     setShowConfirmModal(false);
  //     setLoading(true);

  //     const allResults = [];

  //     for (const catBlock of previewData) {
  //       const { category: cat } = catBlock;

  //       const catCart = cartByCategory[cat] || [];
  //       const totals = getCartTotals(cat);
  //       const catCap = totals.totalTons;

  //       if (!catCap || catCap <= 0 || catCart.length === 0) continue;

  //       const soInfo = buildCategorySOData(cat, catCap);
  //       if (!soInfo.mergedOrders || soInfo.mergedOrders.length === 0) continue;

  //       const soDataForBreak = soInfo.mergedOrders;
  //       const materialDataForBreak = catCart.map((m) => ({ ...m }));

  //       // REAL RUN – preview=false → API call will happen
  //       const result = await BreakSalesOrder(
  //         soDataForBreak,
  //         materialDataForBreak,
  //         { preview: false, categoryCapacityTon: catCap }
  //       );

  //       allResults.push({ category: cat, ...result });
  //     }

  //     console.log("All BreakSalesOrder Results:", allResults);

  //     setAlertMessage({
  //       title: "✅ Success",
  //       message:
  //         "Sales Orders processed successfully for all categories. Check SAP / logs for detailed breakdown.",
  //       continueLabel: "OK",
  //     });
  //     setShowAlert(true);

  //     // clear carts after success
  //     setCartByCategory({
  //       SBO: [],
  //       SFO: [],
  //       GNO: [],
  //       KGMO: [],
  //     });
  //   } catch (error) {
  //     console.error("Error in confirmSubmitOrder:", error);
  //     setAlertMessage({
  //       title: "❌ Error",
  //       message:
  //         error?.response?.data?.message ||
  //         "Something went wrong while processing orders.",
  //       continueLabel: "OK",
  //     });
  //     setShowAlert(true);
  //   } finally {
  //     setLoading(false);
  //   }
  // };



  //This is Working fully fine but taking all SO for Indent 
  // const submitOrder = async () => {
  //   // 1. Check vehicle capacity
  //   if (!validateGlobalCapacity()) return;

  //   const categories = ["SBO", "SFO", "GNO", "KGMO", "Bari"];

  //   // 2. Determine categories that have selected SKUs
  //   const activeCategories = categories.filter(
  //     (cat) => (cartByCategory[cat] || []).length > 0
  //   );

  //   if (activeCategories.length === 0) {
  //     setAlertMessage({
  //       title: "❌ No Items",
  //       message: "No items in any cart. Please add items first.",
  //       continueLabel: "OK",
  //     });
  //     setShowAlert(true);
  //     return;
  //   }

  //   try {
  //     setLoading(true);

  //     const previewResults = []; // modal data

  //     // 3. Process each category independently
  //     for (const cat of activeCategories) {
  //       const catCart = cartByCategory[cat] || [];
  //       const totals = getCartTotals(cat);

  //       if (!totals.totalTons || totals.totalTons <= 0) {
  //         console.warn(`No volume for category ${cat}. Skipping.`);
  //         continue;
  //       }

  //       // 4. Build SO block for category
  //       const soInfo = buildCategorySOData(cat);
  //       if (!soInfo.mergedOrders || soInfo.mergedOrders.length === 0) {
  //         console.warn(`No SO available for ${cat}`);
  //         continue;
  //       }

  //       const soDataForBreak = soInfo.mergedOrders;
  //       const materialDataForBreak = catCart.map((m) => ({ ...m }));

  //       console.log("🔹 Category Processing:", cat, {
  //         soDataForBreak,
  //         materialDataForBreak,
  //       });

  //       // 5. Preview only — DO NOT hit backend
  //       const resultPreview = await BreakSalesOrder(
  //         soDataForBreak,
  //         materialDataForBreak,
  //         { preview: true }
  //       );
  //       const sortedProcessed = (resultPreview.processedOrders || []).sort((a, b) => {
  //         const dA = Number(a.TO_DATE || 0);
  //         const dB = Number(b.TO_DATE || 0);
  //         if (dA === dB) return Number(a.S_ORDER_NO) - Number(b.S_ORDER_NO);
  //         return dA - dB;
  //       });

  //       previewResults.push({
  //         category: cat,
  //         processedOrders: sortedProcessed,
  //       });
  //     }

  //     setPreviewData(previewResults);   // load into modal
  //     setShowConfirmModal(true);        // show preview dialog

  //   } catch (err) {
  //     console.error("Preview error:", err);

  //     setAlertMessage({
  //       title: "❌ Error",
  //       message: err?.response?.data?.message || "Unexpected error in preview.",
  //       continueLabel: "OK",
  //     });

  //     setShowAlert(true);

  //   } finally {
  //     setLoading(false);
  //   }
  // };



  const submitOrder = async () => {
    // 1. Check vehicle capacity
    if (!validateGlobalCapacity()) return;

    const categories = ["SBO", "SFO", "GNO", "KGMO", "Bari"];

    // 2. Determine categories that have selected SKUs
    const activeCategories = categories.filter(
      (cat) => (cartByCategory[cat] || []).length > 0
    );

    if (activeCategories.length === 0) {
      setAlertMessage({
        title: "❌ No Items",
        message: "No items in any cart. Please add items first.",
        continueLabel: "OK",
      });
      setShowAlert(true);
      return;
    }

    try {
      setLoading(true);

      const previewResults = [];

      for (const cat of activeCategories) {
        const catCart = cartByCategory[cat] || [];
        const totals = getCartTotals(cat);
        const catCapTon = totals.totalTons;           // ⬅️ IMPORTANT

        if (!catCapTon || catCapTon <= 0) {
          console.warn(`No volume for category ${cat}. Skipping.`);
          continue;
        }

        // Build SO block for category (FIFO, merged)
        const soInfo = buildCategorySOData(cat);
        if (!soInfo.mergedOrders || soInfo.mergedOrders.length === 0) {
          console.warn(`No SO available for ${cat}`);
          continue;
        }

        const soDataForBreak = soInfo.mergedOrders;
        const materialDataForBreak = catCart.map((m) => ({ ...m }));

        console.log("🔹 Category Processing:", cat, {
          catCapTon,
          soDataForBreak,
          materialDataForBreak,
        });

        // PREVIEW: DO NOT HIT BACKEND
        const resultPreview = await BreakSalesOrder(
          soDataForBreak,
          materialDataForBreak,
          { preview: true, categoryCapacityTon: catCapTon }   // ⬅️ PASS CAPACITY
        );

        previewResults.push({
          category: cat,
          processedOrders: resultPreview.processedOrders || [],
        });
      }

      setPreviewData(previewResults);
      setShowConfirmModal(true);
    } catch (err) {
      console.error("Preview error:", err);
      setAlertMessage({
        title: "❌ Error",
        message: err?.response?.data?.message || "Unexpected error in preview.",
        continueLabel: "OK",
      });
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };


  const confirmSubmitOrder = async () => {
    try {
      setShowConfirmModal(false);
      setLoading(true);

      const allResponses = [];

      for (const block of previewData) {
        const { category: cat, processedOrders } = block;

        if (!processedOrders || processedOrders.length === 0) continue;

        const res = await axios.post("http://udaan.kritinutrients.com/dealer/break-orders", {
          filteredSOData: processedOrders,
        });

        allResponses.push({ category: cat, response: res.data });
      }

      console.log("Final Submission Result:", allResponses);

      setAlertMessage({
        title: "Success",
        message: "Delivery Indent is subbmited successfully.",
        continueLabel: "OK",
      });

      setShowAlert(true);

      // Reset carts
      setCartByCategory({
        SBO: [],
        SFO: [],
        GNO: [],
        KGMO: [],
        Bari: [],
      });

    } catch (err) {
      console.error("Submit Error:", err);

      setAlertMessage({
        title: "❌ Submit Failed",
        message:
          err?.response?.data?.message || "Error submitting orders.",
        continueLabel: "OK",
      });

      setShowAlert(true);

    } finally {
      setLoading(false);
    }
  };



  const globalTotals = getGlobalCartTotals();
  const usedTons = globalTotals.totalTons;
  const capNum = Number(capacity) || 0;
  const remainingTons = capNum > 0 ? Math.max(capNum - usedTons, 0) : 0;

  return (
    <>
      {!loading ? (
        <div className="p-6 space-y-6">
          {error && <p className="text-red-500">{error}</p>}

          {/* HEADER + VEHICLE CAPACITY */}
          <div className="p-6 space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold flex items-center">
                  <ClipboardList className="w-8 h-8 mr-3" />
                  My Sauda
                </h1>
                <p className="text-muted-foreground">
                  Break your Sales Order into SKUs (Category-wise)
                </p>
              </div>
              <div className="min-w-[240px]">
                <h1 className="text-xl font-bold flex items-center">
                  <Truck className="w-8 h-8 mr-3" />
                  Vehicle Capacity (in Tons)
                </h1>
                <Input
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9]*"
                  placeholder="Enter Vehicle Capacity"
                  className="w-full text-center text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  value={capacity}
                  onChange={handleCapacityChange}
                  onKeyDown={(e) => {
                    const allowedKeys = [
                      "Backspace",
                      "Delete",
                      "ArrowLeft",
                      "ArrowRight",
                      "Tab",
                      ".",
                    ];
                    if (!/^[0-9]$/.test(e.key) && !allowedKeys.includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  onWheel={(e) => e.target.blur()}
                />

                {capNum > 0 && (
                  <div className="mt-2 text-xs text-right space-y-1">
                    <div>
                      Used:{" "}
                      <span className="font-semibold">
                        {usedTons.toFixed(2)} MT
                      </span>
                    </div>
                    <div>
                      Remaining:{" "}
                      <span
                        className={
                          remainingTons <= 0.001
                            ? "font-semibold text-red-600"
                            : "font-semibold text-green-700"
                        }
                      >
                        {remainingTons.toFixed(2)} MT
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SUMMARY TABLE (NO INPUT – ONLY INFO + SELECTED TONS) */}
          <Card>
            <CardHeader>
              <CardTitle>Active Pending Contracts</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Total Contract Volume (MT)</TableHead>
                    <TableHead>Selected Volume (MT)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {summary
                    .filter(
                      (item) => item.category && item.category !== "Unknown"
                    )
                    .map((item) => {
                      const cat = item.category;
                      const totals = getCartTotals(cat);
                      return (
                        <TableRow key={cat}>
                          <TableCell>{getCategoryName(cat)}</TableCell>
                          <TableCell>{item.totalVolume} MT</TableCell>
                          <TableCell>
                            {totals.totalTons > 0
                              ? `${totals.totalTons.toFixed(2)} MT`
                              : "0.00 MT"}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* ACCORDION PER CATEGORY (ONLY WHERE totalVolume > 0) */}
          <div className="space-y-4">
            {summary
              .filter(
                (item) =>
                  item.category &&
                  item.category !== "Unknown" &&
                  Number(item.totalVolume) > 0
              )
              .map((item) => {
                const cat = item.category;
                const cart = getCartForCategory(cat);
                const totals = getCartTotals(cat);

                // SKUs for this category
                const categorySkus = skuData.filter(
                  (s) => s.Primary_category === cat
                );

                const isOpen = openCategory === cat;

                return (
                  <div
                    key={cat}
                    className="border rounded-lg shadow-sm bg-white"
                  >
                    {/* Accordion Header */}
                    <button
                      type="button"
                      onClick={() =>
                        setOpenCategory((prev) => (prev === cat ? null : cat))
                      }
                      className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-t-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-gray-800">
                          {getCategoryName(cat)} Contracts
                        </span>

                        <span className="text-xs text-gray-500">
                          Contract Volume: {item.totalVolume} MT
                        </span>

                        {totals.totalTons > 0 && (
                          <span className="text-xs text-blue-600 font-medium">
                            Selected: {totals.totalTons.toFixed(2)} MT
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-gray-600">
                        {isOpen ? "Hide" : "Show"}
                      </span>
                    </button>

                    {/* Accordion Content */}
                    {isOpen && (
                      <div className="p-4 border-t">
                        {/* SKUs + Cart layout (per category) */}
                        <div className="flex flex-col lg:flex-row gap-6">
                          {/* LEFT: SKUs */}
                          <Card className="w-full lg:w-1/2">
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <div>
                                  <CardTitle className="flex items-center">
                                    <Package className="w-5 h-5 mr-2" />
                                    {cat} SKUs
                                  </CardTitle>
                                  <CardDescription>
                                    Select SKUs for {cat}
                                  </CardDescription>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="border rounded-lg p-2 max-h-64 overflow-y-auto w-full">
                                {categorySkus.length === 0 && (
                                  <div className="text-sm text-gray-500 text-center py-4">
                                    No SKU found for {cat}
                                  </div>
                                )}
                                {categorySkus.map((sku) => {
                                  const isSelected = cart.some(
                                    (item) => item.sku === sku.Code
                                  );
                                  return (
                                    <div
                                      key={sku.Code}
                                      className="flex items-center px-2 py-1 cursor-pointer hover:bg-gray-100 rounded"
                                      onClick={() =>
                                        handleCheckboxSku(cat, sku.Code)
                                      }
                                    >
                                      <input
                                        type="checkbox"
                                        checked={isSelected}
                                        readOnly
                                        className="mr-2"
                                      />
                                      <span>
                                        {sku.Code} - {sku.Name}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </CardContent>
                          </Card>

                          {/* RIGHT: Cart (Desktop) */}
                          {cart.length > 0 && (
                            <div className="hidden lg:block w-full lg:w-1/2">
                              <Card>
                                <CardHeader className="flex flex-col space-y-2">
                                  <div className="flex justify-between items-center w-full">
                                    <CardTitle>
                                      Enter Quantity Required
                                    </CardTitle>
                                    <div className="flex items-center space-x-4 ml-auto">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => clearCart(cat)}
                                      >
                                        Clear Cart
                                      </Button>
                                    </div>
                                  </div>
                                  <CardDescription>
                                    Adjust {cat} quantities before submission
                                  </CardDescription>
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
                                            <TableHead>Quantity</TableHead>
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                          {cart.map((item) => (
                                            <TableRow key={item.sku}>
                                              <TableCell>{item.sku}</TableCell>
                                              <TableCell>{item.name}</TableCell>
                                              <TableCell>{item.unit}</TableCell>
                                              <TableCell className="w-44 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                  <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                      updateCartQuantity(
                                                        cat,
                                                        item.sku,
                                                        item.quantity - 1
                                                      )
                                                    }
                                                  >
                                                    <Minus className="w-3 h-3" />
                                                  </Button>
                                                  <Input
                                                    type="text"
                                                    inputMode="numeric"
                                                    pattern="[0-9]*"
                                                    value={
                                                      item.quantity === 0
                                                        ? ""
                                                        : item.quantity
                                                    }
                                                    className="w-20 text-center text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                    onChange={(e) =>
                                                      updateCartQuantity(
                                                        cat,
                                                        item.sku,
                                                        Number(
                                                          e.target.value || "0"
                                                        )
                                                      )
                                                    }
                                                    onKeyDown={(e) => {
                                                      const allowedKeys = [
                                                        "Backspace",
                                                        "Delete",
                                                        "ArrowLeft",
                                                        "ArrowRight",
                                                        "Tab",
                                                      ];
                                                      if (
                                                        !/^[0-9]$/.test(e.key) &&
                                                        !allowedKeys.includes(
                                                          e.key
                                                        )
                                                      ) {
                                                        e.preventDefault();
                                                      }
                                                    }}
                                                    onWheel={(e) =>
                                                      e.target.blur()
                                                    }
                                                  />

                                                  <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                      updateCartQuantity(
                                                        cat,
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
                                                  onClick={() =>
                                                    removeFromCart(
                                                      cat,
                                                      item.sku
                                                    )
                                                  }
                                                >
                                                  <Trash2 className="w-3 h-3" />
                                                </Button>
                                              </TableCell>
                                            </TableRow>
                                          ))}
                                        </TableBody>
                                      </Table>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                      <div className="space-y-2 text-sm">
                                        <div className="flex justify-between mt-2">
                                          <span>Total Items:</span>
                                          <span className="font-medium">
                                            {totals.totalItems}
                                          </span>
                                        </div>
                                        <div className="flex justify-between mt-2">
                                          <span>Unique SKUs:</span>
                                          <span className="font-medium">
                                            {totals.uniqueSkus}
                                          </span>
                                        </div>
                                        <Separator />
                                        <div className="flex justify-between">
                                          <span className="font-medium">
                                            Total Volume:
                                          </span>
                                          <span className="font-bold">
                                            {totals.totalTons.toFixed(2)} MT
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

                        {/* Mobile cart for this category */}
                        {cart.length > 0 && (
                          <div className="block lg:hidden mt-4">
                            <Card>
                              <CardHeader className="flex flex-col space-y-2">
                                <div className="flex justify-between items-center w-full">
                                  <CardTitle>{cat} Order Preview</CardTitle>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => clearCart(cat)}
                                  >
                                    Clear Cart
                                  </Button>
                                </div>
                                <CardDescription>
                                  Review your {cat} order
                                </CardDescription>
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
                                          <TableHead>Quantity</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {cart.map((item) => (
                                          <TableRow key={item.sku}>
                                            <TableCell>{item.sku}</TableCell>
                                            <TableCell>{item.name}</TableCell>
                                            <TableCell>{item.unit}</TableCell>
                                            <TableCell className="w-44 text-center">
                                              <div className="flex items-center justify-center gap-2">
                                                <Button
                                                  variant="outline"
                                                  size="sm"
                                                  onClick={() =>
                                                    updateCartQuantity(
                                                      cat,
                                                      item.sku,
                                                      item.quantity - 1
                                                    )
                                                  }
                                                >
                                                  <Minus className="w-3 h-3" />
                                                </Button>
                                                <Input
                                                  type="text"
                                                  inputMode="numeric"
                                                  pattern="[0-9]*"
                                                  value={item.quantity}
                                                  className="w-20 text-center text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                  onChange={(e) =>
                                                    updateCartQuantity(
                                                      cat,
                                                      item.sku,
                                                      Number(
                                                        e.target.value || "0"
                                                      )
                                                    )
                                                  }
                                                  onKeyDown={(e) => {
                                                    const allowedKeys = [
                                                      "Backspace",
                                                      "Delete",
                                                      "ArrowLeft",
                                                      "ArrowRight",
                                                      "Tab",
                                                    ];
                                                    if (
                                                      !/^[0-9]$/.test(e.key) &&
                                                      !allowedKeys.includes(
                                                        e.key
                                                      )
                                                    ) {
                                                      e.preventDefault();
                                                    }
                                                  }}
                                                  onWheel={(e) =>
                                                    e.target.blur()
                                                  }
                                                />
                                                <Button
                                                  variant="outline"
                                                  size="sm"
                                                  onClick={() =>
                                                    updateCartQuantity(
                                                      cat,
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
                                                onClick={() =>
                                                  removeFromCart(cat, item.sku)
                                                }
                                              >
                                                <Trash2 className="w-3 h-3" />
                                              </Button>
                                            </TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </div>
                                </div>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between mt-2">
                                    <span>Total Items:</span>
                                    <span className="font-medium">
                                      {totals.totalItems}
                                    </span>
                                  </div>
                                  <div className="flex justify-between mt-2">
                                    <span>Unique SKUs:</span>
                                    <span className="font-medium">
                                      {totals.uniqueSkus}
                                    </span>
                                  </div>
                                  <Separator />
                                  <div className="flex justify-between">
                                    <span className="font-medium">
                                      Total Volume:
                                    </span>
                                    <span className="font-bold">
                                      {totals.totalTons.toFixed(2)} MT
                                    </span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>

          {/* VEHICLE DETAILS + SUBMIT (GLOBAL, AFTER ALL CATEGORIES) */}
          {Object.values(cartByCategory).some(
            (catCart) => catCart && catCart.length > 0
          ) && (
              <div className="p-6 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Vehicle Details</CardTitle>
                    <CardDescription>Review before submission</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="space-y-2 text-sm items-center">
                          <div className="flex justify-between">
                            <span className="p-1">Vehicle Number:</span>
                            <Input
                              name="vehicleNumber"
                              value={vehicleDetails.vehicleNumber}
                              onChange={handleVehicleChange}
                              className="border-b border-black text-gray-900 focus:ring-blue-500 focus:border-blue-500 block p-1"
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
                              className="border-b border-black text-gray-900 focus:ring-blue-500 focus:border-blue-500 block p-1"
                            />
                          </div>
                          <Separator />
                        </div>
                      </div>
                    </div>
                    <div className="flex lg:justify-end lg:gap-2 space-x-2">
                      <Button
                        variant="outline"
                        onClick={() =>
                          setCartByCategory({
                            SBO: [],
                            SFO: [],
                            GNO: [],
                            KGMO: [],
                            Bari: [],
                          })
                        }
                      >
                        Clear All Orders
                      </Button>
                      <Button onClick={submitOrder} className="min-w-32">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Submit Order
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
        </div>
      ) : (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-60 z-50">
          <Spinner className="w-12 h-12 text-white animate-spin" />
          <span className="text-white text-lg mt-4 font-semibold">
            Order Processing...
          </span>
        </div>
      )}

      {/* PREVIEW CONFIRMATION DIALOG */}
      <AlertDialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Order Allocation</AlertDialogTitle>
            <AlertDialogDescription>
              Review allocated Sales Orders and SKUs before submission.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {previewData.map((block) => (
              <div key={block.category}>
                <h3 className="font-semibold mb-2 text-blue-700">
                  {block.category} Allocation
                </h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SO Number</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className='p-2'>Unit</TableHead>
                      <TableHead className="">Volume (MT)</TableHead>
                      <TableHead className="">Quantity</TableHead>

                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {block.processedOrders.flatMap((so) =>
                      so.materialOfSO.map((m, idx) => (
                        <TableRow key={`${so.S_ORDER_NO}_${m.sku}_${idx}`}>
                          <TableCell>{so.S_ORDER_NO}</TableCell>
                          <TableCell>
                            {m.sku}
                          </TableCell>
                          <TableCell className='p-2'>
                            {skuData.find((s) => s.Code === m.sku)?.Name || m.sku}
                          </TableCell>
                          <TableCell>
                            {skuData.find((s) => s.Code === m.sku)?.SAP_Unit || m.sku}
                          </TableCell>
                          <TableCell>
                            {((skuData.find((s) => s.Code === m.sku)?.Net_Weight * m.quantity) / 1000).toFixed(2) || m.sku}
                          </TableCell>
                          <TableCell className="">{m.quantity}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            ))}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowConfirmModal(false)}>
              Edit
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmSubmitOrder}>
              Confirm &amp; Submit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ALERT DIALOG */}
      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{alertMessage.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {alertMessage.message}
            </AlertDialogDescription>
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
