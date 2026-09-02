'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, Send, CheckCircle, XCircle } from 'lucide-react';
import {
  indexUrl,
  indexMultipleUrls,
} from '@/lib/actions/google-indexing.actions';

interface IndexingResult {
  success: boolean;
  message?: string;
  error?: string;
  url?: string;
  type?: string;
}

export function GoogleIndexingTrigger() {
  const [url, setUrl] = useState('');
  const [type, setType] = useState<'URL_UPDATED' | 'URL_DELETED'>(
    'URL_UPDATED',
  );
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<IndexingResult | null>(null);
  const [bulkUrls, setBulkUrls] = useState('');
  const [bulkResults, setBulkResults] = useState<IndexingResult[]>([]);
  const [isBulkLoading, setIsBulkLoading] = useState(false);

  const handleSingleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.trim()) return;

    setIsLoading(true);
    setResult(null);

    try {
      const result = await indexUrl(url.trim(), type);
      setResult(result);
    } catch (error: any) {
      setResult({
        success: false,
        error: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const urls = bulkUrls
      .split('\n')
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    if (urls.length === 0) return;

    setIsBulkLoading(true);
    setBulkResults([]);

    try {
      // Use the server action for bulk indexing
      const results = await indexMultipleUrls(urls, type);
      setBulkResults(results);
    } catch (error: any) {
      // If bulk action fails, fall back to individual processing
      const results: IndexingResult[] = [];

      for (const url of urls) {
        try {
          const result = await indexUrl(url, type);
          results.push(result);
          setBulkResults([...results]); // Update UI progressively
        } catch (error: any) {
          results.push({
            success: false,
            error: error.message,
            url,
            type,
          });
          setBulkResults([...results]);
        }
      }
    } finally {
      setIsBulkLoading(false);
    }
  };

  const generateJobUrls = () => {
    // Generate sample job URLs based on your URL structure
    const sampleUrls = [
      'https://www.jobs.baalvion.com/careers/countries/india/jobs/job-1',
      'https://www.jobs.baalvion.com/careers/countries/united-states/jobs/job-2',
      'https://www.jobs.baalvion.com/careers/countries/poland/jobs/job-3',
      'https://www.jobs.baalvion.com/careers/countries/india/jobs/job-4',
      'https://www.jobs.baalvion.com/careers/countries/united-kingdom/jobs/job-5',
    ];

    setBulkUrls(sampleUrls.join('\n'));
  };

  return (
    <div className="space-y-6">
      {/* Single URL Indexing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Single URL Indexing
          </CardTitle>
          <CardDescription>
            Submit a single URL to Google Indexing API
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSingleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://www.jobs.baalvion.com/careers/countries/india/jobs/job-1"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Action Type</Label>
              <Select
                value={type}
                onValueChange={(value: 'URL_UPDATED' | 'URL_DELETED') =>
                  setType(value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="URL_UPDATED">
                    URL Updated (New/Modified)
                  </SelectItem>
                  <SelectItem value="URL_DELETED">URL Deleted</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" disabled={isLoading || !url.trim()}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit to Google
                </>
              )}
            </Button>
          </form>

          {result && (
            <div className="mt-4 p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                {result.success ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <Badge variant={result.success ? 'default' : 'destructive'}>
                  {result.success ? 'Success' : 'Error'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {result.message || result.error}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bulk URL Indexing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Bulk URL Indexing
          </CardTitle>
          <CardDescription>
            Submit multiple URLs at once (one per line)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleBulkSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="bulk-urls">URLs (one per line)</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={generateJobUrls}
                >
                  Generate Sample URLs
                </Button>
              </div>
              <Textarea
                id="bulk-urls"
                placeholder="https://www.jobs.baalvion.com/careers/countries/india/jobs/job-1&#10;https://www.jobs.baalvion.com/careers/countries/united-states/jobs/job-2"
                value={bulkUrls}
                onChange={(e) => setBulkUrls(e.target.value)}
                rows={6}
              />
            </div>

            <Button type="submit" disabled={isBulkLoading || !bulkUrls.trim()}>
              {isBulkLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit All URLs
                </>
              )}
            </Button>
          </form>

          {bulkResults.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="font-medium">Results:</h4>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {bulkResults.map((result, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 rounded border text-sm"
                  >
                    {result.success ? (
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-mono text-xs">{result.url}</p>
                      <p className="text-muted-foreground">
                        {result.message || result.error}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-4 text-sm text-muted-foreground">
                <span>
                  ✅ Success: {bulkResults.filter((r) => r.success).length}
                </span>
                <span>
                  ❌ Failed: {bulkResults.filter((r) => !r.success).length}
                </span>
                <span>📊 Total: {bulkResults.length}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
