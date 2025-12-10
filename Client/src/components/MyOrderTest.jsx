import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
    ClipboardList,
    Truck,
    Package,
    CheckCircle,
    Trash2,
    Plus,
    Minus,
} from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";

// Placeholder for your existing functions
const MergeOrdersBySONumber = (orders) => orders;
const BreakSalesOrder = async (orders, cart) => {
    // Your SAP breaking logic here
    console.log("Breaking orders:", orders, cart);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // simulate API
};

export function MyOrdersTest() {
    const today = new Date();
    const firstDayOfMonth = new Date();
    firstDayOfMonth.setDate(today.getDate() - 15);

    // Main states
    const [capacity, setCapacity] = useState < number | "" > ("");
    const [categoryCapacity, setCategoryCapacity] = useState({});
    const [activeCategory, setActiveCategory] = useState(null);
    const [categoryCarts, setCategoryCarts] = useState({});

    const [skuData, setSkuData] = useState([])
    const [salesOrders, setSalesOrders] = useState([])
    const [summary, setSummary] = useState([])
    const [filteredSKU, setFilteredSKU] = useState([])

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState({
        title: "",
        message: "",
        continueLabel: "OK",
    });

    const storedDealer = JSON.parse(localStorage.getItem("dealerData") || "{}");
    const custCode = storedDealer?.UserName || "";

    // Fetch data
    const fetchSkuData = async () => {
        try {
            setLoading(true);
            const response = await axios.get("http://udaan.kritinutrients.com/dealer/getMaterial");
            setSkuData(response.data.data || []);
        } catch (err) {
            setError("Failed to load SKU data.");
        } finally {
            setLoading(false);
        }
    };

    const fetchSalesOrders = async () => {
        // Keep your original SAP fetch logic here
        // For demo, we'll use mock data
        setTimeout(() => {
            setSalesOrders([
                { MATERIAL_S: "1001", QUANTITIES_S: 100, MATERIAL_DES_S: "SOYABEAN OIL", GROSS_VALUE_S: 95000 },
                { MATERIAL_S: "2001", QUANTITIES_S: 80, MATERIAL_DES_S: "SUNFLOWER OIL", GROSS_VALUE_S: 88000 },
            ]);
        }, 500);
    };

    useEffect(() => {
        fetchSkuData();
        fetchSalesOrders();
    }, []);

    // Build summary
    useEffect(() => {
        if (skuData.length === 0 || salesOrders.length === 0) return;

        const combined = salesOrders.map((order) => {
            const sku = skuData.find((s) => s.Code === order.MATERIAL_S);
            return {
                Primary_category: sku?.Primary_category || "Unknown",
                QUANTITIES_S: Number(order.QUANTITIES_S),
                Gross_Weight: Number(sku?.Net_Weight || 0),
            };
        });

        const map = {};
        combined.forEach((item) => {
            if (!map[item.Primary_category]) {
                map[item.Primary_category] = 0;
            }
            map[item.Primary_category] += item.QUANTITIES_S * item.Gross_Weight;
        });

        const result = Object.keys(map)
            .filter((cat) => cat !== "Unknown")
            .map((cat) => ({
                category: cat,
                totalVolume: (map[cat] / 1000).toFixed(3),
            }));

        const defaults = ["SBO", "SFO", "GNO", "KGMO"];
        defaults.forEach((cat) => {
            if (!result.some((r) => r.category === cat)) {
                result.push({ category: cat, totalVolume: "0.00" });
            }
        });

        setSummary(result.sort((a, b) => defaults.indexOf(a.category) - defaults.indexOf(b.category)));
    }, [skuData, salesOrders]);

    // Handle tonnage input per category
    const handleCategoryTonnageChange = (category, value) => {
        if (!capacity || capacity === "") {
            setAlertMessage({ title: "Required", message: "Enter vehicle capacity first.", continueLabel: "OK" });
            setShowAlert(true);
            return;
        }

        const num = parseFloat(value) || 0;
        const currentTotal = Object.values(categoryCapacity)
            .filter((_, k) => k !== category)
            .reduce((sum, v) => sum + (parseFloat(v) || 0), 0) + num;

        if (currentTotal > Number(capacity)) {
            setAlertMessage({ title: "Too Much", message: `Total cannot exceed ${capacity} Tons.`, continueLabel: "OK" });
            setShowAlert(true);
            return;
        }

        const available = parseFloat(summary.find((s) => s.category === category)?.totalVolume || "0");
        if (num > available) {
            setAlertMessage({ title: "Not Available", message: `Only ${available} MT available for ${category}.`, continueLabel: "OK" });
            setShowAlert(true);
            return;
        }

        setCategoryCapacity((prev) => ({ ...prev, [category]: value }));
    };

    // Open category
    const handleCategoryClick = (item) => {
        const allocated = parseFloat(categoryCapacity[item.category] || "0");
        if (allocated <= 0) {
            setAlertMessage({ title: "Enter Amount", message: `Please enter tonnage for ${item.category} first.`, continueLabel: "OK" });
            setShowAlert(true);
            return;
        }

        setActiveCategory(item.category);
        const skus = skuData.filter((s) => s.Primary_category === item.category);
        setFilteredSKU(skus);

        if (!categoryCarts[item.category]) {
            setCategoryCarts((prev) => ({ ...prev, [item.category]: [] }));
        }
    };

    // Cart helpers
    const getCartVolume = (cat) => {
        const cart = categoryCarts[cat] || [];
        return (cart.reduce((sum, i) => sum + (i.totalVolume || 0), 0) / 1000).toFixed(3);
    };

    const addToCart = (sku, qty = 1) => {
        if (!activeCategory) return;

        const maxTons = parseFloat(categoryCapacity[activeCategory] || "0");
        const currentTons = parseFloat(getCartVolume(activeCategory));
        const addedTons = (sku.Net_Weight / 1000) * qty;

        if (currentTons + addedTons > maxTons) {
            setAlertMessage({
                title: "Limit Exceeded",
                message: `${activeCategory} limit: ${maxTons} Tons. Adding ${addedTons.toFixed(2)} would exceed.`,
                continueLabel: "OK",
            });
            setShowAlert(true);
            return;
        }

        setCategoryCarts((prev) => {
            const cart = prev[activeCategory] || [];
            const existing = cart.find((i) => i.sku === sku.Code);

            if (existing) {
                return {
                    ...prev,
                    [activeCategory]: cart.map((i) =>
                        i.sku === sku.Code
                            ? { ...i, quantity: i.quantity + qty, totalVolume: i.totalVolume + sku.Net_Weight * qty }
                            : i
                    ),
                };
            }

            return {
                ...prev,
                [activeCategory]: [
                    ...cart,
                    {
                        sku: sku.Code,
                        name: sku.Name,
                        quantity: qty,
                        price: sku.Dewas_ready_price || 0,
                        totalVolume: sku.Net_Weight * qty,
                        unit: sku.SAP_Unit || "KG",
                        Primary_category: activeCategory,
                    },
                ],
            };
        });
    };

    const updateQuantity = (skuCode, newQty) => {
        if (newQty < 1) newQty = 1;

        setCategoryCarts((prev) => ({
            ...prev,
            [activeCategory]: prev[activeCategory].map((item) =>
                item.sku === skuCode
                    ? {
                        ...item,
                        quantity: newQty,
                        totalVolume: item.singleWeight
                            ? item.singleWeight * newQty
                            : item.totalVolume,
                    }
                    : item
            ),
        }));
    };

    const removeItem = (skuCode) => {
        setCategoryCarts((prev) => ({
            ...prev,
            [activeCategory]: prev[activeCategory].filter(
                (item) => item.sku !== skuCode
            ),
        }));
    };

    const submitCategoryOrder = async () => {
        if (!activeCategory || !categoryCarts[activeCategory]?.length) return;

        setLoading(true);
        try {
            // Your SAP logic here
            await BreakSalesOrder([], categoryCarts[activeCategory]);

            setAlertMessage({
                title: "Success!",
                message: `${activeCategory} order submitted successfully!`,
                continueLabel: "Done",
            });
            setShowAlert(true);

            // Clear this category
            setCategoryCarts((prev) => ({ ...prev, [activeCategory]: [] }));
            setCategoryCapacity((prev) => ({ ...prev, [activeCategory]: "" }));
            setActiveCategory(null);
        } catch (err) {
            setAlertMessage({ title: "Error", message: "Failed to submit.", continueLabel: "OK" });
            setShowAlert(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Loading Overlay */}
            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 flex items-center gap-4">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                        <span className="text-lg font-medium">Processing Order...</span>
                    </div>
                </div>
            )}

            <div className="p-6 space-y-8 max-w-7xl mx-auto">
                {error && <p className="text-red-600 font-medium">{error}</p>}

                {/* Header + Capacity */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-3">
                            <ClipboardList className="w-9 h-9" />
                            My Sauda
                        </h1>
                        <p className="text-muted-foreground mt-1">Break sales orders category-wise</p>
                    </div>

                    <div className="text-right">
                        <label className="text-xl font-bold flex items-center gap-3">
                            <Truck className="w-8 h-8" />
                            Vehicle Capacity (Tons)
                        </label>
                        <Input
                            type="text"
                            inputMode="numeric"
                            placeholder="e.g. 4"
                            value={capacity}
                            onChange={(e) => {
                                const val = e.target.value === "" ? "" : Number(e.target.value);
                                if (val === "" || (val > 0 && val <= 20)) setCapacity(val);
                            }}
                            className="w-32 text-center text-lg mt-2"
                        />
                    </div>
                </div>

                {/* Active Pending Contracts */}
                <Card>
                    <CardHeader>
                        <CardTitle>Active Pending Contracts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Available (MT)</TableHead>
                                    <TableHead>Allocate (Tons)</TableHead>
                                    <TableHead>Used</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {summary.map((item) => {
                                    const allocated = categoryCapacity[item.category] || "";
                                    const used = getCartVolume(item.category);
                                    const isActive = activeCategory === item.category;

                                    return (
                                        <TableRow
                                            key={item.category}
                                            className={`${isActive ? "bg-blue-50" : "hover:bg-gray-50"} cursor-pointer transition-colors`}
                                            onClick={() => handleCategoryClick(item)}
                                        >
                                            <TableCell className="font-semibold">{item.category}</TableCell>
                                            <TableCell>{item.totalVolume}</TableCell>
                                            <TableCell onClick={(e) => e.stopPropagation()}>
                                                <Input
                                                    type="text"
                                                    inputMode="decimal"
                                                    value={allocated}
                                                    placeholder="0.00"
                                                    className="w-28 text-center"
                                                    onChange={(e) => handleCategoryTonnageChange(item.category, e.target.value)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {used > 0 ? (
                                                    <span className="text-green-600 font-medium">{used} MT</span>
                                                ) : (
                                                    "-"
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Category Workspace */}
                {activeCategory && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold">
                                Working on:{" "}
                                <span className="text-blue-600">{activeCategory}</span>
                                <span className="text-lg font-normal text-gray-600 ml-2 ml-4">
                                    Allocated: {categoryCapacity[activeCategory]} Tons | Used: {getCartVolume(activeCategory)} Tons
                                </span>
                            </h2>
                            <Button variant="outline" onClick={() => setActiveCategory(null)}>
                                Back to Summary
                            </Button>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-8">
                            {/* SKU List */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Package className="w-6 h-6" />
                                        Available SKUs - {activeCategory}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="border rounded-lg max-h-96 overflow-y-auto p-3 space-y-2">
                                        {filteredSKU.length === 0 ? (
                                            <p className="text-center text-gray-500 py-8">No SKUs found</p>
                                        ) : (
                                            filteredSKU.map((sku) => {
                                                const inCart = categoryCarts[activeCategory]?.some((i) => i.sku === sku.Code);
                                                return (
                                                    <div
                                                        key={sku.Code}
                                                        className={`p-3 rounded-lg border cursor-pointer transition-all ${inCart ? "bg-green-50 border-green-400" : "hover:bg-gray-50"
                                                            }`}
                                                        onClick={() => addToCart(sku)}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <input type="checkbox" checked={inCart} readOnly className="w-5 h-5" />
                                                                <div>
                                                                    <div className="font-medium">{sku.Code}</div>
                                                                    <div className="text-sm text-gray-600">{sku.Name}</div>
                                                                </div>
                                                            </div>
                                                            <div className="text-right text-sm">
                                                                <div>{sku.Net_Weight} KG / Unit</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Cart */}
                            {categoryCarts[activeCategory]?.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <div className="flex justify-between items-center">
                                            <CardTitle>{activeCategory} Order Preview</CardTitle>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setCategoryCarts((prev) => ({ ...prev, [activeCategory]: [] }))}
                                            >
                                                Clear All
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>SKU</TableHead>
                                                    <TableHead>Name</TableHead>
                                                    <TableHead className="text-center">Qty</TableHead>
                                                    <TableHead></TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {categoryCarts[activeCategory].map((item) => (
                                                    <TableRow key={item.sku}>
                                                        <TableCell className="font-medium">{item.sku}</TableCell>
                                                        <TableCell>{item.name}</TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center justify-center gap-2">
                                                                <Button size="icon" variant="outline" onClick={() => updateQuantity(item.sku, item.quantity - 1)}>
                                                                    <Minus className="w-4 h-4" />
                                                                </Button>
                                                                <Input value={item.quantity} className="w-20 text-center" readOnly />
                                                                <Button size="icon" variant="outline" onClick={() => updateQuantity(item.sku, item.quantity + 1)}>
                                                                    <Plus className="w-4 h-4" />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button size="icon" variant="ghost" onClick={() => removeItem(item.sku)}>
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>

                                        <Separator className="my-4" />
                                        <div className="text-right space-y-2">
                                            <p className="text-lg font-bold">
                                                Total Used: {getCartVolume(activeCategory)} / {categoryCapacity[activeCategory]} Tons
                                            </p>
                                        </div>

                                        <div className="mt-6 flex justify-end">
                                            <Button size="lg" onClick={submitCategoryOrder}>
                                                <CheckCircle className="w-5 h-5 mr-2" />
                                                Submit {activeCategory} Order
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Alert Dialog */}
            <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{alertMessage.title}</AlertDialogTitle>
                        <AlertDialogDescription>{alertMessage.message}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => setShowAlert(false)}>
                            {alertMessage.continueLabel}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

export default MyOrders;