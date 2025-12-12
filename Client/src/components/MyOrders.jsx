

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

// adjust if needed
import MergeOrdersBySONumber from "../lib/MergeOrdersBySONumber";
import BreakSalesOrder from "../lib/BreakSalesOrder";
import getCategoryName from "../lib/getCategoryName";

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
  const [indedetedOrders, setIndenetedOrders] = useState([]);

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
    Nugget: []
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

  const fetchIndentedOrders = async () => {
    try {
      setLoading(true);
      const config = {
        method: "get",
        url: "http://udaan.kritinutrients.com/dealer/getIndentOrders",
      };
      const response = await axios(config);
      const ordersindented = response.data.data;
      console.log("Indneted Orders", ordersindented);
      setIndenetedOrders(ordersindented);
    } catch (err) {
      console.error("Error fetching indented orders:", err);
      setError("Failed to load indented orders.");
    } finally {
      setLoading(false);
    }
  }

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
      console.log("Combined SKU", combined);


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

      const defaultCategories = ["SBO", "SFO", "GNO", "KGMO", "Nugget"];
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
          ["SBO", "SFO", "GNO", "KGMO", "Nugget"].indexOf(a.category) -
          ["SBO", "SFO", "GNO", "KGMO", "Nugget"].indexOf(b.category)
      );
      console.log("Summury", result);

      setSummary(result);
    }
  }, [skuData, salesOrders]);

  // Fetch on mount
  useEffect(() => {
    fetchSkuData();
    fetchSalesOrders();
    fetchIndentedOrders();
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

  //   const categories = ["SBO", "SFO", "GNO", "KGMO", "Nugget"];

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

    const categories = ["SBO", "SFO", "GNO", "KGMO", "Nugget"];

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
        Nugget: [],
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
              <div className="min-w-60">
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
                            Nugget: [],
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
