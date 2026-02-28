export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const token = process.env.VITE_GITHUB_TOKEN || process.env.GITHUB_TOKEN || process.env.VERCEL_WEBSITE_WEBHOOK;

    if (!token) {
        console.error("GitHub token missing (checked VITE_GITHUB_TOKEN, GITHUB_TOKEN, VERCEL_WEBSITE_WEBHOOK)");
        return res.status(500).json({ message: 'Server configuration error: Token missing' });
    }

    try {
        const payload = req.body;

        const response = await fetch('https://api.github.com/repos/Inovisionn/inovsionn-website-onepage/dispatches', {
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

        return res.status(200).json({ message: 'Success' });
    } catch (error) {
        console.error("Error in serverless function:", error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
