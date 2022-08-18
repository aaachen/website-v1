// If mouse on the footer, reveal footnote div
// If mouse in the footnote, keep the footnote div open
// If mouse leaves the footnote div, remove
// class=footnote-ref, href="#fn:2" role="doc-noteref"
// id="fn:1"

let footnoteTimeoutId = 1;

function footnoteover() {
    clearTimeout(footnoteTimeoutId);
    // remove footnote div
    $('#footnotediv').stop();
    $('#footnotediv').remove();
    let footnoteRefId = $(this).attr("href").substr(1);
    let offset = $(this).offset();
    let footnoteDiv = $(document.createElement('div'));
    footnoteDiv.attr('id', 'footnotediv');
    footnoteDiv.on('mouseover', divover);
    footnoteDiv.on('mouseout', footnoteout)

    let footnoteDom = document.getElementById(footnoteRefId)
    footnoteDiv.html(
      "<div class='footnote-wrap'>" +
        $(footnoteDom).html() +
        "</div>"
    );
    footnoteDiv.find(".footnote-backref").first().remove();
    $("#main").append(footnoteDiv);
    var left, top;
    (left = offset.left) + 375 > $(window).width() + $(window).scrollLeft() &&
      (left = $(window).width() - 375 + $(window).scrollLeft());
    (top = offset.top + 20) + footnoteDiv.height() >
      $(window).height() + $(window).scrollTop() &&
      (r = offset.top - footnoteDiv.height() - 15);
    footnoteDiv.css({ left: left, top: top });
}

function divover() {
    clearTimeout(footnoteTimeoutId),
    $("#footnotediv").stop(),
    $("#footnotediv").css({ opacity: 1 })
}

function footnoteout() {
    return (footnoteTimeoutId = setTimeout(function () {
        return $("#footnotediv").animate({ opacity: 0 }, 150, function () {
            return $("#footnotediv").remove();
        });
    }, 100));
}

function attachFootnoteListener() {
    $(".footnote-ref").each((_, el) => {
        $(el).off();
        $(el).on('mouseover', footnoteover);
        $(el).on('mouseout', footnoteout);
    });
}

window.addEventListener("DOMContentLoaded", event => {
    attachFootnoteListener();
}, {once: true});
