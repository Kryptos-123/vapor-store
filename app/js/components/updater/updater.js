if (!isDev) {
    $.get('https://api.github.com/repos/SushyDev/vapor-store/releases', function (data) {
        var release = data[0];

        var fileName;
        var downloadUrl;
        release.assets.forEach((asset) => {
            if (asset.name.endsWith('exe')) {
                downloadUrl = asset.browser_download_url;
                fileName = asset.name;
            }
        });

        var name = fileName.slice(0, -4);
        var latest = release.tag_name.slice(1);
        var current = app.getVersion();

        var snackbarData = {
            ['main']: [
                {
                    name: `${name}`,
                },
            ],
            ['progress']: [
                {
                    enabled: false,
                    id: `${name}-completed-progress`,
                },
            ],
            ['label']: [
                {
                    id: `${name}-snackbar-title`,
                    innerHTML: `Version ${latest} is available`,
                },
            ],
            ['actions']: [
                {
                    type: 'button',
                    innerHTML: 'Download',
                    labelid: `${name}-download-button__label`,
                    class: 'download-button',
                    id: 'download-button',
                    onclick: `downloadUpdate('${name}', '${downloadUrl}')`,
                },
            ],
            ['close']: [
                {
                    enabled: true,
                    onclick: `closeSnackbar('${name}', false)`,
                    title: 'Dismiss',
                    icon: 'close',
                    id: `${name}-close`,
                },
            ],
        };

        if (current.includes('beta') && latest.includes('beta')) {
            var currentBN = current.split('-beta-').pop();
            var latestBN = latest.split('-beta-').pop();

            var currentVN = current.split('-beta-')[0];
            var latestVN = latest.split('-beta-')[0];

            if (latestVN > currentVN) {
                updateAvailable(true);
            } else if (parseInt(latestBN) > parseInt(currentBN)) {
                updateAvailable(true);
            }
        } else if (current.includes('beta')) {
            var currentVN = current.split('-beta-')[0];
            if (latest == currentVN) {
                updateAvailable();
            } else if (latest > currentVN) {
                updateAvailable();
            }
        } else if (latest.includes('beta')) {
            var latestVN = latest.split('-beta-')[0];
            if (latestVN > current) updateAvailable(true);
        } else {
            if (latest > current) updateAvailable();
        }

        function updateAvailable(beta) {
            if (localStorage.getItem('beta') == 'false' && beta == true) return;

            //Create the snackbar
            createSnack(snackbarData);
        }
    });

    function downloadUpdate(name, downloadUrl) {
        closeSnackbar(name, false);
        startDownload(downloadUrl, localStorage.getItem('downloadDir'), 'vapor-store-update');
    }

    //On download complete
    function installUpdate(fileName) {
        //Run exe
        (async () => {
            await setTimeout(async () => {
                await exec(`start "" "${path.join(localStorage.getItem('downloadDir'), fileName)}`);
            }, 250);
        })();
    }
}
