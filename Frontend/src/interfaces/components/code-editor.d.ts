export interface CodeEditorProps {
  code: string;
  language: string;
  onCodeChange: (newCode: string | undefined) => void;
  output: string;
  loading: boolean;
  onExecute: () => void;
}
