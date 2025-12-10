
// import axios from "axios";
// function customRound(value) {
//     const decimal = value - Math.floor(value);
//     return decimal >= 0.5 ? Math.ceil(value) : Math.floor(value);
// }
// const BreakSalesOrder = async (SOData, materialData) => {
//     let balance = 0;
//     for (let i = 0; i < SOData.length; i++) {
//         console.log(`\n🔹 Processing SO: ${SOData[i].S_ORDER_NO}`);
//         let requiredWeight = SOData[i].totalVolumeInKG;
//         let assignIndex = 0;
//         // ✅ Ensure materialOfSO is initialized as array
//         if (!Array.isArray(SOData[i].materialOfSO)) {
//             SOData[i].materialOfSO = [];
//         }

//         for (let j = 0; j < materialData.length; j++) {
//             const material = materialData[j];

//             if (material.materialStatus === "X") continue;

//             console.log(`🔸 Material Selected: ${material.sku}`);
//             console.log(` Material Balance before assign: ${material.materialBalance.toFixed(2)}`);
//             console.log(`Required Weight: ${requiredWeight.toFixed(2)}`);

//             if (material.materialBalance >= requiredWeight) {
//                 // ✅ This material can fully satisfy the SO
//                 SOData[i].SOStatus = "X";
//                 let qty = requiredWeight / material.singleQTYWeight;
//                 qty = customRound(qty); // 👈 apply rounding logic here

//                 // 🔹 PUSH instead of direct assign
//                 SOData[i].materialOfSO.push({
//                     sku: material.sku,
//                     quantity: qty
//                 });

//                 // Deduct weight from material
//                 material.materialBalance -= requiredWeight;
//                 console.log(`✅ Assigned full weight from ${material.sku}`);
//                 console.log(`   Remaining material balance: ${material.materialBalance.toFixed(2)}`);

//                 if (material.materialBalance <= 0) material.materialStatus = "X";
//                 break;
//             } else {
//                 // ❌ Material not enough to complete SO — use remaining balance and move to next
//                 const usedWeight = material.materialBalance;
//                 let qtyForInsertion = usedWeight / material.singleQTYWeight;
//                 qtyForInsertion = customRound(qtyForInsertion); // 👈 apply rounding logic here

//                 SOData[i].materialOfSO.push({
//                     sku: material.sku,
//                     quantity: qtyForInsertion
//                 });
//                 console.log(`⚠️ Used partial balance of ${material.sku} = ${usedWeight.toFixed(2)}kg`);
//                 console.log(`Inserted Qty = ${qtyForInsertion} from ${material.sku}`);

//                 // Deduct used material, mark as exhausted
//                 requiredWeight -= usedWeight;
//                 material.materialBalance = 0;
//                 material.materialStatus = "X";
//                 assignIndex++;
//                 console.log(`   Remaining Required Weight: ${requiredWeight.toFixed(2)}`);
//                 // Continue to next material automatically
//             }
//         }

//         // ✅ If weight fulfilled
//         if (requiredWeight <= 0) {
//             console.log(`✅ SO ${SOData[i].S_ORDER_NO} fully assigned`);
//         } else {
//             console.log(`❌ SO ${SOData[i].S_ORDER_NO} could not be fully fulfilled`);
//         }
//     }
//     const filteredSOData = SOData.filter(
//         (so) => Array.isArray(so.materialOfSO) && so.materialOfSO.length > 0
//     );

//     console.log("\n✅ Final SO Data:", JSON.stringify(SOData, null, 2));
//     console.log("✅ Final Material Data:", JSON.stringify(materialData, null, 2));

//     const res = await axios.post("http://udaan.kritinutrients.com/dealer/break-orders", {
//         filteredSOData,
//     });
//     console.log(res);
// }

// export default BreakSalesOrder;


// import axios from "axios";

// function customRound(value) {
//     const decimal = value - Math.floor(value);
//     return decimal >= 0.5 ? Math.ceil(value) : Math.floor(value);
// }

// const BreakSalesOrder = async (SOData, materialData) => {
//     console.log("material Data of Function", materialData);

//     try {
//         let balance = 0;

//         for (let i = 0; i < SOData.length; i++) {
//             console.log(`\n🔹 Processing SO: ${SOData[i].S_ORDER_NO}`);
//             let requiredWeight = SOData[i].totalVolumeInKG;
//             let assignIndex = 0;

//             if (!Array.isArray(SOData[i].materialOfSO)) {
//                 SOData[i].materialOfSO = [];
//             }

//             for (let j = 0; j < materialData.length; j++) {
//                 const material = materialData[j];

//                 if (material.materialStatus === "X") continue;

//                 console.log(`🔸 Material Selected: ${material.sku}`);
//                 console.log(`   Material Balance before assign: ${material.materialBalance.toFixed(2)}`);
//                 console.log(`   Required Weight: ${requiredWeight.toFixed(2)}`);

//                 if (material.materialBalance >= requiredWeight) {
//                     // ✅ Fully fulfill the order with this material
//                     SOData[i].SOStatus = "X";
//                     let qty = requiredWeight / material.singleQTYWeight;
//                     qty = customRound(qty);

//                     SOData[i].materialOfSO.push({
//                         sku: material.sku,
//                         quantity: qty,
//                     });

//                     material.materialBalance -= requiredWeight;
//                     console.log(`✅ Assigned full weight from ${material.sku}`);
//                     console.log(`   Remaining material balance: ${material.materialBalance.toFixed(2)}`);

//                     if (material.materialBalance <= 0) material.materialStatus = "X";
//                     requiredWeight = 0;
//                     break;
//                 } else {
//                     // ⚠️ Partial allocation
//                     const usedWeight = material.materialBalance;
//                     let qtyForInsertion = usedWeight / material.singleQTYWeight;
//                     qtyForInsertion = customRound(qtyForInsertion);

//                     SOData[i].materialOfSO.push({
//                         sku: material.sku,
//                         quantity: qtyForInsertion,
//                     });

//                     requiredWeight -= usedWeight;
//                     material.materialBalance = 0;
//                     material.materialStatus = "X";

//                     console.log(`⚠️ Used partial balance of ${material.sku} = ${usedWeight.toFixed(2)}kg`);
//                     console.log(`   Remaining Required Weight: ${requiredWeight.toFixed(2)}`);
//                 }
//             }

//             // ✅ If still not fulfilled — add fallback material 44001419
//             if (requiredWeight > 0) {
//                 const fallbackMaterial = {
//                     sku: "44001419", // Fallback SKU
//                     singleQTYWeight: 13.65,
//                 };

