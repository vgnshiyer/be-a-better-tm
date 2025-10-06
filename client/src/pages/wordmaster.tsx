import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useToast } from "@/hooks/use-toast";

interface WordmasterData {
  word: string;
  meaning: string;
  example: string;
}

const Wordmaster = () => {
  const { toast } = useToast();
  const [data, setData] = useLocalStorage<WordmasterData>('wordmasterData', {
    word: '',
    meaning: '',
    example: ''
  });

  const updateField = (field: keyof WordmasterData, value: string) => {
    setData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveWord = () => {
    if (!data.word.trim()) {
      toast({
        title: "Word Required",
        description: "Please enter a word of the day.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Word Saved",
      description: "Word of the day has been saved successfully."
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="wordmaster-page">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-foreground font-serif">
            Wordmaster Role
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            As the Wordmaster, you introduce a new word for the meeting participants to use in their speeches and conversations. This helps expand vocabulary and encourages creative word usage.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-foreground">
              Word Setup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="wordOfDay" className="text-sm font-medium text-foreground mb-2">
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
              <Label htmlFor="wordMeaning" className="text-sm font-medium text-foreground mb-2">
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
              <Label htmlFor="wordExample" className="text-sm font-medium text-foreground mb-2">
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
            <Button 
              onClick={saveWord} 
              className="w-full"
              data-testid="button-save-word"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Word
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/20 to-accent/20">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-foreground font-serif">
              Meeting Display
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm uppercase tracking-wide text-muted-foreground mb-2">
                Word of the Day
              </div>
              <div 
                className="text-4xl font-bold text-foreground mb-4"
                data-testid="display-word"
              >
                {data.word || '-'}
              </div>
            </div>
            <div>
              <div className="text-sm uppercase tracking-wide text-muted-foreground mb-2">
                Meaning
              </div>
              <div 
                className="text-lg text-foreground mb-4"
                data-testid="display-meaning"
              >
                {data.meaning || '-'}
              </div>
            </div>
            <div>
              <div className="text-sm uppercase tracking-wide text-muted-foreground mb-2">
                Example
              </div>
              <div 
                className="text-base text-foreground italic"
                data-testid="display-example"
              >
                {data.example || '-'}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Wordmaster;
