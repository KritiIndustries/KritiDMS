// import { useState, useMemo } from 'react';
// import { Link } from "react-router-dom";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
// import { Button } from './ui/button';
// import { Input } from './ui/input';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
// import { Badge } from './ui/badge';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
// import { Separator } from './ui/separator';
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
//   Package2
// } from 'lucide-react';
// import { Alert, AlertDescription, AlertTitle } from './ui/alert';
// // Sample SKU data organized by Product category and subcategory
// const skuData = {
//   KGMO: {
//     CP: [
//       { sku: 'KGMO-CP-001', name: 'KGMO 15 Ltr Tin', price: 1250, mrp: 1400, stock: 150, category: 'KGMO', volume: 0.015 },
//       { sku: 'KGMO-CP-002', name: 'KGMO 5 Ltr Jerry', price: 980, mrp: 1100, stock: 200, category: 'KGMO', volume: 0.001 },
//       { sku: 'KGMO-CP-003', name: 'KGMO 1 Ltr Bottle', price: 750, mrp: 850, stock: 100, category: 'KGMO', volume: 0.001 },
//       { sku: 'KGMO-CP-004', name: 'KGMO 15 KG JAR', price: 1580, mrp: 1750, stock: 75, category: 'KGMO', volume: 0.015 },
//       { sku: 'KGMO-CP-005', name: 'KGMO 200 ml Bottle', price: 1120, mrp: 1250, stock: 120, category: 'KGMO', volume: 0.0001 }
//     ],
//     BP: [
//       { sku: 'KGMO-BP-001', name: 'KGMO 1 Ltr Bottle', price: 890, mrp: 1000, stock: 180, category: 'KGMO', volume: 0.001 },
//       { sku: 'KGMO-BP-002', name: 'KGMO 500 ml Bottle', price: 720, mrp: 800, stock: 160, category: 'KGMO', volume: 0.0005 },
//       { sku: 'KGMO-BP-003', name: 'KGMO 200 ml Bottle', price: 1250, mrp: 1400, stock: 90, category: 'KGMO', volume: 0.0005 },

//     ]
//   },
//   SBO: {
//     CP: [
//       { sku: 'SBO-CP-001', name: 'SBO 5 Ltr Sq Jar', price: 1350, mrp: 1500, stock: 140, category: 'SBO', volume: 0.005 },
//       { sku: 'SBO-CP-002', name: 'SBO 1 Ltr Pouch', price: 1050, mrp: 1200, stock: 190, category: 'SBO', volume: 0.001 },
//       { sku: 'SBO-CP-003', name: 'SBO 500 ml Pouch', price: 850, mrp: 950, stock: 95, category: 'SBO', volume: 0.0005 },
//       { sku: 'SBO-CP-004', name: 'SBO 200 ml Pouch', price: 1680, mrp: 1850, stock: 85, category: 'SBO', volume: 0.0005 }
//     ],
//     BP: [
//       { sku: 'SBO-BP-001', name: 'Soya Refined Oil 15Ltr Tin', price: 950, mrp: 1050, stock: 170, category: 'SBO', volume: 0.015 },
//       { sku: 'SBO-BP-002', name: 'SBO 15 kg Tin', price: 780, mrp: 850, stock: 150, category: 'SBO', volume: 0.015 },
//       { sku: 'SBO-BP-003', name: 'SBO 15 kg Jar', price: 1300, mrp: 1450, stock: 80, category: 'SBO', volume: 0.015 }
//     ]
//   },
//   GNO: {
//     CP: [
//       { sku: 'GNO-CP-001', name: 'GNO 5 Ltr Sq Jar', price: 1150, mrp: 1300, stock: 160, category: 'GNO', volume: 0.005 },
//       { sku: 'GNO-CP-002', name: 'GNO 5 Ltr Jerry', price: 920, mrp: 1050, stock: 210, category: 'GNO', volume: 0.005 },
//       { sku: 'GNO-CP-003', name: 'GNO 1 Ltr Pouch', price: 680, mrp: 750, stock: 180, category: 'GNO', volume: 0.001 },
//       { sku: 'GNO-CP-004', name: 'GNO 1 Ltr Bottle', price: 1480, mrp: 1650, stock: 70, category: 'GNO', volume: 0.001 }
//     ],
//     BP: [
//       { sku: 'GNO-BP-001', name: 'GNO 15 kg Jar', price: 820, mrp: 900, stock: 190, category: 'GNO', volume: 0.015 },
//       { sku: 'GNO-BP-002', name: 'GNO 15 Ltr Jar', price: 650, mrp: 720, stock: 170, category: 'GNO', volume: 0.015 },
//       { sku: 'GNO-BP-003', name: 'GNO 15 kg Tin', price: 1180, mrp: 1300, stock: 100, category: 'GNO', volume: 0.015 }
//     ]
//   },
//   SFO: {
//     CP: [
//       { sku: 'SFO-CP-001', name: 'SFO 5 Ltr Sq Jar', price: 1150, mrp: 1300, stock: 160, category: 'SFO', volume: 0.005 },
//       { sku: 'SFO-CP-002', name: 'SFO 5 Ltr Jerry', price: 920, mrp: 1050, stock: 210, category: 'SFO', volume: 0.005 },
//       { sku: 'SFO-CP-003', name: 'SFO 1 Ltr Pouch', price: 680, mrp: 750, stock: 180, category: 'SFO', volume: 0.001 },
//       { sku: 'SFO-CP-004', name: 'SFO 1 Ltr Bottle', price: 1480, mrp: 1650, stock: 70, category: 'SFO', volume: 0.001 }
//     ],
//     BP: [
//       { sku: 'SFO-BP-001', name: 'SFO 15 kg Jar', price: 820, mrp: 900, stock: 190, category: 'SFO', volume: 0.015 },
//       { sku: 'SFO-BP-002', name: 'SFO 15 Ltr Jar', price: 650, mrp: 720, stock: 170, category: 'SFO', volume: 0.015 },
//       { sku: 'SFO-BP-003', name: 'SFO 15 kg Tin', price: 1180, mrp: 1300, stock: 100, category: 'SFO', volume: 0.015 }
//     ]
//   }

// };

// export function CreateOrder() {
//   const [dealerCategory, setDealerCategory] = useState('');
//   const [subCategory, setSubCategory] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [cart, setCart] = useState([]);
//   const [orderNotes, setOrderNotes] = useState('');
//   const [totalvolume, setTotalVolume] = useState(0)
//   const [slaesOrders, setSalesOrders] = useState([])
//   const DENSITY = 1;

//   // Get available SKUs based on selected category and subcategory
//   const availableSKUs = useMemo(() => {
//     if (!dealerCategory || !subCategory) return [];
//     return skuData[dealerCategory]?.[subCategory] || [];
//   }, [dealerCategory, subCategory]);

//   // Filter SKUs based on search term
//   const filteredSKUs = useMemo(() => {
//     if (!searchTerm) return availableSKUs;
//     return availableSKUs.filter(sku =>
//       sku.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       sku.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       sku.category.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   }, [availableSKUs, searchTerm]);

//   // Cart calculations
//   const cartTotal = cart.reduce((sum, item) => sum + item.total, 0);
//   const cartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

//   //Volume Calucalte

//   //Working
//   // const addToCart = (sku, quantity = 1) => {
//   //   setCart(prevCart => {
//   //     const existingItem = prevCart.find(item => item.sku === sku.sku);
//   //     if (existingItem) {
//   //       return prevCart.map(item =>
//   //         item.sku === sku.sku
//   //           ? { ...item, quantity: item.quantity + quantity, total: (item.quantity + quantity) * item.price }
//   //           : item
//   //       );
//   //     } else {
//   //       return [...prevCart, {
//   //         sku: sku.sku,
//   //         name: sku.name,
//   //         price: sku.price,
//   //         mrp: sku.mrp,
//   //         quantity,
//   //         total: sku.price * quantity
//   //       }];
//   //     }



//   //   });
//   // };
//   // const addToCart = (sku, quantity = 1) => {
//   //   setCart(prevCart => {
//   //     const existingItem = prevCart.find(item => item.sku === sku.sku);
//   //     if (existingItem) {
//   //       return prevCart.map(item =>
//   //         item.sku === sku.sku
//   //           ? {
//   //             ...item,
//   //             quantity: item.quantity + quantity,
//   //             total: (item.quantity + quantity) * item.price,
//   //             totalVolume: (item.quantity + quantity) * item.volume
//   //           }
//   //           : item
//   //       );
//   //     } else {
//   //       return [...prevCart, {
//   //         sku: sku.sku,
//   //         name: sku.name,
//   //         price: sku.price,
//   //         mrp: sku.mrp,
//   //         quantity,
//   //         volume: sku.volume,         // ✅ store volume
//   //         total: sku.price * quantity,
//   //         totalVolume: sku.volume * quantity
//   //       }];
//   //     }
//   //   });
//   // };
//   const addToCart = (sku, quantity = 1) => {
//     setCart(prevCart => {
//       const existingItem = prevCart.find(item => item.sku === sku.sku);
//       if (existingItem) {
//         return prevCart.map(item =>
//           item.sku === sku.sku
//             ? {
//               ...item,
//               quantity: item.quantity + quantity,
//               total: (item.quantity + quantity) * item.price,
//               totalTons: (item.quantity + quantity) * sku.volume * DENSITY
//             }
//             : item
//         );
//       } else {
//         return [...prevCart, {
//           sku: sku.sku,
//           name: sku.name,
//           price: sku.price,
//           mrp: sku.mrp,
//           quantity,
//           volume: sku.volume,   // volume in KL
//           total: sku.price * quantity,
//           totalTons: sku.volume * quantity * DENSITY
//         }];
//       }
//     });
//   };

//   // const updateCartQuantity = (sku, newQuantity, newVolume) => {
//   //   if (newQuantity <= 0) {
//   //     removeFromCart(sku);
//   //     return;
//   //   }
//   //   setCart(prevCart =>
//   //     prevCart.map(item =>
//   //       item.sku === sku
//   //         ? { ...item, quantity: newQuantity, total: newQuantity * item.price }
//   //         : item
//   //     )
//   //   );
//   //   console.log(newVolume);



//   // };

//   const updateCartQuantity = (sku, newQuantity) => {
//     if (newQuantity <= 0) {
//       removeFromCart(sku);
//       return;
//     }
//     setCart(prevCart =>
//       prevCart.map(item =>
//         item.sku === sku
//           ? {
//             ...item,
//             quantity: newQuantity,
//             total: newQuantity * item.price,
//             totalVolume: newQuantity * item.volume
//           }
//           : item
//       )
//     );
//   };
//   // const totalVolume = useMemo(() => {
//   //   return cart.reduce((sum, item) => sum + (item.totalVolume || 0), 0);
//   // }, [cart]);
//   const totalVolume = useMemo(() => {
//     return cart.reduce((sum, item) => sum + (item.totalVolume || 0), 0);
//   }, [cart]);

//   const removeFromCart = (sku) => {
//     setCart(prevCart => prevCart.filter(item => item.sku !== sku));
//   };

//   const clearCart = () => {
//     setCart([]);
//   };

//   const submitOrder = () => {
//     if (cart.length === 0) return;

//     // Here you would typically send the order to your backend
//     console.log('Order submitted:', {
//       dealerCategory,
//       subCategory,
//       items: cart,
//       total: cartTotal,
//       notes: orderNotes,
//       timestamp: new Date().toISOString()
//     });

