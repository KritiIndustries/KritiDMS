// import React, { useState } from 'react';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
// import { Button } from './ui/button';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
// import { Badge } from './ui/badge';
// // import { DatePickerWithRange } from './ui/date-picker-range';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
// import {
//   FileText,
//   Download,
//   Filter,
//   TrendingUp,
//   IndianRupee,
//   Calendar,
//   BarChart3
// } from 'lucide-react';

// const primarySalesData = [
//   { date: '2025-01-01', invoiceNo: 'INV001', customer: 'ABC Retailers', sku: 'SKU001', quantity: 100, amount: 112500, status: 'Paid' },
//   { date: '2025-01-02', invoiceNo: 'INV002', customer: 'XYZ Distributors', sku: 'SKU002', quantity: 75, amount: 66150, status: 'Pending' },
//   { date: '2025-01-03', invoiceNo: 'INV003', customer: 'PQR Traders', sku: 'SKU003', quantity: 200, amount: 135000, status: 'Paid' },
//   { date: '2025-01-04', invoiceNo: 'INV004', customer: 'LMN Suppliers', sku: 'SKU004', quantity: 50, amount: 83250, status: 'Overdue' },
//   { date: '2025-01-05', invoiceNo: 'INV005', customer: 'DEF Merchants', sku: 'SKU005', quantity: 25, amount: 49500, status: 'Paid' },
// ];

// const ledgerData = [
//   { date: '2025-01-01', type: 'Sale', description: 'Sale to ABC Retailers', debit: 0, credit: 112500, balance: 112500 },
//   { date: '2025-01-02', type: 'Purchase', description: 'Purchase from Supplier', debit: 50000, credit: 0, balance: 62500 },
//   { date: '2025-01-03', type: 'Sale', description: 'Sale to PQR Traders', debit: 0, credit: 135000, balance: 197500 },
//   { date: '2025-01-04', type: 'Payment', description: 'Payment to Supplier', debit: 30000, credit: 0, balance: 167500 },
//   { date: '2025-01-05', type: 'Sale', description: 'Sale to DEF Merchants', debit: 0, credit: 49500, balance: 217000 },
// ];

// const accountStatementData = [
//   { date: '2025-01-01', particular: 'Opening Balance', debit: 0, credit: 50000, balance: 50000 },
//   { date: '2025-01-01', particular: 'Sales Invoice INV001', debit: 112500, credit: 0, balance: 162500 },
//   { date: '2025-01-02', particular: 'Payment Received', debit: 0, credit: 100000, balance: 62500 },
//   { date: '2025-01-03', particular: 'Sales Invoice INV003', debit: 135000, credit: 0, balance: 197500 },
//   { date: '2025-01-04', particular: 'Credit Note', debit: 0, credit: 5000, balance: 192500 },
// ];

// export function Reports() {
//   const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');

//   const getStatusBadgeVariant = () => {
//     switch (status) {
//       case 'Paid': return 'default';
//       case 'Pending': return 'secondary';
//       case 'Overdue': return 'destructive';
//       default: return 'default';
//     }
//   };

//   return (
//     <div className="p-6 space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold">Reports & Analytics</h1>
//         <p className="text-muted-foreground">Comprehensive business insights and financial reports</p>
//       </div>

//       {/* Report Filters */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center">
//             <Filter className="w-5 h-5 mr-2" />
//             Report Filters
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
//             <div className="flex-1">
//               <label className="block text-sm font-medium mb-2">Time Period</label>
//               <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="today">Today</SelectItem>
//                   <SelectItem value="thisWeek">This Week</SelectItem>
//                   <SelectItem value="thisMonth">This Month</SelectItem>
//                   <SelectItem value="lastMonth">Last Month</SelectItem>
//                   <SelectItem value="thisQuarter">This Quarter</SelectItem>
//                   <SelectItem value="thisYear">This Year</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="flex items-end space-x-2">
//               <Button variant="outline">
//                 <Download className="w-4 h-4 mr-2" />
//                 Export All
//               </Button>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Reports Tabs */}
//       <Tabs defaultValue="primary-sales" className="space-y-4">
//         <TabsList className="grid w-full grid-cols-3">
//           <TabsTrigger value="primary-sales">Primary Sales Report</TabsTrigger>
//           <TabsTrigger value="ledger">Ledger Report</TabsTrigger>
//           <TabsTrigger value="account-statement">Account Statement</TabsTrigger>
//         </TabsList>