//                 let qtyForFallback = requiredWeight / fallbackMaterial.singleQTYWeight;
//                 qtyForFallback = customRound(qtyForFallback);

//                 SOData[i].materialOfSO.push({
//                     sku: fallbackMaterial.sku,
//                     quantity: qtyForFallback,
//                 });

//                 console.log(`🟠 Added fallback material 44001419 for remaining ${requiredWeight.toFixed(2)}kg`);
//                 SOData[i].SOStatus = "Partially Fulfilled (Fallback Added)";
//             } else {
//                 console.log(`✅ SO ${SOData[i].S_ORDER_NO} fully assigned`);
//             }
//         }

//         // ✅ Filter out empty orders
//         const filteredSOData = SOData.filter(
//             (so) => Array.isArray(so.materialOfSO) && so.materialOfSO.length > 0
//         );

//         console.log("\n✅ Final SO Data:", JSON.stringify(filteredSOData, null, 2));
//         console.log("✅ Final Material Data:", JSON.stringify(materialData, null, 2));

//         // ✅ Send data to backend
//         const res = await axios.post("http://udaan.kritinutrients.com/dealer/break-orders", {
//             filteredSOData,
//         });

//         console.log("✅ API Response:", res.data);

//         // ✅ Return processed data for frontend usage
//         return {
//             apiResponse: res.data,
//             processedOrders: filteredSOData,
//         };
//     } catch (error) {
//         console.error("❌ Error in BreakSalesOrder:", error.message);
//         return {
//             apiResponse: null,
//             processedOrders: [],
//             error: error.message,
//         };
//     }
// };

// export default BreakSalesOrder;







//It is wokting but now priview
// import axios from "axios";

// // ✅ Custom round function (rounds 0.5 up)
// function customRound(value) {
//     const decimal = value - Math.floor(value);
//     return decimal >= 0.5 ? Math.ceil(value) : Math.floor(value);
// }

// // ✅ Main Function
// const BreakSalesOrder = async (SOData, materialData) => {
//     console.log("📦 Material Data Received:", materialData);
//     try {
//         for (let i = 0; i < SOData.length; i++) {
//             console.log(`\n🔹 Processing SO: ${SOData[i].S_ORDER_NO}`);
//             let requiredWeight = Number(SOData[i].totalVolumeInKG || 0);
//             if (isNaN(requiredWeight) || requiredWeight <= 0) continue;

//             SOData[i].materialOfSO = [];
//             SOData[i].SOStatus = "";

//             // ✅ Loop through available material stock
//             for (let j = 0; j < materialData.length; j++) {
//                 const material = materialData[j];

//                 if (material.materialStatus === "X") continue;

//                 const materialBalance = Number(material.materialBalance || 0);
//                 const singleWeight = Number(material.singleQTYWeight || 0);

//                 if (materialBalance <= 0 || singleWeight <= 0) continue;

//                 console.log(`🔸 Material Selected: ${material.sku}`);
//                 console.log(`   Balance: ${materialBalance.toFixed(2)} kg`);
//                 console.log(`   Required: ${requiredWeight.toFixed(2)} kg`);

//                 // ✅ FULL allocation
//                 if (materialBalance >= requiredWeight) {
//                     let qty = requiredWeight / singleWeight;
//                     qty = customRound(qty);

//                     SOData[i].materialOfSO.push({
//                         sku: material.sku,
//                         quantity: qty,
//                     });

//                     material.materialBalance -= requiredWeight;
//                     if (material.materialBalance <= 0) material.materialStatus = "X";

//                     SOData[i].SOStatus = "Fully Assigned";
//                     requiredWeight = 0;

//                     console.log(`✅ Full assigned from ${material.sku}, Qty: ${qty}`);
//                     console.log(`   Remaining Material: ${material.materialBalance.toFixed(2)} kg`);
//                     break;
//                 }
//                 // ✅ PARTIAL allocation
//                 else {
//                     const usedWeight = materialBalance;
//                     let qty = usedWeight / singleWeight;
//                     qty = customRound(qty);

//                     SOData[i].materialOfSO.push({
//                         sku: material.sku,
//                         quantity: qty,
//                     });

//                     requiredWeight -= usedWeight;
//                     material.materialBalance = 0;
//                     material.materialStatus = "X";

//                     console.log(`⚠️ Partial used ${material.sku}, Qty: ${qty}`);
//                     console.log(`   Remaining Required: ${requiredWeight.toFixed(2)} kg`);
//                 }
//             }

//             // ✅ Add fallback material if still remaining
//             if (requiredWeight > 0) {
//                 const fallbackMaterial = {
//                     sku: "44001419",
//                     singleQTYWeight: 13.65,
//                 };

//                 let qtyForFallback = requiredWeight / fallbackMaterial.singleQTYWeight;
//                 qtyForFallback = customRound(qtyForFallback);

//                 SOData[i].materialOfSO.push({
//                     sku: fallbackMaterial.sku,
//                     quantity: qtyForFallback,
//                 });

//                 SOData[i].SOStatus = "Partially Fulfilled (Fallback Added)";
//                 console.log(`🟠 Added fallback ${fallbackMaterial.sku}, Qty: ${qtyForFallback}`);
//             } else {
//                 console.log(`✅ SO ${SOData[i].S_ORDER_NO} fully fulfilled`);
//             }
//         }

//         // ✅ Filter final valid orders
//         const filteredSOData = SOData.filter(
//             (so) => Array.isArray(so.materialOfSO) && so.materialOfSO.length > 0
//         );

//         console.log("\n✅ Final SO Data:");
//         console.log(JSON.stringify(filteredSOData, null, 2));

//         console.log("\n✅ Final Material Data:");
//         console.log(JSON.stringify(materialData, null, 2));

//         // ✅ Send to backend (optional)
//         const res = await axios.post("http://udaan.kritinutrients.com/dealer/break-orders", {
//             filteredSOData,
//         });

//         console.log("✅ API Response:", res.data);

//         return {
//             apiResponse: res.data,
//             processedOrders: filteredSOData,
//         };
//     } catch (error) {
//         console.error("❌ Error in BreakSalesOrder:", error.message);
//         return {
//             apiResponse: null,
//             processedOrders: [],
//             error: error.message,
//         };
//     }
// };
// export default BreakSalesOrder;





















// BreakSalesOrder.js (frontend)
// import axios from "axios";

