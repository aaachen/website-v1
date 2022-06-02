function positionPageToc(toc, anchorClass) {
    const marginRight = 40;
    const left = $(anchorClass).offset().left;
    const top = $(anchorClass).offset().top;
    $(toc).css({
        "left": `${left- marginRight}px`,
        "top": `${top}px`,
        "transform": "translateX(-100%)"
    });
}

// entry encoding: .category-toc-i-entry .${category}
// nav encoding: .category-toc-i .category_${category}

function updateActiveCategoryToc(e) {
    $('.category-toc-i.active').removeClass('active');
    $(e.target).addClass('active');
}

function showActiveCategoryToc(category) {
    $('.category-toc-i.active').removeClass('active');
    $(".category-toc-i.category_" + category).addClass('active');
}

function showActiveCategoryItems(category) {
    if (category == "all") {
        $(".category-toc-i-entry").css({
            "display": "block"
        });
    } else {
        $(".category-toc-i-entry").each((_, el) => {
            if (!el.className.split(" ").includes(category)) {
                $(el).css({
                    "display": "none"
                });
            } else {
                $(el).css({
                    "display": "block"
                });
            }
        });
    }
}

function getCurrentCategory() {
    const path = window.location.pathname.replace(/^\/(.*)\/$/, "$1").split("/");
    return path.length == 1 ? "all" : path.pop();
}

function getBaseCategory() {
    return window.location.pathname.replace(/^\/(.*)\/$/, "$1").split("/")[0];
}

function filterByCategory(e) {
    const classNames = e.target.className.split(" ");
    if (classNames.includes("active")) {
        return;
    }
    updateActiveCategoryToc(e);
    const cPrefix = "category_"
    let category = classNames.find(name => name.startsWith(cPrefix)).replace(cPrefix, "");
    showActiveCategoryItems(category);

    // push history
    const baseCategory = getBaseCategory();
    // assume category toc is only depth 1. If need nested encode path info to category
    let newPath = category == "all" ? `/${baseCategory}/` : `/${baseCategory}/${category}/`
    window.history.pushState({}, '', window.location.origin + newPath);
}

window.addEventListener("DOMContentLoaded", event => {
    if ($("#category-toc").length) {
        positionPageToc("#category-toc", ".main-inner");
        window.onresize = () => { positionPageToc("#category-toc", ".main-inner") };
        $('.category-toc-i').click(filterByCategory);
        let category = getCurrentCategory()
        showActiveCategoryItems(category);
    }
}, {once: true});

window.addEventListener('popstate', event => {
    if ($("#category-toc").length) {
        let category = getCurrentCategory()
        showActiveCategoryItems(category);
        showActiveCategoryToc(category);
    }
});

// ^^^ above should be refactored to simply redirect to sub-section. Use pagination and infinite scroll ^^^
// standardize as in other sections

// original code: https://github.com/yuhixyz/yuhixyz.github.io/blob/master/layouts/partials/pages/post.html
window.addEventListener("DOMContentLoaded", event => {
    if ($(".new-toc .toc").length) {
        positionPageToc(".sidebar", ".post-title");
        // set the toc height 
        const tocAutoScroll = () => {
            let height = window.innerHeight; 
            let $toc = $('.new-toc .toc');
            const tocHeight = $('.new-toc .toc').height();
            // tocHeight can expand, so re-calculate each time
            //if (tocHeight > height - 300) {
            $toc.css('height', height - 300);
            //}
        }
        const catalogTrack = () => {
            let $currentHeading = $('h1');
            for (let heading of $('h1, h2, h3, h4, h5, h6')) {
                const $heading = $(heading);
                // determine the correct current heading by the nearest heading closest to the
                // top of the scroll top
                if ($heading.offset().top - $(document).scrollTop() > 150) break;
                $currentHeading = $heading;
            }
            // meme adds id to each heading (I think when toc is turned on)
            // highlight the toc entry
            const anchorId = $currentHeading.attr('id');
            let $toc = $('.new-toc .toc');
            let $a = $toc.find(`a[href="#${anchorId}"]`) 
            // console.log($a[0]);
            if (!$a.hasClass('a-active')) {  
                $('.a-active').removeClass('a-active');  
                $a.addClass('a-active');  
            }
            // scrollTop is measurement of the element's topmost *visible* content (i.e. content in the overflow) to the element's top (starting at 0)
            // i.e. the distance to scroll the current element to the top

            $(".new-toc li").removeClass('has-active');
            
            // below updates the toc overflow position to the current entry in toc
            if ($a.length > 0) {
                let ancestor = $a[0].parentNode;
                while (ancestor.tagName !== 'NAV') {
                    $(ancestor).addClass('has-active');
                    ancestor = ancestor.parentNode.parentNode;
                }
                tocAutoScroll();

                $('.toc').scrollTop($a[0].offsetTop - 300);
            } else {
                $('.toc').scrollTop(0);
            }
        };
        // $(() => {}) == document.ready -> callback 
        // https://api.jquery.com/jQuery/#jQuery3
        $(() => {
            tocAutoScroll();
            catalogTrack();
        });
        $(document).scroll(() => {
            catalogTrack();
        });
        $(window).resize(() => {
            positionPageToc(".sidebar", ".post-title");
            setTimeout(() => {
               tocAutoScroll();
            }, 100);
        });
    }
}, {once: true});