//     // Reset form after successful submission
//     setCart([]);
//     setOrderNotes('');
//     // <Alert variant="success">
//     //   <AlertCircle className="h-4 w-4" />
//     //   <AlertTitle>Success</AlertTitle>
//     //   <AlertDescription>
//     //     Order submitted successfully!
//     //   </AlertDescription>
//     // </Alert>
//     alert("Order submitted successfully!")

//   };

//   const getStockStatus = (stock) => {
//     if (stock > 100) return { status: 'In Stock', variant: 'default' };
//     if (stock > 50) return { status: 'Low Stock', variant: 'secondary' };
//     if (stock > 0) return { status: 'Very Low', variant: 'destructive' };
//     return { status: 'Out of Stock', variant: 'outline' };
//   };

//   return (
//     <div className="p-6 space-y-6">
//       <div className="flex justify-between items-start">
//         <div>
//           <h1 className="text-3xl font-bold flex items-center">
//             <ShoppingCart className="w-8 h-8 mr-3" />
//             Contract Booking
//           </h1>
//           <p className="text-muted-foreground">Select your category and browse available SKUs</p>
//         </div>

//         {/* <Button asChild>
//           <Link to="/my-order">
//             <Package2 className="w-4 h-4 mr-2" />
//             SKU Indent
//           </Link>
//         </Button> */}
//       </div>

//       {/* Category Selection */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center">
//             <Tag className="w-5 h-5 mr-2" />
//             product Category & Subcategory
//           </CardTitle>
//           <CardDescription>Select your Product category and product subcategory</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium mb-2">Product Category</label>
//               <Select value={dealerCategory} onValueChange={(value) => {
//                 setDealerCategory(value);
//                 setSubCategory(''); // Reset subcategory when Product category changes
//               }}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select Product category" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="SFO">SFO </SelectItem>
//                   <SelectItem value="SBO">SBO </SelectItem>
//                   <SelectItem value="GNO">GNO </SelectItem>
//                   <SelectItem value="KGMO">KGMO </SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-2">Product Subcategory</label>
//               <Select value={subCategory} onValueChange={setSubCategory} disabled={!dealerCategory}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select subcategory" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="CP">CP </SelectItem>
//                   <SelectItem value="BP">BP </SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
//             <div>
//               <label className="block text-sm font-medium mb-2">Location</label>
//               <Select >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select Location" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="Dewas" >Dewas Plant </SelectItem>
//                   <SelectItem value='Jabalpur' >Depot </SelectItem>
//                   {/* <SelectItem value="GNO">GNO </SelectItem>
//                   <SelectItem value="KGMO">KGMO </SelectItem>  */}
//                 </SelectContent>
//               </Select>
//             </div>
//             {dealerCategory === "SBO" && (
//               <div>
//                 <label className="block text-sm font-medium mb-2">Type</label>
//                 <Select>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select Type" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="Ready">Ready</SelectItem>
//                     <SelectItem value="Forward">Forward</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             )}
//           </div>
//         </CardContent>
//       </Card>

//       {/* Shopping Cart Summary */}
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
//                   <div className="flex items-center space-x-2">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => updateCartQuantity(item.sku, item.quantity - 1, item.volume)}
//                     >
//                       <Minus className="w-3 h-3" />
//                     </Button>
//                     {/* <span className="w-8 text-center text-sm">{item.quantity}</span> */}
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
//                       onClick={() => updateCartQuantity(item.sku, item.quantity + 1, item.volume)}
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

//       {/* SKU Listing */}
//       {dealerCategory && subCategory && (
//         <Card>
//           <CardHeader>
//             <div className=" flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 ">
//               <div>
//                 <CardTitle className="flex items-center">
//                   <Package className="w-5 h-5 mr-2" />
//                   Available SKUs - {dealerCategory} / {subCategory}
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
//             </div>
//           </CardHeader>
//           <CardContent>

//             <div className="border rounded-lg overflow-x-auto  ">
//               <Table size="2"  >
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>SKU Code</TableHead>
//                     <TableHead>Product Name</TableHead>
//                     <TableHead>Category</TableHead>
//                     <TableHead > Price (₹)</TableHead>
//                     <TableHead >Quantity</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {filteredSKUs.map((sku) => {
//                     const stockInfo = getStockStatus(sku.stock);
//                     const cartItem = cart.find(item => item.sku === sku.sku);

//                     return (
//                       <TableRow key={sku.sku}>
//                         <TableCell className="font-medium">{sku.sku}</TableCell>
//                         <TableCell>
//                           <div>
//                             <div className="font-medium">{sku.name}</div>
//                             {/* <div className="text-sm text-muted-foreground">Stock: {sku.stock} units</div> */}
//                           </div>
//                         </TableCell>
//                         <TableCell>{sku.category}</TableCell>
//                         <TableCell className="">₹{sku.price.toLocaleString()}</TableCell>
//                         {/* <TableCell>
//                           <Badge variant={stockInfo.variant}>
//                             {stockInfo.status}
//                           </Badge>
//                         </TableCell> */}
//                         {/* <TableCell className="">
//                           {cartItem ? (
//                             <div className="flex items-center gap-3  space-x-1">
//                               <Button
//                                 variant="outline"
//                                 size="sm"
//                                 onClick={() => updateCartQuantity(sku.sku, cartItem.quantity - 1)}
//                               >
//                                 <Minus className="w-3 h-3" />
//                               </Button>
//                               <span className=" text-center text-sm">{cartItem.quantity}</span>
//                               <Button
//                                 variant="outline"
//                                 size="sm"
//                                 onClick={() => updateCartQuantity(sku.sku, cartItem.quantity + 1)}
//                               >
//                                 <Plus className="w-3 h-3" />
//                               </Button>
//                             </div>
//                           ) : (
//                             <Button
//                               variant="outline"
//                               size="sm"
//                               onClick={() => addToCart(sku)}
//                               disabled={sku.stock === 0}
//                             >
//                               <Plus className="w-4 h-4 mr-1" />
//                               Add
//                             </Button>
//                           )}
//                         </TableCell> */}
//                         <TableCell className="w-40 text-center">
//                           {cartItem ? (
//                             <div className="flex items-center justify-center gap-2">
//                               <Button
//                                 variant="outline"
//                                 size="sm"
//                                 onClick={() => updateCartQuantity(sku.sku, cartItem.quantity - 1)}
//                               >
//                                 <Minus className="w-3 h-3" />
//                               </Button>
//                               {/* <span className="w-6 text-center text-sm">{cartItem.quantity}</span> */}
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
//                             <div className="flex justify-center">
//                               <Button
//                                 variant="outline"
//                                 size="sm"
//                                 onClick={() => addToCart(sku)}
//                                 disabled={sku.stock === 0}
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
//             {filteredSKUs.length === 0 && (
//               <div className="text-center py-8">
//                 <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
//                 <p className="text-muted-foreground">
//                   {!dealerCategory || !subCategory
//                     ? 'Please select Product category and subcategory to view SKUs'
//                     : 'No SKUs found matching your search criteria'
//                   }
//                 </p>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       )}
//       {/* Order Summary and Submission */}
//       {/* TODO: */}
//       {cart.length > 0 && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Order Summary  <span className='text-red-200'>TODO: SKU wise summury</span> </CardTitle>
//             <CardDescription>Review your order before submission</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="space-y-2 max-h-40 overflow-y-auto">
//               {cart.map((item) => (
//                 <div key={item.sku} className="flex items-center justify-between p-2 border rounded">
//                   <div className="flex-1">
//                     <span className="font-medium text-sm">{item.name}</span>
//                     <div className="text-xs text-muted-foreground">{item.sku}</div>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => updateCartQuantity(item.sku, item.quantity - 1, item.volume)}
//                     >
//                       <Minus className="w-3 h-3" />
//                     </Button>
//                     {/* <span className="w-8 text-center text-sm">{item.quantity}</span> */}
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
//                       onClick={() => updateCartQuantity(item.sku, item.quantity + 1, item.volume)}
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
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 {/* <h4 className="font-medium mb-3">Order Details</h4> */}
//                 <div className="space-y-2 text-sm">
//                   {/* <div className="flex justify-between">
//                     <span>Product Category:</span>
//                     <span className="font-medium">{dealerCategory}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Product Subcategory:</span>
//                     <span className="font-medium">{subCategory}</span>
//                   </div> */}
//                   <div className="flex justify-between mt-2">
//                     <span>Total Items:</span>
//                     <span className="font-medium">{cartItems}</span>
//                   </div>
//                   <div className="flex justify-between mt-2">
//                     <span>Unique SKUs:</span>
//                     <span className="font-medium">{cart.length}</span>
//                   </div>
//                   <Separator />
//                   {/* <div className="flex justify-between">
//                     <span className="font-medium">Total Amount:</span>
//                     <span className="font-bold">₹{cartTotal.toLocaleString()}</span>
//                     <span className="font-bold">₹{totalvolume}</span>
//                   </div> */}
//                   <div className="flex justify-between">
//                     <span className="font-medium">Total Amount:</span>
//                     <span className="font-bold">₹{cartTotal.toLocaleString()}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="font-medium">Total Volume:</span>
//                     <span className="font-bold">{totalVolume.toFixed(3)} MT</span>
//                   </div>
//                 </div>
//               </div>

//               {/* <div>
//                 <label className="block text-sm font-medium mb-2">Order Notes (Optional)</label>
//                 <textarea
//                   className="w-full p-3 border rounded-md resize-none"
//                   rows={5}
//                   placeholder="Add any special instructions or notes for this order..."
//                   value={orderNotes}
//                   onChange={(e) => setOrderNotes(e.target.value)}
//                 />
//               </div> */}
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
//     </div>
//   );
// }



//Fetch Material with SAP API
// import { useState, useEffect, useMemo } from 'react';
// import { Link } from "react-router-dom";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
// import { Button } from './ui/button';
// import { Input } from './ui/input';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
// import { Badge } from './ui/badge';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
// import { Separator } from './ui/separator';
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
//   Package2
// } from 'lucide-react';
// import { Alert, AlertDescription, AlertTitle } from './ui/alert';
// import axios from 'axios';

// // API configuration
// const url = "http://182.74.4.110:1084/sap/opu/odata/sap/ZDMS_ORDER_REDESIGN_SRV/ProductsListSet?$filter=Kunnr eq '104464' and Werks eq '1101' and Vtweg eq 'O3' and Bukrs eq '1100'";
// const username = "dev01";
// const password = "Kriti@12";
// const config = {
//   method: "get",
//   url: url,
//   auth: {
//     username: username,
//     password: password,
//   },
//   headers: {
//     "Accept": "application/json",
//     "Content-Type": "application/json; charset=utf-8",
//   },
//   httpAgent: new (require("http").Agent)({ rejectUnauthorized: false }),
// };

// export function CreateOrder() {
//   const [dealerCategory, setDealerCategory] = useState('');
//   const [subCategory, setSubCategory] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [cart, setCart] = useState([]);
//   const [orderNotes, setOrderNotes] = useState('');
//   const [totalvolume, setTotalVolume] = useState(0);
//   const [skuData, setSkuData] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const DENSITY = 1;

//   // Fetch SKU data from API
//   useEffect(() => {
//     const fetchSkuData = async () => {
//       try {
//         setLoading(true);
//         const response = await axios(config);
//         const apiSkus = response.data.d.results;