// // ✅ Custom round function (rounds 0.5 up)
// function customRound(value) {
//     const decimal = value - Math.floor(value);
//     return decimal >= 0.5 ? Math.ceil(value) : Math.floor(value);
// }

// /**
//  * BREAK SALES ORDER
//  *
//  * @param {Array} SODataInput - merged SO list (per category, FIFO sorted)
//  * @param {Array} materialDataInput - cart items of that category
//  * @param {boolean|object} optionsOrPreviewFlag
//  *    - boolean => preview flag (backward compatible)
//  *    - object  => { preview: boolean, categoryCapacityTon: number }
//  *
//  * Option A logic:
//  *  - Take SOs sequentially (FIFO)
//  *  - Use full SO weight until category capacity is reached
//  *  - Last SO may be partial (only up to remaining capacity)
//  */
// // const BreakSalesOrder = async (SODataInput, materialDataInput, optionsOrPreviewFlag) => {
// //     // ---- parse options / preview flag --------------------------------------
// //     let preview = false;
// //     let categoryCapacityTon = null;

// //     if (typeof optionsOrPreviewFlag === "boolean") {
// //         preview = optionsOrPreviewFlag;
// //     } else if (
// //         typeof optionsOrPreviewFlag === "object" &&
// //         optionsOrPreviewFlag !== null
// //     ) {
// //         preview = !!optionsOrPreviewFlag.preview;
// //         if (optionsOrPreviewFlag.categoryCapacityTon != null) {
// //             categoryCapacityTon = Number(optionsOrPreviewFlag.categoryCapacityTon);
// //         }
// //     }
// //     // ---- deep copy inputs so we don't mutate React state directly ---------
// //     // const SOData = (SODataInput || []).map((so) => ({ ...so }));
// //     // const materialData = (materialDataInput || []).map((m) => ({ ...m }));

// //     const SOData = JSON.parse(JSON.stringify(SODataInput));
// //     const materialData = JSON.parse(JSON.stringify(materialDataInput));


// //     console.log("📦 BreakSalesOrder – SOData IN:", SOData);
// //     console.log("📦 BreakSalesOrder – materialData IN:", materialData);
// //     console.log("📦 BreakSalesOrder – preview:", preview);
// //     console.log("📦 BreakSalesOrder – categoryCapacityTon:", categoryCapacityTon);

// //     try {
// //         // ---------------------------------------------------------------------
// //         // 1️⃣ Limit SOs by CATEGORY CAPACITY (Option A: FIFO, full-then-partial)
// //         // ---------------------------------------------------------------------
// //         let remainingCategoryKG =
// //             categoryCapacityTon != null ? categoryCapacityTon * 1000 : null;

// //         for (let i = 0; i < SOData.length; i++) {
// //             const so = SOData[i];

// //             const originalKG = Number(so.totalVolumeInKG || 0);
// //             if (!originalKG || originalKG <= 0) {
// //                 so.effectiveVolumeKG = 0;
// //                 so.SOStatus = "No Demand";
// //                 so.materialOfSO = [];
// //                 continue;
// //             }

// //             // if no category capacity handling → use full SO tonnage
// //             if (remainingCategoryKG == null) {
// //                 so.effectiveVolumeKG = originalKG;
// //                 continue;
// //             }

// //             if (remainingCategoryKG <= 0) {
// //                 so.effectiveVolumeKG = 0;
// //                 so.SOStatus = "Not Assigned (Capacity Full)";
// //                 so.materialOfSO = [];
// //                 continue;
// //             }

// //             if (originalKG <= remainingCategoryKG + 0.0001) {
// //                 // ✅ full SO can be taken
// //                 so.effectiveVolumeKG = originalKG;
// //                 remainingCategoryKG -= originalKG;
// //             } else {
// //                 // ✅ partial SO – only remaining category capacity
// //                 so.effectiveVolumeKG = remainingCategoryKG;
// //                 remainingCategoryKG = 0;
// //             }
// //         }

// //         console.log("📑 SOData after capacity trim:", SOData);

// //         // ---------------------------------------------------------------------
// //         // 2️⃣ Allocate MATERIALS to each SO (FIFO within that category)
// //         // ---------------------------------------------------------------------
// //         for (let i = 0; i < SOData.length; i++) {
// //             const so = SOData[i];
// //             let requiredWeight = Number(so.effectiveVolumeKG || 0);

// //             // nothing to allocate for this SO
// //             if (isNaN(requiredWeight) || requiredWeight <= 0) {
// //                 continue;
// //             }

// //             so.materialOfSO = [];
// //             so.SOStatus = "";

// //             // loop through available material stock
// //             for (let j = 0; j < materialData.length; j++) {
// //                 const material = materialData[j];

// //                 if (material.materialStatus === "X") continue;

// //                 let materialBalance = Number(material.materialBalance || 0);
// //                 const singleWeight = Number(material.singleQTYWeight || 0);

// //                 if (materialBalance <= 0 || singleWeight <= 0) continue;

// //                 console.log(
// //                     `🔸 SO ${so.S_ORDER_NO} – Material ${material.sku}, Balance=${materialBalance.toFixed(
// //                         2
// //                     )}kg, Required=${requiredWeight.toFixed(2)}kg`
// //                 );

// //                 // FULL allocation from this material
// //                 if (materialBalance >= requiredWeight - 0.0001) {
// //                     let qty = requiredWeight / singleWeight;
// //                     qty = customRound(qty);

// //                     if (qty > 0) {
// //                         const usedWeight = qty * singleWeight;

// //                         so.materialOfSO.push({
// //                             sku: material.sku,
// //                             quantity: qty,
// //                         });

// //                         material.materialBalance = materialBalance - usedWeight;
// //                         if (material.materialBalance <= 0) material.materialStatus = "X";

// //                         requiredWeight = 0;
// //                         so.SOStatus = "Fully Assigned";

// //                         console.log(
// //                             `✅ SO ${so.S_ORDER_NO} fully assigned from ${material.sku}, Qty=${qty}, usedWeight=${usedWeight}`
// //                         );
// //                     }
// //                     break; // go to next SO
// //                 } else {
// //                     // PARTIAL allocation – use all of this material and continue
// //                     let qty = materialBalance / singleWeight;
// //                     qty = customRound(qty);

// //                     if (qty > 0) {
// //                         const usedWeight = qty * singleWeight;

// //                         so.materialOfSO.push({
// //                             sku: material.sku,
// //                             quantity: qty,
// //                         });

