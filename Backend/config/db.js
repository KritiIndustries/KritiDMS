import sql from 'mssql';

// dbConfig.js
export const config = {
    user: "sa",
    password: "admin@1235",
    server: "localhost" || "13.232.178.222",   // or 13.232.178.222 if remote
    port: 1433,
    database: "DMS_KNL",
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

let poolPromise;
try {
    console.log('Connecting to SQL Server...');
    poolPromise = await sql.connect(config);
    console.log('✅ Connected to SQL Server');
} catch (err) {
    console.error('❌ Database connection failed:', err);
}

export default poolPromise;