//         // Transform API data to match skuData structure
//         const transformedData = apiSkus.reduce((acc, item) => {
//           const category = item.Category || 'UNKNOWN'; // Adjust field name based on API response
//           const subCategory = item.SubCategory || 'CP'; // Default to CP if not specified
//           const skuItem = {
//             sku: item.Matnr || item.sku || `SKU-${Math.random().toString(36).slice(2, 9)}`, // Fallback SKU
//             name: item.Maktx || item.name || 'Unknown Product',
//             price: parseFloat(item.Price) || 1000, // Fallback price
//             mrp: parseFloat(item.Mrp) || parseFloat(item.Price) * 1.1 || 1100, // Fallback MRP
//             stock: parseInt(item.Stock) || 100, // Fallback stock
//             category: category,
//             volume: parseFloat(item.Volume) || 0.001 // Fallback volume in KL
//           };

//           if (!acc[category]) {
//             acc[category] = {};
//           }
//           if (!acc[category][subCategory]) {
//             acc[category][subCategory] = [];
//           }
//           acc[category][subCategory].push(skuItem);
//           return acc;
//         }, {});

//         setSkuData(transformedData);
//         setLoading(false);
//       } catch (err) {
//         console.error('Error fetching SKU data:', err);
//         setError('Failed to load SKU data. Please try again later.');
//         setLoading(false);
//       }
//     };

//     fetchSkuData();
//   }, []);

//   // Get available SKUs based on selected category and subcategory
//   const availableSKUs = useMemo(() => {
//     if (!dealerCategory || !subCategory) return [];
//     return skuData[dealerCategory]?.[subCategory] || [];
//   }, [dealerCategory, subCategory, skuData]);

//   // Filter SKUs based on search term
//   const filteredSKUs = useMemo(() => {
//     if (!searchTerm) return availableSKUs;
//     return availableSKUs.filter(sku =>
//       sku.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       sku.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       sku.category.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   }, [availableSKUs, searchTerm]);

//   // Cart calculations
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

//   // Update totalvolume state
//   useEffect(() => {
//     setTotalVolume(totalVolume);
//   }, [totalVolume]);

//   const addToCart = (sku, quantity = 1) => {
//     setCart(prevCart => {
//       const existingItem = prevCart.find(item => item.sku === sku.sku);
//       if (existingItem) {
//         return prevCart.map(item =>
//           item.sku === sku.sku
//             ? {
//               ...item,
//               quantity: item.quantity + quantity,
//               total: (item.quantity + quantity) * item.price,
//               totalTons: (item.quantity + quantity) * sku.volume * DENSITY,
//               totalVolume: (item.quantity + quantity) * sku.volume
//             }
//             : item
//         );
//       } else {
//         return [...prevCart, {
//           sku: sku.sku,
//           name: sku.name,
//           price: sku.price,
//           mrp: sku.mrp,
//           quantity,
//           volume: sku.volume,
//           total: sku.price * quantity,
//           totalTons: sku.volume * quantity * DENSITY,
//           totalVolume: sku.volume * quantity
//         }];
//       }
//     });
//   };

//   const updateCartQuantity = (sku, newQuantity) => {
//     if (newQuantity <= 0) {
//       removeFromCart(sku);
//       return;
//     }
//     setCart(prevCart =>
//       prevCart.map(item =>
//         item.sku === sku
//           ? {
//             ...item,
//             quantity: newQuantity,
//             total: newQuantity * item.price,
//             totalTons: newQuantity * item.volume * DENSITY,
//             totalVolume: newQuantity * item.volume
//           }
//           : item
//       )
//     );
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

//     console.log('Order submitted:', {
//       dealerCategory,
//       subCategory,
//       items: cart,
//       total: cartTotal,
//       totalVolume,
//       notes: orderNotes,
//       timestamp: new Date().toISOString()
//     });

//     setCart([]);
//     setOrderNotes('');
//     setTotalVolume(0);
//     alert("Order submitted successfully!");
//   };

//   const getStockStatus = (stock) => {
//     if (stock > 100) return { status: 'In Stock', variant: 'default' };
//     if (stock > 50) return { status: 'Low Stock', variant: 'secondary' };
//     if (stock > 0) return { status: 'Very Low', variant: 'destructive' };
//     return { status: 'Out of Stock', variant: 'outline' };
//   };

//   return (
//     <div className="p-6 space-y-6">
//       {loading && (
//         <div className="text-center py-8">
//           <p className="text-muted-foreground">Loading SKU data...</p>
//         </div>
//       )}
//       {error && (
//         <Alert variant="destructive">
//           <AlertCircle className="h-4 w-4" />
//           <AlertTitle>Error</AlertTitle>
//           <AlertDescription>{error}</AlertDescription>
//         </Alert>
//       )}
//       {!loading && !error && (
//         <>
//           <div className="flex justify-between items-start">
//             <div>
//               <h1 className="text-3xl font-bold flex items-center">
//                 <ShoppingCart className="w-8 h-8 mr-3" />
//                 Contract Booking
//               </h1>
//               <p className="text-muted-foreground">Select your category and browse available SKUs</p>
//             </div>
//           </div>

//           {/* Category Selection */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center">
//                 <Tag className="w-5 h-5 mr-2" />
//                 Product Category & Subcategory
//               </CardTitle>
//               <CardDescription>Select your Product category and product subcategory</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-2">Product Category</label>
//                   <Select value={dealerCategory} onValueChange={(value) => {
//                     setDealerCategory(value);
//                     setSubCategory('');
//                   }}>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select Product category" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {Object.keys(skuData).map(category => (
//                         <SelectItem key={category} value={category}>{category}</SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-2">Product Subcategory</label>
//                   <Select value={subCategory} onValueChange={setSubCategory} disabled={!dealerCategory}>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select subcategory" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {dealerCategory && Object.keys(skuData[dealerCategory] || {}).map(subCat => (
//                         <SelectItem key={subCat} value={subCat}>{subCat}</SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
//                 <div>
//                   <label className="block text-sm font-medium mb-2">Location</label>
//                   <Select>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select Location" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="Dewas">Dewas Plant</SelectItem>
//                       <SelectItem value="Jabalpur">Depot</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 {dealerCategory === "SBO" && (
//                   <div>
//                     <label className="block text-sm font-medium mb-2">Type</label>
//                     <Select>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select Type" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="Ready">Ready</SelectItem>
//                         <SelectItem value="Forward">Forward</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 )}
//               </div>
//             </CardContent>
//           </Card>

//           {/* Shopping Cart Summary */}
//           {cart.length > 0 && (
//             <Card>
//               <CardHeader>
//                 <div className="flex justify-between items-center">
//                   <CardTitle className="flex items-center">
//                     <ShoppingCart className="w-5 h-5 mr-2" />
//                     Shopping Cart ({cartItems} items)
//                   </CardTitle>
//                   <div className="flex items-center space-x-2">
//                     <span className="font-medium">Total: ₹{cartTotal.toLocaleString()}</span>
//                     <Button variant="outline" size="sm" onClick={clearCart}>
//                       Clear Cart
//                     </Button>
//                   </div>
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-2 max-h-40 overflow-y-auto">
//                   {cart.map((item) => (
//                     <div key={item.sku} className="flex items-center justify-between p-2 border rounded">
//                       <div className="flex-1">
//                         <span className="font-medium text-sm">{item.name}</span>
//                         <div className="text-xs text-muted-foreground">{item.sku}</div>
//                       </div>
//                       <div className="flex items-center space-x-2">
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => updateCartQuantity(item.sku, item.quantity - 1)}
//                         >
//                           <Minus className="w-3 h-3" />
//                         </Button>
//                         <Input
//                           type="number"
//                           value={item.quantity}
//                           min={0}
//                           className="w-20 text-center text-sm"
//                           onChange={(e) => updateCartQuantity(item.sku, Number(e.target.value))}
//                         />
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => updateCartQuantity(item.sku, item.quantity + 1)}
//                         >
//                           <Plus className="w-3 h-3" />
//                         </Button>
//                         <span className="w-20 text-right text-sm">₹{item.total.toLocaleString()}</span>
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           onClick={() => removeFromCart(item.sku)}
//                         >
//                           <Trash2 className="w-3 h-3" />
//                         </Button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           )}

//           {/* SKU Listing */}
//           {dealerCategory && subCategory && (
//             <Card>
//               <CardHeader>
//                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
//                   <div>
//                     <CardTitle className="flex items-center">
//                       <Package className="w-5 h-5 mr-2" />
//                       Available SKUs - {dealerCategory} / {subCategory}
//                     </CardTitle>
//                     <CardDescription>
//                       Browse and add products to your order
//                     </CardDescription>
//                   </div>
//                   <div className="relative">
//                     <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//                     <Input
//                       placeholder="Search SKUs..."
//                       className="pl-10 w-80"
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                     />
//                   </div>
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <div className="border rounded-lg overflow-x-auto">
//                   <Table size="2">
//                     <TableHeader>
//                       <TableRow>
//                         <TableHead>SKU Code</TableHead>
//                         <TableHead>Product Name</TableHead>
//                         <TableHead>Category</TableHead>
//                         <TableHead>Price (₹)</TableHead>
//                         <TableHead>Quantity</TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {filteredSKUs.map((sku) => {
//                         const stockInfo = getStockStatus(sku.stock);
//                         const cartItem = cart.find(item => item.sku === sku.sku);

//                         return (
//                           <TableRow key={sku.sku}>
//                             <TableCell className="font-medium">{sku.sku}</TableCell>
//                             <TableCell>
//                               <div>
//                                 <div className="font-medium">{sku.name}</div>
//                               </div>
//                             </TableCell>
//                             <TableCell>{sku.category}</TableCell>
//                             <TableCell>₹{sku.price.toLocaleString()}</TableCell>
//                             <TableCell className="w-40 text-center">
//                               {cartItem ? (
//                                 <div className="flex items-center justify-center gap-2">
//                                   <Button
//                                     variant="outline"
//                                     size="sm"
//                                     onClick={() => updateCartQuantity(sku.sku, cartItem.quantity - 1)}
//                                   >
//                                     <Minus className="w-3 h-3" />
//                                   </Button>
//                                   <Input
//                                     type="number"
//                                     value={cartItem.quantity}
//                                     min={1}
//                                     className="w-16 text-center text-sm"
//                                     onChange={(e) => updateCartQuantity(sku.sku, Number(e.target.value))}
//                                   />
//                                   <Button
//                                     variant="outline"
//                                     size="sm"
//                                     onClick={() => updateCartQuantity(sku.sku, cartItem.quantity + 1)}
//                                   >
//                                     <Plus className="w-3 h-3" />
//                                   </Button>
//                                 </div>
//                               ) : (
//                                 <div className="flex justify-center">
//                                   <Button
//                                     variant="outline"
//                                     size="sm"
//                                     onClick={() => addToCart(sku)}
//                                     disabled={sku.stock === 0}
//                                   >
//                                     <Plus className="w-4 h-4 mr-1" />
//                                     Add
//                                   </Button>
//                                 </div>
//                               )}
//                             </TableCell>
//                           </TableRow>
//                         );
//                       })}
//                     </TableBody>
//                   </Table>
//                 </div>
//                 {filteredSKUs.length === 0 && (
//                   <div className="text-center py-8">
//                     <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
//                     <p className="text-muted-foreground">
//                       {!dealerCategory || !subCategory
//                         ? 'Please select Product category and subcategory to view SKUs'
//                         : 'No SKUs found matching your search criteria'
//                       }
//                     </p>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           )}

