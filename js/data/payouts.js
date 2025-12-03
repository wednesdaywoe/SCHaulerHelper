/**
 * Payouts Database
 * Mission payout amounts organized by category
 * Sorted numerically from low to high
 */

const PAYOUTS_DATABASE = {
    planetary: [
        "30k", "37k", "43k", "45k", "48k", "50k", "56k", "59k", "61k", "62k", "65k",
        "76k", "83k", "84k", "90k", "95k", "99k", "121k", "123k", "160k", "163k",
        "207k", "332k", "394k"
    ],
    local: [
        "52.5k", "60.75k", "139k", "150.5k", "153.25k", "163.75k"
    ],
    stellar: [
        "51.5k", "55.75k", "56.25k", "57k", "59.5k", "63k", "63.25k", "64k", "64.25k",
        "68.25k", "79.25k", "81.25k", "124.75k", "126.25k", "127.25k", "136.5k",
        "137.5k", "142k", "162.25k", "245.5k", "247.75k", "276.25k", "282.5k",
        "289k", "313.25k", "314k", "319k", "339.5k", "383k"
    ],
    interstellar: [
        "92.75k", "99.25k", "102.25k", "119.5k", "123k", "140.75k", "150.25k",
        "153.5k", "195k", "222.25k", "287k", "525.5k"
    ]
};

// Make available globally
if (typeof window !== 'undefined') {
    window.PAYOUTS_DATABASE = PAYOUTS_DATABASE;
}