// //                         requiredWeight -= usedWeight;
// //                         console.log(
// //                             `⚠️ SO ${so.S_ORDER_NO} partial from ${material.sku}, Qty=${qty}, usedWeight=${usedWeight}, remainingRequired=${requiredWeight}`
// //                         );
// //                     }

// //                     material.materialBalance = 0;
// //                     material.materialStatus = "X";
// //                 }
// //             }

// //             // -----------------------------------------------------------------
// //             // 3️⃣ Fallback SKU if still remaining requiredWeight only for 1419 to all categories
// //             // -----------------------------------------------------------------
// //             // if (requiredWeight > 0.0001) {
// //             //     const fallbackMaterial = {
// //             //         sku: "44001419",
// //             //         singleQTYWeight: 13.65,
// //             //     };

// //             //     let qtyForFallback = requiredWeight / fallbackMaterial.singleQTYWeight;
// //             //     qtyForFallback = customRound(qtyForFallback);

// //             //     if (qtyForFallback > 0) {
// //             //         so.materialOfSO.push({
// //             //             sku: fallbackMaterial.sku,
// //             //             quantity: qtyForFallback,
// //             //         });

// //             //         so.SOStatus =
// //             //             so.SOStatus && so.SOStatus.length > 0
// //             //                 ? `${so.SOStatus} + Fallback`
// //             //                 : "Partially Fulfilled (Fallback Added)";

// //             //         console.log(
// //             //             `🟠 SO ${so.S_ORDER_NO} – Fallback ${fallbackMaterial.sku}, Qty=${qtyForFallback}`
// //             //         );
// //             //     }
// //             // } else if (!so.SOStatus) {
// //             //     so.SOStatus = "Fully Assigned";
// //             // }

// //             // 3️⃣ Category-wise Fallback SKU
// //             // 3️⃣ Category-wise Fallback SKU
// //             // 3️⃣ Category-wise Fallback SKU
// //             if (requiredWeight > 0.0001) {
// //                 let fallbackMaterial = null;

// //                 switch (so.category) {
// //                     case "SFO": fallbackMaterial = { sku: "44005057", singleQTYWeight: 13.65 }; break;
// //                     case "SBO": fallbackMaterial = { sku: "44001419", singleQTYWeight: 13.65 }; break;
// //                     case "GNO": fallbackMaterial = { sku: "44006979", singleQTYWeight: 13.65 }; break;
// //                     case "KGMO": fallbackMaterial = { sku: "44007372", singleQTYWeight: 15.0 }; break;
// //                     default: fallbackMaterial = { sku: "44001419", singleQTYWeight: 13.65 }; break;
// //                 }

// //                 const qtyForFallback = customRound(requiredWeight / fallbackMaterial.singleQTYWeight);

// //                 if (qtyForFallback > 0) {
// //                     so.materialOfSO.push({
// //                         sku: fallbackMaterial.sku,
// //                         quantity: qtyForFallback,
// //                     });
// //                 }
// //             } else {
// //                 // If requiredWeight is zero but SO had effectiveVolume > used volume of SKUs
// //                 const diff = so.effectiveVolumeKG - so.materialOfSO.reduce((sum, x) => sum + x.quantity * x.singleQTYWeight, 0);

// //                 if (diff > 0.1) {
// //                     let fallbackMaterial = null;

// //                     switch (so.category) {
// //                         case "SFO": fallbackMaterial = { sku: "44005057", singleQTYWeight: 13.65 }; break;
// //                         case "SBO": fallbackMaterial = { sku: "44001419", singleQTYWeight: 13.65 }; break;
// //                         case "GNO": fallbackMaterial = { sku: "44006979", singleQTYWeight: 13.65 }; break;
// //                         case "KGMO": fallbackMaterial = { sku: "44007372", singleQTYWeight: 15.0 }; break;
// //                     }

// //                     const qtyFromDiff = customRound(diff / fallbackMaterial.singleQTYWeight);
// //                     if (qtyFromDiff > 0) {
// //                         so.materialOfSO.push({
// //                             sku: fallbackMaterial.sku,
// //                             quantity: qtyFromDiff,
// //                         });
// //                     }
// //                 }
// //             }



// //         }
// //         // ---------------------------------------------------------------------
// //         // 4️⃣ Filter final valid orders and either PREVIEW or POST to backend
// //         // ---------------------------------------------------------------------
// //         const filteredSOData = SOData.filter(
// //             (so) => Array.isArray(so.materialOfSO) && so.materialOfSO.length > 0
// //         );

// //         console.log("\n✅ Final SO Data (after break):");
// //         console.log(JSON.stringify(filteredSOData, null, 2));

// //         console.log("\n✅ Final Material Data (after allocation):");
// //         console.log(JSON.stringify(materialData, null, 2));

// //         if (preview) {
// //             // ⛔ PREVIEW MODE – DO NOT CALL BACKEND
// //             console.log("👀 Preview mode ON – skipping API call to /dealer/break-orders");
// //             return {
// //                 apiResponse: null,
// //                 processedOrders: filteredSOData,
// //             };
// //         }

// //         // ✅ Real API call to backend
// //         const res = await axios.post("http://udaan.kritinutrients.com/dealer/break-orders", {
// //             filteredSOData,
// //         });

// //         console.log("✅ API Response from backend:", res.data);

// //         return {
// //             apiResponse: res.data,
// //             processedOrders: filteredSOData,
// //         };
// //     } catch (error) {
// //         console.error("❌ Error in BreakSalesOrder:", error.message);
// //         return {
// //             apiResponse: null,
// //             processedOrders: [],
// //             error: error.message,
// //         };
// //     }
// // };




// const BreakSalesOrder = async (SODataInput, materialDataInput, optionsOrPreviewFlag) => {
//     console.log("SOData", SODataInput);
//     console.log("material input", materialDataInput);


//     let preview = false;
//     let categoryCapacityTon = null;

//     if (typeof optionsOrPreviewFlag === "boolean") {
//         preview = optionsOrPreviewFlag;
//     } else if (typeof optionsOrPreviewFlag === "object" && optionsOrPreviewFlag !== null) {
//         preview = !!optionsOrPreviewFlag.preview;
//         categoryCapacityTon = Number(optionsOrPreviewFlag.categoryCapacityTon);
//     }

//     // Deep cloning
//     const SOData = (SODataInput || []).map((so) => ({ ...so }));
//     const materialData = (materialDataInput || []).map((m) => ({ ...m }));

