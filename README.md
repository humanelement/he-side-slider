# he-side-slider
A lightweight plugin to create horizontal or vertical content sliders.

Written by Human Element's Milligan

See <a href="http://humanelement.github.io/he-side-slider/" target="_blank">DEMO</a>

Usage examples:
```Javascript

//example 1
heSideSlider.init({
  wrap:'.example1:first',
  slider:'.track:first',
  view:'.screen',
  prev_btn:'.move-left:first',
  next_btn:'.move-right:first',
  items_per_view:3
});

//example 2
heSideSlider.init({
  wrap:'.example2:first',
  slider:'.track:first',
  view:'.screen',
  prev_btn:'.move-up:first',
  next_btn:'.move-down:first',
  items_per_view:3,
  slide_mode:'slide-vertical'
});

//example 3
heSideSlider.init({
  wrap:'.example3:first',
  slider:'.track:first',
  view:'.screen',
  items_per_view:1,
  slide_mode:'fade',
  time_between_autoslide:1000,
  transition_speed:750,
  circular_next_prev:true,
  swipe_slide:false
});

//example 4
heSideSlider.init({
  wrap:'.example4:first',
  slider:'.track:first',
  view:'.screen',
  prev_btn:'.move-left:first',
  next_btn:'.move-right:first',
  items_per_view:4
});

//example 5
heSideSlider.init({
  wrap:'.example5:first',
  slider:'.track:first',
  view:'.screen',
  prev_btn:'.move-left:first',
  next_btn:'.move-right:first',
  items_per_view:4,
  at_or_below_widths:{
    '800':{
      items_per_view:3,
      slide_mode:'slide-vertical'
    }
  }
});

});
```
