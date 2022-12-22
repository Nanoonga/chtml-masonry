/***************************************************************************
 *
 *   masonry.js v3
 *   https://github.com/glroyal/chtml-masonry/shapefile.js
 *   Copyright (c) 2022 Gary Royal
 *  
 *   This program is free software; you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation; either version 2 of the License, or
 *   (at your option) any later version.
 *
 ***************************************************************************/


function $(el) {
    try {
        return (typeof el == 'string') ? document.getElementById(el) : el;
    } catch (e) {
        if (debug) {
            alert(el);
        }
    }
} 


function get_window_geometry() {

    window_width = function() {
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

    window_height = function() {
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

    viewport_width = window_width - scrollbar_width;
};

get_window_geometry();


const last_width = viewport_width,

    mobile = navigator.userAgent.toLowerCase().match(/mobile/i),

    splurge = true,

    responsive_columns = [0,0,2,2,2,2,3,3,4,4,5,5,5,5,6,6,7,7,8,8,9],

    columns_per_row = responsive_columns[Math.floor(viewport_width / 100)],

    gutter_size = 8,

    total_gutter_width = (columns_per_row + 1) * gutter_size,

    max_img_width = (Math.floor((viewport_width - total_gutter_width) / columns_per_row) * 4) / 4,

    alt_max_width = 192, // 

    img_width = (max_img_width >= alt_max_width) ? alt_max_width : max_img_width,

    gallery_width = (img_width * columns_per_row) + total_gutter_width,

    left_offset = Math.floor((viewport_width - gallery_width) / 2),

    observer = lozad();

var download_limit = 64;

if(download_limit > 0) {

    shapes = shapes.slice(0,download_limit);
}


var page_number = 0, 

    page_length = Math.ceil(window_height / img_width) * columns_per_row * 2,

    total_pages = Math.ceil(shapes.length / page_length),
    
    photo_counter = 1,

    column_height = new Array(columns_per_row);

    column_height.fill(gutter_size);
    
    console.log(shapes.length);
    console.log(page_length);
    console.log(total_pages);

function fetch_page() {

    if(page_number < total_pages) {    

        var ll = page_number * page_length, rr = ll + page_length;     
        return shapes.slice(ll, rr);

    } else {
        return [];             
    }               
}


function auto_paginate() {

    if(total_pages > 0) {

        var images = fetch_page();

        if(images.length>0) {

            var chtml = [],

            i,  // current image

            j,  // current column

            img_height,

            tile_width,

            tile_height,

            dpr = devicePixelRatio,

            rdpr,

            r,

            q;

            for(i = 0; i < images.length; i++) {

                // j = column with shortest height

                j = column_height.indexOf(Math.min(...column_height));

                img_height = Math.round((images[i][1] / images[i][0]) * img_width, 0);

                r = (dpr > 1 && images[i][0] >= img_width * dpr) ? dpr : 1;

                if(dpr > 1 && r == 1 && splurge) {

                    rdpr = Math.floor(devicePixelRatio); // force integer

                    r = (rdpr >= 4 && images[i][0] >= img_width * 2) ? 2 : r;
                    r = (rdpr >= 4 && images[i][0] >= img_width * 3) ? 3 : r;   
                    r = (rdpr >= 4 && images[i][0] >= img_width * 4) ? 4 : r;    
                    r = (rdpr >= 3 && images[i][0] >= img_width * 2) ? 2 : r;
                    r = (rdpr >= 3 && images[i][0] >= img_width * 3) ? 3 : r;                                                         
                    r = (rdpr >= 2 && images[i][0] >= img_width * 2) ? 2 : r;
                } 

                q = (r>1 && images[i][0] >= img_width * r);

                chtml[i] = `<div class="lozad brick" style="top:${
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
                    img_width * r
                }/${
                    img_height * r
                }');"><div class="brick-id">${ 
                    photo_counter + ((q) ? '&nbsp;@' + r + '' : '')
                }</div></div>`;


                // console.log(chtml[i]);

                column_height[j] += img_height + gutter_size;

                photo_counter++;

                // photo_counter = (photo_counter > shapes.length) ? 1 : photo_counter;
            }

            var el = document.createElement('div');
            el.innerHTML = chtml.join('');
            $('gallery').appendChild(el);
            
            observer.observe();        
        } 
    } 
}


// pause execution while window is being dragged

function debounce(func){

  var timer;

  return function(event){
    if(timer) clearTimeout(timer);
    timer = setTimeout(func,100,event);
  };
}


// re-render gallery after resize or orientation change

window.addEventListener("resize",debounce(function(e){

    get_window_geometry();

    if (viewport_width != last_width) {
        location.reload();
    }
}));
      

document.addEventListener("DOMContentLoaded", function(){

    $('form1').innerHTML = [

        '<header>',
            '<h3>',document.title,'</h3>',
        '</header>',

        '<div id="pga">',
            '<div id="gallery"></div>',  
        '</div>',
           
    ].join('');

    $('pga').addEventListener("scroll", function () {

        if ($('pga').scrollHeight - $('pga').scrollTop === $('pga').clientHeight) {

            page_number++; 

            page_number = (page_number>(total_pages-1)) ? total_pages-1 : page_number; 

            auto_paginate();
        }

    }, false);

    auto_paginate();
});