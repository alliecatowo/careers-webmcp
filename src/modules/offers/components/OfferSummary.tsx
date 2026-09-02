'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function OfferSummary() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Offer Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">This is a placeholder for the offer summary.</p>
      </CardContent>
    </Card>
  )
}