//     try {
//         let remainingCategoryKG =
//             categoryCapacityTon != null ? categoryCapacityTon * 1000 : null;

//         // Phase 1: distribute available KG to FIFO SOs
//         for (let so of SOData) {
//             const originalKG = Number(so.totalVolumeInKG || 0);

//             if (!originalKG || originalKG <= 0) {
//                 so.effectiveVolumeKG = 0;
//                 so.materialOfSO = [];
//                 continue;
//             }

//             if (remainingCategoryKG == null) {
//                 so.effectiveVolumeKG = originalKG;
//                 continue;
//             }

//             if (remainingCategoryKG <= 0) {
//                 so.effectiveVolumeKG = 0;
//                 so.materialOfSO = [];
//                 continue;
//             }

//             if (originalKG <= remainingCategoryKG) {
//                 so.effectiveVolumeKG = originalKG;
//                 remainingCategoryKG -= originalKG;
//             } else {
//                 so.effectiveVolumeKG = remainingCategoryKG;
//                 remainingCategoryKG = 0;
//             }
//         }

//         // Phase 2: Assign SKU quantities against allocated SO KG
//         for (let so of SOData) {
//             so.category = so.category || SODataInput[0]?.category;   // FIX ensures category always exists
//             let requiredWeight = Number(so.effectiveVolumeKG || 0);
//             so.materialOfSO = [];

//             for (let material of materialData) {
//                 if (material.materialStatus === "X") continue;

//                 let bal = Number(material.materialBalance || 0);
//                 const wt = Number(material.singleQTYWeight || 0);

//                 if (bal <= 0 || wt <= 0) continue;

//                 // Case 1: material balance can fulfil remaining weight
//                 if (bal >= requiredWeight) {
//                     let qty = customRound(requiredWeight / wt);

//                     if (qty > 0) {
//                         let usedWeight = qty * wt;
//                         if (usedWeight > bal) {
//                             qty = Math.floor(bal / wt);
//                             usedWeight = qty * wt;
//                         }

//                         if (qty > 0) {
//                             const existing = so.materialOfSO.find((m) => m.sku === material.sku);
//                             if (existing) existing.quantity += qty;
//                             else so.materialOfSO.push({ sku: material.sku, quantity: qty });

//                             bal -= usedWeight;
//                             requiredWeight = Math.max(requiredWeight - usedWeight, 0);
//                         }
//                     }

//                     material.materialBalance = bal;
//                     if (bal <= 0) material.materialStatus = "X";

//                     break;
//                 }

//                 // Case 2: use full balance of this SKU
//                 else {
//                     let qty = customRound(bal / wt);

//                     if (qty > 0) {
//                         const usedWeight = qty * wt;

//                         so.materialOfSO.push({ sku: material.sku, quantity: qty });

//                         requiredWeight = Math.max(requiredWeight - usedWeight, 0);
//                         bal = Math.max(bal - usedWeight, 0);
//                     }

//                     material.materialBalance = bal;
//                     if (bal <= 0) material.materialStatus = "X";
//                 }
//             }

//             // =========================
//             // FALLBACK MATERIAL (if requiredWeight still remains)
//             // =========================
//             // FALLBACK MATERIAL (if requiredWeight still remains)
//             if (requiredWeight > 0.01) {
//                 let fallbackSku = "44001419"; // default SBO
//                 let fallbackUnitWeight = 13.65; // per bag

//                 switch (so.category) {
//                     case "SFO":
//                         fallbackSku = "44005057";
//                         fallbackUnitWeight = 13.65;
//                         break;
//                     case "GNO":
//                         fallbackSku = "44006979";
//                         fallbackUnitWeight = 13.65;
//                         break;
//                     case "KGMO":
//                         fallbackSku = "44007372";
//                         fallbackUnitWeight = 15;
//                         break;
//                 }

//                 // Guarantee minimum 1 fallback
//                 let qty = Math.max(1, customRound(requiredWeight / fallbackUnitWeight));

//                 const exists = so.materialOfSO.find((m) => m.sku === fallbackSku);
//                 if (exists) exists.quantity += qty;
//                 else so.materialOfSO.push({ sku: fallbackSku, quantity: qty });

//                 requiredWeight = 0;
//             }

//         }

//         const filteredSOData = SOData.filter(
//             (so) => Array.isArray(so.materialOfSO) && so.materialOfSO.length > 0
//         );
//         console.log("Data", filteredSOData);

//         if (preview) {
//             return { apiResponse: null, processedOrders: filteredSOData };
//         }

//         const res = await axios.post("http://udaan.kritinutrients.com/dealer/break-orders", {
//             filteredSOData,
//         });

//         return { apiResponse: res.data, processedOrders: filteredSOData };
//     } catch (err) {
//         console.error(err);
//         return { apiResponse: null, processedOrders: [], error: err.message };
//     }
// };




// export default BreakSalesOrder;

//This is Working Fully Fine
// import axios from "axios";

// function customRound(value) {
//     const decimal = value - Math.floor(value);
//     return decimal >= 0.5 ? Math.ceil(value) : Math.floor(value);
// }

// const BreakSalesOrder = async (SODataInput, materialDataInput, optionsOrPreviewFlag) => {
//     let preview = false;

//     if (typeof optionsOrPreviewFlag === "boolean") {
//         preview = optionsOrPreviewFlag;
//     } else if (typeof optionsOrPreviewFlag === "object" && optionsOrPreviewFlag !== null) {
//         preview = !!optionsOrPreviewFlag.preview;
//     }

//     // deep clone
//     const SOData = (SODataInput || []).map(s => ({ ...s }));
//     const materialData = (materialDataInput || []).map(m => ({ ...m }));

//     try {
//         for (let i = 0; i < SOData.length; i++) {

//             let requiredWeight = Number(SOData[i].totalVolumeInKG || 0);
//             if (isNaN(requiredWeight) || requiredWeight <= 0) continue;

//             SOData[i].materialOfSO = [];
//             SOData[i].SOStatus = "";

//             for (let j = 0; j < materialData.length; j++) {
//                 const material = materialData[j];
//                 if (material.materialStatus === "X") continue;

//                 const materialBalance = Number(material.materialBalance || 0);
//                 const singleWeight = Number(material.singleQTYWeight || 0);
//                 if (materialBalance <= 0 || singleWeight <= 0) continue;

//                 // FULL allocation
//                 if (materialBalance >= requiredWeight) {
//                     let qty = requiredWeight / singleWeight;
//                     qty = customRound(qty);

