import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateListing() {
  const [files, setFiles] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const params = useParams();
  const { currentUser } = useSelector((store) => store.user);
  const [loadingForServer, setLoadingForServer] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    regularPrice: 50,
    discountPrice: 0,
    bathrooms: 0,
    bedrooms: 0,
    furnished: false,
    parking: false,
    type: "rent",
    offer: false,
    imageUrls: [],
  });
  
  useEffect(() => {
    const fetchListing = async () => {
        const listingId = params.listingId;
        const res = await fetch(`/api/listing/get/${listingId}`);
        const data = await res.json();
        if (data.success === false) {
            console.log(data.message);
            return;
        }
        setFormData(data);
        
    }

    fetchListing();
  }, []);

  /* ------------------ File Change ------------------ */
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (selectedFiles.length < 1 || selectedFiles.length > 6) {
      setError("Please select between 1 and 6 image files.");
      return;
    }

    const isAllImages = selectedFiles.every((file) =>
      file.type.startsWith("image/")
    );
    if (!isAllImages) {
      setError("Only image files are allowed.");
      return;
    }

    setError("");
    setFiles(selectedFiles);
  };

  /* ------------------ Upload Images to Backend ------------------ */
  const handleImageSubmit = async () => {
    if (files.length < 1 || files.length > 6) {
      setError("Please upload between 1 to 6 images.");
      return;
    }


  try {
  const formDataToSend = new FormData();
  files.forEach((file) => formDataToSend.append("images", file));

  const res = await fetch(
    "http://localhost:3000/api/upload/listing-images",
    {
      method: "POST",
      credentials: "include", // if backend uses cookies/auth
      body: formDataToSend,
    }
  );

  // Read response as text first
  const resText = await res.text();
  let data;

  try {
    data = JSON.parse(resText); // Try parsing JSON
  } catch (err) {
    console.error("Backend returned non-JSON response:", resText);
    setError("Upload failed: Backend returned invalid response.");
    return;
  }

  if (!data.success) {
    setError(data.message || "Upload failed.");
    return;
  }

  // Update frontend state
  setImageUrls((prev) => [...prev, ...data.urls]);
  setFormData((prev) => ({
    ...prev,
    imageUrls: [...prev.imageUrls, ...data.urls],
  }));
  setSuccessMessage("Images uploaded successfully!");
  setTimeout(() => setSuccessMessage(""), 3000);

  setFiles([]);
  setError("");
} catch (err) {
  console.error("Backend upload error:", err);
  setError("Something went wrong during upload.");
}
  }

  /* ------------------ Delete Image ------------------ */
  const handleDelete = (url) => {
    setImageUrls((prev) => prev.filter((img) => img !== url));
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((img) => img !== url),
    }));
  };

  /* ------------------ Form Change ------------------ */
  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({ ...formData, type: e.target.id });
    } else if (
      e.target.id === "parking" ||
      e.target.id === "offer" ||
      e.target.id === "furnished"
    ) {
      setFormData({ ...formData, [e.target.id]: e.target.checked });
    } else if (
      e.target.type === "text" ||
      e.target.type === "textarea" ||
      e.target.type === "number"
    ) {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };



  /* ------------------ Submit Listing ------------------ */
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   console.log("📦 FORMDATA:", [...formData.entries()]);

  //   if (formData.imageUrls.length < 1)
  //     return setError("You have to upload at least 1 image");
  //   if (formData.regularPrice < formData.discountPrice)
  //     return setError("Discount price must be less than regular price");

  //   try {
  //     setLoadingForServer(true);

  //     const response = await fetch(
  //      `/api/listing/update/${params.listingId}`,
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         credentials: "include",
  //         body: JSON.stringify({
  //           ...formData,
  //           userRef: currentUser._id,
  //         }),
  //       }
  //     );

  //     const jsonData = await response.json();
  //       setLoadingForServer(false);
  //       if(jsonData.success === false) {
  //       setError(jsonData.message);
  //       }
  //     navigate(`/listing/${jsonData._id}`);
  //   } catch (err) {
  //     setLoadingForServer(false);
  //     setError(err.message);
  //   }
  // };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (files.length < 1 && formData.imageUrls.length < 1) {
  return setError("You must have at least 1 image");
}


  if (formData.regularPrice < formData.discountPrice) {
    return setError("Discount price must be less than regular price");
  }

  try {
    setLoadingForServer(true);

    // ✅ REAL FormData object
    const data = new FormData();

    // ✅ text fields
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    // ✅ images
    files.forEach((file) => {
      data.append("images", file);
    });

    // 🔍 debug (ab error nahi aayega)
    console.log("📦 FORMDATA:", [...data.entries()]);

    const response = await fetch(
      `/api/listing/update/${params.listingId}`,
      {
        method: "PUT", // ✅ UPDATE
        credentials: "include",
        body: data, // ✅ FormData
      }
    );

    const jsonData = await response.json();
    setLoadingForServer(false);

    if (jsonData.success === false) {
      setError(jsonData.message);
      return;
    }

    navigate(`/listing/${jsonData._id}`);
  } catch (err) {
    setLoadingForServer(false);
    setError(err.message);
  }
};

  return (
    <main className="p-3  max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Edit a Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            required
            onChange={handleChange}
            value={formData.name}
          />

          <textarea
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              <span>Sell</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <span>Rent</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking spot</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>

            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-5"  onChange={handleChange}
                checked={formData.offer} />
              <span>Offer</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
                 onChange={handleChange}
                 value={formData.bedrooms}
              />
              <p>Beds</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
                 onChange={handleChange}
                 value={formData.bathrooms}
              />
              <p>Baths</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="50"
                max="100000"
                required
                className="p-3 border border-gray-300 rounded-lg"
                 onChange={handleChange}
                 value={formData.regularPrice}
              />
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                <span className="text-xs">$ / month</span>
              </div>
            </div>
            {formData.offer && (
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="discountPrice"
                min="0"
                max="100000"
                required
                className="p-3 border border-gray-300 rounded-lg"
                 onChange={handleChange}
                 value={formData.discountPrice}
              />
              <div className="flex flex-col items-center">
                <p>Discounted Price</p>
                <span className="text-xs">$ / month</span>
              </div>
            </div>
            )}
          </div>
        </div>

        <div className="flex flex-col flex-1 gap-4">
          <p>
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>

          <div className="flex gap-4">
            <input
              onChange={handleFileChange}
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              type="button"
              onClick={handleImageSubmit}
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              Upload
            </button>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {successMessage && (
            <p className="text-green-600 text-sm">{successMessage}</p>
          )}

          <div className="">
            {imageUrls.map((url, index) => (
              <div key={index} className="flex justify-between p-3 border items-center">
                <img
                  src={url}
                  alt={`Uploaded ${index}`}
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <button 
                  type="button"
                  onClick={() => handleDelete(url)}
                  className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          <button type="submit" className="p-3 bg-slate-700 text-white rounded-lg disabled:opacity-80 uppercase hover:opacity-95">
          {loadingForServer ? 'Editing...' : 'Edit Listing'}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}