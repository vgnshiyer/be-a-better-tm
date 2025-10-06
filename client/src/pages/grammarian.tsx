import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Download, Plus, Trash2 } from "lucide-react";
import { useEffect } from "react";

interface UsageRow {
  id: string;
  name: string;
  correct: string;
  incorrect: string;
}

interface PhraseRow {
  id: string;
  speaker: string;
  phrase: string;
}

interface GrammarianData {
  usageRows: UsageRow[];
  phraseRows: PhraseRow[];
}

const script = `
As the Grammarian, I track both excellent and problematic language usage. Note creative phrases, proper grammar, and areas for improvement. At the end of the meeting, I will provide a report.
`

const Grammarian = () => {
  const [data, setData] = useLocalStorage<GrammarianData>('grammarianData', {
    usageRows: [],
    phraseRows: []
  });

  const addUsageRow = () => {
    const newRow: UsageRow = {
      id: Date.now().toString(),
      name: `Speaker ${data.usageRows.length + 1}`,
      correct: '',
      incorrect: ''
    };
    setData(prev => ({
      ...prev,
      usageRows: [...prev.usageRows, newRow]
    }));
  };

  const addPhraseRow = () => {
    const newRow: PhraseRow = {
      id: Date.now().toString(),
      speaker: `Speaker ${data.phraseRows.length + 1}`,
      phrase: ''
    };
    setData(prev => ({
      ...prev,
      phraseRows: [...prev.phraseRows, newRow]
    }));
  };

  const deleteUsageRow = (id: string) => {
    setData(prev => ({
      ...prev,
      usageRows: prev.usageRows.filter(row => row.id !== id)
    }));
  };

  const deletePhraseRow = (id: string) => {
    setData(prev => ({
      ...prev,
      phraseRows: prev.phraseRows.filter(row => row.id !== id)
    }));
  };

  const updateUsageRow = (id: string, field: keyof Omit<UsageRow, 'id'>, value: string) => {
    setData(prev => ({
      ...prev,
      usageRows: prev.usageRows.map(row =>
        row.id === id ? { ...row, [field]: value } : row
      )
    }));
  };

  const updatePhraseRow = (id: string, field: keyof Omit<PhraseRow, 'id'>, value: string) => {
    setData(prev => ({
      ...prev,
      phraseRows: prev.phraseRows.map(row =>
        row.id === id ? { ...row, [field]: value } : row
      )
    }));
  };

  const downloadCSV = () => {
    // Create CSV content
    const csvParts = [];
    
    // Usage Tracking section
    csvParts.push('USAGE TRACKING');
    csvParts.push('Member Name,Correct Use,Incorrect Use');
    data.usageRows.forEach(row => {
      csvParts.push(`"${row.name}","${row.correct.replace(/"/g, '""')}","${row.incorrect.replace(/"/g, '""')}"`);
    });
    
    // Empty line
    csvParts.push('');
    
    // Great Phrases section
    csvParts.push('GREAT PHRASES / WORDS');
    csvParts.push('Speaker,Phrase / Word');
    data.phraseRows.forEach(row => {
      csvParts.push(`"${row.speaker}","${row.phrase.replace(/"/g, '""')}"`);
    });
    
    const csvContent = csvParts.join('\n');
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `grammarian-report-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Initialize with one row each if empty
  useEffect(() => {
    if (data.usageRows.length === 0) {
      addUsageRow();
    }
    if (data.phraseRows.length === 0) {
      addPhraseRow();
    }
  }, [data.usageRows.length, data.phraseRows.length]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="grammarian-page">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-card-foreground font-serif">
            Grammarian Role
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {script}
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-card-foreground">
            Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="table-responsive overflow-x-auto">
            <table className="w-full border-collapse" data-testid="table-usage-tracking">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border px-3 py-2 text-left text-sm font-semibold">Name</th>
                  <th className="border border-border px-3 py-2 text-left text-sm font-semibold">Correct Use</th>
                  <th className="border border-border px-3 py-2 text-left text-sm font-semibold">Incorrect Use</th>
                  <th className="border border-border px-3 py-2 text-center text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.usageRows.map((row) => (
                  <tr key={row.id} data-testid={`row-usage-${row.id}`}>
                    <td className="border border-border px-3 py-2">
                      <Input
                        value={row.name}
                        onChange={(e) => updateUsageRow(row.id, 'name', e.target.value)}
                        className="w-full bg-transparent border-none focus:ring-2 focus:ring-ring"
                        data-testid={`input-member-${row.id}`}
                      />
                    </td>
                    <td className="border border-border px-3 py-2">
                      <Input
                        value={row.correct}
                        onChange={(e) => updateUsageRow(row.id, 'correct', e.target.value)}
                        placeholder="Correct use here..."
                        className="w-full bg-transparent border-none focus:ring-2 focus:ring-ring"
                        data-testid={`input-correct-${row.id}`}
                      />
                    </td>
                    <td className="border border-border px-3 py-2">
                      <Input
                        value={row.incorrect}
                        onChange={(e) => updateUsageRow(row.id, 'incorrect', e.target.value)}
                        placeholder="Incorrect use here..."
                        className="w-full bg-transparent border-none focus:ring-2 focus:ring-ring"
                        data-testid={`input-incorrect-${row.id}`}
                      />
                    </td>
                    <td className="border border-border px-3 py-2 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteUsageRow(row.id)}
                        className="text-destructive hover:text-destructive/80"
                        data-testid={`button-delete-usage-${row.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex gap-3 mt-4">
            <Button 
              onClick={addUsageRow}
              data-testid="button-add-usage-row"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Member
            </Button>
            <Button 
              onClick={downloadCSV}
              variant="outline"
              disabled={data.usageRows.length === 0 && data.phraseRows.length === 0}
              data-testid="button-download-csv"
            >
              <Download className="mr-2 h-4 w-4" />
              Download CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-card-foreground">
            Great Phrases / Words
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="table-responsive overflow-x-auto">
            <table className="w-full border-collapse" data-testid="table-great-phrases">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border px-3 py-2 text-left text-sm font-semibold">Speaker</th>
                  <th className="border border-border px-3 py-2 text-left text-sm font-semibold">Phrase / Word</th>
                  <th className="border border-border px-3 py-2 text-center text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.phraseRows.map((row) => (
                  <tr key={row.id} data-testid={`row-phrase-${row.id}`}>
                    <td className="border border-border px-3 py-2">
                      <Input
                        value={row.speaker}
                        onChange={(e) => updatePhraseRow(row.id, 'speaker', e.target.value)}
                        className="w-full bg-transparent border-none focus:ring-2 focus:ring-ring"
                        data-testid={`input-speaker-${row.id}`}
                      />
                    </td>
                    <td className="border border-border px-3 py-2">
                      <Input
                        value={row.phrase}
                        onChange={(e) => updatePhraseRow(row.id, 'phrase', e.target.value)}
                        placeholder="Notable phrase or word..."
                        className="w-full bg-transparent border-none focus:ring-2 focus:ring-ring"
                        data-testid={`input-phrase-${row.id}`}
                      />
                    </td>
                    <td className="border border-border px-3 py-2 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deletePhraseRow(row.id)}
                        className="text-destructive hover:text-destructive/80"
                        data-testid={`button-delete-phrase-${row.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Button 
            onClick={addPhraseRow} 
            className="mt-4"
            data-testid="button-add-phrase-row"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Phrase
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-card-foreground">
            Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4" data-testid="summary-report">
            {/* Usage Tracking Summary */}
            {data.usageRows.some(row => row.correct.trim() || row.incorrect.trim()) && (
              <div>
                <h3 className="font-semibold text-lg mb-3">Grammar Usage</h3>
                <div className="space-y-3">
                  {data.usageRows
                    .filter(row => row.correct.trim() || row.incorrect.trim())
                    .map((row, index) => (
                      <div key={index} className="p-3 bg-muted/30 rounded-lg">
                        <p className="font-semibold mb-2">{row.name}</p>
                        {row.correct.trim() && (
                          <div className="mb-1">
                            <span className="text-green-600 dark:text-green-400 font-medium">✓ Correct: </span>
                            <span className="text-sm text-muted-foreground">{row.correct}</span>
                          </div>
                        )}
                        {row.incorrect.trim() && (
                          <div>
                            <span className="text-red-600 dark:text-red-400 font-medium">✗ Incorrect: </span>
                            <span className="text-sm text-muted-foreground">{row.incorrect}</span>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Great Phrases Summary */}
            {data.phraseRows.some(row => row.phrase.trim()) && (
              <div>
                <h3 className="font-semibold text-lg mb-3">Notable Language</h3>
                <div className="space-y-3">
                  {data.phraseRows
                    .filter(row => row.phrase.trim())
                    .map((row, index) => (
                      <div key={index} className="p-3 bg-muted/30 rounded-lg">
                        <p className="font-semibold">{row.speaker}</p>
                        <p className="text-sm text-muted-foreground italic mt-1">
                          "{row.phrase}"
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Empty state */}
            {!data.usageRows.some(row => row.correct.trim() || row.incorrect.trim()) && 
             !data.phraseRows.some(row => row.phrase.trim()) && (
              <p className="text-muted-foreground">
                Summary will appear here after tracking grammar usage and notable phrases...
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Grammarian;
