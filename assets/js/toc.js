const findNearestAncestor = (headerFromBottomToTop) => {
    // scrollTop value increases by page scroll
    const currentScrollTop = $(document).scrollTop()
    return headerFromBottomToTop.find(header => currentScrollTop + 150 > $(header).offset().top)
}

window.addEventListener("DOMContentLoaded", event => {
    // sort in descending order (i.e. bottom of page to top)
    const articleHeaders = Object.values($('h1, h2, h3, h4, h5, h6'))
            // meme adds id to each header
            .filter(h => $(h).attr('id') && $(h).attr('id') != 'contents')
            .sort((a, b) => $(b).offset().top - $(a).offset().top)
    let $toc = $('.new-toc-wrapper .toc');
    let $sidebar = $('#sidebar');
    if ($toc.length) {
        const highlightCurrentTocEntry = () => {
            let $currentHeading = $(findNearestAncestor(articleHeaders))
            const anchorId = $currentHeading.attr('id');
            let $a = $toc.find(`a[href="#${anchorId}"]`) 
            if (!$a.hasClass('a-active')) {  
                $('.a-active').removeClass('a-active');  
                $a.addClass('a-active');
            }
        };
        const showSidebar = throttle(() => {
            window.scrollY > 100 ? $sidebar.addClass('show') : $sidebar.removeClass('show');
        }, delayTime)

        // $(() => {}) == document.ready -> callback 
        // https://api.jquery.com/jQuery/#jQuery3
        $(() => {
            highlightCurrentTocEntry();
        });
        $(document).scroll(() => {
            highlightCurrentTocEntry();
            showSidebar();
        });
    }
}, {once: true});
