import { Card, Text } from '@gravity-ui/uikit';

interface CardListProps {
  listItems: React.ReactNode[];
  header: string;
}

export const CardList = (props: CardListProps) => {
  return (
    <Card
      className="card-list g-s__py_3 g-s__px_4 g-s__mb_2"
      view="outlined"
      theme="normal"
    >
      <Text variant="subheader-2" as="div">
        {props.header}
      </Text>

      {props.listItems.map((item, key) => (
        <div key={key} className="card-list__item  g-s__py_2">
          {item}
        </div>
      ))}
    </Card>
  );
};
