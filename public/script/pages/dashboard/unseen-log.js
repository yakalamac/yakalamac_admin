document.addEventListener('DOMContentLoaded', function() {
    const changelogModalElement = document.getElementById('changelogModal');
    const changelogModal = new bootstrap.Modal(changelogModalElement);
    changelogModal.show();

    changelogModalElement.addEventListener('hidden.bs.modal', function () {
        var seenChangelogIds = window.Twig.unseenChangeLogs;
        console.log(seenChangelogIds)
        var seenChangelogs = getCookie('seen_changelogs');
        var seenIds = seenChangelogs ? seenChangelogs.split(',') : [];

        seenIds = seenIds.concat(seenChangelogIds);
        seenIds = Array.from(new Set(seenIds));

        setCookie('seen_changelogs', seenIds.join(','), 30);
    });

    function setCookie(name, value, days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days*24*60*60*1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "")  + expires + "; path=/";
    }

    function getCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }
});