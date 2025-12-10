const getCategoryName = (code) => {
    const map = {
        SBO: "SoyaBean",
        SFO: "Sunflower",
        GNO: "Groundnut",
        KGMO: "Mustard",
        Bari: "Chunks"
    };
    return map[code] || code;
};

export default getCategoryName;