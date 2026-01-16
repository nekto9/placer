import { useSelector } from 'react-redux';
import { Tooltip, TooltipProps } from '@gravity-ui/uikit';
import { isDesktop } from '@/store/slices/viewportSlice';

export const TooltipWrap = (props: TooltipProps) => {
  const isDesktopMode = useSelector(isDesktop);

  return isDesktopMode ? (
    <Tooltip {...props}>{props.children}</Tooltip>
  ) : (
    <>{props.children}</>
  );
};
