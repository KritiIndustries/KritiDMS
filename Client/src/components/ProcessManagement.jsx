import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Progress } from './ui/progress';
import { 
  Plus, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  FileText,
  Send,
  User,
  MapPin,
  Package
} from 'lucide-react';
import Modal from './Modal';

const pricingData = {
  Price: [
    
    { sku: 'SKU001', productName: 'SBO 5 Ltr Sq Jar', category: 'SBO', mrp: 1250, dealerPrice: 1125, margin: 10, stock: 'In Stock' },
    { sku: 'SKU002', productName: 'GNO 5 Ltr Sq Jar', category: 'GNO', mrp: 980, dealerPrice: 882, margin: 10, stock: 'In Stock' },
    { sku: 'SKU003', productName: 'KGMO 15 KG JAR', category: 'KGMO', mrp: 750, dealerPrice: 675, margin: 10, stock: 'Low Stock' },
    { sku: 'SKU004', productName: 'Soya Refined Oil 15Ltr Tin', category: 'SBO', mrp: 1850, dealerPrice: 1665, margin: 10, stock: 'In Stock' },
    { sku: 'SKU005', productName: 'SFO 5 Ltr Jerry', category: 'Category SFO', mrp: 2200, dealerPrice: 1980, margin: 10, stock: 'Out of Stock' },
  ]
  
};
// const pricingData.Price = pricingData[selectedLocation];
// const filteredData = pricingData.Price.filter(item => 
//   item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//   item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
//   item.category.toLowerCase().includes(searchTerm.toLowerCase())
// );
const salesOrders = [
  {
    id: 'SO-2025-001',
    location: 'Dewas',
    type: 'Ready',
    customer: 'ABC Retailers',
    status: 'Created',
    items: 5,
    amount: 125000,
    createdDate: '2025-01-05',
    stage: 1
  },
  {
    id: 'SO-2025-002',
    location: 'Jabalpur',
    type: 'Forward',
    customer: 'XYZ Distributors',
    status: 'DO Sent to SAP',
    items: 3,
    amount: 89000,
    createdDate: '2025-01-04',
    stage: 2
  },
  {
    id: 'SO-2025-003',
    location: 'Dewas',
    type: 'Ready',
    customer: 'PQR Traders',
    status: 'Verified',
    items: 8,
    amount: 156000,
    createdDate: '2025-01-03',
    stage: 3
  },
  {
    id: 'SO-2025-004',
    location: 'Jabalpur',
    type: 'Forward',
    customer: 'LMN Suppliers',
    status: 'DO Created',
    items: 2,
    amount: 67000,
    createdDate: '2025-01-02',
    stage: 4
  }
];

const processStages = [
  { id: 1, title: 'Sales Order Created', description: 'Order created with location and type selection' },
  { id: 2, title: 'DO Sent to SAP', description: 'Delivery Order inquiry sent to SAP system' },
  { id: 3, title: 'Verification', description: 'Responsible person verifies and confirms' },
  { id: 4, title: 'DO Created', description: 'Delivery Order created and ready for dispatch' },
  { id: 5, title: 'Dispatched', description: 'Order dispatched and visible to dealer' }
];