//                     SOData[i].materialOfSO.push({
//                         sku: material.sku,
//                         quantity: qty,
//                     });

//                     material.materialBalance -= requiredWeight;
//                     if (material.materialBalance <= 0) material.materialStatus = "X";

//                     SOData[i].SOStatus = "Fully Assigned";
//                     requiredWeight = 0;
//                     break;
//                 }

//                 // PARTIAL allocation
//                 else {
//                     const usedWeight = materialBalance;
//                     let qty = usedWeight / singleWeight;
//                     qty = customRound(qty);

//                     SOData[i].materialOfSO.push({
//                         sku: material.sku,
//                         quantity: qty,
//                     });

//                     requiredWeight -= usedWeight;
//                     material.materialBalance = 0;
//                     material.materialStatus = "X";
//                 }
//             }

//             // =========================
//             //  FALLBACK MATERIAL
//             // =========================
//             if (requiredWeight > 0) {
//                 const fallbackMaterial = {
//                     sku: "44001419",
//                     singleQTYWeight: 13.65,
//                 };

//                 let qtyForFallback = requiredWeight / fallbackMaterial.singleQTYWeight;
//                 qtyForFallback = customRound(qtyForFallback);

//                 SOData[i].materialOfSO.push({
//                     sku: fallbackMaterial.sku,
//                     quantity: qtyForFallback,
//                 });

//                 SOData[i].SOStatus = "Partially Fulfilled (Fallback Added)";
//             }
//         }

//         const filteredSOData = SOData.filter(
//             so => Array.isArray(so.materialOfSO) && so.materialOfSO.length > 0
//         );

//         if (preview) {
//             return { apiResponse: null, processedOrders: filteredSOData };
//         }

//         // Real submit
//         const res = await axios.post("http://udaan.kritinutrients.com/dealer/break-orders", {
//             filteredSOData,
//         });

//         return { apiResponse: res.data, processedOrders: filteredSOData };

//     } catch (err) {
//         console.error(err);
//         return { apiResponse: null, processedOrders: [], error: err.message };
//     }
// };

// export default BreakSalesOrder;





//Working fine but selected SO first which have more weight
// import axios from "axios";

// function customRound(value) {
//     const decimal = value - Math.floor(value);
//     return decimal >= 0.5 ? Math.ceil(value) : Math.floor(value);
// }

// const BreakSalesOrder = async (SODataInput, materialDataInput, optionsOrPreviewFlag) => {
//     let preview = false;

//     if (typeof optionsOrPreviewFlag === "boolean") {
//         preview = optionsOrPreviewFlag;
//     } else if (typeof optionsOrPreviewFlag === "object" && optionsOrPreviewFlag !== null) {
//         preview = !!optionsOrPreviewFlag.preview;
//     }

//     const SOData = (SODataInput || []).map((so) => ({ ...so }));
//     const materialData = (materialDataInput || []).map((m) => ({ ...m }));

//     try {
//         for (let i = 0; i < SOData.length; i++) {
//             let requiredWeight = Number(SOData[i].totalVolumeInKG || 0);
//             if (isNaN(requiredWeight) || requiredWeight <= 0) continue;

//             SOData[i].materialOfSO = [];
//             SOData[i].SOStatus = "";

//             // Assign material from cart balance
//             for (let j = 0; j < materialData.length; j++) {
//                 const material = materialData[j];
//                 if (material.materialStatus === "X") continue;

//                 const bal = Number(material.materialBalance || 0);
//                 const wt = Number(material.singleQTYWeight || 0);
//                 if (bal <= 0 || wt <= 0) continue;

//                 // FULL allocation
//                 if (bal >= requiredWeight) {
//                     let qty = customRound(requiredWeight / wt);

//                     SOData[i].materialOfSO.push({ sku: material.sku, quantity: qty });

//                     material.materialBalance -= requiredWeight;
//                     if (material.materialBalance <= 0) material.materialStatus = "X";

//                     requiredWeight = 0;
//                     break;
//                 }

//                 // PARTIAL allocation
//                 else {
//                     let qty = customRound(bal / wt);

//                     SOData[i].materialOfSO.push({ sku: material.sku, quantity: qty });

//                     requiredWeight -= bal;
//                     material.materialBalance = 0;
//                     material.materialStatus = "X";
//                 }
//             }

//             // ====================================
//             // FALLBACK MAPPING BY CATEGORY
//             // ====================================
//             if (requiredWeight > 0.01) {
//                 let fallbackSku = "";
//                 let fallbackUnitWeight = 13.65;

//                 switch (SOData[i].category) {
//                     case "SFO":
//                         fallbackSku = "44005057";
//                         fallbackUnitWeight = 13.65;
//                         break;
//                     case "GNO":
//                         fallbackSku = "44006979";
//                         fallbackUnitWeight = 13.65;
//                         break;
//                     case "KGMO":
//                         fallbackSku = "44007372";
//                         fallbackUnitWeight = 15;
//                         break;
//                     default: // SBO fallback
//                         fallbackSku = "44001419";
//                         fallbackUnitWeight = 13.65;
//                 }

//                 let qtyFallback = customRound(requiredWeight / fallbackUnitWeight);
//                 qtyFallback = Math.max(1, qtyFallback);

//                 SOData[i].materialOfSO.push({
//                     sku: fallbackSku,
//                     quantity: qtyFallback,
//                 });

//                 SOData[i].SOStatus = "Partially Fulfilled (Fallback Added)";
//                 requiredWeight = 0;
//             }
//         }

//         const filteredSOData = SOData.filter(
//             (so) => Array.isArray(so.materialOfSO) && so.materialOfSO.length > 0
//         );

//         if (preview) {
//             return { apiResponse: null, processedOrders: filteredSOData };
//         }

//         const res = await axios.post("http://udaan.kritinutrients.com/dealer/break-orders", {
//             filteredSOData,
//         });

//         return { apiResponse: res.data, processedOrders: filteredSOData };

//     } catch (err) {
//         console.error("BreakSalesOrder Error:", err);
//         return { apiResponse: null, processedOrders: [], error: err.message };
//     }
// };

// export default BreakSalesOrder;
















//This is Working fully fine but taking all SO for Indent 
// function customRound(value) {
//     const decimal = value - Math.floor(value);
//     return decimal >= 0.5 ? Math.ceil(value) : Math.floor(value);
// }

