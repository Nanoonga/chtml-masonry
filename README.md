# chtml-masonry
> A Computed HTML (CHTML) solution to the Masonry layout

#### Gary Royal

![screenshot](masonry.png)

## Overview

**Computed HTML** (CHTML) is a programming model in which the tags describing a complex layout are compiled in RAM, then passed to the browser's HTML interpreter to render in a single paint. 

**The Masonry layout** (also known as the Pinterest layout) is a matrix of semi-regular elements separated by a constant margin, like bricks in a wall, but rotated 90 degrees so that it grows from the top down as new elements are added.

These listings demonstrate the Computed HTML model by using it as a runtime for the Masonry layout algorithm below.


## Features 

* Time to Interactive: instant (< 500 ms)
* Infinite scroll
* Supports UHD 4K and Retina displays
* Responsive from 200 to 2000 pixels viewport width


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


## High Definition Displays

Thumbnail images are fetched at a multiple of the device pixel ratio if `device pixel ratio > 1` and `image width >= (display width * device pixel ratio)`.  

This will show the sharpest rendition on all displays. 

Whether high-resolution thumbnails are worth their download bandwidth on devices with a pixel ratio > 2 is philosophical. 


## Lorem Picsum 

**[Lorem Picsum](https://picsum.photos/)** is a placeholder service, an API for fetching arbitrary pictures with arbitrary dimensions for demonstration purposes.

It is used in place of distributing an image database with this repo.

`shapefile.js` is a list of picture dimensions extracted from my own database of user-uploaded photos. Those dimensions are applied to the picsum request to download photos at irregular but realistic proportions to demonstrate the masonry effect. 

Picsum placeholders are fetched in 'seed' mode, that is, for an arbitrary seed value, Picsum returns an arbitrary placeholder, subject to the constraint that the same seed will always return the same image.


## Lozad.js

**[Lozad.js](https://github.com/ApoorvSaxena/lozad.js)** is an observer-based lazy loader for images. It is optional, but it allows the layout algorithm to run as fast as the user can scroll. 


