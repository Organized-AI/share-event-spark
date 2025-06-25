
import { useEffect, useState } from "react";
import { getLumaEvent } from "@/services/lumaService";
import GeminiGenerator from "@/components/GeminiGenerator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const GeminiPage = () => {
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const eventId = "evt-YBvVtbXQBmZA7sw";

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const eventData = await getLumaEvent(eventId);
        console.log("Fetched Luma Event Data:", eventData);
        setEvent(eventData);
        setError(null);
      } catch (err) {
        setError("Failed to fetch Luma event data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gemini Content Generator</h1>
      {loading && <p>Loading event data...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {event && (
        <Card>
          <CardHeader>
            <CardTitle>Luma Event Details</CardTitle>
          </CardHeader>
          <CardContent>
            <pre>{JSON.stringify(event, null, 2)}</pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GeminiPage;
