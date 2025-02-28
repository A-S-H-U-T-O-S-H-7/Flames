import CountMeter from "../CountMeter";
import RevenueChart from "../RevenueChart";
export default function page(){
    return(
        <main>
            <CountMeter/>
            <div>
                <RevenueChart/>
            </div>
        </main>
    )
}