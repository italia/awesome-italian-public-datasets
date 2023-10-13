const markdownLinkCheck = require('markdown-link-check');
const fetch = require('node-fetch');


markdownLinkCheck({
    files: ['./README.md'],
    // Alcune opzioni, come eventuali URL da ignorare, possono essere specificate qui
}, function (err, results) {
    if (err) {
        console.error('Error:', err);
        process.exit(1);
    }
    results.forEach(result => {
        if (result.status !== 'alive') {
            console.error(`Broken link found: ${result.link}`);

            // Apri un'issue con il link rotto
            const issueTitle = `Link rotto: ${result.link}`;
            const issueBody = `Il seguente link è rotto: ${result.link}\n\nPer favore, correggi il link.`;

            fetch('https://api.github.com/repos/:owner/:repo/issues', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`
                },
                body: JSON.stringify({
                    title: issueTitle,
                    body: issueBody
                })
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Issue creata con successo:', data.html_url);
                })
                .catch(error => {
                    console.error('Errore durante la creazione dell\'issue:', error);
                });
        }
    });
});
