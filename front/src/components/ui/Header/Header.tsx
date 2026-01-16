import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft } from '@gravity-ui/icons';
import { Button, Flex, Icon, Text } from '@gravity-ui/uikit';
import { useMitt, ViewPageData } from '@/context/shared/eventBus';

export const Header = () => {
  const mitt = useMitt();
  const [pageData, setPageData] = useState<ViewPageData | undefined>();

  const navigate = useNavigate();

  useEffect(() => {
    const pageDataChange = (data: ViewPageData) => {
      setPageData(data);
    };

    mitt.on('pageData', pageDataChange);
    return () => mitt.off('pageData', pageDataChange);
  }, []);

  return (
    <div className="header">
      <Flex
        gap={2}
        justifyContent="space-between"
        alignItems="center"
        style={{ minHeight: 44 }}
      >
        {!!pageData?.backLink && (
          <Button
            size="xl"
            view="flat"
            onClick={() => navigate(pageData.backLink)}
          >
            <Icon data={ArrowLeft} size={24} />
          </Button>
        )}
        <Text variant="header-2">{pageData?.title}</Text>
      </Flex>
    </div>
  );
};
