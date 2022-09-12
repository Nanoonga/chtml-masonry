# chtml-masonry
> A Computed HTML (CHTML) solution to the Masonry layout

#### Gary Royal

![screenshot](masonry.png)

## Overview

**Computed HTML** (CHTML) is a programming model in which the tags describing a complex layout are compiled in RAM, then passed to the browser's HTML interpreter to render in a single paint. 

**The Masonry layout** (also known as the Pinterest layout) is a matrix of semi-regular elements separated by a constant margin, like bricks in a wall, but rotated 90 degrees so that it grows from the top down as new elements are added.

These listings demonstrate the Computed HTML model by using it as a runtime for the Masonry layout algorithm below.


## Features 

* Time to Interactive: instant 
* Supports high density displays
* Responsive from 200 to 2000 pixels viewport width
* Mobile ready
* Infinite scroll



## Quick Start

1. Clone or download the repo
2. Open the chtml-masonry folder
3. Drop the file masonry.html into your browser window


## Computed HTML 

Computed HTML uses the innerHTML function to parse and render an arbitrarily complex layout inserted anywhere within a skeletal DOM. The layout is assembled using JavaScript with every necessary attribute compiled inline. 

These attributes may be drawn from cookies, variables, hardcoded data, XMLHttp requests, or the environment the code is executing in (such as the current viewport geometry).  

```
<body>
   <link href="style.css">
   <script href="script.js">
   <div id="greeting"></div>
</body>

script.js:
   document.addEventListener("DOMContentLoaded", function(){
      document.getElementById("greeting").innerHTML = [
         '<p>Hello, World</p>',
      ].join('');
   });
```

## Masonry layout algorithm

```
const margin (px)
calc columns per row
calc column width
let img width = (column width - margin)

let column height[0 .. columns per row] = margin

for each image i

	let j = index(minimum(column_height))
	
	left = offset of jth column
	top = column height[j]
	img height = (aspect ratio * img width)
	quality = (images[i][width] >= devicePixelRatio * img_width) ? devicePixelRatio : 1
	
	chtml[i] = '<div class=brick style="
		left:(left)px; 
		top:(top)px; 
		width:(quality * img width)px; 
		height:(quality * img height)px; 
		url(https://picsum.photos/seed/i/img_width/img_height)
	"></div>'

	let column height[j] += img height + margin
	
next image

gallery.innerHTML += array to string(chtml)
```

#### Example CHTML element
```
chtml[i] = <div class="lozad brick"
style="top:1384px;left:61px;width:192px;height:144px;background-
image:url('https://picsum.photos/seed/30/384/576');">
<div class="brick-id">30&nbsp;2x</div></div>
```


## High Definition Displays

Whether high-resolution thumbnails are worth their download bandwidth on devices with a device pixel ratio > 2 is [philosophical](https://www.quirksmode.org/blog/archives/2012/07/more_about_devi.html).

By default, thumbnail images (tiles) are fetched at a multiple of the device pixel ratio if `device pixel ratio > 1` and `image width >= (display width * device pixel ratio)`.  

This will show the sharpest rendition on all displays at all window sizes. 

Some devices have noninteger device pixel ratios, like 2.25 or 3.5. The rounded device pixel ratio is the floor of the device pixel ratio, such as 1, 2, 3, or 4.

The tile size of the thumbnail is the display size * rounded device pixel ratio.

Mobile screens (and desktop browser windows) > 400 px use a fixed tile size for either orientation.  

### Mobile considerations 

On mobile screens < 400 px wide, the tile size will be different in portrait mode than landscape. This will cause a second rendition of the thumbnail to be downloaded when the device is rotated. It might be a waste of bandwidth, but it's not a bug.

If you're indifferent or unsure that tiles up to 4*x* on a mobile device are worthwhile, set the constant `prefer_retina = true`. This will download at a maximum 2*x* even if the device's rounded device pixel ratio is higher. 

If you don't want high density thumbnails on mobile at all, set the constant `enable_mobile_hd = false`. This will download all thumbnails at 1*x*.

These constants should have no effect on desktop browsers, which are assumed to have cheap and plentiful bandwidth.


## Lorem Picsum 

**[Lorem Picsum](https://picsum.photos/)** is a placeholder service, an API for fetching arbitrary pictures with arbitrary dimensions for demonstration purposes.

It is used in place of distributing an image database with this repo.

`shapefile.js` is a list of picture dimensions extracted from my own database of user-uploaded photos. Those dimensions are applied to the picsum request to download photos at irregular but realistic proportions to demonstrate the masonry effect. 

Picsum placeholders are fetched in 'seed' mode, that is, for an arbitrary seed value, Picsum returns an arbitrary placeholder, subject to the constraint that the same seed will always return the same image.


## Lozad.js

**[Lozad.js](https://github.com/ApoorvSaxena/lozad.js)** is an observer-based lazy loader for images. It is optional, but it allows the layout algorithm to run as fast as the user can scroll. 


