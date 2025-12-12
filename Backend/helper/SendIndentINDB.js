import sql from 'mssql';
import pool from '../config/db.js';
const sendIndentINDB = async (payload, DI) => {
    console.log("Payload of indedation", JSON.stringify(payload));
    if (!payload.Vbeln || !payload.SalesHdrItemNav || !Array.isArray(payload.SalesHdrItemNav)) {
        return res.status(400).json({
            success: false,
            message: "Invalid payload format. Expected structure: d.Vbeln and d.SalesHdrItemNav[]",
        });
    }

    const indentedData = []
    for (const item of payload.SalesHdrItemNav) {
        const request = pool.request();
        request.input("Vbeln", sql.VarChar, item.Vbeln || Vbeln);
        request.input("Posnr", sql.VarChar, item.Posnr);
        request.input("Matnr", sql.VarChar, item.Matnr);
        request.input("Kwmeng", sql.VarChar, item.Kwmeng);
        request.input("Vrkme", sql.VarChar, item.Vrkme);
        request.input("DI", sql.VarChar, DI);
        const query = `
        INSERT INTO [DMS_KNL].[dbo].[indent_Table]
        (Vbeln, Posnr, Matnr, Kwmeng, Vrkme ,Status,DI)
        VALUES (@Vbeln, @Posnr, @Matnr, @Kwmeng, @Vrkme, 'X' , @DI)`
        const result = await request.query(query);
        if (result) {
            indentedData.push(result);
        }
    }
    return indentedData;
}
export default sendIndentINDB;