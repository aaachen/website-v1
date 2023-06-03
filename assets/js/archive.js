// should use jquery for better DOM traversal
const archiveViewPrefix = "ar-v"
const viewName2Id = {
    date: 'ar-v1',
    tags: 'ar-v2',
    series: 'ar-v4'
}
const archiveSelectedKey = "selected";

function showArchiveView(id) {
    let view = document.getElementById(id);
    if (!view) {
        throw 'did not find archiveView with id: ' + id;
    }
    view.classList.add("archive-view-active");
    view.classList.remove("archive-view-inactive");
}

function hideArchiveViews() {
    Array.from(document.querySelectorAll('.archive-view-active')).forEach(el => {
        el.classList.remove("archive-view-active");
        el.classList.add("archive-view-inactive");
    });
}

// highlight it
function showArchiveToggle(id) {
    const archiveViewToggle = document.querySelectorAll('.archive-view-toggle.' + id).item(0);
    archiveViewToggle.classList.add("active");
}

function hideArchiveToggle() {
    Array.from(document.querySelectorAll('.archive-view-toggle')).forEach(el => {
        el.classList.remove("active");
    });
}

function switchArchiveView(e) {
    let target = e.target;
    let isActive = target.classList.contains("active");
    if (isActive) {
        return;
    }
    // remove all active toggle and add active to current
    Array.from(document.querySelectorAll('.archive-view-toggle')).forEach(el => {
        el.classList.remove("active");
    });
    target.classList.add("active");

    // show view with archiveViewId
    let archiveViewId = undefined;
    target.classList.forEach(c => {
        if (c.startsWith(archiveViewPrefix)) {
            archiveViewId = c;
        }
    });
    if (!archiveViewId) {
        throw 'did not find archiveViewId starting with prefix "ar-v"';
    }

    hideArchiveViews();
    showArchiveView(archiveViewId);
    
    // localStorage.setItem(archiveSelectedKey, target.innerHTML);
    let url = new URL(window.location);
    url.searchParams.set(archiveSelectedKey, target.innerHTML);
    window.history.pushState({}, '', url);
    // window.location = url;
}

// on page load everything is set to inactive 
// set the corresponding "archiveViewId" ui elements to active
function initializeArchiveView(archiveViewId) {
    showArchiveToggle(archiveViewId);
    showArchiveView(archiveViewId);
}

window.addEventListener("DOMContentLoaded", event => {
    
    if (window.location.pathname.startsWith("/archive")) {
        // On the archive page
        
        // let viewName = localStorage.getItem(archiveSelectedKey);
        let url = new URL(window.location);
        let viewName = url.searchParams.get(archiveSelectedKey);
        if (!viewName) {
            viewName = "date";
        }
        initializeArchiveView(viewName2Id[viewName]);

        const archiveViewToggles = Array.from(document.querySelectorAll('.archive-view-toggle'));
        archiveViewToggles.forEach((tog) => {
            tog.onclick = switchArchiveView;
        })
    }
}, {once: true});

window.addEventListener('popstate', event => {
    if (window.location.pathname.startsWith("/archive")) {
        // On the archive page
        
        // let viewName = localStorage.getItem(archiveSelectedKey);
        let url = new URL(window.location);
        let viewName = url.searchParams.get(archiveSelectedKey);
        if (!viewName) {
            viewName = "date";
        }
        hideArchiveViews();
        hideArchiveToggle();
        showArchiveView(viewName2Id[viewName]);
        showArchiveToggle(viewName2Id[viewName]);
    }
});
