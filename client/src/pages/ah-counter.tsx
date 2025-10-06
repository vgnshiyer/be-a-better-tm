import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";

interface AhCounterRow {
  id: string;
  name: string;
  ah: number;
  um: number;
  er: number;
  well: number;
  so: number;
  like: number;
  but: number;
  repeats: number;
  falseStarts: number;
  other: number;
}

const AhCounter = () => {
  const [data, setData] = useLocalStorage<AhCounterRow[]>('ahCounterData', []);

  const addRow = () => {
    const newRow: AhCounterRow = {
      id: Date.now().toString(),
      name: `Speaker ${data.length + 1}`,
      ah: 0,
      um: 0,
      er: 0,
      well: 0,
      so: 0,
      like: 0,
      but: 0,
      repeats: 0,
      falseStarts: 0,
      other: 0,
    };
    setData([...data, newRow]);
  };

  const deleteRow = (id: string) => {
    setData(data.filter(row => row.id !== id));
  };

  const updateName = (id: string, name: string) => {
    setData(data.map(row => 
      row.id === id ? { ...row, name } : row
    ));
  };

  const incrementCell = (id: string, field: keyof AhCounterRow) => {
    setData(data.map(row => 
      row.id === id 
        ? { ...row, [field]: (row[field] as number) + 1 }
        : row
    ));
  };

  const getTotal = (row: AhCounterRow) => {
    return row.ah + row.um + row.er + row.well + row.so + 
           row.like + row.but + row.repeats + row.falseStarts + row.other;
  };

  const generateSummary = () => {
    if (data.length === 0) return [];
    
    return data.map(row => ({
      name: row.name,
      total: getTotal(row),
      mostCommon: Object.entries(row)
        .filter(([key]) => !['id', 'name'].includes(key))
        .reduce((a, b) => a[1] > b[1] ? a : b)[0]
    }));
  };

  // Initialize with one row if empty
  useEffect(() => {
    if (data.length === 0) {
      addRow();
    }
  }, []);

  const columns = [
    { key: 'ah' as const, label: 'Ah' },
    { key: 'um' as const, label: 'Um' },
    { key: 'er' as const, label: 'Er' },
    { key: 'well' as const, label: 'Well' },
    { key: 'so' as const, label: 'So' },
    { key: 'like' as const, label: 'Like' },
    { key: 'but' as const, label: 'But' },
    { key: 'repeats' as const, label: 'Repeats' },
    { key: 'falseStarts' as const, label: 'False Starts' },
    { key: 'other' as const, label: 'Other' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="ah-counter-page">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-foreground font-serif">
            Ah-Counter Role
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            As the Ah-Counter, your role is to note words and sounds used as a crutch or pause filler by anyone who speaks during the meeting. Examples include: ah, um, er, well, so, you know, like, but, and repeating words or phrases.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-foreground">
            Tracking Table
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="table-responsive overflow-x-auto">
            <table className="w-full border-collapse" data-testid="table-ah-counter">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border px-3 py-2 text-left text-sm font-semibold">Name</th>
                  {columns.map(col => (
                    <th key={col.key} className="border border-border px-3 py-2 text-center text-sm font-semibold">
                      {col.label}
                    </th>
                  ))}
                  <th className="border border-border px-3 py-2 text-center text-sm font-semibold">Total</th>
                  <th className="border border-border px-3 py-2 text-center text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr key={row.id} data-testid={`row-speaker-${row.id}`}>
                    <td className="border border-border px-3 py-2">
                      <Input
                        value={row.name}
                        onChange={(e) => updateName(row.id, e.target.value)}
                        className="w-full bg-transparent border-none focus:ring-2 focus:ring-ring"
                        data-testid={`input-name-${row.id}`}
                      />
                    </td>
                    {columns.map(col => (
                      <td 
                        key={col.key} 
                        className="border border-border px-3 py-2 text-center editable-cell cursor-pointer hover:bg-muted/50"
                        onClick={() => incrementCell(row.id, col.key)}
                        data-testid={`cell-${col.key}-${row.id}`}
                      >
                        {row[col.key]}
                      </td>
                    ))}
                    <td className="border border-border px-3 py-2 text-center font-semibold" data-testid={`text-total-${row.id}`}>
                      {getTotal(row)}
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

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-foreground">
            Summary Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3" data-testid="summary-report">
            {generateSummary().length > 0 ? (
              generateSummary().map((summary, index) => (
                <div key={index} className="p-3 bg-muted/30 rounded-lg">
                  <p className="font-semibold">{summary.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Total filler words: {summary.total} | Most common: {summary.mostCommon}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">
                Summary will appear here after tracking speakers...
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AhCounter;
