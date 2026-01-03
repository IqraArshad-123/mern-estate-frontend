import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../redux/user/userSlice";
import { Link } from 'react-router-dom';
export default function Profile() {
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    username: currentUser?.username || "",
    email: currentUser?.email || "",
    avatar: currentUser?.avatar || "",
    password: "",
  });
  const [fileUploading, setFileUploading] = useState(false);
  const [fileUploadError, setFileUploadError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);

  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        username: currentUser.username || "",
        email: currentUser.email || "",
        avatar: currentUser.avatar || "",
      }));
    }
  }, [currentUser]);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileUploadError(null);
    setUpdateSuccess(false);

    const data = new FormData();
    data.append("file", file);

    try {
      setFileUploading(true);
      const res = await fetch("https://mern-estate-backend-xi.vercel.app/api/upload", {
        method: "POST",
        body: data,
        credentials: "include",
      });
      const result = await res.json();
      if (!res.ok || result.success === false) {
        throw new Error(result.message || "Could not upload image");
      }
      setFormData((prev) => ({ ...prev, avatar: result.url }));
    } catch (err) {
      setFileUploadError(err.message);
    } finally {
      setFileUploading(false);
    }
  };

  const handleChange = (e) => {
    setUpdateSuccess(false);
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateSuccess(false);
    const userId = currentUser?._id || currentUser?.id;
    const payload = { ...formData };
    if (!payload.password) delete payload.password;
    if (!payload.avatar) delete payload.avatar;
    try {
      dispatch(updateUserStart());
      const res = await fetch(`https://mern-estate-backend-xi.vercel.app/api/user/update/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error(data.message || "Update failed");
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (err) {
      dispatch(updateUserFailure(err.message));
    }
  };

  const avatarSrc =
    formData.avatar ||
    currentUser?.avatar ||
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

    const handleDeleteUser = async () => {
      try {
        dispatch(deleteUserStart());
        const res = await fetch(`https://mern-estate-backend-xi.vercel.app/api/user/delete/${currentUser._id}`, {
          method: 'DELETE',
        });
        const data = await res.json();
        if (data.success === false) {
          dispatch(deleteUserFailure(data.message));
          return;
        }
        dispatch(deleteUserSuccess(data));
      } catch (error) {
        dispatch(deleteUserFailure(error.message))
        
      }
    };

    const handleSignOut = async () => {
      try {
        dispatch(signOutUserStart());
        const res = await fetch('https://mern-estate-backend-xi.vercel.app/api/auth/signout');
        const data = await res.json();
        if (data.success == false) {
          dispatch(deleteUserFailure(data.message));
          return;
        }
        dispatch(deleteUserSuccess(data));
      } catch (error) {
        dispatch(deleteUserFailure(data.message));
      }
    }
    const handleShowListings = async () => {
      try {
        setShowListingsError(false); 
        const res = await fetch(`https://mern-estate-backend-xi.vercel.app/api/user/listings/${currentUser._id}`);
         const data = await res.json();
         if (data.success === false) {
          setShowListingsError(true);
          return;
         }
         setUserListings(data);
      } catch (error) {
         setShowListingsError(true);
      }

    }

    const handleListingDelete = async (listingId) => {
      try {
         const res = await fetch (`https://mern-estate-backend-xi.vercel.app/api/listing/delete/${listingId}`,{
          method: 'DELETE',         
         });
         const data = await res.json();
         if (data.success === false) {
          console.log(data.message);
          return;
         }
         setUserListings((prev) => prev.filter((listing) => listing._id !== listingId));
      } catch (error) {
         console.log(error.message);
         
      }

    }
    

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input type="file" ref={fileRef} hidden accept='image/*' onChange={handleFileChange}/>
        <img onClick={()=>fileRef.current.click()} src={avatarSrc} alt="profile" className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"/>
        <input value={formData.username} onChange={handleChange} type="text" placeholder='Username' id="username" className="border p-3 rounded-lg"/>
         <input value={formData.email} onChange={handleChange} type="email" placeholder='Email' id="email" className="border p-3 rounded-lg"/>
          <input value={formData.password} onChange={handleChange} type="password" placeholder='Password' id="password" className="border p-3 rounded-lg"/>
          <button disabled={loading || fileUploading} className="bg-slate-700 text-white  rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">{fileUploading ? 'Uploading...' : loading ? 'Updating...' : 'Update'}</button>
          <Link className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95' to={"/create-listing"}>
          Create Listing
          </Link>
      </form>
      {fileUploadError && <p className="text-red-700 mt-2">{fileUploadError}</p>}
      {error && <p className="text-red-700 mt-2">{error}</p>}
      {updateSuccess && <p className="text-green-700 mt-2">Profile updated</p>}
      <div className="flex justify-between mt-5">
        <span onClick={handleDeleteUser} className="text-red-700 cursor-pointer">Delete account</span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">Sign out</span>
      </div>
       <button onClick={handleShowListings} className="text-green-700 w-full">Show listings</button>
       <p className="text-red-700 mt-5">{showListingsError ? 'Error Showing Listings' : ''}</p>

       {userListings && userListings.length > 0 && 
       <div className="flex flex-col gap-4">
        <h1 className="text-center mt-7 text-2xl font-semibold">Your Listings</h1>
       {userListings.map((listing) => (
        <div key={listing._id} className="border rounded-lg p-3 flex justify-between items-center gap-4">
          <Link to={`/listing/${listing._id}`}>
          <img src={listing.imageUrls[0]} alt='listing cover' className="h-16 w-16 object-contain " />
          </Link>
          <Link className="flex-1 text-slate-700 font-semibold hover:underline truncate" to={`/listing/${listing._id}`}>
          <p>{listing.name}</p>
          </Link>

          <div className="flex flex-col items-center">
            <button onClick={()=>handleListingDelete(listing._id)} className="text-red-700 uppercase">Delete</button>
            <Link to={`/update-listing/${listing._id}`}>
            <button className="text-green-700 uppercase">Edit</button>
            </Link>
          </div>
        </div>
       ))}
       </div>}
    </div>
  )
}
 