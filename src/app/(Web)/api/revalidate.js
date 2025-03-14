export default async function handler(req, res) {
    // Step 1: Check for the secret token in the request header
    if (req.headers.authorization !== `Bearer ${process.env.REVALIDATION_SECRET}`) {
      return res.status(401).json({ message: "Invalid token" });
    }
  
    try {
      const { path } = req.body; // Get the path from the request body
  
      if (!path) {
        return res.status(400).json({ message: "Path is required" });
      }
  
      // Step 2: Revalidate the specified path
      await res.revalidate(path);
      console.log(`✅ Revalidated path: ${path}`);
  
      return res.json({ revalidated: true, path });
    } catch (err) {
      console.error("❌ Revalidation error:", err);
      return res.status(500).json({ message: "Error revalidating" });
    }
  }
  