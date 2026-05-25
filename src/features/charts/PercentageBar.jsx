import { useMemo } from "react";
import useTransactionStore from "../../Store/UseTransactionStore";

const PercentageBar = () => {
    const transactionData = useTransactionStore((state) => state.transactions);
    
    const expensStats = useMemo(() => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const lastMonthDate = new Date(currentYear, currentMonth - 1, 1);
        const lastMonth = lastMonthDate.getMonth();
        const lastMonthYear = lastMonthDate.getFullYear();

        let currentTotal = 0;
        let lastTotal = 0;

        transactionData.forEach((t) => {
            if (t.type !== "expense") return;
            
            const date = new Date(t.tanggal);
            const month = date.getMonth();
            const year = date.getFullYear();

            if (month === currentMonth && year === currentYear) {
                currentTotal += t.nominal;
            } else if (month === lastMonth && year === lastMonthYear) {
                lastTotal += t.nominal;
            }
        });

        let percentageChange = 0;
        if (lastTotal > 0) {
            percentageChange = ((currentTotal - lastTotal) / lastTotal) * 100;
        };

        return  {currentTotal, lastTotal, percentageChange};
    }, [transactionData]);

    // Month Data
    const monthlyExpense = useMemo(() => {
        const result = {};

        transactionData.forEach((t) => {
            if (t.type !== "expense") return;

            const date = new Date(t.tanggal);
            const key = `${date.getFullYear()}-${String(date.getMonth())}`;

            if (!result[key]) result[key] = 0;
            result[key] += t.nominal || 0;
        });

        return result;
    }, [transactionData]);

    //Label 6 Bulan
    const labels = [];
    const dataValues = [];
    
    for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const key = `${date.getFullYear()}-${String(date.getMonth())}`;
        labels.push(date.toLocaleString("default", { month: "short", year: "2-digit" }));
        dataValues.push(monthlyExpense[key] || 0);
    };

    // Calculate progress percentage (current vs last month)
    const targetAmount = expensStats.lastTotal;
    const currentAmount = expensStats.currentTotal;
    const progressPercentage = targetAmount > 0 ? Math.min((currentAmount / targetAmount) * 100, 100) : 0;

    // Get month names
    const currentMonthName = new Date().toLocaleString("id-ID", { month: "long", year: "numeric" });
    const lastMonthDate = new Date();
    lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
    
    return (
        <div>
            <h3 className="text-lg font-semibold mb-4">Perbandingan Pengeluaran Bulan Ini</h3>

            {transactionData.length === 0 ? (
                <div className="flex justify-center items-center h-64 bg-white p-6 border border-gray-300 rounded-lg shadow-2xl">
                    <p className="text-gray-500 text-lg">
                         Belum ada data yang dimasukkan
                    </p>
                </div>
            ) : (
                <div className="bg-white p-6 border border-gray-300 rounded-lg shadow-2xl">
                    <div className="space-y-4">
                        {/* Progress Bar */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Bulanan ({currentMonthName})</span>
                                <span>{progressPercentage.toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div 
                                    className="bg-red-500 h-3 rounded-full transition-all duration-300"
                                    style={{ width: `${progressPercentage}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="text-center">
                                <p className="text-gray-600">Bulan Ini</p>
                                <p className="font-semibold text-red-600">
                                    Rp{currentAmount.toLocaleString("id-ID")}
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-gray-600">Bulan Lalu</p>
                                <p className="font-semibold text-gray-800">
                                    Rp{targetAmount.toLocaleString("id-ID")}
                                </p>
                            </div>
                        </div>

                        {/* Percentage Change */}
                        <div className="text-center">
                            <p className="text-sm text-gray-600">Perubahan</p>
                            <p className={`font-semibold ${expensStats.percentageChange >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                                {expensStats.percentageChange >= 0 ? '+' : ''}{expensStats.percentageChange.toFixed(1)}%
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PercentageBar;