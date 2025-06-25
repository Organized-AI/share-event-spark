import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const GeminiGenerator = ({ event }: { event: any }) => {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Generated Content</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Generated content will appear here.</p>
      </CardContent>
    </Card>
  );
};

export default GeminiGenerator;
