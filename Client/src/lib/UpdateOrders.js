import axios from "axios";

const SAP_BASE_URL = "http://182.74.4.110:1084/sap/opu/odata/sap/ZSALES_INDENT_SRV";
const USERNAME = "dev01";
const PASSWORD = "Kriti@12";
//const BASIC_AUTH = "Basic " + Buffer.from(`${USERNAME}:${PASSWORD}`).toString("base64");
async function fetchCsrfToken() {
    try {
        const response = await axios.get(SAP_BASE_URL, {
            headers: {
                "Content-Type": "application/json",
                "x-csrf-token": "fetch",
                Authorization: BASIC_AUTH,
                Cookie: "sap-usercontext=sap-client=900",
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

const updateSalesOrder = async () => {
    const { csrfToken, cookies } = await fetchCsrfToken();


    const payload = {
        d: {
            Vbeln: "869000",
            SalesHdrItemNav: [
                { Vbeln: "869000", Posnr: "000010", Matnr: "44001419", Kwmeng: "390", Vrkme: "EA" },
                { Vbeln: "869000", Posnr: "000020", Matnr: "44006326", Kwmeng: "50.00", Vrkme: "BOX" },
                { Vbeln: "869000", Posnr: "000030", Matnr: "44006211", Kwmeng: "60.00", Vrkme: "BOX" },
                { Vbeln: "869000", Posnr: "000040", Matnr: "44006211", Kwmeng: "2.00", Vrkme: "BOX" },
            ],
        },
    };

    try {
        const response = await axios.patch(`${SAP_BASE_URL}`, payload);
        console.log("✅ Response:", response.data);
    } catch (err) {
        console.error("❌ Error:", err.message);
    }

}


// export const breakeOrders = async (cart, pendingOrders) => {
//     try {
//         let remainingCart = [...cart]; // Copy cart items
//         let remainingWeight = remainingCart.reduce((sum, i) => sum + i.totalVolume, 0); // total kg in cart

//         for (const order of pendingOrders) {
//             const { S_ORDER_NO, totalVolumeInKG, MATERIAL_S } = order;

//             console.log(`🔍 Checking indent for SO: ${S_ORDER_NO}, Matnr: ${MATERIAL_S}`);

//             const checkIndent = await axios.get(
//                 `http://udaan.kritinutrients.com/dealer/checkIndentDone/${S_ORDER_NO}/${MATERIAL_S}`
//             );

//             const indentDone = checkIndent.data?.done;
//             if (indentDone) {
//                 console.log(`✅ Indent already done for SO ${S_ORDER_NO}, skipping...`);
//                 continue;
//             }

//             if (remainingWeight <= 0) {
//                 console.log("⚠️ No more items in cart.");
//                 break;
//             }

//             let allocatedItems = [];
//             let allocatedWeight = 0;

//             // Pick items from cart until order weight is satisfied
//             for (const item of [...remainingCart]) {
//                 if (allocatedWeight >= weight) break;
//                 const available = Math.min(item.weight, weight - allocatedWeight);
//                 allocatedItems.push({ ...item, Kwmeng: available });
//                 item.weight -= available;
//                 allocatedWeight += available;
//             }

//             remainingCart = remainingCart.filter((i) => i.weight > 0);
//             remainingWeight -= allocatedWeight;

//             if (allocatedWeight < weight) {
//                 console.log(
//                     `⚠️ Cart items insufficient for SO ${soNumber}. Required ${weight}kg, available ${allocatedWeight}kg`
//                 );
//             }

//             console.log(
//                 `🧾 Updating SAP Order ${soNumber} with ${allocatedItems.length} materials`
//             );

//             const updated = await updateSalesOrder(soNumber, allocatedItems);

//             if (updated) {
//                 console.log(`🚀 Hitting indentMaterial API for SO ${soNumber}`);
//                 await axios.post("http://udaan.kritinutrients.com/dealer/indentMaterial", {
//                     soNumber,
//                     materials: allocatedItems,
//                 });
//             }
//         }

//         console.log("🎯 All eligible Sales Orders processed successfully.");

//     } catch (error) {
//         console.error("❌ Error in submitOrder:", error.message);
//     }
// };

export const breakeOrders = async (cart, pendingOrders) => {
    try {
        let remainingCart = [...cart];
        let remainingWeight = remainingCart.reduce((sum, i) => sum + i.totalVolume, 0);

        for (const order of pendingOrders) {
            const { S_ORDER_NO, totalVolumeInKG, MATERIAL_S } = order;

            console.log(`🔍 Checking indent for SO: ${S_ORDER_NO}, Material: ${MATERIAL_S}`);

            // Step 1: check indent
            const checkIndent = await axios.get(
                `http://udaan.kritinutrients.com/dealer/checkIndentDone/${S_ORDER_NO}/${MATERIAL_S}`
            );

            if (checkIndent.data?.done) {
                console.log(`✅ Indent already done for SO ${S_ORDER_NO}, skipping...`);
                continue;
            }

            if (remainingWeight <= 0) {
                console.log("⚠️ No more items in cart.");
                break;
            }

            // Step 2: allocate from cart
            let allocatedItems = [];
            let allocatedWeight = 0;

            for (const item of [...remainingCart]) {
                if (allocatedWeight >= totalVolumeInKG) break;

                // Match material from SO to cart
                if (item.sku !== MATERIAL_S) continue;

                const available = Math.min(item.totalVolume, totalVolumeInKG - allocatedWeight);
                allocatedItems.push({ ...item, totalVolume: available });
                item.totalVolume -= available;
                allocatedWeight += available;
            }

            remainingCart = remainingCart.filter((i) => i.totalVolume > 0);
            remainingWeight -= allocatedWeight;

            if (allocatedWeight === 0) {
                console.log(
                    `⚠️ No matching material ${MATERIAL_S} found in cart for SO ${S_ORDER_NO}`
                );
                continue;
            }

            console.log(
                `🧾 Updating SAP Order ${S_ORDER_NO} with ${allocatedItems.length} items`
            );

            // Step 3: update SAP SO
            const updated = await updateSalesOrder(S_ORDER_NO, allocatedItems);

            // Step 4: mark indent done if SAP update successful
            if (updated) {
                console.log(`🚀 Sending indentMaterial API for SO ${S_ORDER_NO}`);
                await axios.post("http://udaan.kritinutrients.com/dealer/indentMaterial", {
                    SoNumber: S_ORDER_NO,
                    Material: MATERIAL_S,
                    quantity: allocatedWeight.toString(),
                    indent: true,
                });
            }
        }

        console.log("🎯 All eligible Sales Orders processed successfully.");
    } catch (error) {
        console.error("❌ Error in submitOrder:", error.message);
    }
};

export default updateSalesOrder;