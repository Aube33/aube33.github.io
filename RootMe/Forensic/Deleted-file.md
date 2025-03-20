---
layout: default
title: RootMe - Deleted file
permalink: /forensic/deleted-file
---

# Deleted file

## Statement
Your cousin found a USB drive in the library this morning. He’s not very good with computers, so he’s hoping you can find the owner of this stick!

The flag is the owner’s identity in the form firstname_lastname

sha256sum: cd9f4ada5e2a97ec6def6555476524712760e3d8ee99c26ec2f11682a1194778

## Analyze
Let's download the file (ch39.gz). After decompresing, the file usb.image was extracted, and with `file` command we get :
```bash
$ file usb.image 
usb.image: DOS/MBR boot sector, code offset 0x3c+2, OEM-ID "mkfs.fat", sectors/cluster 4, reserved sectors 4, root entries 512, sectors 63488 (volumes <=32 MB), Media descriptor 0xf8, sectors/FAT 64, sectors/track 62, heads 124, hidden sectors 2048, reserved 0x1, serial number 0xc7ecde5b, label: "USB        ", FAT (16 bit)
```
So our file is a MBR partition in FAT16 with "USB" as label.
Let's see what we found with file carving tool like __Testdisk__.

## Exploitation
```
TestDisk 7.2, Data Recovery Utility, February 2024                                                                                                                                                                                         
Christophe GRENIER <grenier@cgsecurity.org>                                                                                                                                                                                                
https://www.cgsecurity.org                                                                                                                                                                                                                 
                                                                                                                                                                                                                                           
Disk usb.image - 32 MB / 31 MiB - CHS 9 124 62                                                                                                                                                                                             
                                                                                                                                                                                                                                           
     Partition                  Start        End    Size in sectors                                                                                                                                                                        
>   P FAT16                    0   0  1     8  31 62      63488 [USB]
```
Testdisk confirm what we see above, a FAT16 partition with 63488 sectors.

Booting image with Testdisk give us that
```
TestDisk 7.2, Data Recovery Utility, February 2024                                                                                                                                                                                         
Christophe GRENIER <grenier@cgsecurity.org>                                                                                                                                                                                                
https://www.cgsecurity.org                                                                                                                                                                                                                 
   P FAT16                    0   0  1     8  31 62      63488 [USB]                                                                                                                                                                       
Directory /                                                                                                                                                                                                                                
                                                                                                                                                                                                                                           
>-rwxr-xr-x     0     0    246064 12-Sep-2021 16:05 anonyme.png
```
An `anonyme.png` file deleted (because it's in red but you can't see that) from `usb.image`. But when copying the .png with Testdisk our image seems corrupted :/

So we are going to try with another tool named __Foremost__
```bash
$ foremost -i usb.image
Processing: usb.image
|*|

$ tree output         
output
├── audit.txt
└── png
    └── 00000168.png

2 directories, 2 files
```
This time our .png is fully recovered, it's a picture of trees and sky but that doesn't give any information. So we use __exiftool__ to get the [EXIF](https://fr.wikipedia.org/wiki/Exchangeable_image_file_format) datas.
```
$ exiftool 00000168.png 
ExifTool Version Number         : 13.10
File Name                       : 00000168.png
Directory                       : .
File Size                       : 246 kB
File Modification Date/Time     : 2025:02:25 04:58:19-05:00
File Access Date/Time           : 2025:02:25 04:58:20-05:00
File Inode Change Date/Time     : 2025:02:25 04:58:19-05:00
File Permissions                : -rwxrwx---
File Type                       : PNG
File Type Extension             : png
MIME Type                       : image/png
Image Width                     : 400
Image Height                    : 300
Bit Depth                       : 8
Color Type                      : RGB
Compression                     : Deflate/Inflate
Filter                          : Adaptive
Interlace                       : Noninterlaced
Gamma                           : 2.2
White Point X                   : 0.3127
White Point Y                   : 0.329
Red X                           : 0.64
Red Y                           : 0.33
Green X                         : 0.3
Green Y                         : 0.6
Blue X                          : 0.15
Blue Y                          : 0.06
Background Color                : 255 255 255
XMP Toolkit                     : Image::ExifTool 11.88
Creator                         : Firstname Lastname
Image Size                      : 400x300
Megapixels                      : 0.120
```
We found firstname and lastname of author, we can validate the chall with flag like indicate in statement: firstname_lastname.

## How does it work ?
