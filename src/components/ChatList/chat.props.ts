export interface IChatItem {
  onClick?: () => void;
  onDelete: () => void;
  title: string;
  count?: number;
  time: Date;
  selected: boolean;
  id: string;
  index: number;
}
