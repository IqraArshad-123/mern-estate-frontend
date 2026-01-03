import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingItem from "../components/ListingItem";


export default function Search() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [listings, setListings] = useState([]);
    console.log(listings);
    
    const [sideBarData, setSideBarData] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at",
    order: "desc",
  });
  
  const handleOnChange = (e) => {
    if (
      e.target.id == "all" ||
      e.target.id == "sale" ||
      e.target.id == "rent"
    ) {
      setSideBarData({ ...sideBarData, type: e.target.id });
    }

    if (e.target.id == "searchTerm") {
      setSideBarData({ ...sideBarData, searchTerm: e.target.value });
    }

    if (
      e.target.id == "parking" ||
      e.target.id == "furnished" ||
      e.target.id == "offer"
    ) {
      setSideBarData({
        ...sideBarData,
        [e.target.id]:
          e.target.checked || e.target.checked == "true" ? true : false,
      });
    }

    if (e.target.id == "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at";
      const order = e.target.value.split("_")[1] || "desc";

      setSideBarData({ ...sideBarData, sort, order });
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSideBarData({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl == "true" ? true : false,
        furnished: furnishedFromUrl == "true" ? true : false,
        offer: furnishedFromUrl == "true" ? true : false,
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
      });
    }
    const fetchListings = async () => {
    setLoading(true);
    const searchQuery = urlParams.toString();
    const res = await fetch(`https://mern-estate-backend-xi.vercel.app/api/listing/get?${searchQuery}`);
    const data = await res.json();
    setListings(data);
    setLoading(false);
   }

   fetchListings();
}, [location.search]);

   


   const handleSubmit = async (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams()
    urlParams.set("searchTerm", sideBarData.searchTerm)
    urlParams.set("type", sideBarData.type)
    urlParams.set("parking", sideBarData.parking)
    urlParams.set("furnished", sideBarData.furnished)
    urlParams.set("offer", sideBarData.offer)
    urlParams.set("sort", sideBarData.sort)
    urlParams.set("order", sideBarData.order)

    const searchQuery = urlParams.toString()
    navigate(`/search?${searchQuery}`)
  };


  return (
    <div className='flex flex-col md:flex-row gap-2'>
        <div className="p-7 border-b-2 sm:border-r-2 md:min-h-screen">
            <form onSubmit={handleSubmit} className='flex flex-col gap-7'>
                <div className="whitespace-nowrap flex items-center gap-3">
            <label className="font-bold">Search Term:</label>
            <input
              type="text"
              placeholder="Search..."  
              id="searchTerm"
              onChange={handleOnChange}
              value={sideBarData.searchTerm}
              
              className="border bg-white rounded-lg p-3 w-full"
                     />
                </div>
                <div className="flex flex-wrap items-center gap-3">
            <label className="font-bold">Type:</label>
            <div className="flex gap-2 ">
              <input
                type="checkbox"
                id="all"
                className="w-5"
                onChange={handleOnChange}
                checked={sideBarData.type == "all"}
              />
              <span>Sale & Rent</span>
            </div>
            <div className="flex gap-2 ">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleOnChange}
                checked={sideBarData.type == "sale"}
              />
              <span>Sale</span>
            </div>
            <div className="flex gap-2 ">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleOnChange}
                checked={sideBarData.type == "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2 ">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleOnChange}
                checked={sideBarData.offer}
              />
              <span>Offer</span>
            </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
            <label className="font-bold">Amenities:</label>
            <div className="flex gap-2 ">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleOnChange}
                checked={sideBarData.parking}
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2 ">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleOnChange}
                checked={sideBarData.furnished}
              />
              <span>Furnished</span>
            </div>
                </div>
                <div className="flex items-center gap-2">
            <label className="font-bold">Sort:</label>
            <select
              onChange={handleOnChange}
              defaultValue={"created_at_desc"}
              className="border p-2 rounded-lg"
              id="sort_order"
            >
              <option value={"regularPrice_desc"}>Price high to low</option>
              <option value={"regularPrice_asc"}>Price low to high</option>
              <option value={"createdAt_desc"}>Latest</option>
              <option value={"createdAt_asc"}>Oldest</option>
            </select>
          </div>
          <button
            className="bg-slate-700 p-3
                text-white hover:opacity-85 rounded-lg uppercase"
          >
            Search
          </button>
            </form>
        </div>
        <div className="">
            <h1 className="text-3xl text-slate-800 font-semibold 
           border-b p-3 mt-5">Listing results:</h1>
        
           <div className="p-7">
  {!loading && listings.length == 0 && (
    <p className="font-bold text-xl text-center text-slate-700">
      No Listing Found!
    </p>
  )}

  {loading && (
    <p className="text-xl text-slate-700 text-center font-bold">
      Loading...
    </p>
  )}

  {!loading && listings.length > 0 && (
    <div className="flex flex-wrap gap-4">
      {listings.map((listing) => (
        <ListingItem key={listing._id} listing={listing} />
      ))}
    </div>
  )}
</div>

        </div>
    </div>
  )
}
