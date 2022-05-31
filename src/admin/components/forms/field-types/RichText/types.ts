import { BaseEditor, Selection } from 'slate';
import { RichTextField } from '../../../../../fields/config/types';

export type Props = Omit<RichTextField, 'type'> & {
  path?: string
  addComment: (name: string) => (evt: React.MouseEvent<HTMLButtonElement>) => void
}

export interface BlurSelectionEditor extends BaseEditor {
  blurSelection?: Selection
}
