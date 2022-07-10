# chtml-masonry

> A Computed HTML (CHTML) approach to the Masonry layout

### Gary Royal

![screenshot](masonry.png)


## Features 

* Time to Interactive < 1 second
* Supports high-density displays
* Responsive from 200 to 2000 density-independent pixels (dip) per row
* No dependencies


## Quick Start

1. Clone or download the repo
2. Open the chtml-masonry folder
3. Drop the file masonry.html into your browser window


## Overview

**Computed HTML** (CHTML) is a programming model in which the tags describing a complex layout are compiled in RAM, then passed to the browser's HTML interpreter to render in a single paint. 

**The Masonry layout** (also known as the Pinterest layout) is a matrix of semi-regular elements separated by a constant margin, like bricks in a wall, but rotated 90 degrees so that it grows from the top down as new elements are added.

These listings provide a practical demonstration of the Computed HTML model by using it as a runtime for the Masonry layout algorithm under development. 


## Algorithm

```
const margin (px)
calc columns per row
calc column width
let img width = (column width - margin)

let column height[0 .. columns per row] = margin

for each image i

	let j = i mod (columns per row)
		
	left = offset of jth column
	top = column height[j]
	img height = (aspect ratio * img width)

	chtml[i] = '<div class=brick style="
			left:(left)px; 
			top:(top)px; 
			width:(img width)px; 
			height:(img height)px; 
			url(https://picsum.photos/seed/i/img_width/img_height)">
		</div>'

	let column height[j] += img height + margin
	
next image

gallery.innerHTML = array to string (chtml)
```

## Lorem Picsum 

**[Lorem Picsum](https://picsum.photos/)** is a placeholder service, an API for fetching arbitrary pictures with arbitrary dimensions for demonstration purposes.

It would not be practical to distribute an image database to demonstrate this Masonry algorithm. However, the native aspect ratio of Picsum placeholders is very regular; if scaled to their original aspect ratio, the rendered matrix would look like a grid instead of a brick wall, and it wouldn't be obvious how the algorithm works.

The file `image-sizes.js` contains a list of the width and height of 128 random pictures from my own database. We scale those dimensions to thumbnail size per the algorithm, then request a placeholder image from Picsum in place of the original database image.

There are CSS strategies to the Masonry layout. CSS is fast, but fragile and nonobvious. There are JS strategies, too, but they're orders of magnitude slower than CSS because they manipulate the contents of a rendered DOM in situ. 

Computed HTML is a JS strategy that is almost as fast as CSS, because a stream of HTML tags can be compiled in milliseconds, and the browser's HTML parser is optimized for rendering DOMs from such streams.

Picsum placeholders are fetched in 'seed' mode, that is, for an arbitrary input, Picsum gives us an arbitrary placeholder, subject to the constraint that the same seed value will always return the same image.


## Errata

Differences in average height per image per column often results in long runs of elements in some columns but not others. 

I left them as-is because the solution requires a second compute pass to balance the columns by inserting spacers or rearranging pictures, but I haven't chosen a strategy. 
