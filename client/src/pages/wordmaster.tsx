import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Download, Plus, Trash2 } from "lucide-react";
import { useEffect } from "react";

interface WordmasterData {
  word: string;
  meaning: string;
  example: string;
}

interface WordUsageRow {
  id: string;
  name: string;
  sentence: string;
}

const script = `
As the Wordmaster, I introduce a new word for the meeting participants to use in their speeches and conversations. This helps expand vocabulary and encourages creative word usage. At the end of the meeting, I will provide a report.
`

const Wordmaster = () => {
  const [data, setData] = useLocalStorage<WordmasterData>('wordmasterData', {
    word: '',
    meaning: '',
    example: ''
  });
  const [usageData, setUsageData] = useLocalStorage<WordUsageRow[]>('wordmasterUsageData', []);

  const updateField = (field: keyof WordmasterData, value: string) => {
    setData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addRow = () => {
    const newRow: WordUsageRow = {
      id: Date.now().toString(),
      name: `Speaker ${usageData.length + 1}`,
      sentence: '',
    };
    setUsageData([...usageData, newRow]);
  };

  const deleteRow = (id: string) => {
    setUsageData(usageData.filter(row => row.id !== id));
  };

  const updateName = (id: string, name: string) => {
    setUsageData(usageData.map(row => 
      row.id === id ? { ...row, name } : row
    ));
  };

  const updateSentence = (id: string, sentence: string) => {
    setUsageData(usageData.map(row => 
      row.id === id ? { ...row, sentence } : row
    ));
  };

  const downloadCSV = () => {
    // Create CSV header
    const headers = ['Name', 'Sentence with Word'];
    
    // Create CSV rows
    const rows = usageData.map(row => [
      row.name,
      `"${row.sentence.replace(/"/g, '""')}"` // Escape quotes in sentences
    ]);
    
    // Add word info at the top
    const wordInfo = [
      ['Word of the Day', data.word],
      ['Meaning', `"${data.meaning.replace(/"/g, '""')}"`],
      ['Example', `"${data.example.replace(/"/g, '""')}"`],
      [], // Empty row
    ];
    
    // Combine all parts
    const csvContent = [
      ...wordInfo.map(row => row.join(',')),
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `wordmaster-report-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Initialize with one row if empty
  useEffect(() => {
    if (usageData.length === 0) {
      addRow();
    }
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="wordmaster-page">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-card-foreground font-serif">
            Wordmaster Role
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
            Word Setup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="wordOfDay" className="text-sm font-medium text-card-foreground mb-2">
              Word of the Day
            </Label>
            <Input
              id="wordOfDay"
              value={data.word}
              onChange={(e) => updateField('word', e.target.value)}
              placeholder="Enter word..."
              data-testid="input-word"
            />
          </div>
          <div>
            <Label htmlFor="wordMeaning" className="text-sm font-medium text-card-foreground mb-2">
              Meaning
            </Label>
            <Textarea
              id="wordMeaning"
              value={data.meaning}
              onChange={(e) => updateField('meaning', e.target.value)}
              rows={3}
              placeholder="Define the word..."
              data-testid="textarea-meaning"
            />
          </div>
          <div>
            <Label htmlFor="wordExample" className="text-sm font-medium text-card-foreground mb-2">
              Example Sentence
            </Label>
            <Textarea
              id="wordExample"
              value={data.example}
              onChange={(e) => updateField('example', e.target.value)}
              rows={3}
              placeholder="Use the word in a sentence..."
              data-testid="textarea-example"
            />
          </div>
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
            <table className="w-full border-collapse" data-testid="table-wordmaster">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border px-3 py-2 text-left text-sm font-semibold w-48">Name</th>
                  <th className="border border-border px-3 py-2 text-left text-sm font-semibold">Sentence with Word</th>
                  <th className="border border-border px-3 py-2 text-center text-sm font-semibold w-24">Actions</th>
                </tr>
              </thead>
              <tbody>
                {usageData.map((row) => (
                  <tr key={row.id} data-testid={`row-speaker-${row.id}`}>
                    <td className="border border-border px-3 py-2">
                      <Input
                        value={row.name}
                        onChange={(e) => updateName(row.id, e.target.value)}
                        className="w-full bg-transparent border-none focus:ring-2 focus:ring-ring"
                        data-testid={`input-name-${row.id}`}
                      />
                    </td>
                    <td className="border border-border px-3 py-2">
                      <Textarea
                        value={row.sentence}
                        onChange={(e) => updateSentence(row.id, e.target.value)}
                        className="w-full bg-transparent border-none focus:ring-2 focus:ring-ring min-h-[60px]"
                        placeholder="Enter the sentence where they used the word..."
                        data-testid={`textarea-sentence-${row.id}`}
                      />
                    </td>
                    <td className="border border-border px-3 py-2 text-center">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => deleteRow(row.id)}
                        className="text-destructive hover:text-destructive/80"
                        data-testid={`button-delete-${row.id}`}
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
              onClick={addRow} 
              data-testid="button-add-speaker"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Speaker
            </Button>
            <Button 
              onClick={downloadCSV}
              variant="outline"
              disabled={usageData.length === 0}
              data-testid="button-download-csv"
            >
              <Download className="mr-2 h-4 w-4" />
              Download CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-card-foreground">
            Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3" data-testid="summary-report">
            {usageData.length > 0 && usageData.some(row => row.sentence.trim()) ? (
              <>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="font-semibold">Word of the Day: {data.word || 'Not set'}</p>
                  <p className="text-sm text-muted-foreground">
                    Total speakers who used the word: {usageData.filter(row => row.sentence.trim()).length}
                  </p>
                </div>
                {usageData
                  .filter(row => row.sentence.trim())
                  .map((row, index) => (
                    <div key={index} className="p-3 bg-muted/30 rounded-lg">
                      <p className="font-semibold">{row.name}</p>
                      <p className="text-sm text-muted-foreground italic mt-1">
                        "{row.sentence}"
                      </p>
                    </div>
                  ))}
              </>
            ) : (
              <p className="text-muted-foreground">
                Summary will appear here after tracking word usage...
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Wordmaster;
