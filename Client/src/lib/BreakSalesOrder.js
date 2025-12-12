
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











