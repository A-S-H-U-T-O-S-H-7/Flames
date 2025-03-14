

export default async function handler(req, res) {
    // Check for secret token
    if (req.headers.authorization !== `Bearer ${process.env.REVALIDATION_SECRET}`) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  
    try {
      const { path } = req.body;
      
      if (!path) {
        return res.status(400).json({ message: 'Path is required' });
      }
      
      // Revalidate the specified path
      await res.revalidate(path);
      console.log(`Revalidated path: ${path}`);
      
      return res.json({ revalidated: true, path });
    } catch (err) {
      console.error('Revalidation error:', err);
      return res.status(500).json({ message: 'Error revalidating' });
    }
  }