import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Plus, Trash2 } from "lucide-react";
import { useEffect } from "react";

interface TableTopicRow {
  id: string;
  speaker: string;
  topic: string;
}

interface TableTopicsData {
  theme: string;
  rows: TableTopicRow[];
}

const TableTopics = () => {
  const [data, setData] = useLocalStorage<TableTopicsData>('tableTopicsData', {
    theme: '',
    rows: []
  });

  const updateTheme = (theme: string) => {
    setData(prev => ({
      ...prev,
      theme
    }));
  };

  const addRow = () => {
    const newRow: TableTopicRow = {
      id: Date.now().toString(),
      speaker: `Speaker ${data.rows.length + 1}`,
      topic: ''
    };
    setData(prev => ({
      ...prev,
      rows: [...prev.rows, newRow]
    }));
  };

  const deleteRow = (id: string) => {
    setData(prev => ({
      ...prev,
      rows: prev.rows.filter(row => row.id !== id)
    }));
  };

  const updateRow = (id: string, field: keyof Omit<TableTopicRow, 'id'>, value: string) => {
    setData(prev => ({
      ...prev,
      rows: prev.rows.map(row =>
        row.id === id ? { ...row, [field]: value } : row
      )
    }));
  };

  // Initialize with one row if empty
  useEffect(() => {
    if (data.rows.length === 0) {
      addRow();
    }
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="table-topics-page">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-foreground font-serif">
            Table Topics Master Role
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            As the Table Topics Master, you conduct impromptu speaking sessions by providing interesting topics for members to speak about without preparation.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-foreground">
            Meeting Theme
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            value={data.theme}
            onChange={(e) => updateTheme(e.target.value)}
            placeholder="Enter today's meeting theme..."
            className="w-full"
            data-testid="input-theme"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-foreground">
            Speaker & Topics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="table-responsive overflow-x-auto">
            <table className="w-full border-collapse" data-testid="table-speakers-topics">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border px-3 py-2 text-left text-sm font-semibold">Speaker Name</th>
                  <th className="border border-border px-3 py-2 text-left text-sm font-semibold">Answer</th>
                  <th className="border border-border px-3 py-2 text-center text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.rows.map((row) => (
                  <tr key={row.id} data-testid={`row-topic-${row.id}`}>
                    <td className="border border-border px-3 py-2">
                      <Input
                        value={row.speaker}
                        onChange={(e) => updateRow(row.id, 'speaker', e.target.value)}
                        className="w-full bg-transparent border-none focus:ring-2 focus:ring-ring"
                        data-testid={`input-speaker-${row.id}`}
                      />
                    </td>
                    <td className="border border-border px-3 py-2">
                      <Input
                        value={row.topic}
                        onChange={(e) => updateRow(row.id, 'topic', e.target.value)}
                        placeholder="Enter topic question..."
                        className="w-full bg-transparent border-none focus:ring-2 focus:ring-ring"
                        data-testid={`input-topic-${row.id}`}
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
          <Button 
            onClick={addRow} 
            className="mt-4"
            data-testid="button-add-speaker"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Speaker
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default TableTopics;
