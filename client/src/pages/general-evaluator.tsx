import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLocalStorage } from "@/hooks/use-local-storage";

interface GeneralEvaluatorData {
  checkboxes: {
    startTime: boolean;
    greeting: boolean;
    preparation: boolean;
    timing: boolean;
    flow: boolean;
    energy: boolean;
  };
  textareas: {
    toastmaster: string;
    speeches: string;
    tableTopics: string;
    general: string;
  };
}

const script = `
As the General Evaluator, I evaluate the entire meeting, including the Toastmaster, Speech Evaluations, Table Topics Master, and General Comments. I will note both successful elements and areas for improvement. At the end of the meeting, I will provide a report.
`

const GeneralEvaluator = () => {
  const [data, setData] = useLocalStorage<GeneralEvaluatorData>('generalEvaluatorData', {
    checkboxes: {
      startTime: false,
      greeting: false,
      preparation: false,
      timing: false,
      flow: false,
      energy: false
    },
    textareas: {
      toastmaster: '',
      speeches: '',
      tableTopics: '',
      general: ''
    }
  });

  const updateCheckbox = (field: keyof GeneralEvaluatorData['checkboxes'], value: boolean) => {
    setData(prev => ({
      ...prev,
      checkboxes: {
        ...prev.checkboxes,
        [field]: value
      }
    }));
  };

  const updateTextarea = (field: keyof GeneralEvaluatorData['textareas'], value: string) => {
    setData(prev => ({
      ...prev,
      textareas: {
        ...prev.textareas,
        [field]: value
      }
    }));
  };

  const checkboxItems = [
    { key: 'startTime' as const, label: 'Meeting started on time' },
    { key: 'greeting' as const, label: 'Guests greeted properly' },
    { key: 'preparation' as const, label: 'Meeting well-prepared' },
    { key: 'timing' as const, label: 'Good time management' },
    { key: 'flow' as const, label: 'Smooth meeting flow' },
    { key: 'energy' as const, label: 'High energy level' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="general-evaluator-page">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-foreground font-serif">
            General Evaluator Role
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
          <CardTitle className="text-xl font-semibold text-foreground">
            Meeting Elements Checklist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-testid="checklist-container">
            {checkboxItems.map((item) => (
              <div key={item.key} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50">
                <Checkbox
                  id={`chk_${item.key}`}
                  checked={data.checkboxes[item.key]}
                  onCheckedChange={(checked) => updateCheckbox(item.key, checked as boolean)}
                  data-testid={`checkbox-${item.key}`}
                />
                <Label 
                  htmlFor={`chk_${item.key}`} 
                  className="text-foreground cursor-pointer"
                >
                  {item.label}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">
              Toastmaster's Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={data.textareas.toastmaster}
              onChange={(e) => updateTextarea('toastmaster', e.target.value)}
              rows={4}
              placeholder="Evaluate the Toastmaster's performance..."
              data-testid="textarea-toastmaster"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">
              Speech Evaluations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={data.textareas.speeches}
              onChange={(e) => updateTextarea('speeches', e.target.value)}
              rows={4}
              placeholder="Comment on the speech evaluations..."
              data-testid="textarea-speeches"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">
              Table Topics Master Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={data.textareas.tableTopics}
              onChange={(e) => updateTextarea('tableTopics', e.target.value)}
              rows={4}
              placeholder="Evaluate the Table Topics Master..."
              data-testid="textarea-table-topics"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">
              General Comments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={data.textareas.general}
              onChange={(e) => updateTextarea('general', e.target.value)}
              rows={4}
              placeholder="Overall meeting observations..."
              data-testid="textarea-general"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GeneralEvaluator;
