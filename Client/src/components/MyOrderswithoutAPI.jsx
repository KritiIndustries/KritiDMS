


import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Droplets } from "lucide-react";
import {
    ShoppingCart,
    Plus,
    Minus,
    Trash2,
    Search,
    ClipboardList,
    Package,
    Tag,
    IndianRupee,
    CheckCircle,
    AlertCircle,
    Package2,
    Truck,
    TruckIcon,
    LucideTruck
} from 'lucide-react';


function makeExpryDate(today) {
    const expiryDate = new Date(today)
    expiryDate.setDate(today.getDate() + 7);


    let day = expiryDate.getDate();
    let month = expiryDate.getMonth() + 1; // Month is 0-indexed, so add 1
    let year = expiryDate.getFullYear();
    const formattedExpiryDate = `${day}/${month}/${year}`;
    console.log(formattedExpiryDate);
    return formattedExpiryDate
}

// Sample SKU data organized by dealer category and subcategory
const salesOrders = [
    {
        id: 'SO-2025-001',
        location: 'Dewas',
        type: 'Ready',
        volumeInTon: 5,
        amount: 125000,
        createdDate: '2025-01-05',
        category: "SBO",
        subCategory: "BP",
        expiryDate: makeExpryDate(new Date('2025-01-05'))

    },
    {
        id: 'SO-2025-002',
        location: 'Dewas',
        type: 'Forward',
        volumeInTon: 4,
        amount: 89000,
        createdDate: '2025-01-04',
        category: "KGMO",
        subCategory: "BP",
        expiryDate: makeExpryDate(new Date('2025-01-04'))
    },
    {
        id: 'SO-2025-003',
        location: 'Dewas',
        type: 'Ready',
        volumeInTon: 7,
        status: 'Verified',
        amount: 156000,
        createdDate: '2025-01-03',
        category: "SFO",
        subCategory: "BP",
        expiryDate: makeExpryDate(new Date('2025-01-03'))
    },
    {
        id: 'SO-2025-004',
        location: 'Dewas',
        type: 'Forward',
        customer: 'LMN Suppliers',
        volumeInTon: 10,
        status: 'DO Created',
        items: 2,
        amount: 67000,
        createdDate: '2025-01-02',
        category: "GNO",
        subCategory: "BP",
        expiryDate: makeExpryDate(new Date('2025-01-02'))
    }
];

