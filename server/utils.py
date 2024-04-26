import nibabel as nib
import numpy as np
from scipy.ndimage import binary_dilation, binary_erosion
from scipy.ndimage import gaussian_filter
import os

def create_boundary(fileName,disease):
    if disease is not None:
        img1 = nib.load(f'../Data/{disease}/Normal/Original/{fileName}')
        img2 = nib.load(f'../Data/{disease}/Disease/Original/{fileName}')
        data1 = img1.get_fdata()
        data2 = img2.get_fdata()
        # Create a binary mask of the original data
        binary_mask1 = data1 > 0
        binary_mask2 = data2 > 0
        # Dilate the binary mask
        dilated_mask1 = binary_dilation(binary_mask1)
        dilated_mask2 = binary_dilation(binary_mask2)

        # Erode the binary mask
        eroded_mask1 = binary_erosion(binary_mask1)
        eroded_mask2 = binary_erosion(binary_mask2)

        # Use XOR to get the boundary
        boundary_mask1 = dilated_mask1 ^ eroded_mask1
        boundary_mask2 = dilated_mask2 ^ eroded_mask2

        # Multiply the boundary mask with original data
        boundary_data1 = data1 * boundary_mask1
        boundary_data2 = data2 * boundary_mask2

        boundary_img1 = nib.Nifti1Image(boundary_data1, img1.affine)
        boundary_img2 = nib.Nifti1Image(boundary_data2, img2.affine)
        path1 = f'../Data/{disease}/Normal/Boundary/{fileName}'
        path2 = f'../Data/{disease}/Disease/Boundary/{fileName}'
        nib.save(boundary_img1, path1)
        nib.save(boundary_img2, path2)
    else:
        img = nib.load(f'../Data/Original/{fileName}')
        data = img.get_fdata()
        # Create a binary mask of the original data
        binary_mask = data > 0

        # Dilate the binary mask
        dilated_mask = binary_dilation(binary_mask)

        # Erode the binary mask
        eroded_mask = binary_erosion(binary_mask)

        # Use XOR to get the boundary
        boundary_mask = dilated_mask ^ eroded_mask

        # Multiply the boundary mask with original data
        boundary_data = data * boundary_mask

        boundary_img = nib.Nifti1Image(boundary_data, img.affine)
        path = f'../Data/Boundary/{fileName}'
        nib.save(boundary_img, path)

def compute_maximum(fileName):
    img = nib.load(f'../Data/Original/{fileName}')
    data = img.get_fdata()

    # Determine the maximum intensity
    max_value = data.max()

    # Create a threshold. Here, I'm assuming values within 95% of the max_value.
    threshold = np.percentile(data, 99)

    # Create a mask for values that are below the threshold
    mask = data < threshold

    # Set those values to 0
    data[mask] = 0

    # If you want to save the modified data back to a .nii file:
    new_img = nib.Nifti1Image(data, img.affine)
    path = f'../Data/Maximum/{fileName}'
    nib.save(new_img, path)

def smooth_mask(data, sigma=1):
    """Smooth a binary mask using a Gaussian filter."""
    smoothed = gaussian_filter(data.astype(float), sigma=sigma)
    return smoothed

def compute_custome_maximum(fileName, maxPercentile, smooth, session_id,disease):
    if(disease is not None):
        img1 = nib.load(f'../Data/{disease}/Normal/Original/{fileName}')
        img2 = nib.load(f'../Data/{disease}/Disease/Original/{fileName}')  
        data1 = img1.get_fdata()
        data2 = img2.get_fdata()
        threshold = np.percentile(data, float(maxPercentile))
        mask1 = data1 < threshold
        mask2 = data2 < threshold
        data1[mask1] = 0
        data2[mask2] = 0
        data1[~mask1] = 1
        data2[~mask2] = 1
        smoothed_data1 = smooth_mask(data1, sigma=float(smooth))
        smoothed_data2 = smooth_mask(data2, sigma=float(smooth))

        new_img1 = nib.Nifti1Image(smoothed_data1, img1.affine)
        new_img2 = nib.Nifti1Image(smoothed_data2, img2.affine)
        folder = f'../Data/Temp/{session_id}'
        os.makedirs(folder, exist_ok=True)
        path1 = f'../Data/Temp/{session_id}/{fileName}'
        fileName2 = "disease_"+fileName
        path2 = f'../Data/Temp/{session_id}/{fileName2}'
        
        nib.save(new_img1, path1)
        nib.save(new_img2, path2)
        return fileName
    else:
        img = nib.load(f'../Data/Original/{fileName}')  
        data = img.get_fdata()
        # print("here")
        # Create a threshold. Here, I'm assuming values within 95% of the max_value.
        threshold = np.percentile(data, float(maxPercentile))
        # print('here1')
        # Create a mask for values that are below the threshold
        mask = data < threshold
        # print("here2")
        # Set those values to 0
        data[mask] = 0
        data[~mask] = 1
        smoothed_data = smooth_mask(data, sigma=float(smooth))
        # print("here3")


        # If you want to save the modified data back to a .nii file:
        new_img = nib.Nifti1Image(smoothed_data, img.affine)
        folder = f'../Data/Temp/{session_id}'
        os.makedirs(folder, exist_ok=True)
        path = f'../Data/Temp/{session_id}/{fileName}'
        nib.save(new_img, path)
        return fileName


