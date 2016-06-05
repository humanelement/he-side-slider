var heSideSlider=(function(){
  return{
      getAtOrBelowWidth:function(wrap){
          var currentWidth=window.innerWidth;
          ret=wrap[0]['at_or_below_widths']['standard'];
          ret['at_or_below_width']='standard';
          ret['current_width']=currentWidth;
          var self=this;
          if(wrap!=undefined && wrap.length>0){
              if(wrap.length>1){ wrap=wrap.eq(0); }
              if(wrap[0].hasOwnProperty('ordered_at_or_below_widths')){
                  for(var w=wrap[0]['ordered_at_or_below_widths'].length-1;w>-1;w--){
                      var thisWidth=parseFloat(wrap[0]['ordered_at_or_below_widths'][w]);
                      if(currentWidth<=thisWidth){
                          ret=wrap[0]['at_or_below_widths'][thisWidth];
                          for(var k in wrap[0]['at_or_below_widths']['standard']){
                              if(wrap[0]['at_or_below_widths']['standard'].hasOwnProperty(k)){
                                  if(!ret.hasOwnProperty(k)){
                                      ret[k]=wrap[0]['at_or_below_widths']['standard'][k];
                                  }
                              }
                          }
                          ret['at_or_below_width']=thisWidth;
                          break;
                      }
                  }
                  ret['current_width']=currentWidth;
              }
          }
          return ret;
      },
      getActiveView:function(wrap){
          var self=this; var activeView;
          if(wrap!=undefined && wrap.length>0){
              var sliderSel=wrap[0]['key_slider_selectors']['slider'];
              var viewSel=wrap[0]['key_slider_selectors']['view'];
              var views=wrap.find(sliderSel).find(viewSel);
              if(views.length>1){
                activeView=views.filter('.active:first');
              }
              if(activeView==undefined || activeView.length<1){
                  activeView=views.eq(0);
              }
          } return activeView;
      },
      slideTo:function(wrap,whichView){
           var self=this;
          if(wrap!=undefined && wrap.length>0){
              if(!wrap.hasClass('transitioning')){
                  if(whichView!=undefined){
                      if(!isNaN(whichView)){
                          whichView=wrap[0]['key_slider_elems']['view'].eq(whichView);
                      }
                      if(whichView.length>0){
                          var prevView=wrap[0]['key_slider_elems']['view'].filter('.active:first');
                          wrap[0]['key_slider_elems']['view'].removeClass('active');
                          whichView.addClass('active');
                          var transition_speed=wrap[0]['transition_speed'];
                          var widthData=self['getAtOrBelowWidth'](wrap);
                          var slideMode=widthData['slide_mode'];
                          if(slideMode!==wrap.attr('data-slide-mode')){
                            wrap.attr('data-slide-mode',slideMode);
                          }
                          if(slideMode==='slide-vertical'){ slideMode='slide'; }
                          switch(slideMode){
                              case 'slide':
                                var slider=wrap[0]['key_slider_elems']['slider'];
                                var posType;
                                if(widthData['slide_mode']==='slide-vertical'){
                                    posType='top'; slider.css('left','');
                                }else{
                                    posType='left'; slider.css('top','');
                                }
                                var boundary=slider.parent();
                                boundary.addClass('slider-boundary');
                                var currentLeft=parseFloat(slider.css(posType));
                                if(isNaN(currentLeft)){ currentLeft=0; slider.css(posType,'0'); }
                                var viewLeft, boundaryLeft;
                                if(widthData['slide_mode']==='slide-vertical'){
                                    boundaryLeft=boundary.offset().top;
                                    viewLeft=whichView.offset().top;
                                }else{
                                    boundaryLeft=boundary.offset().left;
                                    viewLeft=whichView.offset().left;
                                }
                                if(boundaryLeft!==viewLeft){
                                    var diff=boundaryLeft-viewLeft;
                                    var newLeft=currentLeft+diff;
                                    if(transition_speed<1){
                                        slider.css(posType,newLeft+'px');
                                    }else{
                                        wrap.addClass('transitioning');
                                        var posData={}; posData[posType]=newLeft+'px';
                                        slider.animate(posData,transition_speed,function(){
                                            // Animation complete.
                                            wrap.removeClass('transitioning');
                                            if(wrap[0].hasOwnProperty('he_side_slide_autoslide')){
                                                wrap[0]['he_side_slide_autoslide']();
                                            }
                                        });
                                    }
                                }
                                break;
                              case 'fade':
                                //if not the very first screen load
                                if(prevView.length>0){
                                    if(transition_speed>0){
                                        wrap.addClass('transitioning');

                                        whichView.css('opacity','0').addClass('fading-in');
                                        prevView.css('opacity','1').addClass('fading-out');

                                        prevView.animate({
                                            opacity:'0',
                                        },transition_speed,function() {
                                                // Animation complete.
                                                prevView.removeClass('fading-out');
                                        });
                                        whichView.animate({
                                            opacity:'1',
                                        },transition_speed,function() {
                                                // Animation complete.
                                                whichView.removeClass('fading-in');
                                                wrap.removeClass('transitioning');
                                                if(wrap[0].hasOwnProperty('he_side_slide_autoslide')){
                                                    wrap[0]['he_side_slide_autoslide']();
                                                }
                                        });
                                    }
                                }
                                break;
                          }
                          //indicate when at first/last slide
                          wrap.removeClass('at_first_slide').removeClass('at_last_slide');
                          if(wrap[0]['key_slider_elems']['view'].filter(':last').hasClass('active')){
                              wrap.addClass('at_last_slide');
                          }
                          if(wrap[0]['key_slider_elems']['view'].eq(0).hasClass('active')){
                              wrap.addClass('at_first_slide');
                          }
                      }
                  }
              }
          }
      },
      slideNext:function(wraps){
           var self=this;
          if(wraps!=undefined && wraps.length>0){
              wraps.each(function(){
                  jQuery(this)[0]['key_slider_elems']['view'].each(function(v){
                      jQuery(this).attr('data-view-index',v+'');
                  });
                  var activeView=jQuery(this)[0]['key_slider_elems']['view'].filter('.active:first');
                  var viewIndex=parseInt(activeView.attr('data-view-index'));
                  var nextView=jQuery(this)[0]['key_slider_elems']['view'].filter('[data-view-index="'+(viewIndex+1)+'"]');
                  if(nextView.length<1){
                      if(jQuery(this)[0]['circular_next_prev']){
                          nextView=jQuery(this)[0]['key_slider_elems']['view'].eq(0);
                      }
                  }
                  jQuery(this)[0]['key_slider_elems']['view'].removeAttr('data-view-index');
                  self['slideTo'](jQuery(this), nextView);
              });
          }
      },
      slidePrev:function(wraps){
           var self=this;
          if(wraps!=undefined && wraps.length>0){
              wraps.each(function(){
                  jQuery(this)[0]['key_slider_elems']['view'].each(function(v){
                      jQuery(this).attr('data-view-index',v+'');
                  });
                  var activeView=jQuery(this)[0]['key_slider_elems']['view'].filter('.active:first');
                  var viewIndex=parseInt(activeView.attr('data-view-index'));
                  var nextView=jQuery(this)[0]['key_slider_elems']['view'].filter('[data-view-index="'+(viewIndex-1)+'"]');
                  if(nextView.length<1){
                      if(jQuery(this)[0]['circular_next_prev']){
                          nextView=jQuery(this)[0]['key_slider_elems']['view'].filter(':last');
                      }
                  }
                  jQuery(this)[0]['key_slider_elems']['view'].removeAttr('data-view-index');
                  self['slideTo'](jQuery(this), nextView);
              });
          }
      },
      init:function(args){
          var retInit={}; var self=this;
          var getArg=function(ar,name,defaultVal){
              var ret;
              if(ar.hasOwnProperty(name)){ ret=ar[name]; }
              else{ ret=defaultVal; }
              return ret;
          };
          var getElArg=function(ar,name,parent){
              var el;
              var elSel=getArg(ar,name);
              if(elSel!=undefined){
                  if(parent!=undefined){
                    el=parent.find(elSel);
                  }else{
                      el=jQuery(elSel);
                  }
                  if(el.length<1){
                      el=undefined;
                  }
              }return el;
          };
          var keySels=['prev_btn','next_btn','slider','view'];
          var hasSels={};
          var getArgEls=function(ar,parent){
              var ret={missing:[]};
              for(var n=0;n<keySels.length;n++){
                  var val=getElArg(ar,keySels[n],parent);
                  if(val!=undefined){ ret[keySels[n]]=val;hasSels[keySels[n]]=ar[keySels[n]]; }
                  else{ ret['missing'].push(keySels[n]); }
              } return ret;
          };
          var wrap=getElArg(args,'wrap'); var keyEls;
          if(wrap!=undefined){
              if(!wrap.hasClass('init_he_slider')){
                  wrap.addClass('init_he_slider');
                  wrap[0]['circular_next_prev']=getArg(args,'circular_next_prev',false);
                  wrap[0]['slide_mode']=getArg(args,'slide_mode','slide');
                  wrap.attr('data-slide-mode',wrap[0]['slide_mode']);
                  wrap[0]['transition_speed']=getArg(args,'transition_speed',300);
                  keyEls=getArgEls(args,wrap);
                  if(keyEls!=undefined
                  && keyEls.hasOwnProperty('slider')
                  && keyEls.hasOwnProperty('view')){
                      keyEls['slider'].addClass('he_slider');
                      keyEls['view'].addClass('he_view');
                      keyEls['view'].children().addClass('he_item');
                      wrap[0]['key_slider_selectors']=hasSels;
                      wrap[0]['key_slider_elems']=keyEls;
                      keyEls['view'].eq(0).addClass('active');
                      var items_per_view=getArg(args,'items_per_view',1);
                      var at_or_below_widths=getArg(args,'at_or_below_widths');
                      wrap[0]['at_or_below_widths']={
                        standard:{
                            items_per_view:items_per_view,
                            slide_mode:wrap[0]['slide_mode']
                        }
                      };
                      //sort the at_or_below_widths in descending order
                      var orderedWidths=[];
                      if(at_or_below_widths!=undefined){
                          for(var width in at_or_below_widths){
                              if(at_or_below_widths.hasOwnProperty(width)){
                                  wrap[0]['at_or_below_widths'][width]=at_or_below_widths[width];
                                  width=parseFloat(width);
                                  if(!isNaN(width)){
                                    if(orderedWidths.length<1){ orderedWidths.push(width) }
                                    else if(orderedWidths.length===1){
                                        if(orderedWidths[0]<width){ orderedWidths.splice(0,0,width); }
                                        else{ orderedWidths.push(width); }
                                    }else{
                                        if(orderedWidths[orderedWidths.length-1]>width){
                                            orderedWidths.push(width);
                                        }else{
                                            for(var w=0;w<orderedWidths.length;w++){
                                                if(orderedWidths[w]<width){
                                                    orderedWidths.splice(w,0,width); break;
                                                }
                                            }
                                        }
                                    }
                                  }
                              }
                          }
                          wrap[0]['ordered_at_or_below_widths']=orderedWidths;
                      }
                      if(keyEls.hasOwnProperty('prev_btn')){
                          keyEls['prev_btn'].addClass('he_prev');
                          keyEls['prev_btn'].click(function(){
                              self['slidePrev'](jQuery(this).parents('.init_he_slider:first'));
                          });
                      }
                      if(keyEls.hasOwnProperty('next_btn')){
                          keyEls['next_btn'].addClass('he_next');
                          keyEls['next_btn'].click(function(){
                              self['slideNext'](jQuery(this).parents('.init_he_slider:first'));
                          });
                      }
                      //add swipe slide event
                      var swipe_slide=getArg(args,'swipe_slide',true);
                      if(swipe_slide){
                          jQuery(wrap[0]['key_slider_elems']['slider']).on('touchmove',function(e){
                              if(e.originalEvent){e=e.originalEvent;}
                              var widthData=self['getAtOrBelowWidth'](jQuery(this).parents('.init_he_slider:first'));
                              var slideMode=widthData['slide_mode'];
                              var propName='prev_he_slide_swipe_x', dirType='he_slide_direction_x', eventProp='pageX';
                              var onward='right', backward='left';
                              if(slideMode==='slide-vertical'){
                                  eventProp='pageY'; propName='prev_he_slide_swipe_y'; dirType='he_slide_direction_y';
                                  onward='down'; backward='up';
                              }
                              var pos=jQuery(this)[0][propName];
                              if(pos!=undefined){
                                  var requiredMinDistance=10; //avoid left/right swipe on up/down
                                  //if moved left
                                  if(e[eventProp] < pos){
                                      console.log(pos - e[eventProp]);
                                      if(pos - e[eventProp] >= requiredMinDistance){
                                        jQuery(this)[0][dirType]=onward; e.preventDefault(); e.stopPropagation();
                                      }
                                  }else if(pos < e[eventProp]){ //if moved right
                                      if(e[eventProp] - pos >= requiredMinDistance){
                                        jQuery(this)[0][dirType]=backward; e.preventDefault(); e.stopPropagation();
                                      }
                                  }
                              }
                              jQuery(this)[0][propName]=e[eventProp];
                          });
                          jQuery(wrap[0]['key_slider_elems']['slider']).on('touchend', function(e) {
                              var widthData=self['getAtOrBelowWidth'](jQuery(this).parents('.init_he_slider:first'));
                              var slideMode=widthData['slide_mode'];
                              var direction=jQuery(this)[0]['he_slide_direction_x'];
                              if(slideMode==='slide-vertical'){
                                  direction=jQuery(this)[0]['he_slide_direction_y'];
                              }
                              if(direction!=undefined){
                                  switch(direction){
                                      case 'left':
                                        self['slidePrev'](jQuery(this).parents('.init_he_slider:first'));
                                        e.preventDefault(); e.stopPropagation();
                                        break;
                                      case 'right':
                                        self['slideNext'](jQuery(this).parents('.init_he_slider:first'));
                                        e.preventDefault(); e.stopPropagation();
                                        break;
                                      case 'up':
                                        self['slidePrev'](jQuery(this).parents('.init_he_slider:first'));
                                        e.preventDefault(); e.stopPropagation();
                                        break;
                                      case 'down':
                                        self['slideNext'](jQuery(this).parents('.init_he_slider:first'));
                                        e.preventDefault(); e.stopPropagation();
                                        break;
                                  }
                              }
                              jQuery(this)[0]['he_slide_direction_x']=undefined;
                              jQuery(this)[0]['prev_he_slide_swipe_x']=undefined;
                              jQuery(this)[0]['he_slide_direction_y']=undefined;
                              jQuery(this)[0]['prev_he_slide_swipe_y']=undefined;
                          });
                      }
                      //if there is auto slide
                      var time_between_autoslide=getArg(args,'time_between_autoslide',0);
                      if(time_between_autoslide>0){
                          wrap[0]['he_side_slide_autoslide']=function(){
                              setTimeout(function(){
                                  //if not hovering over the slider
                                  if(!wrap.hasClass('over')){
                                    self['slideNext'](wrap);
                                  }else{
                                      //recursive wait and try again
                                      wrap[0]['he_side_slide_autoslide']();
                                  }
                              },time_between_autoslide);
                          };
                          wrap.hover(function(){
                              wrap.addClass('over');
                          },function(){
                              wrap.removeClass('over');
                          });
                          wrap.mouseleave(function(){
                              wrap.removeClass('over');
                          });
                          wrap[0]['he_side_slide_autoslide']();
                      }
                      //if window resize events not already init
                      if(!document.hasOwnProperty('init_he_slider')){
                          document['init_he_slider']=true;
                          jQuery(window).ready(function(){
                             var updateItemsPerView=function(w){
                                  var widthData=self['getAtOrBelowWidth'](w);
                                  var ipv=widthData['items_per_view'];
                                  var sliderSel=w[0]['key_slider_selectors']['slider'];
                                  var viewSel=w[0]['key_slider_selectors']['view'];
                                  var views=w.find(sliderSel).find(viewSel); var needsUpdateItemCount=false;
                                  views.each(function(v){
                                      //if this view doesn't have the correct number of items
                                      var numItems=jQuery(this).children().length;
                                      if(numItems!==ipv){
                                          //if not last view
                                          if(v!==views.length-1){
                                              needsUpdateItemCount=true; return false;
                                          }else{
                                              //if last view has too many items
                                              if(numItems>ipv || numItems===0){
                                                  needsUpdateItemCount=true;
                                              }
                                          }
                                      }
                                  });
                                  //if the number of items per view need updating
                                  if(needsUpdateItemCount){
                                      var items=views.children();
                                      var itemsCount=items.length; var remainCount=itemsCount;
                                      var numNeededViews=0;
                                      while(remainCount>0){ remainCount-=ipv; numNeededViews++; }
                                      //if need more views
                                      if(numNeededViews>views.length){
                                          //add more views
                                          var numToAdd=numNeededViews-views.length;
                                          for(var a=0;a<numToAdd;a++){
                                              var newView=views.filter(':last').clone();
                                              newView.children().remove();
                                              views.filter(':last').after(newView);
                                              views=w.find(viewSel); items=views.children();
                                          }
                                      }else if(views.length>numNeededViews){
                                          //need fewer views... remove views
                                          var numToRemove=views.length-numNeededViews;
                                          for(var r=0;r<numToRemove;r++){
                                              if(views.length>1){
                                                var lastView=views.filter(':last');
                                                var nextLastView=views.eq(views.length-2);
                                                nextLastView.append(lastView.children());
                                                lastView.remove();
                                                views=w.find(viewSel); items=views.children();
                                              }else{break;}
                                          }
                                      }
                                      var putInView=0; var increaseAt=ipv;
                                      items.each(function(i){
                                          jQuery(this).attr('data-view-index',putInView);
                                          if(i+1===increaseAt){ increaseAt+=ipv; putInView++; }
                                      });
                                      views.each(function(v){
                                          var moveItems=items.filter('[data-view-index="'+v+'"]');
                                          jQuery(this).append(moveItems.removeAttr('data-view-index'));
                                      });
                                      //update elements
                                      w[0]['key_slider_elems']['view']=views;
                                      //update at_first_slide, etc...
                                      var activeView=self['getActiveView'](w);
                                      self['slideTo'](w,activeView);
                                 }
                              };
                              var handle_he_slider_resize = function(){
                                  jQuery('.init_he_slider').each(function(){
                                      updateItemsPerView(jQuery(this));
                                      var widthData=self['getAtOrBelowWidth'](jQuery(this));
                                      if(widthData['slide_mode']==='slide'
                                      || widthData['slide_mode']==='slide-vertical'){
                                        var activeView=self['getActiveView'](jQuery(this));
                                        self['slideTo'](jQuery(this),activeView);
                                      }
                                  });
                              };
                              var timeout_he_slider_resize;
                              jQuery(window).resize(function(){
                                  clearTimeout(timeout_he_slider_resize);
                                  timeout_he_slider_resize=setTimeout(function(){
                                      handle_he_slider_resize();
                                  },100);
                              });
                              handle_he_slider_resize();
                          });
                      }
                  }
              }
          }
          return retInit;
      }
  };
}());
