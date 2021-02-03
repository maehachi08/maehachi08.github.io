// Jekyll Seach with lunr
// https://jekylltips-ja.github.io/tutorials/search/
//
//
//
//
// ============== search_data.json sample  ==============
//    ---
//    layout: null
//    ---
//    {
//      {% for post in site.posts %}
//
//        "{{ post.url | slugify }}": {
//          "title": "{{ post.title | xml_escape }}",
//          "date": "{{ post.date | date: "%Y/%m/%d %H:%M" }}",
//          "url": "{{ post.url | xml_escape }}",
//          "author": "{{ post.author | xml_escape }}",
//          "categories": "{% for category in post.categories %}{{ category }}{% unless forloop.last %}, {% endunless %}{% endfor %}",
//          "tags": "{% for tag in post.tags %}{{ tag }}{% unless forloop.last %}, {% endunless %}{% endfor %}",
//          "thumbnail": "{{ post.thumbnail | xml_escape }}",
//          "content":  "{{ post.content | strip_newlines | xml_escape }}",
//          "content_excerpt": "{{ post.excerpt | markdownify | strip_newlines | escape }}"
//        }
//        {% unless forloop.last %},{% endunless %}
//      {% endfor %}
//    }
// ============== search_data.json sample  ==============
//
//
//
//
// ============== template node sample  ==============
//    <template id="card_template">
//        <div class="ui card item" style="min-height: 250px; min-width: 150px;">
//            <div class="content">
//                <div class="header">
//                    <a href=""></a>
//                </div>
//                <div class="ui image">
//                    <img src="" />
//                </div>
//                <div class="meta">
//                    <span></span>
//                </div>
//                <div class="description"></div>
//            </div>
//            <div class="extra content">
//            </div>
//        </div>
//    </template>
// ============== search_data.json sample  ==============
//
//


$(function() {


    // html special characters decode
    var htmlscd = (function() {
      const re = /&#x([0-9A-Fa-f]+);|&#(\d+);|&\w+;/g;
      const map = {'&nbsp;':' ','&lt;':'<','&gt;':'>','&amp;':'&','&quot;':'"','&apos;':"'",'&copy;':'©'};
      return function(text) {
        return text.replace(re, function(match, p1, p2) {
          if (match.charAt(1) == '#') {
            if (match.charAt(2) == 'x') {
              return String.fromCharCode(parseInt(p1, 16));
            } else {
              return String.fromCharCode(p2-0);
            }
          } else if (map.hasOwnProperty(match)) {
            return map[match];
          }
          return match;
        });
      };
    })();


    // Download the data from the JSON file we generated
    window.data = $.getJSON('/search_data.json');
    var result = [];

    window.data.then(function(loaded_data){
        result = loaded_data;

        window.idx = lunr(function () {

            // Initalize lunr with the fields it will be searching on. I've given title
            // a boost of 10 to indicate matches on this field are more important.
            this.use(lunr.ja);
            this.use(lunr.multiLanguage('en', 'ja'));
            this.field('id');
            this.field('title');
            this.field('content', { boost: 10 });
            this.field('author');
            this.field('categories');

            var that = this;

            // Wait for the data to load and add it to lunr
            $.each(loaded_data, function(index, value) {
                var row = $.extend({ "id": index }, value)
                that.add(row);
            });
        });
    });



    // Event when the form is submitted
    $("#site_search").on('submit', function(event){
        event.preventDefault();
        var query = $("#search_box").val(); // Get the value for the text field
        var results = window.idx.search(query); // Get lunr to perform a search
        display_search_results(results); // Hand the results off to be displayed
    });





    // rendring search result to use html template.
    function display_search_results(results) {

        $('.page_contents').remove();
        $('.contents_body').empty();

        $('.contents_body').append('<h2 class="ui large header"><i class="fa fa-tags fa-xs"></i>Serach Result<div class="ui divider"></div></h2>');
        $('.contents_body').append('<div class="ui three stackable cards column grid" id="masonry">');

        // Are there any results?
        if (results.length) {

          // Iterate over the results
          results.forEach(function(value) {
            var item = result[value.ref];

            // search_data.json require include.
            // item.title
            // item.date
            // item.url
            // item.thumbnail
            // item.date
            // item.tags
            // item.content_excerpt


            const content = document.querySelector('#card_template').content;

            const clone = document.importNode(content, true);

            a_node = $("<a href='" + item.url + "'>" + item.title + "</a>");
            const anchor = clone.querySelector('div.header > a');
            anchor.href = item.url
            anchor.textContent = item.title

            const image = clone.querySelector('div.image > img');
            image.src = item.thumbnail;

            const meta = clone.querySelector('div.meta > span');
            meta.textContent = item.date

            const description = clone.querySelector('div.description');
            const description_html_special_character_decoded = htmlscd(item.content_excerpt)
            description.insertAdjacentHTML('afterbegin', description_html_special_character_decoded);

            tags_hash = item.tags.split(',');
            const tags = clone.querySelector('div.extra');
            for (index in tags_hash) {
                tag_anchor = "<a class='ui tag label mini' href='/tags/" + tags_hash[index] + "'>" + tags_hash[index] + "</a>";
                tags.insertAdjacentHTML('afterbegin', tag_anchor);
            };

            document.querySelector('.cards').appendChild(clone);
          });
        } else {
          // If there are no results, let the user know.
        }
    };
});
