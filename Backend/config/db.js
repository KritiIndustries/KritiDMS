import sql from 'mssql';

const config = {
    user: 'sa',
    password: 'admin@1235',
    server: '192.9.205.2',
    database: 'DMS_KNL',
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
