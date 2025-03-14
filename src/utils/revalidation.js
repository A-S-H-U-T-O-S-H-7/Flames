export async function revalidatePath(path) {
  try {
    const response = await fetch("/api/revalidate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_REVALIDATION_SECRET}`, // Use public env variable for frontend
      },
      body: JSON.stringify({ path }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("❌ Revalidation failed:", error);
      return false;
    }

    console.log(`✅ Successfully revalidated: ${path}`);
    return true;
  } catch (error) {
    console.error("❌ Error triggering revalidation:", error);
    return false;
  }
}
