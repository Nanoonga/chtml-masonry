# chtml-masonry

> A Computed HTML (CHTML) approach to the Masonry layout

### Gary Royal

![screenshot](masonry.png)


## Features 

* Time to Interactive < 1 second
* Responsive from 200 to 2000 density-independent pixels (dip)
* Rerenders on window resize or orientation change
* No dependencies


## Quick Start

1. Clone or download the repo
2. Open the chtml-masonry folder
3. Drop the file masonry.html into your browser window
4. Review the code and adapt it to your own purposes

## Overview

**The Masonry layout** (also known as the Pinterest layout) is a matrix of irregular elements separated by a constant margin, like bricks in a wall, but rotated 90 degrees so that it grows from the top down as new elements are added.

**Computed HTML** (CHTML) is a web development model in which the tags describing a complex layout are compiled in RAM, then passed to the browser's HTML interpreter to render in a single paint. 

This program provides an introduction and practical demonstration of the Computed HTML model, which eschews build systems and MVC frameworks and templating engines and other externalities in favor of lightning fast, readable, maintainable code suitable for mission critical systems.


## Algorithm

```
const margin (px)
calc columns per row
calc column width
let img width = (column width - margin)

let column height[0 .. columns per row] = margin

for each image i
	for each column j
		
		left = offset of jth column
		top = column height[j];
		img height = (aspect ratio * img width)

		chtml[i] = '<div class=brick style="
				left:(left)px; 
				top:(top)px; 
				width:(img width)px; 
				height:(img height)px; 
				url(https://picsum.photos/seed/i/img_width/img_height");">
			   </div>'

		let column height[j] += img height + margin

	next column
next image

let innerHTML of gallery = array to string (chtml)
```

## Lorem Picsum 

**[Lorem Picsum](https://picsum.photos/)** is a placeholder service, an API for fetching arbitrary pictures prescaled to arbitrary dimensions. 

The native aspect ratio of Picsum placeholders is very regular. The rendered matrix would look like a simple grid if we used them as-is. 

```
var images = [
	[width, height],
	..,
	[width, height]
];
```

The file `image-sizes.js` contains a list of the width and height of 128 random pictures from my database. We scale those dimensions to thumbnail size per the algorithm, then request a placeholder image from Picsum in place of the database image.


Placeholders are fetched in 'seed' mode, that is, for an arbitrary input, Picsum gives us an arbitrary placeholder, subject to the constraint that the same 'seed' value will always return the same output image. 


## Errata

Differences in average height per image per column (which varies with the number and length of columns) can create long stacks of elements surrounded by empty space at the bottom of the screen.

I left them as-is because the solution requires a second compute pass to balance the columns by inserting spacers or rearranging pictures, but I haven't chosen a strategy. 
