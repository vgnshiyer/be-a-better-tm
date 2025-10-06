import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLocalStorage } from "@/hooks/use-local-storage";

interface SpeechEvaluatorData {
  speakerName: string;
  speechTitle: string;
  pathwayProject: string;
  wentWell: string;
  couldBeBetter: string;
  bestThing: string;
  checkboxes: {
    vocalVariety: boolean;
    bodyLanguage: boolean;
    pauses: boolean;
    audienceAwareness: boolean;
    callToAction: boolean;
    ruleOfThree: boolean;
    examplesAnalogies: boolean;
    contentStructure: boolean;
    dialog: boolean;
    firstLineLastLine: boolean;
  };
}

const script = `
As the Speech Evaluator, I provide constructive feedback on prepared speeches. I highlight strengths, identify areas for improvement, and help speakers grow. My evaluation balances positive reinforcement with actionable suggestions for development.
`;

const SpeechEvaluator = () => {
  const [data, setData] = useLocalStorage<SpeechEvaluatorData>('speechEvaluatorData', {
    speakerName: '',
    speechTitle: '',
    pathwayProject: '',
    wentWell: '',
    couldBeBetter: '',
    bestThing: '',
    checkboxes: {
      vocalVariety: false,
      bodyLanguage: false,
      pauses: false,
      audienceAwareness: false,
      callToAction: false,
      ruleOfThree: false,
      examplesAnalogies: false,
      contentStructure: false,
      dialog: false,
      firstLineLastLine: false
    }
  });

  const updateField = (field: keyof Omit<SpeechEvaluatorData, 'checkboxes'>, value: string) => {
    setData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateCheckbox = (field: keyof SpeechEvaluatorData['checkboxes'], value: boolean) => {
    setData(prev => ({
      ...prev,
      checkboxes: {
        ...prev.checkboxes,
        [field]: value
      }
    }));
  };

  const checkboxItems = [
    { key: 'vocalVariety' as const, label: 'Vocal Variety' },
    { key: 'bodyLanguage' as const, label: 'Body Language' },
    { key: 'pauses' as const, label: 'Pauses' },
    { key: 'audienceAwareness' as const, label: 'Audience Awareness' },
    { key: 'callToAction' as const, label: 'Call to Action' },
    { key: 'ruleOfThree' as const, label: 'Rule of Three' },
    { key: 'examplesAnalogies' as const, label: 'Examples/Analogies' },
    { key: 'contentStructure' as const, label: 'Content Structure' },
    { key: 'dialog' as const, label: 'Dialogue (Role Play)' },
    { key: 'firstLineLastLine' as const, label: 'First Line-Last Line' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="speech-evaluator-page">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-card-foreground font-serif">
            Speech Evaluator Role
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
            Speech Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="speakerName" className="text-sm font-medium text-card-foreground mb-2">
              Speaker Name
            </Label>
            <Input
              id="speakerName"
              value={data.speakerName}
              onChange={(e) => updateField('speakerName', e.target.value)}
              placeholder="Enter speaker name..."
              data-testid="input-speaker-name"
            />
          </div>
          <div>
            <Label htmlFor="speechTitle" className="text-sm font-medium text-card-foreground mb-2">
              Speech Title
            </Label>
            <Input
              id="speechTitle"
              value={data.speechTitle}
              onChange={(e) => updateField('speechTitle', e.target.value)}
              placeholder="Enter speech title..."
              data-testid="input-speech-title"
            />
          </div>
          <div>
            <Label htmlFor="pathwayProject" className="text-sm font-medium text-card-foreground mb-2">
              Pathway Project
            </Label>
            <Input
              id="pathwayProject"
              value={data.pathwayProject}
              onChange={(e) => updateField('pathwayProject', e.target.value)}
              placeholder="Enter pathway project..."
              data-testid="input-pathway-project"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-card-foreground">
            What to Look For
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="checklist-container">
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
                  className="text-card-foreground cursor-pointer"
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
          <CardTitle className="text-lg font-semibold text-card-foreground">
            What Went Well
          </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={data.wentWell}
              onChange={(e) => updateField('wentWell', e.target.value)}
              rows={4}
              placeholder="Describe what the speaker did well..."
              data-testid="textarea-went-well"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
          <CardTitle className="text-lg font-semibold text-card-foreground">
            What Could Have Been Better
          </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={data.couldBeBetter}
              onChange={(e) => updateField('couldBeBetter', e.target.value)}
              rows={4}
              placeholder="Suggest areas for improvement..."
              data-testid="textarea-could-be-better"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
          <CardTitle className="text-lg font-semibold text-card-foreground">
            Best Thing About the Speech
          </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={data.bestThing}
              onChange={(e) => updateField('bestThing', e.target.value)}
              rows={4}
              placeholder="What was the most impactful or memorable aspect..."
              data-testid="textarea-best-thing"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SpeechEvaluator;