export function ProcessManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const [newOrder, setNewOrder] = useState({
    customer: '',
    location: '',
    type: '',
    items: [{ sku: '', quantity: '', price: '' }]
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Created': return 'secondary';
      case 'DO Sent to SAP': return 'default';
      case 'Verified': return 'default';
      case 'DO Created': return 'default';
      case 'Dispatched': return 'default';
      default: return 'secondary';
    }
  };

  const getStageIcon = (stage, currentStage) => {
    if (stage < currentStage) return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (stage === currentStage) return <Clock className="w-5 h-5 text-blue-500" />;
    return <AlertCircle className="w-5 h-5 text-gray-300" />;
  };

  const addItem = () => {
    setNewOrder(prev => ({
      ...prev,
      items: [...prev.items, { sku: '', quantity: '', price: '' }]
    }));
  };

  const removeItem = (index) => {
    setNewOrder(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Process Management</h1>
          <p className="text-muted-foreground">Manage sales orders and delivery processes</p>
        </div>
        {/* <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Sales Order
        </Button> */}
        
      </div>

      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList>
          <TabsTrigger value="orders">Sales Orders</TabsTrigger>
          <TabsTrigger value="workflow">Process Workflow</TabsTrigger>
          {/* <TabsTrigger value="create">Create Order</TabsTrigger> */}
        </TabsList>

        <TabsContent value="orders">
          <div className="space-y-4">
            {salesOrders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{order.id}</h3>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {order.customer}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {order.location}
                        </span>
                        <span className="flex items-center">
                          <Package className="w-4 h-4 mr-1" />
                          {order.type}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                      <div className="text-sm text-muted-foreground mt-1">
                        ₹{order.amount.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Process Progress</span>
                      <span>{order.stage}/5 stages completed</span>
                    </div>
                    <Progress value={(order.stage / 5) * 100} />
                    
                    <div className="flex items-center justify-between pt-2">
                      <div className="text-sm text-muted-foreground">
                        {order.items} items • Created on {new Date(order.createdDate).toLocaleDateString()}
                      </div>
                      <Button variant="outline" size="sm" onClick={handleOpenModal}>
                        View Details
                      </Button>
                     
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="workflow">
          <Card>
            <CardHeader>
              <CardTitle>Sales Order Process Flow</CardTitle>
              <CardDescription>
                Step-by-step workflow from order creation to dispatch
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {processStages.map((stage, index) => (
                  <div key={stage.id} className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {getStageIcon(stage.id, 3)} {/* Example: showing stage 3 as current */}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{stage.title}</h4>
                      <p className="text-sm text-muted-foreground">{stage.description}</p>
                    </div>
                    {index < processStages.length - 1 && (
                      <ArrowRight className="w-4 h-4 text-muted-foreground mt-2" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-3">
            <Card>
              <CardHeader>
                <CardTitle>Key Process Points</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <FileText className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Order Creation</h4>
                      <p className="text-sm text-muted-foreground">Select location (Dewas/Jabalpur) and choose Ready/Forward options</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Send className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">SAP Integration</h4>
                      <p className="text-sm text-muted-foreground">Automatic DO inquiry sent to SAP system for processing</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <User className="w-5 h-5 text-orange-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Verification</h4>
                      <p className="text-sm text-muted-foreground">Responsible person verifies and confirms DO creation</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Process Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average Processing Time</span>
                    <span className="font-medium">2.5 days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Orders in Progress</span>
                    <span className="font-medium">4</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Completed This Month</span>
                    <span className="font-medium">23</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Success Rate</span>
                    <span className="font-medium text-green-600">95%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create New Sales Order</CardTitle>
              <CardDescription>
                Fill in the details to create a new sales order
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Customer Name</label>
                  <Input
                    placeholder="Enter customer name"
                    value={newOrder.customer}
                    onChange={(e) => setNewOrder(prev => ({ ...prev, customer: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <Select value={newOrder.location} onValueChange={(value) => setNewOrder(prev => ({ ...prev, location: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dewas">Dewas</SelectItem>
                      <SelectItem value="Jabalpur">Jabalpur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Order Type</label>
                <Select value={newOrder.type} onValueChange={(value) => setNewOrder(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select order type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ready">Ready</SelectItem>
                    <SelectItem value="Forward">Forward</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium">Order Items</label>
                  <Button variant="outline" size="sm" onClick={addItem}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Item
                  </Button>
                </div>
                
                {newOrder.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                    <div>
                      <label className="block text-sm font-medium mb-2">SKU</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select SKU" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SKU001">SKU001 - Premium Grade A</SelectItem>
                          <SelectItem value="SKU002">SKU002 - Standard Grade B</SelectItem>
                          <SelectItem value="SKU003">SKU003 - Economy Grade C</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Quantity</label>
                      <Input
                        type="number"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) => {
                          const updatedItems = [...newOrder.items];
                          updatedItems[index].quantity = e.target.value;
                          setNewOrder(prev => ({ ...prev, items: updatedItems }));
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Price</label>
                      <Input
                        type="number"
                        placeholder="Price"
                        value={item.price}
                        onChange={(e) => {
                          const updatedItems = [...newOrder.items];
                          updatedItems[index].price = e.target.value;
                          setNewOrder(prev => ({ ...prev, items: updatedItems }));
                        }}
                      />
                    </div>
                    <div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => removeItem(index)}
                        disabled={newOrder.items.length === 1}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline">Save as Draft</Button>
                <Button>Create Sales Order</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <h2 className="text-2xl font-bold mb-4">Delevery Order</h2>
        <div className='border rounded-md mt-5'style={{ backgroundColor: '#800000' }}>
        <h3 className='text-xl fond bold text-center p-2  text-white mt' >kriti Nutrients Limited</h3>
        </div>
        <Card className='mt-5'>
        <CardHeader>
          <div className='flex items-center justify-between'>
                <div className=''>Name</div>
                <div> Date</div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU Code</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">MRP (₹)</TableHead>
                  <TableHead className="text-right">Dealer Price (₹)</TableHead>
                  <TableHead className="text-right">Margin (%)</TableHead>
                 
                </TableRow>
              </TableHeader>
              <TableBody>
                {pricingData.Price.map((item, index) => (
                  <TableRow key={index} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{item.sku}</TableCell>
                    <TableCell>{item.productName}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell className="text-right">₹{item.mrp.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-medium">₹{item.dealerPrice.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{item.margin}%</TableCell>
                    
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {pricingData.Price.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No SKUs found matching your search criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
             


        
        <button
          onClick={handleCloseModal}
          className="mt-4 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
        >
          Close
        </button>
      </Modal>
    </div>
  );
}