const skuData = {
    KGMO: {
        CP: [
            { sku: 'KGMO-CP-001', name: 'KGMO 15 Ltr Tin', price: 1250, mrp: 1400, stock: 150, category: 'KGMO', volume: 0.015 },
            { sku: 'KGMO-CP-002', name: 'KGMO 5 Ltr Jerry', price: 980, mrp: 1100, stock: 200, category: 'KGMO', volume: 0.015 },
            { sku: 'KGMO-CP-003', name: 'KGMO 1 Ltr Bottle', price: 750, mrp: 850, stock: 100, category: 'KGMO', volume: 0.001 },
            { sku: 'KGMO-CP-004', name: 'KGMO 15 KG JAR', price: 1580, mrp: 1750, stock: 75, category: 'KGMO', volume: 0.015 },
            { sku: 'KGMO-CP-005', name: 'KGMO 200 ml Bottle', price: 1120, mrp: 1250, stock: 120, category: 'KGMO', volume: 0.020 }
        ],
        BP: [
            { sku: 'KGMO-BP-001', name: 'KGMO 1 Ltr Bottle', price: 890, mrp: 1000, stock: 180, category: 'KGMO', volume: 0.001 },
            { sku: 'KGMO-BP-002', name: 'KGMO 500 ml Bottle', price: 720, mrp: 800, stock: 160, category: 'KGMO', volume: 0.005 },
            { sku: 'KGMO-BP-003', name: 'KGMO 200 ml Bottle', price: 1250, mrp: 1400, stock: 90, category: 'KGMO', volume: 0.020 },
        ]
    },
    SBO: {
        CP: [
            { sku: 'SBO-CP-001', name: 'SBO 5 Ltr Sq Jar', price: 1350, mrp: 1500, stock: 140, category: 'SBO', volume: 0.005 },
            { sku: 'SBO-CP-002', name: 'SBO 1 Ltr Pouch', price: 1050, mrp: 1200, stock: 190, category: 'SBO', volume: 0.001 },
            { sku: 'SBO-CP-003', name: 'SBO 500 ml Pouch', price: 850, mrp: 950, stock: 95, category: 'SBO', volume: 0.001 },
            { sku: 'SBO-CP-004', name: 'SBO 200 ml Pouch', price: 1680, mrp: 1850, stock: 85, category: 'SBO', volume: 0.002 }
        ],
        BP: [
            { sku: 'SBO-BP-001', name: 'Soya Refined Oil 15Ltr Tin', price: 950, mrp: 1050, stock: 170, category: 'SBO', volume: 0.015 },
            { sku: 'SBO-BP-002', name: 'SBO 15 kg Tin', price: 780, mrp: 850, stock: 150, category: 'SBO', volume: 0.015 },
            { sku: 'SBO-BP-003', name: 'SBO 15 kg Jar', price: 1300, mrp: 1450, stock: 80, category: 'SBO', volume: 0.015 }
        ]
    },
    GNO: {
        CP: [
            { sku: 'GNO-CP-001', name: 'GNO 5 Ltr Sq Jar', price: 1150, mrp: 1300, stock: 160, category: 'GNO', volume: 0.005 },
            { sku: 'GNO-CP-002', name: 'GNO 5 Ltr Jerry', price: 920, mrp: 1050, stock: 210, category: 'GNO', volume: 0.005 },
            { sku: 'GNO-CP-003', name: 'GNO 1 Ltr Pouch', price: 680, mrp: 750, stock: 180, category: 'GNO', volume: 0.001 },
            { sku: 'GNO-CP-004', name: 'GNO 1 Ltr Bottle', price: 1480, mrp: 1650, stock: 70, category: 'GNO', volume: 0.001 }
        ],
        BP: [
            { sku: 'GNO-BP-001', name: 'GNO 15 kg Jar', price: 820, mrp: 900, stock: 190, category: 'GNO', volume: 0.015 },
            { sku: 'GNO-BP-002', name: 'GNO 15 Ltr Jar', price: 650, mrp: 720, stock: 170, category: 'GNO', volume: 0.015 },
            { sku: 'GNO-BP-003', name: 'GNO 15 kg Tin', price: 1180, mrp: 1300, stock: 100, category: 'GNO', volume: 0.015 }
        ]
    },
    SFO: {
        CP: [
            { sku: 'SFO-CP-001', name: 'SFO 5 Ltr Sq Jar', price: 1150, mrp: 1300, stock: 160, category: 'SFO', volume: 0.005 },
            { sku: 'SFO-CP-002', name: 'SFO 5 Ltr Jerry', price: 920, mrp: 1050, stock: 210, category: 'SFO', volume: 0.005 },
            { sku: 'SFO-CP-003', name: 'SFO 1 Ltr Pouch', price: 680, mrp: 750, stock: 180, category: 'SFO', volume: 0.001 },
            { sku: 'SFO-CP-004', name: 'SFO 1 Ltr Bottle', price: 1480, mrp: 1650, stock: 70, category: 'SFO', volume: 0.001 }
        ],
        BP: [
            { sku: 'SFO-BP-001', name: 'SFO 15 kg Jar', price: 820, mrp: 900, stock: 190, category: 'SFO', volume: 0.015 },
            { sku: 'SFO-BP-002', name: 'SFO 15 Ltr Jar', price: 650, mrp: 720, stock: 170, category: 'SFO', volume: 0.015 },
            { sku: 'SFO-BP-003', name: 'SFO 15 kg Tin', price: 1180, mrp: 1300, stock: 100, category: 'SFO', volume: 0.015 }
        ]
    }
};

