
import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Truck,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Phone,
  Package
} from "lucide-react";

import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from "./ui/table";

/* ================= HELPERS (YOUR LOGIC – KEPT AS-IS) ================= */

const parseSAPDate = (sapDate) => {
  if (!sapDate || sapDate.includes("253402")) return null;
  const ts = Number(sapDate.replace(/\D/g, ""));
  return new Date(ts);
};

const calculateProgress = (rec) => {
  if (rec.ChoutDate && !rec.ChoutDate.includes("253402")) return 100;
  if (rec.ChinDate && !rec.ChinDate.includes("253402")) return 75;
  if (rec.RptDt && !rec.RptDt.includes("253402")) return 40;
  return 10;
};

const calculateStatus = (progress) => {
  if (progress >= 100) return "Delivered";
  if (progress >= 75) return "In Transit";
  if (progress >= 40) return "Loading";
  return "Reported";
};

const countDOs = (rec) =>
  Object.keys(rec).filter(k => k.startsWith("Do") && rec[k]).length;

/* ================= UI HELPERS ================= */

const getStatusColor = (status) => {
  if (status === "Delivered") return "default";
  if (status === "In Transit") return "default";
  if (status === "Loading") return "secondary";
  return "secondary";
};

const getStatusIcon = (status) => {
  if (status === "Delivered") return <CheckCircle className="w-4 h-4 text-green-500" />;
  if (status === "In Transit") return <Truck className="w-4 h-4 text-blue-500" />;
  if (status === "Loading") return <Package className="w-4 h-4 text-yellow-500" />;
  return <Clock className="w-4 h-4 text-gray-500" />;
};

/* ================= COMPONENT ================= */

export function DispatchTracking() {
  const [dispatchData, setDispatchData] = useState([]);
  const [selectedDispatch, setSelectedDispatch] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH + NORMALIZE ================= */
  const trackingStages = [
    { stage: 'Vehicle Reported', progress: 0, time: "12:15 PM" },
    { stage: 'vehicle Gate in ', progress: 25, time: "12:45 PM" },
    { stage: 'Tare Weight', progress: 50, time: "01:05 PM" },
    { stage: 'DO Collected', progress: 75, time: "01:55 PM" },
    { stage: 'Gross Weight', progress: 100, time: "02:15 PM" },
    { stage: 'Invoice', progress: 100, time: "02:35 PM" },
    { stage: 'Vehicle Gate Out', progress: 100, time: "02:55 PM" }
  ];
  const fetchDispatchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://udaan.kritinutrients.com/dealer/dispatch");
      const sapData = res.data.data || [];
      console.log(sapData[0]);
      /* 🔥 CRITICAL PART – SHAPE MATCHING */
      setDispatchData(sapData);
      setSelectedDispatch(sapData[0] || null);

    } catch (e) {
      console.error("Dispatch fetch failed", e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDispatchData();
  }, []);

  if (loading) return <div className="p-6">Please wait...</div>;
  if (!selectedDispatch) return <div className="p-6">No dispatch data</div>;

  /* ================= RENDER (YOUR UI – UNCHANGED) ================= */

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Truck className="w-8 h-8 mr-3" />
            Dispatch Tracking
          </h1>
          <p className="text-muted-foreground">
            Real-time vehicle status and delivery tracking
          </p>
        </div>

        <Button variant="outline" onClick={fetchDispatchData}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Status
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ================= LEFT LIST ================= */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Active Dispatches</CardTitle>
            <CardDescription>
              Click on any delivery to view detailed tracking
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-3">
              {dispatchData.map((dispatch) => (
                <div
                  key={dispatch.id}
                  onClick={() => setSelectedDispatch(dispatch)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-accent ${selectedDispatch.id === dispatch.id
                    ? "border-primary bg-accent"
                    : ""
                    }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium">DO -{dispatch.dispatchId}</h4>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Truck className="w-3 h-3 mr-1" />
                        {dispatch.vehicleNo} • {dispatch.transporter}
                      </div>
                    </div>
                    <Badge variant={getStatusColor(dispatch.status)}>
                      {dispatch.status}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <MapPin className="w-3 h-3 mr-1 text-muted-foreground" />
                      <span>{dispatch.destination} </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{dispatch.progress}%</span>
                      </div>
                      <Progress value={dispatch.progress} />
                    </div>

                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>₹{dispatch.
                        totalValue.toLocaleString()}</span>
                      {/* <span>
                        ETA:{" "}
                        {dispatch.estimatedDelivery
                          ? dispatch.estimatedDelivery.toLocaleString()
                          : "-"}
                      </span> */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ================= RIGHT DETAILS ================= */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              {getStatusIcon(selectedDispatch.status)}
              <span className="ml-2">Tracking Details</span>
            </CardTitle>
            <CardDescription>{selectedDispatch.id}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">

            {/* BASIC INFO */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant={getStatusColor(selectedDispatch.status)}>
                  {selectedDispatch.status}
                </Badge>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Vehicle</span>
                <span className="text-sm font-medium">
                  {selectedDispatch.vehicleNo}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Driver</span>
                <span className="text-sm font-medium">
                  {selectedDispatch.driver}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Phone</span>
                <Button variant="link" size="sm" className="h-auto p-0">
                  <Phone className="w-3 h-3 mr-1" />
                  {selectedDispatch.driverPhone || "-"}
                </Button>
              </div>
            </div>

            {/* DELIVERY PROGRESS */}
            <div className="space-y-3">
              <h4 className="font-medium">Delivery Progress</h4>

              <div className="space-y-4">
                {trackingStages.map((stage, index) => {
                  const isCompleted = selectedDispatch.progress >= stage.progress;
                  const isCurrent =
                    selectedDispatch.progress >= stage.progress &&
                    (index === trackingStages.length - 1 ||
                      selectedDispatch.progress < trackingStages[index + 1].progress);

                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between w-full"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-3 h-3 rounded-full ${isCompleted
                            ? "bg-green-500"
                            : isCurrent
                              ? "bg-blue-500"
                              : "bg-gray-300"
                            }`}
                        />
                        <span
                          className={`text-sm ${isCompleted
                            ? "text-green-700 font-medium"
                            : isCurrent
                              ? "text-blue-700 font-medium"
                              : "text-muted-foreground"
                            }`}
                        >
                          {stage.stage}
                        </span>
                      </div>

                      {isCompleted && (
                        <span className="text-sm text-green-700 font-medium">
                          {stage.time}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SHIPMENT DETAILS */}
            <div className="space-y-3">
              <h4 className="font-medium">Shipment Details</h4>

              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Items</span>
                  <span>{selectedDispatch.items} units</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Value</span>
                  <span>
                    ₹{(selectedDispatch.value || 0).toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dispatched</span>
                  <span>
                    {selectedDispatch.dispatchTime
                      ? new Date(selectedDispatch.dispatchTime).toLocaleString()
                      : "-"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">ETA</span>
                  <span>
                    {selectedDispatch.estimatedDelivery
                      ? new Date(selectedDispatch.estimatedDelivery).toLocaleString()
                      : "-"}
                  </span>
                </div>
              </div>
            </div>

          </CardContent>
        </Card>



      </div>

      {/* ================= TABLE ================= */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Deliveries</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>DO Number</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {dispatchData.map((d) => (
                <TableRow key={d.id}>
                  <TableCell>{d.id}</TableCell>
                  <TableCell>{d.vehicleNo}</TableCell>
                  <TableCell>{d.destination}</TableCell>
                  {/* <TableCell>₹{d.value.toLocaleString()}</TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
