
/***************************************************************************
 *
 *   This program is free software; you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation; either version 2 of the License, or
 *   (at your option) any later version.
 *
 ***************************************************************************/

function get_window_geometry() {

    viewport_width = function() {
        var x = 0;
        if (self.innerHeight) {
            x = self.innerWidth;
        } else if (document.documentElement && document.documentElement.clientHeight) {
            x = document.documentElement.clientWidth;
        } else if (document.body) {
            x = document.body.clientWidth;
        }
        return x;
    }(),

    viewport_height = function() {
        var y = 0;
        if (self.innerHeight) {
            y = self.innerHeight;
        } else if (document.documentElement && document.documentElement.clientHeight) {
            y = document.documentElement.clientHeight;
        } else if (document.body) {
            y = document.body.clientHeight;
        }
        return y;
    }(),

    scrollbar_width = function() {
        // Creating invisible container
        const outer = document.createElement('div');
        outer.style.visibility = 'hidden';
        outer.style.overflow = 'scroll'; // forcing scrollbar to appear
        outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps
        document.body.appendChild(outer);

        // Creating inner element and placing it in the container
        const inner = document.createElement('div');
        outer.appendChild(inner);

        // Calculating difference between container's full width and the child width
        const scrollbar_width = (outer.offsetWidth - inner.offsetWidth);

        // Removing temporary elements from the DOM
        outer.parentNode.removeChild(outer);

        return scrollbar_width;
    }();

    window_width = viewport_width - scrollbar_width;
};


// prevent rendering until window is resized

function debounce(func){

  var timer;

  return function(event){
    if(timer) clearTimeout(timer);
    timer = setTimeout(func,100,event);
  };
}


// re-render gallery on resize or orientation change

window.addEventListener("resize",debounce(function(e){

    get_window_geometry();

    if (window_width != last_width) {
        location.reload();
    }
}));


function render_gallery() {

    const responsive_columns = [0,0,2,2,2,2,3,3,4,4,5,5,5,5,6,6,7,7,8,8,9],

        columns_per_row = responsive_columns[Math.floor(window_width / 100)],

        gutter_size = 8,

        total_gutter_width = (columns_per_row + 1) * gutter_size,

        max_img_width = (Math.floor((window_width - total_gutter_width) / columns_per_row) * 4) / 4,

        img_width = (max_img_width > 192) ? 192 : max_img_width,

        hi_def = (devicePixelRatio > 1),

        gallery_width = (img_width * columns_per_row) + total_gutter_width,

        left_offset = Math.floor((window_width - gallery_width) / 2),

        column_height = new Array(columns_per_row),

        chtml = new Array(images.length);

    var i,  // current image

        j,  // current column

        img_height;

    column_height.fill(gutter_size); // start the wall with a row of mortar

    for(i = 0; i < images.length; i++) {

        j = i % columns_per_row;

        img_height = Math.round((images[i][1] / images[i][0]) * img_width, 0);

        chtml[i] = `<div class="brick" style="top:${
                column_height[j]
            }px;left:${
                left_offset + gutter_size + (j * (img_width + gutter_size))
            }px;width:${
                img_width
            }px;height:${
                img_height
            }px;background-image:url('https://picsum.photos/seed/${
                i+1
            }/${
                ((hi_def) ? img_width * 2 : img_width )
            }/${
                ((hi_def) ? img_height * 2 : img_height )
            }');"><div class="brick-id">${ i+1 }</div></div>`;
                
        column_height[j] += img_height + gutter_size;
    }
    
    document.getElementById('gallery').innerHTML = chtml.join('');
}

get_window_geometry();

last_width = window_width;

document.addEventListener("DOMContentLoaded", function(){
    render_gallery();
});