//         {/* Primary Sales Report */}
//         <TabsContent value="primary-sales">
//           <Card>
//             <CardHeader>
//               <div className="flex justify-between items-start">
//                 <div>
//                   <CardTitle className="flex items-center">
//                     <TrendingUp className="w-5 h-5 mr-2" />
//                     Primary Sales Report
//                   </CardTitle>
//                   <CardDescription>
//                     Detailed view of all primary sales transactions with customers
//                   </CardDescription>
//                 </div>
//                 <Button variant="outline" size="sm">
//                   <Download className="w-4 h-4 mr-2" />
//                   Export
//                 </Button>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//                 <div className="text-center p-4 bg-blue-50 rounded-lg">
//                   <div className="text-2xl font-bold text-blue-600">₹4,46,400</div>
//                   <div className="text-sm text-blue-600">Total Sales</div>
//                 </div>
//                 <div className="text-center p-4 bg-green-50 rounded-lg">
//                   <div className="text-2xl font-bold text-green-600">450</div>
//                   <div className="text-sm text-green-600">Units Sold</div>
//                 </div>
//                 <div className="text-center p-4 bg-yellow-50 rounded-lg">
//                   <div className="text-2xl font-bold text-yellow-600">5</div>
//                   <div className="text-sm text-yellow-600">Transactions</div>
//                 </div>
//                 <div className="text-center p-4 bg-red-50 rounded-lg">
//                   <div className="text-2xl font-bold text-red-600">₹66,150</div>
//                   <div className="text-sm text-red-600">Outstanding</div>
//                 </div>
//               </div>