def compute_projection(fileName, min, max, smooth, session_id,disease):
    if disease is not None:
        img1 = nib.load(f'../Data/{disease}/Normal/{fileName}')
        img2 = nib.load(f'../Data/{disease}/Disease/{fileName}')
        data1 = img1.get_fdata()
        data2 = img2.get_fdata()
        # print("here")
        mask1 = (data1 >= float(min)) & (data <= float(max))
        mask2 = (data2 >= float(min)) & (data <= float(max))
        print("here2")
        # Set those values to 0
        data1[mask1] = 1
        data2[~mask2] = 0
        data1[mask1] = 1
        data2[~mask2] = 0
        smoothed_data1 = smooth_mask(data1, sigma=float(smooth))
        smoothed_data2 = smooth_mask(data2, sigma=float(smooth))
        print("here3")
        # If you want to save the modified data back to a .nii file:
        new_img1 = nib.Nifti1Image(smoothed_data1, img1.affine)
        new_img2 = nib.Nifti1Image(smoothed_data2, img2.affine)
        folder = f'../Data/Temp/{session_id}'
        os.makedirs(folder, exist_ok=True)
        path1 = f'../Data/Temp/{session_id}/{fileName}'
        fileName2 = "disease_"+fileName
        path2 = f'../Data/Temp/{session_id}/{fileName2}'
        nib.save(new_img1, path1)
        nib.save(new_img2, path2)
        return fileName
    else:
        img = nib.load(f'../Data/Original/{fileName}')
        data = img.get_fdata()
        print("here")
        mask = (data >= float(min)) & (data <= float(max))
        print("here2")
        # Set those values to 0
        data[mask] = 1
        data[~mask] = 0
        smoothed_data = smooth_mask(data, sigma=float(smooth))
        print("here3")
        # If you want to save the modified data back to a .nii file:
        new_img = nib.Nifti1Image(smoothed_data, img.affine)
        folder = f'../Data/Temp/{session_id}'
        os.makedirs(folder, exist_ok=True)
        path = f'../Data/Temp/{session_id}/{fileName}'
        nib.save(new_img, path)
        return fileName


def invert(fileName,disease):
    if disease is not None:
        img1 = nib.load(f'../Data/{disease}/Normal/Original/{fileName}')
        img2 = nib.load(f'../Data/{disease}/Disease/Original/{fileName}')
        data1 = img1.get_fdata()
        data2 = img2.get_fdata()
        mirrored_data1 = np.flip(data1, axis=1)
        mirrored_data2 = np.flip(data2, axis=1)

        # Create a new NIfTI image with the mirrored data
        new_nii_image1 = nib.Nifti1Image(mirrored_data1, img1.affine, img1.header)
        new_nii_image2 = nib.Nifti1Image(mirrored_data2, img2.affine, img2.header)
        path1 = f'../Data/{disease}/Normal/Inverted/{fileName}'
        path2 = f'../Data/{disease}/Disease/Inverted/{fileName}'
        nib.save(new_nii_image1, path1)
        nib.save(new_nii_image2, path2)
    else:
        img = nib.load(f'../Data/Original/{fileName}')
        data = img.get_fdata()
        mirrored_data = np.flip(data, axis=1)

        # Create a new NIfTI image with the mirrored data
        new_nii_image = nib.Nifti1Image(mirrored_data, img.affine, img.header)
        path = f'../Data/Inverted/{fileName}'
        nib.save(new_nii_image, path)
    


