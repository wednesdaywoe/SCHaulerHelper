// Global Payouts Database - All Known Star Citizen Cargo Mission Payouts
// Consolidated from all systems and categories for universal access

window.GLOBAL_PAYOUTS = [
    // Planetary payouts
    "30k", "37k", "43k", "45k", "48k", "50k", "56k", "59k", "61k", "62k", "65k",
    "76k", "83k", "84k", "90k", "95k", "99k", "121k", "123k", "160k", "163k",
    "207k", "332k", "394k",
    
    // Local payouts
    "52.5k", "60.75k", "139k", "150.5k", "153.25k", "163.75k",
    
    // Stellar payouts
    "51.5k", "55.75k", "56.25k", "57k", "59.5k", "63k", "63.25k", "64k", "64.25k",
    "68.25k", "79.25k", "81.25k", "124.75k", "126.25k", "127.25k", "136.5k",
    "137.5k", "142k", "162.25k", "245.5k", "247.75k", "276.25k", "282.5k",
    "289k", "313.25k", "314k", "319k", "339.5k", "383k",
    
    // Additional known payouts
    "100k", "150k", "200k", "250k", "300k", "350k", "400k"
].sort((a, b) => {
    // Sort numerically by removing 'k' and converting to number
    const numA = parseFloat(a.replace('k', ''));
    const numB = parseFloat(b.replace('k', ''));
    return numA - numB;
});

console.log('✅ Loaded GLOBAL_PAYOUTS:', window.GLOBAL_PAYOUTS.length, 'payouts');
