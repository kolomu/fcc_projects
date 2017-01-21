 var onlineCounter = 0;
 var offlineCounter = 0;
 var errorCounter = 0;
 var sizeTruncateString = 40;

 (function ($, viewport) {
     $(document).ready(function () {

         var jsonResponse = [];

         $.getJSON("data/twitch.json", function (data) {
             jsonResponse = data;
             setTruncatedStringLength(viewport.current());
             render(data);
         });

         function render(data) {
             var onlineStreams = [];
             var offlineStreams = [];
             var mappingBackgroundImage = [];

             var html = "";

             data.forEach(function (element) {
                 if (element.stream != null) {
                     onlineStreams.push(element)
                 } else {
                     offlineStreams.push(element);
                 }
             });

             onlineStreams.forEach(function (element) {
                 var additionalInfo = element.stream.status;
                 additionalInfo = truncateString(additionalInfo, sizeTruncateString);

                 // mapping list for css  (onlinecounter -> background image)
                 mappingBackgroundImage[this.onlineCounter] = element.stream.video_banner;

                 html += pushStreamToHtml(element.stream.url, true, element.stream.display_name, additionalInfo);
             });

             offlineStreams.forEach(function (element) {
                 // check if the stream is offline or 404
                 if (element._links) {
                     html += pushStreamToHtml(element._links.self, false, element.display_name, "");
                 } else {
                     html += push404StreamToHtml(truncateString(element.message, sizeTruncateString));
                 }
             });

             $('.list').html(html);

             addBackgroundCssToGeneratedIds("on", mappingBackgroundImage.length, mappingBackgroundImage);
             addBackgroundCssToGeneratedIds("of", offlineCounter, "images/offline.png");
             addBackgroundCssToGeneratedIds("er", errorCounter, "images/404.png");
         }

         function pushStreamToHtml(url, onlinecounter, titel, additionalInfo) {
             var tempHtml = [];

             if (onlinecounter) {
                 tempHtml.push("<div class='streambox'>");
                 tempHtml.push("<a href='");
                 tempHtml.push(url);
                 tempHtml.push("'>");
                 tempHtml.push("<div class='col-xs-6 col-md-6 streamInfoBox' id='");
                 tempHtml.push("on" + this.onlineCounter++);
                 tempHtml.push("'>");
                 tempHtml.push("<h3 class='streamtitle'>");
                 tempHtml.push(titel);
                 tempHtml.push("</h3>");
                 tempHtml.push("<span class='streamAdditionalInfo'>");
                 tempHtml.push(additionalInfo);
                 tempHtml.push("</span>");
                 tempHtml.push("</div></a></div>");
             } else {
                 tempHtml.push("<div class='streambox'>");
                 tempHtml.push("<a href='");
                 tempHtml.push(url);
                 tempHtml.push("'>");
                 tempHtml.push("<div class='col-xs-6 col-md-6 streamInfoBox' id='");
                 tempHtml.push("of" + this.offlineCounter++);
                 tempHtml.push("'>");
                 tempHtml.push("<h3 class='streamtitle'>");
                 tempHtml.push(titel);
                 tempHtml.push("</h3>");
                 tempHtml.push("<span class='streamAdditionalInfo'>");
                 tempHtml.push("This stream is offline");
                 tempHtml.push("</span>");
                 tempHtml.push("</div></a></div>");
             }

             return tempHtml.join("");
         }

         function push404StreamToHtml(message) {
             var tempHtml = [];
             tempHtml.push("<div class='streambox'>");
             tempHtml.push("<a href='#'>");
             tempHtml.push("<div class='col-xs-6 col-md-6 streamInfoBox' id='");
             tempHtml.push("er" + this.errorCounter++);
             tempHtml.push("'>");
             tempHtml.push("<h3 class='streamtitle'>");
             tempHtml.push("404 - Not found");
             tempHtml.push("</h3>");
             tempHtml.push("<span class='streamAdditionalInfo'>");
             tempHtml.push(message);
             tempHtml.push("</span>");
             tempHtml.push("</div></a></div>");

             return tempHtml.join("");
         }

         function addBackgroundCssToGeneratedIds(id, counter, imagePath) {
             // check if imagePath is an array if yes imagePath[i];
             if (Array.isArray(imagePath)) {
                 for (var i = 0; i < counter; i++) {
                     $("#" + id + i).css({
                         "background": 'url(' + imagePath[i] + ')',
                         "background-repeat": "no-repeat",
                         "background-origin": "border-box",
                         "background-position": "center left",
                         "background-size": "cover"
                     });
                 }
             } else {
                 for (var i = 0; i < counter; i++) {
                     $("#" + id + i).css({
                         "background": 'url(' + imagePath + ')',
                         "background-repeat": "no-repeat",
                         "background-origin": "border-box",
                         "background-position": "center left",
                         "background-size": "cover"
                     });
                 }
             }

         }

         function truncateString(str, num) {
             if (num >= str.length) return str;
             else if (num <= 3) {
                 str = str.slice(0, num);
                 str += "...";
             } else {
                 str = str.slice(0, num - 3);
                 str += "...";
             }
             return str;
         }

         function setTruncatedStringLength(viewport) {
             if (viewport === 'xs') {
                 this.sizeTruncateString = 30;
             }

             if (viewport === 'sm') {
                 this.sizeTruncateString = 50;
             }

             if (viewport === 'md') {
                 this.sizeTruncateString = 70;
             }

             if (viewport === 'lg') {
                 this.sizeTruncateString = 100;
             }
         }

         $(window).resize(
             viewport.changed(function () {
                 setTruncatedStringLength(viewport.current());

                 if (jsonResponse != null) {
                     render(jsonResponse);
                 }
             })
         );

     });
 })(jQuery, ResponsiveBootstrapToolkit);