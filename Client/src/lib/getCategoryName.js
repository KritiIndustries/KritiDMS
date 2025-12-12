const getCategoryName = (code) => {
    const map = {
        SBO: "SoyaBean",
        SFO: "Sunflower",
        GNO: "Groundnut",
        KGMO: "Mustard",
        Nugget: "Nugget"
    };
    return map[code] || code;
};

export default getCategoryName;