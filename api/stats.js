export default async function handler(req, res) {
  // Allow your app to query this endpoint
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { targetUrl } = req.query;

  if (!targetUrl) {
    return res.status(400).json({ error: 'Missing targetUrl parameter' });
  }

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)',
        'Accept': 'application/json, text/xml, */*'
      }
    });

    const data = await response.text();
    res.status(200).send(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch host stats' });
  }
}