// const FALLBACK_MAP = {
//     SBO: { sku: "44001419", wt: 13.65 },
//     SFO: { sku: "44005057", wt: 13.65 },
//     GNO: { sku: "44006979", wt: 13.65 },
//     KGMO: { sku: "44007372", wt: 15 },
// };

// const BreakSalesOrder = async (SODataInput, materialDataInput, optionsOrPreviewFlag) => {
//     let preview = false;

//     if (typeof optionsOrPreviewFlag === "boolean") {
//         preview = optionsOrPreviewFlag;
//     } else if (typeof optionsOrPreviewFlag === "object" && optionsOrPreviewFlag !== null) {
//         preview = !!optionsOrPreviewFlag.preview;
//     }

//     // Clone to avoid mutation
//     const SOData = (SODataInput || []).map((so) => ({ ...so }));
//     const materialData = (materialDataInput || []).map((m) => ({ ...m }));

//     try {
//         // Reset fields
//         SOData.forEach((so) => {
//             so.materialOfSO = [];
//             so.SOStatus = "";
//         });

//         // Ensure SOData is FIFO sorted before processing (VERY IMPORTANT)
//         SOData.sort((a, b) => {
//             const tA = Number(a.TO_DATE);
//             const tB = Number(b.TO_DATE);
//             if (tA === tB) return Number(a.S_ORDER_NO) - Number(b.S_ORDER_NO);
//             return tA - tB;
//         });

//         // ============================================================
//         // STEP 1: APPLY SELECTED SKUs FIRST (SKU-LOOP → SO-LOOP)
//         // ============================================================
//         for (let m = 0; m < materialData.length; m++) {
//             let mat = materialData[m];
//             let bal = Number(mat.materialBalance || 0);
//             const wt = Number(mat.singleQTYWeight || 0);

//             if (bal <= 0 || wt <= 0) continue;

//             // Loop SOs FIFO
//             for (let s = 0; s < SOData.length && bal > 0; s++) {
//                 let so = SOData[s];
//                 let required = Number(so.totalVolumeInKG) -
//                     (so.materialOfSO.reduce((sum, item) => {
//                         const thisSku = materialData.find((x) => x.sku === item.sku);
//                         return sum + (thisSku ? thisSku.singleQTYWeight * item.quantity : 0);
//                     }, 0));

//                 if (required <= 0) continue;

//                 // FULL allocation
//                 if (bal >= required) {
//                     let qty = customRound(required / wt);
//                     qty = Math.max(1, qty);

//                     so.materialOfSO.push({ sku: mat.sku, quantity: qty });

//                     bal -= qty * wt;
//                     materialData[m].materialBalance = Math.max(0, bal);
//                     if (bal <= 0) mat.materialStatus = "X";
//                 }
//                 // PARTIAL allocation
//                 else {
//                     let qty = customRound(bal / wt);
//                     if (qty <= 0) break;

//                     so.materialOfSO.push({ sku: mat.sku, quantity: qty });

//                     required -= qty * wt;
//                     bal = 0;
//                     materialData[m].materialBalance = 0;
//                     mat.materialStatus = "X";
//                 }
//             }
//         }

//         // ============================================================
//         // STEP 2: FALLBACK MATERIAL PER CATEGORY
//         // ============================================================
//         for (let s = 0; s < SOData.length; s++) {
//             let so = SOData[s];

//             let allocated = so.materialOfSO.reduce((sum, item) => {
//                 const cm = materialData.find((x) => x.sku === item.sku);
//                 return sum + (cm ? cm.singleQTYWeight * item.quantity : 0);
//             }, 0);

//             let requiredLeft = Number(so.totalVolumeInKG) - allocated;

//             if (requiredLeft > 0.1) {
//                 const fb = FALLBACK_MAP[so.category] || FALLBACK_MAP["SBO"];

//                 let qty = customRound(requiredLeft / fb.wt);
//                 qty = Math.max(1, qty);

//                 so.materialOfSO.push({
//                     sku: fb.sku,
//                     quantity: qty,
//                 });

//                 so.SOStatus = "Fallback Added";
//             } else {
//                 so.SOStatus = "Fully Assigned";
//             }
//         }

//         const filteredSOData = SOData.filter(
//             (so) => Array.isArray(so.materialOfSO) && so.materialOfSO.length > 0
//         );

//         // PREVIEW MODE
//         if (preview) {
//             return { apiResponse: null, processedOrders: filteredSOData };
//         }
//         // FINAL SUBMISSION
//         const res = await axios.post("http://udaan.kritinutrients.com/dealer/break-orders", {
//             filteredSOData,
//         });

//         return { apiResponse: res.data, processedOrders: filteredSOData };

//     } catch (err) {
//         console.error("BreakSalesOrder Error:", err);
//         return { apiResponse: null, processedOrders: [], error: err.message };
//     }
// };
// export default BreakSalesOrder;




//This is working fully fine
// function customRound(value) {
//     const d = value - Math.floor(value);
//     return d >= 0.5 ? Math.ceil(value) : Math.floor(value);
// }

// const FALLBACK_MAP = {
//     SBO: { sku: "44001419", wt: 13.65 },
//     SFO: { sku: "44005057", wt: 13.65 },
//     GNO: { sku: "44006979", wt: 13.65 },
//     KGMO: { sku: "44007372", wt: 15 },
// };

// const BreakSalesOrder = async (SOInput, materialInput, options = {}) => {
//     const preview = !!options.preview;
//     const categoryCapKG = (options.categoryCapacityTon || 0) * 1000;

//     const SOs = SOInput.map((s) => ({
//         ...s,
//         materialOfSO: [],
//         SOStatus: "",
//         isSelectedForBreak: false,
//     }));

//     const materials = materialInput.map((m) => ({ ...m }));

//     // ✅ FIFO by expiry
//     SOs.sort((a, b) => Number(a.TO_DATE) - Number(b.TO_DATE));

//     // ✅ Phase-1: SELECT SOs (FIFO) using capacity
//     let remainingSelKG = categoryCapKG;

//     for (const so of SOs) {
//         const soKG = Number(so.totalVolumeInKG || 0);
//         if (remainingSelKG <= 0) break;

//         so.isSelectedForBreak = true;
//         remainingSelKG -= soKG;
//     }

//     // ✅ Phase-2: Selected SKUs go into SELECTED SOs only
//     for (const mat of materials) {
//         let bal = Number(mat.materialBalance || 0);
//         const wt = Number(mat.singleQTYWeight || 0);
//         if (!bal || !wt) continue;

