export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const token = process.env.VITE_GITHUB_TOKEN || process.env.GITHUB_TOKEN || process.env.VERCEL_WEBSITE_WEBHOOK;

    if (!token) {
        console.error("GitHub token missing (checked VITE_GITHUB_TOKEN, GITHUB_TOKEN, VERCEL_WEBSITE_WEBHOOK)");
        return res.status(500).json({ message: 'Server configuration error: Token missing' });
    }

    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    const repo = 'Inovisionn/inovsionn-website-onepage';
    const filePath = 'agent/used_emails.txt';

    try {
        const payload = req.body;

        // 1. Fetch the current list of used emails
        const getFileResponse = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
            headers: { 'Authorization': `token ${token}` }
        }, { cache: 'no-store' });

        let usedEmails = "";
        let sha = null;

        if (getFileResponse.ok) {
            const fileData = await getFileResponse.json();
            sha = fileData.sha;
            usedEmails = Buffer.from(fileData.content, 'base64').toString('utf-8');
        }

        // 2. Check if email exists
        const emailList = usedEmails.toLowerCase().split('\n').map(e => e.trim());
        if (emailList.includes(email.toLowerCase().trim())) {
            return res.status(403).json({ message: 'LIMIT_REACHED' });
        }

        // 3. Trigger the Repository Dispatch
        const response = await fetch(`https://api.github.com/repos/${repo}/dispatches`, {
            method: 'POST',
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                event_type: 'scrape_leads',
                client_payload: payload
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`GitHub API error: ${response.status} - ${errorText}`);
            return res.status(response.status).json({ message: `GitHub API error: ${response.status}` });
        }

        // 4. Update the used_emails.txt file
        const newContent = usedEmails + (usedEmails.endsWith('\n') || usedEmails === "" ? "" : "\n") + email.toLowerCase().trim() + "\n";
        await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: `chore: add ${email} to used emails`,
                content: Buffer.from(newContent).toString('base64'),
                sha: sha
            })
        });

        return res.status(200).json({ message: 'Success' });
    } catch (error) {
        console.error("Error in serverless function:", error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
