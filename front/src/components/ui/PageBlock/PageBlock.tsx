import { Card, Text } from '@gravity-ui/uikit';

interface PageBlockProps {
  children: React.ReactNode;
  header?: string;
  isCard?: boolean;
}
export const PageBlock = (props: PageBlockProps) => (
  <div className="g-s__py_2">
    {!!props.header && (
      <Text variant="header-1" as="div" className="g-s__mb_2">
        {props.header}
      </Text>
    )}
    {props.isCard ? (
      <Card className="g-s__p_4">{props.children}</Card>
    ) : (
      props.children
    )}
  </div>
);
