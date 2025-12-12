
import fetchZFRTData from "../helper/sapDispatch.service.js";
/* ---------- helpers ---------- */

function parseSAPDate(sapDate) {
    if (!sapDate || sapDate.includes("253402")) return null;
    const ts = Number(sapDate.replace(/\D/g, ""));
    return new Date(ts).toISOString();
}

function calculateProgress(rec) {
    if (rec.ChoutDate && !rec.ChoutDate.includes("253402")) return 100;
    if (rec.ChinDate && !rec.ChinDate.includes("253402")) return 75;
    if (rec.RptDt && !rec.RptDt.includes("253402")) return 40;
    return 10;
}

function calculateStatus(progress) {
    if (progress >= 100) return "Delivered";
    if (progress >= 75) return "In Transit";
    if (progress >= 40) return "Loading";
    return "Reported";
}

function extractDOs(rec) {
    return Object.keys(rec)
        .filter((k) => k.startsWith("Do") && rec[k])
        .map((k) => rec[k]);
}

/* ---------- controller ---------- */

export const getDispatchTracking = async (req, res) => {
    try {
        const { regio, vkorg, fromDate, toDate } = req.query;

        const rawData = await fetchZFRTData({
            Regio: regio,
            Vkorg: vkorg,
            fromDate,
            toDate,
        });

        const formatted = rawData.map((rec) => {
            const progress = calculateProgress(rec);

            return {
                dispatchId: rec.Do1 || rec.Sno,
                vehicleNo: rec.VehicleNo,
                transporter: rec.TrpName || "",
                driverPhone: rec.TransMobile || "",
                destination: rec.Destination1,
                status: calculateStatus(progress),
                progress,
                totalWeightMT: Number(rec.TotalWt || 0) / 1000,
                totalValue: Number(rec.TotaldoBill || 0),
                deliveryOrders: extractDOs(rec),
                reportedAt: parseSAPDate(rec.RptDt),
                gateInAt: parseSAPDate(rec.ChinDate),
                gateOutAt: parseSAPDate(rec.ChoutDate),
            };
        });

        res.status(200).json({
            success: true,
            count: formatted.length,
            data: formatted,
        });
    } catch (error) {
        console.error("Dispatch Tracking Error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to fetch dispatch tracking data from SAP",
        });
    }
}


