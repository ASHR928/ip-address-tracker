import { useEffect,useState } from "react"
import arrow from "./images/icon-arrow.svg"
import background from "./images/pattern-bg-desktop.png"
import "leaflet/dist/leaflet.css"

import { MapContainer, TileLayer} from 'react-leaflet'
import Markerposition from "./components/Markerposition"


function App() {
  const [address,setAddress] = useState(null)
  const [ipAddress,setIpAddress]  = useState("")
  const [ip, setIp] = useState("8.8.8.8")
  const checkIpAddress =
    /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gi;
  
  

  useEffect(() => {
    try {
      const getInitialData = async ()=>{
        const res = await fetch(`http://ip-api.com/json/${ip}?fields=country,zip,lat,lon,regionName,query,city,isp,timezone`)
        const data = await res.json()
        setAddress(data)
      }
      getInitialData()
      
    } catch (error) {
      console.trace(error)
    }
  }, [ip])
  const getEnteredData = async () => {
    if (checkIpAddress.test(ipAddress)) {
      setIp(ipAddress);
      try {
        const res = await fetch(
          `http://ip-api.com/json/${ipAddress}?fields=country,zip,lat,lon,regionName,query,city,isp,timezone`
        );
        const data = await res.json();
        setAddress(data);
      } catch (error) {
        console.trace(error);
      }
    } else {
      // Handle invalid IP address
      console.log("Invalid IP address");
    }
  };
  
 
  const handleSubmit = (e) => {
    e.preventDefault();
    getEnteredData();
    setIpAddress("");
  };




  return (
    <>
    <section>
      <div className="absolute -z-10">
        <img src={background} alt="background-img" className="w-full h-80 object-cover"/>
      </div>
      <article className="p-8">
        <h1 className="text-2xl lg:text-3xl text-white text-center mb-8 font-bold">IP Address Tracker</h1>
        <form className="flex justify-center max-w-xl mx-auto " onSubmit={handleSubmit}>
          <input type="text" placeholder="Search for any IP Adress" name="search" 
          required 
          value={ipAddress}
          onChange={(e)=>setIpAddress(e.target.value)}
          className="py-2 px-4 rounded-l-lg w-full"/>
          <button type="submit" className="bg-black py-4 px-4 hover:opacity-60 rounded-r-lg ">
            <img src={arrow} alt="submit-btn"/>
          </button>
        </form>
      </article>
       {
        address && (
          <>
           <article className="bg-white rounded-lg shadow max-w-6xl p-8 xl:mx-auto mx-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 text-center md:text-left lg:-mb-16 relative" style={{zIndex:1000}}>
        <div className="lg:border-r lg:border:slate-400">
          <h2 className="uppercase text-sm font-bold text-slate-500 tracking-wider mb-3">Ip Adress</h2>
          <p className="font-bold text-slate-900 text-lg md:text-xl xl:text-2xl">{address.query}</p>
        </div>
        <div className="lg:border-r lg:border:slate-400">
          <h2 className="uppercase text-sm font-bold text-slate-500 tracking-wider mb-3">
            Location</h2>
          <p className="font-bold text-slate-900 text-lg md:text-xl xl:text-2xl">
            {address.regionName}, {address.city} {address.zip}</p>
        </div>
        <div className="lg:border-r lg:border:slate-400">
          <h2 className="uppercase text-sm font-bold text-slate-500 tracking-wider mb-3">
            Timezone</h2>
          <p className="font-bold text-slate-900 text-lg md:text-xl xl:text-2xl">
            {address.timezone}</p>
        </div>
        <div >
          <h2 className="uppercase text-sm font-bold text-slate-500 tracking-wider mb-3">
            ISP</h2>
          <p className="font-bold text-slate-900 text-lg md:text-xl xl:text-2xl">
            {address.isp}</p>
        </div>
        
      </article>
      <MapContainer center={[address.lat,address.lon]} zoom={13} scrollWheelZoom={true} style={{height: "700px" , width:"100vw"}}>
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
   <Markerposition address={address}/>
  </MapContainer>
          
          </>
        )
       }
    </section>
    </>
  );
}

export default App;