//               <div className="border rounded-lg overflow-hidden">
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Date</TableHead>
//                       <TableHead>Invoice No.</TableHead>
//                       <TableHead>Customer</TableHead>
//                       <TableHead className="hidden sm:table-cell">SKU</TableHead>
//                       <TableHead className="">Quantity</TableHead>
//                       <TableHead className="">Amount (₹)</TableHead>
//                       {/* <TableHead>Status</TableHead> */}
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {primarySalesData.map((item, index) => (
//                       <TableRow key={index}>
//                         <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
//                         <TableCell className="font-medium">{item.invoiceNo}</TableCell>
//                         <TableCell>{item.customer}</TableCell>
//                         <TableCell className="hidden sm:table-cell">{item.sku}</TableCell>
//                         <TableCell className="">{item.quantity}</TableCell>
//                         <TableCell className="">₹{item.amount.toLocaleString()}</TableCell>
//                         {/* <TableCell>
//                           <Badge variant={getStatusBadgeVariant(item.status)}>
//                             {item.status}
//                           </Badge>
//                         </TableCell> */}
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </div>


//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Ledger Report */}
//         <TabsContent value="ledger">
//           <Card>
//             <CardHeader>
//               <div className="flex justify-between items-start">
//                 <div>
//                   <CardTitle className="flex items-center">
//                     <BarChart3 className="w-5 h-5 mr-2" />
//                     Ledger Report
//                   </CardTitle>
//                   <CardDescription>
//                     Complete record of all debit and credit transactions
//                   </CardDescription>
//                 </div>
//                 <Button variant="outline" size="sm">
//                   <Download className="w-4 h-4 mr-2" />
//                   Export
//                 </Button>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//                 <div className="text-center p-4 bg-green-50 rounded-lg">
//                   <div className="text-2xl font-bold text-green-600">₹2,97,000</div>
//                   <div className="text-sm text-green-600">Total Credits</div>
//                 </div>
//                 <div className="text-center p-4 bg-red-50 rounded-lg">
//                   <div className="text-2xl font-bold text-red-600">₹80,000</div>
//                   <div className="text-sm text-red-600">Total Debits</div>
//                 </div>
//                 <div className="text-center p-4 bg-blue-50 rounded-lg">
//                   <div className="text-2xl font-bold text-blue-600">₹2,17,000</div>
//                   <div className="text-sm text-blue-600">Closing Balance</div>
//                 </div>
//               </div>

//               <div className="border rounded-lg overflow-hidden">
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Date</TableHead>
//                       <TableHead>Type</TableHead>
//                       <TableHead>Description</TableHead>
//                       <TableHead >Debit(₹)</TableHead>
//                       <TableHead >Credit(₹)</TableHead>
//                       <TableHead >Balance(₹)</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {ledgerData.map((item, index) => (
//                       <TableRow key={index}>
//                         <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
//                         <TableCell>
//                           <Badge variant="outline">{item.type}</Badge>
//                         </TableCell>
//                         <TableCell>{item.description}</TableCell>
//                         <TableCell className="">
//                           {item.debit > 0 ? `₹${item.debit.toLocaleString()}` : '-'}
//                         </TableCell>
//                         <TableCell className="">
//                           {item.credit > 0 ? `₹${item.credit.toLocaleString()}` : '-'}
//                         </TableCell>
//                         <TableCell className=" ">
//                           ₹{item.balance.toLocaleString()}
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </div>


//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Account Statement */}
//         <TabsContent value="account-statement">
//           <Card>
//             <CardHeader>
//               <div className="flex justify-between items-start">
//                 <div>
//                   <CardTitle className="flex items-center">
//                     <IndianRupee className="w-5 h-5 mr-2" />
//                     Account Statement
//                   </CardTitle>
//                   <CardDescription>
//                     Detailed account movement and outstanding balances
//                   </CardDescription>
//                 </div>
//                 <Button variant="outline" size="sm">
//                   <Download className="w-4 h-4 mr-2" />
//                   Export
//                 </Button>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//                 <div className="text-center p-4 bg-blue-50 rounded-lg">
//                   <div className="text-2xl font-bold text-blue-600">₹50,000</div>
//                   <div className="text-sm text-blue-600">Opening Balance</div>
//                 </div>
//                 <div className="text-center p-4 bg-green-50 rounded-lg">
//                   <div className="text-2xl font-bold text-green-600">₹2,47,500</div>
//                   <div className="text-sm text-green-600">Total Debits</div>
//                 </div>
//                 <div className="text-center p-4 bg-yellow-50 rounded-lg">
//                   <div className="text-2xl font-bold text-yellow-600">₹1,05,000</div>
//                   <div className="text-sm text-yellow-600">Total Credits</div>
//                 </div>
//                 <div className="text-center p-4 bg-red-50 rounded-lg">
//                   <div className="text-2xl font-bold text-red-600">₹1,92,500</div>
//                   <div className="text-sm text-red-600">Closing Balance</div>
//                 </div>
//               </div>


//               {/* <div className="border rounded-lg overflow-hidden">
//                 <div className="overflow-x-auto">
//                   <Table className="min-w-[700px]">
//                     <TableHeader>
//                       <TableRow>
//                         <TableHead >Date</TableHead>
//                         <TableHead >Particulars</TableHead>
//                         <TableHead >Debit (₹)</TableHead>
//                         <TableHead >Credit (₹)</TableHead>
//                         <TableHead >Balance (₹)</TableHead>

//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {accountStatementData.map((item, index) => (
//                         <TableRow key={index}>
//                           <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
//                           <TableCell className="truncate">{item.particular}</TableCell>
//                           <TableCell>
//                             {item.debit > 0 ? `₹${item.debit.toLocaleString()}` : "-"}
//                           </TableCell>
//                           <TableCell>
//                             {item.credit > 0 ? `₹${item.credit.toLocaleString()}` : "-"}
//                           </TableCell>
//                           <TableCell className="font-medium">
//                             ₹{item.balance.toLocaleString()}
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 </div>



//               </div> */}
//               <div className="border rounded-lg overflow-hidden">
//                 <div className="overflow-x-auto">
//                   <Table className="min-w-[700px]">
//                     <TableHeader>
//                       <TableRow>
//                         <TableHead>Date</TableHead>
//                         <TableHead>Particulars</TableHead>
//                         <TableHead>Debit (₹)</TableHead>
//                         <TableHead>Credit (₹)</TableHead>
//                         <TableHead>Balance (₹)</TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {accountStatementData.map((item, index) => (
//                         <TableRow key={index}>
//                           <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
//                           <TableCell className="max-w-[200px] truncate">
//                             {item.particular}
//                           </TableCell>
//                           <TableCell>
//                             {item.debit > 0 ? `₹${item.debit.toLocaleString()}` : '-'}
//                           </TableCell>
//                           <TableCell>
//                             {item.credit > 0 ? `₹${item.credit.toLocaleString()}` : '-'}
//                           </TableCell>
//                           <TableCell className="font-medium">
//                             ₹{item.balance.toLocaleString()}
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 </div>
//               </div>


//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>

//       {/* Report Insights */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Key Insights</CardTitle>
//           <CardDescription>Important findings from your reports</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
//               <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
//               <div>
//                 <h4 className="font-medium text-blue-900">Sales Performance</h4>
//                 <p className="text-sm text-blue-700">Your primary sales show a 15% increase compared to last month, indicating strong market demand.</p>
//               </div>
//             </div>
//             <div className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg">
//               <Calendar className="w-5 h-5 text-yellow-600 mt-0.5" />
//               <div>
//                 <h4 className="font-medium text-yellow-900">Outstanding Payments</h4>
//                 <p className="text-sm text-yellow-700">You have ₹66,150 in outstanding payments. Consider following up with customers for faster collection.</p>
//               </div>
//             </div>
//             <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
//               <IndianRupee className="w-5 h-5 text-green-600 mt-0.5" />
//               <div>
//                 <h4 className="font-medium text-green-900">Cash Flow</h4>
//                 <p className="text-sm text-green-700">Your account balance is healthy at ₹1,92,500, providing good liquidity for operations.</p>
//               </div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }




import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import {
  FileText,
  Download,
  Filter,
  TrendingUp,
  IndianRupee,
  Calendar,
  BarChart3
} from 'lucide-react';

const primarySalesData = [
  { date: '2025-01-01', invoiceNo: 'INV001', customer: 'ABC Retailers', sku: 'SKU001', quantity: 100, amount: 112500, status: 'Paid' },
  { date: '2025-01-02', invoiceNo: 'INV002', customer: 'XYZ Distributors', sku: 'SKU002', quantity: 75, amount: 66150, status: 'Pending' },
  { date: '2025-01-03', invoiceNo: 'INV003', customer: 'PQR Traders', sku: 'SKU003', quantity: 200, amount: 135000, status: 'Paid' },
  { date: '2025-01-04', invoiceNo: 'INV004', customer: 'LMN Suppliers', sku: 'SKU004', quantity: 50, amount: 83250, status: 'Overdue' },
  { date: '2025-01-05', invoiceNo: 'INV005', customer: 'DEF Merchants', sku: 'SKU005', quantity: 25, amount: 49500, status: 'Paid' },
];

const ledgerData = [
  { date: '2025-01-01', type: 'Sale', description: 'Sale to ABC Retailers', debit: 0, credit: 112500, balance: 112500 },
  { date: '2025-01-02', type: 'Purchase', description: 'Purchase from Supplier', debit: 50000, credit: 0, balance: 62500 },
  { date: '2025-01-03', type: 'Sale', description: 'Sale to PQR Traders', debit: 0, credit: 135000, balance: 197500 },
  { date: '2025-01-04', type: 'Payment', description: 'Payment to Supplier', debit: 30000, credit: 0, balance: 167500 },
  { date: '2025-01-05', type: 'Sale', description: 'Sale to DEF Merchants', debit: 0, credit: 49500, balance: 217000 },
];

const accountStatementData = [
  { date: '2025-01-01', particular: '	Opening Balance', debit: 0, credit: 50000, balance: 50000 },
  { date: '2025-01-01', particular: 'Sales Invoice INV001', debit: 112500, credit: 0, balance: 162500 },
  { date: '2025-01-02', particular: 'Payment Received', debit: 0, credit: 100000, balance: 62500 },
  { date: '2025-01-03', particular: 'Sales Invoice INV003', debit: 135000, credit: 0, balance: 197500 },
  { date: '2025-01-04', particular: 'Credit Note', debit: 0, credit: 5000, balance: 192500 },
];

export function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Paid': return 'default';
      case 'Pending': return 'secondary';
      case 'Overdue': return 'destructive';
      default: return 'default';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <p className="text-muted-foreground">Comprehensive business insights and financial reports</p>
      </div>

      {/* Report Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Report Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Time Period</label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="thisWeek">This Week</SelectItem>
                  <SelectItem value="thisMonth">This Month</SelectItem>
                  <SelectItem value="lastMonth">Last Month</SelectItem>
                  <SelectItem value="thisQuarter">This Quarter</SelectItem>
                  <SelectItem value="thisYear">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end space-x-2">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export All
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports Tabs */}
      <Tabs defaultValue="primary-sales" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="primary-sales">Primary Sales Report</TabsTrigger>
          <TabsTrigger value="ledger">Ledger Report</TabsTrigger>
          <TabsTrigger value="account-statement">Account Statement</TabsTrigger>
        </TabsList>

        {/* Primary Sales Report */}
        <TabsContent value="primary-sales">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Primary Sales Report
                  </CardTitle>
                  <CardDescription>
                    Detailed view of all primary sales transactions with customers
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">₹4,46,400</div>
                  <div className="text-sm text-blue-600">Total Sales</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">450</div>
                  <div className="text-sm text-green-600">Units Sold</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">5</div>
                  <div className="text-sm text-yellow-600">Transactions</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">₹66,150</div>
                  <div className="text-sm text-red-600">Outstanding</div>
                </div>
              </div> */}

              <div className="relative border rounded-lg overflow-hidden">
                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                  <Table className="w-full table-fixed">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px] sm:w-[120px]">Date</TableHead>
                        <TableHead className="w-[100px] sm:w-[120px]">Invoice No.</TableHead>
                        <TableHead className="w-[150px] ">Customer</TableHead>
                        <TableHead className="w-[150px]">SKU</TableHead>
                        <TableHead className="w-[150px]">Quantity</TableHead>
                        <TableHead className="w-[150px]">Amount (₹)</TableHead>
                        <TableHead className="w-[150px]">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {primarySalesData.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="truncate overflow-hidden whitespace-nowrap">{new Date(item.date).toLocaleDateString()}</TableCell>
                          <TableCell className="truncate overflow-hidden whitespace-nowrap">{item.invoiceNo}</TableCell>
                          <TableCell className="truncate overflow-hidden whitespace-nowrap">{item.customer}</TableCell>
                          <TableCell className="truncate overflow-hidden whitespace-nowrap">{item.sku}</TableCell>
                          <TableCell className="truncate overflow-hidden whitespace-nowrap">{item.quantity}</TableCell>
                          <TableCell className="truncate overflow-hidden whitespace-nowrap">₹{item.amount.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(item.status)}>
                              {item.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ledger Report */}
        <TabsContent value="ledger">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Ledger Report
                  </CardTitle>
                  <CardDescription>
                    Complete record of all debit and credit transactions
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">₹2,97,000</div>
                  <div className="text-sm text-green-600">Total Credits</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">₹80,000</div>
                  <div className="text-sm text-red-600">Total Debits</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">₹2,17,000</div>
                  <div className="text-sm text-blue-600">Closing Balance</div>
                </div>
              </div> */}

              <div className="relative border rounded-lg overflow-hidden">
                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                  {/* <Table className="w-full table-auto">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px] sm:w-[120px]">Date</TableHead>
                        <TableHead className="w-[100px]">Type</TableHead>
                        <TableHead className="max-w-[150px] sm:max-w-[200px] truncate">Description</TableHead>
                        <TableHead className="w-[100px]">Debit(₹)</TableHead>
                        <TableHead className="w-[100px]">Credit(₹)</TableHead>
                        <TableHead className="w-[100px]">Balance(₹)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ledgerData.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="whitespace-nowrap">{new Date(item.date).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{item.type}</Badge>
                          </TableCell>
                          <TableCell className="max-w-[150px] sm:max-w-[200px] truncate">{item.description}</TableCell>
                          <TableCell className="whitespace-nowrap">
                            {item.debit > 0 ? `₹${item.debit.toLocaleString()} ` : '-'}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {item.credit > 0 ? `₹${item.credit.toLocaleString()} ` : '-'}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            ₹{item.balance.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table> */}
                  <Table className="w-full table-fixed">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[120px]">Date</TableHead>
                        <TableHead className="w-[100px]">Type</TableHead>
                        <TableHead className="w-[200px]">Description</TableHead>
                        <TableHead className="w-[120px]">Debit (₹)</TableHead>
                        <TableHead className="w-[120px]">Credit (₹)</TableHead>
                        <TableHead className="w-[120px]">Balance (₹)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ledgerData.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="whitespace-nowrap">{new Date(item.date).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{item.type}</Badge>
                          </TableCell>
                          <TableCell className="truncate overflow-hidden whitespace-nowrap">
                            {item.description}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {item.debit > 0 ? `₹${item.debit.toLocaleString()}` : '-'}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {item.credit > 0 ? `₹${item.credit.toLocaleString()}` : '-'}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            ₹{item.balance.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Account Statement */}
        <TabsContent value="account-statement">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center">
                    <IndianRupee className="w-5 h-5 mr-2" />
                    Account Statement
                  </CardTitle>
                  <CardDescription>
                    Detailed account movement and outstanding balances
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">₹50,000</div>
                  <div className="text-sm text-blue-600">Opening Balance</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">₹2,47,500</div>
                  <div className="text-sm text-green-600">Total Debits</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">₹1,05,000</div>
                  <div className="text-sm text-yellow-600">Total Credits</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">₹1,92,500</div>
                  <div className="text-sm text-red-600">Closing Balance</div>
                </div>
              </div> */}

              {/* <div className="relative border rounded-lg overflow-hidden">
                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                  <Table className="w-full table-auto">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px] sm:w-[120px]">Date</TableHead>
                        <TableHead className="max-w-[150px] sm:max-w-[200px] truncate">Particulars</TableHead>
                        <TableHead className="w-[100px]">Debit (₹)</TableHead>
                        <TableHead className="w-[100px]">Credit (₹)</TableHead>
                        <TableHead className="w-[100px]">Balance (₹)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {accountStatementData.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="whitespace-nowrap">{new Date(item.date).toLocaleDateString()}</TableCell>
                          <TableCell className="max-w-[150px] sm:max-w-[200px] truncate">
                            {item.particular}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {item.debit > 0 ? `₹${item.debit.toLocaleString()} ` : '-'}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {item.credit > 0 ? `₹${item.credit.toLocaleString()} ` : '-'}
                          </TableCell>
                          <TableCell className="font-medium whitespace-nowrap">
                            ₹{item.balance.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div> */}
              <div className="relative border rounded-lg overflow-hidden">
                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                  <Table className="w-full table-auto">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="">Date</TableHead>
                        <TableHead className="">Particulars</TableHead>
                        <TableHead className="">Debit (₹)</TableHead>
                        <TableHead className="">Credit (₹)</TableHead>
                        <TableHead className="w">Balance (₹)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {accountStatementData.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="">{new Date(item.date).toLocaleDateString()}</TableCell>
                          <TableCell className="">{item.particular}</TableCell>
                          <TableCell className="">
                            {item.debit > 0 ? `₹${item.debit.toLocaleString()} ` : '-'}
                          </TableCell>
                          <TableCell className="">
                            {item.credit > 0 ? `₹${item.credit.toLocaleString()} ` : '-'}
                          </TableCell>
                          <TableCell className="">
                            ₹{item.balance.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Report Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Key Insights</CardTitle>
          <CardDescription>Important findings from your reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">Sales Performance</h4>
                <p className="text-sm text-blue-700">Your primary sales show a 15% increase compared to last month, indicating strong market demand.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg">
              <Calendar className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-900">Outstanding Payments</h4>
                <p className="text-sm text-yellow-700">You have ₹66,150 in outstanding payments. Consider following up with customers for faster collection.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
              <IndianRupee className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-900">Cash Flow</h4>
                <p className="text-sm text-green-700">Your account balance is healthy at ₹1,92,500, providing good liquidity for operations.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
