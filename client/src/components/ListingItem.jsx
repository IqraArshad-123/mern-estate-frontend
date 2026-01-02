import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";

export default function ListingItem({listing}) {
  return (
    <div
      className="bg-white transition-shadow w-full sm:w-[250px] shadow-md
             hover:shadow-xl overflow-hidden rounded-lg "
    >
      <Link to={`/listing/${listing._id}`}>
        <img
          src={listing.imageUrls?.[0] || "/fallback.jpg"}
          alt="cover photo"
          className="h-[320px] sm:h-[220px] w-full
                hover:scale-105 transition-scale duration-300"
        />

        <div className="p-3 flex flex-col gap-2 w-full">
          <p
            className="text-slate-700 font-semibold text-lg 
                    truncate"
          >
            {listing.name}
          </p>
          <div className="flex gap-2 items-center">
            <MdLocationOn className="h-5 w-5 text-green-600" />
            <p className="text-sm truncate w-full">{listing.address}</p>
          </div>
          <p className="text-sm truncate">{listing.description}</p>
          <p className="text-slate-600 font-semibold mt-2">
            $
            {listing.offer
              ? listing.discountPrice.toLocaleString("en-US")
              : listing.regularPrice.toLocaleString("en-US")}
            {listing.type == "rent" && "/month"}
          </p>

          <div className="text-slate-700 flex gap-4">
            <div className="text-xs font-bold">
              {listing.bedRooms > 1 ? `${listing.bedrooms} beds` : `${listing.bedrooms} bed`}
              
            </div>

            <div className="text-xs font-bold">
              {listing.bathRooms > 1 ? `${listing.bathrooms} baths` : `${listing.bathrooms} bath`}
              
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
