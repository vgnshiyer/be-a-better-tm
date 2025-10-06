import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Plus, Trash2 } from "lucide-react";
import { useEffect } from "react";

interface UsageRow {
  id: string;
  member: string;
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

const Grammarian = () => {
  const [data, setData] = useLocalStorage<GrammarianData>('grammarianData', {
    usageRows: [],
    phraseRows: []
  });

  const addUsageRow = () => {
    const newRow: UsageRow = {
      id: Date.now().toString(),
      member: `Member ${data.usageRows.length + 1}`,
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

  // Initialize with one row each if empty
  useEffect(() => {
    if (data.usageRows.length === 0) {
      addUsageRow();
    }
    if (data.phraseRows.length === 0) {
      addPhraseRow();
    }
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="grammarian-page">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-foreground font-serif">
            Grammarian Role
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            As the Grammarian, you track both excellent and problematic language usage. Note creative phrases, proper grammar, and areas for improvement.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-foreground">
            Usage Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="table-responsive overflow-x-auto">
            <table className="w-full border-collapse" data-testid="table-usage-tracking">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border px-3 py-2 text-left text-sm font-semibold">Member Name</th>
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
                        value={row.member}
                        onChange={(e) => updateUsageRow(row.id, 'member', e.target.value)}
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
          <Button 
            onClick={addUsageRow} 
            className="mt-4"
            data-testid="button-add-usage-row"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Member
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-foreground">
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
    </div>
  );
};

export default Grammarian;