//           {/* Order Summary and Submission */}
//           {cart.length > 0 && (
//             <Card>
//               <CardHeader>
//                 <CardTitle>Order Summary <span className='text-red-200'>TODO: SKU wise summary</span></CardTitle>
//                 <CardDescription>Review your order before submission</CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="space-y-2 max-h-40 overflow-y-auto">
//                   {cart.map((item) => (
//                     <div key={item.sku} className="flex items-center justify-between p-2 border rounded">
//                       <div className="flex-1">
//                         <span className="font-medium text-sm">{item.name}</span>
//                         <div className="text-xs text-muted-foreground">{item.sku}</div>
//                       </div>
//                       <div className="flex items-center space-x-2">
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => updateCartQuantity(item.sku, item.quantity - 1)}
//                         >
//                           <Minus className="w-3 h-3" />
//                         </Button>
//                         <Input
//                           type="number"
//                           value={item.quantity}
//                           min={0}
//                           className="w-20 text-center text-sm"
//                           onChange={(e) => updateCartQuantity(item.sku, Number(e.target.value))}
//                         />
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => updateCartQuantity(item.sku, item.quantity + 1)}
//                         >
//                           <Plus className="w-3 h-3" />
//                         </Button>
//                         <span className="w-20 text-right text-sm">₹{item.total.toLocaleString()}</span>
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           onClick={() => removeFromCart(item.sku)}
//                         >
//                           <Trash2 className="w-3 h-3" />
//                         </Button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <div className="space-y-2 text-sm">
//                       <div className="flex justify-between mt-2">
//                         <span>Total Items:</span>
//                         <span className="font-medium">{cartItems}</span>
//                       </div>
//                       <div className="flex justify-between mt-2">
//                         <span>Unique SKUs:</span>
//                         <span className="font-medium">{cart.length}</span>
//                       </div>
//                       <Separator />
//                       <div className="flex justify-between">
//                         <span className="font-medium">Total Amount:</span>
//                         <span className="font-bold">₹{cartTotal.toLocaleString()}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="font-medium">Total Volume:</span>
//                         <span className="font-bold">{totalVolume.toFixed(3)} MT</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="flex lg:justify-end lg:gap-2 space-x-2">
//                   <Button variant="outline" onClick={clearCart}>
//                     Clear Order
//                   </Button>
//                   <Button onClick={submitOrder} className="min-w-32">
//                     <CheckCircle className="w-4 h-4 mr-2" />
//                     Submit Order
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           )}
//         </>
//       )}
//     </div>
//   );
// }



// import { useState, useEffect, useMemo } from 'react';
// import { Link } from "react-router-dom";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
// import { Button } from './ui/button';
// import { Input } from './ui/input';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
// import { Badge } from './ui/badge';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
// import { Separator } from './ui/separator';
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
//   Package2
// } from 'lucide-react';
// import { Alert, AlertDescription, AlertTitle } from './ui/alert';
// import axios from 'axios';

// // API configuration
// const url = "/api/sap/opu/odata/sap/ZDMS_ORDER_REDESIGN_SRV/ProductsListSet?$filter=Kunnr eq '104464' and Werks eq '1101' and Vtweg eq 'O3' and Bukrs eq '1100'";
// const username = "dev01";
// const password = "Kriti@12";
// const config = {
//   method: "get",
//   url: url,
//   auth: {
//     username: username,
//     password: password,
//   },
//   headers: {
//     "Accept": "application/json",
//     "Content-Type": "application/json; charset=utf-8",
//   },
// };

// export function CreateOrder() {
//   const [dealerCategory, setDealerCategory] = useState('');
//   const [subCategory, setSubCategory] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [cart, setCart] = useState([]);
//   const [orderNotes, setOrderNotes] = useState('');
//   const [totalvolume, setTotalVolume] = useState(0);
//   const [skuData, setSkuData] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const DENSITY = 1;

//   // Fetch SKU data from API via Vite proxy
//   useEffect(() => {
//     const fetchSkuData = async () => {
//       try {
//         setLoading(true);
//         const response = await axios(config);
//         const apiSkus = response.data.d.results;

//         // Transform API data to match skuData structure
//         const transformedData = apiSkus.reduce((acc, item) => {
//           const category = item.Spart === 'S1' ? 'SFO' : 'UNKNOWN'; // Map Spart to category
//           const subCategory = item.Mvgr1 === 'SUN' ? 'CP' : 'BP'; // Map Mvgr1 to subCategory
//           const skuItem = {
//             sku: item.Matnr || `SKU-${Math.random().toString(36).slice(2, 9)}`, // Fallback SKU
//             name: item.Maktx || 'Unknown Product',
//             unit: item.Meins || 'No unit Found',
//             price: 1000, // Fallback: Replace with actual price if available
//             mrp: 1100, // Fallback: Replace with actual MRP if available
//             stock: 100, // Fallback: Replace with actual stock if available
//             category: category,
//             volume: parseFloat(item.Ntgew) / 1000 || 0.001 // Convert KG to MT, fallback to 0.001
//           };

//           if (!acc[category]) {
//             acc[category] = {};
//           }
//           if (!acc[category][subCategory]) {
//             acc[category][subCategory] = [];
//           }
//           acc[category][subCategory].push(skuItem);
//           return acc;
//         }, {});

//         setSkuData(transformedData);
//         setLoading(false);
//       } catch (err) {
//         console.error('Error fetching SKU data:', err);
//         let errorMessage = 'Failed to load SKU data. Please try again later.';
//         if (err.code === 'ERR_NETWORK') {
//           errorMessage = 'Network error: Unable to connect to the API. Please check if the API server is accessible.';
//         } else if (err.response?.status === 401) {
//           errorMessage = 'Authentication failed: Invalid username or password.';
//         } else if (err.response?.status) {
//           errorMessage = `API error: ${err.response.status} - ${err.response.statusText}`;
//         }
//         setError(errorMessage);
//         setLoading(false);
//       }
//     };

//     fetchSkuData();
//   }, []);

//   // Get available SKUs based on selected category and subcategory
//   const availableSKUs = useMemo(() => {
//     if (!dealerCategory || !subCategory) return [];
//     return skuData[dealerCategory]?.[subCategory] || [];
//   }, [dealerCategory, subCategory, skuData]);

//   // Filter SKUs based on search term
//   const filteredSKUs = useMemo(() => {
//     if (!searchTerm) return availableSKUs;
//     return availableSKUs.filter(sku =>
//       sku.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       sku.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       sku.category.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   }, [availableSKUs, searchTerm]);

//   // Cart calculations
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

//   // Update totalvolume state
//   useEffect(() => {
//     setTotalVolume(totalVolume);
//   }, [totalVolume]);

//   const addToCart = (sku, quantity = 1) => {
//     setCart(prevCart => {
//       const existingItem = prevCart.find(item => item.sku === sku.sku);
//       if (existingItem) {
//         return prevCart.map(item =>
//           item.sku === sku.sku
//             ? {
//               ...item,
//               quantity: item.quantity + quantity,
//               total: (item.quantity + quantity) * item.price,
//               totalTons: (item.quantity + quantity) * sku.volume * DENSITY,
//               totalVolume: (item.quantity + quantity) * sku.volume
//             }
//             : item
//         );
//       } else {
//         return [...prevCart, {
//           sku: sku.sku,
//           name: sku.name,
//           price: sku.price,
//           mrp: sku.mrp,
//           quantity,
//           volume: sku.volume,
//           total: sku.price * quantity,
//           totalTons: sku.volume * quantity * DENSITY,
//           totalVolume: sku.volume * quantity
//         }];
//       }
//     });
//   };

//   const updateCartQuantity = (sku, newQuantity) => {
//     if (newQuantity <= 0) {
//       removeFromCart(sku);
//       return;
//     }
//     setCart(prevCart =>
//       prevCart.map(item =>
//         item.sku === sku
//           ? {
//             ...item,
//             quantity: newQuantity,
//             total: newQuantity * item.price,
//             totalTons: newQuantity * item.volume * DENSITY,
//             totalVolume: newQuantity * item.volume
//           }
//           : item
//       )
//     );
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

//     console.log('Order submitted:', {
//       dealerCategory,
//       subCategory,
//       items: cart,
//       total: cartTotal,
//       totalVolume,
//       notes: orderNotes,
//       timestamp: new Date().toISOString()
//     });

//     setCart([]);
//     setOrderNotes('');
//     setTotalVolume(0);
//     alert("Order submitted successfully!");
//   };

//   const getStockStatus = (stock) => {
//     if (stock > 100) return { status: 'In Stock', variant: 'default' };
//     if (stock > 50) return { status: 'Low Stock', variant: 'secondary' };
//     if (stock > 0) return { status: 'Very Low', variant: 'destructive' };
//     return { status: 'Out of Stock', variant: 'outline' };
//   };

//   return (
//     <div className="p-6 space-y-6">
//       {loading && (
//         <div className="text-center py-8">
//           <p className="text-muted-foreground">Loading SKU data...</p>
//         </div>
//       )}
//       {error && (
//         <Alert variant="destructive">
//           <AlertCircle className="h-4 w-4" />
//           <AlertTitle>Error</AlertTitle>
//           <AlertDescription>{error}</AlertDescription>
//         </Alert>
//       )}
//       {!loading && !error && (
//         <>
//           <div className="flex justify-between items-start">
//             <div>
//               <h1 className="text-3xl font-bold flex items-center">
//                 <ShoppingCart className="w-8 h-8 mr-3" />
//                 Contract Booking
//               </h1>
//               <p className="text-muted-foreground">Select your category and browse available SKUs</p>
//             </div>
//           </div>

//           {/* Category Selection */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center">
//                 <Tag className="w-5 h-5 mr-2" />
//                 Product Category & Subcategory
//               </CardTitle>
//               <CardDescription>Select your Product category and product subcategory</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-2">Product Category</label>
//                   <Select value={dealerCategory} onValueChange={(value) => {
//                     setDealerCategory(value);
//                     setSubCategory('');
//                   }}>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select Product category" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {Object.keys(skuData).map(category => (
//                         <SelectItem key={category} value={category}>{category}</SelectItem>
//                       ))}
//                       {/* <SelectItem>SBO</SelectItem>
//                       <SelectItem>SFO</SelectItem>
//                       <SelectItem>MUS</SelectItem>
//                       <SelectItem>SBO</SelectItem> */}
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-2">Product Subcategory</label>
//                   <Select value={subCategory} onValueChange={setSubCategory} >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select subcategory" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {dealerCategory && Object.keys(skuData[dealerCategory] || {}).map(subCat => (
//                         <SelectItem key={subCat} value={subCat}>{subCat}</SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
//                 <div>
//                   <label className="block text-sm font-medium mb-2">Location</label>
//                   <Select>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select Location" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="Dewas">Dewas Plant</SelectItem>
//                       <SelectItem value="Jabalpur">Depot</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 {dealerCategory === "02" && (
//                   <div>
//                     <label className="block text-sm font-medium mb-2">Type</label>
//                     <Select>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select Type" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="Ready">Ready</SelectItem>
//                         <SelectItem value="Forward">Forward</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 )}
//               </div>
//             </CardContent>
//           </Card>

