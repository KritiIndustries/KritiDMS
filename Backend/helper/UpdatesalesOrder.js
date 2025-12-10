
import axios from "axios";
// //Production Credntial
// const SAP_BASE_URL = "http://182.74.4.110:1084/sap/opu/odata/sap/ZSD_SALES_ORDER_CRT_SRV";
// const USERNAME = "dev01";
// const PASSWORD = "Kriti@12";
// const BASIC_AUTH = "Basic " + Buffer.from(`${USERNAME}:${PASSWORD}`).toString("base64");
// //Devepolemnet Credncial
const SAP_BASE_URL = "http://182.74.4.110:1081/sap/opu/odata/sap/ZSALES_INDENT_SRV/SalesHdrSet";
const USERNAME = "dev01";
const PASSWORD = "Kriti@12";
const BASIC_AUTH = "Basic " + Buffer.from(`${USERNAME}:${PASSWORD}`).toString("base64");


async function fetchCsrfToken() {
    try {
        const response = await axios.get(SAP_BASE_URL, {
            headers: {
                "Content-Type": "application/json",
                "x-csrf-token": "fetch",
                Authorization: BASIC_AUTH,
            },
        });

        const csrfToken = response.headers["x-csrf-token"];
        const cookies = response.headers["set-cookie"]
            ?.map((c) => c.split(";")[0])
            .join("; ");

        console.log("✅ CSRF Token fetched successfully");
        return { csrfToken, cookies };
    } catch (error) {
        console.error("❌ Error fetching CSRF Token:");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Response:", error.response.data);
        } else {
            console.error(error.message);
        }
        throw error;
    }
}

async function breakeSalesOrder(csrfToken, cookies, SOdata) {
    // async function createContractOrder(dealer, cart, dealerCategory, SBOtype) {
    console.log("SOData", SOdata);

    const payload = {
        d: {
            Vbeln: SOdata.S_ORDER_NO, // Sales Order number
            SalesHdrItemNav: SOdata.materialOfSO.map((item, index) => ({
                Vbeln: SOdata.S_ORDER_NO,
                Posnr: String((index + 1) * 10).padStart(6, "0"), // e.g. 000010, 000020
                Matnr: item.sku,         // Material Number
                Kwmeng: String(item.quantity || 1), // Quantity as string
                Vrkme: SOdata.unit || "EA" // Default to EA if not provided
            }))
        }
    };
    console.log("Paload", JSON.stringify(payload));
    try {
        const response = await axios.post(`${SAP_BASE_URL}`, payload, {
            headers: {
                "Content-Type": "application/json",
                "x-csrf-token": csrfToken,
                Authorization: BASIC_AUTH,
                Cookie: cookies,
            },
        });
        const result = response.data?.d || {};
        console.log("✅ Sales Order Created Successfully");
        console.log("MESSAGE:", result.MESSAGE || "No SAP message");
        return result;
    } catch (error) {
        console.error("❌ Error creating Sales Order:");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Response:", JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(error.message);
        }
    }
}
// const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// const UpdateSalesOrder = async (SOdata) => {
//     try {
//         const { csrfToken, cookies } = await fetchCsrfToken();

//         for (const item of SOdata) {
//             const res = await breakeSalesOrder(csrfToken, cookies, item);
//             console.log(`✅ Sales Order ${item.S_ORDER_NO} updated successfully`);
//             await sleep(1000); // wait 1 second before next
//         }
//         console.log("🎯 All Sales Orders updated successfully!");
//     } catch (error) {
//         console.error("🚨 Process failed.", error);
//     }
// };

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const UpdateSalesOrder = async (SOdata) => {
    const summary = [];
    try {
        // 🔹 Step 1: Get CSRF token and cookies
        const { csrfToken, cookies } = await fetchCsrfToken();
        // 🔹 Step 2: Loop through SOs one by one
        for (const item of SOdata) {
            try {
                const response = await breakeSalesOrder(csrfToken, cookies, item);
                // 🔹 Step 3: Add success result to summary
                summary.push({
                    salesOrder: item.S_ORDER_NO,
                    status: "Success",
                    message: "Sales order updated successfully",
                    response: response?.d || response,
                });
                console.log(`✅ Sales Order ${item.S_ORDER_NO} updated successfully.`);
            } catch (err) {
                // 🔹 Step 4: Add failure result to summary
                summary.push({
                    salesOrder: item.S_ORDER_NO,
                    status: "Failed",
                    message: err.message || "Unknown error while updating sales order.",
                });
                console.error(`❌ Sales Order ${item.S_ORDER_NO} update failed:`, err.message);
            }
            // Optional small delay between requests
        }
        // 🔹 Step 5: Return summary array for frontend use
        return summary;
    } catch (error) {
        console.error("🚨 Error in UpdateSalesOrder:", error);
        return [
            {
                salesOrder: "N/A",
                status: "Critical Failure",
                message: error.message || "Failed to start sales order update process.",
            },
        ];
    }
};

export default UpdateSalesOrder