//         for (const so of SOs) {
//             if (!so.isSelectedForBreak || bal <= 0) continue;

//             const usedKG = so.materialOfSO.reduce(
//                 (s, i) =>
//                     s +
//                     i.quantity *
//                     (materials.find((x) => x.sku === i.sku)?.singleQTYWeight || 0),
//                 0
//             );

//             const remainingSOkg = so.totalVolumeInKG - usedKG;
//             if (remainingSOkg <= 0) continue;

//             const allocKG = Math.min(remainingSOkg, bal);
//             let qty = customRound(allocKG / wt);
//             qty = Math.max(0, qty);

//             if (qty > 0) {
//                 so.materialOfSO.push({ sku: mat.sku, quantity: qty });
//                 bal -= qty * wt;
//             }
//         }

//         mat.materialBalance = bal;
//     }

//     // ✅ Phase-3: FALLBACK → FULL REMAINING SO VOLUME
//     for (const so of SOs) {
//         if (!so.isSelectedForBreak) continue;

//         const allocatedKG = so.materialOfSO.reduce((s, m) => {
//             const wt =
//                 materials.find((x) => x.sku === m.sku)?.singleQTYWeight || 0;
//             return s + m.quantity * wt;
//         }, 0);

//         let remainingKG = so.totalVolumeInKG - allocatedKG;

//         if (remainingKG > 0.1) {
//             const fb = FALLBACK_MAP[so.category] || FALLBACK_MAP.SBO;
//             let qty = customRound(remainingKG / fb.wt);
//             qty = Math.max(1, qty);

//             so.materialOfSO.push({
//                 sku: fb.sku,
//                 quantity: qty,
//             });

//             so.SOStatus = "Fallback Added";
//         } else {
//             so.SOStatus = "Filled by Selected SKUs";
//         }
//     }
//     const result = SOs.filter((s) => s.materialOfSO.length > 0);

//     if (preview) {
//         return { processedOrders: result };
//     }
//     const res = await axios.post(
//         "http://udaan.kritinutrients.com/dealer/break-orders",
//         { filteredSOData: result }
//     );

//     return { apiResponse: res.data, processedOrders: result };
// };

// export default BreakSalesOrder;




import axios from "axios";

function customRound(value) {
    const d = value - Math.floor(value);
    return d >= 0.5 ? Math.ceil(value) : Math.floor(value);
}

const FALLBACK_MAP = {
    SBO: { sku: "44001419", wt: 13.65 },
    SFO: { sku: "44005057", wt: 13.65 },
    GNO: { sku: "44006979", wt: 13.65 },
    KGMO: { sku: "44007372", wt: 15 },
};

const BreakSalesOrder = async (SOInput, materialInput, options = {}) => {
    const preview = !!options.preview;
    const categoryCapKG = (options.categoryCapacityTon || 0) * 1000;

    /* ---------------- INIT ---------------- */
    const SOs = SOInput.map((s) => ({
        ...s,
        materialOfSO: [],
        SOStatus: "",
        isSelectedForBreak: false,
    }));

    const materials = materialInput.map((m) => ({ ...m }));

    /* ---------------- FIFO BY EXPIRY ---------------- */
    SOs.sort((a, b) => Number(a.TO_DATE) - Number(b.TO_DATE));

    /* ---------------- PHASE-1: SELECT SOs ---------------- */
    let remainingSelKG = categoryCapKG;

    // Minimum allocatable unit across selected materials
    const minUnitKG = Math.min(
        ...materials.map((m) => Number(m.singleQTYWeight || Infinity))
    );

    for (const so of SOs) {
        const soKG = Number(so.totalVolumeInKG || 0);

        // ❌ Not enough capacity to serve even 1 unit
        if (remainingSelKG < minUnitKG) break;

        // ❌ SO itself cannot be meaningfully served
        if (remainingSelKG < soKG && remainingSelKG < minUnitKG) break;

        so.isSelectedForBreak = true;
        remainingSelKG -= soKG;
    }

    /* ---------------- PHASE-2: ALLOCATE SELECTED SKUs ---------------- */
    for (const mat of materials) {
        let bal = Number(mat.materialBalance || 0);
        const wt = Number(mat.singleQTYWeight || 0);
        if (!bal || !wt) continue;

        for (const so of SOs) {
            if (!so.isSelectedForBreak || bal <= 0) continue;

            const allocatedKG = so.materialOfSO.reduce((s, m) => {
                const mw =
                    materials.find((x) => x.sku === m.sku)?.singleQTYWeight || 0;
                return s + m.quantity * mw;
            }, 0);

            const remainingSOkg = so.totalVolumeInKG - allocatedKG;
            if (remainingSOkg <= 0) continue;

            const allocKG = Math.min(remainingSOkg, bal);
            let qty = customRound(allocKG / wt);
            if (qty <= 0) continue;

            so.materialOfSO.push({ sku: mat.sku, quantity: qty });
            bal -= qty * wt;
        }

        mat.materialBalance = bal;
    }

    /* ---------------- PHASE-3: FALLBACK ONLY IF PARTIAL ---------------- */
    for (const so of SOs) {
        if (!so.isSelectedForBreak) continue;

        const allocatedKG = so.materialOfSO.reduce((s, m) => {
            const wt =
                materials.find((x) => x.sku === m.sku)?.singleQTYWeight || 0;
            return s + m.quantity * wt;
        }, 0);

        const remainingKG = so.totalVolumeInKG - allocatedKG;
        const fb = FALLBACK_MAP[so.category] || FALLBACK_MAP.SBO;

        // ✅ Add fallback ONLY if ≥ 1 full fallback unit is missing
        if (remainingKG >= fb.wt - 0.001) {
            let qty = Math.floor(remainingKG / fb.wt);
            qty = Math.max(1, qty);

            so.materialOfSO.push({
                sku: fb.sku,
                quantity: qty,
            });

            so.SOStatus = "Fallback Added";
        } else {
            so.SOStatus = "Filled by Selected SKUs";
        }
    }

    /* ---------------- FINAL RESULT ---------------- */
    const result = SOs.filter((s) => s.materialOfSO.length > 0);

    if (preview) {
        return { processedOrders: result };
    }

    const res = await axios.post(
        "http://udaan.kritinutrients.com/dealer/break-orders",
        { filteredSOData: result }
    );

    return {
        apiResponse: res.data,
        processedOrders: result,
    };
};

export default BreakSalesOrder;