//           {/* Shopping Cart Summary */}
//           {cart.length > 0 && (
//             <Card>
//               <CardHeader>
//                 <div className="flex justify-between items-center">
//                   <CardTitle className="flex items-center">
//                     <ShoppingCart className="w-5 h-5 mr-2" />
//                     Shopping Cart ({cartItems} items)
//                   </CardTitle>
//                   <div className="flex items-center space-x-2">
//                     <span className="font-medium">Total: ₹{cartTotal.toLocaleString()}</span>
//                     <Button variant="outline" size="sm" onClick={clearCart}>
//                       Clear Cart
//                     </Button>
//                   </div>
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-2 max-h-40 overflow-y-auto">
//                   {cart.map((item) => (
//                     <div key={item.sku} className="flex items-center justify-between p-2 border rounded">
//                       <div className="flex-1">
//                         <span className="font-medium text-sm">{item.name}</span>
//                         <div className="text-xs text-muted-foreground">{item.sku}</div>
//                       </div>
//                       <div className="flex items-center space-x-2">
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => updateCartQuantity(item.sku, item.quantity - 1)}
//                         >
//                           <Minus className="w-3 h-3" />
//                         </Button>
//                         <Input
//                           type="number"
//                           value={item.quantity}
//                           min={0}
//                           className="w-20 text-center text-sm"
//                           onChange={(e) => updateCartQuantity(item.sku, Number(e.target.value))}
//                         />
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => updateCartQuantity(item.sku, item.quantity + 1)}
//                         >
//                           <Plus className="w-3 h-3" />
//                         </Button>
//                         <span className="w-20 text-right text-sm">₹{item.total.toLocaleString()}</span>
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           onClick={() => removeFromCart(item.sku)}
//                         >
//                           <Trash2 className="w-3 h-3" />
//                         </Button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           )}

//           {/* SKU Listing */}
//           {dealerCategory && subCategory && (
//             <Card>
//               <CardHeader>
//                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
//                   <div>
//                     <CardTitle className="flex items-center">
//                       <Package className="w-5 h-5 mr-2" />
//                       Available SKUs - {dealerCategory} / {subCategory}
//                     </CardTitle>
//                     <CardDescription>
//                       Browse and add products to your order
//                     </CardDescription>
//                   </div>
//                   <div className="relative">
//                     <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//                     <Input
//                       placeholder="Search SKUs..."
//                       className="pl-10 w-80"
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                     />
//                   </div>
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <div className="border rounded-lg overflow-x-auto">
//                   <Table size="2">
//                     <TableHeader>
//                       <TableRow>
//                         <TableHead>SKU Code</TableHead>
//                         <TableHead>Product Name</TableHead>
//                         {/* <TableHead>Category</TableHead> */}
//                         <TableHead>Unit</TableHead>
//                         <TableHead>Price (₹)</TableHead>
//                         <TableHead>Quantity</TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {filteredSKUs.map((sku) => {
//                         const stockInfo = getStockStatus(sku.stock);
//                         const cartItem = cart.find(item => item.sku === sku.sku);

//                         return (
//                           <TableRow key={sku.sku}>
//                             <TableCell className="font-medium">{sku.sku}</TableCell>
//                             <TableCell>
//                               <div>
//                                 <div className="font-medium">{sku.name}</div>
//                               </div>
//                             </TableCell>

//                             {/* <TableCell>{sku.category}</TableCell> */}
//                             <TableCell>{sku.unit}</TableCell>
//                             <TableCell>₹{sku.price.toLocaleString()}</TableCell>
//                             <TableCell className="w-40 text-center">
//                               {cartItem ? (
//                                 <div className="flex items-center justify-center gap-2">
//                                   <Button
//                                     variant="outline"
//                                     size="sm"
//                                     onClick={() => updateCartQuantity(sku.sku, cartItem.quantity - 1)}
//                                   >
//                                     <Minus className="w-3 h-3" />
//                                   </Button>
//                                   <Input
//                                     type="number"
//                                     value={cartItem.quantity}
//                                     min={1}
//                                     className="w-16 text-center text-sm"
//                                     onChange={(e) => updateCartQuantity(sku.sku, Number(e.target.value))}
//                                   />
//                                   <Button
//                                     variant="outline"
//                                     size="sm"
//                                     onClick={() => updateCartQuantity(sku.sku, cartItem.quantity + 1)}
//                                   >
//                                     <Plus className="w-3 h-3" />
//                                   </Button>
//                                 </div>
//                               ) : (
//                                 <div className="flex justify-center">
//                                   <Button
//                                     variant="outline"
//                                     size="sm"
//                                     onClick={() => addToCart(sku)}
//                                     disabled={sku.stock === 0}
//                                   >
//                                     <Plus className="w-4 h-4 mr-1" />
//                                     Add
//                                   </Button>
//                                 </div>
//                               )}
//                             </TableCell>
//                           </TableRow>
//                         );
//                       })}
//                     </TableBody>
//                   </Table>
//                 </div>
//                 {filteredSKUs.length === 0 && (
//                   <div className="text-center py-8">
//                     <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
//                     <p className="text-muted-foreground">
//                       {!dealerCategory || !subCategory
//                         ? 'Please select Product category and subcategory to view SKUs'
//                         : 'No SKUs found matching your search criteria'
//                       }
//                     </p>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           )}

//           {/* Order Summary and Submission */}
//           {cart.length > 0 && (
//             <Card>
//               <CardHeader>
//                 <CardTitle>Order Summary <span className='text-red-200'>TODO: SKU wise summary</span></CardTitle>
//                 <CardDescription>Review your order before submission</CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="space-y-2 max-h-40 overflow-y-auto">
//                   {cart.map((item) => (
//                     <div key={item.sku} className="flex items-center justify-between p-2 border rounded">
//                       <div className="flex-1">
//                         <span className="font-medium text-sm">{item.name}</span>
//                         <div className="text-xs text-muted-foreground">{item.sku}</div>
//                       </div>
//                       <div className="flex items-center space-x-2">
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => updateCartQuantity(item.sku, item.quantity - 1)}
//                         >
//                           <Minus className="w-3 h-3" />
//                         </Button>
//                         <Input
//                           type="number"
//                           value={item.quantity}
//                           min={0}
//                           className="w-20 text-center text-sm"
//                           onChange={(e) => updateCartQuantity(item.sku, Number(e.target.value))}
//                         />
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => updateCartQuantity(item.sku, item.quantity + 1)}
//                         >
//                           <Plus className="w-3 h-3" />
//                         </Button>
//                         <span className="w-20 text-right text-sm">₹{item.total.toLocaleString()}</span>
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           onClick={() => removeFromCart(item.sku)}
//                         >
//                           <Trash2 className="w-3 h-3" />
//                         </Button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <div className="space-y-2 text-sm">
//                       <div className="flex justify-between mt-2">
//                         <span>Total Items:</span>
//                         <span className="font-medium">{cartItems}</span>
//                       </div>
//                       <div className="flex justify-between mt-2">
//                         <span>Unique SKUs:</span>
//                         <span className="font-medium">{cart.length}</span>
//                       </div>
//                       <Separator />
//                       <div className="flex justify-between">
//                         <span className="font-medium">Total Amount:</span>
//                         <span className="font-bold">₹{cartTotal.toLocaleString()}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="font-medium">Total Volume:</span>
//                         <span className="font-bold">{totalVolume.toFixed(3)} MT</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="flex lg:justify-end lg:gap-2 space-x-2">
//                   <Button variant="outline" onClick={clearCart}>
//                     Clear Order
//                   </Button>
//                   <Button onClick={submitOrder} className="min-w-32">
//                     <CheckCircle className="w-4 h-4 mr-2" />
//                     Submit Order
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           )}
//         </>
//       )}
//     </div>
//   );
// }





import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Separator } from './ui/separator';
import {
  ShoppingCart, Plus, Minus, Trash2, Search, Filter, Package, Tag, IndianRupee, CheckCircle, AlertCircle, Package2
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import axios from 'axios';
import InsertSalesOrder from '../lib/InsertSalesOrder';
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
} from "../components/ui/alert-dialog"

import { Spinner } from '../components/ui/spinner'

