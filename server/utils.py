import nibabel as nib
import numpy as np
from scipy.ndimage import binary_dilation, binary_erosion
from scipy.ndimage import gaussian_filter
import os

def create_boundary(fileName):
    img = nib.load(f'../Data/Inverted/{fileName}')
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
    img = nib.load(f'../Data/Inverted/{fileName}')
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

def compute_custome_maximum(fileName, maxPercentile, smooth, session_id):
    img = nib.load(f'../Data/Inverted/{fileName}')
    data = img.get_fdata()
    print("here")
    # Create a threshold. Here, I'm assuming values within 95% of the max_value.
    threshold = np.percentile(data, float(maxPercentile))
    print('here1')
    # Create a mask for values that are below the threshold
    mask = data < threshold
    print("here2")
    # Set those values to 0
    data[mask] = 0
    data[~mask] = 1
    smoothed_data = smooth_mask(data, sigma=float(smooth))
    print("here3")


    # If you want to save the modified data back to a .nii file:
    new_img = nib.Nifti1Image(smoothed_data, img.affine)
    folder = f'../Data/Temp/{session_id}'
    os.makedirs(folder, exist_ok=True)
    path = f'../Data/Temp/{session_id}/{fileName}'
    nib.save(new_img, path)
    return fileName


def compute_projection(fileName, min, max, smooth, session_id):
    img = nib.load(f'../Data/Inverted/{fileName}')
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


def invert(fileName):
    img = nib.load(f'../Data/Original/{fileName}')
    data = img.get_fdata()
    mirrored_data = np.flip(data, axis=1)

    # Create a new NIfTI image with the mirrored data
    new_nii_image = nib.Nifti1Image(mirrored_data, img.affine, img.header)
    path = f'../Data/Inverted/{fileName}'
    nib.save(new_nii_image, path)
    


