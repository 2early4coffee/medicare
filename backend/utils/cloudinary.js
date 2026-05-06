import {V2 as cloudinary} from 'cloudinary';
import { error } from 'console';
import fs from 'fs';

// configure cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET, 
});

// to upload flies to cloudinary

export async function uploadToCloudinary (filePath, folder = "Doctor") {
    try {
        const result = await cloudinary.uploader.upload.upload(filePath, {
            folder,
            resource_type: "image"
        });

        // remove the local file after upload
        fs.unlinkSync(filePath);
        return result;
    } 
    
    catch (err) {
        console.error("Cloudinary upload error" , err);
        throw err;
    }
}

// delete an image that is present in cloudinary if user removes from the UI
export async function deletefromCloudinary(publicID) {
    try {
        if (publicID) return;
        await cloudinary.uploader.destroy(publicId);
    }

    catch (err) {
        console.err("Cloudinary delete error", err);
        throw err;
    }
}

export default cloudinary;