// Category mapping: Spart code to user-friendly name
const categoryMapping = {
  'S1': 'SFO',
  '02': 'SBO',
  '01': 'Bari',
  'MS': 'KGMO',
  'GN': 'GNO'
};
async function fetchSAPData(apiUrl) {
  try {
    const response = await axios.get(apiUrl, {
      auth: {
        username: 'dev01',
        password: 'Kriti@12',
      },
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
    return response.data.d.results;
  } catch (err) {
    let errorMessage = 'Failed to fetch SAP data. Please try again later.';
    if (err.code === 'ERR_NETWORK') {
      errorMessage = 'Network error: Unable to connect to the API.';
    } else if (err.response?.status === 401) {
      errorMessage = 'Authentication failed: Invalid username or password.';
    } else if (err.response?.status) {
      errorMessage = `API error: ${err.response.status} - ${err.response.statusText}`;
    }
    throw new Error(errorMessage);
  }
}

export function CreateOrder() {
  const [dealerCategory, setDealerCategory] = useState('');
  const [SBOtype, setSBOType] = useState('Ready')
  const storedDealer = JSON.parse(localStorage.getItem('dealerData'));
  const [subCategory, setSubCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [orderNotes, setOrderNotes] = useState('');
  const [skuData, setSkuData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [skuWithPrice, setSkuWithPrice] = useState({})
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState({
    title: "",
    message: "",
    cancelLabel: "",
    continueLabel: "",
  });
  const navigate = useNavigate();
  const DENSITY = 1;
  const url = `/api/sap/opu/odata/sap/ZDMS_ORDER_REDESIGN_SRV/ProductsListSet?$filter=Kunnr eq '${storedDealer.UserName}' and Werks eq '1101' and Vtweg eq 'O3'and Bukrs eq '1100'`;
  const fetchMaterialURL = 'http://udaan.kritinutrients.com/dealer/getMaterial'
  const username = "dev01";
  const password = "Kriti@12";
  const config = {
    method: "get",
    url: fetchMaterialURL,
  };

  if (!storedDealer) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg font-semibold text-gray-600">Redirecting to Login...</p>
      </div>
    );
  }
  //fetch sku from Database
  useEffect(() => {
    const fetchSkuData = async () => {
      try {
        setLoading(true);
        const response = await axios(config);
        const apiSkus = response.data.data;
        console.log(apiSkus);
        // Transform API data to match skuData structure, grouped by Spart
        const skuWithTrue = apiSkus.filter((item => item.AcceptBulkOrder == 'true'))
        console.log("sku With True", skuWithTrue);
        setSkuData(skuWithTrue);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching SKU data:', err);
        let errorMessage = 'Failed to load SKU data. Please try again later.';
        if (err.code === 'ERR_NETWORK') {
          errorMessage = 'Network error: Unable to connect to the API.';
        } else if (err.response?.status === 401) {
          errorMessage = 'Authentication failed: Invalid username or password.';
        } else if (err.response?.status) {
          errorMessage = `API error: ${err.response.status} - ${err.response.statusText}`;
        }
        setError(errorMessage);
        setLoading(false);
      }
    };
    fetchSkuData();
  }, []);
  // const getPrice = async (sku) => {
  //   try {
  //     let priceList = '';
  //     if (dealerCategory == 'SBO') {
  //       if (SBOtype == 'Forward') {
  //         priceList = '04'
  //       } else {
  //         priceList = '03'
  //       }
  //     }
  //     else {
  //       priceList = '08'
  //     }
  //     const priceURL = `/api/sap/opu/odata/sap/ZSD_PRICING_SALES_SRV/zprice_customerSet?$filter=ZcustNo eq '${storedDealer.UserName}' and ZdistChn eq 'O3' and ZdocType eq 'Z02' and ZPlant eq '${storedDealer.Location}' and   ZPriceList eq '${priceList}' and Material eq '${sku}'`;
  //     console.log("get Price SKU", sku);
  //     console.log("URL Price", priceURL);
  //     const priceData = await fetchSAPData(priceURL);
  //     console.log("Pricedata", priceData);
  //     const matchingRecord = priceData.find(record => record.Material === sku);
  //     if (matchingRecord) {
  //       const priceInfo = {
  //         BasicPrice: parseFloat(matchingRecord.BasicPrice) || 0,
  //         FinalBP: parseFloat(matchingRecord.FinalBP) || 0,
  //         TaxValue: parseFloat(matchingRecord.TaxValue) || 0,
  //         BaseUnit: matchingRecord.BaseUnit || "",
  //         BasicPrice: parseFloat(matchingRecord.BasicPrice) || 0,
  //         CONVERTUNITVALUE: parseFloat(matchingRecord.CONVERTUNITVALUE) || 0,
  //         FinalBP: parseFloat(matchingRecord.FinalBP) || 0,
  //         FinalMP: parseFloat(matchingRecord.FinalMP) || 0,
  //         MatDescription: matchingRecord.MatDescription || "",
  //         MatGrpDesc: matchingRecord.MatGrpDesc || "",
  //         MatGrpDesc2: matchingRecord.MatGrpDesc2 || "",
  //         MatPrice: parseFloat(matchingRecord.MatPrice) || 0,
  //         Material: matchingRecord.Material || "",
  //         MaterialDesc: matchingRecord.MaterialDesc || "",
  //         NetValue: parseFloat(matchingRecord.NetValue) || 0,
  //         Quantity: parseFloat(matchingRecord.Quantity) || 0,
  //         Tax: parseFloat(matchingRecord.Tax) || 0,
  //         TaxValue: parseFloat(matchingRecord.TaxValue) || 0,
  //         UMREN: parseFloat(matchingRecord.UMREN) || 0,
  //         UMREZ: parseFloat(matchingRecord.UMREZ) || 0,
  //         ZPlant: matchingRecord.ZPlant || "",
  //         ZPriceGroup: matchingRecord.ZPriceGroup || "",
  //         ZPriceList: matchingRecord.ZPriceList || "",
  //         ZcustNo: matchingRecord.ZcustNo || "",
  //         ZdistChn: matchingRecord.ZdistChn || "",
  //         Zdivision: matchingRecord.Zdivision || "",
  //         ZdocType: matchingRecord.ZdocType || ""
  //       };
  //       console.log("Price Infor", priceInfo);

  //       // Store price for that specific SKU
  //       setSkuWithPrice(prev => ({
  //         ...prev,
  //         [sku.Code]: priceInfo
  //       }));
  //       return priceInfo;
  //     } else {
  //       console.warn(`No price found for ${sku}`);
  //       return { BasicPrice: 0, FinalBP: 0, TaxValue: 0 };
  //     }
  //   } catch (error) {
  //     console.error("Error fetching price:", error);
  //     return { BasicPrice: 0, FinalBP: 0, TaxValue: 0 };
  //   }
  // };
  const filteredSKUs = Array.isArray(skuData)
    ? skuData.filter((item) => {
      const primaryMatch = dealerCategory
        ? item.Primary_category?.trim() === dealerCategory
        : true;
      const secondaryMatch = subCategory
        ? item.Secondary_Category?.trim() === subCategory
        : true;
      return primaryMatch && secondaryMatch;
    })
    : [];

  // Cart calculations
  const cartTotal = useMemo(() =>
    cart.reduce((sum, item) => sum + item.total, 0),
    [cart]
  );

  const cartItems = useMemo(() =>
    cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );
  const totalVolume = useMemo(() =>
    cart.reduce((sum, item) => sum + ((item.totalVolume) || 0), 0),
    [cart]
  );


  const handleContinue = () => {
    setCart([]); // clear old category items
    setShowAlert(false);
  };

  //TODO:Working with get rate From SAP
  // const addToCart = async (sku, quantity = 1) => {
  //   try {
  //     console.log("Add to cart SKU", sku);
  //     setError(null);
  //     setLoading(true);
  //     const priceInfo = skuWithPrice[sku.Code] || await getPrice(sku.Code);

  //     // Get category of the new SKU being added
  //     const newCategory = sku.Primary_category?.trim();

  //     setCart(prevCart => {
  //       // Get all existing categories in cart
  //       const existingCategories = [...new Set(prevCart.map(item => item.Primary_category?.trim()))];

  //       // ✅ If cart is not empty and existing category doesn’t match new one
  //       if (existingCategories.length > 0 && !existingCategories.includes(newCategory)) {
  //         setAlertMessage(
  //           `❌ You can only place orders for one category at a time.\n\nRemove ${existingCategories.join(
  //             ", "
  //           )} items before adding ${newCategory} items.`
  //         );
  //         setShowAlert(true);
  //         return prevCart; // stop adding new item
  //       }

  //       const existingItem = prevCart.find(item => item.sku === sku.Code);
  //       const totalPrice = ((sku.Net_Weight * priceInfo.BasicPrice) + priceInfo.MatPrice) * quantity;
  //       console.log("Total Price", totalPrice);
  //       if (existingItem) {
  //         // Update existing quantity

  //         return prevCart.map(item =>
  //           item.sku === sku.Code
  //             ? {
  //               ...item, quantity: item.quantity + quantity, total: parseFloat(totalPrice + totalPrice), totalVolume: parseFloat(item.Net_Weight + item.Net_Weight), totalTons: parseFloat((item.Net_Weight / 1000) + (item.Net_Weight / 1000))
  //             }
  //             : item
  //         );
  //       } else {
  //         // Add new item
  //         return [
  //           ...prevCart,
  //           {
  //             sku: sku.Code,
  //             name: sku.Name,
  //             quantity,
  //             price: ((sku.Net_Weight * priceInfo.BasicPrice) + priceInfo.MatPrice),
  //             total: totalPrice,
  //             unit: sku.SAP_Unit,
  //             Primary_category: newCategory, // store category in cart
  //             totalVolume: sku.Net_Weight * quantity,
  //             totalTons: (sku.Net_Weight / 1000) * quantity

  //           },
  //         ];
  //       }
  //     });
  //     console.log("cart", cart);
  //   } catch (err) {
  //     console.error("Error fetching price:", err);
  //     setError("⚠️ Failed to add item to cart. Please try again.");
  //     setTimeout(() => setError(null), 1000);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const addToCart = async (sku, quantity = 1) => {
  //   try {
  //     setError(null);
  //     setLoading(true);
  //     console.log(sku);
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
  //           continueLabel: "OK",
  //         });
  //         setShowAlert(true);
  //         return prevCart;
  //       }

  //       const existingItem = prevCart.find((item) => item.sku === sku.Code);
  //       if (SBOtype==='forward') {
  //         const totalPrice = (sku.Dewas_forward_price) * quantity;
  //       } else {
  //         const totalPrice = (sku.Dewas_ready_price) * quantity;
  //       }
  //       // Compute the new total tons if this item is added
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
  //             totalTons: (sku.Net_Weight / 1000) * quantity,
  //           },
  //         ];
  //       }
  //     });
  //   } catch (err) {
  //     console.error("Error fetching price:", err);
  //     setError("⚠️ Failed to add item to cart. Please try again.");
  //     setTimeout(() => setError(null), 1000);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const addToCart = async (sku, quantity = 1) => {
    try {
      setError(null);
      setLoading(true);
      console.log(SBOtype);
      const newCategory = sku.Primary_category?.trim();
      setCart((prevCart) => {
        // 🧩 Category Restriction
        const existingCategories = [
          ...new Set(prevCart.map((item) => item.Primary_category?.trim())),
        ];
        if (
          existingCategories.length > 0 &&
          !existingCategories.includes(newCategory)
        ) {
          setAlertMessage({
            title: "Category Restriction",
            message: `❌ You can only place orders for one category at a time.\n\nRemove ${existingCategories.join(
              ", "
            )} items before adding ${newCategory} items.`,
            cancelLabel: "Cancel",
            continueLabel: "Clear Cart",

          });
          setShowAlert(true);
          return prevCart;
        }
        // 🟢 Find existing item
        const existingItem = prevCart.find((item) => item.sku === sku.Code);

        // 🧩 FIX: Declare totalPrice outside if/else
        let totalPrice = 0;
        let itemPrice = 0;

        // 🧠 Dynamic price logic based on SBOtype
        if (SBOtype === "Forward") {
          itemPrice = sku.Dewas_forward_price || 0;
          totalPrice = itemPrice * quantity;
        } else {
          itemPrice = sku.Dewas_ready_price || 0;
          totalPrice = itemPrice * quantity;
        }

        // 🧾 Update existing item or add new one
        if (existingItem) {
          return prevCart.map((item) =>
            item.sku === sku.Code
              ? {
                ...item,
                quantity: item.quantity + quantity,
                price: itemPrice,
                total: itemPrice * (item.quantity + quantity),
                totalVolume: item.totalVolume + sku.Net_Weight * quantity,
                totalTons:
                  item.totalTons + (sku.Net_Weight / 1000) * quantity,
              }
              : item
          );
        } else {
          return [
            ...prevCart,
            // {
            //   sku: sku.Code,
            //   name: sku.Name,
            //   quantity,
            //   price: itemPrice,
            //   total: totalPrice,
            //   unit: sku.SAP_Unit,
            //   Primary_category: newCategory,
            //   totalVolume: sku.Net_Weight * quantity,
            //   totalTons: (sku.Net_Weight / 1000) * quantity,
            // },
            {
              sku: sku.Code,
              name: sku.Name,
              quantity,
              price: itemPrice,
              total: totalPrice,
              unit: sku.SAP_Unit,
              Primary_category: newCategory,
              netWeightPerUnit: sku.Net_Weight,                       // <-- NEW
              totalVolume: sku.Net_Weight * quantity,
              totalTons: (sku.Net_Weight / 1000) * quantity,
            },
          ];
        }
      });
    } catch (err) {
      console.error("❌ Error adding to cart:", err);
      setError("⚠️ Failed to add item to cart. Please try again.");
      setTimeout(() => setError(null), 1000);
    } finally {
      setLoading(false);
    }
  };


  // const updateCartQuantity = (sku, newQuantity) => {
  //   console.log("New Quantity", newQuantity);
  //   if (newQuantity <= 0) {
  //     removeFromCart(sku);
  //     return;
  //   }

  //   setCart(prevCart => {
  //     // ✅ Log current cart before updating
  //     console.log("🛒 Previous Cart:", prevCart);

  //     // ✅ Find the current item being updated
  //     const currentItem = prevCart.find(item => item.sku === sku);
  //     console.log("📦 Item before update:", currentItem);

  //     // ✅ Perform update
  //     const updatedCart = prevCart.map(item =>
  //       item.sku === sku
  //         ? {
  //           ...item,
  //           quantity: newQuantity,
  //           total: newQuantity * item.price,
  //           totalTons: (newQuantity * item.totalTons) / 1000,
  //           totalVolume: newQuantity * currentItem.totalVolume,

  //         }
  //         : item
  //     );

  //     // ✅ Log the new updated cart
  //     console.log("✅ Updated Cart:", updatedCart);
  //     return updatedCart;
  //   });
  // };

  // const updateCartQuantity = (sku, newQuantity) => {
  //   console.log("New Quantity", newQuantity);

  //   if (newQuantity <= 0) {
  //     removeFromCart(sku);
  //     return;
  //   }

  //   setCart(prevCart => {
  //     console.log("🛒 Previous Cart:", prevCart);

  //     const updatedCart = prevCart.map(item => {
  //       if (item.sku === sku) {
  //         const qtyRatio = newQuantity / item.quantity;

  //         return {
  //           ...item,
  //           quantity: newQuantity,
  //           total: item.price * newQuantity,
  //           totalTons: (item.totalTons / item.quantity) * newQuantity,
  //           totalVolume: (item.totalVolume / item.quantity) * newQuantity,
  //         };
  //       }
  //       return item;
  //     });

  //     console.log("✅ Updated Cart:", updatedCart);
  //     return updatedCart;
  //   });
  // };
















  //This is Correct Logic but when user press backspace then it shows NaN issue
  // const updateCartQuantity = (sku, newQuantity) => {

  //   setCart(prevCart => {
  //     const updatedCart = prevCart.map(item => {
  //       if (item.sku === sku) {
  //         // base unit volume and tons per quantity
  //         const volumePerUnit = item.totalVolume / item.quantity;  // original per-item volume
  //         const tonsPerUnit = item.totalTons / item.quantity;      // original per-item tons

  //         return {
  //           ...item,
  //           quantity: newQuantity,
  //           total: item.price * newQuantity,
  //           totalVolume: volumePerUnit * newQuantity,
  //           totalTons: tonsPerUnit * newQuantity
  //         };
  //       }
  //       return item;
  //     });

  //     return updatedCart;
  //   });
  // };


  const updateCartQuantity = (sku, newQuantity) => {
    console.log("cart", cart);
    console.log("cartItems", cartItems);
    // alert(`Updating SKU: ${sku} to Quantity: ${newQuantity}`);


    setCart(prevCart =>
      prevCart.map(item => {
        if (item.sku === sku) {

          if (newQuantity === 0) {
            return { ...item, quantity: 0, total: 0, totalVolume: 0, totalTons: 0 };
          }

          return {
            ...item,
            quantity: newQuantity,
            total: item.price * newQuantity,
            totalVolume: item.netWeightPerUnit * newQuantity,
            totalTons: (item.netWeightPerUnit / 1000) * newQuantity
          };
        }
        return item;
      })
    );
  };





  const removeFromCart = (sku) => {
    setCart(prevCart => prevCart.filter(item => item.sku !== sku));
  };

  const clearCart = () => {
    setCart([]);

  };

  // const submitOrder = async () => {
  //   if (cart.length === 0) return;
  //   // console.log("Dealer", storedDealer);
  //   // console.log("cart", cart);
  //   // InsertSalesOrder(storedDealer, cart, dealerCategory, SBOtype)
  //   const payLoad = {
  //     storedDealer, cart, dealerCategory, SBOtype
  //   }

  //   const response = axios.post('http://udaan.kritinutrients.com/dealer/insert-order', payLoad)

  //   console.log('Order submitted:', {
  //     dealerCategory,
  //     subCategory,
  //     SBOtype,
  //     items: cart,
  //     total: cartTotal,
  //     totalVolume,
  //     notes: orderNotes,
  //     timestamp: new Date().toISOString()
  //   });

  //   setCart([]);
  //   setOrderNotes('');

  //   setSBOType('')
  //   alert("Order submitted successfully!");
  // };





  // const submitOrder = async () => {
  //   if (cart.length === 0) {
  //     alert("Cart is empty. Please add items before submitting.");
  //     return;
  //   }

  //   try {
  //     // 🧩 Prepare payload
  //     const payLoad = {
  //       storedDealer,
  //       cart,
  //       dealerCategory,
  //       SBOtype,
  //     };

  //     console.log("🟡 Submitting Order:", {
  //       dealerCategory,
  //       subCategory,
  //       SBOtype,
  //       items: cart,
  //       total: cartTotal,
  //       totalVolume,
  //       timestamp: new Date().toISOString(),
  //     });

  //     // 🟢 Call Backend API
  //     const response = await axios.post(
  //       "http://udaan.kritinutrients.com/dealer/insert-order",
  //       payLoad
  //     );

  //     setLoading(true)
  //     // 🧾 Backend Response
  //     const result = response.data;
  //     console.log("SAP API Response:", result);

  //     if (result.success) {
  //       alert(result.message || "✅ Order submitted successfully!");

  //       // 🧹 Reset UI
  //       setCart([]);
  //       setOrderNotes("");
  //       setSBOType("");
  //       console.log("📦 SAP Sales Order Created:", result.data);
  //     } else {
  //       // SAP or validation error from backend
  //       alert(`⚠️ ${result.message || "Order submission failed!"}`);
  //       console.warn("SAP Error:", result.data);
  //     }
  //   } catch (error) {
  //     console.error("❌ Order submission failed:", error);
  //     if (error.response) {
  //       console.error("Response Error:", error.response.data);
  //       alert(`🚨 Server Error: ${error.response.data.message || "Unknown error"}`);
  //     } else {
  //       alert("🚨 Network error! Please check your connection or backend.");
  //     }
  //   }
  // };

  //This is working fine with without preview modal and alert dialog
  // const submitOrder = async () => {
  //   if (cart.length === 0) {
  //     setAlertMessage({
  //       title: "cart Restriction",
  //       message: `Cart is empty.Please add items before submitting.`,
  //       continueLabel: "OK",
  //     });
  //     setShowAlert(true);
  //     return;
  //   }

  //   try {
  //     setLoading(true); // 🔹 Start loading before processing
  //     // 🧩 Prepare payload
  //     const payLoad = {
  //       storedDealer,
  //       cart,
  //       dealerCategory,
  //       SBOtype,
  //     };

  //     console.log("🟡 Submitting Order:", {
  //       dealerCategory,
  //       subCategory,
  //       SBOtype,
  //       items: cart,
  //       total: cartTotal,
  //       totalVolume,
  //       timestamp: new Date().toISOString(),
  //     });
  //     // 🟢 Call Backend API
  //     const response = await axios.post(
  //       "http://udaan.kritinutrients.com/dealer/insert-order",
  //       payLoad
  //     );
  //     // 🧾 Backend Response
  //     const result = response.data;
  //     console.log("SAP API Response:", result);

  //     if (result.success) {
  //       // alert(result.message || "✅ Order submitted successfully!");
  //       setAlertMessage({
  //         title: "Order submitted",
  //         message: `${result.message || '✅ Order submitted successfully!'}`,
  //         continueLabel: "OK",
  //       });
  //       setShowAlert(true);
  //       // 🧹 Reset UI
  //       setCart([]);
  //       setOrderNotes("");
  //       setSBOType("");
  //       console.log("📦 SAP Sales Order Created:", result.data);
  //     } else {
  //       // SAP or validation error from backend
  //       // alert(`⚠️ ${result.message || "Order submission failed!"}`);
  //       setAlertMessage({
  //         title: "Failed",
  //         message: `${result.message || 'Order submission failed!'}`,
  //         continueLabel: "OK",
  //       });
  //       setShowAlert(true);
  //       console.warn("SAP Error:", result.data);
  //     }
  //   } catch (error) {
  //     console.error("❌ Order submission failed:", error);
  //     if (error.response) {
  //       console.error("Response Error:", error.response.data);
  //       // alert(`🚨 Server Error: ${error.response.data.message || "Unknown error"}`);
  //       setAlertMessage({
  //         title: "Failed",
  //         message: `🚨 Server Error: ${error.response.data.message || "Unknown error"}`,
  //         continueLabel: "OK",
  //       });
  //       setShowAlert(true);
  //     } else {
  //       // alert("🚨 Network error! Please check your connection or backend.");
  //       setAlertMessage({
  //         title: "Failed",
  //         message: `🚨 Network error! Please check your connection or backend.`,
  //         continueLabel: "OK",
  //       });
  //       setShowAlert(true);

  //     }
  //   } finally {
  //     setLoading(false); // 🔹 Stop loading after everything (success or error)
  //   }
  // };

  const submitOrder = () => {
    if (cart.length === 0) {
      setAlertMessage({
        title: "Cart Restriction",
        message: `Cart is empty. Please add items before submitting.`,
        continueLabel: "OK",
      });
      setShowAlert(true);
      return;
    }

    setShowPreviewModal(true); // OPEN PREVIEW FIRST
  };


  const confirmSubmitOrder = async () => {
    try {
      setShowPreviewModal(false);
      setLoading(true);

      const payLoad = {
        storedDealer,
        cart,
        dealerCategory,
        SBOtype,
      };

      const response = await axios.post("http://udaan.kritinutrients.com/dealer/insert-order", payLoad);
      const result = response.data;
      if (result.success) {
        setAlertMessage({
          title: "Success",
          message: result.message || "Order submitted successfully!",
          continueLabel: "OK",
        });
        setShowAlert(true);

        setCart([]);
        setOrderNotes("");
        setSBOType("");
      } else {
        setAlertMessage({
          title: "Failed",
          message: result.message || "Order submission failed!",
          continueLabel: "OK",
        });
        setShowAlert(true);
      }
    } catch (err) {
      setAlertMessage({
        title: "Error",
        message: "Network / Server issue. Try again.",
        continueLabel: "OK",
      });
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };









  const getStockStatus = (stock) => {
    if (stock > 100) return { status: 'In Stock', variant: 'default' };
    if (stock > 50) return { status: 'Low Stock', variant: 'secondary' };
    if (stock > 0) return { status: 'Very Low', variant: 'destructive' };
    return { status: 'Out of Stock', variant: 'outline' };
  };

  return (
    <div className="p-6 space-y-6">
      {loading && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/60 z-50">
          <Spinner className="w-12 h-12 text-white" />
          <span className="mt-4 text-white text-lg font-medium tracking-wide">
            🕒 Order Processing...
          </span>
        </div>
      )}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {!loading && !error && (
        <>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold flex items-center">
                <ShoppingCart className="w-8 h-8 mr-3" />
                Sauda Booking
              </h1>
              <p className="text-muted-foreground">Select your category and browse available SKUs</p>
            </div>
          </div>
          {/* Sales Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Tag className="w-5 h-5 mr-2" />
                Product Category & Subcategory
              </CardTitle>
              <CardDescription>Select your Product category and product subcategory</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Product Category</label>
                  <Select value={dealerCategory} onValueChange={(value) => {
                    setDealerCategory(value);
                    setSubCategory('');
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Product category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SBO">SBO</SelectItem>
                      <SelectItem value="SFO">SFO</SelectItem>
                      <SelectItem value="GNO">GNO</SelectItem>
                      <SelectItem value="KGMO">KGMO</SelectItem>
                      <SelectItem value="Bari">Soya Bari</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Product Subcategory</label>
                  <Select
                    value={subCategory}
                    onValueChange={setSubCategory}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CP">CP</SelectItem>
                      <SelectItem value="BP">BP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder={storedDealer.plantName} />
                    </SelectTrigger>
                    {/* <SelectContent>
                      <SelectItem value={storedDealer.location || "Dewas"}>{storedDealer.Location}</SelectItem>
                    </SelectContent> */}
                  </Select>
                </div>
                {dealerCategory === "SBO" && storedDealer.Location == '1101' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Type</label>

                    <Select
                      onValueChange={(value) => setSBOType(value)}
                      value={SBOtype}
                      disabled={cart.length > 0}    // Disable when cart has items
                    >
                      <SelectTrigger className={cart.length > 0 ? "opacity-50 cursor-not-allowed" : ""}>
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="Ready">Ready</SelectItem>
                        <SelectItem value="Forward">Forward</SelectItem>
                      </SelectContent>
                    </Select>
                    {cart.length > 0 && (
                      <p className="text-xs text-red-500 mt-1">
                        Type cannot be changed while cart contains items
                      </p>
                    )}
                  </div>

                )}
              </div>
            </CardContent>
          </Card>
          {/* Shopping Cart Summary */}
          {/* {cart.length > 0 && (
            <Card >
              <CardHeader>
                <div className="flex justify-between items-center ">
                  <CardTitle className="flex items-center">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Shopping Cart ({cartItems} items)
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Total: ₹{cartTotal.toLocaleString()}</span>
                    <Button variant="outline" size="sm" onClick={clearCart}>
                      Clear Cart
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.sku} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex-1">
                        <span className="font-medium text-sm">{item.name}</span>
                        <div className="text-xs text-muted-foreground">{item.sku}</div>
                      </div>
                      <div className="flex items-center space-x-2 cursor-pointer">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateCartQuantity(item.sku, item.quantity - 1)}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity}
                          min={0}
                          className="w-20 text-center text-sm"
                          onChange={(e) => updateCartQuantity(item.sku, Number(e.target.value))}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateCartQuantity(item.sku, item.quantity + 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                        <span className="w-20 text-right text-sm">₹{item.total.toLocaleString()}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.sku)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )} */}
          {/* SKU Listing this is working */}
          {/* {dealerCategory && subCategory && (
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                  <div>
                    <CardTitle className="flex items-center">
                      <Package className="w-5 h-5 mr-2" />
                      Available SKUs - {dealerCategory} / {subCategory}
                    </CardTitle>
                    <CardDescription>
                      Browse and add products to your order
                    </CardDescription>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search SKUs..."
                      className="pl-10 w-80"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>SKU Code</TableHead>
                        <TableHead>Product Name</TableHead>
                        <TableHead>Price (₹)</TableHead>
                        <TableHead>Unit</TableHead>

                        <TableHead>Quantity</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSKUs.map((sku) => {
                        const cartItem = cart.find(item => item.Code === sku.Code);

                        return (
                          <TableRow key={sku.Code}>
                            <TableCell >{sku.Code}</TableCell>
                            <TableCell>{sku.Name}</TableCell>
                          
                            {
                              SBOtype === "Ready" ? (<TableCell>₹{sku.Dewas_ready_price.toLocaleString()}</TableCell>) : (<TableCell>₹{sku.Dewas_forward_price.toLocaleString()}</TableCell>)
                            }
                            <TableCell>{sku.SAP_Unit}</TableCell>

                            
                            <TableCell className="w-40 text-center">
                              {cartItem ? (
                                <div className="flex items-center justify-center gap-2 cursor-pointer">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateCartQuantity(sku.sku, cartItem.quantity - 1)}
                                  >
                                    <Minus className="w-3 h-3" />
                                  </Button>
                                  <Input
                                    type="text"                           // <- change from number to text
                                    inputMode="numeric"                   // <- mobile will show numeric keypad
                                    pattern="[0-9]*"
                                    value={cartItem.quantity}
                                    min={1}
                                    onKeyDown={(e) => {
                                      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                                        e.preventDefault();
                                      }
                                    }}
                                    className="w-24 text-center text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    onChange={(e) => updateCartQuantity(sku.sku, Number(e.target.value))}
                                    onWheel={(e) => e.target.blur()}

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
                                <div className="flex justify-center cursor-pointer">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => addToCart(sku)}
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
                {filteredSKUs.length === 0 && (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      {!dealerCategory || !subCategory
                        ? 'Please select Product category and subcategory to view SKUs'
                        : 'No SKUs found matching your search criteria'
                      }
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )} */}
          {dealerCategory && subCategory && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Available SKUs - {dealerCategory} / {subCategory}
                  <div className="flex items-center space-x-4 ml-auto">
                    <span className="font-medium">Total: ₹{cartTotal.toLocaleString()}</span>
                    <Button variant="outline" size="sm" onClick={clearCart}>
                      Clear Cart
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription>Browse and add products to your order</CardDescription>
              </CardHeader>

              <CardContent>

                {/* SEARCH BAR */}
                {/* <div className="relative mb-4">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search SKUs..."
                    className="pl-10 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div> */}

                {/* SKU TABLE SINGLE COMPONENT */}
                <div className="border rounded-lg overflow-x-auto max-h-[520px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>SKU</TableHead>
                        <TableHead>Product Name</TableHead>
                        <TableHead>Price (₹)</TableHead>
                        <TableHead>Unit</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Total (₹)</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {filteredSKUs.map((sku) => {
                        const cartItem = cart.find(item => item.sku === sku.Code);
                        return (
                          <TableRow key={sku.Code}>
                            <TableCell>{sku.Code}</TableCell>
                            <TableCell>{sku.Name}</TableCell>
                            {/* TODO: if User is from jabalpur then show JBGL_price*/}
                            <TableCell>
                              ₹{SBOtype === "Ready"
                                ? sku.Dewas_ready_price
                                : sku.Dewas_forward_price}
                            </TableCell>
                            <TableCell>{sku.SAP_Unit}</TableCell>

                            <TableCell className="w-36">
                              {cartItem ? (
                                <div className="flex items-center gap-2 justify-center">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateCartQuantity(cartItem.sku, cartItem.quantity - 1)}
                                  >
                                    <Minus className="w-3 h-3" />
                                  </Button>

                                  {/* <Input
                                    type="text"
                                    inputMode="numeric"
                                    className="w-20 text-center text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    value={cartItem.quantity}
                                    onChange={(e) => {
                                      let value = e.target.value;
                                      if (value === "") return; // prevent blank
                                      updateCartQuantity(cartItem.sku, Number(value));
                                    }}
                                  /> */}
                                  <Input
                                    type="text"
                                    inputMode="numeric"
                                    className="w-20 text-center text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    value={cartItem.quantity === 0 ? "" : cartItem.quantity}
                                    onChange={(e) => {
                                      let value = e.target.value;

                                      if (value === "") {
                                        updateCartQuantity(cartItem.sku, 0);
                                        return;
                                      }
                                      if (!/^\d+$/.test(value)) return;

                                      updateCartQuantity(cartItem.sku, Number(value));
                                    }}
                                  />



                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateCartQuantity(cartItem.sku, cartItem.quantity + 1)}
                                  >
                                    <Plus className="w-3 h-3" />
                                  </Button>
                                </div>
                              ) : (
                                <Button variant="outline" size="sm" onClick={() => addToCart(sku)}>
                                  <Plus className="w-3 h-3 mr-1" /> Add
                                </Button>
                              )}
                            </TableCell>

                            <TableCell>
                              {cartItem ? `₹${cartItem.total.toLocaleString()}` : "-"}
                            </TableCell>

                            <TableCell>
                              {cartItem && (
                                <Button variant="ghost" size="sm" onClick={() => removeFromCart(cartItem.sku)}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>

                {/* SUMMARY RIGHT UNDER SKUs */}
                {cart.length > 0 && (

                  <div className="space-x-4 px-3 mt-4">
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
                            <span className="font-medium">Total Amount:</span>
                            <span className="font-bold">₹{cartTotal.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Total Volume:</span>
                            <span className="font-bold">{(totalVolume / 1000).toFixed(2)} MT</span>
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

                  </div>
                )}
              </CardContent>
            </Card>
          )}


          {/* it is working code Order Summary and Submission */}
          {/* {cart.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Order Preview </CardTitle>
                <div className="flex items-center space-x-4 ml-auto">
                  <span className="font-medium">Total: ₹{cartTotal.toLocaleString()}</span>
                  <Button variant="outline" size="sm" onClick={clearCart}>
                    Clear Cart
                  </Button>
                </div>
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
                          <TableHead>List Price (₹)</TableHead>
                          <TableHead>Total (₹)</TableHead>
                          <TableHead>Quantity</TableHead>
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        {cart.map((item) => {
                          const basic = parseFloat(item.BasicPrice || 0);
                          const final = parseFloat(item.FinalBP || 0);
                          const tax = parseFloat(item.TaxValue || 0);
                          const total = (final + tax) * item.quantity;
                          { console.log("cart Item", item) }

                          return (
                            <TableRow key={item.sku}>
                              <TableCell>{item.sku}</TableCell>
                              <TableCell>{item.name}</TableCell>
                              <TableCell>{item.unit}</TableCell>
                              <TableCell>₹{item.price ? Number(item.price).toFixed(2) : '0.00'}</TableCell>
                              <TableCell>₹{item.total.toLocaleString()}</TableCell>
                              <TableCell className="w-44 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      updateCartQuantity(item.sku, item.quantity - 1)
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
                                    className="w-24 text-center text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    onChange={(e) =>
                                      updateCartQuantity(item.sku, Number(e.target.value))
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
                                      updateCartQuantity(item.sku, item.quantity + 1)
                                    }
                                  >
                                    <Plus className="w-3 h-3" />
                                  </Button>
                                </div>
                              </TableCell>
                              <TableCell><Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFromCart(item.sku)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button></TableCell>
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
                        <span className="font-medium">Total Amount:</span>
                        <span className="font-bold">₹{cartTotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Total Volume:</span>
                        <span className="font-bold">{(totalVolume / 1000).toFixed(2)} MT</span>
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
          )} */}
        </>
      )}
      {
        showAlert && (<AlertDialog open={showAlert} onOpenChange={setShowAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{alertMessage.title}</AlertDialogTitle>
              <AlertDialogDescription>
                {alertMessage.message}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              {alertMessage.cancelLabel && (
                <AlertDialogCancel onClick={() => setShowAlert(false)}>
                  {alertMessage.cancelLabel || "Cancel"}
                </AlertDialogCancel>
              )}
              {alertMessage.continueLabel && (
                <AlertDialogAction onClick={handleContinue}>
                  {alertMessage.continueLabel || "Continue"}
                </AlertDialogAction>
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>)
      }
      <AlertDialog open={showPreviewModal} onOpenChange={setShowPreviewModal}>
        <AlertDialogContent className="max-w-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Order Preview</AlertDialogTitle>
            <AlertDialogDescription>
              Review your order before final submission.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="max-h-[350px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Total (₹)</TableHead>
                  <TableHead>Volume (MT)</TableHead>
                  <TableHead>Contract Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.map((item) => (
                  <TableRow key={item.sku}>
                    <TableCell>{item.sku}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>₹{item.total.toLocaleString()}</TableCell>
                    <TableCell>{(item.totalVolume / 1000).toFixed(2)}</TableCell>
                    <TableCell>{SBOtype}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex  w-full border-t pt-4 mt-4 text-sm">
            <div className="space-y-1">
              <p>Total Items: <b>{cartItems}</b></p>
              <p>Total Amount: <b>₹{cartTotal.toLocaleString()}</b></p>
              <p>Total Volume: <b>{(totalVolume / 1000).toFixed(2)} MT</b></p>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Edit</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSubmitOrder}>Review & Submit</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>



    </div>
  );
}




