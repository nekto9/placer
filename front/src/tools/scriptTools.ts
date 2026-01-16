export const connectScript = ({
  src,
  id,
  onload,
}: {
  src: string;
  id: string;
  onload?: () => void;
}) => {
  const script = document.getElementById(id);
  if (!script) {
    const node = document.getElementsByTagName(
      'script'
    )[0] as HTMLScriptElement;

    const s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = src;
    s.async = true;
    s.id = id;

    s.onload = onload;

    const parent = node.parentNode as HTMLElement;
    parent.insertBefore(s, node);

    return s as HTMLElement;
  } else {
    return script;
  }
};
