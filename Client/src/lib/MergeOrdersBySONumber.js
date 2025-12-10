// export default function MergeOrdersBySONumber(pendingOrders) {
//     const merged = {};

//     pendingOrders.forEach(order => {
//         const orderNo = order.S_ORDER_NO;

//         // If not exist, initialize
//         if (!merged[orderNo]) {
//             merged[orderNo] = {
//                 ...order,
//                 totalWeightInTon: Number(order.totalWeightInTon) || 0,
//                 totalVolumeInKG: Number(order.totalVolumeInKG) || 0,
//                 GROSS_VALUE_S: parseFloat(order.GROSS_VALUE_S) || 0,
//                 NET_PRICE_S: parseFloat(order.NET_PRICE_S) || 0,
//                 SOStatus: "", // ✅ correctly added property
//                 materialOfSO: [

//                 ]
//             };
//         } else {
//             // Sum the numeric fields
//             merged[orderNo].totalWeightInTon += Number(order.totalWeightInTon) || 0;
//             merged[orderNo].totalVolumeInKG += Number(order.totalVolumeInKG) || 0;
//             merged[orderNo].GROSS_VALUE_S += parseFloat(order.GROSS_VALUE_S) || 0;
//             merged[orderNo].NET_PRICE_S += parseFloat(order.NET_PRICE_S) || 0;
//         }
//     });
//     // Convert back to array
//     return Object.values(merged);
// }

export default function MergeOrdersBySONumber(pendingOrders) {
    const merged = {};

    pendingOrders.forEach(order => {
        const orderNo = order.S_ORDER_NO;

        if (!merged[orderNo]) {
            merged[orderNo] = {
                ...order,
                category: order.category, // keep assigned category
                totalWeightInTon: Number(order.totalWeightInTon) || 0,
                totalVolumeInKG: Number(order.totalVolumeInKG) || 0,
                GROSS_VALUE_S: parseFloat(order.GROSS_VALUE_S) || 0,
                NET_PRICE_S: parseFloat(order.NET_PRICE_S) || 0,
                materialOfSO: [],        // initial empty array, will be filled later
                SOStatus: ""
            };
        } else {
            merged[orderNo].totalWeightInTon += Number(order.totalWeightInTon) || 0;
            merged[orderNo].totalVolumeInKG += Number(order.totalVolumeInKG) || 0;
            merged[orderNo].GROSS_VALUE_S += parseFloat(order.GROSS_VALUE_S) || 0;
            merged[orderNo].NET_PRICE_S += parseFloat(order.NET_PRICE_S) || 0;

            // ensure category propagation
            if (!merged[orderNo].category) {
                merged[orderNo].category = order.category;
            }
        }
    });

    return Object.values(merged);
}