export function MyOrderswithoutAPI() {
    const [dealerCategory, setDealerCategory] = useState('');
    const [subCategory, setSubCategory] = useState();
    const [searchTerm, setSearchTerm] = useState('');
    const [cart, setCart] = useState([]);
    const [orderNotes, setOrderNotes] = useState('');
    const [selectedOrderVolume, setSelectedOrderVolume] = useState(0);

    const DENSITY = 1;

    // Get available SKUs based on selected category and subcategory
    const availableSKUs = useMemo(() => {
        if (!dealerCategory || !subCategory) return [];
        return skuData[dealerCategory]?.[subCategory] || [];
    }, [dealerCategory, subCategory]);

    // Filter SKUs based on search term
    const filteredSKUs = useMemo(() => {
        if (!searchTerm) return availableSKUs;
        return availableSKUs.filter(sku =>
            sku.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sku.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sku.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [availableSKUs, searchTerm]);

    // Cart calculations
    const cartTotal = useMemo(() =>
        cart.reduce((sum, item) => sum + item.total, 0),
        [cart]
    );
    const cartItems = useMemo(() =>
        cart.reduce((sum, item) => sum + item.quantity, 0),
        [cart]
    );
    const totalTons = useMemo(() =>
        cart.reduce((sum, item) => sum + item.quantity * item.volume * DENSITY, 0),
        [cart]
    );

    const addToCart = (sku, quantity = 1) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.sku === sku.sku);
            if (existingItem) {
                return prevCart.map(item =>
                    item.sku === sku.sku
                        ? {
                            ...item,
                            quantity: item.quantity + quantity,
                            total: (item.quantity + quantity) * item.price,
                            totalTons: (item.quantity + quantity) * sku.volume * DENSITY
                        }
                        : item
                );
            } else {
                return [...prevCart, {
                    sku: sku.sku,
                    name: sku.name,
                    price: sku.price,
                    mrp: sku.mrp,
                    quantity,
                    volume: sku.volume,   // volume in KL
                    total: sku.price * quantity,
                    totalTons: sku.volume * quantity * DENSITY
                }];
            }
        });
    };

    const updateCartQuantity = (sku, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(sku);
            return;
        }

        setCart(prevCart =>
            prevCart.map(item =>
                item.sku === sku
                    ? {
                        ...item,
                        quantity: newQuantity,
                        total: newQuantity * item.price,
                        totalTons: newQuantity * item.volume * DENSITY
                    }
                    : item
            )
        );
    };

    const removeFromCart = (sku) => {
        setCart(prevCart => prevCart.filter(item => item.sku !== sku));
    };

    const clearCart = () => {
        setCart([]);
    };

    const submitOrder = () => {
        if (cart.length === 0) return;
        console.log('Order submitted:', {
            dealerCategory,
            subCategory,
            items: cart,
            total: cartTotal,
            totalTons,
            notes: orderNotes,
            timestamp: new Date().toISOString()
        });

        setCart([]);
        setOrderNotes('');

        alert('Order submitted successfully!');
    };

    const getStockStatus = (stock) => {
        if (stock > 100) return { status: 'In Stock', variant: 'default' };
        if (stock > 50) return { status: 'Low Stock', variant: 'secondary' };
        if (stock > 0) return { status: 'Very Low', variant: 'destructive' };
        return { status: 'Out of Stock', variant: 'outline' };
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold flex items-center">
                        <ClipboardList className="w-8 h-8 mr-3" />
                        My Contracts
                    </h1>
                    <p className="text-muted-foreground">Break your sales Order in available SKUs</p>
                </div>
                <div>
                    <h1 className="text-xl font-bold flex items-center">
                        <Truck className="w-8 h-8 mr-3" />
                        Select Truck capacity
                    </h1>
                    <Input
                        type="number"
                        placeholder="Select Vehical Capacity "
                        min={1}
                        max={20}
                        className="w-full text-center text-sm"

                    />
                </div>
            </div>

            {/* Sales Order Listing */}
            {/* TODO:show only today sales order */}
            <Card>
                <CardHeader>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-lg overflow-x-auto cursor-pointer ">
                        <Table size="2">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order Number</TableHead>
                                    <TableHead>category</TableHead>
                                    <TableHead>volume</TableHead>
                                    <TableHead>Price (₹)</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>ExpiryDate</TableHead>
                                    {/* TODO:Show expiry date column */}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {salesOrders.map((sku) => (
                                    <TableRow key={sku.id} onClick={() => {
                                        setDealerCategory(sku.category);
                                        setSubCategory(sku.subCategory);
                                        setSelectedOrderVolume(sku.volumeInTon);
                                    }}>
                                        <TableCell className="font-medium">{sku.id}</TableCell>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">{sku.category}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{sku.volumeInTon} Ton</TableCell>
                                        <TableCell>₹{sku.amount.toLocaleString()}</TableCell>
                                        <TableCell>{sku.location}</TableCell>
                                        <TableCell>{sku.expiryDate}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    {filteredSKUs.length === 0 && (
                        <div className="text-center py-8">
                            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">
                                {!dealerCategory || !subCategory
                                    ? 'Please select dealer category and subcategory to view SKUs'
                                    : 'No SKUs found matching your search criteria'
                                }
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="border rounded-lg overflow-x-auto">
                <Table size="2">
                    <TableHeader>
                        <TableRow>
                            <TableHead>SKU Code</TableHead>
                            <TableHead>Product Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price (₹)</TableHead>
                            <TableHead>Quantity</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {(skuData[dealerCategory]?.[subCategory] || []).map((sku) => {
                            const stockInfo = getStockStatus(sku.stock);
                            const cartItem = cart.find(item => item.sku === sku.sku);

                            return (
                                <TableRow key={sku.sku}>
                                    <TableCell className="font-medium">{sku.sku}</TableCell>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">{sku.name}</div>
                                            {/* <div className="text-sm text-muted-foreground">Stock: {sku.stock} units</div> */}
                                        </div>
                                    </TableCell>
                                    <TableCell>{sku.category}</TableCell>
                                    <TableCell>₹{sku.price.toLocaleString()}</TableCell>
                                    <TableCell className="w-40 text-center">
                                        {cartItem ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => updateCartQuantity(sku.sku, cartItem.quantity - 1)}
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </Button>
                                                <Input
                                                    type="number"
                                                    value={cartItem.quantity}
                                                    min={1}
                                                    className="w-16 text-center text-sm"
                                                    onChange={(e) => updateCartQuantity(sku.sku, Number(e.target.value))}
                                                />
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => updateCartQuantity(sku.sku, cartItem.quantity + 1)}
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="flex justify-center">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => addToCart(sku)}
                                                    disabled={sku.stock === 0}

                                                >
                                                    <Plus className="w-4 h-4 mr-1" />
                                                    Add
                                                </Button>
                                            </div>
                                        )}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>

            {/* Vehicle */}
            {cart.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Vehicle Summary</CardTitle>
                        <CardDescription>Review your order before submission</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-medium mb-3">Vehicle Details</h4>
                                <div className="space-y-2 text-sm items-center">
                                    <div className="flex justify-between p-1">
                                        <span>Vehicle Volume Fulfillment Status:</span>
                                        <Progress value={Math.min((totalTons / selectedOrderVolume) * 100, 100)} className="h-2 items-center" />
                                    </div>
                                    <div className="flex justify-between">
                                        <span className='p-1'>Vehicle Number:</span>
                                        <input className="border-b border-black text-gray-900 focus:ring-blue-500 focus:border-blue-500 block p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder='Vehicle Number'></input>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className='p-1'>Vehicle Lifting Date:</span>
                                        <input className="border-b border-black text-gray-900 focus:ring-blue-500 focus:border-blue-500 block p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder='Vehicle Placement Date'></input>
                                    </div>
                                    <Separator />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Order Summary and Submission */}
            {cart.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Order Summary</CardTitle>
                        <CardDescription>Review your order before submission</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {totalTons > selectedOrderVolume && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Warning</AlertTitle>
                                <AlertDescription>
                                    Total volume exceeds the sales order volume by {(totalTons - selectedOrderVolume).toFixed(3)} MT.
                                </AlertDescription>
                            </Alert>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-medium mb-3">Order Details</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>Product Category:</span>
                                        <span className="font-medium">{dealerCategory}</span>
                                    </div>
                                    {/* <div className="flex justify-between">
                    <span>Product Subcategory:</span>
                    <span className="font-medium">{subCategory}</span>
                  </div> */}
                                    <div className="flex justify-between">
                                        <span>Total Items:</span>
                                        <span className="font-medium">{cartItems}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Unique SKUs:</span>
                                        <span className="font-medium">{cart.length}</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between">
                                        <span className="font-medium">Total Amount:</span>
                                        <span className="font-bold">₹{cartTotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium">Total Volume:</span>
                                        <span className="font-bold">{totalTons.toFixed(3)} MT</span>
                                    </div>
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
            )}
        </div>
    );
}